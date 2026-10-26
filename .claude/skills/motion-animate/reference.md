> Generiert aus der live-docs-collection (skills/live-docs-collection/motion-animate/motion-animate.md) am 2026-10-26. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# `motion` — imperative `animate()` + `stagger()`

`motion` ist der **offizielle Nachfolger** von `framer-motion` (gleiches Team, neuer Package-Name, kleinerer Footprint).

- React-Komponenten: `import { motion } from 'motion/react'` (deklarativ)
- **Imperative API in React**: `import { animate, stagger } from 'motion/react'`
- **Imperative API ohne React (Vanilla)**: `import { animate, stagger } from 'motion'` — dieselbe Funktion, kein React im Bundle

Imperative ist die Wahl, wenn du **GSAP-artigen** Code schreibst (DOM-Refs, Querysels, Tween-Steuerung) ohne den Komponentenbaum umzubauen.

## Neu in 14.1 → 14.6 — was tatsächlich Arbeit spart (Stand 2026-10-26)

Neueste Version: 14.6.0. Quelle: https://raw.githubusercontent.com/motiondivision/motion/main/CHANGELOG.md

- `animateLayout` (14.1): neue Funktion für Layout-Animationen. Signatur und Einsatz vor Nutzung in der Doku nachlesen,
  hier nicht weiter extrahiert.
- Hardware-Beschleunigung für `x`/`y`/`scale` (14.2): wirkt ohne Code-Änderung. 14.3.1 brachte Folge-Fixes, der Pfad
  war also nicht sofort stabil. Nach dem Update `layout`, `layoutId`, `AnimatePresence mode="popLayout"` und
  `useScroll` visuell prüfen.
- `stagger` mit `grid`, `edges` und `random` (14.3): Stagger-Reihenfolgen für Raster, vom Rand aus oder zufällig,
  statt Delays pro Index selbst zu berechnen. Genaue Optionsform vor Einsatz in der Doku prüfen.
- `scopeMotion` (14.5): neue API, Umfang hier nicht extrahiert.

