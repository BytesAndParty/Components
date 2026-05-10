# Artelier Workflow Guidelines
**Reference Date for "Latest Standards": Saturday, May 9, 2026**

#### 1. Runtime & Package Management
- **Bun First:** Nutze primär `bun` für alle Operationen (Installation, Scripts, Runtime).
- **Dependency Research:** Prüfe `package.json` auf Updates. Extrahiere Change-Notes neuer Versionen und archiviere sie im zentralen Verzeichnis: `techstack-base`.

#### 2. Engineering Standards
- **Karpathy-Rules:** Alle Implementierungen folgen strikt den Prinzipien in der `KARPATHY.md` (Think Before Coding, Simplicity, Surgical Changes, Goal-Driven).
- **Surgical Execution:** Ändere nur, was absolut notwendig ist. Keine ungefragten Refactorings ("Drive-by").
- **Iterative Refactoring:** Wenn ein technischer Ansatz fehlschlägt, darf nicht einfach "darüber gepatcht" werden. Der bisherige (fehlgeschlagene) Code muss sauber refactored oder zurückgesetzt werden, bevor ein neuer Lösungsversuch implementiert wird.

#### 3. Repository Integrity (AI Stealth)
- **Zero AI Footprint:** Committe niemals KI-Referenzen, Prompts oder Tool-Metadaten in Repositories.
- **Global Protection:** Nutze eine globale `.gitignore` für AI-Verzeichnisse (`.agents/`, `.gemini/`, `.claude/`, etc.).

#### 4. Documentation Lifecycle
- **Central Storage:** `/Users/robert.stickler/Development/__AI-Workflow__/Skills/techstack-base`
- **Maintenance:** Wenn Dokumentation fehlt oder veraltet ist, wird sie erstellt und synchron gehalten. Nutze immer die aktuellsten Versionen aus diesem Verzeichnis.

#### 5. Linting & Code Quality
Jedes Frontend-Projekt verwendet ESLint mit folgendem Stack (Flat Config, ESLint 9+):

- **`eslint-plugin-react-hooks`** — erzwingt Rules of Hooks und enthält die `react-compiler` Rule, die Code aufdeckt, den der React Compiler nicht optimieren kann (Mutationen im Render, Side-Effects außerhalb von Effects, Ref-Zugriffe im Render).
- **`eslint-plugin-react-refresh`** — sichert HMR ab, indem nur Components/Hooks aus Component-Dateien exportiert werden dürfen. Verhindert Fast-Refresh-Reloads beim Editieren.
- **`typescript-eslint`** — TypeScript-aware Rules (Type-Imports, ungenutzte Vars, `any`-Eskalation, exhaustive switch, etc.).

Standardisiert: jedes Projekt hat ein `eslint.config.js` mit diesen drei Plugins, ein `bun lint` Script und CI-Integration. Pre-commit-Hook über `lint-staged` empfohlen.

#### 6. Dependency Modernization
- **Newest-First:** Bei jeder neuen Lib-Adoption oder Migration zur **aktuell vom Format-/Spec-Owner empfohlenen** Variante greifen — nicht zur populärsten Google-Hit-Lib, sondern zur **aktiv gepflegten** Version (z. B. `motion` statt `framer-motion`, `@lottiefiles/dotlottie-react` statt `lottie-react`/`lottie-web`).
- **Replace, don't patch:** Stagnierende Libs mit Eval-Use, CSP-Inkompatibilität oder Single-Maintainer-Risk werden ersetzt, nicht umschifft.
- **Dead-Code-Audit:** Bei jedem Touch eines Workspaces `package.json` gegen `grep`-Imports prüfen — ungenutzte Deps konsequent entfernen (führt regelmäßig zu Funden wie `framer-motion` ohne Imports oder Wrapper-Files ohne Consumer).
- **Docs-Cache:** Vor einer Migration die offizielle Doku der Ziel-Lib in `__AI-Workflow__/Skills/UpToDateDocs/<lib>.md` ablegen (mit `verified`-Datum + Source-URL). Beim späteren Coden gegen diesen Cache arbeiten — nicht gegen veraltete Trainings-Daten.
- **Stack-Consolidation:** Wenn ein Workspace bereits eine Headless-Lib (z. B. Ark UI) hat, neue Anforderungen dort lösen statt eine zweite Lib (Radix, Headless UI, …) parallel zu installieren.
