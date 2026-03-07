"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { startCheckout } from "@/lib/checkout";
import { isBetaMode } from "@/lib/betaMode";

export default function MidCTA() {
  return (
    <section className="relative overflow-hidden py-14">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-light via-blue-50 to-indigo-50" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-full w-1/3 rounded-l-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-xl font-bold text-foreground sm:text-2xl">
              Bereit, 2+ Stunden pro Woche zurückzugewinnen?
            </p>
            <p className="mt-1 text-sm text-muted">
              {isBetaMode ? "Kostenlos in der Beta. Kein Risiko." : "Keine Kreditkarte nötig. 7 Tage gratis."}
            </p>
          </div>
          {isBetaMode ? (
            <Link
              href="/signup"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-primary/30"
            >
              Jetzt loslegen
              <ArrowRight size={18} />
            </Link>
          ) : (
            <button
              onClick={() => startCheckout("yearly")}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-primary/30"
            >
              Jetzt loslegen
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
