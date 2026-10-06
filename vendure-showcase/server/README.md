# Wine Showcase — Server

Vendure-basierter E-Commerce-Backend für den Wine Showcase. Stellt Shop-API und Admin-UI bereit.

---

## Stack

| Komponente | Details |
|---|---|
| Framework | [Vendure](https://vendure.io) v3.7.4 (NestJS-basiert) |
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

> Bei einem Vendure-Minor-/Major-Upgrade mit Schema-Änderungen (z.B. 3.2 → 3.6): SQLite-DB löschen (`data/vendure.sqlite`) und Seed neu durchlaufen, da Schema-Migrationen nicht automatisch auf bestehenden Daten ausgeführt werden.

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

## Deploy auf den VPS

Der Server läuft öffentlich auf dem Contabo-VPS von Buchart58, als eigener Stack neben
Buchart58-Staging. Die Storefront wird **nicht** deployt, sie bleibt lokal.

| | |
|---|---|
| URL | https://vendure-showcase.169-58-203-37.sslip.io (`/` leitet auf `/dashboard/` um) |
| Endpunkte | `/dashboard/`, `/shop-api`, `/admin-api`, `/assets/…` |
| Hostname | [sslip.io](https://sslip.io) löst den Namen ohne DNS-Eintrag auf die VPS-IP auf, Caddy holt das Zertifikat |
| Stack | `compose.prod.yaml`: Server + Postgres 18, Podman rootless als `deploy` unter `~/vendure-showcase/` |
| Netz | Caddy → `127.0.0.1:3010`. Postgres nur im Pod-Netz |
| Secrets | `~/vendure-showcase/.env.prod` auf dem Server (nur `deploy` lesbar), nie im Repo |

Server, Zugänge, Caddy und Podman-Eigenheiten sind im Buchart58-Repo dokumentiert
(`vault/Decisions/hosting-deployment.md`, `vault/Learnings/podman/podman-auf-dem-vps.md`).
Der SSH-Key braucht eine Passphrase, vorher einmal `ssh-add --apple-use-keychain ~/.ssh/buchart58_vps`.

### Einmalig: Stack-Verzeichnis, Secrets, Caddy

```bash
# Als deploy: Verzeichnis + .env.prod mit Zufallswerten (Passwörter nie in einen Chat kopieren)
ssh -i ~/.ssh/buchart58_vps deploy@169.58.203.37 'mkdir -p ~/vendure-showcase && cd ~/vendure-showcase && umask 077 && cat > .env.prod <<EOF
DB_NAME=vendure_showcase
DB_USER=vendure
DB_PASSWORD=$(openssl rand -hex 24)
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=$(openssl rand -hex 16)
COOKIE_SECRET=$(openssl rand -hex 32)
PUBLIC_API_URL=https://vendure-showcase.169-58-203-37.sslip.io
EOF'

# Als ops: Site-Block an /etc/caddy/Caddyfile anhängen, dann validieren + reload
#   vendure-showcase.169-58-203-37.sslip.io {
#       redir / /dashboard/
#       reverse_proxy 127.0.0.1:3010
#   }
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile && sudo systemctl reload caddy
```

### Deployen (vom Repo-Root auf dem Laptop)

```bash
# 1. Code auf den Server (ohne node_modules, Builds, Daten, .env)
rsync -az --delete --exclude node_modules --exclude dist --exclude data --exclude .vendure \
  --exclude .tanstack --exclude .env --exclude src/gql --exclude .DS_Store \
  -e "ssh -i ~/.ssh/buchart58_vps" vendure-showcase/server/ deploy@169.58.203.37:/home/deploy/vendure-showcase-build/

# 2. Image auf dem Server bauen (nicht lokal: Cross-Build auf Apple Silicon läuft in Speichermangel).
#    --ulimit ist Pflicht, sonst scheitert der Dashboard-Build (siehe Kopf des Containerfile)
ssh -i ~/.ssh/buchart58_vps deploy@169.58.203.37 \
  "cd ~/vendure-showcase-build && podman build --ulimit nofile=65536:65536 -f Containerfile -t vendure-showcase-server ."

# 3. Stack neu erzeugen. Output verwerfen: podman-compose gibt Secrets im Klartext aus
ssh -i ~/.ssh/buchart58_vps deploy@169.58.203.37 \
  "cp ~/vendure-showcase-build/compose.prod.yaml ~/vendure-showcase/ && cd ~/vendure-showcase \
   && podman compose -f compose.prod.yaml --env-file .env.prod up -d --force-recreate >/dev/null 2>&1; podman ps"

# 4. Seed (idempotent). Läuft im Server-Container: tsc hat seed.ts nach dist/seed.js gebaut,
#    Superadmin-Login und localhost:3000 sind dort schon gesetzt. Kein bun install auf dem Host
ssh -i ~/.ssh/buchart58_vps deploy@169.58.203.37 \
  "podman exec vendure-showcase-server node dist/seed.js"

# Superadmin-Passwort nachsehen: nur selbst, nie in einen Chat
ssh -i ~/.ssh/buchart58_vps deploy@169.58.203.37 "grep SUPERADMIN_ ~/vendure-showcase/.env.prod"
```

**Bekannte Grenzen:** Die DB-Tabellen entstehen per `synchronize: true` (keine Migrationen),
nach einem Vendure-Upgrade mit Schema-Änderung also Volume löschen und neu seeden. Nach einem
Reboot des VPS startet der Stack nicht von selbst (rootless Podman ohne systemd-Unit, offen wie
bei Buchart58). Der „Veröffentlichen"-Button meldet „Kein Build-Hook konfiguriert", weil keine
Storefront deployt ist.

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

Die Storefront (`vendure-showcase/storefront`, Astro) ruft die Shop API direkt unter `http://localhost:3000/shop-api` auf (`src/lib/vendure-client.ts`, mit `credentials: 'include'`). Das funktioniert, weil der Server CORS mit `origin: true` und `credentials: true` erlaubt. Asset-URLs liefert Vendure ebenfalls absolut auf Port 3000 aus — ein Dev-Proxy ist nicht nötig.

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
| `CORS_ORIGINS` | `""` | Allow-List (kommagetrennt), wirkt nur mit `NODE_ENV=production`. In dev ist jede Origin erlaubt. Leer in Produktion → kein Cross-Origin-Zugriff |
| `PUBLIC_API_URL` | `""` | Öffentliche Basis-URL hinter Caddy (nur Produktion), daraus wird der `assetUrlPrefix` |
| `SUPERADMIN_USERNAME` | `superadmin` | Admin-Login, auch vom Seed genutzt |
| `SUPERADMIN_PASSWORD` | `superadmin` | Admin-Passwort, auch vom Seed genutzt. Greift nur beim ersten Start mit leerer DB |
| `COOKIE_SECRET` | `dev-secret` | In Produktion ändern! |
| `ADMIN_URL` | `http://localhost:3000/admin-api` | Nur Seed: Admin-API, gegen die geseedet wird |
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
