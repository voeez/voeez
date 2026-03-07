/**
 * Beta-Modus Toggle
 *
 * true  → Kostenlose Beta, keine Preise anzeigen, CTAs → /signup
 * false → Normaler Betrieb, Preispläne + Stripe Checkout aktiv
 *
 * Umschalten: NEXT_PUBLIC_BETA_MODE in Vercel env vars auf "false" setzen + redeploy
 */
export const isBetaMode = process.env.NEXT_PUBLIC_BETA_MODE === "true";
