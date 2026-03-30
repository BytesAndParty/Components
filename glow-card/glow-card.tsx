import { useRef, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GlowCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode;
  glowRadius?: number;
}

export function GlowCard({ children, className, glowRadius = 250, style, ...props }: GlowCardProps) {
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

  return (
    <Card
      ref={cardRef}
      className={cn('cursor-glow-card', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...(style as React.CSSProperties),
        '--glow-x': `${mousePosition.x}px`,
        '--glow-y': `${mousePosition.y}px`,
        '--glow-opacity': isHovering ? 1 : 0,
        '--glow-size': `${glowRadius}px`,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </Card>
  );
}
