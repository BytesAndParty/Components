import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

export type ImagesSliderDirection = 'up' | 'down' | 'left' | 'right';

export interface ImagesSliderProps {
  images: string[];
  children?: ReactNode;
  autoplay?: boolean;
  /** Interval between slides in ms (only when autoplay) */
  interval?: number;
  /** Transition direction of outgoing slide */
  direction?: ImagesSliderDirection;
  /** Overlay tint over each image */
  overlay?: boolean;
  overlayColor?: string;
  /** Height — any CSS value (e.g. '100vh', 600) */
  height?: string | number;
  className?: string;
  style?: CSSProperties;
}

const STYLE_ID = '__images-slider-styles__';

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    @keyframes images-slider-zoom {
      from { transform: scale(1.08); }
      to   { transform: scale(1); }
    }
  `;
  document.head.appendChild(el);
}

function exitTransform(dir: ImagesSliderDirection) {
  switch (dir) {
    case 'up':    return 'translate3d(0, -100%, 0)';
    case 'down':  return 'translate3d(0, 100%, 0)';
    case 'left':  return 'translate3d(-100%, 0, 0)';
    case 'right': return 'translate3d(100%, 0, 0)';
  }
}

function enterTransform(dir: ImagesSliderDirection) {
  switch (dir) {
    case 'up':    return 'translate3d(0, 100%, 0)';
    case 'down':  return 'translate3d(0, -100%, 0)';
    case 'left':  return 'translate3d(100%, 0, 0)';
    case 'right': return 'translate3d(-100%, 0, 0)';
  }
}

export function ImagesSlider({
  images,
  children,
  autoplay = true,
  interval = 5000,
  direction = 'up',
  overlay = true,
  overlayColor = 'rgba(0, 0, 0, 0.55)',
  height = 560,
  className,
  style,
}: ImagesSliderProps) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
  const total = images.length;

  useEffect(() => {
    injectStyles();
  }, []);

  // Preload all images
  useEffect(() => {
    let cancelled = false;
    images.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (cancelled) return;
        setLoaded((prev) => {
          if (prev.has(i)) return prev;
          const next = new Set(prev);
          next.add(i);
          return next;
        });
      };
    });
    return () => { cancelled = true; };
  }, [images]);

  useEffect(() => {
    if (!autoplay || total < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, interval);
    return () => window.clearInterval(id);
  }, [autoplay, interval, total]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % total);
      if (e.key === 'ArrowLeft')  setIndex((i) => (i - 1 + total) % total);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total]);

  const allReady = loaded.size >= Math.min(2, total);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        background: '#000',
        ...style,
      }}
    >
      {allReady &&
        images.map((src, i) => {
          const isCurrent = i === index;
          const isPrev = i === (index - 1 + total) % total;
          let transform = enterTransform(direction);
          let opacity = 0;
          let animation: string | undefined;
          if (isCurrent) {
            transform = 'translate3d(0, 0, 0)';
            opacity = 1;
            animation = 'images-slider-zoom 6s ease-out forwards';
          } else if (isPrev) {
            transform = exitTransform(direction);
            opacity = 1;
          }
          return (
            <div
              key={i}
              aria-hidden={!isCurrent}
              style={{
                position: 'absolute',
                inset: 0,
                transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 900ms ease',
                transform,
                opacity,
                willChange: 'transform, opacity',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  animation: isCurrent ? animation : undefined,
                }}
              />
              {overlay && (
                <div
                  aria-hidden="true"
                  style={{ position: 'absolute', inset: 0, background: overlayColor }}
                />
              )}
            </div>
          );
        })}

      {!allReady && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Loading…
        </div>
      )}

      {children && (
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
