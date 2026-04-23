import { memo } from 'react';
import { cn } from '../lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  /** Gradient colors for the aurora shimmer effect */
  colors?: string[];
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** 
   * 'aurora' (default) - soft, shifting colors
   * 'gradient' - steady loop
   * 'none' - no effect
   */
  variant?: 'aurora' | 'gradient' | 'none';
  style?: React.CSSProperties;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const AuroraText = memo(
  ({
    children,
    className,
    colors,
    speed = 1,
    variant = 'aurora',
    style,
  }: AuroraTextProps) => {
    const finalColors = colors || (variant === 'aurora' 
      ? ['var(--accent)', '#7928CA', '#FF0080', 'var(--accent)']
      : ['#FF0080', '#7928CA', '#0070F3', '#38bdf8']);

    return (
      <span className={cn("relative inline-block", className)} style={style}>
        {/* Screen-reader accessible text (visually hidden) */}
        <span className="sr-only">
          {children}
        </span>
        {/* Gradient-clipped decorative text */}
        <span
          className={cn(
            "relative bg-[length:200%_auto] [WebkitBackgroundClip:text] [WebkitTextFillColor:transparent] bg-clip-text",
            variant === 'none' && "[WebkitTextFillColor:initial] [WebkitBackgroundClip:initial] bg-clip-initial"
          )}
          style={{
            backgroundImage: variant !== 'none' ? `linear-gradient(135deg, ${finalColors.join(', ')}, ${finalColors[0]})` : undefined,
            animation: variant !== 'none' 
              ? `${variant === 'aurora' ? 'aurora' : 'mb-gradient'} ${10 / speed}s ease-in-out infinite alternate`
              : undefined,
          }}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    );
  }
);

AuroraText.displayName = 'AuroraText';