Upgrade-Bewertung: Über die Majors hinweg bricht 13.0 nur `@emotion/is-prop-valid` (siehe „Version 13"), 14.0 nur
interne APIs. Wer nichts aus `framer-motion` oder `motion-dom` importiert, hebt ohne Code-Änderung auf 14.6; der
Sichttest wegen 14.2 bleibt trotzdem nötig.

## Neu in 13.4 → 14.0 — was tatsächlich Arbeit spart

**`AnimateView`** (13.4.0, nur React 19.3+) — View Transitions als Motion-Komponente, gebaut auf Reacts
`ViewTransition`. Ersetzt handgeschriebene `document.startViewTransition()`-Aufrufe samt CSS-
`::view-transition-*`-Pflege, sobald die Transition an einer React-State-Änderung hängt. Voraussetzung ist
React 19.3; im Projekt-Stack (React 19.x) vor Einsatz die installierte Minor prüfen.

**Spring: negatives `bounce`** (13.5.0) — `bounce` akzeptiert `0` bis `-1` und beschreibt damit **overdamped**
Springs (kein Überschwingen, weiches Einrasten). Vorher musste man `damping`/`stiffness` von Hand so
wählen, dass die Feder kritisch überdämpft ist.

```ts
animate(el, { x: 100 }, { type: 'spring', bounce: -0.4 })
```

**Scroll-Animationen ohne Zutun besser** (13.4.4 → 13.5.0, keine Code-Änderung nötig):
- `scroll` 44 % kleiner, `useScroll` 33 % kleiner, Scroll-Callbacks 50 % schneller (13.4.4)
- mehr `offset`s laufen hardware-beschleunigt über `ViewTimeline` (13.4.7); in 13.5.0 dann wieder
  Main-Thread für **alle** `offset`-Animationen — der Pfad wurde also innerhalb einer Woche zweimal
  umgebaut. Wer Scroll-Verhalten am Rand (`offset`) testet, gegen ≥ 13.5.0 prüfen.

**Kleinere Bundles:** `<m>` (LazyMotion-Komponente) 20 % kleiner, `useSpring` 10 % kleiner (13.5.0),
`spring`/`useSpring` weitere 5 % (13.4.5).

**Weiteres seit 13.3:** `AnimatePresence`-Fixes für `mode="wait"` und Wiedereintritt (13.4.4–13.4.6), `Reorder`-
und `layout`-Fixes, `styleEffect`/`svgEffect`-Korrekturen. Bei wackeligem `AnimatePresence`-Verhalten
lohnt das Upgrade allein deshalb.

### Breaking in 14.0.0

Nur **interne** APIs: die in `13.5.1` aus Kompatibilitätsgründen wiederhergestellten internen Exporte sind
weg (relevant nur bei gemischten `framer-motion` 13.0–13.4 / `motion-dom` / `motion-utils`-Versionen). Künftig
sind die internen Packages gepinnt, damit das nicht mehr passiert. Öffentliche API unverändert — **ein
13.x → 14.0-Upgrade ist für normale Nutzung ein reiner Bump.**

Quelle: `CHANGELOG.md` im motiondivision/motion-Repo (raw), 2026-10-05 gegen den Wortlaut geprüft.

## Entry Points / Bundle-Größe

| Import | Größe | Kann |
|---|---|---|
| `motion/mini` | 2,3 kB | HTML/SVG-Styles über native WAAPI |
| `motion` (Hybrid) | 18 kB | zusätzlich: unabhängige Transforms (`x`, `scale`, …), CSS-Variablen, **SVG-Pfade (`pathLength`)**, Sequences, JS-Objekte, `repeatDelay` |

`motion/mini` kann **keine** unabhängigen Transforms, keine SVG-Pfad-Animation und kein `repeatDelay`. Sobald Spring auf `scale`/`x` oder ein gezeichneter SVG-Pfad gebraucht wird, ist der Hybrid-Build Pflicht.

## Version 13

Für JavaScript/Vanilla gibt es in v13 **keine Breaking Changes**. Die einzige Breaking Change betrifft React: `@emotion/is-prop-valid` ist keine optionale Dependency mehr, sondern muss bei Nutzung von Styled Components / Emotion explizit über `MotionConfig` injiziert werden.

## Signatures

```ts
animate(element | selector | element[], values, options?): AnimationPlaybackControls
animate(motionValue, target, options?)
animate(from, to, options & { onUpdate })       // value-only animation
animate(object, values, options?)                // plain JS object / Three.js
animate(sequenceArray, options?)                 // timeline
```

## AnimationOptions

| Option | Type | Default |
|---|---|---|
| `type` | `'tween' \| 'spring' \| 'inertia' \| 'keyframes'` | tween (or spring for transforms) |
| `duration` | `number` (s) | `0.3` (single) / `0.8` (keyframes) |
| `delay` | `number` (s) | `0` — negativ = mid-way Start |
| `ease` | `string \| number[] \| (t) => number` | `'easeOut'` |
| `repeat` | `number \| Infinity` | `0` |
| `repeatType` | `'loop' \| 'reverse' \| 'mirror'` | `'loop'` |
| `repeatDelay` | `number` (s) | `0` |
| `times` | `number[]` | — | (0–1 Keyframe-Positionen) |
| `onUpdate` | `(latest) => void` | — |
| `onComplete` | `() => void` | — |

**Easing-Strings:** `'linear'`, `'easeIn'`, `'easeOut'`, `'easeInOut'`, `'circIn/Out/InOut'`, `'backIn/Out/InOut'`, `'anticipate'`. Cubic-Bezier als `[x1, y1, x2, y2]`.

## Spring Config

**Physics-Mode** (Default für Transforms):
| | Default | Effekt |
|---|---|---|
| `stiffness` | `100` | Höher = schneller / härter |
| `damping` | `10` | `0` = endlose Schwingung |
| `mass` | `1` | Höher = träger |
| `velocity` | aktuelle | Anfangs-Geschwindigkeit |
| `restSpeed` | `0.1` | Cutoff-Schwelle |
| `restDelta` | `0.01` | Distance-Schwelle |

**Duration-Mode** (intuitiver):
- `duration` + `bounce` (0–1, default 0.25)
- `visualDuration` — gefühlte Dauer (für hohen Bounce sinnvoll)

## AnimationPlaybackControls

```ts
const controls = animate(...)

controls.play()
controls.pause()
controls.stop()      // commit + un-restartable
controls.cancel()    // revert to initial
controls.complete()  // jump to end

controls.time          // get/set seconds
controls.speed         // get/set (1 = normal, -1 = reverse, 2 = double)
controls.duration      // read-only
controls.then(cb)      // Promise-like, resolves on finish
```

In `useEffect` aufräumen:

```ts
useEffect(() => {
  const controls = animate(el, { scale: 1 })
  return () => controls.stop()
}, [])
```

## `stagger()` Helper

```ts
animate(elements, { x: 100 }, {
  delay: stagger(0.1, { startDelay: 0.5, from: 'first', ease: 'easeOut' })
})
```

| Param | |
|---|---|
| 1. Base-Delay (s) | Abstand zwischen Elementen |
| `from` | `'first' \| 'last' \| 'center' \| number` — Start-Index |
| `ease` | Easing für die Stagger-Kurve selbst (nicht der Animation) |
| `startDelay` | Initial-Offset bevor das erste Element startet |

## Sequences

Array-of-Animations, die als zusammenhängende Timeline laufen:

```ts
animate([
  [el1, { x: 100 }, { duration: 0.5 }],
  [el2, { y: 50 }, { at: '<' }],         // gleichzeitig mit voriger
  [el3, { opacity: 1 }, { at: '+0.2' }], // 0.2s nach voriger
  [el4, { scale: 1 }, { at: '-0.1' }],   // 0.1s vor Ende der vorigen
])
```

`at`-Wert: Zahl (absolut), `'<'`, `'+n'`, `'-n'`, `'<n'`, oder Label-String.

## GSAP → motion Mapping

| GSAP | motion |
|---|---|
| `gsap.to(el, { x: 100, duration: 0.4 })` | `animate(el, { x: 100 }, { duration: 0.4 })` |
| `gsap.fromTo(el, { x: 0 }, { x: 100 })` | `el.style.x = '0px'` (oder MotionValue), dann `animate(el, { x: 100 })` |
| `ease: 'elastic.out(1, 0.5)'` | `{ type: 'spring', stiffness: 100, damping: 9 }` |
| `ease: 'back.out(1.4)'` | `{ type: 'spring', stiffness: 280, damping: 22 }` (snappy) **oder** `ease: [0.34, 1.56, 0.64, 1]` |
| `gsap.context(() => { … }, scope)` | Manuell: `controls.stop()` im Cleanup |
| `gsap.killTweensOf(el)` | Vorigen `controls` aufheben & `.stop()`; oder Motion macht "interrupt" automatisch beim Re-Animate |
| `stagger: 0.06` | `delay: stagger(0.06)` |
| `delay: 0.5` | `delay: 0.5` |
| `overwrite: 'auto'` | Default-Verhalten — Re-`animate()` interrupted laufende automatisch |

## Gotchas

- **CSS `transform` als String** wird via WAAPI interpoliert (kein Spring). Für Spring lieber **individuelle Properties** (`x`, `y`, `rotate`, `scale`) animieren.
- **Mixing**: `style.transform` (String) und `style.scale` (separate CSS-Property) **komponieren** sich — kein Konflikt. Sinnvoll, wenn man eine fixe Lage über `transform` setzt und nur `scale` animieren will.
- **Selektoren**: `animate('.card', …)` funktioniert, aber Scope ist global. Für Container-scoped: `Array.from(container.querySelectorAll(...))` und Element-Array übergeben.
- **`stop()` vs `cancel()`**: `stop()` friert am aktuellen Wert ein, `cancel()` springt zurück zum Start. Im Cleanup eines Effects meist `stop()`.
- **No `useCallback` nötig** in React-19/React-Compiler-Setups — der Compiler memoisiert. Aber Refs zu DOM-Nodes brauchen `useRef` + Effect.
- **`onUpdate`** greift laut Doku aktuell nur bei Single-Value-Animationen (`animate(0, 100, { onUpdate })`), nicht bei Element-Animationen.
- **`framer-motion` Package**: deprecated alias zu `motion`. In neuen Codebases nicht mehr installieren.

## Patch 13.1.0 → 13.1.1 (Stack-Refresh 2026-08-21)

Reine Bugfixes, keine Breaking Changes: `window`-Zugriff in Animationen jetzt guarded für
Non-Browser-Runtimes; `AnimatePresence` mit verbesserter React-19-Strict-Mode-Kompatibilität.

## Neu in 13.2.0 — was tatsächlich Arbeit spart

Für normale UI-Animation (Karten, Modals, Listen) **kein direkt relevantes neues API** — die
Neuerungen zielen auf Nicht-DOM-Animation:

- **`animate.addEffect()`** — registriert Effekte, die `animate()` auch **nicht-DOM-Subjekte**
  steuern lassen, dieselbe Timeline/Steuerung wie für DOM-Elemente. Neue Effect-Pakete `motion/three`
  (Three.js-Objekte, Materialien, Shader-Uniforms) und `motion/vgpu` (WebGPU-Szenen, Kameras,
  Lichter, Orbit-Controls). Relevant nur bei 3D-/Canvas-lastigen Projekten (siehe `fabric`-Doc für
  den 2D-Fall, der hier nichts mit `motion` teilt).
- **`createEffect`** nimmt jetzt `test`/`read`/`step`-Optionen, `effect.get()` gibt gebundene Motion
  Values zurück — feinere Kontrolle beim Bau eigener Effekte.
- **Spring-Animationen**: kleinere Bundle-Size, bessere Performance. Kein API-Unterschied, wirkt sich
  einfach automatisch aus.

## Neu in 13.3.0 — was tatsächlich Arbeit spart

Reines Performance-Release, kein neues öffentliches API für DOM-Animation:

- `springValue`/`useSpring`: 80 % schnelleres Retargeting (Ziel während laufender Animation ändern).
- `animate()`: 20 % schnellerer Start, 10 % kleiner, 10 % weniger JS pro Frame.
- Frame-Scheduling 10 % effizienter.
- Fix: Pfadzeichnungs-Berechnungen (SVG `pathLength`) korrigiert.

Alles automatisch, ohne Code-Änderung. Einzige neue API sind „Hooks for Motion Editor" — laut
Changelog ungenannter Umfang, zielt auf Motions eigenes visuelles Editor-Tool, nicht auf
Programm-Code in diesem Stack.
