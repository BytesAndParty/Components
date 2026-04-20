# Styling-Entscheidungen

## Aktueller Stand

Tailwind CSS ist konfiguriert (`@tailwindcss/vite`), wird aber gemischt mit Inline-Styles verwendet.
Komponenten die aus `components/` übernommen wurden bringen ihre Inline-Styles mit,
im wine-showcase selbst kommen vereinzelt Tailwind-Klassen dazu.

## Geplante Umstellung

**Ziel:** Vollständige Umstellung auf Tailwind-Klassen – keine Inline-Styles mehr im Storefront.

**Warum:**
- Tailwind-Tokens (`rounded-lg`, `text-sm`, `gap-4` etc.) sind ein zentraler Designpunkt
- Änderungen am Design (z.B. Border-Radius, Spacing) an einer Stelle, nicht in jeder Komponente einzeln
- Konsistenz mit modernen React-Projekten

**Was das bedeutet:**
- Komponenten die aus `components/` kopiert werden, müssen beim Einbau ins Storefront auf Tailwind-Klassen umgeschrieben werden
- `style={{ borderRadius: '12px' }}` → `className="rounded-xl"`
- CSS Custom Properties (`--accent`, `--border` etc.) bleiben erhalten – sie werden via Tailwind-Theme oder direkt in `globals.css` definiert
