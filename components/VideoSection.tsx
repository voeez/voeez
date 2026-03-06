"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { startCheckout } from "@/lib/checkout";
import { ArrowRight } from "lucide-react";

export default function VideoSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-primary/25 bg-primary-light px-4 py-1.5">
              <span className="text-xs font-semibold tracking-wide text-primary">
                Sieh es in Aktion
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Von der Idee zum Text — in Sekunden.
            </h2>
            <p className="mt-3 text-muted">
              Fn drücken, sprechen, loslassen. Das war's.
            </p>
          </div>

          {/* Video */}
          <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-black shadow-2xl shadow-black/30">
            {/* Subtle top accent line */}
            <div className="pointer-events-none absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <video
              src="/video/voeez-product-video.mp4"
              poster="/video/voeez-poster.png"
              autoPlay
              muted
              loop
              playsInline
              className="w-full"
            />
          </div>

          {/* CTA below video */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => startCheckout("yearly")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
            >
              7 Tage kostenlos testen
              <ArrowRight size={16} />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
