import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_FEEDBACK_LENGTH = 5000;

// POST: Submit feedback from the web dashboard (cookie-based auth)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Nicht authentifiziert." }, { status: 401 });
    }

    let body: { text?: string; category?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Ungültiger JSON-Body." }, { status: 400 });
    }

    const text = (body.text ?? "").trim();
    if (!text) {
      return NextResponse.json({ error: "Feedback-Text ist erforderlich." }, { status: 400 });
    }
    if (text.length > MAX_FEEDBACK_LENGTH) {
      return NextResponse.json(
        { error: "Feedback zu lang (max. 5000 Zeichen)." },
        { status: 422 }
      );
    }

    const category = (body.category ?? "general").trim();

    // Save to Supabase
    const { error: insertError } = await supabase
      .from("feedback")
      .insert({ user_id: user.id, email: user.email ?? null, text: `[${category}] ${text}` });

    if (insertError) {
      console.warn("[Feedback Web] DB insert failed:", insertError.message);
      // Don't fail — still try to send email
    }

    // Send email via Resend
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
          subject: `🪿 Web-Feedback [${category}] von ${user.email ?? "anonymem Nutzer"}`,
          html: `
            <h2 style="color:#3B82F6;">Neues Beta-Feedback (Web Dashboard) 🪿</h2>
            <table style="border-collapse:collapse;margin-bottom:16px;">
              <tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;">Von</td><td style="font-size:13px;">${user.email ?? "unbekannt"}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;">Kategorie</td><td style="font-size:13px;">${category}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;">User ID</td><td style="font-size:13px;font-family:monospace;">${user.id}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;">Datum</td><td style="font-size:13px;">${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
            <p style="font-size:16px;line-height:1.6;white-space:pre-wrap;">${safeText}</p>
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
            <p style="color:#aaa;font-size:11px;">Gesendet über das voeez Web Dashboard</p>
          `,
        }),
      });
      if (!resendRes.ok) {
        const resendError = await resendRes.text();
        console.error("[Feedback Web] Resend error:", resendRes.status, resendError);
      }
    } else {
      console.warn("[Feedback Web] RESEND_API_KEY not set — email skipped.");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Feedback Web] Unexpected error:", error);
    return NextResponse.json({ error: "Interner Serverfehler." }, { status: 500 });
  }
}
