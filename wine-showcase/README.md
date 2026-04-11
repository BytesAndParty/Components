# Wine Showcase — Vendure.js Testprojekt

Testprojekt um **Vendure.js** als Headless-Commerce-Backend für den geplanten Wein-Onlineshop zu evaluieren.

## Was ist das?

- **`server/`** — Vendure.js Backend mit 10 weinspezifischen Custom Fields, SQLite DB, Admin UI
- **`storefront/`** — React 19 + Vite Storefront das über GraphQL mit Vendure kommuniziert

Die Storefront verwendet kopierte Komponenten aus der `components/` Library (shadcn-Style).

## Quick Start

```bash
# 1. Server starten
cd wine-showcase/server
bun install
bun run dev

# 2. In neuem Terminal: Testdaten anlegen
cd wine-showcase/server
bun run seed

# 3. In neuem Terminal: Storefront starten
cd wine-showcase/storefront
bun install
bun run dev
```

## URLs

| Service           | URL                              |
|-------------------|----------------------------------|
| Storefront        | http://localhost:5173            |
| Vendure Admin UI  | http://localhost:3002/admin      |
| Shop GraphQL API  | http://localhost:3000/shop-api   |
| Admin GraphQL API | http://localhost:3000/admin-api  |

**Admin Login:** `superadmin` / `superadmin`

## Verwendete Komponenten

Aus der `components/` Library (kopiert, nicht referenziert):

| Komponente         | Einsatz                                    |
|--------------------|--------------------------------------------|
| `GlowCard`         | Produktkarten mit Cursor-Glow              |
| `AddToCartButton`  | Animierter Add-to-Cart mit Cart-Animation  |
| `CartIcon`         | Header-Cart mit Badge-Bounce               |
| `ProductTag`       | NEU, Prämiert, Limitiert Tags              |
| `Rating`           | Sterne-Bewertung auf Produktkarten         |
| `MagneticButton`   | CTA-Buttons mit magnetischem Hover         |
| `AuroraText`       | Schimmernder Headline-Text                 |
| `TextScramble`     | Scramble-Reveal auf der Startseite         |
| `Toast`            | Feedback bei Add-to-Cart & Checkout        |
| `Stepper`          | Checkout-Flow (Adresse → Versand → Zahlung)|

## Vendure Custom Fields

10 weinspezifische Felder auf dem `Product`-Entity:

```
jahrgang (int) · rebsorte (string) · region (string)
alkoholgehalt (float) · geschmacksprofil (string)
restzucker (float) · saeure (float) · serviertemperatur (string)
speiseempfehlung (text) · auszeichnungen (text)
```

## Seed-Daten

8 österreichische Weine werden automatisch angelegt:

1. Grüner Veltliner Smaragd 2023 — € 24,90
2. Blaufränkisch Reserve 2021 — € 32,90
3. Riesling Federspiel 2023 — € 18,90
4. Zweigelt Classic 2022 — € 12,90
5. Rosé vom Zweigelt 2023 — € 11,90
6. Sauvignon Blanc Ried Steinberg 2022 — € 21,90
7. Cuvée Pannobile 2020 — € 45,90
8. Gelber Muskateller 2023 — € 14,90

## Erkenntnisse für das Endprojekt

- **Custom Fields** funktionieren nahtlos — werden automatisch im Admin UI sichtbar
- **GraphQL API** liefert Custom Fields über `customFields { ... }` mit
- **Admin UI** ist sofort nutzbar für Produktverwaltung
- **Plugin-System** (NestJS) ermöglicht saubere Trennung von Custom-Features
- **SQLite** für Entwicklung, PostgreSQL für Produktion (nur Config-Wechsel)
- **ActiveOrder API** für Warenkorb — kein zusätzlicher State nötig
