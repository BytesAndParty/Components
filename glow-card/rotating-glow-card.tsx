import { cn } from '@/lib/utils';

interface RotatingGlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Animation duration in seconds. Default: 3 */
  duration?: number;
  /** Border width in px. Default: 2 */
  borderWidth?: number;
}

export function RotatingGlowCard({
  children,
  className,
  duration = 3,
  borderWidth = 2,
  style,
  ...props
}: RotatingGlowCardProps) {
  return (
    <div
      className={cn('rotating-glow-wrapper', className)}
      style={{
        ...style,
        '--glow-duration': `${duration}s`,
        '--glow-border': `${borderWidth}px`,
      } as React.CSSProperties}
      {...props}
    >
      {/* Rotating gradient - sits behind everything, overflow hidden clips it to border-radius */}
      <div className="rotating-glow-spinner" aria-hidden="true" />
      {/* Blur copy for the outer glow */}
      <div className="rotating-glow-blur" aria-hidden="true" />
      {/* Content layer - covers center, only border peeks through */}
      <div className="rotating-glow-content">
        {children}
      </div>
    </div>
  );
}
