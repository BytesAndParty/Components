> Generiert aus der live-docs-collection (skills/live-docs-collection/fabric/fabric.md) am 2026-09-16. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# Fabric.js v7 — Quick Reference & Migration

Canvas-Engine für 2D-Editoren. v7.0.0 (Dezember 2024) ist ein Major-Bump mit
mehreren stillen Verhaltensänderungen. Dieses Dokument konzentriert sich auf
**was sich von v6 → v7 ändert** und welche v6-APIs schon vor v7 verschwunden
sind (wichtig: viele v5-Patterns in alten Snippets gelten in v6/v7 nicht mehr).

---

## Quick Reference — Canvas-zentrierte APIs

In Fabric **v6+** liegen Object-Stack-Operationen auf der **Canvas**, nicht
mehr auf dem Object:

| v5 (legacy)             | v6 / v7 (aktuell)                         |
|-------------------------|-------------------------------------------|
| `obj.bringToFront()`    | `canvas.bringObjectToFront(obj)`          |
| `obj.sendToBack()`      | `canvas.sendObjectToBack(obj)`            |
| `obj.bringForward()`    | `canvas.bringObjectForward(obj)`          |
| `obj.sendBackwards()`   | `canvas.sendObjectBackwards(obj)`         |
| `obj.moveTo(idx)`       | `canvas.moveObjectTo(obj, idx)`           |

Stack-Reihenfolge: `canvas.getObjects()` gibt von hinten (idx 0) nach vorne
(idx n-1) zurück. Für eine Layer-Panel-Liste (top = front) → `.reverse()`.

```ts
// v6/v7 Reorder per ID-Array (Panel-Reihenfolge: top-to-bottom = front-first)
const reversedIds = [...idsTopToBottom].reverse()
reversedIds.forEach((id, idx) => {
  const obj = canvas.getObjects().find(o => o.id === id)
  if (obj) canvas.moveObjectTo(obj, idx)
})
canvas.requestRenderAll()
```

## Image-Loading (v6+)

`fabric.Image.fromURL(url, callback)` ist **entfernt** — seit v6 ist die
Image-Klasse `FabricImage` und `fromURL` ist eine `Promise`.

```ts
import * as fabric from 'fabric'

const img = await fabric.FabricImage.fromURL(src)   // Promise<FabricImage>
img.set({ left: 100, top: 100, scaleX: 0.5, scaleY: 0.5 })
canvas.add(img)
```

`fabric.Image` als Alias funktioniert noch, aber `fromURL(url, cb)`
(Callback-Signatur) ist tot. Immer `await`en.

---

## v7.0.0 — Breaking Changes (Dezember 2024)

### 1. `originX` / `originY` Default ist jetzt `'center' / 'center'`

**Bisher (v6):** Default war `'left' / 'top'`.
Ein `new fabric.Rect({ left: 100, top: 100, width: 50, height: 50 })`
landete mit der **oberen linken Ecke** bei (100, 100).

**Jetzt (v7):** Die Position bezieht sich auf den **Mittelpunkt**. Dasselbe
Rect landet mit dem **Zentrum** bei (100, 100) — also 25 px nach links und
oben verschoben gegenüber v6.

**Migration:** Entweder

- Beim Erzeugen jedes Objekts `originX: 'left', originY: 'top'` setzen (lokales
  Restore des v6-Verhaltens), **oder**
- Die `left`/`top`-Koordinaten so anpassen, dass der Mittelpunkt gemeint ist
  (cleanere v7-Konvention, weil Rotation/Skalierung um die Mitte natürlicher
  wirkt).

Für bestehenden Code, der mit Top-Left-Annahmen rechnet (z. B. mm-zu-px-
Mapping ausgehend von `{left, top}` als Bounding-Box-Ecke), ist es sicherer,
das alte Verhalten via `originX/originY` zu fixieren — sonst springen alle
Bestände bei Migration.

### 2. Mouse-Event-Defaults geändert

