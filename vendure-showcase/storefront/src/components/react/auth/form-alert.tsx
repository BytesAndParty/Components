import type { ReactNode } from 'react';

/** Inline-Statusmeldung für Formulare (Erfolg/Fehler), `role="alert"` für Screenreader. */
export function FormAlert({ kind, children }: { kind: 'error' | 'success'; children: ReactNode }) {
  const tone =
    kind === 'error'
      ? 'bg-destructive/10 text-destructive border-destructive/20'
      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  return (
    <div className={`border text-sm rounded-lg p-4 font-medium ${tone}`} role="alert">
      {children}
    </div>
  );
}
