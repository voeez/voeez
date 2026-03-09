import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { posthogServer } from "@/lib/posthog-server";

// Groq accepts up to 25 MB — we cap at 24 MB to leave a margin
const MAX_AUDIO_BYTES = 24 * 1024 * 1024;

const VALID_STATUSES = new Set(["active", "trialing", "lifetime"]);

export async function POST(request: NextRequest) {
  try {
    // ── 1. Auth via Bearer token (sent by macOS app) ──────────────────────────
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.substring(7);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const groqApiKey  = process.env.GROQ_API_KEY;

    if (!supabaseUrl || !anonKey) {
      console.error("[Transcribe] Missing Supabase env vars.");
      return NextResponse.json({ error: "Server misconfigured." }, { status: 503 });
    }
    if (!groqApiKey) {
      console.error("[Transcribe] GROQ_API_KEY not set.");
      return NextResponse.json({ error: "Server misconfigured." }, { status: 503 });
    }

    // ── 2. Auth + subscription in one DB call ─────────────────────────────────
    // The user's JWT is forwarded directly. PostgREST validates it server-side
    // and RLS (`auth.uid() = id`) scopes the row to the token owner —
    // so no separate auth.getUser() round-trip is needed.
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth:   { persistSession: false },
    });

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, subscription_status")
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
    }

    const userId = profile.id as string;

    if (!VALID_STATUSES.has(profile.subscription_status ?? "")) {
      return NextResponse.json({ error: "No active subscription." }, { status: 403 });
    }

    // ── 3. Parse multipart audio ──────────────────────────────────────────────
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: "Invalid multipart body." }, { status: 400 });
    }

    const file = formData.get("file");
    const language = formData.get("language") as string | null;

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Audio file required." }, { status: 400 });
    }
    if (file.size > MAX_AUDIO_BYTES) {
      return NextResponse.json({ error: "Audio file too large (max 24 MB)." }, { status: 413 });
    }

    // ── 4. Forward to Groq ────────────────────────────────────────────────────
    const groqForm = new FormData();
    groqForm.append("file", file, "audio.wav");
    groqForm.append("model", "whisper-large-v3-turbo");
    groqForm.append("response_format", "verbose_json");
    groqForm.append("temperature", "0.0");
    if (language && language.trim()) groqForm.append("language", language.trim());

    const t0 = Date.now();
    const groqRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${groqApiKey}` },
      body: groqForm,
    });
    const latency = (Date.now() - t0) / 1000;

    if (!groqRes.ok) {
      const errBody = await groqRes.text();
      console.error("[Transcribe] Groq error:", groqRes.status, errBody);

      // Track failed transcription
      posthogServer.capture({
        distinctId: userId,
        event: "$ai_generation",
        properties: {
          $ai_provider: "groq",
          $ai_model: "whisper-large-v3-turbo",
          $ai_latency: latency,
          $ai_error: `Groq error ${groqRes.status}`,
          transcription_language: (language ?? "auto"),
          audio_size_bytes: file.size,
        },
      });

      return NextResponse.json(
        { error: `Groq error ${groqRes.status}` },
        { status: 502 }
      );
    }

    const groqData = await groqRes.json();
    const text = ((groqData.text as string) ?? "").trim();

    // ── 5. Track in PostHog ───────────────────────────────────────────────────
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    posthogServer.capture({
      distinctId: userId,
      event: "$ai_generation",
      properties: {
        $ai_provider: "groq",
        $ai_model: "whisper-large-v3-turbo",
        $ai_latency: latency,
        transcription_language: (language ?? "auto"),
        audio_size_bytes: file.size,
        output_word_count: wordCount,
        // Whisper doesn't return token counts, so omit $ai_input_tokens
      },
    });

    return NextResponse.json({ text });
  } catch (error) {
    console.error("[Transcribe] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
