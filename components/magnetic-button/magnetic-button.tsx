import { useRef, useState, useCallback, useEffect } from 'react';

const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

export type MagneticButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'shimmer'
  | 'glow'
  | 'gradient'
  | 'cta'; // cta = alias für shimmer (backward compat)

// ─── Keyframe injection ──────────────────────────────────────────────────────────

const STYLE_ID = '__magnetic-btn-styles__';

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes mb-shimmer {
      0%   { transform: translateX(-120%) skewX(-20deg); }
      100% { transform: translateX(320%)  skewX(-20deg); }
    }
    @keyframes mb-glow-pulse {
      0%, 100% { box-shadow: 0 0  8px  3px color-mix(in oklch, var(--accent) 45%, transparent),
                             0 2px 12px    color-mix(in oklch, var(--accent) 30%, transparent); }
      50%       { box-shadow: 0 0 22px  8px color-mix(in oklch, var(--accent) 70%, transparent),
                             0 4px 30px    color-mix(in oklch, var(--accent) 40%, transparent); }
    }
    @keyframes mb-gradient {
      0%   { background-position: 0%   center; }
      100% { background-position: 200% center; }
    }
  `;
  document.head.appendChild(style);
}

// ─── Tailwind: nur Spacing + Layout, keine Farben ────────────────────────────────
// Alle Farb-/Border-Stile kommen aus getVariantStyle → inline styles.

const BASE    = 'px-5 py-2.5 rounded-lg text-sm font-semibold';
const BASE_LG = 'px-6 py-3   rounded-xl text-sm font-semibold';

const variantClasses: Record<MagneticButtonVariant, string> = {
  default:     `${BASE}`,
  primary:     `${BASE}`,
  secondary:   `${BASE}`,
  outline:     `${BASE}`,
  ghost:       'px-4 py-2 rounded-lg text-sm font-medium',
  destructive: `${BASE}`,
  shimmer:     `${BASE_LG} overflow-hidden`,
  cta:         `${BASE_LG} overflow-hidden`,
  glow:        `${BASE_LG}`,
  gradient:    `${BASE_LG} overflow-hidden`,
};

// ─── Alle visuellen Stile als inline styles ───────────────────────────────────────

function getVariantStyle(
  variant: MagneticButtonVariant,
  hovered: boolean
): React.CSSProperties {
  switch (variant) {
    case 'default':
      return {
        backgroundColor: hovered
          ? 'color-mix(in oklch, var(--border) 60%, var(--card))'
          : 'var(--card)',
        borderWidth:  '1px',
        borderStyle:  'solid',
        borderColor:  'var(--border)',
        color:        'var(--text)',
      };

    case 'primary':
      return {
        backgroundColor: 'var(--accent)',
        color: 'white',
        boxShadow: hovered
          ? '0 4px 20px color-mix(in oklch, var(--accent) 55%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)'
          : '0 2px 10px color-mix(in oklch, var(--accent) 30%, transparent), inset 0 1px 0 rgba(255,255,255,0.12)',
      };

    case 'secondary':
      return {
        backgroundColor: hovered
          ? 'color-mix(in oklch, var(--accent) 20%, transparent)'
          : 'color-mix(in oklch, var(--accent) 10%, transparent)',
        borderWidth:  '1px',
        borderStyle:  'solid',
        borderColor:  hovered
          ? 'color-mix(in oklch, var(--accent) 60%, transparent)'
          : 'color-mix(in oklch, var(--accent) 35%, transparent)',
        color: 'var(--accent)',
      };

    case 'outline':
      return {
        backgroundColor: hovered ? 'var(--accent)' : 'transparent',
        borderWidth:  '2px',
        borderStyle:  'solid',
        borderColor:  'var(--accent)',
        color:        hovered ? 'white' : 'var(--accent)',
        boxShadow:    hovered
          ? '0 0 0 3px color-mix(in oklch, var(--accent) 20%, transparent)'
          : 'none',
      };

    case 'ghost':
      return {
        backgroundColor: hovered
          ? 'color-mix(in oklch, var(--accent) 8%, transparent)'
          : 'transparent',
        color: hovered ? 'var(--text)' : 'var(--text-muted)',
      };

    case 'destructive':
      return {
        backgroundColor: '#e11d48',
        color: 'white',
        boxShadow: hovered
          ? '0 4px 18px rgba(225, 29, 72, 0.55), inset 0 1px 0 rgba(255,255,255,0.15)'
          : '0 2px 10px rgba(225, 29, 72, 0.28), inset 0 1px 0 rgba(255,255,255,0.1)',
      };

    case 'shimmer':
    case 'cta':
      return {
        backgroundColor: 'var(--accent)',
        color: 'white',
        boxShadow: '0 4px 18px color-mix(in oklch, var(--accent) 45%, transparent)',
      };

    case 'glow':
      return {
        backgroundColor: 'var(--accent)',
        color: 'white',
        animation: 'mb-glow-pulse 2.2s ease-in-out infinite',
      };

    case 'gradient':
      return {
        backgroundImage: 'linear-gradient(90deg, var(--accent), color-mix(in oklch, var(--accent) 55%, white) 50%, var(--accent))',
        backgroundSize: '200% auto',
        color: 'white',
        animation: 'mb-gradient 2.8s linear infinite',
        boxShadow: '0 4px 18px color-mix(in oklch, var(--accent) 40%, transparent)',
      };

    default:
      return {};
  }
}

// ─── Component ───────────────────────────────────────────────────────────────────

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number;
  variant?: MagneticButtonVariant;
}

export function MagneticButton({
  className,
  strength = 0.3,
  variant = 'default',
  onMouseMove,
  onMouseLeave,
  style,
  children,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const injected = useRef(false);

  useEffect(() => {
    if (!injected.current) {
      injectStyles();
      injected.current = true;
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({
      x: (e.clientX - (rect.left + rect.width  / 2)) * strength,
      y: (e.clientY - (rect.top  + rect.height / 2)) * strength,
    });
    onMouseMove?.(e);
  }, [strength, onMouseMove]);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setPosition({ x: 0, y: 0 });
    setHovered(false);
    onMouseLeave?.(e);
  }, [onMouseLeave]);

  const isShimmer = variant === 'shimmer' || variant === 'cta';

  return (
    <button
      ref={buttonRef}
      className={cn(
        'relative before:absolute before:-inset-3 before:-z-10',
        'motion-safe:transition-[transform,box-shadow,background-color,border-color,color]',
        'motion-safe:duration-200 motion-safe:ease-out',
        'motion-reduce:transition-none',
        variantClasses[variant],
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
      style={{
        ...getVariantStyle(variant, hovered),
        ...style,
        transform: `translate(${position.x}px, ${position.y}px)`,
        willChange: 'transform',
      }}
      {...props}
    >
      {/* Shimmer Lichtstreifen */}
      {isShimmer && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: '-10%',
            left: 0,
            width: '35%',
            height: '120%',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.28), transparent)',
            animation: 'mb-shimmer 2.2s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Content über Overlays */}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
}
