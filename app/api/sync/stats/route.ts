import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

interface DailyStatPoint {
  date: string;          // "YYYY-MM-DD"
  words: number;
  minutes: number;
  transcriptions: number;
}

interface StatsPayload {
  total_words: number;
  total_transcriptions: number;
  time_saved_minutes: number;
  longest_transcription_words?: number;
  goose_stage?: string;
  feathers?: number;
  days_used?: number;
  daily_stats?: DailyStatPoint[];
}

// POST: Upsert stats from macOS app (Bearer token auth)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Nicht authentifiziert." }, { status: 401 });
    }
    const token = authHeader.substring(7);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ error: "Server misconfigured." }, { status: 503 });
    }

    // Validate JWT via RLS-scoped profile query (same pattern as /api/transcribe)
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth:   { persistSession: false },
    });

    const { data: profile, error: authError } = await supabase
      .from("profiles")
      .select("id")
      .maybeSingle();

    if (authError || !profile) {
      return NextResponse.json({ error: "Nicht authentifiziert." }, { status: 401 });
    }

    const userId = profile.id as string;

    let body: StatsPayload;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Ungültiger JSON-Body." },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      typeof body.total_words !== "number" ||
      typeof body.total_transcriptions !== "number" ||
      typeof body.time_saved_minutes !== "number"
    ) {
      return NextResponse.json(
        {
          error:
            "Fehlende Pflichtfelder: total_words, total_transcriptions, time_saved_minutes.",
        },
        { status: 400 }
      );
    }

    // Bounds checks — prevent absurd or injected values
    const MAX_WORDS          = 10_000_000; // ~10 M words lifetime
    const MAX_TRANSCRIPTIONS = 1_000_000;
    const MAX_TIME_MINUTES   = 100_000;    // ~70 days of saved time
    const MAX_LONGEST_WORDS  = 50_000;
    const MAX_FEATHERS       = 10_000_000;
    const MAX_DAYS_USED      = 36_500;     // 100 years

    if (
      body.total_words < 0           || body.total_words > MAX_WORDS          ||
      body.total_transcriptions < 0  || body.total_transcriptions > MAX_TRANSCRIPTIONS ||
      body.time_saved_minutes < 0    || body.time_saved_minutes > MAX_TIME_MINUTES ||
      !isFinite(body.total_words)    || !isFinite(body.total_transcriptions)  ||
      !isFinite(body.time_saved_minutes)
    ) {
      return NextResponse.json(
        { error: "Statistikwerte außerhalb des gültigen Bereichs." },
        { status: 422 }
      );
    }

    // Clamp optional fields silently
    if (body.longest_transcription_words !== undefined) {
      body.longest_transcription_words = Math.min(Math.max(0, body.longest_transcription_words), MAX_LONGEST_WORDS);
    }
    if (body.feathers !== undefined) {
      body.feathers = Math.min(Math.max(0, body.feathers), MAX_FEATHERS);
    }
    if (body.days_used !== undefined) {
      body.days_used = Math.min(Math.max(0, body.days_used), MAX_DAYS_USED);
    }

    // Validate and sanitize daily_stats if provided
    let dailyStats: DailyStatPoint[] | undefined;
    if (Array.isArray(body.daily_stats)) {
      const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
      dailyStats = body.daily_stats
        .filter(
          (p) =>
            p &&
            typeof p.date === "string" &&
            DATE_RE.test(p.date) &&
            typeof p.words === "number" &&
            typeof p.minutes === "number" &&
            typeof p.transcriptions === "number"
        )
        .slice(0, 365) // hard cap — never store more than 1 year
        .map((p) => ({
          date: p.date,
          words: Math.max(0, Math.min(p.words, 1_000_000)),
          minutes: Math.max(0, Math.min(p.minutes, 10_000)),
          transcriptions: Math.max(0, Math.min(p.transcriptions, 100_000)),
        }));
    }

    try {
      const { data, error } = await supabase
        .from("user_stats")
        .upsert(
          {
            user_id: userId,
            total_words: body.total_words,
            total_transcriptions: body.total_transcriptions,
            time_saved_minutes: body.time_saved_minutes,
            longest_transcription_words: body.longest_transcription_words ?? 0,
            goose_stage: body.goose_stage ?? "Egg",
            feathers: body.feathers ?? 0,
            days_used: body.days_used ?? 0,
            ...(dailyStats !== undefined && { daily_stats: dailyStats }),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        )
        .select()
        .single();

      if (error) {
        console.error("[Stats Sync] Supabase error:", error);
        return NextResponse.json(
          { error: "Statistiken konnten nicht gespeichert werden." },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, stats: data });
    } catch (err) {
      // Table may not exist
      console.warn("[Stats Sync] Table may not exist:", err);
      return NextResponse.json(
        {
          error:
            "user_stats Tabelle nicht verfügbar. Bitte Datenbank einrichten.",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("[Stats Sync] Error:", error);
    return NextResponse.json(
      { error: "Statistik-Sync fehlgeschlagen." },
      { status: 500 }
    );
  }
}

// GET: Return current stats for the authenticated user
export async function GET() {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht authentifiziert." },
        { status: 401 }
      );
    }

    try {
      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        // No stats found yet — return empty defaults
        return NextResponse.json({
          stats: {
            total_words: 0,
            total_transcriptions: 0,
            time_saved_minutes: 0,
            longest_transcription_words: 0,
            goose_stage: "Egg",
            feathers: 0,
            days_used: 0,
          },
        });
      }

      return NextResponse.json({ stats: data });
    } catch {
      return NextResponse.json({
        stats: {
          total_words: 0,
          total_transcriptions: 0,
          time_saved_minutes: 0,
          longest_transcription_words: 0,
          goose_stage: "Egg",
          feathers: 0,
          days_used: 0,
        },
      });
    }
  } catch (error) {
    console.error("[Stats Sync GET] Error:", error);
    return NextResponse.json(
      { error: "Statistiken konnten nicht abgerufen werden." },
      { status: 500 }
    );
  }
}
