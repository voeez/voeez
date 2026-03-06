"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { startCheckout } from "@/lib/checkout";

export default function FinalCTA() {
  return (
    <section id="download" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 px-6 py-16 text-center sm:px-12 sm:py-24">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 left-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 right-1/4 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute top-1/2 right-0 h-48 w-48 -translate-y-1/2 rounded-full bg-indigo-300/20 blur-2xl" />
          </div>

          {/* Dot grid overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }} />

          {/* Goose running towards the CTA */}
          <div className="absolute bottom-0 right-4 hidden lg:block pointer-events-none opacity-90">
            <Image
              src="/images/goose-cta.png"
              alt=""
              width={190}
              height={190}
            />
          </div>

          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              <span className="text-xs font-semibold tracking-wide text-white/90">
                30-Tage Geld-zurück-Garantie
              </span>
            </div>

            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Deine nächste Stunde sparst du
              <br />
              mit einem Klick.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg text-white/75">
              Schließ dich 500+ Mac-Nutzern an, die nie wieder unnötig tippen.
            </p>

            <div className="mt-8">
              <button
                onClick={() => startCheckout("yearly")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-primary shadow-xl transition-all hover:shadow-2xl hover:scale-105"
              >
                7 Tage kostenlos testen
                <ArrowRight size={18} />
              </button>
            </div>

            <p className="mt-5 text-sm text-white/60">
              Keine Zahlung heute · Kündigung jederzeit · macOS 14+
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
