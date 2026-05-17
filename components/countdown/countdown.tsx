import { useEffect, useRef, useState } from 'react';
import { useComponentMessages, interpolate } from '../i18n';
import { MESSAGES, type CountdownMessages } from './messages';

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

function Digit({ value, size }: { value: number; size: keyof typeof sizes }) {
  const digits = value.toString().padStart(2, '0').split('');
  const s = sizes[size];
  
  return (
    <div style={{ display: 'flex', gap: '0.02em' }}>
      {digits.map((d, i) => (
        <div
          key={i}
          style={{
            height: '1em',
            overflow: 'hidden',
            width: `calc(${s.font} * 0.62)`,
            textAlign: 'center',
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `translateY(-${parseInt(d, 10)}em)`,
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <span 
                key={num} 
                style={{ 
                  height: '1em', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  lineHeight: 1
                }}
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
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
          lineHeight: 1,
        }}
      >
        <Digit value={value} size={size} />
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
  const completedRef = useRef(false);

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
