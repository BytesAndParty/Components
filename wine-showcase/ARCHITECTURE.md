# Wine Showcase — Architektur & Best Practices

Entscheidungen für den finalen Wein-Onlineshop. Living Document — erweitern, wenn neue Patterns dazukommen.

> Stand: 2026-04-18 · Stack: Astro + React Islands + Vendure (Hybrid)

---

## 1. Rendering-Strategie — Astro SSG mit React Islands

**Entscheidung:** Wein-Daten zur **Build-Time** rendern, interaktive Inseln (Cart, Search, Wishlist) als React-Komponenten hydraten.

**Begründung:**
- ~50 Weine, ändern sich selten → SSG ideal
- Statisches HTML = bestes Lighthouse-Ergebnis, ewig cachebar im CDN
- React-Islands nur dort wo Interaktivität nötig (Bundle-Size minimal)

**Pattern:**
```astro
---
// pages/wines/[slug].astro
export async function getStaticPaths() {
  const wines = await vendure.query(GET_PRODUCTS)
  return wines.map(wine => ({ params: { slug: wine.slug }, props: { wine } }))
}
const { wine } = Astro.props
---
<Layout>
  <WineDetail wine={wine} />
  <CartSidebar client:idle />   <!-- React Island -->
</Layout>
```

**Rebuild-Trigger:** Vendure-Webhook → Build-Hook der Hosting-Plattform (Vercel/Netlify) bei Produktänderung. Plus täglicher Cron als Fallback.

---

## 2. Cart-Architektur — Variante C (Hybrid)

**Entscheidung:** Vendure ActiveOrder als Source of Truth, **Optimistic UI** im Client für instant feel.

**Begründung:**
- **Stock-Validation** kritisch (limitierte Wein-Auflagen)
- **MwSt** AT (10%/20%) gehört serverseitig
- **Promotion-Engine** nutzen (B2B-Rabatte später, Code-Aktionen)
- **Cart-Persistence** über Devices wenn eingeloggt
- Optimistic UI gibt Client-Cart-Feel ohne die Nachteile

**Pattern (TanStack Query):**
```tsx
const { mutate } = useMutation({
  mutationFn: (id) => vendure.addItem(id),
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ['cart'] })
    const previous = queryClient.getQueryData(['cart'])
    queryClient.setQueryData(['cart'], (old) => addItemLocal(old, id))
    return { previous }
  },
  onError: (_err, _id, ctx) => {
    queryClient.setQueryData(['cart'], ctx.previous)
    toast({ title: 'Nicht mehr verfügbar', variant: 'error' })
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
})
```

**Wichtig:** `retry: 0` für Cart-Mutations (sonst Doppel-Buchung möglich).

---

## 3. Data Fetching — TanStack Query (nur Client-Islands)

Astro liefert statische Daten. TanStack Query gilt nur für **dynamische Inseln** (Cart, Search, Stock-Live, Wishlist).

**Senior-Patterns:**

| Pattern | Setting | Warum |
|---|---|---|
| `staleTime` | Cart `0s` · Stock `30s` · Search-Suggestions `5min` | Frische je nach Domäne |
| `placeholderData: keepPreviousData` | Bei Filter-/Search-Wechsel | Verhindert Flicker, alte Liste bleibt sichtbar |
| `useSuspenseQuery` | Wherever sinnvoll | Eliminiert `isLoading`-Branches in Komponenten |
| Prefetch on hover | Wein-Karte → Detail | Detail fühlt sich instant an |
| `signal` (AbortController) | Bei schneller Navigation | Stale Requests abbrechen |
| `retry: 0` für Mutations | Cart, Checkout | Doppel-Operationen vermeiden |
| `networkMode: 'offlineFirst'` | Wishlist | Funktioniert offline, syncs später |
| Loading-Delay 300ms | Skeleton-Anzeige | Kein Flicker bei schnellen Antworten |
| `startTransition` | Filter-Updates | UI bleibt responsive während Re-Render |

---

## 4. Suspense + useSuspenseQuery

**Vorher (3 Pfade in jeder Komponente):**
```tsx
if (isLoading) return <Skeleton />
if (error) return <Error />
return <Grid wines={data} />
```

**Nachher (nur happy-path):**
```tsx
function CartList() {
  const { data } = useSuspenseQuery(...)  // data ist NIE undefined
  return <Grid items={data} />
}

<ErrorBoundary fallback={<Error />}>
  <Suspense fallback={<SkeletonGrid />}>
    <CartList />
  </Suspense>
</ErrorBoundary>
```

**Vorteile:** Komponenten bleiben rein · Skeletons zentral · TypeScript glücklich · mehrere Queries warten gemeinsam (kein Stufen-Flicker) · Streaming-SSR-ready.

---

## 5. Loading States — wann welcher Indicator

| Strategie | Wann | Beispiel |
|---|---|---|
| **Skeleton** | Layout bekannt, Daten kommen, > 200ms | Cart-Reload, Search-Results |
| **Spinner** | Aktion läuft, < 1s | Add-to-Cart-Button |
| **Optimistic UI** | Server-Response gleich Erfolg erwartet | Quantity +/- im Cart |
| **Nichts** | < 200ms erwartet | Fast alle UI-State-Toggles |

**Skeleton-Regeln:**
- Echte Layout-Form abbilden (kein generisches Box-Soup) → kein CLS
- `prefers-reduced-motion` respektieren (kein Shimmer)
- Erst nach 300ms anzeigen (sonst flackert bei schnellen Antworten)
- Wein-Liste auf statischen Astro-Seiten → **kein Skeleton nötig**, Daten sind im HTML

