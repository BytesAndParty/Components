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
   * 'aurora'   (default) – sanft wechselnder Multi-Color-Effekt
   * 'gradient' – stetiger Loop, knallig für CTAs
   * 'none'     – kein Effekt
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
    const finalColors = colors ?? (
      variant === 'aurora'
        ? ['var(--accent)', '#7928CA', '#FF0080', 'var(--accent)']
        : ['#FF0080', '#7928CA', '#0070F3', '#38bdf8']
    );

    const gradientStyle: React.CSSProperties = variant !== 'none'
      ? {
          backgroundImage: variant === 'gradient'
            ? `linear-gradient(90deg, ${[...finalColors, finalColors[0]].join(', ')})`
            : `linear-gradient(135deg, ${finalColors.join(', ')}, ${finalColors[0]})`,
          backgroundSize: variant === 'gradient' ? '300% auto' : '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: variant === 'gradient'
            ? `mb-gradient ${6 / speed}s linear infinite`
            : `aurora ${10 / speed}s ease-in-out infinite alternate`,
        }
      : {};

    return (
      <span
        className={cn('inline-block', className)}
        style={{ ...gradientStyle, ...style }}
      >
        {children}
      </span>
    );
  }
);

AuroraText.displayName = 'AuroraText';
