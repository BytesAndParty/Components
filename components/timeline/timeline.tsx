import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';

export interface TimelineItem {
  /** Short heading (e.g. "2015 · Terroir") */
  title: string;
  /** Optional sub-label shown above/under title */
  subtitle?: string;
  /** Body content — plain string or custom node */
  content: ReactNode;
  /** Optional icon/emoji/number placed in the dot */
  marker?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  /** Dot color (default var(--accent)) */
  dotColor?: string;
  /** Line color (default var(--border)) */
  lineColor?: string;
  /** Offset from left for the spine (px) */
  spineOffset?: number;
  className?: string;
  style?: CSSProperties;
}

const STYLE_ID = '__timeline-styles__';

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    @keyframes timeline-dot-in {
      from { transform: scale(0); opacity: 0; }
      to   { transform: scale(1); opacity: 1; }
    }
    @keyframes timeline-fade-up {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(el);
}

export function Timeline({
  items,
  dotColor = 'var(--accent)',
  lineColor = 'var(--border)',
  spineOffset = 22,
  className,
  style,
}: TimelineProps) {
  const rootRef = useRef<HTMLOListElement>(null);
  const [visible, setVisible] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const lis = Array.from(root.querySelectorAll<HTMLLIElement>('[data-timeline-item]'));

    const obs = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = new Set(prev);
          for (const e of entries) {
            if (e.isIntersecting) {
              const idx = Number((e.target as HTMLElement).dataset.index);
              next.add(idx);
            }
          }
          return next;
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );

    lis.forEach((li) => obs.observe(li));
    return () => obs.disconnect();
  }, [items.length]);

  return (
    <ol
      ref={rootRef}
      className={className}
      style={{
        position: 'relative',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        paddingLeft: spineOffset * 2 + 12,
        ...style,
      }}
    >
      {/* Spine */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: spineOffset,
          top: 8,
          bottom: 8,
          width: 2,
          background: `linear-gradient(to bottom, transparent, ${lineColor} 10%, ${lineColor} 90%, transparent)`,
          borderRadius: 2,
        }}
      />
      {items.map((it, i) => {
        const show = visible.has(i);
        return (
          <li
            key={i}
            data-timeline-item
            data-index={i}
            style={{ position: 'relative', paddingBottom: i === items.length - 1 ? 0 : 32 }}
          >
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: spineOffset - 9,
                top: 4,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: dotColor,
                border: '3px solid var(--background)',
                boxShadow: `0 0 0 2px ${dotColor}, 0 0 12px color-mix(in oklch, ${dotColor} 40%, transparent)`,
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                animation: show ? 'timeline-dot-in 320ms cubic-bezier(0.34, 1.56, 0.64, 1) both' : 'none',
                opacity: show ? 1 : 0,
              }}
            >
              {it.marker}
            </span>
            <div
              style={{
                opacity: show ? 1 : 0,
                animation: show ? 'timeline-fade-up 420ms cubic-bezier(0.22, 1, 0.36, 1) both' : 'none',
                animationDelay: show ? '80ms' : undefined,
              }}
            >
              {it.subtitle && (
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--muted-foreground)',
                    marginBottom: 4,
                  }}
                >
                  {it.subtitle}
                </div>
              )}
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  lineHeight: 1.3,
                }}
              >
                {it.title}
              </h3>
              <div
                style={{
                  marginTop: 8,
                  color: 'var(--muted-foreground)',
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {it.content}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
