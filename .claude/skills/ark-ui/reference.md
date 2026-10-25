> Generiert aus der live-docs-collection (skills/live-docs-collection/ark-ui/ark-ui.md, skills/live-docs-collection/ark-ui/download-trigger.md, skills/live-docs-collection/ark-ui/segment-group.md) am 2026-10-23. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# Ark UI Core

# Ark UI (React) v5 — Cached Reference

Headless, unstyled, WAI-ARIA component primitives. The project's mandated headless lib
(no Radix / Headless UI). Used for ColorPicker, ImageCropper, Dialog, Popover, Portal,
SignaturePad, Tour, DownloadTrigger, FocusTrap.

## Anatomy: Root + parts

Every component is a `Root` plus named parts. Each part carries `data-scope` +
`data-part` attributes for styling hooks.

```tsx
import { Dialog } from '@ark-ui/react/dialog'

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Positioner>
    <Dialog.Content>
      <Dialog.Title>Confirm</Dialog.Title>
      <Dialog.Description>Are you sure?</Dialog.Description>
      <Dialog.CloseTrigger>Close</Dialog.CloseTrigger>
    </Dialog.Content>
  </Dialog.Positioner>
</Dialog.Root>
```

## Imports — use subpath imports

`import { X } from '@ark-ui/react/<component>'` (not the barrel). This matters in this
repo: `components-showcase/vite.config.ts` aliases each subpath
(`@ark-ui/react/color-picker`, `/dialog`, `/image-cropper`, `/popover`, `/portal`)
directly to dist files to preserve the exports map for the out-of-root `components/**`.

## Controlled vs uncontrolled

`value` / `defaultValue` + `onValueChange`. Mirrors the project's own
controlled/uncontrolled component convention.

```tsx
<ColorPicker.Root value={color} onValueChange={(d) => setColor(d.value)} />   // controlled
<ColorPicker.Root defaultValue={parseColor('#000')} />                         // uncontrolled
```

## State access — three options

1. `Component.Context` render-prop.
2. `use<Component>Context()` hook from any child (e.g. `useDialogContext`, `useColorPickerContext`).
3. `use<Component>()` hook + `<Component.RootProvider value={api}>` to drive state from outside.

```tsx
import { useColorPicker, ColorPicker } from '@ark-ui/react/color-picker'
const api = useColorPicker({ defaultValue: parseColor('#fff') })
<ColorPicker.RootProvider value={api}>…</ColorPicker.RootProvider>
// api.setValue(...), api.value — usable outside the tree
```

## Gotchas for this project

- Ark UI forces **inline styles** on several ColorPicker parts. Inline styles beat classes,
  so don't fight them with Tailwind (Praxis-Befund, Ark 5.x):
  - `ColorPicker.AreaBackground` and `ColorPicker.ChannelSliderTrack`: use `w-full h-full`,
    not `absolute inset-0` (Ark forces `position: relative`). Don't set your own
    `background`/`backgroundImage` on the track, Ark injects the gradient.
  - `ColorPicker.AreaThumb`: no `-translate-x-1/2 -translate-y-1/2`. Ark already sets
    `transform: translate(-50%, -50%)`, and Tailwind v4's separate `translate` property
    compounds with it (double offset).
  - `ColorPicker.ChannelSliderThumb`: does need `-translate-x-1/2 -translate-y-1/2`
    (Ark only sets `left`/`top` there).
  - `ColorPicker.TransparencyGrid` positions itself (`absolute`, `inset: 0`, 100 %).
  - `ColorPicker.Root` needs `inline` for an always-open panel (otherwise it starts closed and
    blocks interaction); wrap the content in `ColorPicker.Content`.
  - Swatches: `SwatchTrigger` with `flex items-stretch`, the inner `Swatch` with `flex-1`, so
    the color fills the button.
  - `ImageCropper.Handle` positions are compass values (`nw`, `ne`, `sw`, `se`, `n`, `e`, `s`,
    `w`), not `top-left` etc.
- Parts are unstyled by default — all visual styling is the consumer's job (Tailwind
  semantic tokens here).
- Storefront nutzt `@ark-ui/react@^5.38.0` (Caret) — beim Bumpen im selben 5.x-Band wie
  `components` bleiben (Versions-Parität für kopierten AtelierUI-Code).

## Patch 5.38.0 → 5.38.2 (Stack-Refresh 2026-08-21)

Reine Bugfixes, keine Breaking Changes. `5.38.1`: Composed-Refs-Fix (React-19-Refs wurden beim
Detach fälschlich auf `null` zurückgesetzt). `5.38.2`: diverse Component-Fixes (Fieldset-Re-Render,
Next.js-15-Production-Build mit `Activity`-Export, Date-Picker-Partial-Translations, Escape-Key auf
Overlay-Open, Focus-Visible mit Labels).

## Neu in 5.38 → 5.39 — was tatsächlich Arbeit spart

- **Neue `Hotkeys`-Komponente** (5.39.0, auf `@zag-js/hotkeys`) — Keyboard-Shortcut-Registrierung mit
  plattformspezifischer Taste-Auflösung (Cmd vs. Ctrl) und Sequenzen (`G > H`). **Eigenes System
  neben `@tanstack/react-hotkeys`** (ebenfalls in dieser Collection, dort noch Alpha) — bei neuer
  Adoption abwägen statt automatisch zur bisherigen Wahl zu greifen; Ark UIs Variante braucht keinen
  zusätzlichen Dependency, wenn Ark UI ohnehin im Projekt ist.
