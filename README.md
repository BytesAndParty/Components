# Components Library

Persönliche Component Library für React 19 – wiederverwendbare, animierte UI-Komponenten mit Fokus auf Micro-Interactions. Shadcn-Style: Copy-Paste in beliebige Projekte.

**Tech Stack**: React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · Framer Motion 12 · Bun

---

## Available Components (32)

### Text & Typography
| Component | Path | Dependencies |
|---|---|---|
| `aurora-text` | `aurora-text/` | – |
| `highlighter` | `highlighter/` | – |
| `sparkles-text` | `sparkles-text/` | – |
| `text-rotate` | `text-rotate/` | `framer-motion` |
| `text-scramble` | `text-scramble/` | `framer-motion` |
| `velocity-scroll` | `velocity-scroll/` | `framer-motion` |

### Cards & Effects
| Component | Path | Dependencies |
|---|---|---|
| `click-spark` | `click-spark/` | – |
| `confetti` | `confetti/` | – |
| `glow-card` | `glow-card/` | – |
| `rotating-glow-card` | `glow-card/` | – |
| `hover-3d-card` | `hover-3d-card/` | – |
| `scroll-rotate` | `scroll-rotate/` | `framer-motion` |

### Inputs & Controls
| Component | Path | Dependencies |
|---|---|---|
| `animated-search` | `animated-search/` | `framer-motion` |
| `autocomplete-cell` | `autocomplete-cell/` | `framer-motion` |
| `checkbox` | `checkbox/` | – |
| `pricing-interaction` | `pricing-interaction/` | `@number-flow/react` |
| `rating` | `rating/` | – |
| `search-morph` | `search-morph/` | `framer-motion` |
| `switch` | `switch/` | – |
| `use-image-upload` | `use-image-upload/` | – |

### Navigation & Layout
| Component | Path | Dependencies |
|---|---|---|
| `banner` | `banner/` | – |
| `breadcrumb` | `breadcrumb/` | – |
| `footer-section` | `footer-section/` | `framer-motion`, `lucide-react` |
| `navbar` | `navbar/` | `framer-motion` |
| `scroll-progress` | `scroll-progress/` | – |
| `stepper` | `stepper/` | `framer-motion` |

### Feedback & Interaction
| Component | Path | Dependencies |
|---|---|---|
| `heart-favorite` | `heart-favorite/` | `framer-motion` |
| `magnetic-button` | `magnetic-button/` | `framer-motion` |
| `toast` | `toast/` | `framer-motion` |

### Theming & Icons
| Component | Path | Dependencies |
|---|---|---|
| `accent-switcher` | `accent-switcher/` | `lucide-react` |
| `animated-icons` | `animated-icons/` | `lottie-react` |
| `animated-theme-toggler` | `animated-theme-toggler/` | – |
| `animated-weather-icons` | `animated-weather-icons/` | `framer-motion` |

---

## Quick Start

Komponenten werden **nicht als npm-Package** verteilt, sondern per Copy-Paste:

```bash
cp components/glow-card/glow-card.tsx your-project/src/components/ui/
```

Alle Komponenten verwenden **Named Exports** – kein Default Export.

## Showcase

Demo-App unter `showcase/`:

```bash
cd showcase
bun install
bun run dev
```

7 Seiten: Text, Cards, Icons, Inputs, Feedback, Navigation, Shop

## Conventions

- **Named Exports only** – kein Default Export
- **Inline Styles** für maximale Portabilität
- **CSS Custom Properties** (`--accent`, `--bg`, `--card`, `--border`, `--text`) für Theming
- **Controlled + Uncontrolled** Pattern bei checkbox, switch, rating
- **prefers-reduced-motion** wird respektiert
