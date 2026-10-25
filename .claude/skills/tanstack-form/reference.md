> Generiert aus der live-docs-collection (skills/live-docs-collection/tanstack-form/tanstack-form.md) am 2026-09-16. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

# TanStack Form (React)

Headless Form-Library, First-Class TypeScript. Framework-agnostischer Core + Adapter für React/Vue/Angular/Solid/Svelte/Lit.

## Quick Reference

```tsx
const form = useForm({
  defaultValues: { email: '' },
  onSubmit: async ({ value }) => { /* ... */ },
})

<form.Field name="email" validators={{ onChange: ({ value }) => !value ? 'Pflichtfeld' : undefined }}>
  {(field) => (
    <input
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
    />
  )}
</form.Field>
```

- **`useForm()`** — Formular-Instanz, `defaultValues` + `onSubmit`.
- **`form.Field`** — pro Feld: `field.state.value`, `field.handleChange()`, `field.handleBlur()`, `field.state.meta` (Errors, `isTouched`, `isValidating`).
- **Validierung pro Feld**: `validators.onChange` (sync) / `validators.onChangeAsync` (+ `onChangeAsyncDebounceMs`).
- **`form.Subscribe`** — Selector-Pattern für reaktiven Zugriff auf Form-State (`canSubmit`, `isSubmitting`, …), ohne die ganze Form neu zu rendern.
- Unterstützt Standard-Schema-Validatoren (Zod/Valibot) statt eigener Validierungs-DSL.

## Gotchas

- Render-Props/Slots statt HOCs — API-Stil bewusst anders als `react-hook-form`/Formik, kein 1:1-Ersatz-Mindset beim Portieren.
- `form.Subscribe` gezielt einsetzen, um Re-Renders auf den tatsächlich benötigten State-Ausschnitt zu begrenzen — sonst rendert bei jeder Eingabe die ganze Form.
