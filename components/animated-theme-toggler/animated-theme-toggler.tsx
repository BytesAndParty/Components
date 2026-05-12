import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { useAtelier } from '../atelier';
import { useComponentMessages } from '../i18n';
import { MESSAGES, type AnimatedThemeTogglerMessages } from './messages';

interface AnimatedThemeTogglerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed'> {
  /** Animation duration in ms. Default: 400 */
  duration?: number;
  /** Size of the icon in px. Default: 18 */
  iconSize?: number;
  /** Called after theme changes */
  onThemeChange?: (isDark: boolean) => void;
  /** i18n overrides for the toggle label. */
  messages?: Partial<AnimatedThemeTogglerMessages>;
}

/* ── Inline SVG icons with CSS hover animations ── */

function SunSvg({ size }: { size: number }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      className="icon-sun"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <g className="icon-sun-rays" style={{ transformOrigin: '12px 12px' }}>
        <path d="M12 2v2" /><path d="M12 20v2" />
        <path d="M4.93 4.93l1.41 1.41" /><path d="M17.66 17.66l1.41 1.41" />
        <path d="M2 12h2" /><path d="M20 12h2" />
        <path d="M6.34 17.66l-1.41 1.41" /><path d="M19.07 4.93l-1.41 1.41" />
      </g>
    </svg>
  );
}

function MoonSvg({ size }: { size: number }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      className="icon-moon"
      aria-hidden
    >
      <path className="icon-moon-body" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" style={{ transformOrigin: '10px 14px' }} />
      <circle className="icon-moon-star1" cx="19" cy="5" r="0.6" fill="currentColor" opacity="0" />
      <circle className="icon-moon-star2" cx="21" cy="9" r="0.4" fill="currentColor" opacity="0" />
      <circle className="icon-moon-star3" cx="17" cy="3" r="0.5" fill="currentColor" opacity="0" />
    </svg>
  );
}

export function AnimatedThemeToggler({
  className,
  duration = 400,
  iconSize = 18,
  onThemeChange,
  messages,
  style,
  ...props
}: AnimatedThemeTogglerProps) {
  const { theme, setTheme } = useAtelier();
  const isDark = theme === 'dark';
  const buttonRef = useRef<HTMLButtonElement>(null);
  const m = useComponentMessages(MESSAGES, messages);
  // Label describes the next action, matching aria-pressed semantics
  const label = isDark ? m.switchToLight : m.switchToDark;

  function toggleTheme() {
    const button = buttonRef.current;
    if (!button) return;

    const { top, left, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const vw = window.visualViewport?.width ?? window.innerWidth;
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const maxRadius = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y));

    function apply() {
      const next = !isDark;
      setTheme(next ? 'dark' : 'light');
      onThemeChange?.(next);
    }

    if (typeof document.startViewTransition !== 'function') {
      apply();
      return;
    }

    const transition = document.startViewTransition(() => { flushSync(apply); });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        { duration, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
      );
    });
  }

  return (
    <>
      <style>{`
        @keyframes sun-rays-rotate {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(30deg) scale(1.15); }
          100% { transform: rotate(0deg) scale(1); }
        }
        @keyframes moon-rock {
          0%, 100% { transform: rotate(0); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes moon-star-twinkle1 {
          0%, 100% { opacity: 0; transform: scale(0); }
          40%, 70% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes moon-star-twinkle2 {
          0%, 100% { opacity: 0; transform: scale(0); }
          50%, 80% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes moon-star-twinkle3 {
          0%, 100% { opacity: 0; transform: scale(0); }
          30%, 60% { opacity: 1; transform: scale(1.8); }
        }
        .theme-toggle-btn:hover .icon-sun-rays { animation: sun-rays-rotate 0.8s ease; }
        .theme-toggle-btn:hover .icon-moon-body { animation: moon-rock 0.7s ease; }
        .theme-toggle-btn:hover .icon-moon-star1 { animation: moon-star-twinkle1 0.7s ease forwards; }
        .theme-toggle-btn:hover .icon-moon-star2 { animation: moon-star-twinkle2 0.7s ease 0.1s forwards; }
        .theme-toggle-btn:hover .icon-moon-star3 { animation: moon-star-twinkle3 0.7s ease 0.2s forwards; }
        .theme-toggle-btn:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .theme-toggle-btn:hover .icon-sun-rays,
          .theme-toggle-btn:hover .icon-moon-body,
          .theme-toggle-btn:hover .icon-moon-star1,
          .theme-toggle-btn:hover .icon-moon-star2,
          .theme-toggle-btn:hover .icon-moon-star3 { animation: none !important; }
        }
      `}</style>
      <button
        type="button"
        ref={buttonRef}
        onClick={toggleTheme}
        aria-label={label}
        aria-pressed={isDark}
        title={label}
        className={`theme-toggle-btn ${className ?? ''}`}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          width: '2.25rem',
          height: '2.25rem',
          borderRadius: '0.375rem',
          border: 'none',
          background: 'transparent',
          color: 'inherit',
          cursor: 'pointer',
          transition: 'background 0.15s',
          ...style,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
        }}
        {...props}
      >
        <div style={{
          position: isDark ? 'relative' : 'absolute',
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
          transition: 'transform 0.3s ease',
          display: 'flex',
        }}>
          <SunSvg size={iconSize} />
        </div>
        <div style={{
          position: isDark ? 'absolute' : 'relative',
          transform: isDark ? 'rotate(-90deg) scale(0)' : 'rotate(0deg) scale(1)',
          transition: 'transform 0.3s ease',
          display: 'flex',
        }}>
          <MoonSvg size={iconSize} />
        </div>
      </button>
    </>
  );
}
