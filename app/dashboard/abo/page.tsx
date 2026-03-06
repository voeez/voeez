"use client";

import { useState } from "react";
import { Crown, ArrowUpRight, Shield } from "lucide-react";

export default function AboPage() {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("[Abo] Portal error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Abo verwalten</h1>
        <p className="mt-1 text-muted">Plan, Rechnungen und Zahlungsmethode.</p>
      </div>

      {/* Manage via Stripe Portal */}
      <div className="rounded-2xl border border-border/50 bg-surface p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Crown className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Abo & Rechnungen</p>
            <p className="text-sm text-muted">
              Plan ändern, kündigen, Zahlungsmethode aktualisieren
            </p>
          </div>
        </div>
        <button
          onClick={openPortal}
          disabled={loading}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? "Wird geöffnet…" : "Im Stripe Portal öffnen"}
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Guarantee */}
      <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-surface px-6 py-4">
        <Shield className="h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm text-muted">
          <span className="font-semibold text-foreground">30-Tage Garantie</span>{" "}
          — Wenn voeez nichts für dich ist, erstatten wir dir jeden Cent.
        </p>
      </div>
    </div>
  );
}
