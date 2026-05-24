# Scroll Restoration Investigation - Showcase

Dieses Dokument hält die Versuche fest, das Problem der verlorenen Scroll-Position bei einem Page-Refresh (CMD+R) im Showcase zu lösen.

## Problemstellung
Beim Neuladen der Seite (CMD+R) springt der Browser auf jeder Seite des Showcases zurück nach oben (`scrollY = 0`), anstatt die vorherige Position beizubehalten. Zusätzlich desynchronisieren UI-Elemente wie die Navbar (bleibt transparent, obwohl sie bei `scrolled` solid sein sollte).

## Fehlgeschlagene Versuche

### Versuch 1: `allowPWA` & Kurzer Timeout
*   **Änderung:** `<ScrollRestoration allowPWA />` in `App.tsx` hinzugefügt und einen `useEffect` mit 50ms Timeout in `Layout.tsx` integriert, der ein `scroll`-Event feuert.
*   **Ergebnis:** Fehlgeschlagen.
*   **Vermutete Ursache:** `allowPWA` ist primär für Manifest-basierte Apps gedacht und löst das Problem im Desktop-Browser nicht zuverlässig. 50ms sind zu kurz für die Hydrierung und das Rendering schwerer Seiten (Cards, Text).

### Versuch 2: Struktur-Refactoring & Längerer Timeout
*   **Änderung:** 
    *   `ScrollRestoration` in `Layout.tsx` verschoben (näher an den Content).
    *   Timeout auf 250ms erhöht.
    *   `location.key` statt `location.pathname` als Dependency.
    *   `view-transition-name` von Inline-Styles in CSS-Klassen verschoben.
*   **Ergebnis:** Fehlgeschlagen.
*   **Vermutete Ursache:** 
    *   **View Transition API Interferenz:** Die globale Vergabe von `view-transition-name` auf dem `main`-Element (`page-content`) könnte den Browser-internen Mechanismus blockieren, der für das Merken der Scroll-Position zuständig ist, da der Browser beim Refresh einen neuen Transition-Root aufbaut.
    *   **Strict Mode & Hydration:** React 19 im Strict Mode rendert Komponenten doppelt. Wenn das Scroll-Event während des ersten (verworfenen) Renders gefeuert wird, verpufft es.
    *   **Vite Dev-Server:** HMR oder spezifische Vite-Mechanismen beim Full-Reload könnten den `sessionStorage` von React Router beeinflussen.

## Auflösung
**Root Cause:** `<ScrollRestoration />` setzt beim Mount `history.scrollRestoration = "manual"` und schaltet damit den nativen Browser-Mechanismus aus. Die native Restoration ist asynchron und wartet auf Bilder/Fonts/Layout-Stabilität — genau, was wir hier brauchen (View Transitions, Lottie, Framer Motion bauen die finale Höhe erst nach Mount auf). Der manuelle `window.scrollTo()` von React Router läuft dagegen zu früh und wird vom Browser auf die aktuelle (zu kleine) Dokumenthöhe geclampt → Position 0.

**Fix:** `<ScrollRestoration />` aus `App.tsx` entfernt. Der Browser-Default (`scrollRestoration = "auto"`) übernimmt Refresh **und** Back/Forward. Für PUSH-Navigation (Link-Klick) ein winziger `<ScrollToTopOnPush />`-Hook, der via `useNavigationType()` nur bei `'PUSH'` auf 0 scrollt.

---
*Status: Gelöst.*
