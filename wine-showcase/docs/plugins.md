# Vendure Plugins — Wine Showcase

Übersicht nützlicher Vendure Plugins für den Wine Shop, gruppiert nach Priorität und Einsatzzweck.

> ⚠️ **Caveat:** Das Vendure-Ecosystem bewegt sich schnell. Aktuell nutzen wir Vendure `3.2.2`. Vor jeder Installation Kompatibilität im jeweiligen GitHub-Repo prüfen und exakten Paketnamen per `bun info <paket>` gegenchecken.

---

## Aktuell installiert

Stand laut [wine-showcase/server/package.json](../server/package.json):

- `@vendure/core` — Basis
- `@vendure/admin-ui-plugin` — Admin-Interface
- `@vendure/asset-server-plugin` — Image-Handling + Thumbnails

---

## Tier 1 — Offizielle Plugins (`@vendure/*`)

| Plugin | Zweck | Wine-Shop Empfehlung |
|---|---|---|
| `email-plugin` | Transaktionsmails (Bestellbestätigung, Versand, Passwort-Reset) via Handlebars-Templates | **Pflicht** |
| `payments-plugin` | Fertige Integrationen für Stripe / Mollie / Braintree | **Pflicht** — Mollie für AT/DE |
| `job-queue-plugin` | BullMQ/Redis-basierte Job Queue (Default ist nur In-Memory) | **Pflicht für Prod** |
| `harden-plugin` | Production-Härtung der GraphQL API: Query-Complexity, Introspection off | **Pflicht für Prod** |
| `elasticsearch-plugin` | Volltext-Suche + Facet-Aggregation | Optional (ab ~1000 Produkten) |
| `sentry-plugin` | Error-Tracking | Empfehlenswert |
| `graphiql-plugin` | GraphQL Playground direkt im Admin | Nice-to-have für Dev |
| `scheduler-plugin` | Cron-basierte Tasks (braucht es für Geburtstagsgutscheine) | Prüfen ob in 3.2 verfügbar |
| `telemetry-plugin` | Usage-Metriken | Optional |

---

## Tier 2 — Community Plugins (v.a. Pinelab)

Die meisten guten Community Plugins kommen von **Pinelab** (`@pinelab/vendure-plugin-*`).

### Sehr empfohlen

- **invoices** — PDF-Rechnungen (UStG-konform für Österreich). **Pflicht für AT.**
- **stock-monitoring** — Back-in-Stock Benachrichtigungen. Wichtig bei limitierten Jahrgängen!
- **order-export** — CSV/Excel Export für Steuerberater
- **metrics** — Dashboard mit Sales-Charts im Admin UI
- **webhook** — Events nach außen pushen (Slack, Zapier, n8n)
- **customer-managed-groups** — Kunden können selbst Gruppen verwalten (z.B. B2B-Sub-Accounts)

### Versand / Fulfillment

- **sendcloud** — Versandetiketten-Druck
- **shipmate** — Multi-Carrier Shipping
- **picqer** — Warehouse Management

### Marketing

- **klaviyo** — Marketing-Automation-Sync
- **admin-ui-helpers** — Extra-Buttons im Admin (z.B. "Order duplizieren")
- **variant-bulk-update** — Preise/Stock für viele Varianten auf einmal

### Infrastruktur

- **google-cloud-tasks** — Job Queue ohne Redis (wenn auf GCP gehostet)

---

## Tier 3 — Custom Plugins (selbst bauen)

Für Wein-spezifisches gibt es keine Standard-Plugins. Das bauen wir selbst:

- **`AgeVerificationPlugin`** — Checkout-Gate + Strategy Pattern für versch. Verifikationsmethoden
  → siehe [altersverifikation.md](./altersverifikation.md)
- **`BirthdayPromotionPlugin`** — Scheduler-basierte Geburtstagsgutscheine mit eindeutigen Coupon-Codes
- **`WineClubPlugin`** — Abo-Lieferungen (monatlich/quartalsweise)
- **`TemperatureShippingPlugin`** — Versandlogik "kein Versand bei > 30 °C / < 0 °C" für temperaturempfindliche Weine
- **`WinemakerOriginPlugin`** — Dropshipping-Unterstützung direkt vom Winzer (mehrere Lagerorte)

---

## Empfohlene Installations-Reihenfolge

```
1. @vendure/email-plugin              → Transaktionsmails
2. @vendure/payments-plugin           → Mollie-Integration
3. @vendure/job-queue-plugin          → Redis-backed Queue
4. @vendure/harden-plugin             → Security
5. @pinelab/.../invoices              → PDF-Rechnungen
6. @pinelab/.../stock-monitoring      → Back-in-stock
7. Custom AgeVerificationPlugin       → (selbst gebaut)
8. Custom BirthdayPromotionPlugin     → (selbst gebaut)
```

**Grundsatz:** Plugins nur installieren, wenn der konkrete Bedarf auftaucht — nicht vorsorglich. Das Einbinden ist billig, aber jedes installierte Plugin ist Wartungs-Overhead.

---

## Referenzen

- Vendure Docs: https://docs.vendure.io
- Vendure Plugin Marketplace: https://vendure.io/marketplace
- Pinelab Plugins: https://github.com/Pinelab-studio/pinelab-vendure-plugins
