import { useCallback, useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { flushSync } from 'react-dom';

interface AnimatedThemeTogglerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Animation duration in ms. Default: 400 */
  duration?: number;
  /** Size of the icon in px. Default: 18 */
  iconSize?: number;
  /** Called after theme changes */
  onThemeChange?: (isDark: boolean) => void;
}

export function AnimatedThemeToggler({
  className,
  duration = 400,
  iconSize = 18,
  onThemeChange,
  style,
  ...props
}: AnimatedThemeTogglerProps) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === 'undefined') return true;
    const stored = localStorage.getItem('theme_pref');
    if (stored) return stored === 'dark';
    return true; // :root CSS defaults to dark
  });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Sync DOM with resolved initial state
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const { top, left, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const vw = window.visualViewport?.width ?? window.innerWidth;
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const maxRadius = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y));

    const apply = () => {
      const next = !isDark;
      setIsDark(next);
      document.documentElement.classList.toggle('dark');
      // Also set data-theme for our CSS var system
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      localStorage.setItem('theme_pref', next ? 'dark' : 'light');
      onThemeChange?.(next);
    };

    if (typeof document.startViewTransition !== 'function') {
      apply();
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(apply);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  }, [isDark, duration, onThemeChange]);

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      className={className}
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
      <Sun
        style={{
          width: iconSize,
          height: iconSize,
          position: isDark ? 'relative' : 'absolute',
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
          transition: 'transform 0.3s ease',
        }}
      />
      <Moon
        style={{
          width: iconSize,
          height: iconSize,
          position: isDark ? 'absolute' : 'relative',
          transform: isDark ? 'rotate(-90deg) scale(0)' : 'rotate(0deg) scale(1)',
          transition: 'transform 0.3s ease',
        }}
      />
    </button>
  );
}
