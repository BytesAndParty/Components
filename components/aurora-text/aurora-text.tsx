import { memo } from 'react';

// ─── Keyframes ──────────────────────────────────────────────────────────────────
// aurora, aurora-gradient → showcase/src/styles.css (standalone: see COMPONENT.md)

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  /** Gradient colors for the aurora shimmer effect */
  colors?: string[];
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /**
   * 'aurora'    → sanfter Shimmer mit alternate (default)
   * 'gradient'  → stetiger Loop ohne alternate, knalliger für CTAs
   */
  variant?: 'aurora' | 'gradient';
  style?: React.CSSProperties;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const AuroraText = memo(
  ({
    children,
    className,
    colors = ['#FF0080', '#7928CA', '#0070F3', '#38bdf8'],
    speed = 1,
    variant = 'aurora',
    style,
  }: AuroraTextProps) => {
      const gradientStyle =
      variant === 'gradient'
        ? {
            // Nahtloser Loop: ersten Farbwert am Ende wiederholen
            backgroundImage: `linear-gradient(90deg, ${[...colors, colors[0]].join(', ')})`,
            backgroundSize: '300% auto',
            animation: `aurora-gradient ${6 / speed}s linear infinite`,
          }
        : {
            backgroundImage: `linear-gradient(135deg, ${colors.join(', ')}, ${colors[0]})`,
            backgroundSize: '200% auto',
            animation: `aurora ${10 / speed}s ease-in-out infinite alternate`,
          };

    return (
      <span
        className={className}
        style={{
          display: 'inline-block',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          ...gradientStyle,
          ...style,
        }}
      >
        {children}
      </span>
    );
  }
);

AuroraText.displayName = 'AuroraText';
