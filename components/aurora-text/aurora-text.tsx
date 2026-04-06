import { memo } from 'react';

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
  style?: React.CSSProperties;
}

export const AuroraText = memo(
  ({
    children,
    className,
    colors = ['#FF0080', '#7928CA', '#0070F3', '#38bdf8'],
    speed = 1,
    style,
  }: AuroraTextProps) => {
    return (
      <span className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
        <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          {children}
        </span>
        <span
          style={{
            position: 'relative',
            backgroundImage: `linear-gradient(135deg, ${colors.join(', ')}, ${colors[0]})`,
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
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
