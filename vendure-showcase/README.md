# Wine Showcase — Vendure.js Testprojekt

Testprojekt um **Vendure.js** als Headless-Commerce-Backend für den geplanten Wein-Onlineshop zu evaluieren.

## Was ist das?

- **`server/`** — Vendure.js Backend mit 10 weinspezifischen Custom Fields, SQLite DB, React Dashboard (`@vendure/dashboard` v3.6.4)
- **`storefront/`** — React 19 + Vite Storefront das über GraphQL mit Vendure kommuniziert

Die Storefront verwendet kopierte Komponenten aus der `components/` Library (shadcn-Style).

## Quick Start

```bash
# 1. Server starten
cd vendure-showcase/server
bun install
bun run dev

# 2. In neuem Terminal: Testdaten anlegen (Server muss laufen)
cd vendure-showcase/server
bun run seed

# 3. In neuem Terminal: React Dashboard (Vite Dev Server)
cd vendure-showcase/server
bun run dashboard

# 4. In neuem Terminal: Storefront starten
cd vendure-showcase/storefront
bun install
bun run dev
```

## URLs

| Service              | URL                                      |
|----------------------|------------------------------------------|
| Storefront           | http://localhost:5173                    |
| React Dashboard      | http://localhost:5173/dashboard/ (dev)   |
| Shop GraphQL API     | http://localhost:3000/shop-api           |
| Admin GraphQL API    | http://localhost:3000/admin-api          |

> **Dashboard im Dev-Modus:** Der Vite-Dev-Server des Dashboards läuft standardmäßig auf Port 5173 (gleicher Port wie Storefront-Dev, aber separates Projekt). Beide gleichzeitig: Dashboard-Vite startet auf dem nächstverfügbaren Port (5174 o.Ä.).

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
- **React Dashboard** (`@vendure/dashboard`) ist sofort nutzbar für Produktverwaltung — React 19 + TanStack-basiert
- **Plugin-System** (NestJS) ermöglicht saubere Trennung von Custom-Features
- **SQLite** für Entwicklung, PostgreSQL für Produktion (nur Config-Wechsel)
- **ActiveOrder API** für Warenkorb — kein zusätzlicher State nötig
