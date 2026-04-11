# Wein E-Commerce Projekt — Architektur & Plan

## Context

Ein einzelnes Weingut in Österreich braucht eine Webseite die weit über einen Standard-Shop hinausgeht: Weinverkauf (60 Sorten, ~2 Sales/Tag), ein komplexer Canva-ähnlicher Etiketten-Designer (druckfertig), Rebstockmiete als Abo-Modell mit persönlichem Dashboard, und ein Event-Buchungssystem (Picknick, Wanderungen, Kellerführung, Verkostung).

**Entscheidung: Astro.js + Vendure.js + Stripe**

- Vendure liefert den gesamten Commerce-Kern fertig (Warenkorb, Checkout, Orders, Kunden, Rabatte, Admin UI)
- Custom Fields für Wein-Attribute (Jahrgang, Rebsorte, etc.) — kein Schema-Hack nötig
- Custom Plugins für Spezial-Features (Etiketten, Events, Rebstock-Abo)
- NestJS darunter = saubere Plugin-Architektur für alles Custom
- GraphQL API passt perfekt zu Astro SSG
- Eine PostgreSQL DB für alles
- Auth eingebaut (Kundenlogin über Shop API)

---

## Tech Stack

| Schicht | Technologie | Zweck |
|---------|-------------|-------|
| **Frontend** | Astro.js (SSG + SSR Hybrid) | Produktseiten statisch (Build via GraphQL), User-Bereich serverseitig |
| **UI** | React 19 Inseln + Komponenten aus `__Components__` Repo | Cards, Buttons, Toast, Cart-UI etc. wiederverwenden |
| **Styling** | Tailwind CSS 4 | Konsistent mit bestehenden Komponenten |
| **Backend** | Vendure.js (NestJS + TypeScript) | Commerce-Kern + Custom Plugins |
| **Datenbank** | PostgreSQL (von Vendure verwaltet) | Eine DB für alles |
| **Zahlung** | Stripe Plugin für Vendure | Sofortüberweisung (SEPA), Rechnung (Klarna), Abo (Stripe Billing) |
| **Etiketten-Designer** | Fabric.js oder Polotno (React, zu evaluieren) | Canvas-basierter Editor, PDF Export 300dpi |
| **File Storage** | S3-kompatibel (Vendure AssetServer) oder Cloudflare R2 | Produktbilder, Etiketten-Designs, Rebstock-Fotos |
| **Hosting Frontend** | Vercel oder Netlify | Astro SSR/SSG, Free/Hobby Tier |
| **Hosting Backend** | Railway / Render / Fly.io | Vendure Server + PostgreSQL |
| **Package Manager** | Bun | Wie im bestehenden Projekt |

---

## Architektur

```
┌─────────────────────────────────────────────────┐
│                   Astro.js                       │
│              (SSG + SSR Hybrid)                  │
├───────────┬───────────┬───────────┬──────────────┤
│  Weinshop  │ Etiketten │ Rebstock  │   Events     │
│  (SSG)     │ Designer  │ Dashboard │  Buchungen   │
│            │ (React)   │ (React)   │  (React)     │
├───────────┴───────────┴───────────┴──────────────┤
│                GraphQL Queries                    │
├──────────────────────────────────────────────────┤
│                 Vendure.js                        │
│              (NestJS Backend)                     │
├──────────┬───────────┬───────────┬───────────────┤
│ Commerce │ Etiketten │ Rebstock  │    Event      │
│  Core    │  Plugin   │  Plugin   │   Plugin      │
│ ┌──────┐ │ ┌───────┐ │ ┌───────┐ │ ┌───────────┐ │
│ │Orders│ │ │Canvas │ │ │Stripe │ │ │Kalender   │ │
│ │Cart  │ │ │Storage│ │ │Billing│ │ │Buchungen  │ │
│ │Kunden│ │ │PDF Gen│ │ │Dashb. │ │ │Plätze     │ │
│ │Rabatte│ │ │       │ │ │Updates│ │ │           │ │
│ └──────┘ │ └───────┘ │ └───────┘ │ └───────────┘ │
├──────────┴───────────┴───────────┴───────────────┤
│           PostgreSQL (eine Datenbank)             │
├──────────────────────────────────────────────────┤
│                    Stripe                         │
│     Checkout │ Sofort │ Klarna │ Billing (Abo)   │
└──────────────────────────────────────────────────┘
```

---

## Vendure: Was kommt fertig, was ist Custom?

### Fertig (Vendure Core)
- Produktkatalog + Varianten + Custom Fields (Wein-Attribute)
- Warenkorb (ActiveOrder)
- Checkout-Flow (konfigurierbarer Prozess)
- Bestellungen + Statusverwaltung
- Kundenverwaltung + Auth (Login, Registrierung)
- Rabatte, Gutscheine, Promotions
- Versandmethoden + Berechnung
- Admin UI (React, Shadcn — erweiterbar)
- Stripe Payment Plugin
- Asset Management (Produktbilder)

### Custom Plugins (zu entwickeln)

