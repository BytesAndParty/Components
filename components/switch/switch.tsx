import { useState, useCallback, useId } from 'react';

interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const config = {
  sm: { track: { w: 40, h: 22 }, thumb: 16, thumbActive: 20, travel: 16, radius: 11 },
  md: { track: { w: 48, h: 26 }, thumb: 20, thumbActive: 24, travel: 20, radius: 13 },
  lg: { track: { w: 56, h: 30 }, thumb: 24, thumbActive: 28, travel: 24, radius: 15 },
};

export function Switch({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className,
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [pressed, setPressed] = useState(false);
  const id = useId();

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const toggle = useCallback(() => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  }, [checked, disabled, isControlled, onChange]);

  const c = config[size];
  const thumbW = pressed ? c.thumbActive : c.thumb;
  const padding = (c.track.h - c.thumb) / 2;

  // When checked, thumb's left = travel + padding. When pressed+checked, shift back to compensate width growth.
  const thumbLeft = checked
    ? pressed
      ? c.travel + padding - (c.thumbActive - c.thumb)
      : c.travel + padding
    : padding;

  return (
    <label
      htmlFor={id}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.625rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={toggle}
        disabled={disabled}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />

      <span
        onPointerDown={() => !disabled && setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        style={{
          position: 'relative',
          width: c.track.w,
          height: c.track.h,
          borderRadius: c.radius,
          background: checked ? 'var(--accent)' : 'var(--muted-foreground)',
          transition: 'background 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          flexShrink: 0,
        }}
      >
        {/* Thumb */}
        <span
          style={{
            position: 'absolute',
            top: padding,
            left: thumbLeft,
            width: thumbW,
            height: c.thumb,
            borderRadius: c.thumb / 2,
            background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            transformOrigin: checked ? 'right center' : 'left center',
          }}
        />
      </span>

      {label && (
        <span style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>{label}</span>
      )}
    </label>
  );
}
