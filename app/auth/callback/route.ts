import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code        = searchParams.get("code");
  const next        = searchParams.get("next") ?? "/dashboard";
  const appCallback = searchParams.get("app_callback"); // e.g. "voeez://auth/callback"

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // If this is an app login, redirect back to the Mac app with tokens
      if (appCallback?.startsWith("voeez://")) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const appUrl = `${appCallback}?access_token=${session.access_token}&refresh_token=${session.refresh_token}`;
          return NextResponse.redirect(appUrl);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
