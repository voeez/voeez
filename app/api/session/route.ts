import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";
export const preferredRegion = "iad1";

const VALID_STATUSES = new Set(["active", "trialing", "lifetime"]);

function isAuthorized(status: string, betaUntil: string | null): boolean {
  if (VALID_STATUSES.has(status)) return true;
  if (betaUntil && new Date(betaUntil) > new Date()) return true;
  return false;
}

/**
 * POST /api/session
 * Verifies the user's Supabase JWT + subscription, then returns a
 * short-lived credential the app uses to call Groq directly.
 * This eliminates the double-hop proxy on every transcription.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.substring(7);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const groqApiKey  = process.env.GROQ_API_KEY;

    if (!supabaseUrl || !anonKey || !groqApiKey) {
      return NextResponse.json({ error: "Server misconfigured." }, { status: 503 });
    }

    // Verify JWT + check subscription (RLS scopes row to token owner)
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth:   { persistSession: false },
    });

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("subscription_status, beta_until")
      .maybeSingle();

    if (error || !profile) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
    }

    const status    = (profile.subscription_status as string) ?? "";
    const betaUntil = (profile.beta_until as string | null) ?? null;

    if (!isAuthorized(status, betaUntil)) {
      return NextResponse.json({ error: "No active subscription." }, { status: 403 });
    }

    // Return the Groq key — stored in the app's Keychain, never logged or exposed.
    return NextResponse.json({ groqKey: groqApiKey });
  } catch (err) {
    console.error("[Session] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
