# Back to Top

Ein dezenter Floating-Button, der nach einer bestimmten Scroll-Distanz erscheint und den Nutzer sanft zum Seitenanfang zurückführt.

## Features
- **Magnetic Effect:** Nutzt den `MagneticButton` für ein interaktives Gefühl.
- **Scroll Threshold:** Erscheint erst, wenn der Nutzer eine konfigurierbare Distanz gescrollt hat.
- **Smooth Scroll:** Nutzt die native Browser-Scroll-API für sanfte Bewegungen.
- **AnimatePresence:** Sanftes Ein- und Ausblenden des Buttons.

## Installation

Kopiere die Datei `back-to-top.tsx` in dein Projekt. Stellt sicher, dass die `MagneticButton` Komponente ebenfalls verfügbar ist.

## Verwendung

```tsx
import { BackToTop } from './components/back-to-top/back-to-top';

function Layout() {
  return (
    <div>
      {/* Content */}
      <BackToTop threshold={500} />
    </div>
  );
}
```

## Props

| Prop | Typ | Standard | Beschreibung |
| :--- | :--- | :--- | :--- |
| `threshold` | `number` | `400` | Scroll-Distanz in Pixeln, ab der der Button sichtbar wird. |
| `className` | `string` | `-` | Zusätzliche CSS-Klassen für den Container. |
