# WaveText

Text mit verstecktem Klick-Easteregg: Ein Klick schickt eine Welle durch die Zeichen. Gedacht für
vertikale Meta-Rails an der Seitenkante, funktioniert aber auf jedem Text.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Character Wave** | Jedes Zeichen schwingt quer zur Leserichtung aus und zurück, versetzt um `stagger` ms — die Welle läuft die Zeile entlang. |

## How It Works

1. **Gestaffelte Verzögerung**: Der String wird in Zeichen zerlegt, jedes in ein eigenes
   `inline-block`-Span. Alle bekommen dieselbe Animation, aber `animation-delay: index * stagger`.
   Die Welle entsteht ausschließlich durch den Versatz — ohne ihn wackelt die Zeile als Block.
2. **`translateX`, nicht `translateY`**: Unter `writing-mode: vertical-rl` stapeln sich die Zeichen
   auf der Y-Achse. Eine Auslenkung dort schiebt sie ineinander (Ziehharmonika statt Welle). Quer
   zur Leserichtung liegt in dem Fall die X-Achse.
3. **Amplitude als CSS-Variable**: `--wave-text-amplitude` sitzt am Wrapper, die Keyframe-Regel liest
   sie. So existiert die Regel genau einmal im Dokument und bedient trotzdem jede Instanz mit
   eigenem Ausschlag (Guidelines §4b).
4. **Neustart per `key`-Remount**: CSS-Animationen starten nicht neu, nur weil man sie erneut
   zuweist. Statt des üblichen Reflow-Tricks (`void el.offsetWidth`) zählt jeder Klick hoch; der
   Zähler geht in den `key` der Zeichen-Spans, React baut sie neu, die Animation läuft von vorn. Ein
   zweiter Klick mitten in der Welle wird dadurch nicht verschluckt.
5. **Keyframe-Injection**: einmal pro Page-Load in den `<head>`, dedupliziert per
   `__wave-text-styles__` (Guidelines §4c). `prefers-reduced-motion` wird im selben Block per CSS
   abgeschaltet — nicht zusätzlich in JS (§9: entweder Hook ODER CSS).

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `string` | | Der Text — wird zeichenweise animiert. |
| `amplitude` | `number` | `6` | Ausschlag quer zur Leserichtung in px. Richtwert: unter der Zeichenbreite bleiben, sonst wirkt es hektisch. |
| `duration` | `number` | `600` | Schwingungsdauer eines einzelnen Zeichens in ms. |
| `stagger` | `number` | `40` | Versatz zwischen zwei Zeichen in ms. Der Durchlauf dauert `Zeichenzahl × stagger`. |
| `className` | `string` | | Layout kommt komplett vom Aufrufer — die Komponente schreibt keine Klassen vor. |
| `style` | `CSSProperties` | | |

## Usage

```tsx
// Vertikale Meta-Rail an der Seitenkante (der Ursprungs-Use-Case)
<WaveText className="block text-[9px] font-bold tracking-[0.45em] whitespace-nowrap
                     text-muted-foreground uppercase [writing-mode:vertical-rl]">
  Sooss · Niederösterreich — Familie Buchart
</WaveText>

// Horizontal, kürzerer Durchlauf
<WaveText amplitude={4} stagger={25}>Weingut Buchart 58</WaveText>
```

## Accessibility

**Bewusste Abweichung von Guidelines §7 (Tastatur-Pflicht).** Die Komponente ist *kein* Button:
kein `role`, kein `tabIndex`, kein Fokus-Ring, kein `cursor: pointer`.

Begründung: Hinter dem Klick liegt keine Funktion und keine Information. Der Text ist ohne jede
Interaktion vollständig lesbar und wird unverändert vorgelesen — es gibt nichts, das Tastatur- oder
AT-Nutzern entginge. Ein Tab-Stop, der eine Animation abspielt und sonst nichts tut, wäre für diese
Nutzer zusätzliches Rauschen ohne Gegenwert. WCAG 2.1.1 (Keyboard) greift hier nicht, weil keine
*Funktionalität* an den Zeiger gebunden ist.

Der Gegensatz zu [`click-spark`](../click-spark/COMPONENT.md) ist gewollt: Das ist ein **Wrapper**
um beliebige `children`, dekoriert also eine ohnehin interaktive Fläche und braucht deshalb
`role="button"`. `WaveText` ist ein **Blatt-Element** — reiner Text, sonst nicht interaktiv.

Weiter beachtet:
- Der ungeteilte String steht zusätzlich als `.sr-only`-Span im Markup, die Zeichen-Spans sind
  `aria-hidden`. Ohne das buchstabieren Screenreader den Text, weil jedes Zeichen `inline-block` ist.
- Leerzeichen werden als ` ` gerendert, damit sie beim Splitten nicht kollabieren.
- `prefers-reduced-motion` schaltet die Animation ab; der Klick bleibt dann folgenlos, was korrekt
  ist — der gesamte Effekt *ist* Bewegung.

## Dependencies

`cn()` aus [`components/lib/utils.ts`](../lib/utils.ts). Kein `motion/react` — die Animation ist
self-contained CSS (Guidelines §4c).
