import { useEffect, type RefObject } from 'react';

/**
 * Escape schließt ein offenes Disclosure (Mobile-Menü, Popover) und gibt den
 * Fokus an den Trigger zurück — WAI-ARIA APG, Disclosure Pattern.
 *
 * Die Fokus-Rückgabe ist der Teil, der gern vergessen wird: beim Schließen
 * verschwindet das gerade fokussierte Element aus dem DOM, der Fokus fällt auf
 * <body> und die nächste Tab-Taste beginnt wieder ganz oben auf der Seite.
 *
 * `setOpen` muss der Setter aus `useState` sein (stabil über Renders hinweg),
 * damit der Listener nicht bei jedem Render neu registriert wird.
 */
export function useDisclosureDismiss(
  open: boolean,
  setOpen: (open: boolean) => void,
  triggerRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen, triggerRef]);
}
