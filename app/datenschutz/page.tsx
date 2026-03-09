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
      <p className="mt-2 text-sm text-muted">Stand: März 2026</p>

      <div className="mt-10 flex flex-col gap-10 text-sm text-foreground">

        {/* 1 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">1. Verantwortlicher</h2>
          <p className="text-muted leading-relaxed">
            Verantwortlicher im Sinne der DSGVO ist:
            <br /><br />
            voeez · Lennart Werksnis
            <br />
            Erich-Nehlhans-Str. 29, 10247 Berlin
            <br />
            E-Mail:{" "}
            <a href="mailto:hello@voeez.com" className="text-primary underline underline-offset-2">
              hello@voeez.com
            </a>
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">2. Erhobene Daten und Zwecke</h2>
          <p className="text-muted leading-relaxed">Wir verarbeiten folgende personenbezogene Daten:</p>
          <ul className="mt-3 list-disc list-inside space-y-2 text-muted leading-relaxed">
            <li>
              <strong className="text-foreground">E-Mail-Adresse</strong> –
              zur Kontoerstellung, Anmeldung und Kommunikation
              (Art. 6 Abs. 1 lit. b DSGVO)
            </li>
            <li>
              <strong className="text-foreground">Zahlungsdaten</strong> –
              werden ausschließlich von Stripe verarbeitet; wir speichern keine Kreditkartendaten
              (Art. 6 Abs. 1 lit. b DSGVO)
            </li>
            <li>
              <strong className="text-foreground">Nutzungsstatistiken</strong> –
              Anzahl Transkriptionen, Wörter und Zeitersparnis zur Anzeige im Dashboard
              (Art. 6 Abs. 1 lit. b DSGVO)
            </li>
            <li>
              <strong className="text-foreground">Sprachdaten</strong> –
              im Offline-Modus ausschließlich lokal verarbeitet; im Online-Modus an die
              Whisper-API übertragen und nicht dauerhaft gespeichert
              (Art. 6 Abs. 1 lit. b DSGVO)
            </li>
            <li>
              <strong className="text-foreground">IP-Adresse / technische Zugriffsdaten</strong> –
              für Sicherheit und Betrieb (Rate Limiting, Spam-Schutz), nicht dauerhaft gespeichert
              (Art. 6 Abs. 1 lit. f DSGVO)
            </li>
            <li>
              <strong className="text-foreground">Nutzungsanalyse (Website)</strong> –
              nach ausdrücklicher Einwilligung erfassen wir anonymisierte Nutzungsdaten
              (aufgerufene Seiten, Klickpfade, Gerätekategorie). Keine Inhalte werden dabei
              gespeichert. (Art. 6 Abs. 1 lit. a DSGVO)
            </li>
            <li>
              <strong className="text-foreground">KI-Nutzungsmetadaten</strong> –
              bei Nutzung der Transkriptions- und Übersetzungsfunktion protokollieren wir
              Metadaten (Verarbeitungsdauer, Wortanzahl, Zielsprache) zur Qualitätssicherung.
              Der Inhalt deiner Aufnahmen oder Texte wird dabei zu keinem Zeitpunkt
              an Analysedienste übermittelt. (Art. 6 Abs. 1 lit. f DSGVO)
            </li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">3. Eingesetzte Drittanbieter</h2>
          <div className="space-y-5 text-muted leading-relaxed">

            <div>
              <p className="font-medium text-foreground">Supabase (Authentifizierung & Datenbank)</p>
              <p>
                Supabase Inc., San Francisco, USA. Verarbeitet E-Mail-Adresse,
                Session-Tokens und Nutzungsstatistiken. Datenübertragung in die USA
                auf Basis von Standardvertragsklauseln (SCC).{" "}
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                  Datenschutz Supabase
                </a>
              </p>
            </div>

            <div>
              <p className="font-medium text-foreground">Stripe (Zahlungsabwicklung)</p>
              <p>
                Stripe, Inc., San Francisco, USA. Zahlungsdaten werden direkt an Stripe
                übermittelt und dort verarbeitet. Wir erhalten ausschließlich eine
                Transaktions-ID. Datenübertragung in die USA auf Basis von SCC.{" "}
                <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                  Datenschutz Stripe
                </a>
              </p>
            </div>

            <div>
              <p className="font-medium text-foreground">Vercel (Hosting & CDN)</p>
              <p>
                Vercel Inc., San Francisco, USA. Unsere Website wird auf der
                Infrastruktur von Vercel betrieben. Bei jedem Seitenaufruf werden
                technische Zugriffsdaten (IP-Adresse, Zeitstempel, aufgerufene URL)
                kurzzeitig in Server-Logs gespeichert. Datenübertragung auf Basis von SCC.{" "}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                  Datenschutz Vercel
                </a>
              </p>
            </div>

            <div>
              <p className="font-medium text-foreground">Resend (Transaktionale E-Mails)</p>
              <p>
                Resend Inc., San Francisco, USA. Wird für den Versand von
                Bestätigungs- und System-E-Mails (z. B. Registrierungsbestätigung,
                Passwort-Reset) verwendet. Verarbeitet deine E-Mail-Adresse.
                Datenübertragung auf Basis von SCC.{" "}
                <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                  Datenschutz Resend
                </a>
              </p>
            </div>

            <div>
              <p className="font-medium text-foreground">Cloudflare Turnstile (CAPTCHA / Bot-Schutz)</p>
              <p>
                Cloudflare, Inc., San Francisco, USA. Auf den Login- und
                Registrierungsseiten wird Cloudflare Turnstile eingesetzt, um
                automatisierte Angriffe zu verhindern. Dabei werden technische
                Gerätedaten und IP-Adresse an Cloudflare übermittelt. Es werden
                keine Tracking-Cookies gesetzt. Datenübertragung auf Basis von SCC.{" "}
                <a href="https://www.cloudflare.com/de-de/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                  Datenschutz Cloudflare
                </a>
              </p>
            </div>

            <div>
              <p className="font-medium text-foreground">Upstash Redis (Rate Limiting)</p>
              <p>
                Upstash, Inc. Wird serverseitig für Rate Limiting eingesetzt,
                um Missbrauch zu verhindern. Es werden ausschließlich anonymisierte
                IP-Adressen temporär gespeichert und nicht für andere Zwecke verwendet.{" "}
                <a href="https://upstash.com/trust/privacy.pdf" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                  Datenschutz Upstash
                </a>
              </p>
            </div>

            <div>
              <p className="font-medium text-foreground">PostHog (Webanalyse) — nur mit Einwilligung</p>
              <p>
                PostHog, Inc., San Francisco, USA — EU-Cloud: Daten werden ausschließlich auf
                Servern in der EU gespeichert (eu.i.posthog.com). PostHog erfasst nach
                ausdrücklicher Einwilligung anonymisierte Nutzungsdaten der Website
                (Seitenaufrufe, Klickpfade, Gerätekategorie) sowie Metadaten zur
                KI-Nutzung (Verarbeitungsdauer, Wortanzahl). Persönliche Inhalte werden
                nicht übertragen. Mit PostHog besteht ein Auftragsverarbeitungsvertrag
                (DPA) gemäß Art. 28 DSGVO. Die Einwilligung kann jederzeit im
                Cookie-Banner widerrufen werden.{" "}
                <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                  Datenschutz PostHog
                </a>
              </p>
            </div>

            <div>
              <p className="font-medium text-foreground">Groq (KI-Verarbeitung)</p>
              <p>
                Groq, Inc., Mountain View, USA. Zur Transkription von Sprachdaten und
                Übersetzung von Texten werden Anfragen über unsere Server an die Groq-API
                weitergeleitet. Groq verarbeitet die Daten ausschließlich zur
                Erbringung des Dienstes und speichert keine Inhalte dauerhaft.
                Datenübertragung auf Basis von SCC.{" "}
                <a href="https://groq.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                  Datenschutz Groq
                </a>
              </p>
            </div>

          </div>
        </section>

        {/* 4 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">4. Cookies und lokaler Speicher</h2>
          <div className="space-y-3 text-muted leading-relaxed">
            <p>Diese Website verwendet folgende Arten von Speicher:</p>
            <div>
              <p className="font-medium text-foreground">Technisch notwendig (immer aktiv)</p>
              <p>
                Session-Cookies von Supabase zur Authentifizierung — zwingend
                erforderlich, damit du eingeloggt bleiben kannst. Keine Einwilligung erforderlich.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Analyse (nur mit Einwilligung)</p>
              <p>
                Bei Zustimmung im Cookie-Banner speichern wir eine anonyme Nutzer-ID
                im <strong className="text-foreground">lokalen Browserspeicher (localStorage)</strong>,
                kein persistenter Tracking-Cookie. Damit analysieren wir, wie die Website
                genutzt wird. Du kannst die Einwilligung jederzeit widerrufen, indem du
                im Cookie-Banner „Nur notwendige" auswählst oder den Browser-Speicher löschst
                (localStorage-Key: <code className="text-xs bg-surface-muted px-1 py-0.5 rounded">voeez-analytics-consent</code>).
              </p>
            </div>
          </div>
        </section>

        {/* 5 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">5. Speicherdauer</h2>
          <p className="text-muted leading-relaxed">
            Wir speichern deine Daten nur so lange, wie es für die genannten
            Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten
            bestehen. Nach Löschung deines Kontos werden personenbezogene Daten
            innerhalb von 30 Tagen entfernt, sofern keine gesetzlichen
            Aufbewahrungspflichten entgegenstehen.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">6. Deine Rechte</h2>
          <p className="text-muted leading-relaxed">Du hast gemäß DSGVO folgende Rechte:</p>
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
            <a href="mailto:hello@voeez.com" className="text-primary underline underline-offset-2">
              hello@voeez.com
            </a>
            . Du hast außerdem das Recht, Beschwerde bei einer Datenschutzbehörde
            einzulegen (z. B. Berliner Beauftragte für Datenschutz und Informationsfreiheit).
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">7. Änderungen dieser Erklärung</h2>
          <p className="text-muted leading-relaxed">
            Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen.
            Die aktuelle Version ist stets unter{" "}
            <Link href="/datenschutz" className="text-primary underline underline-offset-2">
              voeez.com/datenschutz
            </Link>{" "}
            abrufbar.
          </p>
        </section>

      </div>
    </div>
  );
}
