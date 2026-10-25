---
name: css-corner-shape
description: Cached reference for CSS `corner-shape` (CSS Borders Module Level 4) — squircle/scoop/notch/bevel corner shapes that modify what `border-radius` rounds, with Border/Outline/Shadow/Background following automatically. Load when building squircle-style cards, asymmetric/concave corners, or checking current browser support (Chrome/Edge stable, Safari Technology Preview and Firefox only "preview").
---

## Was dieser Skill ist

Gecachte Referenz für `corner-shape` — modifiziert die Form der durch `border-radius` definierten Rundung (Squircle, Scoop, Notch, Bevel, freie `superellipse(<n>)`-Werte). Braucht aktiven `border-radius` (>0), sonst kein Effekt. Chrome/Edge seit 139 stable, Safari inzwischen in der Technology Preview, Firefox laut MDN (Stand 2026-10) ebenfalls „preview“; Release-Support gibt es weiterhin nur in Chromium.

Vor jedem Einsatz die Progressive-Enhancement-Pflicht in `reference.md` beachten (`@supports`-Fallback auf reines `border-radius`).

## Related skills

- **`css-border-shape`** — komplette Box-Geometrie statt nur Ecken (Sterne, Mid-Edge-Cutouts, Pfade). Orthogonal kombinierbar: `corner-shape` greift auf die Ecken, die `border-shape`-Geometrie als Ecken erkennt.

## References

- `reference.md` — Werte-Tabelle mit Superellipse-Äquivalenten, Syntax, praktische Patterns (Apple-Card, Ticket-Stub, Sale-Tag), Animation über `@property`.

## Notes

- Gecachter Snapshot, Stand siehe `reference.md`-Kopfzeile. Browser-Support ändert sich hier schneller als bei npm-Paketen — vor Produktiv-Einsatz kurz gegen MDN/caniuse gegenprüfen.
- Master-Quelle ist `__AI-Workflow__/skills/live-docs-collection/css-corner-shape/css-corner-shape.md`, gepflegt über `/live-docs-update`.
