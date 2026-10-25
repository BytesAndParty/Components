---
name: css-border-shape
description: Cached reference for CSS `border-shape` (CSS Borders Module Level 4) — non-rectangular boxes where Background/Border/Outline/Box-Shadow/Hit-Testing all follow the new geometry, unlike `clip-path`. Load when building a shaped card/tooltip/ticket UI, comparing `border-shape` vs. `clip-path` vs. `corner-shape`, or checking current browser support before shipping it unflagged.
---

## Was dieser Skill ist

Gecachte Referenz für `border-shape` — die Property, die die komplette Box-Geometrie neu definiert (nicht nur die Ecken wie `corner-shape`, nicht nur visuell wie `clip-path`). Seit Chrome/Edge 147 (April 2026) in **stable**, kein Flag mehr nötig; Firefox/Safari fehlen weiterhin.

Vor jedem Einsatz von `border-shape` in Produktion die Progressive-Enhancement-Strategie in `reference.md` heranziehen (`@supports`-Fallback auf `clip-path`), nicht ungeprüft ohne Fallback shippen.

## Related skills

- **`css-corner-shape`** — deckt nur die Eckenform ab (mit `border-radius`), orthogonal kombinierbar mit `border-shape`. Bei reinen Ecken-Anwendungsfällen (Squircle, Scoop-Ecken) dorthin.

## References

- `reference.md` — Akzeptierte Werte, `shape()`-Constructor-Syntax, Unterschied zu `clip-path`/`corner-shape`, Production-Fallback-Pattern.

## Notes

- Gecachter Snapshot, Stand siehe `reference.md`-Kopfzeile. Browser-Support ändert sich hier schneller als bei npm-Paketen — vor Produktiv-Einsatz kurz gegen MDN/caniuse gegenprüfen.
- Master-Quelle ist `__AI-Workflow__/skills/live-docs-collection/css-border-shape/css-border-shape.md`, gepflegt über `/live-docs-update`.
