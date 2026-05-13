import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '../lib/utils';
import { useComponentMessages } from '../i18n';
import { MESSAGES, type GooeyInputMessages } from './messages';

export interface GooeyInputProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  /** Expanded width in px */
  width?: number;
  /** Height in px — also drives the collapsed circle size */
  height?: number;
  /** Morph duration in ms (default 1200 = "slower") */
  duration?: number;
  /** Icon shown when collapsed */
  icon?: ReactNode;
  /** Color (default var(--accent)) */
  color?: string;
  /** Ink color for the icon (default #fff) */
  iconColor?: string;
  /** 'filled' = solid background (default), 'outline' = transparent with colored border */
  variant?: 'filled' | 'outline';
  /** i18n overrides for placeholder + open/close labels. */
  messages?: Partial<GooeyInputMessages>;
  className?: string;
  style?: CSSProperties;
}

const GOO_MATRIX = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10';

export function GooeyInput({
  placeholder: _placeholder,
  value: controlled,
  defaultValue = '',
  onChange,
  onSubmit,
  width = 320,
  height = 48,
  duration = 1200,
  icon,
  color = 'var(--accent)',
  iconColor = '#fff',
  variant = 'filled',
  messages,
  className,
  style,
}: GooeyInputProps) {
  const m = useComponentMessages(MESSAGES, messages);
  const placeholder = _placeholder ?? m.placeholder;
  const isOutline = variant === 'outline';
  const filterId = useId().replace(/:/g, '-');
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const value = controlled ?? internal;

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), duration * 0.55);
      return () => window.clearTimeout(t);
    }
  }, [open, duration]);

  function updateValue(v: string) {
    if (controlled === undefined) setInternal(v);
    onChange?.(v);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      onSubmit?.(value);
    }
    if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  const defaultIcon = (
    <svg width={height * 0.4} height={height * 0.4} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{
        width,
        height,
        ...style,
      }}
    >
      {/* Hidden goo filter defs */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id={`gooey-${filterId}`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values={GOO_MATRIX} result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Goo-filtered layer: pill + button share the filter so they fuse */}
      <div
        className="absolute inset-0"
        style={{
          filter: `url(#gooey-${filterId})`,
        }}
      >
        {/* Pill background */}
        <div
          className="absolute right-0 top-0 transition-[width] cubic-bezier(0.77, 0, 0.18, 1)"
          style={{
            height,
            width: open ? width : height,
            background: isOutline ? 'var(--card)' : color,
            boxShadow: isOutline ? `inset 0 0 0 2.5px ${color}` : 'none',
            borderRadius: height,
            transitionDuration: `${duration}ms`,
          }}
        />
        {/* Trigger circle (same color, fused) */}
        <button
          type="button"
          aria-label={open ? m.closeLabel : m.openLabel}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "absolute right-0 top-0 rounded-full border-none cursor-pointer p-0 grid place-items-center transition-transform",
            isOutline ? "bg-[var(--card)]" : "bg-[var(--accent)]"
          )}
          style={{
            width: height,
            height,
            background: isOutline ? 'var(--card)' : color,
            boxShadow: isOutline ? `inset 0 0 0 2.5px ${color}` : 'none',
            color: isOutline ? color : iconColor,
            transform: open ? 'scale(1.08)' : 'scale(1)',
            transitionDuration: `${duration * 0.45}ms`,
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <span
            className="inline-flex transition-transform"
            style={{
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              transitionDuration: `${duration * 0.5}ms`,
              transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
            }}
          >
            {icon ?? defaultIcon}
          </span>
        </button>
      </div>

      {/* Input (outside goo layer so text is crisp) */}
      <input
        ref={inputRef}
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={m.placeholder}
        onChange={(e) => updateValue(e.target.value)}
        onKeyDown={handleKey}
        tabIndex={open ? 0 : -1}
        aria-hidden={!open}
        className={cn(
          "absolute left-0 top-0 border-none outline-none bg-transparent text-sm transition-[opacity,width]",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{
          height,
          width: open ? width - height : 0,
          padding: open ? `0 ${height * 0.4}px 0 ${height * 0.5}px` : 0,
          borderRadius: height,
          color: isOutline ? 'var(--foreground)' : '#fff',
          caretColor: isOutline ? color : '#fff',
          transitionDuration: `${duration}ms`,
          transitionDelay: open ? `${duration * 0.4}ms` : '0ms',
          transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.18, 1)',
        }}
      />
    </div>
  );
}
