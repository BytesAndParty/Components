> Generiert aus der live-docs-collection (skills/live-docs-collection/testing-library/testing-library.md) am 2026-09-16. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# React Testing Library

## Philosophie

„The more your tests resemble the way your software is used, the more confidence they can give you." Getestet wird über echte DOM-Knoten, nicht über React-Interna — keine Implementierungsdetails (State, Props von innen) prüfen.

## Quick Reference

```bash
bun add -D @testing-library/react @testing-library/dom @testing-library/jest-dom jsdom
```

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { MyButton } from './my-button'

test('ruft onClick beim Klick auf', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(<MyButton onClick={onClick}>Los</MyButton>)

  await user.click(screen.getByRole('button', { name: 'Los' }))

  expect(onClick).toHaveBeenCalledOnce()
})
```

**Queries** (Priorität in dieser Reihenfolge, per `screen.getByX`):
`getByRole` > `getByLabelText` > `getByText` > `getByTestId` (nur als Escape-Hatch, wenn A11y-Queries nicht praktikabel sind).

**Interaktion:** `userEvent` (aus `@testing-library/user-event`, simuliert echtes Nutzerverhalten inkl. Fokus/Events-Reihenfolge) bevorzugt vor `fireEvent` (rohe DOM-Events, niedrigere Ebene).

## Gotchas

- Braucht eine DOM-Umgebung im Test-Runner (`environment: 'jsdom'` in `vitest.config.ts`, siehe `vitest/vitest.md`).
- `@testing-library/jest-dom` ergänzt Matcher wie `toBeInTheDocument()`, `toHaveAttribute()` — muss separat importiert werden (üblich: einmal in einem `vitest.setup.ts` via `import '@testing-library/jest-dom'`).
- Framework-agnostisch bzgl. Test-Runner — funktioniert mit Vitest genauso wie mit Jest, keine Runner-Bindung.
