---
name: motion-animate
description: Cached reference for `motion` (successor to `framer-motion`) — imperative `animate()`/`stagger()` API, Vanilla vs. React import paths, `motion/mini` vs. Hybrid bundle sizing, spring config, `animate.addEffect()` for Three.js/WebGPU. Load before writing GSAP-style imperative DOM animation, choosing between `motion/mini` and the Hybrid build, or debugging why a spring/transform isn't applying.
---

## Was dieser Skill ist

Gecachte Referenz für `motion` (v13) — insbesondere die **imperative** API (`animate()`, `stagger()`), die GSAP-artigen Code ohne Umbau des Komponentenbaums ermöglicht. Deckt den Unterschied React- vs. Vanilla-Import, die Bundle-Größen-Tradeoffs zwischen `motion/mini` und dem Hybrid-Build sowie Spring-Konfiguration ab.

## References

- `reference.md` — Entry-Points/Bundle-Größen-Tabelle, Signaturen, `AnimationOptions`, Spring-Config, `stagger()`, Sequences, GSAP→motion-Mapping, Minor-Historie bis 14.0 (neu: `AnimateView`, overdamped Springs).

## Notes

- Gecachter Snapshot, Stand siehe `reference.md`-Kopfzeile. Bei Verdacht auf Veraltung: neueste veröffentlichte Version per `bun info motion version` prüfen, die im Projekt installierte steht in `node_modules/motion/package.json` (Feld `version`).
- Master-Quelle ist `__AI-Workflow__/skills/live-docs-collection/motion-animate/motion-animate.md`, gepflegt über `/live-docs-update`.
- Artelier-Standard für Animation ist `motion/react` bzw. `motion` vanilla — nicht `framer-motion` oder `gsap` neu adoptieren.
