# __Components__ Project Context

Enterprise Design Engine — component library for BuchArt58 and related projects.

## Stack

- React 19 + React Compiler (no manual useMemo/useCallback)
- TanStack Query (server-state), TanStack Form, TanStack Table
- Ark UI for headless components (no Radix, no shadcn)
- motion/react for animations (no framer-motion)
- Astro for static pages, Vite for components

## Priorities

- A11y first — 100% keyboard navigable, correct ARIA, WAI-ARIA patterns
- Capability overlap forbidden — one responsibility, one library (see ARTELIER.md)
- Every component gets a COMPONENT.md

## Forbidden imports (enforced via eslint no-restricted-imports)

urql, @urql/*, swr, apollo-client, @radix-ui/*, @headlessui/*, framer-motion, gsap
