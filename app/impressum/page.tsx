export const metadata = {
  title: "Impressum – voeez",
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-foreground">Impressum</h1>
      <p className="mt-2 text-sm text-muted">Angaben gemäß § 5 TMG</p>

      <div className="mt-10 flex flex-col gap-8 text-sm text-foreground">
        {/* Betreiber */}
        <section>
          <h2 className="mb-3 text-base font-semibold">Betreiber</h2>
          <p className="text-muted leading-relaxed">
            voeez
            <br />
            Lennart Werksnis
            <br />
            Erich-Nehlhans-Str. 29
            <br />
            10247 Berlin
            <br />
            Deutschland
          </p>
        </section>

        {/* Kontakt */}
        <section>
          <h2 className="mb-3 text-base font-semibold">Kontakt</h2>
          <p className="text-muted leading-relaxed">
            E-Mail:{" "}
            <a
              href="mailto:hello@voeez.com"
              className="text-primary underline underline-offset-2"
            >
              hello@voeez.com
            </a>
          </p>
        </section>

        {/* Umsatzsteuer */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            Umsatzsteuer-Identifikationsnummer
          </h2>
          <p className="text-muted leading-relaxed">
            {/* TODO: USt-IdNr. eintragen, falls vorhanden */}
            Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).
          </p>
        </section>

        {/* Verantwortlich */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV
          </h2>
          <p className="text-muted leading-relaxed">
            Lennart Werksnis, Anschrift wie oben
          </p>
        </section>

        {/* Streitschlichtung */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            EU-Streitschlichtung
          </h2>
          <p className="text-muted leading-relaxed">
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . Wir sind nicht bereit oder verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </section>

        {/* Haftung */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            Haftung für Inhalte
          </h2>
          <p className="text-muted leading-relaxed">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
            Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
            verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
            jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die
            auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
        </section>
      </div>
    </div>
  );
}
