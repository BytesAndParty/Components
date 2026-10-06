# ProcessSteps

Statische Erklär-Kette aus wenigen Schritten, z. B. „Reifen am Stock → Lese → Pressen → Fass → Verkosten“. Dritte Komponente aus dem Scrapbook-Set ([SCRAPBOOK-TEXTBOXES.md](../../SCRAPBOOK-TEXTBOXES.md)). Nicht interaktiv. Für einen bedienbaren Mehrschritt-Wizard gibt es [`Stepper`](../stepper/COMPONENT.md).

## Features

- Drei Darstellungen über `variant`:
  - `paper` (Default): Icon-Kreise aus Creme-Papier mit Korn, leicht gedreht, handgezeichnete Pfeile dazwischen, Labels in UI-Sans. Die Schritte steigen gestaffelt auf.
  - `trail`: Kraft-Stempel mit Doppelring und handschriftlicher Nummer, verbunden durch einen gepunkteten Wellenpfad. Der Pfad zeichnet sich, die Stempel poppen nach, sobald er sie erreicht. Labels in **Caveat**.
  - `ledger`: Maison-Stil ohne Badges. Große römische Ziffer (`font-display`, kursiv) über einer Hairline, das Icon als stilles Detail, das Label in weit gesperrten Kapitälchen. Die Hairlines zeichnen sich nacheinander.
- Beliebig viele Schritte. Ab einer Containerbreite von 42 rem eine Spalte pro Schritt, darunter ein vertikaler Stack mit nach unten gedrehten Pfeilen.
- `<ol>` mit echten Listeneinträgen. Icons, Nummern und Ziffern sind Deko, die Reihenfolge kommt aus der Liste.

## How It Works

1. **Container-Query statt Viewport.** Der Wrapper ist `@container`, das Grid wechselt bei `@2xl` (42 rem) auf `repeat(var(--steps), minmax(0, 1fr))`. Die Schrittzahl kommt als CSS-Variable `--steps` per `style`. So passt die Kette auch in schmale Spalten, egal wie breit der Viewport ist.
2. **Pfeile auf der Spaltengrenze (`paper`).** Jeder Schritt außer dem letzten trägt seinen Pfeil selbst. Im Stack sitzt er 90° gedreht darunter, in der Zeile absolut auf der rechten Spaltenkante. Damit bleiben die Spalten gleich breit, und es gibt keine zusätzlichen Listeneinträge nur für Pfeile.
3. **Pfad (`trail`).** Eine Wellenlinie durch die Spaltenmitten, berechnet in einer 1000er-viewBox mit `preserveAspectRatio="none"` und `vector-effect: non-scaling-stroke`. Alle Segmente nutzen dieselbe S-Kurve, dadurch gibt es an den Stempeln keinen Knick. Das Aufziehen läuft über `clip-path` auf einem inneren Wrapper, das `useInView`-Ziel bleibt ungeclippt (STYLE-GUIDE §11). Unterhalb von `@2xl` wird der Pfad ausgeblendet.
4. **Farben.** Papierkreise und Stempel sind fix (`PAPER` aus [`lib/scrapbook.ts`](../lib/scrapbook.ts)). Pfeile, Pfad, Hairline und Labels liegen auf dem Seitenhintergrund und folgen dem Theme (`text-muted-foreground`, `bg-border`).
5. **Animation** über `motion/react`, Stagger-Delays je Property (COMPONENT-GUIDELINES §5). `useReducedMotion()` schaltet alle Einblendungen ab, die Kette steht dann sofort komplett da.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `steps` | `{ icon: ReactNode; label: string }[]` | required | Schritte in Reihenfolge. `label` dient auch als React-Key, sollte also eindeutig sein. |
| `variant` | `'paper' \| 'trail' \| 'ledger'` | `'paper'` | Darstellung (siehe Features). |
| `className` | `string` | — | Klassen am Wrapper (Container). |
| `style` | `CSSProperties` | — | Inline-Styles am Wrapper. |

Das im Plan vorgesehene `arrowIcon` ist bewusst weggelassen, bis ein Consumer einen eigenen Pfeil braucht.

## Usage

### Golden Path

```tsx
import { Barrel, Droplets, Grape, Sun, Wine } from 'lucide-react'
import { ProcessSteps } from '@components/process-steps/process-steps'

const icon = { size: 34, strokeWidth: 1.4 }

<ProcessSteps
  steps={[
    { icon: <Sun {...icon} />, label: 'Reifen am Stock' },
    { icon: <Grape {...icon} />, label: 'Lese von Hand' },
    { icon: <Droplets {...icon} />, label: 'Sanft pressen' },
    { icon: <Barrel {...icon} />, label: 'Reifen im Fass' },
    { icon: <Wine {...icon} />, label: 'Verkosten' },
  ]}
/>
```

### Wanderpfad für eine Event-Einladung

```tsx
<ProcessSteps variant="trail" steps={steps} />
```

### Editorial in einer Maison-Section

```tsx
<ProcessSteps variant="ledger" steps={steps} className="max-w-5xl" />
```

## Hinweise

- **Schriften lädt die App:** `trail` braucht `@fontsource/caveat` (`400.css`), `ledger` eine Display-Serif über das Tailwind-Token `--font-display` (im Repo Cormorant Garamond via `@fontsource/cormorant-garamond`, `300-italic.css`). Ohne Token fällt `font-display` auf die Grundschrift zurück.
- **Icons:** Linien-Icons um 32–36 px wirken in `paper` und `trail` am besten. In `ledger` werden sie per CSS auf 24 px mit dünnerem Strich verkleinert.
- **Astro ohne Hydration:** Die Schritte starten unsichtbar und blenden erst per JS ein. In einer Astro-Insel daher `client:visible` setzen.
- **A11y:** Nicht interaktiv, nichts fokussierbar. Icons, Pfeile, Pfad, Nummern und Ziffern sind `aria-hidden`. Screenreader lesen eine nummerierte Liste der Labels.

## Dependencies

- `motion` (`motion/react`) für die Einblendungen.
- `cn()` aus `@components/lib/utils`, Farben und Papierkorn aus `@components/lib/scrapbook`.
- In der konsumierenden App: `@fontsource/caveat` (für `trail`), eine Display-Serif als `--font-display` (für `ledger`).