**1. Wine Custom Fields**
- Custom Fields auf `Product`: jahrgang, rebsorte, region, alkoholgehalt, geschmacksprofil, restzucker, saeure, serviertemperatur, speiseempfehlung
- Custom Fields auf `ProductVariant` falls nötig (z.B. Flaschengröße)
- Erweiterung der Shop API GraphQL Schema

**2. Label Designer Plugin**
- Neue Entity: `LabelDesign` (user, name, canvas_json, preview_url, pdf_url)
- Custom GraphQL Mutations: saveLabelDesign, deleteLabelDesign, exportLabelPdf
- File Storage für Designs + exportierte PDFs
- Verknüpfung mit OrderLine (welches Etikett auf welche Bestellung)
- Frontend: React-Insel mit Fabric.js oder Polotno
- PDF-Export serverseitig (z.B. Puppeteer oder canvas-basiert)

**3. Vineyard Subscription Plugin (Rebstockmiete)**
- Neue Entities: `VineyardSubscription`, `VineyardUpdate`
- Integration mit Stripe Billing (wiederkehrende Zahlungen)
- Custom GraphQL Queries: mySubscription, vineyardUpdates
- Custom GraphQL Mutations: createSubscription, cancelSubscription
- Admin UI Extension: Rebstock-Updates posten (Foto + Text)
- Frontend: persönliches Dashboard pro Mieter

**4. Event Booking Plugin**
- Neue Entities: `Event`, `EventBooking`
- Custom GraphQL Queries: upcomingEvents, myBookings
- Custom GraphQL Mutations: bookEvent, cancelBooking
- Platzbegrenzung mit Concurrent-Booking-Schutz
- Online-Zahlung (Stripe) oder Vor-Ort-Zahlung (Reservierung)
- Admin UI Extension: Events erstellen/verwalten
- Email-Benachrichtigungen (Vendure EmailPlugin)

---

## Vendure Custom Fields für Wein-Produkte

```typescript
// vendure-config.ts
customFields: {
  Product: [
    { name: 'jahrgang', type: 'int' },
    { name: 'rebsorte', type: 'string' },
    { name: 'region', type: 'string' },
    { name: 'alkoholgehalt', type: 'float' },
    { name: 'geschmacksprofil', type: 'string' },
    { name: 'restzucker', type: 'float' },
    { name: 'saeure', type: 'float' },
    { name: 'serviertemperatur', type: 'string' },
    { name: 'speiseempfehlung', type: 'text' },
    { name: 'auszeichnungen', type: 'text' },
  ]
}
```

---

## Hosting-Kosten (geschätzt)

| Service | Tier | Kosten/Monat |
|---------|------|-------------|
| Vercel (Astro Frontend) | Hobby | $0 |
| Railway (Vendure + PostgreSQL) | Starter | ~$5-7 |
| File Storage (Cloudflare R2) | Free Tier | $0 (10GB) |
| Stripe | Transaktionsgebühren | ~1.4% + 0.25€/Transaktion |
| Domain (.at) | | ~15€/Jahr |
| **Gesamt** | | **~$5-7/Monat** + Transaktionsgebühren |

---

## Offene Entscheidungen

1. **Payment Provider**: Stripe vs. Mollie — muss evaluiert werden (Gebühren AT, Sofortüberweisung, Rechnung)
2. **Etiketten-Designer**: Fabric.js (kostenlos, mehr Aufwand) vs. Polotno (fertiger Editor, ggf. Lizenzkosten)
3. **Email-Versand**: Vendure EmailPlugin (eingebaut) + SMTP Provider (Resend, Postmark, Mailgun)
4. **Rechtliches AT**: Altersprüfung, Impressum, DSGVO, Widerrufsrecht Alkohol — juristisch klären
5. **Versand**: API-Anbindung (Post AT, DPD) oder manuell?
6. **Etiketten-Druck**: Inhouse oder Druckerei-API?
7. **Hosting Backend**: Railway vs. Render vs. Fly.io — evaluieren

---

## Entwicklungsreihenfolge (empfohlen)

1. **Projekt-Setup**: Vendure Server bootstrappen, PostgreSQL, Stripe Plugin, Wine Custom Fields konfigurieren, Astro Frontend mit Tailwind + Komponenten aus __Components__
2. **Weinshop**: Astro SSG Produktseiten via Vendure GraphQL, Warenkorb (ActiveOrder API), Checkout mit Stripe
3. **User-Bereich**: Vendure Customer Auth, Profil, Bestellhistorie
4. **Event-Buchungen**: Event Plugin, Kalender, Buchungsflow, Zahlung
5. **Rebstockmiete**: Subscription Plugin, Stripe Billing, Dashboard
6. **Etiketten-Designer**: Label Plugin, React Canvas Editor, PDF Export — komplexestes Modul zuletzt

---

## Verifikation

- Vendure Dev-Server: `bun run dev` (mit Watch-Mode)
- Vendure Admin UI: `localhost:3000/admin` — Produkte anlegen, Bestellungen prüfen
- Astro Dev-Server: `bun run dev` — Frontend gegen Vendure GraphQL API
- Stripe Test-Modus: Testkarten für Checkout, Test-Webhooks via Stripe CLI
- GraphQL Playground: Shop API + Admin API testen
- Jedes Plugin einzeln testbar via Vendure Testing Utilities (createTestEnvironment)
