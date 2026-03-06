import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

// Use the service role key for webhook processing (bypasses RLS)
function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.warn(
      "[Voeez Webhook] Missing Supabase URL or service role key."
    );
    return null;
  }

  return createClient(url, serviceKey);
}

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe ist nicht konfiguriert." },
        { status: 503 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.warn("[Voeez Webhook] Missing STRIPE_WEBHOOK_SECRET.");
      return NextResponse.json(
        { error: "Webhook-Secret nicht konfiguriert." },
        { status: 503 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Keine Stripe-Signatur." },
        { status: 400 }
      );
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("[Voeez Webhook] Signatur-Verifikation fehlgeschlagen:", err);
      return NextResponse.json(
        { error: "Ungültige Signatur." },
        { status: 400 }
      );
    }

    const adminSupabase = getAdminSupabase();
    if (!adminSupabase) {
      return NextResponse.json(
        { error: "Supabase Admin-Client nicht verfügbar." },
        { status: 503 }
      );
    }

    // Validate plan value against known plans to prevent metadata injection
    const VALID_PLANS = ["monthly", "yearly", "lifetime"] as const;
    type ValidPlan = typeof VALID_PLANS[number];
    function validatePlan(raw: string | undefined | null): ValidPlan {
      return VALID_PLANS.includes(raw as ValidPlan) ? (raw as ValidPlan) : "monthly";
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const plan = validatePlan(session.metadata?.plan);

        // --- Resolve Supabase user ---
        // Flow A (logged-in checkout): supabase_user_id in metadata
        // Flow B (public/trial checkout): no user yet → create from email
        let resolvedUserId: string | undefined = session.metadata?.supabase_user_id;

        if (!resolvedUserId) {
          const email = session.customer_details?.email;
          if (!email) break;

          // Check if we already know this Stripe customer
          const { data: existingProfile } = await adminSupabase
            .from("profiles")
            .select("id")
            .eq("stripe_customer_id", session.customer as string)
            .maybeSingle();

          if (existingProfile?.id) {
            resolvedUserId = existingProfile.id;
          } else {
            // New customer → invite via Supabase (sends "set your password" email)
            try {
              const { data: invited } = await adminSupabase.auth.admin.inviteUserByEmail(
                email,
                { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard` }
              );
              resolvedUserId = invited?.user?.id;
            } catch {
              // User already exists with this email — find via targeted paginated search
              // Avoids loading all users into memory
              let found = false;
              let page = 1;
              while (!found) {
                const { data: { users }, error } = await adminSupabase.auth.admin.listUsers({ page, perPage: 200 });
                if (error || !users?.length) break;
                const match = users.find((u) => u.email === email);
                if (match) { resolvedUserId = match.id; found = true; break; }
                if (users.length < 200) break; // last page
                page++;
              }
            }
          }
        }

        if (!resolvedUserId) break;

        // Determine subscription status (trialing vs active)
        let finalStatus = plan === "lifetime" ? "lifetime" : "active";
        if (session.subscription) {
          try {
            const sub = await stripe.subscriptions.retrieve(session.subscription as string);
            if (sub.status === "trialing") finalStatus = "trialing";
          } catch {
            // best-effort
          }
        }

        const updateData: Record<string, string | null> = {
          subscription_status: finalStatus,
          subscription_plan: plan,
          updated_at: new Date().toISOString(),
        };
        if (session.subscription) {
          updateData.stripe_subscription_id = session.subscription as string;
        }
        if (session.customer) {
          updateData.stripe_customer_id = session.customer as string;
        }

        await adminSupabase
          .from("profiles")
          .upsert({ id: resolvedUserId, ...updateData });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        const { data: profile } = await adminSupabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          const newStatus =
            subscription.status === "active" ? "active"
            : subscription.status === "trialing" ? "trialing"
            : subscription.status === "past_due" ? "past_due"
            : "cancelled";

          await adminSupabase.from("profiles").update({
            subscription_status: newStatus,
            updated_at: new Date().toISOString(),
          }).eq("id", profile.id);
        }
        break;
      }

      case "customer.subscription.trial_will_end": {
        // Fires 3 days before trial ends — placeholder for e-mail reminder
        const subscription = event.data.object;
        console.log(`[Voeez Webhook] trial_will_end for customer ${subscription.customer}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        const { data: profile } = await adminSupabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          await adminSupabase.from("profiles").update({
            subscription_status: "cancelled",
            subscription_plan: null,
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          }).eq("id", profile.id);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        const { data: profile } = await adminSupabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          await adminSupabase.from("profiles").update({
            subscription_status: "past_due",
            updated_at: new Date().toISOString(),
          }).eq("id", profile.id);
        }
        break;
      }

      default:
        // Unhandled event type
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Voeez Webhook] Error:", error);
    return NextResponse.json(
      { error: "Webhook-Verarbeitung fehlgeschlagen." },
      { status: 500 }
    );
  }
}
