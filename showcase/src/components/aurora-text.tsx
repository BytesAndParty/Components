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
  style?: React.CSSProperties;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const AuroraText = memo(
  ({
    children,
    className,
    colors = ['#FF0080', '#7928CA', '#0070F3', '#38bdf8'],
    speed = 1,
    style,
  }: AuroraTextProps) => {
    return (
      <span className={cn("relative inline-block", className)} style={style}>
        {/* Screen-reader accessible text (visually hidden) */}
        <span className="absolute w-[1px] h-[1px] overflow-hidden [clip:rect(0,0,0,0)]">
          {children}
        </span>
        {/* Gradient-clipped decorative text */}
        <span
          className="relative bg-[length:200%_auto] [WebkitBackgroundClip:text] [WebkitTextFillColor:transparent] bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(135deg, ${colors.join(', ')}, ${colors[0]})`,
            animation: `aurora ${10 / speed}s ease-in-out infinite alternate`,
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
