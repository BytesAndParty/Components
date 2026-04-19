import { useEffect, useId, useRef, useState } from 'react';

type Size = 'sm' | 'md' | 'lg';

const sizes: Record<Size, { trackH: number; thumb: number; thumbActive: number }> = {
  sm: { trackH: 4, thumb: 14, thumbActive: 18 },
  md: { trackH: 6, thumb: 18, thumbActive: 22 },
  lg: { trackH: 8, thumb: 22, thumbActive: 28 },
};

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  formatValue?: (value: number) => string;
  showValue?: boolean;
  disabled?: boolean;
  size?: Size;
  className?: string;
  style?: React.CSSProperties;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
function snap(v: number, step: number, min: number) {
  return Math.round((v - min) / step) * step + min;
}

export function Slider({
  value: controlled,
  defaultValue = 0,
  onChange,
  onChangeEnd,
  min = 0,
  max = 100,
  step = 1,
  label,
  formatValue,
  showValue = true,
  disabled = false,
  size = 'md',
  className,
  style,
}: SliderProps) {
  const [internal, setInternal] = useState(() => clamp(defaultValue, min, max));
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const isControlled = controlled !== undefined;
  const value = clamp(isControlled ? (controlled as number) : internal, min, max);
  const pct = ((value - min) / (max - min)) * 100;

  const update = (next: number) => {
    const v = clamp(snap(next, step, min), min, max);
    if (v === value) return;
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };

  const valueFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return value;
    const rect = el.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return min + ratio * (max - min);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => update(valueFromClientX(e.clientX));
    const onUp = () => {
      setDragging(false);
      onChangeEnd?.(value);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    // Recommended only run the subscribe/unsubscribe cycle on dragging flips;
    // value updates are pulled live inside onMove via valueFromClientX.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const big = Math.max(step, (max - min) / 10);
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        update(value + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        update(value - step);
        break;
      case 'PageUp':
        e.preventDefault();
        update(value + big);
        break;
      case 'PageDown':
        e.preventDefault();
        update(value - big);
        break;
      case 'Home':
        e.preventDefault();
        update(min);
        break;
      case 'End':
        e.preventDefault();
        update(max);
        break;
    }
  };

  const s = sizes[size];
  const thumbW = dragging ? s.thumbActive : s.thumb;
  const displayValue = formatValue ? formatValue(value) : String(value);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
          {label && (
            <label htmlFor={id} style={{ fontSize: '0.8125rem', color: 'var(--foreground)', fontWeight: 500 }}>
              {label}
            </label>
          )}
          {showValue && (
            <span
              style={{
                fontSize: '0.8125rem',
                color: 'var(--muted-foreground)',
                fontVariantNumeric: 'tabular-nums',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
            >
              {displayValue}
            </span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        onPointerDown={(e) => {
          if (disabled) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          update(valueFromClientX(e.clientX));
        }}
        style={{
          position: 'relative',
          height: Math.max(s.thumbActive, s.trackH) + 4,
          display: 'flex',
          alignItems: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          touchAction: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {/* Track (off portion) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: s.trackH,
            borderRadius: s.trackH,
            background: 'var(--muted)',
            border: '1px solid var(--border)',
          }}
        />
        {/* Filled portion */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: `${pct}%`,
            height: s.trackH,
            borderRadius: s.trackH,
            background: 'var(--accent)',
            transition: dragging ? 'none' : 'width 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        {/* Thumb */}
        <div
          id={id}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayValue}
          aria-label={label}
          aria-disabled={disabled || undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKey}
          style={{
            position: 'absolute',
            left: `calc(${pct}% - ${thumbW / 2}px)`,
            width: thumbW,
            height: s.thumb,
            borderRadius: s.thumb / 2,
            background: '#fff',
            boxShadow:
              focused || dragging
                ? `0 0 0 4px color-mix(in oklch, var(--accent) 25%, transparent), 0 1px 3px rgba(0,0,0,0.3)`
                : '0 1px 3px rgba(0,0,0,0.25)',
            transition: dragging
              ? 'width 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s linear'
              : 'left 0.15s cubic-bezier(0.4, 0, 0.2, 1), width 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s linear',
            outline: 'none',
          }}
        />
      </div>
    </div>
  );
}
