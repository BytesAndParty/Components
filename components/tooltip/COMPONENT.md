# Tooltip

Ein leichtgewichtiges, glassmorphisches Tooltip-System zur Anzeige von Kontextinformationen.

## Features
- **Glassmorphism:** Subtiler Blur und semitransparente Hintergründe.
- **Flexibles Positioning:** Unterstützung für `top`, `bottom`, `left` und `right`.
- **AnimatePresence:** Sanfte Scale- und Fade-Animationen beim Ein- und Ausblenden.
- **Composable:** Einfacher Wrapper um jedes beliebige Element.
- **A11y:** Öffnet bei Hover und Fokus; der Trigger verweist per `aria-describedby` auf das `role="tooltip"`-Element.

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
| `children` | `ReactNode` | `-` | Trigger-Element, an dem der Tooltip hängt (Pflicht). |
| `messages` | `Partial<TooltipMessages>` | `-` | i18n-Overrides für das Tooltip-Label. |

## Abhängigkeiten

- `motion` (`motion/react`) — Ein-/Ausblend-Animation
- `cn()` aus `components/lib/utils.ts`
