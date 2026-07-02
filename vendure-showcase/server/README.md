# Wine Showcase — Server

Vendure-basierter E-Commerce-Backend für den Wine Showcase. Stellt Shop-API und Admin-UI bereit.

---

## Stack

| Komponente | Details |
|---|---|
| Framework | [Vendure](https://vendure.io) v3.6.4 (NestJS-basiert) |
| Datenbank (Lokal) | SQLite via `better-sqlite3` — kein Setup nötig |
| Datenbank (Produktion) | PostgreSQL 16 |
| Container | Podman (`podman compose`) |
| Sprache | TypeScript (ESM) |

---

## Datenbank

Der Server erkennt anhand der Umgebungsvariable `DB_TYPE`, welche Datenbank er verwendet:

```
DB_TYPE=         → SQLite  (Standard, für lokale Entwicklung)
DB_TYPE=postgres → PostgreSQL (für Podman / Produktion)
```

**SQLite** (lokal): Die Datenbankdatei liegt unter `data/vendure.sqlite` und wird beim ersten Start automatisch angelegt. Kein separater Datenbankprozess nötig.

**PostgreSQL** (Podman): Läuft als eigenständiger Container. Der Server wartet per `healthcheck` auf die Datenbank, bevor er startet. Tabellen werden via `synchronize: true` automatisch erstellt (nur in Nicht-Produktionsumgebungen).

---

## Lokale Entwicklung (SQLite)

```bash
# In dieses Verzeichnis wechseln
cd vendure-showcase/server

# Abhängigkeiten installieren
bun install

# Umgebungsvariablen anlegen
cp .env.example .env

# Server starten (tsx watch — Hot Reload)
bun run dev
```

Server läuft auf:
- **Shop API** → `http://localhost:3000/shop-api`
- **Admin API** → `http://localhost:3000/admin-api`

### React Dashboard starten (separater Vite Dev Server)

```bash
# Terminal 2 (parallel zum Server)
bun run dashboard
```

Dashboard erreichbar unter `http://localhost:5173/dashboard/` — Login: `superadmin` / `superadmin`

> Im Dev-Modus läuft das Dashboard als eigenständiger Vite-Prozess mit HMR. Im Production-Build (`bun run dashboard:build`) wird es statisch von Vendure unter `/dashboard/` serviert.

### Weine anlegen (Seed)

Der Seed läuft gegen die laufende Admin API — der Server muss also zuerst gestartet sein:

```bash
# Terminal 1
bun run dev

# Terminal 2
bun run seed
```

> Bei einem Vendure-Major-Upgrade (z.B. 3.2 → 3.6): SQLite-DB löschen (`data/vendure.sqlite`) und Seed neu durchlaufen, da Schema-Migrationen nicht automatisch auf bestehenden Daten ausgeführt werden.

Das Skript legt beim ersten Aufruf automatisch an:
- Land (Österreich) + Zone (Europe)
- Tax Category + Tax Rate (20%)
- Shipping Method
- 8 österreichische Weine mit Custom Fields

Bereits vorhandene Produkte werden übersprungen (idempotent).

---

## Podman (PostgreSQL)

### Voraussetzungen

```bash
# Podman installieren (macOS)
brew install podman podman-compose

# Podman Machine initialisieren (einmalig)
podman machine init
podman machine start
```

### Starten

```bash
cd vendure-showcase/server

# Container bauen und starten (DB + Server)
podman compose up --build
```

Beim ersten Start:
1. PostgreSQL-Container startet und initialisiert die Datenbank
2. Server wartet auf den DB-Healthcheck
3. Vendure erstellt alle Tabellen automatisch (`synchronize: true`)
4. Admin UI und APIs sind erreichbar

### Weine seeden (nach Podman-Start)

Der Seed läuft gegen die Admin API — also auch wenn der Server in Podman läuft:

```bash
# Lokale bun-Installation verwenden, Server aber in Podman
bun run seed
```

### Stoppen

```bash
podman compose down          # Container stoppen (Daten bleiben erhalten)
podman compose down -v       # Container + Volumes löschen (DB zurücksetzen)
```

### Nur die Datenbank in Podman (Server lokal)

Praktisch während der Entwicklung:

```bash
# Nur DB-Container starten
podman compose up db

# Server lokal mit PostgreSQL-Verbindung starten
DB_TYPE=postgres DB_HOST=localhost bun run dev
```

---

## API-Endpunkte

### Shop API (`/shop-api`) — für den Storefront

Alle Weine abfragen:
```graphql
query {
  products {
    items {
      id name slug description
      customFields {
        jahrgang rebsorte region alkoholgehalt
        geschmacksprofil restzucker saeure
        serviertemperatur speiseempfehlung auszeichnungen
      }
      variants { id name sku priceWithTax stockLevel }
    }
  }
}
```

In den Warenkorb legen:
```graphql
mutation {
  addItemToOrder(productVariantId: "1", quantity: 1) {
    ... on Order { id totalWithTax totalQuantity }
    ... on ErrorResult { errorCode message }
  }
}
```

### Admin API (`/admin-api`) — für Verwaltung

Authentifizierung:
```graphql
mutation {
  login(username: "superadmin", password: "superadmin") {
    ... on CurrentUser { id identifier }
  }
}
```

---

## Custom Fields (Wein-Metadaten)

Alle Custom Fields sind auf dem `Product`-Typ definiert:

| Field | Typ | Beschreibung |
|---|---|---|
| `jahrgang` | `int` | Erntejahr |
| `rebsorte` | `string` | Traubensorte |
| `region` | `string` | Anbaugebiet |
| `alkoholgehalt` | `float` | Alkohol in % |
| `geschmacksprofil` | `string` | Kurzbeschreibung Geschmack |
| `restzucker` | `float` | Restzucker in g/l |
| `saeure` | `float` | Säure in g/l |
| `serviertemperatur` | `string` | z.B. `8–10 °C` |
| `speiseempfehlung` | `text` | Empfohlene Speisen |
| `auszeichnungen` | `text` | Preise und Bewertungen |

---

## Storefront-Verbindung

Der Vite-Dev-Server des Storefronts (`vendure-showcase/storefront`) proxied `/shop-api` automatisch auf `localhost:3000`. Kein CORS-Problem im Dev-Modus.

```bash
# Server starten
cd vendure-showcase/server && bun run dev

# Storefront starten (neues Terminal)
cd vendure-showcase/storefront && bun run dev
```

Storefront läuft auf `http://localhost:5173`.

---

## Umgebungsvariablen

Alle verfügbaren Variablen — siehe [.env.example](.env.example).

| Variable | Standard | Beschreibung |
|---|---|---|
| `DB_TYPE` | `""` (SQLite) | `postgres` für PostgreSQL |
| `DB_HOST` | `localhost` | Datenbank-Host |
| `DB_PORT` | `5432` | Datenbank-Port |
| `DB_NAME` | `wine_server` | Datenbank-Name |
| `DB_USER` | `vendure` | Datenbank-User |
| `DB_PASSWORD` | `vendure_pw` | Datenbank-Passwort |
| `PORT` | `3000` | Server-Port |
| `CORS_ORIGINS` | `localhost:5173,...` | Erlaubte Origins (kommagetrennt) |
| `SUPERADMIN_USERNAME` | `superadmin` | Admin-Login |
| `SUPERADMIN_PASSWORD` | `superadmin` | Admin-Passwort |
| `COOKIE_SECRET` | dev-secret | In Produktion ändern! |
| `NETLIFY_BUILD_HOOK_URL` | `""` | Netlify Build Hook für den „Veröffentlichen"-Button (s.u.) |

---

## Storefront veröffentlichen (manueller Rebuild)

Die Storefront rendert die Wein-Daten zur **Build-Zeit** in Astro. Änderungen im Dashboard
(Bestand, Preis, Custom Fields, neue Produkte) werden erst nach einem **Rebuild + Deploy**
der statischen Seite live — es gibt bewusst keine Live-Abfrage zur Laufzeit.

Dafür gibt es einen **„Veröffentlichen"-Button** in der Produkt-Liste des Dashboards
(`StorefrontDeployPlugin`):

1. Netlify → Site settings → Build & deploy → Build hooks → **Add build hook**, URL kopieren.
2. In `.env`: `NETLIFY_BUILD_HOOK_URL=https://api.netlify.com/build_hooks/…`
3. Im Dashboard (`/dashboard/`, Produkte-Liste) → **Veröffentlichen** klicken.

Der Button ruft die Admin-API-Mutation `triggerStorefrontRebuild` auf; der Server POSTet
serverseitig auf den Build-Hook (die URL bleibt geheim, nie im Client-Bundle). 30-Sekunden-
Cooldown verhindert versehentliche Doppel-Builds. Ohne gesetzte Env-Var meldet der Button
„Kein Build-Hook konfiguriert".

> Zugriff via Custom-Permission `TriggerStorefrontRebuild` (SuperAdmin hat sie automatisch).
> API-Details: `live-docs-collection/vendure-dashboard-extensions/` (im `__AI-Workflow__`-Workspace).
