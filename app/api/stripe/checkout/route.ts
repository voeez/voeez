import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICES, type PlanInterval } from "@/lib/stripe";
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

    const body = await request.json();
    const plan = body.plan as PlanInterval;

    if (!plan || !PRICES[plan]) {
      return NextResponse.json(
        { error: "Ungültiger Plan." },
        { status: 400 }
      );
    }

    const priceId = PRICES[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: "Preis-ID für diesen Plan ist nicht konfiguriert." },
        { status: 503 }
      );
    }

    // Check if user already has a Stripe customer ID
    let stripeCustomerId: string | undefined;
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_customer_id")
        .eq("id", user.id)
        .single();
      stripeCustomerId = profile?.stripe_customer_id;
    } catch {
      // profiles table may not exist yet
    }

    // Create a Stripe customer if none exists
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      stripeCustomerId = customer.id;

      // Save customer ID to profiles
      try {
        await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            stripe_customer_id: stripeCustomerId,
            updated_at: new Date().toISOString(),
          });
      } catch {
        // Table may not exist — continue anyway
      }
    }

    // Determine if this is a one-time payment (lifetime) or subscription
    const isLifetime = plan === "lifetime";

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: isLifetime ? "payment" : "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/dashboard?checkout=success`,
      cancel_url: `${request.nextUrl.origin}/dashboard?checkout=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[Stripe Checkout] Error:", error);
    return NextResponse.json(
      { error: "Checkout konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}
