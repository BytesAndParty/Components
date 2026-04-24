import { useRef, useState, useEffect, type ReactNode, type CSSProperties } from 'react';

export type LensMode = 'hover' | 'toggle';

export interface LensProps {
  children: ReactNode;
  mode?: LensMode;
  zoom?: number;
  lensSize?: number;
  ringWidth?: number;
  ringColor?: string;
  className?: string;
  style?: CSSProperties;
}

const STYLE_ID = '__lens-styles__';

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    @keyframes lens-fade-in {
      from { opacity: 0; transform: scale(0.6); }
      to   { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(el);
}

export function Lens({
  children,
  mode = 'hover',
  zoom = 1.6,
  lensSize = 170,
  ringWidth = 2,
  ringColor = 'var(--accent)',
  className,
  style,
}: LensProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState(false);
  const [toggled, setToggled] = useState(false);

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const visible = mode === 'hover' ? active : toggled;

  function updatePos(clientX: number, clientY: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: clientX - rect.left, y: clientY - rect.top });
  }

  function handleEnter(e: React.PointerEvent<HTMLDivElement>) {
    updatePos(e.clientX, e.clientY);
    if (mode === 'hover') setActive(true);
  }

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    updatePos(e.clientX, e.clientY);
  }

  function handleLeave() {
    if (mode === 'hover') setActive(false);
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (mode !== 'toggle') return;
    updatePos(e.clientX, e.clientY);
    setToggled((v) => !v);
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: mode === 'toggle' ? 'zoom-in' : 'crosshair',
        borderRadius: 12,
        ...style,
      }}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onClick={handleClick}
    >
      {children}
      {visible && size.w > 0 && (
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            left: pos.x - lensSize / 2,
            top: pos.y - lensSize / 2,
            width: lensSize,
            height: lensSize,
            borderRadius: '50%',
            border: `${ringWidth}px solid ${ringColor}`,
            boxShadow:
              '0 0 0 1px rgba(0,0,0,0.15), 0 8px 24px -4px rgba(0,0,0,0.35)',
            overflow: 'hidden',
            animation: 'lens-fade-in 160ms cubic-bezier(0.22, 1, 0.36, 1)',
            zIndex: 2,
          }}
          aria-hidden="true"
        >
          <div
            style={{
              width: size.w,
              height: size.h,
              transform: `scale(${zoom}) translate(${lensSize / (2 * zoom) - pos.x}px, ${lensSize / (2 * zoom) - pos.y}px)`,
              transformOrigin: '0 0',
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
