import { useRef, useState, useCallback, useMemo } from 'react';

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
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        position: 'relative',
        borderRadius: '0.75rem',
        border: '1px solid var(--border)',
        background: 'var(--card)',
        transition: 'border-color 0.3s',
        ...style,
        ...glowStyles,
      } as React.CSSProperties}
      {...props}
    >
      {/* Glow layer */}
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: '-1px',
          borderRadius: 'inherit',
          padding: '1px',
          zIndex: 10,
          opacity: 'var(--glow-opacity, 0)' as unknown as number,
          transition: 'opacity 0.5s',
          background: `radial-gradient(var(--glow-size, 250px) circle at var(--glow-x, 50%) var(--glow-y, 50%), var(--glow-color, #fff) 0%, var(--accent-color, #fff) 40%, transparent 70%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0)',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