- **Neue `Toc`-Komponente** (5.39.0) — trackt aktive Überschriften beim Scrollen, für Inhaltsverzeichnis-Navigation ohne eigenen IntersectionObserver-Code.
- **`onEnterComplete`-Callback** (5.39.0) — feuert, wenn die Enter-Animation fertig ist, bei Dialog/Drawer/Popover und verwandten Overlays. Bisher musste man das über `motion/react`s eigene Animation-Complete-Events oder einen Timer nachbilden.
- **Number Input / Slider: `largeStep`/`smallStep`** (5.38.0) — Shift/Alt bzw. PageUp/PageDown springen jetzt konfigurierbar größer, ohne eigenen Keydown-Handler.
- **Focus Trap: `persistentElements`** (5.38.0) — portalter Content zählt als Teil der Trap, ohne `aria-controls` von Hand zu pflegen.
- **React 19: `hideMode`-Prop** (`'display-none' | 'activity'`, 5.38.0) — steuert, ob dauerhaft gemounteter Content über `display: none` oder Reacts `Activity`-API versteckt wird.
- **Image Cropper: `getCropData()`/`getCroppedImage({ maxSize })`** (5.38.0) — präzise Pixel-Koordinaten bzw. skaliertes Output, ohne eigene Crop-Berechnung.

---

# Download Trigger

# Ark UI — Download Trigger

- **verified:** 2026-10-14
- **Source:** https://ark-ui.com/docs/utilities/download-trigger (Doku-Stand v5.39.3) + installiertes
  `@ark-ui/react@5.36.2` (`dist/components/download-trigger/`, Typen und Implementierung gelesen)

## Import

```tsx
import { DownloadTrigger } from '@ark-ui/react/download-trigger'
```

## Props

| Prop | Typ | Bedeutung |
|---|---|---|
| `fileName` | `string` | Dateiname des Downloads |
| `mimeType` | `FileMimeType` (aus `@zag-js/file-utils`, z. B. `'image/png'`, `'application/pdf'`) | MIME-Typ |
| `data` | `string \| Blob \| File \| (() => MaybePromise<string \| Blob \| File>)` | Inhalt — direkt oder als (async) Funktion, erst beim Klick aufgelöst |
| `asChild` | `boolean` | Eigenes Element als Trigger rendern |

Rendert ein `<button type="button">`; weitere Button-Props (`className`, `title`, `aria-label`, …)
werden durchgereicht.

## Verhalten (aus der Implementierung, 5.36.2)

- `onClick` des Consumers läuft zuerst; `e.preventDefault()` darin bricht den Download ab.
- `data` als Funktion: Ergebnis ist ein Promise → `.then(saveToDisk)` **ohne `.catch`**. Eine
  Rejection bleibt unbehandelt — Fehler in der Funktion selbst abfangen.
- Speichern über `downloadFile` aus `@zag-js/file-utils` (Fenster aus dem `EnvironmentProvider`).
- Doku nennt keine A11y- oder Fehler-Hinweise; der Button braucht einen zugänglichen Namen
  (sichtbarer Text oder `aria-label`).

---

# Segment Group

# Ark UI — Segment Group

- **verified:** 2026-10-14
- **Source:** https://ark-ui.com/docs/components/segment-group + installiertes `@ark-ui/react@5.36.2`
  (`dist/components/segment-group/`) und `@zag-js/radio-group@1.40.0` (`radio-group.types.d.ts`)

Ein Radio-Group-Muster als Segment-Umschalter (WAI-ARIA `radiogroup`, Pfeiltasten wechseln).

## Anatomie

```tsx
import { SegmentGroup } from '@ark-ui/react/segment-group'

<SegmentGroup.Root value={mode} onValueChange={(d) => d.value && setMode(d.value)}>
  <SegmentGroup.Label>…</SegmentGroup.Label>           {/* optional, sonst aria-label am Root */}
  <SegmentGroup.Indicator />                           {/* gleitender Marker, CSS-Variablen */}
  {items.map((item) => (
    <SegmentGroup.Item key={item.value} value={item.value}>
      <SegmentGroup.ItemText>{item.label}</SegmentGroup.ItemText>
      <SegmentGroup.ItemControl />
      <SegmentGroup.ItemHiddenInput />
    </SegmentGroup.Item>
  ))}
</SegmentGroup.Root>
```

## Props (Root, aus `@zag-js/radio-group` 1.40.0)

| Prop | Typ |
|---|---|
| `value` | `string \| null` (controlled) |
| `defaultValue` | `string \| null` |
| `onValueChange` | `(details: { value: string \| null }) => void` |
| `orientation` | `'horizontal' \| 'vertical'` |
| `disabled`, `readOnly`, `name`, `form` | wie Radio-Group |

## Styling-Hooks

- `data-state="checked" | "unchecked"` am Item, `data-orientation` am Root.
- Indicator positioniert sich über CSS-Variablen (`--left`, `--top`, `--width`, `--height`); wer ihn
  nicht nutzt, stylt das Item über `data-[state=checked]:…`.
