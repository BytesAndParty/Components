# Wine-Showcase — Security Decisions Log

Application-Security folgt der Policy in
[`/Buchart58/docs-intern/architecture/security-compliance.md`](../../Buchart58/docs-intern/architecture/security-compliance.md).
Supply-Chain-Härtung wird zentral im Components-Repo abgedeckt:
[`/.github/SECURITY.md`](../.github/SECURITY.md), [`/bunfig.toml`](../bunfig.toml),
[`/.github/workflows/ci.yml`](../.github/workflows/ci.yml).

Dieses Dokument trackt, was im wine-showcase **konkret umgesetzt** wurde
und was **bewusst zurückgestellt** ist — mit Trigger, ab wann es relevant wird.

---

## Applied

### 2026-05-24 — Slug Allow-List Validation
- **Was:** [`wineHref()`](storefront/src/lib/utils.ts) + [`isValidWineSlug()`](storefront/src/lib/utils.ts) Regex `^[a-z0-9]+(?:-[a-z0-9]+)*$`, max 100 Zeichen.
- **Wo:** [`wine-card.tsx`](storefront/src/components/react/wine-card.tsx), [`cart.tsx`](storefront/src/components/react/cart.tsx), [`pages/wine/[slug].astro`](storefront/src/pages/wine/[slug].astro) `getStaticPaths`.
- **Verhindert:** `javascript:` / `data:` URIs, Path Traversal, Unicode-Look-alikes in Vendure-Slugs.
- **Verteidigung:** Build-time Filter + Render-time Validation (Defense in Depth).

### 2026-05-24 — Fabric.js Upgrade auf v7.4
- **Was:** `fabric: ^7` in Root-package.json, ersetzt v6.x.
- **Schließt:** GHSA-hfvx-25r5-qc3w (Fabric SVG-Export XSS) + zieht canvas/jsdom als Dependency raus → killt transitiv tar/ws-Vulns.
- **Audit-Stand danach:** 30 → 2 Vulns (nur noch moderate transitiv über ESLint-Stack).

---

## Deferred (bewusst zurückgestellt)

### XSS-Sanitization für Custom-Field-Beschreibungen (DOMPurify)
- **Aktueller Schutz:** React escapt alle gerenderten Strings automatisch
  ([`wine-card.tsx`](storefront/src/components/react/wine-card.tsx), [`wine-detail.tsx`](storefront/src/components/react/wine-detail.tsx)).
- **Warum nicht jetzt:** Alle Custom Fields (`geschmacksprofil`, `speiseempfehlung`, `description`)
  werden als Plaintext gerendert. Solange das Vendure-Admin-UI keine HTML/Rich-Text-Eingabe
  zulässt, ist Auto-Escaping ausreichend und der Sanitizer wäre toter Code.
- **Trigger zum Reaktivieren:**
  - Sobald irgendein Custom Field Markdown oder HTML enthalten darf,
  - oder sobald `dangerouslySetInnerHTML` für CMS-Inhalte gebraucht wird,
  - dann DOMPurify einbauen, neueste Version pinnen (CVE-Historie!), via Allow-List
    `ALLOWED_TAGS: ['p','strong','em','ul','li','br']`, `ALLOWED_ATTR: []`.

### Altersverifikation (AT/EU)
- **Status:** noch nicht implementiert. Recherche-Doc existiert: [`docs/altersverifikation.md`](docs/altersverifikation.md).
- **Warum nicht jetzt:** kein Checkout-Flow live, kein Produktivverkauf.
- **Trigger:** vor Launch / vor erstem echten Checkout. Pflicht in AT (Jugendschutzgesetz).

### Content Security Policy (CSP) Header
- **Aktueller Schutz:** keine inline-`<script>` außer Astro-eigenen Hydration-Bootstrap (von Astro signiert).
- **Warum nicht jetzt:** Astro ist auf `output: 'static'`; Headers müssten beim Host (CDN / Reverse Proxy) gesetzt werden, der noch nicht entschieden ist.
- **Trigger:** wenn Hosting steht (Cloudflare Pages / Netlify / nginx). Min. Set:
  `default-src 'self'`, `script-src 'self' 'unsafe-inline'` (Astro-Hydration), `img-src 'self' data: <vendure-asset-host>`, `connect-src 'self' <shop-api-host>`.

### Input-Validation für Filter/Suche (Zod)
- **Status:** Filter/Suche noch nicht gebaut.
- **Warum nicht jetzt:** Komponenten existieren nicht.
- **Trigger:** beim Bau von `WineFilter` / `WineSort` / Suche — URL-Params per Zod-Schema parsen, niemals direkt in GraphQL-Variablen oder DOM-Attribute durchreichen.

### Auth-Token-Storage (httpOnly Cookies statt localStorage)
- **Status:** Vendure-Auth läuft aktuell mit Bearer-Token im `Authorization` Header via urql.
- **Warum nicht jetzt:** Kein Login-Flow live, anonyme Cart-Session reicht.
- **Trigger:** sobald Login-Flow gebaut wird. Token-Cookie auf `httpOnly`, `Secure`, `SameSite=Lax`. CSRF-Token zusätzlich für state-changing Mutations (siehe Buchart58 §CSRF).

### DSGVO Consent / Cookie Banner
- **Status:** nicht implementiert.
- **Warum nicht jetzt:** keine Tracking-/Analytics-Cookies, nur Vendure-Session.
- **Trigger:** sobald Analytics, Marketing-Pixel, oder Drittanbieter-Skripte hinzukommen.

### Rate Limiting
- **Status:** nicht implementiert (Sache des Vendure-Servers / Reverse Proxy).
- **Trigger:** Production-Deploy.

---

## Nicht zutreffend (für dieses Projekt)

- **SQL Injection** — Vendure nutzt TypeORM, alle Queries gehen über parametrisierte Statements.
- **Server-Side XSS** — Astro rendert SSG statisch, keine Server-Templates mit User-Input.
- **Dangerous SVG Upload** — kein User-Upload im Storefront. Cellar-Canvas (in `components/`)
  hat eigene Mitigations via Fabric 7.4 (siehe oben).
