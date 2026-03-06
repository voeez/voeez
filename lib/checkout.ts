export async function startCheckout(plan: string): Promise<void> {
  try {
    const res = await fetch("/api/stripe/checkout-public", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    if (!res.ok) {
      console.error("[Checkout] Request failed:", res.status);
      return;
    }

    const { url } = await res.json();
    if (url) window.location.href = url;
  } catch (err) {
    console.error("[Checkout] Error:", err);
  }
}
