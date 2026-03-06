import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICES, type PlanInterval } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe ist nicht konfiguriert." },
        { status: 503 }
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

    const isLifetime = plan === "lifetime";
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: isLifetime ? "payment" : "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/checkout/success`,
      cancel_url: `${siteUrl}/#pricing`,
      metadata: { plan },
      ...(isLifetime
        ? {}
        : {
            subscription_data: {
              trial_period_days: 7,
              metadata: { plan },
            },
            payment_method_collection: "always",
          }),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[Public Checkout] Error:", error);
    return NextResponse.json(
      { error: "Checkout konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}
