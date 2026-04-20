# ViewTransition

Preset-basierter Wrapper um die native View Transitions API (`document.startViewTransition`) — inklusive drei eigener wein-themed Customs (Wine Pour, Cork Pop, Grape Burst).

## Features

- **8 Presets**: `fade`, `slide-left`, `slide-up`, `scale`, `circular-reveal`, `wine-pour`, `cork-pop`, `grape-burst`
- **Types-API** (Chrome 125+) via `startViewTransition({ update, types })` mit automatischem Fallback auf `[data-vt]`-Attribut
- **Origin-basierte Reveals**: Klickposition treibt `clip-path`-Animation per WAAPI auf `::view-transition-new(…)`
- **`flushSync`-Integration** für React 19 (Snapshot-Rendering synchron committen)
- **Reduced-motion-safe** via `@media (prefers-reduced-motion: reduce)`
- **Browser-safe**: kein `startViewTransition` → Update läuft ohne Animation durch

## API

### `runViewTransition(type, update, options?)`

| Param | Typ | Beschreibung |
|---|---|---|
| `type` | `VtPreset` | Preset-ID — steuert die Animation über `:active-view-transition-type` |
| `update` | `() => void` | State-Mutation, wird in `flushSync` gewrappt |
| `options.origin` | `{ x, y }?` | Nur für `circular-reveal` + `grape-burst` — Klickposition |
| `options.stageName` | `string?` | Custom `view-transition-name` (Default: `vt-stage`) |

Rückgabe: `ViewTransition` oder `null` wenn API nicht verfügbar.

### `<TransitionStage name?, children, style?, className? />`

Wrapper-Div, das `view-transition-name` setzt. Inhalt darf frei swappen — Browser snapshotted die gesamte Stage als ein Element.

### `VT_PRESETS: VtPresetMeta[]`

Preset-Metadaten für UI-Listen (label, hint, `needsOrigin`, `wine`).

## Usage

```tsx
import { runViewTransition, TransitionStage } from '@components/view-transition/view-transition'
import { useState } from 'react'

export function Demo() {
  const [idx, setIdx] = useState(0)

  function swap(e: React.MouseEvent) {
    runViewTransition('vt-wine-pour', () => setIdx(i => 1 - i), {
      origin: { x: e.clientX, y: e.clientY },
    })
  }

  return (
    <>
      <TransitionStage>
        {idx === 0 ? <CardA /> : <CardB />}
      </TransitionStage>
      <button onClick={swap}>Pour</button>
    </>
  )
}
```

### Preset-Übersicht

| Preset | Effekt |
|---|---|
| `vt-fade` | Crossfade .35s |
| `vt-slide-left` | Old → links raus, New ← rechts rein |
| `vt-slide-up` | Vertikaler Swap |
| `vt-scale` | Zoom-out/in mit Spring-Overshoot |
| `vt-circular-reveal` | `clip-path: circle()` expandiert ab Klickpunkt |
| `vt-wine-pour` | New füllt sich von oben mit Rotwein-Tint (`clip-path: inset`) |
| `vt-cork-pop` | Old flingt schräg raus, New schnappt mit Feder rein |
| `vt-grape-burst` | Radial-Reveal + kurzer Traubenlila-Hue-Shift auf New |

## Dependencies

- React 19 (`flushSync` aus `react-dom`)
- Keine externen Libraries

## Notes

- Nur ein Element pro Stage darf den `view-transition-name` tragen — darin darf alles frei swappen.
- Mehrere parallele Stages = jedem eine eigene `stageName`-Property geben.
- Cross-document-Transitions (`@view-transition { navigation: auto; }`) sind **nicht** Teil dieses Helpers — die laufen global in `styles.css` oder per React Router `<Link viewTransition>`.
- Wine-Presets sind pure CSS — keine SVGs/Canvas nötig. Der Tint-Effekt kommt aus `filter: hue-rotate() saturate() sepia()`-Mix.
