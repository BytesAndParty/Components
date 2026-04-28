# Wine Showcase — Server

Vendure-basierter E-Commerce-Backend für den Wine Showcase. Stellt Shop-API und Admin-UI bereit.

---

## Stack

| Komponente | Details |
|---|---|
| Framework | [Vendure](https://vendure.io) v3 (NestJS-basiert) |
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
cd wine-showcase/server

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
- **Admin UI** → `http://localhost:3002/admin` (Login: `superadmin` / `superadmin`)

### Weine anlegen (Seed)

Der Seed läuft gegen die laufende Admin API. Der Server muss also zuerst gestartet sein:

```bash
# Terminal 1
bun run dev

# Terminal 2
bun run seed
```

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
cd wine-showcase/server

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

Der Vite-Dev-Server des Storefronts (`wine-showcase/storefront`) proxied `/shop-api` automatisch auf `localhost:3000`. Kein CORS-Problem im Dev-Modus.

```bash
# Server starten
cd wine-showcase/server && bun run dev

# Storefront starten (neues Terminal)
cd wine-showcase/storefront && bun run dev
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
| `ADMIN_PORT` | `3002` | Admin-UI-Port |
| `CORS_ORIGINS` | `localhost:5173,...` | Erlaubte Origins (kommagetrennt) |
| `SUPERADMIN_USERNAME` | `superadmin` | Admin-Login |
| `SUPERADMIN_PASSWORD` | `superadmin` | Admin-Passwort |
| `COOKIE_SECRET` | dev-secret | In Produktion ändern! |
