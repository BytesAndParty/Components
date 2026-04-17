import { memo, useEffect, useRef } from 'react';

// ─── Keyframe injection ─────────────────────────────────────────────────────────
// The aurora shimmer keyframe must live inside the component so it works
// standalone without any external stylesheet.

const STYLE_ID = '__aurora-text-keyframes__';

function injectKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes aurora {
      0%   { background-position: 0% center; }
      100% { background-position: 200% center; }
    }
    @keyframes aurora-gradient {
      0%   { background-position: 0% center; }
      100% { background-position: 300% center; }
    }
  `;
  document.head.appendChild(style);
}

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
    const injected = useRef(false);
    useEffect(() => {
      if (!injected.current) {
        injectKeyframes();
        injected.current = true;
      }
    }, []);

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
      <span className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
        {/* Screen-reader accessible text (visually hidden) */}
        <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          {children}
        </span>
        {/* Gradient-clipped decorative text */}
        <span
          style={{
            position: 'relative',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            ...gradientStyle,
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
