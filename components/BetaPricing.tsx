"use client";

import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import Image from "next/image";

const betaFeatures = [
  "Unbegrenzte Transkriptionen",
  "Diktiere direkt in jede App",
  "14+ Sprachen & Übersetzung",
  "Gamification & Gans-Skins",
  "Alle Features inklusive",
];

export default function BetaPricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <ScrollReveal>
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                Kostenlose Beta
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Jetzt kostenlos loslegen
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              Voeez ist aktuell in der Beta — komplett kostenlos für{" "}
              <span className="font-semibold text-foreground">30 Tage</span>.
              Keine Kreditkarte, kein Abo.
            </p>
          </div>
        </ScrollReveal>

        {/* Beta Card */}
        <ScrollReveal delay={100}>
          <div className="relative mx-auto max-w-lg">

            {/* Goose — outside the card, overlapping the right edge (desktop) */}
            <div className="pointer-events-none absolute -right-12 bottom-8 z-20 hidden lg:block">
              <Image
                src="/images/goose-pricing.png"
                alt=""
                width={148}
                height={148}
                className="opacity-90 drop-shadow-lg"
              />
            </div>

            <div className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-surface p-8 shadow-xl shadow-primary/10">

              {/* Glow */}
              <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative z-10">
                {/* Badge */}
                <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  🎉 Beta · 30 Tage gratis
                </div>

                {/* Price */}
                <div className="mb-6 flex items-end gap-2">
                  <span className="text-6xl font-extrabold text-foreground">0€</span>
                  <span className="mb-2 text-muted">/ Monat</span>
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-3">
                  {betaFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                        <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />
                      </div>
                      <span className="text-sm text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:brightness-110 hover:scale-[1.02]"
                >
                  Jetzt kostenlos registrieren
                  <ArrowRight size={18} />
                </Link>

                <p className="mt-4 text-center text-xs text-muted">
                  Keine Kreditkarte · Kein Risiko · macOS 14+
                </p>
              </div>
            </div>
          </div>

          {/* Goose — mobile: centered below card */}
          <div className="mt-6 flex justify-center lg:hidden pointer-events-none">
            <Image
              src="/images/goose-pricing.png"
              alt=""
              width={110}
              height={110}
              className="opacity-90 drop-shadow-lg"
              style={{ animation: "float 4s ease-in-out infinite" }}
            />
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