---

## 6. Bilder — `astro:assets` + CDN

**Entscheidung:** Built-in `astro:assets` mit Sharp at build, hinter Cloudflare/Bunny CDN.

**Begründung:**
- Auto-WebP/AVIF, responsive `srcset`, Lazy Loading, CLS-Prevention
- Bei 50 Weinen × 5 Bilder × 3 Formate × 3 Größen = ~2.250 Files, ~2min Build → komplett statisch
- Keine on-demand-Kosten, beliebig hoch skalierbar via CDN

**Pattern:**
```astro
<Picture
  src={wineImage}
  widths={[300, 600, 900]}
  sizes="(max-width: 768px) 100vw, 33vw"
  formats={['avif', 'webp']}
  alt={wine.name}
/>
```

**Vendure-Bilder (remote):**
```js
// astro.config.mjs
image: { domains: ['vendure-cdn.example.com'] }
```

**LQIP Blur-up:** Für Hero-Bilder via `getImage({ width: 20 })` als base64 inline + blur-Filter, dann tausch.

---

## 7. Responsive — Container Queries pro Komponente

**Entscheidung:** Komponenten sind **selbst responsiv** via Container Queries, nicht über zentrale Viewport-Breakpoints.

**Begründung:** Eine `<WineCard>` in 280px Sidebar muss anders aussehen als in 800px Hero — soll aber eine Komponente bleiben.

**Pattern:**
```css
.wine-card-wrapper { container-type: inline-size; }
.wine-card { display: grid; grid-template-columns: 1fr; }
@container (min-width: 360px) {
  .wine-card { grid-template-columns: 100px 1fr; }
}
```

**Mobile-Regeln:**
- Touch-Targets min. **44×44px** (iOS HIG / Material)
- Mobile-First (Default-Styles für Mobile, `min-width` für größer)
- Fluid Typography mit `clamp(1rem, 0.5rem + 2vw, 1.5rem)`
- Aspect-Ratio statt fixer Heights (`aspect-ratio: 4/5`)
- Bottom-Sheet statt Sidebar für Mobile-Cart

---

## 8. Network-Awareness — CSS statt JS

**Entscheidung:** `prefers-reduced-data` Media Query, **nicht** `navigator.connection`.

**Begründung:** `navigator.connection` ist deprecated und nur in Chrome zuverlässig. CSS funktioniert ohne JS, browserweit.

```css
@media (prefers-reduced-data: reduce) {
  .hero-video { display: none; }
  .product-image { content: url('/wine-thumb-low.webp'); }
}
@media (prefers-reduced-motion: reduce) {
  .aurora-text, .glow-card { animation: none; transition: none; }
}
```

---

## 9. Text-Messung — Pretext für Truncation ohne Reflow

**Entscheidung:** `@chenglou/pretext` für Multi-Line-Text-Messung in der `<Paragraph>` Komponente.

**Begründung:** `getBoundingClientRect` triggert Layout-Reflow (teuer). Bei vielen Wein-Karten mit dynamischem `geschmacksprofil` + `speiseempfehlung` summiert sich das. Pretext misst per Font-Engine ohne DOM-Roundtrip.

**Use-Cases:**
- "Mehr lesen" Button **nur wenn** Text wirklich overflowed
- Skeleton-Höhen exakt vorausberechnen (kein CLS)
- Badge/Tag-Overflow (ob "Prämiert" + "Limitiert" + "Bio" in Karte passen)

**Wo NICHT:** Statische Layouts, einzelne Texte, einfaches `-webkit-line-clamp` ohne dynamischen Toggle.

Komponente: [`components/paragraph`](../components/paragraph/)

---

## 10. View Transitions + Astro Prefetch

**Entscheidung:** Astros `<ClientRouter />` mit `prefetch.defaultStrategy: 'hover'`.

**Begründung:** Kein eigenes Prefetching nötig für Page-Navigation — Astro macht das eingebaut. Smooth Page-Transitions via View Transitions API.

```js
// astro.config.mjs
prefetch: { prefetchAll: true, defaultStrategy: 'hover' }
```

**Manuelles Prefetching nur für:** Live-Stock vor Cart-Klick · Versandkosten-Berechnung vor Checkout.

---

## 11. SEO + Core Web Vitals — Targets

| Metric | Target | Wie erreicht |
|---|---|---|
| **LCP** | < 1.5s | SSG, optimierte Hero-Bilder mit `fetchpriority="high"` |
| **CLS** | < 0.05 | Bilder mit width/height, Skeleton-Layouts exakt |
| **INP** | < 100ms | Wenig Client-JS, `startTransition` für teure Updates |
| **FCP** | < 1s | Inline critical CSS, Astro default |

**Lighthouse-CI** in CI-Pipeline gegen jeden Pull Request.

---

## Offene Themen / TODOs

- [ ] Astro-Migration der wine-showcase Storefront
- [ ] `<Image>` / `<Picture>` + Vendure-Bild-Pipeline (statt Emoji-Platzhalter)
- [x] Paragraph-Komponente mit Pretext
- [ ] Container Queries-Refactor für GlowCard, Cart-Layout, Detail-Page
- [ ] Skeleton + SkeletonCard-Komponente
- [ ] TanStack Query Setup mit Senior-Patterns
- [ ] Webhook-Trigger Vendure → Astro-Rebuild
- [ ] Lighthouse-CI im CI-Setup
