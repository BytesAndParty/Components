> Generiert aus der live-docs-collection (skills/live-docs-collection/dotlottie-react/dotlottie-react.md) am 2026-09-16. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# `@lottiefiles/dotlottie-react`

WASM-basierter Lottie-Player von **LottieFiles** (Format-Owner). Ersetzt Airbnbs `lottie-web`/`lottie-react`. Rust-Core via WASM, **kein `eval`**, CSP-kompatibel.

## Component Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `string \| ArrayBuffer \| Record<string, unknown>` | — | Inline-Animation. `Record` akzeptiert direkt geparsed JSON (kein `JSON.stringify` nötig). |
| `src` | `string` | — | URL zu `.json` oder `.lottie` |
| `loop` | `boolean` | `false` | |
| `autoplay` | `boolean` | `false` | |
| `mode` | `'forward' \| 'reverse' \| 'bounce' \| 'reverse-bounce'` | `'forward'` | |
| `speed` | `number` | `1` | |
| `segment` | `[number, number]` | `[0, totalFrames-1]` | Frame-Range |
| `marker` | `string` | — | Named After-Effects-Marker |
| `backgroundColor` | `string` (hex) | — | Canvas-BG |
| `useFrameInterpolation` | `boolean` | `true` | Subframe-Smoothing |
| `renderConfig` | `{ devicePixelRatio?: number; autoResize?: boolean }` | `{}` | |
| `layout` | `{ fit; align }` | — | `fit: 'contain' \| 'cover' \| 'fill' \| 'none' \| 'fit-width' \| 'fit-height'` |
| `dotLottieRefCallback` | `RefCallback<DotLottie \| null>` | — | Callback fires nach WASM-Init mit Player-Instanz, beim Unmount mit `null`. |
| `playOnHover` | `boolean` | `false` | **Deprecated** — eigenen `onMouseEnter`/`onMouseLeave` mit `dotLottieRefCallback` benutzen |

## DotLottie Instance Methods

Über `dotLottieRefCallback` zugreifen:

```ts
play(): void
pause(): void
stop(): void
setMode(mode: 'forward' | 'reverse' | 'bounce' | 'reverse-bounce'): void
setFrame(frame: number): void
setSpeed(speed: number): void
setSegment(start: number, end: number): void
setLoop(loop: boolean): void
setMarker(marker: string): void
addEventListener(event, handler): void
removeEventListener(event, handler): void
load(config): void
loadFromString(json: string): void
freeze(): void   // Pause + Animation-Loop stoppen (Performance)
unfreeze(): void
resize(): void
destroy(): void
```

## Events

`'load' | 'loadError' | 'play' | 'pause' | 'stop' | 'complete' | 'loop' | 'frame' | 'render' | 'freeze' | 'unfreeze' | 'destroy'`

`frame`-Event-Payload enthält `currentFrame`.

## Standard-Migration von `lottie-react`

```ts
// VORHER (lottie-react)
import Lottie, { type LottieRefCurrentProps } from 'lottie-react'
const ref = useRef<LottieRefCurrentProps>(null)
<Lottie lottieRef={ref} animationData={data} loop={false} autoplay={false} />
ref.current?.setDirection(1) // forward
ref.current?.setDirection(-1) // reverse
ref.current?.play()

// NACHHER (dotlottie-react)
import { DotLottieReact, type DotLottie } from '@lottiefiles/dotlottie-react'
const playerRef = useRef<DotLottie | null>(null)
<DotLottieReact
  dotLottieRefCallback={(d) => { playerRef.current = d }}
  data={data}
  loop={false}
  autoplay={false}
/>
playerRef.current?.setMode('forward')
playerRef.current?.setMode('reverse')
playerRef.current?.play()
```

API-Mapping:

| lottie-react | dotlottie-react |
|---|---|
| `lottieRef` | `dotLottieRefCallback` (RefCallback) |
| `LottieRefCurrentProps` | `DotLottie` |
| `animationData={obj}` | `data={obj}` (akzeptiert Record direkt) |
| `setDirection(1)` | `setMode('forward')` |
| `setDirection(-1)` | `setMode('reverse')` |
| `goToAndPlay(frame)` | `setFrame(frame); play()` |

## Gotchas

- **WASM lädt async, aus dem Vendor-CDN.** Default fetch von unpkg/jsdelivr → erste Animation auf jeder Page hat ein paar 100 ms Delay. Für Self-Hosting `setWasmUrl()` aufrufen vor erstem Component-Mount:
  ```ts
  import { setWasmUrl } from '@lottiefiles/dotlottie-react'
  setWasmUrl('/wasm/dotlottie-player.wasm')  // eigenes Asset
  ```
- **`dotLottieRefCallback` feuert mehrfach** — bei Mount mit Instanz, bei Unmount mit `null`. Immer Null-Check in Handlern.
- **`data` darf parsed JSON sein** (anders als ältere dotlottie-Versionen, die nur string verlangten). Bei TS-Imports von `.json` direkt durchreichen, ggf. mit `as Record<string, unknown>` casten.
- **Canvas-Element**: Player rendert in `<canvas>`, nicht `<svg>`. CSS-Filter (`invert(1)` für Theming) funktionieren — `currentColor` für stroke nicht (kein direkter SVG-Zugriff).
- **`playOnHover` ist deprecated** — selbst implementieren mit `onMouseEnter` + `play()`.
- Bei Transform-/Theming-Bedarf: `themeData` als JSON-Definition reinreichen (LottieFiles Theme-Format).

## Patch 0.19.1 → 0.19.15 (Stack-Refresh 2026-08-21)

14 Patch-Releases, keine API-Änderung erkennbar — im Wesentlichen Dependency-/WASM-Binding-Updates
gegen das darunterliegende `dotlottie-web`-Core. Kein Migrations-Aufwand, Props/Methods aus diesem
Dokument gelten unverändert.

## DOM-Architektur

`DotLottieReact` rendert ein einzelnes `<canvas>`. Standard-React-Props (className, style, onClick, …) werden weitergereicht und auf das Canvas angewendet — kein Wrapper-Div automatisch.
