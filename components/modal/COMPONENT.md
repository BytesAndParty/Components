# Modal

Modaler Dialog auf dem nativen `<dialog>` mit `showModal()`: Inhalt in einer zentrierten Karte über abgedunkeltem, leicht unscharfem Hintergrund. Für Erklärungen, Bestätigungen, kurze Abläufe (z. B. mit `Stepper` darin). Ohne Headless-Lib und ohne Portal. Ein Overlay mit eigener Suche ist `SearchOverlay`, ein Bildzuschnitt `ImageCropperModal`.

## Features

- Was der Browser mitbringt: Top Layer (liegt über jedem `z-index`, auch über Hosts mit eigenem Stacking-Kontext), Fokus-Falle, Rest der Seite `inert`, Esc schließt, Fokus geht beim Schließen an das Element zurück, das ihn vorher hatte.
- Klick auf den Hintergrund schließt. Ein Druck, der in der Karte beginnt und auf dem Hintergrund endet (Text markieren), schließt nicht, ebenso wenig ein Klick in den ersten 400 ms nach dem Öffnen (Doppelklick auf den Öffner).
- Controlled: `open` steuert, `onClose` meldet ein Schließen durch den User.
- SSR-sicher: Im Server-HTML steht der Dialog nie offen (kein `open`-Attribut), er öffnet nach der Hydration im Effekt.
- Einblenden: Karte steigt 1 rem auf und blendet ein, Hintergrund blendet ein (300 ms, `@starting-style`). Bei `prefers-reduced-motion` ohne Übergang.

## How It Works

1. **Zustand im DOM folgt der Prop.** Ein Effekt ruft `showModal()` bzw. `close()` auf, sobald `open` und der Zustand des Elements auseinanderliegen. Das `open`-Attribut setzt die Komponente nie selbst: Ein per Attribut geöffneter Dialog wäre nicht modal (keine Fokus-Falle, kein Esc).
2. **`onClose` nur für das, was der Parent nicht selbst ausgelöst hat.** Das native `close`-Event feuert bei jedem Schließen. Die Komponente reicht es nur weiter, solange `open` noch `true` ist, also bei Esc und Klick auf den Hintergrund. Setzt der Parent `open` auf `false`, kommt kein `onClose` zurück.
3. **Hintergrund-Klick.** Der `<dialog>` selbst ist eine transparente Hülle ohne Padding, die Karte (`div`) füllt ihn ganz aus. Ein Pointer-Event, dessen Ziel der `<dialog>` selbst ist, traf deshalb den `::backdrop`. Geschlossen wird nur, wenn schon `pointerdown` dort begann, und zwar frühestens 400 ms nach `showModal()`: Beim Doppelklick auf den Öffner landet der zweite Klick sonst auf dem gerade geöffneten Hintergrund und schließt den Dialog sofort wieder.
4. **Kein Portal nötig.** Der Top Layer liegt über allem, die Falle aus COMPONENT-GUIDELINES §11 (Portal hinter einem Host mit `z-index` 9999) tritt nicht auf. `useOverlayContainer()` braucht diese Komponente deshalb nicht.
5. **Animation nur beim Öffnen.** Ein Übergang beim Schließen bräuchte die CSS-Eigenschaft `overlay`, die nur Chromium kennt. In Safari und Firefox stünde der Dialog sonst für die Dauer des Übergangs außerhalb des Top Layers an seiner Stelle im Dokument. Geschlossen wird deshalb sofort.
6. **Reduced Motion:** reines CSS über `motion-reduce:transition-none` am Dialog und am `::backdrop` (COMPONENT-GUIDELINES §5).
7. **Inhalt bleibt gemountet,** auch geschlossen (versteckt). Soll der Inhalt bei jedem Öffnen neu starten (z. B. ein `Stepper` wieder bei Schritt 1) oder nicht im Server-HTML stehen: bedingt rendern, `{open && <Inhalt />}`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | required | Sichtbarkeit (controlled). |
| `onClose` | `() => void` | required | Der User hat geschlossen (Esc, Hintergrund). Hier `open` auf `false` setzen. |
| `children` | `ReactNode` | required | Inhalt der Karte. |
| `aria-label` | `string` | — | Zugänglicher Name, wenn es keine sichtbare Überschrift gibt. |
| `aria-labelledby` | `string` | — | ID der sichtbaren Überschrift im Inhalt. Einer der beiden Namen ist Pflicht (WAI-ARIA Dialog Pattern). |
| `aria-describedby` | `string` | — | ID eines kurzen Beschreibungstexts, den Screenreader beim Öffnen vorlesen. |
| `className` | `string` | — | Klassen an der Karte, per `cn()` mit den Defaults zusammengeführt (z. B. `w-[min(40rem,calc(100vw-2rem))]`, `p-8`). |
| `style` | `CSSProperties` | — | Inline-Styles an der Karte. |

Der Dialog hat keinen eingebauten Schließen-Button und damit keine eigenen UI-Texte (kein `messages.ts`). Jede Einsatzstelle braucht einen sichtbaren Weg hinaus („Abbrechen“, „Überspringen“, ein X), der `open` auf `false` setzt.

## Usage

### Golden Path

```tsx
import { useId, useState } from 'react'
import { Modal } from '@components/modal/modal'

const [open, setOpen] = useState(false)
const titleId = useId()

<button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)}>Weinpaket ansehen</button>

<Modal open={open} onClose={() => setOpen(false)} aria-labelledby={titleId}>
  <h2 id={titleId} className="text-xl font-semibold">Weinpaket „Sommer“</h2>
  <p className="mt-2 text-muted-foreground">Sechs Flaschen, gekühlt geliefert.</p>
  <button type="button" className="mt-6" onClick={() => setOpen(false)}>Schließen</button>
</Modal>
```

### Inhalt bei jedem Öffnen neu starten

```tsx
<Modal open={open} onClose={close} aria-labelledby={titleId}>
  {open && (
    <Stepper onFinalStepCompleted={close}>
      <Step><h2 id={titleId}>Willkommen</h2>…</Step>
      <Step>…</Step>
    </Stepper>
  )}
</Modal>
```

### Beim ersten Besuch automatisch öffnen (SSR, Astro-Island)

Den „schon gesehen“-Zustand nicht im Render aus `localStorage` lesen, sondern über `useSyncExternalStore` mit einem Server-Snapshot, der „gesehen“ meldet. Server und erster Client-Render zeigen den Dialog dann nicht, er öffnet direkt nach der Hydration.

## Dependencies

- `cn()` aus `@components/lib/utils` (`clsx`, `tailwind-merge`).
- Tailwind v4 (Varianten `starting:`, `open:`, `backdrop:`) und das Token `--background` (`bg-background`) für den Hintergrund.
