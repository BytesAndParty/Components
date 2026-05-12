import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import { useComponentMessages, useI18n } from '../i18n';
import { MESSAGES, type SliderMessages } from './messages';

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
  messages?: Partial<SliderMessages>;
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
  messages,
}: SliderProps) {
  const [internal, setInternal] = useState(() => clamp(defaultValue, min, max));
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);
  const [elasticOffset, setElasticOffset] = useState(0);
  const [magnetOffset, setMagnetOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const { locale } = useI18n();
  const m = useComponentMessages(MESSAGES, messages);

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
    const onMove = (e: PointerEvent) => {
      update(valueFromClientX(e.clientX));
      // Elastic physics: logarithmic resistance past bounds
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      if (ratio < 0) {
        setElasticOffset(-Math.log1p(-ratio * 8) * 12);
      } else if (ratio > 1) {
        setElasticOffset(Math.log1p((ratio - 1) * 8) * 12);
      } else {
        setElasticOffset(0);
      }
    };
    const onUp = () => {
      setDragging(false);
      setElasticOffset(0); // spring transition on thumb handles snap-back
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) return;
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cursorX = e.clientX - rect.left;
    const thumbX = (pct / 100) * rect.width;
    const dist = cursorX - thumbX;
    const absD = Math.abs(dist);
    const MAGNET_RANGE = 44;
    if (absD < MAGNET_RANGE) {
      // Quadratic falloff: strongest pull close to thumb, fades at range edge
      const pull = (dist / MAGNET_RANGE) * 5 * Math.pow(1 - absD / MAGNET_RANGE, 1.5);
      setMagnetOffset(pull);
    } else {
      setMagnetOffset(0);
    }
  };

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
  const displayValue = formatValue 
    ? formatValue(value) 
    : new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);

  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      style={{ opacity: disabled ? 0.5 : 1, ...style }}
    >
      {(label || showValue) && (
        <div className="flex justify-between items-baseline gap-4">
          {label && (
            <label htmlFor={id} className="text-[13px] text-[var(--foreground)] font-medium">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-[13px] text-[var(--muted-foreground)] font-mono tabular-nums">
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
          setMagnetOffset(0);
          update(valueFromClientX(e.clientX));
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMagnetOffset(0)}
        className={cn(
          "relative flex items-center touch-none select-none",
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        )}
        style={{
          height: Math.max(s.thumbActive, s.trackH) + 4,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {/* Track (off portion) */}
        <div
          className="absolute left-0 right-0 border border-[var(--border)] bg-[var(--muted)]"
          style={{
            height: s.trackH,
            borderRadius: s.trackH,
          }}
        />
        {/* Filled portion */}
        <div
          className="absolute left-0 bg-[var(--accent)]"
          style={{
            width: `${pct}%`,
            height: s.trackH,
            borderRadius: s.trackH,
            boxShadow: dragging
              ? '0 0 10px 2px color-mix(in oklch, var(--accent) 35%, transparent)'
              : 'none',
            transition: dragging
              ? 'none'
              : 'width 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
          }}
        />
        {/* Floating value tooltip */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute bottom-[calc(100%+8px)] bg-[var(--foreground)] text-[var(--background)] text-[11px] font-mono font-bold px-[7px] py-[2px] rounded-[6px] whitespace-nowrap pointer-events-none z-10 transition-opacity duration-150",
            dragging ? "opacity-100" : "opacity-0"
          )}
          style={{
            left: `${pct}%`,
            transform: `translateX(calc(-50% + ${elasticOffset}px))`,
          }}
        >
          {displayValue}
        </div>
        {/* Thumb */}
        <div
          id={id}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayValue}
          aria-label={label || m.ariaLabel}
          aria-disabled={disabled || undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKey}
          className="absolute bg-white outline-none"
          style={{
            left: `calc(${pct}% - ${thumbW / 2}px)`,
            width: thumbW,
            height: s.thumb,
            borderRadius: s.thumb / 2,
            boxShadow:
              focused || dragging
                ? `0 0 0 4px color-mix(in oklch, var(--accent) 25%, transparent), 0 1px 3px rgba(0,0,0,0.3)`
                : '0 1px 3px rgba(0,0,0,0.25)',
            transform: `translateX(${elasticOffset + magnetOffset}px)`,
            transition: dragging
              ? 'width 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s linear, transform 0.06s linear'
              : 'left 0.15s cubic-bezier(0.4, 0, 0.2, 1), width 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s linear, transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        />
      </div>
    </div>
  );
}
