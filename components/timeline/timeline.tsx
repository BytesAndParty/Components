import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';

export interface TimelineItem {
  /** Year or date label — shown left of the dot */
  year?: string;
  /** Title of the entry */
  title: string;
  /** Body content */
  content: ReactNode;
  /** Override the auto step-number inside the dot */
  marker?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  /** Dot + year color (default: var(--accent)) */
  dotColor?: string;
  /** Connecting line color (default: var(--border)) */
  lineColor?: string;
  className?: string;
  style?: CSSProperties;
}

// ─── Styles ─────────────────────────────────────────────────────────────────

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
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes timeline-line-grow {
      from { transform: scaleY(0); }
      to   { transform: scaleY(1); }
    }
    @media (prefers-reduced-motion: reduce) {
      [data-timeline-item] * { animation: none !important; }
    }
  `;
  document.head.appendChild(el);
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Timeline({
  items,
  dotColor = 'var(--accent)',
  lineColor = 'var(--border)',
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
              next.add(Number((e.target as HTMLElement).dataset.index));
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

  const DOT_SIZE = 36;

  return (
    <ol
      ref={rootRef}
      className={className}
      style={{ listStyle: 'none', padding: 0, margin: 0, ...style }}
    >
      {items.map((it, i) => {
        const show = visible.has(i);
        const isLast = i === items.length - 1;

        return (
          <li
            key={i}
            data-timeline-item
            data-index={i}
            style={{
              display: 'grid',
              // year col | dot+spine col | content col
              gridTemplateColumns: '72px 44px 1fr',
              columnGap: 16,
            }}
          >
            {/* ── Year ─────────────────────────────────────────── */}
            <div
              style={{
                textAlign: 'right',
                // vertically center year label with dot center
                paddingTop: (DOT_SIZE - 18) / 2,
                opacity: show ? 1 : 0,
                animation: show
                  ? 'timeline-fade-up 380ms cubic-bezier(0.22, 1, 0.36, 1) both'
                  : 'none',
              }}
            >
              {it.year && (
                <span
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    fontVariantNumeric: 'tabular-nums',
                    color: dotColor,
                    lineHeight: '18px',
                  }}
                >
                  {it.year}
                </span>
              )}
            </div>

            {/* ── Dot + vertical spine ──────────────────────────── */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Dot */}
              <div
                aria-hidden="true"
                style={{
                  width: DOT_SIZE,
                  height: DOT_SIZE,
                  flexShrink: 0,
                  borderRadius: '50%',
                  background: dotColor,
                  border: '3px solid var(--background)',
                  boxShadow: `0 0 0 2px ${dotColor}, 0 0 14px color-mix(in oklch, ${dotColor} 30%, transparent)`,
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  animation: show
                    ? 'timeline-dot-in 320ms cubic-bezier(0.34, 1.56, 0.64, 1) both'
                    : 'none',
                  opacity: show ? 1 : 0,
                }}
              >
                {it.marker ?? i + 1}
              </div>

              {/* Spine segment below dot */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  style={{
                    flex: 1,
                    width: 2,
                    minHeight: 24,
                    marginTop: 4,
                    background: lineColor,
                    borderRadius: 2,
                    transformOrigin: 'top',
                    animation: show
                      ? 'timeline-line-grow 350ms ease both'
                      : 'none',
                    animationDelay: show ? '160ms' : undefined,
                    opacity: show ? 1 : 0,
                  }}
                />
              )}
            </div>

            {/* ── Content ───────────────────────────────────────── */}
            <div
              style={{
                paddingBottom: isLast ? 0 : 40,
                opacity: show ? 1 : 0,
                animation: show
                  ? 'timeline-fade-up 420ms cubic-bezier(0.22, 1, 0.36, 1) both'
                  : 'none',
                animationDelay: show ? '80ms' : undefined,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  // align title baseline with dot center
                  paddingTop: (DOT_SIZE - 22) / 2,
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  lineHeight: 1.35,
                }}
              >
                {it.title}
              </h3>
              <div
                style={{
                  marginTop: 8,
                  color: 'var(--muted-foreground)',
                  fontSize: 14,
                  lineHeight: 1.65,
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
