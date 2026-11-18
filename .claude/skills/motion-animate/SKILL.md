---
name: motion-animate
description: Cached reference for `motion` 14 (successor to `framer-motion`, `motion/react` re-exports it) — imperative `animate()`/`stagger()` API, Vanilla vs. React import paths, `motion/mini` vs. Hybrid vs. `LazyMotion` bundle sizing, spring config, `animate.addEffect()` for Three.js/WebGPU. Load before migrating from `framer-motion` to `motion`, writing GSAP-style imperative DOM animation, choosing between `motion/mini`, the Hybrid build or `LazyMotion`/`m` to shrink a bundle, or debugging why a spring/transform isn't applying.
---

## Was dieser Skill ist

Gecachte Referenz für `motion` (v14) — insbesondere die **imperative** API (`animate()`, `stagger()`), die GSAP-artigen Code ohne Umbau des Komponentenbaums ermöglicht. Deckt den Unterschied React- vs. Vanilla-Import, die Bundle-Größen-Tradeoffs zwischen `motion/mini` und dem Hybrid-Build sowie Spring-Konfiguration ab.

## References

- `reference.md` — Entry-Points/Bundle-Größen-Tabelle, Signaturen, `AnimationOptions`, Spring-Config, `stagger()`, Sequences, GSAP→motion-Mapping, Minor-Historie bis 14.14 (neu u. a. `press`/`pinch`-Gesten, `mass: "auto"`, `AnimateView`, overdamped Springs) und der Abschnitt „Migration `framer-motion` → `motion`" mit gemessenem Bundle-Vergleich (`motion/react` = Re-Export, kein Gewinn; `LazyMotion` + `m.*` ≈ −30 %).

## Notes

- Gecachter Snapshot, Stand siehe `reference.md`-Kopfzeile. Bei Verdacht auf Veraltung: neueste veröffentlichte Version per `bun info motion version` prüfen, die im Projekt installierte steht in `node_modules/motion/package.json` (Feld `version`).
- Master-Quelle ist `__AI-Workflow__/skills/live-docs-collection/motion-animate/motion-animate.md`, gepflegt über `/live-docs-update`.
- Artelier-Standard für Animation ist `motion/react` bzw. `motion` vanilla — nicht `framer-motion` oder `gsap` neu adoptieren. Der Wechsel ist reine Namenspflege (Import-Tausch), die Bundle-Größe ändert sich dadurch nicht.
