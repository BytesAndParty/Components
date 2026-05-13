import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { cn } from '../lib/utils';
import { useComponentMessages } from '../i18n';
import { MESSAGES, type TimelineMessages } from './messages';

export interface TimelineItem {
  /** Year or date label — shown left of the dot on desktop, above title on mobile */
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
  /** Custom aria-label for the ordered list. Falls back to i18n default. */
  'aria-label'?: string;
  /** i18n overrides for the timeline aria-label. */
  messages?: Partial<TimelineMessages>;
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
    @keyframes timeline-dot-pulse {
      0%   { transform: scale(1); opacity: 0.55; }
      100% { transform: scale(2.4); opacity: 0; }
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
  'aria-label': ariaLabel,
  messages,
  className,
  style,
}: TimelineProps) {
  const m = useComponentMessages(MESSAGES, messages);
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
      aria-label={ariaLabel ?? m.label}
      className={cn("list-none p-0 m-0", className)}
      style={style}
    >
      {items.map((it, i) => {
        const show = visible.has(i);
        const isLast = i === items.length - 1;

        return (
          <li
            key={i}
            data-timeline-item
            data-index={i}
            className="grid grid-cols-[36px_1fr] sm:grid-cols-[72px_44px_1fr] gap-x-4"
          >
            {/* ── Year (Desktop) ───────────────────────────── */}
            <div
              className="hidden sm:block text-right"
              style={{
                paddingTop: (DOT_SIZE - 18) / 2,
                opacity: show ? 1 : 0,
                animation: show
                  ? 'timeline-fade-up 380ms cubic-bezier(0.22, 1, 0.36, 1) both'
                  : 'none',
              }}
            >
              {it.year && (
                <span
                  className="block text-[13px] font-semibold tracking-wide tabular-nums leading-[18px]"
                  style={{ color: dotColor }}
                >
                  {it.year}
                </span>
              )}
            </div>

            {/* ── Dot + vertical spine ──────────────────────────── */}
            <div className="flex flex-col items-center">
              {/* Dot wrapper */}
              <div
                className="relative shrink-0"
                style={{ width: DOT_SIZE, height: DOT_SIZE }}
              >
                {/* Dot */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border-[3px] border-[var(--background)] grid place-items-center text-white text-[13px] font-bold"
                  style={{
                    background: dotColor,
                    boxShadow: `0 0 0 2px ${dotColor}, 0 0 14px color-mix(in oklch, ${dotColor} 30%, transparent)`,
                    animation: show
                      ? 'timeline-dot-in 320ms cubic-bezier(0.34, 1.56, 0.64, 1) both'
                      : 'none',
                    opacity: show ? 1 : 0,
                  }}
                >
                  {it.marker ?? i + 1}
                </div>
                {/* Pulse ring */}
                {show && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      border: `2px solid ${dotColor}`,
                      animation: 'timeline-dot-pulse 0.65s ease-out both',
                      animationDelay: '300ms',
                    }}
                  />
                )}
              </div>

              {/* Spine segment below dot */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className="flex-1 w-[2px] min-h-[24px] mt-1 rounded-sm origin-top"
                  style={{
                    background: lineColor,
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
              className={cn(show ? "opacity-100" : "opacity-0")}
              style={{
                paddingBottom: isLast ? 0 : 40,
                animation: show
                  ? 'timeline-fade-up 420ms cubic-bezier(0.22, 1, 0.36, 1) both'
                  : 'none',
                animationDelay: show ? '80ms' : undefined,
              }}
            >
              {/* Year (Mobile only) */}
              {it.year && (
                <span
                  className="sm:hidden block text-xs font-semibold mb-1"
                  style={{ color: dotColor, paddingTop: (DOT_SIZE - 22) / 2 }}
                >
                  {it.year}
                </span>
              )}
              
              <h3
                className="m-0 text-base font-semibold text-[var(--foreground)] leading-[1.35]"
                style={{
                  paddingTop: it.year ? 0 : (DOT_SIZE - 22) / 2,
                }}
              >
                {it.title}
              </h3>
              <div className="mt-2 text-[var(--muted-foreground)] text-sm leading-[1.65]">
                {it.content}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
