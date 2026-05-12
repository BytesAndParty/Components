import { useState, useCallback, useId } from 'react';

interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name when no visible `label` is supplied. */
  'aria-label'?: string;
  /** ID of element labelling the checkbox (overrides `label`/`aria-label`). */
  'aria-labelledby'?: string;
  /** ID of element describing the checkbox (errors, help text). */
  'aria-describedby'?: string;
  className?: string;
}

const sizes = {
  sm: { box: 16, stroke: 1.5, label: '0.8125rem' },
  md: { box: 20, stroke: 2, label: '0.875rem' },
  lg: { box: 24, stroke: 2.5, label: '1rem' },
};

export function Checkbox({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  className,
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [pressed, setPressed] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const id = useId();

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const toggle = useCallback(() => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  }, [checked, disabled, isControlled, onChange]);

  const s = sizes[size];

  return (
    <label
      htmlFor={id}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={toggle}
        disabled={disabled}
        aria-label={!label && !ariaLabelledby ? ariaLabel : undefined}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        onFocus={(e) => setFocusVisible(e.target.matches(':focus-visible'))}
        onBlur={() => setFocusVisible(false)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />

      <span
        aria-hidden
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        style={{
          position: 'relative',
          width: s.box,
          height: s.box,
          flexShrink: 0,
          borderRadius: s.box * 0.25,
          transform: pressed ? 'scale(0.92)' : 'scale(1)',
          transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s linear',
          boxShadow: focusVisible
            ? '0 0 0 2px var(--background, #fff), 0 0 0 4px var(--accent)'
            : 'none',
        }}
      >
        {/* Border */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            border: `2px solid ${checked ? 'var(--accent)' : 'var(--muted-foreground)'}`,
            transition: 'border-color 0.2s linear',
            pointerEvents: 'none',
          }}
        />

        {/* Fill background - scales from center */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: 'var(--accent)',
            transform: checked ? 'scale(1)' : 'scale(0.5)',
            opacity: checked ? 1 : 0,
            transformOrigin: 'center',
            transition: 'transform 0.2s linear, opacity 0.2s linear',
            pointerEvents: 'none',
          }}
        />

        {/* Checkmark SVG with stroke draw */}
        <svg
          viewBox="0 0 17 18"
          fill="none"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            padding: '15%',
            pointerEvents: 'none',
          }}
        >
          <polyline
            points="1 9 7 14 15 4"
            stroke="#fff"
            strokeWidth={s.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 22,
              strokeDashoffset: checked ? 44 : 66,
              transition: 'stroke-dashoffset 0.25s linear 0.2s',
            }}
          />
        </svg>
      </span>

      {label && (
        <span style={{ fontSize: s.label, color: 'var(--foreground)' }}>{label}</span>
      )}
    </label>
  );
}
