# Styling-Entscheidungen

## Aktueller Stand (2026-10-06)

Die Storefront ist auf Tailwind-Klassen umgestellt. Komponenten aus `components/` werden nicht mehr
kopiert, sondern über den Alias `@components` eingebunden und bringen ihr Styling selbst mit.

Inline-Styles gibt es nur noch für dynamische Werte (siehe COMPONENT-GUIDELINES §4b) — aktuell drei
Stellen in `AccentPicker.tsx`: die Swatch-Farben pro Akzent und ein `zIndex` am Ark-UI-`Popover.Positioner`.

## Regeln

- Layout, Spacing, Typo und Farben über Tailwind-Utilities mit semantischen Tokens (`bg-card`,
  `text-muted-foreground`, `border-border`, …) — keine Hex-Werte.
- Werte, die sich pro Instanz oder Interaktion ändern (Farbe eines Swatches, Position, Progress),
  gehen als Inline-Style bzw. CSS-Variable über `style`, nicht als generierte Klasse.
- CSS Custom Properties (`--accent`, `--border` etc.) bleiben die Quelle der Wahrheit und werden im
  Tailwind-Theme referenziert.
