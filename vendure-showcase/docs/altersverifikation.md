# Altersverifikation — Wine Showcase

Mitschrift und Architektur-Notizen zur Altersverifikation beim Online-Weinverkauf.

---

## Rechtliche Lage (Österreich)

Nach dem **Wiener Jugendschutzgesetz**:

- **Wein / Bier:** Abgabe ab **16 Jahren**
- **Spirituosen:** Abgabe ab **18 Jahren**

Als Händler sind wir verpflichtet, **aktive Maßnahmen** zur Altersverifikation zu treffen. Eine reine Checkbox "Ich bin über 16" reicht rechtlich **nicht aus**.

---

## Die Ausgangsidee: "Bankomatkarte wie beim Zigarettenautomat"

Der initiale Gedanke war: Bei Zigarettenautomaten wird das Alter über die Bankomatkarte (NFC) verifiziert, weil NFC-fähige Bankomatkarten in AT erst ab 16 ausgegeben werden. Lässt sich das über Sofortüberweisung online nachbauen?

### Warum das 1:1 nicht funktioniert

**Offline (Zigarettenautomat):**
Die Karte wird physisch gelesen, der Automat spricht direkt mit dem Bankensystem, das eine Altersfreigabe zurückgibt. Geschlossenes System.

**Online (Sofortüberweisung / Klarna):**
Der Shop bekommt vom Payment-Provider standardmäßig **nur**: Name, IBAN, Betrag, Status. **Kein Geburtsdatum.** Die bloße Existenz eines Kontos beweist rechtlich nicht das Alter — Jugendkonten gibt es ab 7, Schülerkonten ab 14.

**Aber:** Die grundsätzliche Idee (Verifikation koppeln an einen Prozess, den der Kunde ohnehin durchläuft) ist richtig. Nur der Hebel ist ein anderer.

---

## Realistische Optionen

### Option A — Ident-Check bei Zustellung ⭐ (Branchenstandard)

**Wie:** Beim Versanddienstleister wird der Zusatzservice "Altersverifikation bei Zustellung" gebucht. Der Zusteller prüft den Ausweis physisch an der Tür. Ohne Nachweis keine Übergabe.

**Anbieter:**
- **DHL** "Altersnachweis 16" / "Altersnachweis 18" — ~2–4 € pro Paket
- **DPD** Ident-Service
- **Österreichische Post** "Nachweis-Plus"

| Pro | Contra |
|---|---|
| Rechtlich solide | Kosten pro Paket |
| Von Behörden akzeptiert | Packstation/Nachbar fällt weg |
| Keine Tech-Integration nötig | Conversion-Hürde (Kunde muss daheim sein) |

**Vendure-Integration:** Als eigene `ShippingMethod` anlegen mit Aufpreis. Im Custom Field der Shipping Method den Ident-Level (`16` oder `18`) speichern.

---

### Option B — Identity Provider beim Checkout

**Wie:** Kunde wird beim Checkout zu einem Ident-Dienstleister weitergeleitet, der per Video-Ident, eID oder KI-Ausweisscan das Alter prüft und ein signiertes Token zurückgibt.

**Anbieter:**
- **IDnow** (DE/AT, Marktführer)
- **WebID**
- **Nect** (KI-basiert, günstiger)
- **PostIdent** (Deutsche Post)
- **Yoti** (UK, auch EU)

| Pro | Contra |
|---|---|
| Einmal verifiziert → gilt für Folgebestellungen | Setup-Aufwand |
| Kein Aufpreis pro Paket | Conversion-Killer beim Erstkauf (~30 % Abbruch typisch) |
| Digital, zeitunabhängig | Kosten pro Verifikation |

**Vendure-Integration:** Custom Plugin mit Webhook-Endpoint. Ergebnis als `verifiedAt: Date` am Customer speichern.

---

### Option C — Klarna / Adyen mit KYC Add-on

**Wie:** **Klarna** bietet Händlern optional **"Klarna Identity"** bzw. Age-Checks als Add-on zu bestimmten Payment-Methoden. **Adyen** hat ähnliches im Portfolio. Hier wird intern bei der Zahlungsabwicklung gegen verifizierte KYC-Daten abgeglichen.

| Pro | Contra |
|---|---|
| Minimaler Zusatzaufwand, wenn Klarna ohnehin genutzt | Nicht jede Payment-Methode liefert das |
| Nahtlos im Checkout | Kostenpflichtiges Add-on, nicht automatisch |
| | Muss aktiv beim Account Manager angefragt werden |

**Wichtig:** Sofortüberweisung als eigenständiges Produkt gibt es nicht mehr, sie ist Teil von Klarna. Das Age-Feature ist **nicht** automatisch dabei.

---

### Option D — Auskunftei-Abfragen

