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
