import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

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
  className?: string;
  style?: CSSProperties;
}

const GOO_MATRIX = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10';

export function GooeyInput({
  placeholder = 'Search…',
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
  className,
  style,
}: GooeyInputProps) {
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
    <svg width={height * 0.4} height={height * 0.4} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        width,
        height,
        ...style,
      }}
    >
      {/* Hidden goo filter defs */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
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
        style={{
          position: 'absolute',
          inset: 0,
          filter: `url(#gooey-${filterId})`,
        }}
      >
        {/* Pill background */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            height,
            width: open ? width : height,
            background: isOutline ? 'var(--card)' : color,
            boxShadow: isOutline ? `inset 0 0 0 2.5px ${color}` : 'none',
            borderRadius: height,
            transition: `width ${duration}ms cubic-bezier(0.77, 0, 0.18, 1)`,
          }}
        />
        {/* Trigger circle (same color, fused) */}
        <button
          type="button"
          aria-label={open ? 'Suche schließen' : 'Suche öffnen'}
          onClick={() => setOpen((v) => !v)}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: height,
            height,
            borderRadius: '50%',
            border: 'none',
            background: isOutline ? 'var(--card)' : color,
            boxShadow: isOutline ? `inset 0 0 0 2.5px ${color}` : 'none',
            color: isOutline ? color : iconColor,
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
            padding: 0,
            transform: open ? 'scale(1.08)' : 'scale(1)',
            transition: `transform ${duration * 0.45}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
            fontFamily: 'inherit',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: `transform ${duration * 0.5}ms cubic-bezier(0.68, -0.55, 0.27, 1.55)`,
            }}
          >
            {icon ?? defaultIcon}
          </span>
        </button>
      </div>

      {/* Input (outside goo layer so text is crisp) */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => updateValue(e.target.value)}
        onKeyDown={handleKey}
        tabIndex={open ? 0 : -1}
        aria-hidden={!open}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height,
          width: open ? width - height : 0,
          padding: open ? `0 ${height * 0.4}px 0 ${height * 0.5}px` : 0,
          border: 'none',
          outline: 'none',
          borderRadius: height,
          background: 'transparent',
          color: isOutline ? 'var(--foreground)' : '#fff',
          caretColor: isOutline ? color : '#fff',
          fontSize: 14,
          fontFamily: 'inherit',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: `opacity ${duration * 0.5}ms ease ${duration * 0.4}ms, width ${duration}ms cubic-bezier(0.77, 0, 0.18, 1)`,
        }}
      />
    </div>
  );
}
