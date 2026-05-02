# Tooltip

Ein leichtgewichtiges, glassmorphisches Tooltip-System zur Anzeige von Kontextinformationen.

## Features
- **Glassmorphism:** Subtiler Blur und semitransparente Hintergründe.
- **Flexibles Positioning:** Unterstützung für `top`, `bottom`, `left` und `right`.
- **AnimatePresence:** Sanfte Scale- und Fade-Animationen beim Ein- und Ausblenden.
- **Composable:** Einfacher Wrapper um jedes beliebige Element.
- **A11y:** Unterstützung für Hover- und Focus-Events.

## Installation

Kopiere die Datei `tooltip.tsx` in dein Projekt und installiere die Abhängigkeiten:

```bash
npm install framer-motion clsx tailwind-merge
```

## Verwendung

```tsx
import { Tooltip } from './components/tooltip/tooltip';

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
| `position` | `'top' | 'bottom' | 'left' | 'right'` | `'top'` | Die Position relativ zum Trigger. |
| `delay` | `number` | `0.2` | Verzögerung in Sekunden vor dem Einblenden. |
| `className` | `string` | `-` | Zusätzliche CSS-Klassen für den Tooltip-Container. |
