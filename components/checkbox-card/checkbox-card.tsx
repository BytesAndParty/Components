import { useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface CheckboxCardProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Form field name of the native input. A checkbox is submitted only while checked. */
  name?: string;
  /** Submitted value while checked. Without it the browser submits "on". */
  value?: string;
  /** Native validation: the form does not submit until the card is checked. */
  required?: boolean;
  /** Id of the native input. */
  id?: string;
  /** Card content. Its text is the checkbox's accessible name, so keep it free of interactive elements. */
  children: ReactNode;
  /** Replaces the default check box, e.g. with a stamp. Decorative: hidden from assistive tech. */
  indicator?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function CheckboxCard({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  name,
  value,
  required,
  id,
  children,
  indicator,
  className,
  style,
}: CheckboxCardProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  function toggle() {
    const next = !checked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  }

  return (
    <label
      data-state={checked ? 'checked' : 'unchecked'}
      data-disabled={disabled || undefined}
      className={cn(
        'relative flex cursor-pointer flex-col gap-3 rounded-xl border-2 border-border bg-card p-4 text-foreground',
        'transition-colors duration-200 motion-reduce:transition-none',
        'not-data-[disabled]:hover:border-accent/60',
        'data-[state=checked]:border-accent data-[state=checked]:bg-accent/10',
        // Outline, not ring: survives forced-colors mode and is not replaced by a consumer's box-shadow.
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
      style={style}
    >
      {/* The native input carries focus, keyboard (Space) and form semantics. */}
      <input
        type="checkbox"
        className="sr-only"
        id={id}
        name={name}
        value={value}
        required={required}
        checked={checked}
        disabled={disabled}
        onChange={toggle}
      />
      <span aria-hidden="true">{indicator ?? <CheckIndicator checked={checked} />}</span>
      {children}
    </label>
  );
}

function CheckIndicator({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        'grid size-5 place-items-center rounded-md border-2 transition-colors duration-200 motion-reduce:transition-none',
        checked ? 'border-accent bg-accent text-accent-foreground' : 'border-muted-foreground',
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        // Hidden while unchecked: the round cap would otherwise leave a dot at the path start.
        className={cn('size-3.5 transition-opacity duration-200 motion-reduce:transition-none', !checked && 'opacity-0')}
      >
        <path
          d="M5 12.5l4.5 4.5L19 7"
          pathLength={1}
          strokeDasharray={1}
          className="transition-[stroke-dashoffset] duration-300 ease-out motion-reduce:transition-none"
          style={{ strokeDashoffset: checked ? 0 : 1 }}
        />
      </svg>
    </span>
  );
}