**Wie:** API-Abfrage gegen Auskunfteien wie **Schufa IdentityCheck / Q-Bit** (DE) oder Äquivalente wie **KSV1870** (AT). Liefert Bestätigung "Person mit Name + Adresse + Geburtsdatum > X existiert".

| Pro | Contra |
|---|---|
| Schnell, kein User-Interaction | DSGVO-heikel (Einwilligung nötig) |
| Im Hintergrund | Funktioniert nicht für Junge / Neubürger |
| | Kosten pro Abfrage |

---

### Option E — Kombinierter Ansatz (Empfehlung)

Das machen seriöse Wein-Shops tatsächlich in dieser Reihenfolge:

```
1. Age Gate auf Landing Page       → Cookie + Checkbox
2. Checkout: Geburtsdatum-Pflicht  → DSGVO-konforme Einwilligung
3. Payment: Name-Abgleich          → Empfänger ≈ Zahlungsempfänger
4. Versand: IMMER Altersnachweis   → Option A (DHL/Post Ident-Check)
```

Rechtlich robust, konvertiert gut, kostet nur ~3 € Paket-Aufpreis (1:1 weitergebbar).

---

## Die Zukunft: EU Digital Identity Wallet

**Relevant ab 2026:**

- **EU Digital Identity Wallet** wird verpflichtend für EU-Staaten. Bürger:innen-Wallet mit verifizierter Altersangabe, selektiv per QR-Code teilbar ("über 16: ja/nein", ohne DOB preiszugeben).
- **ID Austria** hat das Prinzip schon, ist aktuell aber als Händler noch nicht trivial integrierbar. In 12–18 Monaten wird das ein reales Feature.

**Architektur-Konsequenz:** Das `AgeVerificationPlugin` muss von Anfang an so gebaut sein, dass neue Strategien ohne Checkout-Umbau ergänzt werden können → **Strategy Pattern**.

---

## Empfohlene Roadmap für Wine Showcase

### Kurzfristig (MVP)

1. **Age Gate** auf der Landing Page (React-Komponente, Cookie-basiert)
2. Pflicht-**Checkbox** im Checkout mit **Geburtsdatum**-Eingabe
3. Custom Field `birthDate` am Customer (wird auch für Geburtstagsgutscheine gebraucht!)
4. **Nur** Shipping Methods anbieten, die Altersnachweis bei Zustellung inkludieren

### Mittelfristig

5. Custom **`AgeVerificationPlugin`** mit Status-Enum am Customer:
   ```
   unverified | delivery_checked | kyc_verified
   ```
6. Wenn Kunde einmal per Zustellung verifiziert → Flag setzen → Folgebestellungen können ohne Extra-Check versendet werden (Kulanz, spart Kosten)

### Langfristig (bei passendem Volumen)

7. **IDnow / Nect**-Integration für einmalige digitale Verifikation beim Account-Anlegen
   → USP: "Einmal verifizieren, immer ohne Extra-Check bestellen"
8. **EU Digital Identity Wallet** Strategy ergänzen, sobald produktionsreif

---

## Architektur-Skizze: `AgeVerificationPlugin`

**Strategy Pattern**, damit Verifikationsmethoden austauschbar und kombinierbar sind:

```
AgeVerificationPlugin/
├── age-verification.plugin.ts
├── age-verification.service.ts
├── strategies/
│   ├── age-verification-strategy.interface.ts
│   ├── delivery-check.strategy.ts       ← Option A
│   ├── idnow.strategy.ts                ← Option B
│   ├── klarna-identity.strategy.ts      ← Option C
│   └── eu-id-wallet.strategy.ts         ← Zukunft
├── custom-fields/
│   └── customer.birthDate.ts
│   └── customer.ageVerificationStatus.ts
└── api/
    └── age-verification.resolver.ts
```

**Interface-Vorschlag:**

```typescript
interface AgeVerificationStrategy {
  readonly code: string;
  readonly minAge: 16 | 18;
  verify(ctx: RequestContext, customer: Customer): Promise<VerificationResult>;
}
```

Damit kann das Plugin heute `DeliveryCheckStrategy` nutzen und morgen `EuIdWalletStrategy` hinzufügen, ohne Checkout-Logik anzufassen.

---

## Offene Fragen / ToDo

- [ ] Klären: Welchen Versanddienstleister nutzen wir? (DHL vs. Post AT)
- [ ] Preise Ident-Service bei DHL/Post AT einholen
- [ ] DSGVO: Einwilligungstext für Geburtsdatum-Speicherung formulieren lassen
- [ ] Prüfen: Ist `@vendure/scheduler-plugin` in v3.2 verfügbar? (für Geburtstagsgutschein-Kopplung)
- [ ] Entscheidung: MVP-Variante oder direkt mit KYC-Provider starten?
