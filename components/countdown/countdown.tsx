import { useEffect, useRef, useState } from 'react';
import { useComponentMessages, interpolate } from '../i18n';
import { MESSAGES, type CountdownMessages } from './messages';

const STYLE_ID = '__countdown-styles__';

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @property --cd-value {
      syntax: '<integer>';
      initial-value: 0;
      inherits: false;
    }
    .__cd-digit {
      display: inline-block;
      line-height: 1em;
      height: 1em;
      overflow-y: clip;
      vertical-align: bottom;
    }
    .__cd-digit::before {
      content: "00\\A 01\\A 02\\A 03\\A 04\\A 05\\A 06\\A 07\\A 08\\A 09\\A 10\\A 11\\A 12\\A 13\\A 14\\A 15\\A 16\\A 17\\A 18\\A 19\\A 20\\A 21\\A 22\\A 23\\A 24\\A 25\\A 26\\A 27\\A 28\\A 29\\A 30\\A 31\\A 32\\A 33\\A 34\\A 35\\A 36\\A 37\\A 38\\A 39\\A 40\\A 41\\A 42\\A 43\\A 44\\A 45\\A 46\\A 47\\A 48\\A 49\\A 50\\A 51\\A 52\\A 53\\A 54\\A 55\\A 56\\A 57\\A 58\\A 59\\A 60\\A 61\\A 62\\A 63\\A 64\\A 65\\A 66\\A 67\\A 68\\A 69\\A 70\\A 71\\A 72\\A 73\\A 74\\A 75\\A 76\\A 77\\A 78\\A 79\\A 80\\A 81\\A 82\\A 83\\A 84\\A 85\\A 86\\A 87\\A 88\\A 89\\A 90\\A 91\\A 92\\A 93\\A 94\\A 95\\A 96\\A 97\\A 98\\A 99\\A";
      white-space: pre;
      text-align: center;
      display: block;
      transform: translateY(calc(var(--cd-value) * -1em * 1));
      transition: transform 0.9s cubic-bezier(0.3, 0.1, 0.2, 1);
    }
  `;
  document.head.appendChild(style);
}

function calcRemaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    done: diff === 0,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const sizes = {
  sm: { font: '1.5rem', label: '0.625rem', gap: '0.75rem', pad: '0.5rem 0.625rem' },
  md: { font: '2.25rem', label: '0.6875rem', gap: '1rem', pad: '0.625rem 0.875rem' },
  lg: { font: '3.25rem', label: '0.75rem', gap: '1.25rem', pad: '0.875rem 1.125rem' },
};

function Digit({ value }: { value: number }) {
  const clamped = Math.min(99, Math.max(0, value));
  return (
    <span
      className="__cd-digit"
      style={
        {
          ['--cd-value' as string]: clamped,
        } as React.CSSProperties
      }
      aria-hidden
    />
  );
}

function Block({
  value,
  label,
  size,
  transparent,
}: {
  value: number;
  label?: string;
  size: keyof typeof sizes;
  transparent: boolean;
}) {
  const s = sizes[size];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: s.pad,
          borderRadius: '0.625rem',
          background: transparent ? 'transparent' : 'var(--card)',
          border: transparent ? 'none' : '1px solid var(--border)',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600,
          fontSize: s.font,
          color: 'var(--foreground)',
          minWidth: `calc(${s.font} * 1.6)`,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        }}
      >
        <Digit value={value} />
      </div>
      {label && (
        <span
          style={{
            fontSize: s.label,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--muted-foreground)',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export interface CountdownProps {
  /** Target as Date, ISO string, or epoch ms */
  target: Date | string | number;
  /** Optional end-of-unit: drop days/hours auto when zero */
  hideLeadingZeros?: boolean;
  size?: keyof typeof sizes;
  labels?: { days?: string; hours?: string; minutes?: string; seconds?: string };
  separator?: React.ReactNode;
  transparent?: boolean;
  onComplete?: () => void;
  /** i18n overrides for unit labels + SR remaining template. */
  messages?: Partial<CountdownMessages>;
  className?: string;
  style?: React.CSSProperties;
}

export function Countdown({
  target,
  hideLeadingZeros = false,
  size = 'md',
  labels,
  separator,
  transparent = false,
  onComplete,
  messages,
  className,
  style,
}: CountdownProps) {
  const m = useComponentMessages(MESSAGES, messages);
  const targetMs =
    target instanceof Date ? target.getTime() : typeof target === 'string' ? new Date(target).getTime() : target;

  const [remaining, setRemaining] = useState(() => calcRemaining(targetMs));
  const injected = useRef(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!injected.current) {
      injectStyles();
      injected.current = true;
    }
  }, []);

  // External-source sync: the wall clock. Initial setRemaining writes
  // the freshly computed value before the first interval tick fires
  // (otherwise users see a 1s gap on mount or targetMs change). Inside
  // the interval callback the setState is a subscription update, which
  // the rule allows; only the synchronous one needs a disable.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(calcRemaining(targetMs));
    completedRef.current = false;
    const id = window.setInterval(() => {
      const next = calcRemaining(targetMs);
      setRemaining(next);
      if (next.done && !completedRef.current) {
        completedRef.current = true;
        onComplete?.();
        window.clearInterval(id);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [targetMs, onComplete]);

  const merged = {
    days: labels?.days ?? m.days,
    hours: labels?.hours ?? m.hours,
    minutes: labels?.minutes ?? m.minutes,
    seconds: labels?.seconds ?? m.seconds,
  };
  const s = sizes[size];
  const srLabel = interpolate(m.remaining, {
    d: remaining.days,
    h: remaining.hours,
    m: remaining.minutes,
    s: remaining.seconds,
  });

  const showDays = !hideLeadingZeros || remaining.days > 0;
  const showHours = showDays || !hideLeadingZeros || remaining.hours > 0;

  const sep = separator ?? (
    <span style={{ fontSize: s.font, fontWeight: 600, color: 'var(--muted-foreground)', lineHeight: 1 }}>:</span>
  );

  return (
    <div
      role="timer"
      aria-label={srLabel}
      className={className}
      style={{ display: 'inline-flex', alignItems: 'flex-end', gap: s.gap, ...style }}
    >
      {/* Visual blocks are decorative — the role=timer's aria-label is the SR truth */}
      <div aria-hidden style={{ display: 'contents' }}>
        {showDays && <Block value={remaining.days} label={merged.days} size={size} transparent={transparent} />}
        {showDays && <span style={{ paddingBottom: `calc(${s.label} + 0.375rem)` }}>{sep}</span>}
        {showHours && <Block value={remaining.hours} label={merged.hours} size={size} transparent={transparent} />}
        {showHours && <span style={{ paddingBottom: `calc(${s.label} + 0.375rem)` }}>{sep}</span>}
        <Block value={remaining.minutes} label={merged.minutes} size={size} transparent={transparent} />
        <span style={{ paddingBottom: `calc(${s.label} + 0.375rem)` }}>{sep}</span>
        <Block value={remaining.seconds} label={merged.seconds} size={size} transparent={transparent} />
      </div>
    </div>
  );
}
