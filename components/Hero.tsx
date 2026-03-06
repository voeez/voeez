"use client";

import Link from "next/link";
import NextImage from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import { startCheckout } from "@/lib/checkout";
import { useState, useEffect } from "react";

// ─── Animated waveform bars ───────────────────────────────────────────────────

const BAR_COUNT = 24;

function generateHeights(): number[] {
  return Array.from({ length: BAR_COUNT }, () => Math.random() * 68 + 18);
}

function WaveformViz() {
  const [heights, setHeights] = useState<number[]>(() => generateHeights());

  useEffect(() => {
    const id = setInterval(() => setHeights(generateHeights()), 110);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-0.5 px-5 pb-4" style={{ height: 52 }}>
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-full bg-primary/60 transition-all duration-100"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

// ─── Typewriter cycling text ──────────────────────────────────────────────────

const examples = [
  "Schreib eine E-Mail an Thomas wegen dem Meeting...",
  "Notiz: Zahnarzt Freitag, 14 Uhr nicht vergessen...",
  "Slack: Ich bin in 5 Minuten im Call...",
  "Todo: Angebot für den Kunden fertigstellen...",
];

function TypewriterText() {
  const [idx, setIdx]         = useState(0);
  const [display, setDisplay] = useState("");
  const [typing, setTyping]   = useState(true);

  useEffect(() => {
    const full = examples[idx];
    let i = 0;
    setDisplay("");
    setTyping(true);

    const t = setInterval(() => {
      if (i < full.length) {
        setDisplay(full.slice(0, ++i));
      } else {
        clearInterval(t);
        setTyping(false);
        setTimeout(() => setIdx(p => (p + 1) % examples.length), 2200);
      }
    }, 38);

    return () => clearInterval(t);
  }, [idx]);

  return (
    <p className="min-h-[56px] text-sm leading-relaxed text-foreground">
      &ldquo;{display}
      <span
        className={`ml-0.5 inline-block h-3.5 w-0.5 -mb-0.5 rounded-full bg-primary ${
          typing ? "opacity-100" : "animate-pulse"
        }`}
      />
      &rdquo;
    </p>
  );
}

// ─── Main hero graphic ────────────────────────────────────────────────────────

function HeroGraphic() {
  return (
    <div className="relative" style={{ animation: "float 4s ease-in-out infinite" }}>
      {/* macOS recording panel — light style matching site cards */}
      <div className="w-[370px] overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-primary/10">

        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-border bg-surface/60 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs font-semibold text-muted">voeez</span>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-70" />
              <span className="relative flex h-2 w-2 rounded-full bg-red-400" />
            </span>
            <span className="text-xs font-medium text-red-400">Aufnahme</span>
          </div>
        </div>

        {/* Transcription area */}
        <div className="px-5 pt-4 pb-1">
          <TypewriterText />
        </div>

        {/* Live waveform */}
        <WaveformViz />

        {/* Status bar */}
        <div className="flex items-center justify-between border-t border-border bg-surface/40 px-5 py-2.5">
          <span className="font-mono text-xs text-muted tabular-nums">00:04</span>
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-semibold text-primary">KI transkribiert</span>
          </div>
        </div>
      </div>

      {/* Floating toast — text inserted */}
      <div className="absolute -bottom-4 -right-5 flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 shadow-xl ring-1 ring-black/6">
        <CheckCircle size={15} className="shrink-0 text-emerald-500" />
        <span className="text-xs font-semibold text-gray-800">Text in Notion eingefügt</span>
      </div>

      {/* Floating badge — hotkey hint */}
      <div className="absolute -top-4 -left-5 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-lg ring-1 ring-black/6">
        <kbd className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-bold text-gray-600">fn</kbd>
        <span className="text-xs text-gray-500">gedrückt halten</span>
      </div>
    </div>
  );
}

// ─── Hero section ─────────────────────────────────────────────────────────────

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Background: dot grid + gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-32 left-1/4 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute top-20 right-0 h-[500px] w-[500px] rounded-full bg-blue-300/10 blur-3xl" />
        <div className="absolute -bottom-20 left-0 h-[350px] w-[450px] rounded-full bg-indigo-200/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-16 px-4 sm:px-6 lg:flex-row lg:gap-24 lg:px-8">
        {/* ── Text ── */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">

          {/* Animated badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-light px-4 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs font-semibold tracking-wide text-primary">
              Jetzt verfügbar für macOS
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Du tippst 60
            <br />
            Wörter pro Minute.
            <br />
            <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              Du redest 150.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            voeez macht aus allem, was du sagst, sofort präzisen Text — in
            jeder App, auf jedem Mac. Kein Copy-Paste. Keine Unterbrechung.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => startCheckout("yearly")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.02]"
            >
              7 Tage kostenlos testen
              <ArrowRight size={18} />
            </button>
            <Link
              href="#features"
              className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-3.5 text-base font-semibold text-foreground transition-all hover:bg-surface hover:border-primary/30 hover:scale-[1.02]"
            >
              Mehr erfahren
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-7 flex items-center gap-4">
            <div className="flex -space-x-2">
              {(["MT", "SL", "JW", "AK"] as const).map((init, i) => (
                <div
                  key={i}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-sm ${
                    ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-orange-400"][i]
                  }`}
                >
                  {init}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">4,9</span>
              </div>
              <p className="text-xs text-muted">
                <span className="font-semibold text-foreground">500+ Mac-Nutzer</span> · Keine Zahlung heute
              </p>
            </div>
          </div>
        </div>

        {/* ── Graphic ── */}
        <div className="relative flex flex-1 items-center justify-center">
          <div className="absolute h-80 w-80 rounded-full bg-gradient-to-br from-primary/12 to-indigo-300/12 blur-3xl" />
          <HeroGraphic />
          {/* Floating goose illustration */}
          <div
            className="absolute -bottom-10 -left-6 hidden lg:block pointer-events-none"
            style={{ animation: "float 5s ease-in-out 1.5s infinite" }}
          >
            <NextImage
              src="/images/goose-hero.png"
              alt="Voeez Gans diktiert"
              width={148}
              height={148}
              className="drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
