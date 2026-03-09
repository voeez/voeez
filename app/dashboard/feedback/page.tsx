"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle, MessageSquarePlus, ThumbsUp } from "lucide-react";

// Set this to your Canny board URL once you create a free account at canny.io
const FEATURE_BOARD_URL = "https://voeez.canny.io";

const CATEGORIES = [
  { value: "bug",      label: "🐛 Fehler melden" },
  { value: "feature",  label: "💡 Feature-Idee" },
  { value: "ux",       label: "🎨 UX / Design" },
  { value: "general",  label: "💬 Allgemeines" },
];

export default function FeedbackPage() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("general");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/feedback/web", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, category }),
      });

      if (res.ok) {
        setStatus("success");
        setText("");
        setCategory("general");
      } else {
        const data = await res.json();
        setErrorMsg(data.error ?? "Etwas ist schiefgelaufen.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Netzwerkfehler. Bitte versuche es noch einmal.");
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Feedback &amp; Feature-Requests</h1>
        <p className="mt-2 text-muted">
          Du bist Beta-Nutzer — deine Meinung formt Voeez direkt. Hier kannst du Fehler melden,
          Ideen einreichen oder einfach sagen, was dir gefällt.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Feedback form */}
        <div className="rounded-2xl border border-border/50 bg-surface p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <MessageSquarePlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Feedback schreiben</h2>
              <p className="text-sm text-muted">Direkt an das Entwicklerteam</p>
            </div>
          </div>

          {status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-400" />
              <p className="font-semibold text-foreground">Danke! 🪿</p>
              <p className="text-sm text-muted">
                Dein Feedback ist angekommen. Wir melden uns, wenn es was zu berichten gibt.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-light"
              >
                Weiteres Feedback senden
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Category picker */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Kategorie</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors ${
                        category === cat.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/50 bg-surface-light text-muted hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text area */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Dein Feedback
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Was vermisst du? Was nervt? Was liebst du an Voeez?"
                  rows={6}
                  maxLength={5000}
                  required
                  className="w-full resize-none rounded-xl border border-border/50 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="mt-1 text-right text-xs text-muted">{text.length} / 5000</p>
              </div>

              {errorMsg && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending" || !text.trim()}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "sending" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Wird gesendet…
                  </>
                ) : (
                  <>
                    <MessageSquarePlus className="h-4 w-4" />
                    Feedback senden
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Feature voting card */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <ThumbsUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Feature-Voting Board</h2>
                <p className="text-sm text-muted">Ideen einreichen &amp; für Features abstimmen</p>
              </div>
            </div>

            <p className="mb-5 text-sm text-muted leading-relaxed">
              Sieh, welche Features andere Beta-Nutzer sich wünschen — und vote für die, die dir
              am wichtigsten sind. Die meistgewünschten Features bauen wir als erstes.
            </p>

            <a
              data-canny-link
              href={FEATURE_BOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark"
            >
              Feature-Board öffnen
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {/* Tips card */}
          <div className="rounded-2xl border border-border/50 bg-surface p-5">
            <h3 className="mb-3 font-medium text-foreground">Worüber kannst du schreiben?</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              {[
                "🐛  Fehler oder unerwartetes Verhalten",
                "💡  Features, die dir im Alltag fehlen",
                "⚡️  Performance- oder Qualitätsprobleme",
                "🎨  Design & Usability-Verbesserungen",
                "❤️  Was du besonders gut findest",
              ].map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
