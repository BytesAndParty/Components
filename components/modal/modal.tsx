import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../lib/utils';

// A double click on the opener lands its second click on the freshly opened backdrop.
const BACKDROP_GRACE_MS = 400;

export interface ModalProps {
  /** Controlled visibility. Opens with `showModal()`: top layer, focus trap, inert page, Esc. */
  open: boolean;
  /** The user dismissed the dialog (Esc or a click on the backdrop). Set `open` to false here. */
  onClose: () => void;
  children: ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  /** Classes on the panel (the visible box), merged with the defaults via `cn()`. */
  className?: string;
  /** Inline styles on the panel. */
  style?: CSSProperties;
}

export function Modal({
  open,
  onClose,
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  className,
  style,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // A press that starts inside the panel and ends on the backdrop (text selection) must not close.
  const pressStartedOnBackdrop = useRef(false);
  const openedAt = useRef(0);

  // The DOM follows the prop. Server HTML never carries the `open` attribute, the dialog opens after hydration.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      openedAt.current = performance.now();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    // The panel fills the <dialog>, so a pointer event targeting the <dialog> itself hit the backdrop.
    // Keyboard users dismiss with Esc, handled natively by the dialog.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      className={cn(
        // The <dialog> is the scroll container that contains scroll chaining (overscroll-behavior needs one), so
        // it clips: radius and shadow sit here, not on the panel, otherwise the clip would cut the shadow off.
        'm-auto max-h-none max-w-none overflow-hidden overscroll-contain rounded-2xl bg-transparent p-0 shadow-2xl',
        // Entry only: an exit transition would need `overlay`, which only Chromium supports.
        'transition-[opacity,translate] duration-300 ease-out starting:open:translate-y-4 starting:open:opacity-0',
        'backdrop:bg-background/70 backdrop:backdrop-blur-sm backdrop:transition-opacity backdrop:duration-300 starting:open:backdrop:opacity-0',
        // Scrolling over the backdrop must not scroll the page (needs overflow and overscroll-behavior on both).
        'backdrop:overflow-hidden backdrop:overscroll-contain',
        'motion-reduce:transition-none motion-reduce:backdrop:transition-none',
      )}
      // Fires for every close. Report only the ones the parent did not ask for (Esc, backdrop).
      onClose={() => {
        if (open) onClose();
      }}
      onPointerDown={(event) => {
        pressStartedOnBackdrop.current =
          event.target === event.currentTarget && performance.now() - openedAt.current >= BACKDROP_GRACE_MS;
      }}
      onClick={(event) => {
        if (pressStartedOnBackdrop.current && event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div
        className={cn(
          'max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain',
          'rounded-2xl border border-border bg-card p-6 text-foreground',
          className,
        )}
        style={style}
      >
        {children}
      </div>
    </dialog>
  );
}
