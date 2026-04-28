# Expansion Plan: Basic & Advanced Components

This document outlines the roadmap for adding essential UI components to the library, focusing on functionality, accessibility, and the established "fancy" aesthetic.

---

## 🎨 Design & Interaction Principles

To ensure new components feel like part of the existing suite, they must adhere to these "Fancy Minimal" tokens:

- **Micro-Elasticity:** Use spring-based animations (`damping: 20, stiffness: 150`) for all state changes.
- **Liquid Transitions:** Prefer morphing shapes and "gooey" effects for selection states.
- **Glassmorphism:** Use subtile `backdrop-blur` and thin borders (`0.5px` or `1px`) for overlays.
- **Adaptive Feedback:** Every click/hover must trigger a physical response (scale, shift, or glow).

---

## 🧩 Component Variants Strategy

Following the `shadcn` pattern, each component will offer distinct variants to cover different aesthetic needs while maintaining the core "fancy" feel.

### 1. High-Priority Components

#### Data Table
- **Inspiration:** [Untitled UI Tables](https://www.untitledui.com/react/components/tables)
- **Features:**
    - Performant rendering for large datasets.
    - Integrated row selection and bulk actions.
    - **Animated Data Viz:** Include "Sparklines" (mini charts) that perform a "drawing" animation (SVG path length) when the table or row loads.
    - **Variant `minimal`:** Clean, borderless rows with subtle hover states.
    - **Variant `fancy`:** Floating card rows, animated entry/exit of data, and smooth sorting transitions.
    - **Features:** Sortable columns, filterable views, and built-in pagination.

#### Calendar / Date Picker
- **Inspiration:** [HeroUI Calendar](https://heroui.com/docs/react/components/calendar)
- **Variant `default`:** Minimalist, clean grid, subtle hover glows.
- **Variant `floating`:** Glassmorphic cards for each day, high contrast for selection.

#### Accordion
- **Inspiration:** [HeroUI Accordion](https://heroui.com/docs/react/components/accordion)
- **Variant `classic`:** Smooth height expansion with staggered content entry.
- **Variant `glass`:** Borderless items that reveal depth via blur when expanded.
- **Idea:** Integrate text reveal animations for content.

### 2. Form & Selection (Foundational)

#### Multi-Select / Select
- **Inspiration:** [Untitled UI Select](https://www.untitledui.com/react/components/selects)
- **Key Feature:** Search-on-top functionality (controllable via `withSearch` prop).
- **Variant `tags`:** Selected items appear as animated tags.
- **Variant `minimal`:** Text-based display, optimized for clean forms.

#### Radio Group
- **Variant `liquid`:** Selection indicator "flows" between options using gooey filters.
- **Variant `card`:** Each option is a small card that scales and glows when selected.

#### Linear Progress
- **Variant `glow`:** A sleek bar with a neon trailing glow at the progress head.
- **Variant `shimmer`:** Includes a moving light-ray effect for indeterminate/loading states.

---

## 🛠 Project Foundations

Our project already aligns with the modern styling and typography standards seen in `shadcn` and `untitledui`:
- **Styling:** Tailwind CSS 4 with OKLCH color variables and semantic mapping (`--color-background`, `--color-accent`, etc.).
- **Typography:** System-native sans-serif stack with optimized leading and antialiasing.
- **Utility:** Canonical `cn()` utility using `tailwind-merge` and `clsx` is implemented in `components/lib/utils.ts`.

---

## 🚀 Implementation Strategy

1. **Research & Design:** Define the specific motion curves for each variant.
2. **Implementation:** Build using React + Tailwind + Framer Motion.
3. **Showcase:** Create a dedicated "Variants Gallery" for each component in the showcase app.
