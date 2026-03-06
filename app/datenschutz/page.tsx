import Link from "next/link";

export const metadata = {
  title: "Datenschutzerklärung – voeez",
};

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-foreground">
        Datenschutzerklärung
      </h1>
      <p className="mt-2 text-sm text-muted">Stand: März 2025</p>

      <div className="prose prose-sm mt-10 flex flex-col gap-10 text-sm text-foreground">
        {/* 1 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            1. Verantwortlicher
          </h2>
          <p className="text-muted leading-relaxed">
            Verantwortlicher im Sinne der DSGVO ist:
            <br />
            <br />
            Lennart Schäfer
            <br />
            Musterstraße 1, 12345 Musterstadt
            <br />
            E-Mail:{" "}
            <a
              href="mailto:support@voeez.app"
              className="text-primary underline underline-offset-2"
            >
              support@voeez.app
            </a>
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            2. Erhobene Daten und Zwecke
          </h2>
          <p className="text-muted leading-relaxed">
            Wir verarbeiten folgende personenbezogene Daten:
          </p>
          <ul className="mt-3 list-disc list-inside space-y-2 text-muted leading-relaxed">
            <li>
              <strong className="text-foreground">E-Mail-Adresse</strong> –
              zur Kontoerstellung, Anmeldung und Kundenkommunikation
              (Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO)
            </li>
            <li>
              <strong className="text-foreground">
                Zahlungsdaten (Stripe)
              </strong>{" "}
              – werden ausschließlich von Stripe verarbeitet; wir speichern
              keine vollständigen Kreditkartendaten
              (Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO)
            </li>
            <li>
              <strong className="text-foreground">Nutzungsstatistiken</strong>{" "}
              – anonymisierte Zählung von Transkriptionen und Wörtern zur
              Darstellung in deinem Dashboard
              (Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO)
            </li>
            <li>
              <strong className="text-foreground">Sprachdaten</strong> –
              werden im Offline-Modus ausschließlich lokal auf deinem Gerät
              verarbeitet und verlassen dieses nicht; im Online-Modus werden
              sie an die Whisper-API übertragen
              (Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO)
            </li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            3. Drittanbieter
          </h2>
          <div className="space-y-4 text-muted leading-relaxed">
            <div>
              <p className="font-medium text-foreground">Supabase</p>
              <p>
                Wir nutzen Supabase (Supabase Inc., San Francisco, USA) als
                Authentifizierungs- und Datenbankdienst. Supabase verarbeitet
                deine E-Mail-Adresse und gespeicherte Nutzungsdaten. Weitere
                Informationen:{" "}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  supabase.com/privacy
                </a>
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Stripe</p>
              <p>
                Für die Zahlungsabwicklung verwenden wir Stripe (Stripe, Inc.,
                San Francisco, USA). Bei einem Kauf werden deine
                Zahlungsdaten direkt an Stripe übermittelt und dort
                verarbeitet. Weitere Informationen:{" "}
                <a
                  href="https://stripe.com/de/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  stripe.com/de/privacy
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* 4 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            4. Speicherdauer
          </h2>
          <p className="text-muted leading-relaxed">
            Wir speichern deine Daten nur so lange, wie es für die genannten
            Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten
            bestehen. Nach Kündigung deines Kontos werden deine Daten
            innerhalb von 30 Tagen gelöscht, sofern keine
            Aufbewahrungspflichten dem entgegenstehen.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            5. Deine Rechte
          </h2>
          <p className="text-muted leading-relaxed">
            Du hast gemäß DSGVO folgende Rechte:
          </p>
          <ul className="mt-3 list-disc list-inside space-y-1 text-muted leading-relaxed">
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung (Art. 17 DSGVO)</li>
            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
          </ul>
          <p className="mt-3 text-muted leading-relaxed">
            Zur Ausübung deiner Rechte wende dich an:{" "}
            <a
              href="mailto:support@voeez.app"
              className="text-primary underline underline-offset-2"
            >
              support@voeez.app
            </a>
            . Du hast außerdem das Recht, Beschwerde bei einer
            Datenschutzbehörde einzulegen.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">6. Cookies</h2>
          <p className="text-muted leading-relaxed">
            Diese Website verwendet technisch notwendige Session-Cookies für
            die Authentifizierung. Es werden keine Tracking- oder
            Werbe-Cookies eingesetzt.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            7. Änderungen dieser Erklärung
          </h2>
          <p className="text-muted leading-relaxed">
            Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf
            anzupassen. Die aktuelle Version ist stets unter{" "}
            <Link
              href="/datenschutz"
              className="text-primary underline underline-offset-2"
            >
              voeez.app/datenschutz
            </Link>{" "}
            abrufbar.
          </p>
        </section>
      </div>
    </div>
  );
}
