import { useRef, useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GlowCardProps extends React.ComponentProps<typeof Card> {
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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  const glowStyles = useMemo(() => ({
    '--glow-x': `${mousePosition.x}px`,
    '--glow-y': `${mousePosition.y}px`,
    '--glow-opacity': isHovering ? 1 : 0,
    '--glow-size': `${glowRadius}px`,
    '--glow-color': glowColor,
    '--accent-color': accentColor,
  } as React.CSSProperties), [mousePosition.x, mousePosition.y, isHovering, glowRadius, glowColor, accentColor]);

  return (
    <Card
      ref={cardRef}
      className={cn(
        'relative border border-white/10 transition-colors duration-300',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        ...glowStyles,
      } as React.CSSProperties}
      {...props}
    >
      {/* Glow Layer (The border glow) */}
      <div 
        className="pointer-events-none absolute -inset-px rounded-[inherit] p-[1px] z-10 opacity-[var(--glow-opacity,0)] transition-opacity duration-500"
        style={{
          background: `radial-gradient(var(--glow-size, 250px) circle at var(--glow-x, 50%) var(--glow-y, 50%), var(--glow-color, #fff) 0%, var(--accent-color, #fff) 40%, transparent 70%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0)',
        }}
      />
      
      {/* Content Layer */}
      <div className="relative z-[1]">
        {children}
      </div>
    </Card>
  );
}
