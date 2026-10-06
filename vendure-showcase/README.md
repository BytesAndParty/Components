# Wine Showcase — Vendure.js Testprojekt

Testprojekt um **Vendure.js** als Headless-Commerce-Backend für den geplanten Wein-Onlineshop zu evaluieren.

## Was ist das?

- **`server/`** — Vendure.js Backend mit 10 weinspezifischen Custom Fields, SQLite DB, React Dashboard (`@vendure/dashboard` v3.7.4)
- **`storefront/`** — Astro-Storefront (`output: 'static'`) mit React-19-Inseln, die über GraphQL mit Vendure kommuniziert. Weindaten werden zur Build-Zeit gerendert (siehe [ARCHITECTURE.md](./ARCHITECTURE.md)).

Die Storefront bindet Komponenten aus der `components/` Library direkt über den Alias `@components` ein (Bun-Workspace) — nichts wird kopiert.

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
#    (Abhängigkeiten kommen über `bun install` im Repo-Root — die Storefront ist ein Workspace)
cd vendure-showcase/storefront
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

**Admin Login (lokal):** `superadmin` / `superadmin`

## Deploy unter `/shop/`

Die Storefront ist Teil des kombinierten Netlify-Deploys (`scripts/build-all.mjs`, `netlify.toml` im Repo-Root) und liegt dort unter `/shop/`. Der Launcher verlinkt sie in Prod. Der Vendure-Server läuft auf dem VPS unter `https://vendure-showcase.169-58-203-37.sslip.io` (siehe [server/README.md](./server/README.md)).

- **Build-Zeit:** Astro rendert Katalog und Weinseiten statisch und holt die Daten direkt vom VPS. Ist der Server beim Build nicht erreichbar, bricht der Storefront-Build ab und mit ihm der ganze Deploy.
- **Browser:** Warenkorb, Filter und Login rufen die Shop-API same-origin unter `/shop-api` auf, `netlify.toml` proxied das auf den VPS. So bleibt die anonyme Session-Cookie des Warenkorbs First-Party, cross-site würden Safari und Firefox sie blockieren.
- **Neue oder geänderte Weine** im Dashboard erscheinen auf den statischen Seiten erst nach einem neuen Netlify-Build.
- **Interne Links** laufen alle über `withBase()` aus `src/lib/utils.ts`, nie als festes `/…`.

Env-Variablen der Storefront (alle optional, ohne Env läuft alles lokal wie bisher):

| Variable | Wirkung | Lokal (Default) | Deploy (`build-all.mjs`) |
|---|---|---|---|
| `DEPLOY_SUBPATH` | Astro `base` | nicht gesetzt (`/`) | `/shop` |
| `VENDURE_SHOP_API_URL` | Shop-API für den Build (Node), absolut | `http://localhost:3000/shop-api` | `https://vendure-showcase.169-58-203-37.sslip.io/shop-api` |
| `PUBLIC_SHOP_API_URL` | Shop-API im Browser, relativ = same-origin | `http://localhost:3000/shop-api` | `/shop-api` |
| `PUBLIC_VENDURE_URL` | Basis-URL für Dashboard- und API-Links auf `/admin-info`. Gesetzt blendet den Dev-Login aus | `http://localhost:3000` | `https://vendure-showcase.169-58-203-37.sslip.io` |

Lokal ändert sich nichts: Quick Start wie oben, die Storefront läuft auf `/` gegen `localhost:3000`. Den Deploy-Build nachstellen (VPS muss erreichbar sein):

```bash
bun run build:all   # im Repo-Root, Ergebnis in ./dist, Storefront in dist/shop/
```

## Verwendete Komponenten

Aus der `components/` Library, eingebunden über `@components/…`:

| Komponente | Einsatz |
|---|---|
| `atelier` | `AtelierProvider` + Theme-/Akzent-/Sprach-State für Header-Toggles |
| `i18n` | Lokalisierte Texte (`de`/`en`) |
| `shape-card` | Wein-Karten und Detailansicht |
| `checkbox` | Filter im Sortiment (`FilterDrawer`) |
| `breadcrumb` | Navigation auf der Detailseite |

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
