# Project Instructions (Enterprise Design Engine)

Behavioral guidelines to build a high-end, accessible, and integrated component system. These are foundational mandates for this workspace.

**Strategic Pivot:** We prioritize a cohesive **Design Engine** over standalone portability. This means deep integration with industry-standard tools (TanStack) to provide "out-of-the-box" excellence in logic, accessibility, and internationalization.

## 1. Integrated Excellence (TanStack & Logic)

**Don't reinvent the wheel. Use the gold standard.**

- **State & Data:** Use **TanStack Query** for all data fetching and server-state management.
- **Tables & Forms:** Use **TanStack Table** and **TanStack Form** for complex data interactions.
- **Interactions:** Use specialized hooks (e.g., for hotkeys) to ensure robust keyboard support.
- **Built-in i18n:** Components should include slots or patterns for translations (built-in labels should be translatable).

## 2. Accessibility First (A11y)

**Accessibility is not a feature; it is the foundation.**

- Use ARIA attributes and roles correctly.
- Ensure 100% keyboard navigability for all interactive elements.
- Prioritize focus management (traps, auto-focus, restore).
- Follow WAI-ARIA patterns for complex components (modals, tooltips, search).

## 3. Simplicity & Surgical Changes

**Minimum code that solves the problem. Touch only what you must.**

- No speculative features.
- Match existing style, but modernize logic towards the new integrated standard.
- Remove orphans created by your changes.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add Search" → "Implement with TanStack Query, verify a11y, verify hotkeys"
- "Fix Form" → "Integrate with TanStack Form, ensure validation feedback is screen-reader accessible"

---

**These guidelines are working if:** Components feel "intelligent" (shortcuts, smooth data flow), are perfectly accessible, and provide a unified developer experience across the entire system.
