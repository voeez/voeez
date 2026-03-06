export const metadata = {
  title: "Allgemeine Geschäftsbedingungen – voeez",
};

export default function AgbPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-foreground">
        Allgemeine Geschäftsbedingungen (AGB)
      </h1>
      <p className="mt-2 text-sm text-muted">Stand: März 2025</p>

      <div className="mt-10 flex flex-col gap-10 text-sm text-foreground">
        {/* 1 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            1. Geltungsbereich
          </h2>
          <p className="text-muted leading-relaxed">
            Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge
            zwischen Lennart Schäfer (nachfolgend „Anbieter") und Kunden
            (nachfolgend „Nutzer") über die Nutzung der Software voeez und der
            dazugehörigen Webseite voeez.app. Abweichende Bedingungen des
            Nutzers werden nicht anerkannt.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            2. Vertragsschluss
          </h2>
          <p className="text-muted leading-relaxed">
            Der Vertrag kommt durch die Registrierung auf voeez.app und die
            Auswahl eines Abonnements zustande. Mit dem Abschluss des
            Bestellvorgangs gibt der Nutzer ein verbindliches Angebot zum
            Kauf des ausgewählten Abonnements ab. Die Annahme erfolgt durch
            eine Bestätigungs-E-Mail.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            3. Leistungsumfang
          </h2>
          <p className="text-muted leading-relaxed">
            voeez stellt dem Nutzer eine macOS-Applikation zur
            Sprachtranskription sowie ein Web-Dashboard zur Verfügung. Der
            Anbieter behält sich vor, den Leistungsumfang weiterzuentwickeln
            und anzupassen. Wesentliche Leistungseinschränkungen werden dem
            Nutzer rechtzeitig mitgeteilt.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            4. Testzeitraum
          </h2>
          <p className="text-muted leading-relaxed">
            Neue Nutzer erhalten bei Abschluss eines Abonnements einen
            kostenlosen Testzeitraum von 7 Tagen. Während des Testzeitraums
            kann das Abonnement jederzeit kostenfrei gekündigt werden.
            Erfolgt keine Kündigung, wird das Abonnement nach Ende des
            Testzeitraums automatisch kostenpflichtig fortgesetzt.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">5. Preise und Zahlung</h2>
          <p className="text-muted leading-relaxed">
            Die aktuellen Preise sind auf voeez.app/pricing einsehbar. Alle
            Preise verstehen sich in Euro inklusive gesetzlicher
            Mehrwertsteuer. Die Abrechnung erfolgt über den Zahlungsdienstleister
            Stripe. Bei monatlichen und jährlichen Abonnements erfolgt die
            Abbuchung im Voraus zu Beginn jedes Abrechnungszeitraums.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">6. Kündigung</h2>
          <p className="text-muted leading-relaxed">
            Abonnements können jederzeit zum Ende des jeweiligen
            Abrechnungszeitraums über das Dashboard unter
            „Abo verwalten" oder über den Stripe-Kundenbereich gekündigt
            werden. Nach der Kündigung bleibt der Zugang bis zum Ende des
            bezahlten Zeitraums bestehen. Eine anteilige Erstattung bereits
            bezahlter Beträge erfolgt nicht, es sei denn, dies ist gesetzlich
            vorgeschrieben.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            7. Widerrufsrecht
          </h2>
          <p className="text-muted leading-relaxed">
            Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Das
            Widerrufsrecht erlischt vorzeitig, wenn der Anbieter mit der
            Ausführung der Dienstleistung begonnen hat und der Verbraucher
            ausdrücklich zugestimmt hat, dass der Anbieter vor Ablauf der
            Widerrufsfrist mit der Ausführung beginnt. Durch Abschluss des
            Kaufvorgangs erklärt der Nutzer sein Einverständnis mit dem
            sofortigen Beginn der Leistungserbringung.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">8. Nutzungsrechte</h2>
          <p className="text-muted leading-relaxed">
            Mit dem Abschluss eines aktiven Abonnements erhält der Nutzer ein
            nicht-exklusives, nicht übertragbares Recht zur Nutzung der
            voeez-Applikation für private und gewerbliche Zwecke auf einem
            Gerät. Eine Weitergabe, Unterlizenzierung oder Dekompilierung der
            Software ist nicht gestattet.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            9. Haftungsbeschränkung
          </h2>
          <p className="text-muted leading-relaxed">
            Der Anbieter haftet nur bei Vorsatz und grober Fahrlässigkeit
            sowie bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten).
            Die Haftung bei leicht fahrlässiger Verletzung von Kardinalpflichten
            ist auf den vertragstypischen, vorhersehbaren Schaden begrenzt.
            Diese Haftungsbeschränkung gilt nicht bei Schäden aus der
            Verletzung des Lebens, des Körpers oder der Gesundheit.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">
            10. Anwendbares Recht und Gerichtsstand
          </h2>
          <p className="text-muted leading-relaxed">
            Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss
            des UN-Kaufrechts. Gerichtsstand für Streitigkeiten mit Kaufleuten
            ist der Sitz des Anbieters.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="mb-3 text-base font-semibold">11. Kontakt</h2>
          <p className="text-muted leading-relaxed">
            Bei Fragen zu diesen AGB wende dich an:{" "}
            <a
              href="mailto:support@voeez.app"
              className="text-primary underline underline-offset-2"
            >
              support@voeez.app
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
