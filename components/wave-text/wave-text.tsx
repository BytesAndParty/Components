import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cn } from '../lib/utils';

/**
 * Text with a hidden click easteregg: one click sends a wave through the
 * characters. Each character swings out and back perpendicular to the reading
 * direction, offset by `stagger` ms, so the wave travels along the line.
 *
 * Deliberately no cursor change, no hover hint, no focus ring — the easteregg is meant
 * to be found, not offered. See COMPONENT.md for the documented §7 exception.
 *
 * The displacement is translateX, not translateY: under
 * `writing-mode: vertical-rl` the characters stack on the Y axis, so moving them
 * there would squeeze them together instead of waving. Perpendicular to the flow
 * is X in that case.
 */

// ─── Style injection ─────────────────────────────────────────────────────────

const STYLE_ID = '__wave-text-styles__';

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    @keyframes wave-text-char {
      0%, 100% { transform: translateX(0); }
      50%      { transform: translateX(var(--wave-text-amplitude, 6px)); }
    }
    @media (prefers-reduced-motion: reduce) {
      [data-wave-text] span { animation: none !important; }
    }
  `;
  document.head.appendChild(el);
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WaveTextProps {
  /** The text to render — animated character by character */
  children: string;
  /** Peak displacement perpendicular to the reading direction, in px */
  amplitude?: number;
  /** Duration of a single character's swing, in ms */
  duration?: number;
  /** Offset between two characters, in ms — this is what creates the wave */
  stagger?: number;
  className?: string;
  style?: CSSProperties;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function WaveText({
  children,
  amplitude = 6,
  duration = 600,
  stagger = 40,
  className,
  style,
}: WaveTextProps) {
  const injected = useRef(false);
  useEffect(() => {
    if (!injected.current) {
      injectStyles();
      injected.current = true;
    }
  }, []);

  // A counter, not a boolean: every click hands out fresh keys, React remounts
  // the character spans and the CSS animation restarts from zero — no reflow
  // hack, and a second click mid-wave is not swallowed.
  const [play, setPlay] = useState(0);

  const chars = Array.from(children);

  return (
    // Documented exception to Guidelines §7, see COMPONENT.md → Accessibility:
    // nothing is gated behind this click — no function, no information. A tab
    // stop that only plays an animation would add noise for keyboard/AT users
    // without adding capability, so the element stays non-interactive.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <span
      data-wave-text=""
      // No <button>, no role, no tabIndex: the easteregg has no function, so there is
      // nothing a keyboard or AT user could miss. A focusable element that does
      // nothing would be the greater harm. Documented in COMPONENT.md.
      onClick={() => setPlay((p) => p + 1)}
      className={cn(className)}
      // cursor: default rather than the text I-beam — the I-beam would give the
      // egg away on hover. Before ...style so callers can still override it.
      style={{ cursor: 'default', ...style, '--wave-text-amplitude': `${amplitude}px` } as CSSProperties}
    >
      {/* The unsplit text for screen readers — per-character inline-block spans
          would otherwise be read out letter by letter. */}
      <span className="sr-only">{children}</span>
      {chars.map((char, i) => (
        <span
          key={`${play}-${i}`}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            animation:
              play === 0
                ? undefined
                : `wave-text-char ${duration}ms ease-in-out ${i * stagger}ms`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
