import { useId, type ReactNode } from 'react';
import { Info } from 'lucide-react';
import { Tooltip } from '../tooltip/tooltip';
import { cn } from '../lib/utils';
import { useComponentMessages } from '../i18n';
import { MESSAGES, type FieldHintMessages } from './messages';

export interface FieldHintProps {
  /** Hint content. Rendered inside the tooltip and as visually-hidden text for screen readers. */
  content: ReactNode;
  /** Stable id for the visually-hidden description — wire this into the field's `aria-describedby`. */
  id?: string;
  /** Tooltip position. */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Icon size in px. */
  size?: number;
  /** Tooltip open delay in seconds. */
  delay?: number;
  className?: string;
  messages?: Partial<FieldHintMessages>;
}

/**
 * FieldHint — small info-icon affordance for form labels and similar contexts.
 * Wraps the existing Tooltip and exposes a stable id so the related field
 * can reference the hint via `aria-describedby`.
 */
export function FieldHint({
  content,
  id,
  position = 'top',
  size = 14,
  delay = 0.15,
  className,
  messages,
}: FieldHintProps) {
  const reactId = useId();
  const hintId = id ?? `field-hint-${reactId}`;
  const m = useComponentMessages(MESSAGES, messages);

  return (
    <>
      <span id={hintId} className="sr-only">
        {content}
      </span>
      <Tooltip
        content={content}
        position={position}
        delay={delay}
        className="!whitespace-normal max-w-xs text-[12px] leading-relaxed"
      >
        <button
          type="button"
          aria-label={m.triggerLabel}
          aria-describedby={hintId}
          className={cn(
            'inline-flex items-center justify-center rounded-full',
            'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
            'transition-colors duration-150 cursor-help',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
            'focus-visible:ring-[var(--accent)] focus-visible:ring-offset-[var(--background)]',
            className,
          )}
          style={{ width: size + 4, height: size + 4 }}
        >
          <Info width={size} height={size} aria-hidden="true" />
        </button>
      </Tooltip>
    </>
  );
}
