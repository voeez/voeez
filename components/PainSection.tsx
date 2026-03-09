import Image from "next/image";

const painPoints = [
  "Du hast einen Gedanken — aber bis du fertig getippt hast, ist der Faden weg.",
  "Du schreibst E-Mails, Notizen, Kommentare — deine Hände sind müde, dein Kopf noch voll.",
  "Du springst zwischen Apps hin und her und verlierst jedes Mal deinen Fokus.",
  "Am Ende des Tages weißt du, dass du mehr machen könntest — aber wie?",
];

export default function PainSection() {
  return (
    <section className="border-b border-border bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/images/goose-pain.png"
              alt="Erschöpfte Gans am Tippen"
              width={120}
              height={120}
            />
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Kennst du das Gefühl?
          </h2>
        </div>

        {/* Pain bullets */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-500">
                ✕
              </span>
              <p className="text-sm leading-relaxed text-foreground">{point}</p>
            </div>
          ))}
        </div>

        {/* Bridge */}
        <div className="mt-12 text-center">
          <p className="text-xl font-semibold text-foreground sm:text-2xl">
            Es gibt einen einfacheren Weg.{" "}
            <span className="text-primary">Du redest einfach.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
