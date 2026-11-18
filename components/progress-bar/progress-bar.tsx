import type { CSSProperties } from 'react';
import { useComponentMessages } from '../i18n';
import { cn } from '../lib/utils';
import { MESSAGES, type ProgressBarMessages } from './messages';

export interface ProgressBarProps {
  /** Current value, clamped to 0…max. */
  value: number;
  /** Upper bound of the range. */
  max?: number;
  /** Accessible name. Defaults to the translated "Progress". */
  'aria-label'?: string;
  /** ID of a visible label; takes precedence over `aria-label`. */
  'aria-labelledby'?: string;
  /** i18n override for the default accessible name. */
  messages?: Partial<ProgressBarMessages>;
  /** Classes on the track (outer element). */
  className?: string;
  /** Classes on the fill. */
  fillClassName?: string;
  style?: CSSProperties;
}

export function ProgressBar({
  value,
  max = 100,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  messages,
  className,
  fillClassName,
  style,
}: ProgressBarProps) {
  const m = useComponentMessages(MESSAGES, messages);
  const clamped = Math.min(max, Math.max(0, value));
  const percent = max > 0 ? (clamped / max) * 100 : 0;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      aria-label={ariaLabelledby ? undefined : (ariaLabel ?? m.label)}
      aria-labelledby={ariaLabelledby}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}
      style={style}
    >
      {/* Width (not scaleX) so rounded ends and gradients keep their shape at any value. */}
      <div
        className={cn(
          'h-full rounded-full bg-accent transition-[width] duration-500 ease-out motion-reduce:transition-none',
          fillClassName,
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
