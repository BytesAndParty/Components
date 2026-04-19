import { useEffect, useState, type ReactNode, type CSSProperties } from 'react';

export type StickyBannerVariant = 'accent' | 'neutral' | 'warning' | 'danger';
export type StickyBannerPosition = 'top' | 'bottom';

const variantStyles: Record<StickyBannerVariant, { bg: string; fg: string; border: string }> = {
  accent: {
    bg: 'linear-gradient(90deg, color-mix(in oklch, var(--accent) 94%, black), var(--accent))',
    fg: '#fff',
    border: 'color-mix(in oklch, var(--accent) 60%, transparent)',
  },
  neutral: {
    bg: 'var(--card)',
    fg: 'var(--foreground)',
    border: 'var(--border)',
  },
  warning: {
    bg: 'linear-gradient(90deg, #b45309, #f59e0b)',
    fg: '#fff',
    border: 'rgba(180, 83, 9, 0.55)',
  },
  danger: {
    bg: 'linear-gradient(90deg, #b91c1c, #ef4444)',
    fg: '#fff',
    border: 'rgba(185, 28, 28, 0.55)',
  },
};

export interface StickyBannerProps {
  children: ReactNode;
  position?: StickyBannerPosition;
  variant?: StickyBannerVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Persist dismissal in localStorage under this key (null to disable) */
  persistKey?: string | null;
  /** Additional content on the right (e.g. a Countdown, a CTA) */
  action?: ReactNode;
  /** Hide when scrolled past Y offset (e.g. 200 = only show after 200px scroll) */
  showAfterScrollY?: number;
  zIndex?: number;
  className?: string;
  style?: CSSProperties;
}

const LS_PREFIX = 'sticky-banner:dismissed:';

function readDismissed(key: string | null | undefined) {
  if (!key || typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(LS_PREFIX + key) === '1';
  } catch {
    return false;
  }
}

function writeDismissed(key: string | null | undefined) {
  if (!key || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LS_PREFIX + key, '1');
  } catch {
    /* ignore quota/private-mode errors */
  }
}

export function StickyBanner({
  children,
  position = 'top',
  variant = 'accent',
  dismissible = true,
  onDismiss,
  persistKey = null,
  action,
  showAfterScrollY,
  zIndex = 50,
  className,
  style,
}: StickyBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [scrolledEnough, setScrolledEnough] = useState(showAfterScrollY === undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDismissed(readDismissed(persistKey));
    setMounted(true);
  }, [persistKey]);

  useEffect(() => {
    if (showAfterScrollY === undefined) return;
    const onScroll = () => setScrolledEnough(window.scrollY >= showAfterScrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showAfterScrollY]);

  if (dismissed) return null;
  const visible = mounted && scrolledEnough;

  const v = variantStyles[variant];

  const handleDismiss = () => {
    setDismissed(true);
    writeDismissed(persistKey);
    onDismiss?.();
  };

  return (
    <div
      role="region"
      aria-label="Banner"
      className={className}
      style={{
        position: 'sticky',
        [position]: 0,
        zIndex,
        transform: visible
          ? 'translateY(0)'
          : position === 'top'
            ? 'translateY(-120%)'
            : 'translateY(120%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 350ms cubic-bezier(0.22, 1, 0.36, 1), opacity 250ms ease',
        background: v.bg,
        color: v.fg,
        borderBottom: position === 'top' ? `1px solid ${v.border}` : 'none',
        borderTop: position === 'bottom' ? `1px solid ${v.border}` : 'none',
        boxShadow:
          position === 'top'
            ? '0 1px 0 0 color-mix(in oklch, black 15%, transparent)'
            : '0 -1px 0 0 color-mix(in oklch, black 15%, transparent)',
        ...style,
      }}
    >
      <div
        style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '10px 48px 10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span>{children}</span>
          {action}
        </div>

        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Banner schließen"
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 30,
              height: 30,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              borderRadius: 999,
              color: 'inherit',
              cursor: 'pointer',
              opacity: 0.75,
              transition: 'opacity 150ms ease, background 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.background = 'color-mix(in oklch, currentColor 15%, transparent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.75';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }} aria-hidden>
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
