# StorefrontDeployPlugin — STATUS

> Stand: 2026-07-02 · manueller „Veröffentlichen"-Button (Dashboard → Netlify Rebuild)

## Implementiert ✅
- Admin-API-Mutation `triggerStorefrontRebuild` + `StorefrontDeployService` (serverseitiger
  POST auf `NETLIFY_BUILD_HOOK_URL`, 30s-Cooldown).
- Custom-Permission `TriggerStorefrontRebuild` (idempotent registriert; SuperAdmin hat sie).
- Dashboard-Action-Bar-Button in der Produkt-Liste (`pageId: 'product-list'`).
- Plugin in `vendure-config.ts` registriert, `NETLIFY_BUILD_HOOK_URL` in `.env.example`.
- Server-`tsc`: exit 0.

## Offen — muss noch verifiziert werden ⚠️
1. **`bun run dashboard:build`** durchlaufen lassen — die `dashboard/index.tsx` ist vom
   Server-`tsc` ausgeschlossen; der typed `graphql()`-Aufruf braucht erst Codegen. Noch nie
   gebaut → hier zeigt sich, ob alles kompiliert.
2. **`pageId: 'product-list'`** prüfen — erscheint der Button? Bei falscher `pageId` fehlt er
   **stumm** (keine Fehlermeldung). Fallback zum Testen: `product-detail`.
3. **End-to-End-Test** — `NETLIFY_BUILD_HOOK_URL` setzen (echter Hook oder `webhook.site`),
   Bestand ändern, „Veröffentlichen" klicken, eingehenden POST bestätigen.

## Konfiguration (Betrieb)
- `NETLIFY_BUILD_HOOK_URL` in der echten `.env` setzen (Netlify → Build & deploy → Build hooks).

## Bewusst nicht gebaut (spätere Optionen)
- **Automatischer Trigger:** EventBus-Subscriber (ProductEvent / StockMovementEvent) → Hook
  mit Debounce statt manuellem Klick. `StorefrontDeployService` ist dafür wiederverwendbar.
- **Täglicher Cron-Fallback-Build.**

## Design-Entscheidungen (Kontext)
- Produkte bleiben **bewusst build-time in Astro** (keine Live-Island) — Nutzer-Entscheid.
- Build-Hook-URL bleibt **serverseitig** (Env-Var), nie im Client-Bundle → kein Build-Spam
  über die unauthentifizierte Hook-URL.
