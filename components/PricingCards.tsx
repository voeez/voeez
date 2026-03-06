"use client";

import { Check, ArrowRight, Shield, Sparkles } from "lucide-react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { startCheckout } from "@/lib/checkout";

interface Plan {
  name: string;
  planKey: string;
  price: string;
  period: string;
  subtitle: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    name: "Monatlich",
    planKey: "monthly",
    price: "8€",
    period: "/Monat",
    subtitle: "Flexibel. Kündigung jederzeit.",
  },
  {
    name: "Jährlich",
    planKey: "yearly",
    price: "59€",
    period: "/Jahr",
    subtitle: "= nur 4,92 €/Monat — spart 39%",
    popular: true,
  },
  {
    name: "Lifetime",
    planKey: "lifetime",
    price: "119€",
    period: " einmalig",
    subtitle: "Einmal zahlen. Für immer nutzen.",
  },
];

const sharedFeatures = [
  "Unbegrenzte Transkriptionen",
  "Cloud + Offline Modus",
  "14+ Sprachen & Übersetzung",
  "Gamification & Skins",
  "Priority Support",
];

export default function PricingCards() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/25 bg-primary-light px-4 py-1.5">
            <span className="text-xs font-semibold tracking-wide text-primary">
              Preise
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Weniger als ein Kaffee pro Woche.
          </h2>
          <p className="mt-4 text-base text-muted">
            7 Tage kostenlos testen — keine Zahlung heute.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((plan, index) => {
            const isLifetime = plan.planKey === "lifetime";
            const ctaLabel = isLifetime
              ? "Jetzt kaufen"
              : "7 Tage kostenlos starten";

            return (
              <ScrollReveal key={plan.name} delay={index * 80}>
                <div
                  className={`relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-200 sm:p-8 ${
                    plan.popular
                      ? "border-primary/40 bg-gradient-to-b from-primary/5 via-blue-50/30 to-background shadow-2xl shadow-primary/12 ring-1 ring-primary/15 hover:-translate-y-2"
                      : "border-border bg-background hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                  }`}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-primary/30">
                        <Sparkles size={11} />
                        Beliebteste Wahl
                      </span>
                    </div>
                  )}

                  {/* Goose recommending this plan */}
                  {plan.popular && (
                    <div className="absolute -top-14 -right-10 hidden lg:block pointer-events-none">
                      <Image
                        src="/images/goose-pricing.png"
                        alt=""
                        width={90}
                        height={90}
                      />
                    </div>
                  )}

                  {/* Plan name */}
                  <h3 className="text-base font-semibold text-muted">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className={`text-5xl font-extrabold ${plan.popular ? "text-primary" : "text-foreground"}`}>
                      {plan.price}
                    </span>
                    <span className="ml-0.5 text-sm text-muted">
                      {plan.period}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-muted">{plan.subtitle}</p>

                  {/* Divider */}
                  <hr className="my-6 border-border" />

                  {/* Features */}
                  <ul className="flex flex-1 flex-col gap-3">
                    {sharedFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.popular ? "bg-primary/15" : "bg-primary/10"}`}>
                          <Check size={12} className="text-primary" />
                        </div>
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => startCheckout(plan.planKey)}
                    className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/25 hover:brightness-110 hover:shadow-xl"
                        : "border border-border bg-surface text-foreground hover:bg-surface-light"
                    }`}
                  >
                    {ctaLabel}
                    <ArrowRight size={16} />
                  </button>

                  <p className="mt-3 text-center text-xs text-muted">
                    {isLifetime
                      ? "Einmalige Zahlung · 30-Tage Garantie"
                      : "Keine Zahlung heute · Kündigung jederzeit"}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Alle Pläne mit{" "}
          <span className="font-semibold text-foreground">30-Tage Geld-zurück-Garantie</span>
        </p>

        {/* Guarantee box */}
        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary-light to-blue-50/60 px-6 py-8 text-center sm:flex-row sm:text-left">
          <Shield
            size={40}
            className="shrink-0 text-primary"
            strokeWidth={1.5}
          />
          <div>
            <p className="text-base font-bold text-foreground">
              30-Tage Geld-zurück-Garantie
            </p>
            <p className="mt-1 text-sm text-muted">
              Wenn voeez nichts für dich ist, erstatten wir dir jeden Cent —
              ohne Fragen, ohne Formulare. Einfach melden.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
