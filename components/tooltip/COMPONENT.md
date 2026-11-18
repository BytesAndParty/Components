# Tooltip

Ein leichtgewichtiges, glassmorphisches Tooltip-System zur Anzeige von Kontextinformationen.

## Features
- **Glassmorphism:** Subtiler Blur und semitransparente Hintergründe.
- **Flexibles Positioning:** Unterstützung für `top`, `bottom`, `left` und `right`.
- **AnimatePresence:** Sanfte Scale- und Fade-Animationen beim Ein- und Ausblenden.
- **Composable:** Einfacher Wrapper um jedes beliebige Element.
- **A11y:** Öffnet bei Hover (nach `delay`) und bei Fokus (sofort). Das Element, das den Fokus bekommt, verweist per `aria-describedby` auf das `role="tooltip"`-Element, nicht der Wrapper: Der ist nicht fokussierbar, ein Screenreader liest dort nichts. Die Tooltip-ID wird beim Fokus an vorhandene `aria-describedby`-IDs angehängt und beim Blur wieder entfernt; das klappt in jeder Tiefe, auch wenn das Kind eine Komponente ist, die keine Props durchreicht (`CartIcon`, `HeartLike`). Ohne Verzögerung bei Fokus, weil der Screenreader das fokussierte Element sofort vorliest und ein später eingeblendeter Tooltip nicht mehr angesagt wird. Der Tooltip trägt kein eigenes `aria-label`: Das hätte bei der Namensberechnung Vorrang vor dem Inhalt. Ein Trigger ohne fokussierbares Element (nur Hover) bekommt keine Beschreibung.

## Verwendung

```tsx
import { Tooltip } from '@components/tooltip/tooltip';

function MyComponent() {
  return (
    <Tooltip content="In den Warenkorb legen" position="top">
      <button>Add to Cart</button>
    </Tooltip>
  );
}
```

## Props

| Prop | Typ | Standard | Beschreibung |
| :--- | :--- | :--- | :--- |
| `content` | `ReactNode` | `-` | Der im Tooltip anzuzeigende Inhalt. |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Die Position relativ zum Trigger. |
| `delay` | `number` | `0.2` | Verzögerung in Sekunden vor dem Einblenden. |
| `className` | `string` | `-` | Zusätzliche CSS-Klassen für den Tooltip-Container. |
| `children` | `ReactNode` | `-` | Trigger-Element, an dem der Tooltip hängt (Pflicht). Enthält es ein fokussierbares Element, wird dieses beim Fokus per `aria-describedby` beschrieben. |

Keine `messages`-Prop: Die Komponente hat keine eigenen UI-Texte, der Inhalt kommt über `content`.

## Abhängigkeiten

- `motion` (`motion/react`) — Ein-/Ausblend-Animation
- `cn()` aus `components/lib/utils.ts`
