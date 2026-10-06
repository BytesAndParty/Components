# StorefrontDeployPlugin — STATUS

> Stand: 2026-10-06 · manueller „Veröffentlichen"-Button (Dashboard → Netlify Rebuild)

## Implementiert ✅
- Admin-API-Mutation `triggerStorefrontRebuild` + `StorefrontDeployService` (serverseitiger
  POST auf `NETLIFY_BUILD_HOOK_URL`, 30s-Cooldown).
- Custom-Permission `TriggerStorefrontRebuild` (idempotent registriert; SuperAdmin hat sie).
- Dashboard-Action-Bar-Button in der Produkt-Liste (`pageId: 'product-list'`).
- Plugin in `vendure-config.ts` registriert, `NETLIFY_BUILD_HOOK_URL` in `.env.example`.
- Server-`tsc`: exit 0.

## Verifikation ✅
1. ~~**`bun run dashboard:build`** durchlaufen lassen~~ — **erledigt 2026-10-06** (mit Vendure 3.7.4):
   `bun run build` (Server-`tsc` + Dashboard-Vite-Build) exit 0, die Mutation
   `triggerStorefrontRebuild` steckt im Dashboard-Bundle.
2. ~~**`pageId: 'product-list'`** prüfen~~ — **erledigt 2026-10-06**: Der Button erscheint in der
   Produktliste neben „Rebuild search index". Er erscheint nur mit der Permission
   `TriggerStorefrontRebuild` (`requiresPermission`). Ohne sie fehlt er ebenfalls stumm.
3. ~~**End-to-End-Test**~~ — **erledigt 2026-10-06** auf dem VPS mit dem Hook der Netlify-Site
   `artilier-ui`. Als Demo-Admin wurde ein neues Produkt angelegt, danach „Veröffentlichen“ geklickt.
   Ergebnis: Toast „Build angestoßen“, Netlify-Deploy „triggered by hook“ nach 51 s fertig, der neue
   Wein steht unter `/shop/` samt Detailseite.

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
