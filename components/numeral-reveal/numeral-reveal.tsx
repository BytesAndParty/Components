import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cn } from '../lib/utils';
import { romanToArabic } from './roman';

/**
 * Roman numeral with a hidden click easteregg: one click fades in the Arabic
 * value for a few seconds, then fades back to the Roman one.
 *
 * Deliberately no cursor change, no hover hint, no focus ring — same stance as
 * WaveText. See COMPONENT.md for the documented §7 exception.
 *
 * Both numerals occupy the same grid cell, so the container measures itself
 * against the wider of the two and the swap can never shift the layout.
 */

// ─── Style injection ─────────────────────────────────────────────────────────

const STYLE_ID = '__numeral-reveal-styles__';

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    @media (prefers-reduced-motion: reduce) {
      [data-numeral-reveal] > span { transition: none !important; }
    }
  `;
  document.head.appendChild(el);
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NumeralRevealProps {
  /** The Roman numeral, e.g. 'I', 'II', 'XXX' */
  numeral: string;
  /** How long the Arabic value stays up after the fade, in ms */
  revealDuration?: number;
  /** Duration of a single cross-fade, in ms */
  transitionDuration?: number;
  className?: string;
  style?: CSSProperties;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function NumeralReveal({
  numeral,
  revealDuration = 3000,
  transitionDuration = 300,
  className,
  style,
}: NumeralRevealProps) {
  const arabic = romanToArabic(numeral);

  const injected = useRef(false);
  useEffect(() => {
    if (!injected.current) {
      injectStyles();
      injected.current = true;
    }
  }, []);

  const [revealed, setRevealed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // Not a valid numeral: render it unchanged, no click behaviour.
  if (arabic === null) {
    return <span className={className} style={style}>{numeral}</span>;
  }

  // A click during the hold extends it — the old timer is cleared rather than a
  // second fade-back being queued behind the first.
  const handleClick = () => {
    if (timer.current) clearTimeout(timer.current);
    setRevealed(true);
    timer.current = setTimeout(
      () => setRevealed(false),
      transitionDuration + revealDuration
    );
  };

  const fade: CSSProperties = {
    gridArea: '1 / 1',
    transition: `opacity ${transitionDuration}ms ease-in-out`,
  };

  return (
    // Documented exception to Guidelines §7, see COMPONENT.md → Accessibility:
    // nothing is gated behind this click — no function, no information. A tab
    // stop that only plays an animation would add noise for keyboard/AT users
    // without adding capability, so the element stays non-interactive.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <span
      data-numeral-reveal=""
      onClick={handleClick}
      className={cn(className)}
      // cursor: default rather than the text I-beam — see WaveText.
      style={{ cursor: 'default', display: 'inline-grid', justifyItems: 'start', ...style }}
    >
      <span style={{ ...fade, opacity: revealed ? 0 : 1 }}>{numeral}</span>
      {/* Decorative: screen readers read the Roman numeral throughout. */}
      <span aria-hidden="true" style={{ ...fade, opacity: revealed ? 1 : 0 }}>
        {arabic}
      </span>
    </span>
  );
}
