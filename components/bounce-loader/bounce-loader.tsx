import { useEffect, useRef } from 'react';

const STYLE_ID = '__bounce-loader-styles__';

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes bounce-loader-circle {
      0%   {
        top: var(--bl-bottom);
        height: calc(var(--bl-size) * 0.25);
        border-radius: 50px 50px calc(var(--bl-size) * 1.25) calc(var(--bl-size) * 1.25);
        transform: scaleX(2.7);
        background: var(--bl-squish);
      }
      40%  {
        height: var(--bl-size);
        border-radius: 50%;
        transform: scaleX(1);
        background: var(--bl-color);
      }
      100% { top: 0%; }
    }
    @keyframes bounce-loader-shadow {
      0%   { transform: scaleX(1.5); opacity: 0.5; }
      40%  { transform: scaleX(1);   opacity: 0.7; }
      100% { transform: scaleX(0.2); opacity: 0.2; }
    }
  `;
  document.head.appendChild(style);
}

export interface BounceLoaderProps {
  size?: number;
  color?: string;
  squishColor?: string;
  speed?: number;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function BounceLoader({
  size = 20,
  color = 'var(--accent)',
  squishColor = 'var(--muted-foreground)',
  speed = 0.5,
  label = 'Loading',
  className,
  style,
}: BounceLoaderProps) {
  const injected = useRef(false);

  useEffect(() => {
    if (!injected.current) {
      injectStyles();
      injected.current = true;
    }
  }, []);

  const bottom = size * 3;
  const wrapperWidth = size * 10;
  const wrapperHeight = size * 3 + size;
  const duration = `${speed}s`;

  const circleBase: React.CSSProperties = {
    width: size,
    height: size,
    position: 'absolute',
    borderRadius: '50%',
    background: color,
    transformOrigin: '50%',
    animation: `bounce-loader-circle ${duration} alternate infinite ease`,
  };
  const shadowBase: React.CSSProperties = {
    width: size,
    height: size * 0.2,
    borderRadius: '50%',
    background: 'color-mix(in oklch, var(--foreground) 35%, transparent)',
    position: 'absolute',
    top: bottom + size * 0.1,
    zIndex: -1,
    filter: 'blur(1px)',
    animation: `bounce-loader-shadow ${duration} alternate infinite ease`,
  };

  const vars = {
    ['--bl-size' as string]: `${size}px`,
    ['--bl-bottom' as string]: `${bottom}px`,
    ['--bl-color' as string]: color,
    ['--bl-squish' as string]: squishColor,
  } as React.CSSProperties;

  return (
    <div
      role="status"
      aria-label={label}
      aria-live="polite"
      className={className}
      style={{
        width: wrapperWidth,
        height: wrapperHeight,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        ...vars,
        ...style,
      }}
    >
      <span style={{ ...circleBase, left: '15%' }} />
      <span style={{ ...circleBase, left: '45%', animationDelay: `${speed * 0.2}s` }} />
      <span style={{ ...circleBase, right: '15%', animationDelay: `${speed * 0.4}s` }} />

      <span style={{ ...shadowBase, left: '15%' }} />
      <span style={{ ...shadowBase, left: '45%', animationDelay: `${speed * 0.2}s` }} />
      <span style={{ ...shadowBase, right: '15%', animationDelay: `${speed * 0.4}s` }} />

      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
        {label}
      </span>
    </div>
  );
}
