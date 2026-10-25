> Generiert aus der live-docs-collection (skills/live-docs-collection/vendure-dashboard-extensions/vendure-dashboard-extensions.md) am 2026-09-16. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# Vendure Dashboard Extensions (React)

## Neu in 3.7.0 — was tatsächlich Arbeit spart

- **Eigene React-Provider um das Dashboard legen** (#4600) — Extensions können das Dashboard jetzt
  mit eigenem Context wrappen (z. B. für einen eigenen Query-Client-Scope oder Theme-Provider), ohne
  den Dashboard-Baum zu forken.
- **User-Stylesheets in den Dashboard-Build** (#4905) — eigenes CSS lässt sich direkt in den Build
  einspeisen, statt es nachträglich per Runtime-Injection einzuschleusen.
- **TanStack-Router-Plugin-Optionen konfigurierbar** (#4862) — Router-Verhalten anpassbar, ohne die
  Plugin-Config zu forken.
- **Vorgebündeltes Dashboard** über `useExperimentalBundle`-Opt-in (#4719/#4720) — spürbar schnellere
  Build-Zeiten bei aktiven Extensions, noch experimentell.
- **Focal-Point-Editor im Asset-Preview-Dialog** (#4755) — Bildausschnitt direkt im Dashboard setzen,
  keine externe Bildbearbeitung mehr nötig für den Fokuspunkt.
- Seit 3.6.5: **`requiresPermissions` an Dashboard-Widgets** (#4627) — Widget-Sichtbarkeit direkt über
  Rollen steuerbar, ohne eigene Sichtbarkeits-Logik im Widget selbst.
- Seit 3.6.1: **Zod v4 wird von `@vendure/dashboard` re-exportiert** (#4607) — Formular-Validierung in
  Extensions ohne eigene Zod-Dependency/Versionsabstimmung.

Das **neue React-Dashboard** (`@vendure/dashboard`, GA seit 3.3, hier 3.6.4) ersetzt die
Legacy-Angular-Admin-UI (`@vendure/admin-ui-plugin`, siehe
[vendure-admin-ui-extensions](../vendure-admin-ui-extensions/vendure-admin-ui-extensions.md)).
Extensions sind reine React/Vite-Module — **kein** Angular, **kein** `ui-devkit` mehr.

## Quick Reference

### 1. Plugin verdrahtet die Extension

Das Plugin zeigt per `dashboard`-Property auf eine Entry-Datei (Pfad relativ zur Plugin-Datei):

```ts
@VendurePlugin({
  imports: [PluginCommonModule],
  adminApiExtensions: { schema, resolvers: [...] }, // optionale API-Erweiterung
  dashboard: './dashboard/index.tsx',
})
export class MyPlugin {}
```

Konvention: `src/plugins/<plugin-name>/dashboard/index.tsx`.
Scaffold: `npx vendure add --dashboard MyPlugin`.

### 2. Entry-Point: `defineDashboardExtension`

Jede Extension ruft **genau einmal** `defineDashboardExtension({...})`. Extension-Points:
`actionBarItems`, `routes`, `pageBlocks`, `navSections`, `customFormComponents`, `dataTables`, …

```tsx
import { defineDashboardExtension } from '@vendure/dashboard';
defineDashboardExtension({ actionBarItems: [/* … */] });
```

### 3. Action-Bar-Button (CTA-Leiste oben auf einer Seite)

```ts
interface DashboardActionBarItem {
  pageId: string;                 // z.B. 'product-list', 'product-detail', 'order-list'
  component: React.FunctionComponent<{ context: PageContextValue }>;
  type?: 'button' | 'dropdown';   // default 'button'
  requiresPermission?: string | string[];  // Permission-NAME(n) als String
  id?: string;                    // seit 3.5.2
  position?: ActionBarItemPosition; // seit 3.5.2 (itemId + order)
}
```

- `context` liefert `entity`, `form`, Route-Infos der aktuellen Seite (bei Detail-Seiten).
- `requiresPermission` nimmt den **String-Namen** der Permission — **nicht** das
  `PermissionDefinition`-Objekt importieren (zöge `@vendure/core` ins Browser-Bundle).

### 4. Mutation/Query aus einer Extension

Datenzugriff läuft über TanStack Query + `api` (NICHT `fetch` gegen die Admin-API von Hand):

```tsx
import { api, useMutation, useQueryClient, toast } from '@vendure/dashboard';
import { graphql } from '@/gql';   // typed-document-Funktion, per Vite-Codegen generiert

const updateProduct = graphql(`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) { id name slug }
  }
`);

function Form({ product }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input) => api.mutate(updateProduct, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (error) => toast.error('Failed to update product', { description: error.message }),
  });
  // mutation.mutate({...}); mutation.isPending; …
}
```

- `api.query(doc, vars)` / `api.mutate(doc, vars)` — die GraphQL-Transport-Funktionen.
- `graphql` kommt aus `@/gql` (Codegen-Output, `gqlOutputPath` in `vite.config`), **nicht**
  aus `@vendure/dashboard`. `useMutation`/`useQuery`/`useQueryClient`/`toast`/`api`/`Button`
  kommen aus `@vendure/dashboard`.
- `toast` ist Sonner; verlässlich dokumentiert sind `toast.success(msg)` und
  `toast.error(msg, { description })`.

## Setup (vendure-showcase)

- `vite.config.mts` → `vendureDashboardPlugin({ vendureConfigPath, gqlOutputPath: './src/gql' })`.
- `tsconfig.dashboard.json` typecheckt **nur** `src/plugins/**/dashboard/*` + `src/gql/**`,
  mit Aliassen `@/gql` und `@/vdb/*`.
- Die Server-`tsconfig.json` **excludet** `src/plugins/**/dashboard/*` — Dashboard-Code wird
  also nicht vom Server-`tsc` geprüft, sondern beim `vite build` (inkl. Codegen).
- Custom Admin-API-Mutationen sind im typed `graphql()` erst nach einem Codegen-Lauf
  (`bun run dashboard:build` / Dev-Server) typsicher — zur Laufzeit funktioniert der Aufruf
  vorher schon (das Dokument wird nur geparst).

## Migration Notes (Angular Legacy → React)

| Legacy (`@vendure/admin-ui-plugin`) | Neu (`@vendure/dashboard`) |
|---|---|
| `addActionBarItem()` (Angular Provider) | `actionBarItems` in `defineDashboardExtension` |
| `@vendure/ui-devkit` Compiler | reines Vite-Build, kein devkit |
| `DataService` (Angular DI) | `api.query` / `api.mutate` + TanStack Query |
| `registerRouteComponent` | `routes` in `defineDashboardExtension` |
| RxJS Observables | Promises + React Query |

## Gotchas

- **`pageId` muss exakt stimmen**, sonst erscheint der Button **stumm nicht** (keine
  Fehlermeldung). Catalog-Liste = `product-list`.
- `requiresPermission` als **String** übergeben, Permission-Objekt-Import vermeiden.
- Custom-Permissions zuerst serverseitig via `new PermissionDefinition({ name })` +
  `config.authOptions.customPermissions.push(...)` registrieren; `name` ist der String,
  den `requiresPermission` erwartet. SuperAdmin besitzt jede Custom-Permission automatisch.
- `PermissionDefinition` exponiert **kein** public `.name` — für Vergleiche `.Permission`
  nutzen (Getter, gibt den Namen als `Permission` zurück).
