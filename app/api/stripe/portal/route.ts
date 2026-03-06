import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe ist nicht konfiguriert." },
        { status: 503 }
      );
    }

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

    // Get Stripe customer ID from profile
    let stripeCustomerId: string | null = null;
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_customer_id")
        .eq("id", user.id)
        .single();
      stripeCustomerId = profile?.stripe_customer_id || null;
    } catch {
      // Table may not exist
    }

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "Kein Stripe-Kunde gefunden. Bitte zuerst ein Abo abschließen." },
        { status: 404 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${request.nextUrl.origin}/dashboard/abo`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[Stripe Portal] Error:", error);
    return NextResponse.json(
      { error: "Portal konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}
