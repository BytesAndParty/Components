---
name: new-component
description: Use when someone asks to build a new component in the __Components__ library, add a component to the showcase, or port one from another UI library (Aceternity, HeroUI, daisyUI, shadcn, Magic UI, 21st.dev) into the project.
argument-hint: [component name or source URL]
---

# new-component

Ablauf für eine neue Komponente unter `components/`, von der Vorlage bis zum Showcase-Eintrag. Die Bauregeln selbst stehen in `COMPONENT-GUIDELINES.md` (lädt automatisch, sobald Dateien unter `components/` angefasst werden). Dieser Skill legt nur die Reihenfolge fest und verweist auf die Abschnitte dort.

## Workflow

1. **Bestand prüfen.** In `components/COMPONENTS-OVERVIEW.md` nachsehen, ob es die Komponente oder eine nahe Verwandte schon gibt. Erweitern geht vor neu bauen.
2. **Fremde Vorlage nachbauen, nicht installieren.** Kommt die Vorlage aus Aceternity, HeroUI, daisyUI, shadcn o. Ä., wird sie im Projektstil neu geschrieben. Deren fest verdrahtete Tailwind-Farbklassen reagieren nicht auf Theme und Akzent und würden das System zersplittern. Ein CLI-Install (`bunx --bun shadcn@latest add …`) ist nur erlaubt, um den Quellcode als Referenz zu holen. Danach umschreiben und das Original samt seiner Abhängigkeiten wieder entfernen. Headless-Teile über Ark UI, Animation über `motion/react`.
3. **Neue Abhängigkeit?** Erst Skill `artelier` (eine Capability, eine Lib) und `live-docs-collection` laden, dann im Workspace `components/` per `bun add` hinzufügen.
4. **Dateien anlegen** nach COMPONENT-GUIDELINES §3: `components/<kebab-name>/<kebab-name>.tsx` (named export), bei UI-Text `messages.ts` mit `de` + `en` (§6) und `COMPONENT.md` mit Features, How It Works, Props-Tabelle, Usage und Dependencies.
5. **Bauen** nach §2 (Tokens), §4 (Styling), §5 (Animation, Reduced Motion), §7 (A11y), §8 (API). Jede Interaktion bekommt eine kleine, spürbare Rückmeldung (§1).
6. **Showcase:** Die Komponente in `components-showcase/src/data.ts` der passenden Gruppe zuordnen und auf der zugehörigen Seite unter `components-showcase/src/pages/` eine Demo mit Golden Path und Edge-Cases ergänzen (§10).
7. **Übersicht:** Eintrag in `components/COMPONENTS-OVERVIEW.md` in der passenden Kategorie.
8. **Prüfen:** Skill `components-verify`.

## Output

Am Ende die angelegten bzw. geänderten Dateien auflisten und die Browser-Checks aus `components-verify` nennen, die der User machen sollte.

## Related skills

- **components-verify** – Prüfschritte nach dem Bauen.
- **artelier** – welche Lib für welche Capability.
- **ark-ui**, **tailwindcss**, **tanstack-query**, **tanstack-form** – Lib-Referenzen beim Bauen.
- **frontend-design** – nur, wenn der User ausdrücklich eine gestalterische Richtung erarbeiten will.
