"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Funktioniert das wirklich in jeder App?",
    answer:
      "Ja, systemweit. voeez fügt Text direkt an deiner Cursor-Position ein – egal ob Mail, Notion, VS Code, Terminal oder Slack. Wo du tippst, kannst du auch diktieren.",
  },
  {
    question: "Ist meine Stimme wirklich sicher?",
    answer:
      "Ja. Im Offline-Modus verlässt kein einziges Byte deinen Mac – alles läuft lokal auf deinem Gerät. Im Cloud-Modus werden Audiodaten mit TLS 1.2+ verschlüsselt übertragen und nicht gespeichert.",
  },
  {
    question: "Kann ich jederzeit kündigen?",
    answer:
      "Ja, jederzeit mit einem Klick – kein Anruf, keine Formulare. Das Abo endet automatisch zum nächsten Abrechnungsdatum. Und wenn du innerhalb von 30 Tagen unzufrieden bist, bekommst du jeden Cent zurück.",
  },
  {
    question: "Was wenn ich kein WLAN habe?",
    answer:
      "Kein Problem. Der Offline-Modus läuft vollständig lokal auf deinem Mac – ohne Internet, ohne Verzögerung. Im Zug, im Flugzeug, überall.",
  },
  {
    question: "Welche Sprachen werden unterstützt?",
    answer:
      "Über 14 Sprachen – Deutsch, Englisch, Spanisch, Französisch, Italienisch, Portugiesisch, Japanisch, Chinesisch und mehr. Live-Übersetzung zwischen allen unterstützten Sprachen inklusive.",
  },
  {
    question: "Was ist das mit der Gans?",
    answer:
      "Deine persönliche Gans wächst mit dir: vom Ei zum erwachsenen Tier. Jedes gesprochene Wort bringt Federn – damit kaufst du Skins, Sounds und Extras im Shop. Achievements belohnen Meilensteine. Macht süchtig.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/25 bg-primary-light px-4 py-1.5">
            <span className="text-xs font-semibold tracking-wide text-primary">
              FAQ
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Deine Fragen. Ehrliche Antworten.
          </h2>
        </div>

        {/* Accordion */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-background">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className={index > 0 ? "border-t border-border" : ""}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-surface"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-foreground">
                    {faq.question}
                  </span>
                  <span className="shrink-0 text-primary">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-border bg-surface px-6 py-5">
                    <p className="text-sm leading-relaxed text-muted">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