`fireRightClick`, `fireMiddleClick`, `stopContextMenu` sind als Top-Level-
Canvas-Optionen deprecated; ihre Default-Werte haben sich verschoben. Wer
diese Optionen explizit nicht setzt, kann ein verändertes Context-Menü-
Verhalten beobachten. **Fix:** Werte explizit setzen, wenn ein bestimmtes
Verhalten erwartet wird.

### 3. Text-Positionierung gefixt (PR #10803)

Pixelgenaue Korrektur für `Text` / `IText`-Baselines. Bestehender Code
landet ggf. 1–2 px versetzt — Auswirkung minimal, aber bei Snap-to-Grid /
Pixel-perfekten Layouts sichtbar.

### 4. Gradient — `opacity` aus Colorstops entfernt

Wer `fabric.Gradient`-Colorstops mit `{ offset, color, opacity }` definiert
hat: `opacity` ist **weg**. Lösung: Alpha in den `color`-Wert kodieren
(`rgba(…)`).

### 5. `findTarget` refaktoriert (PR #10587)

Interne API, in Custom-Hit-Test-Code ggf. relevant. Standard-Selection
funktioniert wie gehabt.

### 6. Entfernt: `request`-Util, Parser-Exports

`parseAttributes`, `parseStyleAttribute`, `parseFontDeclaration`,
`parsePointsAttribute`, `parseTransformAttribute`, `getCSSRules` sind aus
dem öffentlichen Export entfernt. Internal SVG-Parser läuft weiter.

### 7. Node ≥ 20

CLI-Tooling (Vite, Bun, …) — bei modernen Setups erfüllt.

---

## v7.x Folgereleases

| Version | Datum       | Wichtiges                                                              |
|---------|-------------|------------------------------------------------------------------------|
| 7.1.0   | 2024-12-31  | Cropping-Controls Extension, `calcOwnMatrix` Cache-Fix, SVG-Text-Offset |
| 7.2.0   | 2025-02-18  | **Security:** CVE-2026-27013 (SVG-Export XSS) gefixt; Lodash-Bump      |
| 7.3.0   | 2025-04-18  | Rolldown statt Rollup; Gradient-Controls; Text-Decoration-Color        |
| 7.4.0   | 2025-05-18  | **Security:** CVE-2026-44311 gefixt; Viewport-Rotation in Zoom korrekt |

Mindestens **v7.2.0** wegen CVE-2026-27013 anpeilen, besser direkt v7.4.0.

---

## Gotchas

- **Z-Order:** Object-Methoden für Stack-Reorder existieren seit v6 nicht
  mehr — silent-fail im JS-Strict-Mode, weil die Methode `undefined` ist.
  Immer Canvas-API verwenden.
- **`originX/originY`-Default:** Beim Migration-Test zuerst die Objekt-
  Erzeugung visuell auf alten Positionen prüfen. Wenn alles um halbe
  Breite/Höhe verschoben wirkt → das ist der Origin-Default-Shift.
- **Async Image-Load:** `await fabric.FabricImage.fromURL(src)` — keine
  Callback-Signatur mehr.
- **`renderAll` vs. `requestRenderAll`:** Beide funktionieren; bei
  rAF-gebundenen Updates ist `requestRenderAll` schonender (frame-coalesced).
- **`canvas.dispose()`:** Bleibt synchron; weiterhin zwingend im
  React-Effect-Cleanup, sonst Memory-Leak bei Re-Mount.
- **SSR:** `fabric` greift auf `document` / `window` zu. In Vite/Next nur
  client-seitig importieren (dynamic import oder `'use client'`).

---

## Migration-Checkliste v6 → v7

- [ ] `bun add fabric@^7`
- [ ] Alle `new fabric.Rect/Circle/Line/IText/FabricImage(...)` durchsuchen:
      explizit `originX: 'left', originY: 'top'` setzen, falls Bounding-Box-
      Logik darauf basiert.
- [ ] Gradient-Stops auf `rgba()` umstellen, falls `opacity` benutzt wurde.
- [ ] Kein `fabric.Image.fromURL(url, cb)`-Callback-Pattern mehr — nur Promise.
- [ ] Custom-Hit-Test-Code gegen v7-`findTarget` testen.
- [ ] Visual-Smoketest: Position aller existierenden Objekte vergleichen
      (Origin-Shift!).
