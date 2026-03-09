import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Max feedback length (prevent spam / huge payloads)
const MAX_FEEDBACK_LENGTH = 5000;

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

    if (!supabaseUrl || !serviceKey) {
      console.error("[Feedback] Missing Supabase env vars.");
      return NextResponse.json({ error: "Server misconfigured." }, { status: 503 });
    }

    // Use service-role client so we can verify the user token
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
    }

    // ── 2. Parse + validate body ───────────────────────────────────────────────
    let body: { text?: string; category?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const text = (body.text ?? "").trim();
    if (!text) {
      return NextResponse.json({ error: "Feedback text is required." }, { status: 400 });
    }
    if (text.length > MAX_FEEDBACK_LENGTH) {
      return NextResponse.json({ error: "Feedback too long (max 5000 chars)." }, { status: 422 });
    }

    const category = (body.category ?? "general").trim();

    // ── 3. Save to Supabase ────────────────────────────────────────────────────
    const { error: insertError } = await supabase
      .from("feedback")
      .insert({ user_id: user.id, email: user.email ?? null, text: `[${category}] ${text}` });

    if (insertError) {
      // Table might not exist yet — still send the email, don't break the UX
      console.warn("[Feedback] DB insert failed:", insertError.message);
    }

    // ── 4. Send email via Resend ───────────────────────────────────────────────
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const safeText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "voeez Feedback <no-reply@noreply.voeez.com>",
          to: ["hello@voeez.com"],
          subject: `🪿 Feedback [${category}] von ${user.email ?? "anonymem Nutzer"}`,
          html: `
            <h2 style="color:#3B82F6;">Neues Beta-Feedback 🪿</h2>
            <table style="border-collapse:collapse;margin-bottom:16px;">
              <tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;">Von</td><td style="font-size:13px;">${user.email ?? "unbekannt"}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;">Kategorie</td><td style="font-size:13px;">${category}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;">User ID</td><td style="font-size:13px;font-family:monospace;">${user.id}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;">Datum</td><td style="font-size:13px;">${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
            <p style="font-size:16px;line-height:1.6;white-space:pre-wrap;">${safeText}</p>
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
            <p style="color:#aaa;font-size:11px;">Gesendet über die voeez macOS App</p>
          `,
        }),
      });
      if (!resendRes.ok) {
        const resendError = await resendRes.text();
        console.error("[Feedback] Resend error:", resendRes.status, resendError);
      }
    } else {
      console.warn("[Feedback] RESEND_API_KEY not set — email skipped.");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Feedback] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
