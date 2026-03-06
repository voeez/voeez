import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface StatsPayload {
  total_words: number;
  total_transcriptions: number;
  time_saved_minutes: number;
  longest_transcription_words?: number;
  goose_stage?: string;
  feathers?: number;
  days_used?: number;
}

// POST: Upsert stats from macOS app
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht authentifiziert." },
        { status: 401 }
      );
    }

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

    try {
      const { data, error } = await supabase
        .from("user_stats")
        .upsert(
          {
            user_id: user.id,
            total_words: body.total_words,
            total_transcriptions: body.total_transcriptions,
            time_saved_minutes: body.time_saved_minutes,
            longest_transcription_words: body.longest_transcription_words ?? 0,
            goose_stage: body.goose_stage ?? "Egg",
            feathers: body.feathers ?? 0,
            days_used: body.days_used ?? 0,
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
    const supabase = await createClient();
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
