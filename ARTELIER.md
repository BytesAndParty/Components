# Artelier Workflow Guidelines

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
