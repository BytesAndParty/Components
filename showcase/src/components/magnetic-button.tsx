import { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '../lib/utils';

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
  | 'beam'
  | 'cta';

// ─── Tailwind Classes ────────────────────────────────────────────────────────────

const BASE    = 'px-5 py-2.5 rounded-lg text-sm font-semibold';
const BASE_LG = 'px-6 py-3   rounded-xl text-sm font-semibold';

const variantClasses: Record<MagneticButtonVariant, string> = {
  default:     `${BASE} border border-border bg-card text-foreground hover:bg-[color-mix(in_oklch,var(--border)_60%,var(--card))]`,
  primary:     `${BASE} bg-accent text-white shadow-[0_2px_10px_color-mix(in_oklch,var(--accent)_30%,transparent),inset_0_1px_0_rgba(255,255,255,0.12)] hover:shadow-[0_4px_20px_color-mix(in_oklch,var(--accent)_55%,transparent),inset_0_1px_0_rgba(255,255,255,0.2)]`,
  secondary:   `${BASE} bg-[color-mix(in_oklch,var(--accent)_10%,transparent)] hover:bg-[color-mix(in_oklch,var(--accent)_20%,transparent)] border border-[color-mix(in_oklch,var(--accent)_35%,transparent)] hover:border-[color-mix(in_oklch,var(--accent)_60%,transparent)] text-accent`,
  outline:     `${BASE} bg-transparent hover:bg-accent border-2 border-accent text-accent hover:text-white hover:shadow-[0_0_0_3px_color-mix(in_oklch,var(--accent)_20%,transparent)]`,
  ghost:       'px-4 py-2 rounded-lg text-sm font-medium bg-transparent hover:bg-[color-mix(in_oklch,var(--accent)_8%,transparent)] text-muted-foreground hover:text-foreground',
  destructive: `${BASE} bg-[#e11d48] text-white shadow-[0_2px_10px_rgba(225,29,72,0.28),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_4px_18px_rgba(225,29,72,0.55),inset_0_1px_0_rgba(255,255,255,0.15)]`,
  shimmer:     `${BASE_LG} overflow-hidden bg-accent text-white shadow-[0_4px_18px_color-mix(in_oklch,var(--accent)_45%,transparent)]`,
  cta:         `${BASE_LG} overflow-hidden bg-accent text-white shadow-[0_4px_18px_color-mix(in_oklch,var(--accent)_45%,transparent)]`,
  glow:        `${BASE_LG} bg-accent text-white animate-[mb-glow-pulse_2.2s_ease-in-out_infinite]`,
  gradient:    `${BASE_LG} overflow-hidden bg-[linear-gradient(90deg,var(--accent),color-mix(in_oklch,var(--accent)_55%,white)_50%,var(--accent))] bg-[length:200%_auto] text-white animate-[mb-gradient_2.8s_linear_infinite] shadow-[0_4px_18px_color-mix(in_oklch,var(--accent)_40%,transparent)]`,
  beam:        `${BASE_LG} overflow-hidden bg-card text-foreground`,
};

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
    onMouseLeave?.(e);
  }, [onMouseLeave]);

  const isShimmer = variant === 'shimmer' || variant === 'cta';
  const isBeam = variant === 'beam';

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
      style={{
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
          className="absolute top-[-10%] left-0 w-[35%] h-[120%] bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.28),transparent)] animate-[mb-shimmer_2.2s_ease-in-out_infinite] pointer-events-none"
        />
      )}

      {/* Border-Beam: rotierendes conic-gradient + Innen-Maske */}
      {isBeam && (
        <>
          {/* Rotierendes Beam-Div: größer als Button, dreht sich im Zentrum */}
          <span
            aria-hidden
            className="absolute w-[300%] h-[300%] top-[-100%] left-[-100%] bg-[conic-gradient(from_0deg,transparent_330deg,color-mix(in_oklch,var(--accent)_90%,white)_350deg,var(--accent)_360deg)] animate-[mb-beam_2.5s_linear_infinite] pointer-events-none"
          />
          {/* Maske: deckt Innenbereich ab → nur Rand leuchtet */}
          <span
            aria-hidden
            className="absolute inset-[1.5px] bg-card rounded-[inherit] pointer-events-none"
          />
        </>
      )}

      {/* Content über Overlays */}
      <span className="relative z-[1]">{children}</span>
    </button>
  );
}
