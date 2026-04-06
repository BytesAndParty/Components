import { cn } from '@/lib/utils';

interface RotatingGlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Animation duration in seconds. Default: 3 */
  duration?: number;
  /** Border width in px. Default: 2 */
  borderWidth?: number;
  /** Primary gradient color. Default: rgb(var(--theme-primary)) */
  primaryColor?: string;
  /** Secondary gradient color. Default: rgb(var(--theme-accent)) */
  accentColor?: string;
}

/**
 * A card with an animated rotating glow border effect.
 */
export function RotatingGlowCard({
  children,
  className,
  duration = 3,
  borderWidth = 2,
  primaryColor = 'rgb(var(--theme-primary))',
  accentColor = 'rgb(var(--theme-accent))',
  style,
  ...props
}: RotatingGlowCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden p-[var(--glow-border)]',
        className
      )}
      style={{
        ...style,
        '--glow-duration': `${duration}s`,
        '--glow-border': `${borderWidth}px`,
      } as React.CSSProperties}
      {...props}
    >
      {/* The rotating gradient rectangle */}
      <div 
        className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 z-10 animate-glow-spin"
        style={{
          background: `conic-gradient(from 0deg, ${primaryColor}, ${accentColor}, transparent 25%, transparent 50%, ${accentColor}, ${primaryColor})`,
          animationDuration: 'var(--glow-duration)',
        }}
        aria-hidden="true" 
      />
      
      {/* Blurred copy for outer glow bleed */}
      <div 
        className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 z-0 blur-xl opacity-40 animate-glow-spin"
        style={{
          background: `conic-gradient(from 0deg, ${primaryColor}, ${accentColor}, transparent 25%, transparent 50%, ${accentColor}, ${primaryColor})`,
          animationDuration: 'var(--glow-duration)',
        }}
        aria-hidden="true" 
      />

      {/* Content layer - covers the center, border peeks out around it */}
      <div className="relative z-20 bg-card rounded-[calc(0.75rem-var(--glow-border))] p-6 h-full w-full">
        {children}
      </div>
    </div>
  );
}
