import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe | null {
  if (stripeInstance) return stripeInstance;

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    console.warn(
      "[Voeez] Missing STRIPE_SECRET_KEY. Stripe will not work until this is set."
    );
    return null;
  }

  stripeInstance = new Stripe(secretKey, {
    typescript: true,
  });

  return stripeInstance;
}

export const stripe = getStripe();

// Price IDs from environment variables
export const PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || "",
  yearly: process.env.STRIPE_PRICE_YEARLY || "",
  lifetime: process.env.STRIPE_PRICE_LIFETIME || "",
} as const;

export type PlanInterval = keyof typeof PRICES;
