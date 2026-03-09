import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { posthogServer } from "@/lib/posthog-server";

const VALID_STATUSES = new Set(["active", "trialing", "lifetime"]);

const LANGUAGE_NAMES: Record<string, string> = {
  de: "German",
  en: "English",
  fr: "French",
  es: "Spanish",
  it: "Italian",
  pt: "Portuguese",
  nl: "Dutch",
  pl: "Polish",
  ja: "Japanese",
  zh: "Chinese",
  ko: "Korean",
  ru: "Russian",
  ar: "Arabic",
  tr: "Turkish",
};

export async function POST(request: NextRequest) {
  try {
    // ── 1. Auth via Bearer token (sent by macOS app) ──────────────────────────
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.substring(7);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const groqApiKey  = process.env.GROQ_API_KEY;

    if (!supabaseUrl || !serviceKey) {
      console.error("[Translate] Missing Supabase env vars.");
      return NextResponse.json({ error: "Server misconfigured." }, { status: 503 });
    }
    if (!groqApiKey) {
      console.error("[Translate] GROQ_API_KEY not set.");
      return NextResponse.json({ error: "Server misconfigured." }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
    }

    // ── 2. Subscription check ─────────────────────────────────────────────────
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || !VALID_STATUSES.has(profile.subscription_status ?? "")) {
      return NextResponse.json({ error: "No active subscription." }, { status: 403 });
    }

    // ── 3. Parse body ─────────────────────────────────────────────────────────
    let body: { text?: string; targetLanguage?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const text = (body.text ?? "").trim();
    const targetLanguage = (body.targetLanguage ?? "").trim();

    if (!text) {
      return NextResponse.json({ error: "text is required." }, { status: 400 });
    }
    if (!targetLanguage) {
      return NextResponse.json({ error: "targetLanguage is required." }, { status: 400 });
    }

    // ── 4. Forward to Groq LLM ────────────────────────────────────────────────
    const targetName = LANGUAGE_NAMES[targetLanguage] ?? targetLanguage;
    const systemPrompt = `You are a translator. Translate the following text to ${targetName}. Output ONLY the translated text, nothing else. Preserve the original formatting and punctuation style.`;

    const t0 = Date.now();
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        temperature: 0.3,
      }),
    });
    const latency = (Date.now() - t0) / 1000;

    if (!groqRes.ok) {
      const errBody = await groqRes.text();
      console.error("[Translate] Groq error:", groqRes.status, errBody);

      // Track failed translation
      posthogServer.capture({
        distinctId: user.id,
        event: "$ai_generation",
        properties: {
          $ai_provider: "groq",
          $ai_model: "llama-3.3-70b-versatile",
          $ai_latency: latency,
          $ai_error: `Groq error ${groqRes.status}`,
          target_language: targetLanguage,
        },
      });

      return NextResponse.json(
        { error: `Groq error ${groqRes.status}` },
        { status: 502 }
      );
    }

    const groqData = await groqRes.json();
    const translated = (
      (groqData.choices?.[0]?.message?.content as string) ?? ""
    ).trim();

    // ── 5. Track in PostHog ───────────────────────────────────────────────────
    // NOTE: We deliberately send ONLY metadata — never the actual user content.
    // Sending $ai_input / $ai_output_choices would transmit the user's dictated
    // text to PostHog, which is personal data and not permitted under DSGVO.
    posthogServer.capture({
      distinctId: user.id,
      event: "$ai_generation",
      properties: {
        $ai_provider: "groq",
        $ai_model: "llama-3.3-70b-versatile",
        $ai_latency: latency,
        $ai_input_tokens: groqData.usage?.prompt_tokens ?? null,
        $ai_output_tokens: groqData.usage?.completion_tokens ?? null,
        target_language: targetLanguage,
        input_word_count: text.split(/\s+/).filter(Boolean).length,
      },
    });

    return NextResponse.json({ text: translated });
  } catch (error) {
    console.error("[Translate] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
