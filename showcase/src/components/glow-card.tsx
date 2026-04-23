import { useRef, useState, useCallback, useMemo } from 'react';
import { cn } from '../lib/utils';

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowRadius?: number;
  glowColor?: string;
  accentColor?: string;
}

/**
 * A card component with a cursor-following glow border effect.
 */
export function GlowCard({
  children,
  className,
  glowRadius = 250,
  glowColor = 'var(--accent)',
  accentColor = 'var(--accent)',
  style,
  ...props
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const glowStyles = useMemo(() => ({
    '--glow-x': `${mousePosition.x}px`,
    '--glow-y': `${mousePosition.y}px`,
    '--glow-opacity': isHovering ? 1 : 0,
    '--glow-size': `${glowRadius}px`,
    '--glow-color': glowColor,
    '--accent-color': accentColor,
  } as React.CSSProperties), [mousePosition.x, mousePosition.y, isHovering, glowRadius, glowColor, accentColor]);

  return (
    <div
      ref={cardRef}
      className={cn("relative rounded-xl border border-border bg-card transition-[border-color] duration-300", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        ...style,
        ...glowStyles,
      } as React.CSSProperties}
      {...props}
    >
      {/* Glow layer */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] p-px z-10 transition-opacity duration-500 opacity-[var(--glow-opacity,0)] [WebkitMask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [WebkitMaskComposite:xor] [mask:linear-gradient(#fff_0_0)_content-box_exclude,linear-gradient(#fff_0_0)]"
        style={{
          background: `radial-gradient(var(--glow-size, 250px) circle at var(--glow-x, 50%) var(--glow-y, 50%), var(--glow-color, #fff) 0%, var(--accent-color, #fff) 40%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-[1]">
        {children}
      </div>
    </div>
  );
}

interface RotatingGlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Animation duration in seconds. Default: 3 */
  duration?: number;
  /** Border width in px. Default: 2 */
  borderWidth?: number;
  /** Primary gradient color. Default: var(--accent) */
  primaryColor?: string;
  /** Secondary gradient color. Default: lighter variant of --accent via color-mix */
  accentColor?: string;
  /**
   * 'full' — full rotating gradient (default)
   * 'stripe' — single narrow stripe orbiting the border
   */
  mode?: 'full' | 'stripe';
}

const spinnerBase: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '200%',
  height: '200%',
  translate: '-50% -50%',
};

/**
 * A card with an animated rotating glow border effect.
 */
export function RotatingGlowCard({
  children,
  className,
  duration = 3,
  borderWidth = 2,
  primaryColor = 'var(--accent)',
  accentColor = 'color-mix(in oklch, var(--accent) 60%, white)',
  mode = 'full',
  style,
  ...props
}: RotatingGlowCardProps) {
  const conicBg =
    mode === 'stripe'
      ? `conic-gradient(from 0deg, transparent 0%, transparent 85%, ${accentColor} 90%, ${primaryColor} 95%, ${accentColor} 100%)`
      : `conic-gradient(from 0deg, ${primaryColor}, ${accentColor}, transparent 25%, transparent 50%, ${accentColor}, ${primaryColor})`;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        padding: `${borderWidth}px`,
        ...style,
      }}
      {...props}
    >
      {/* Rotating gradient */}
      <div
        style={{
          ...spinnerBase,
          zIndex: 1,
          background: conicBg,
          animation: `glow-spin ${duration}s linear infinite`,
        }}
        aria-hidden="true"
      />

      {/* Blurred glow */}
      <div
        style={{
          ...spinnerBase,
          zIndex: 0,
          background: conicBg,
          filter: 'blur(12px)',
          opacity: mode === 'stripe' ? 0.7 : 0.4,
          animation: `glow-spin ${duration}s linear infinite`,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          background: 'var(--card)',
          borderRadius: `calc(0.75rem - ${borderWidth}px)`,
          padding: '1.5rem',
          height: '100%',
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
}
