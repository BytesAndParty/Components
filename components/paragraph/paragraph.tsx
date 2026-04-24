import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';

const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(' ');

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const STYLE_ID = 'paragraph-styles';

export type WordAnimation = 'fade-up' | 'fade' | 'blur' | 'slide-down';

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .pw-word {
      display: inline-block;
      opacity: 0;
    }

    /* fade-up: opacity + subtle rise (default) */
    [data-revealed="true"][data-word-animation="fade-up"] .pw-word {
      animation: pw-fade-up 0.5s ease forwards;
    }
    @keyframes pw-fade-up {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* fade: opacity only */
    [data-revealed="true"][data-word-animation="fade"] .pw-word {
      animation: pw-fade 0.5s ease forwards;
    }
    @keyframes pw-fade {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* blur: opacity + blur dissolve */
    [data-revealed="true"][data-word-animation="blur"] .pw-word {
      animation: pw-blur 0.55s ease forwards;
    }
    @keyframes pw-blur {
      from { opacity: 0; filter: blur(6px); }
      to   { opacity: 1; filter: blur(0); }
    }

    /* slide-down: drops in from above */
    [data-revealed="true"][data-word-animation="slide-down"] .pw-word {
      animation: pw-slide-down 0.45s ease forwards;
    }
    @keyframes pw-slide-down {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .pw-word { opacity: 1; }
      [data-revealed="true"] .pw-word { animation: none; }
    }
  `;
  document.head.appendChild(style);
}

type PreparedText = unknown;
type LayoutResult = { height: number; lineCount: number };

interface PretextModule {
  prepare: (text: string, font: string, options?: object) => PreparedText;
  layout: (prepared: PreparedText, maxWidth: number, lineHeight: number) => LayoutResult;
}

let pretextPromise: Promise<PretextModule | null> | null = null;
function loadPretext(): Promise<PretextModule | null> {
  if (pretextPromise) return pretextPromise;
  pretextPromise = import('@chenglou/pretext')
    .then((mod) => mod as unknown as PretextModule)
    .catch(() => null);
  return pretextPromise;
}

export interface ParagraphProps {
  text: string;
  /** Maximale Zeilenanzahl bevor Truncation greift. Undefined = nie truncate. */
  clamp?: number;
  /** Wenn true: "Mehr lesen"-Button erscheint, sobald Text overflowed. */
  expandable?: boolean;
  expandLabel?: string;
  collapseLabel?: string;
  /** Scroll-Reveal-Animation pro Wort. Default: 'fade-up'. */
  wordAnimation?: WordAnimation;
  className?: string;
  style?: React.CSSProperties;
  /** Callback nach Messung: erfährt, ob Truncation tatsächlich greift. */
  onMeasure?: (result: { lineCount: number; truncated: boolean }) => void;
}

export function Paragraph({
  text,
  clamp,
  expandable = false,
  expandLabel = 'Mehr lesen',
  collapseLabel = 'Weniger',
  wordAnimation = 'fade-up',
  className,
  style,
  onMeasure,
}: ParagraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [overflow, setOverflow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    injectStyles();
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useIsoLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    setWidth(el.clientWidth);

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!clamp || width === 0) return;

    let cancelled = false;
    const el = containerRef.current;
    if (!el) return;

    const cs = window.getComputedStyle(el);
    const font = `${cs.fontStyle} ${cs.fontVariant} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const lineHeightPx = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;

    loadPretext().then((pretext) => {
      if (cancelled) return;

      let lineCount: number;
      if (pretext) {
        const prepared = pretext.prepare(text, font);
        lineCount = pretext.layout(prepared, width, lineHeightPx).lineCount;
      } else {
        const avgCharWidth = parseFloat(cs.fontSize) * 0.55;
        const charsPerLine = Math.floor(width / avgCharWidth);
        lineCount = Math.ceil(text.length / Math.max(1, charsPerLine));
      }

      const truncated = lineCount > clamp;
      setOverflow(truncated);
      onMeasure?.({ lineCount, truncated });
    });

    return () => {
      cancelled = true;
    };
  }, [text, width, clamp, onMeasure]);

  const showButton = expandable && overflow && clamp;
  const isClamped = clamp && !expanded;
  const words = text.split(' ');

  return (
    <div
      ref={containerRef}
      className={cn('paragraph', className)}
      style={{ ...style }}
      data-slot="paragraph"
      data-revealed={revealed || undefined}
      data-word-animation={wordAnimation}
    >
      <p
        style={{
          margin: 0,
          display: isClamped ? '-webkit-box' : 'block',
          WebkitLineClamp: isClamped ? clamp : 'unset',
          WebkitBoxOrient: 'vertical',
          overflow: isClamped ? 'hidden' : 'visible',
          textOverflow: 'ellipsis',
          transition: 'max-height 200ms ease',
        }}
        data-slot="paragraph-text"
      >
        {words.map((word, i) => (
          <Fragment key={i}>
            <span
              className="pw-word"
              style={{ animationDelay: `${i * 25}ms` }}
            >
              {word}
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </p>

      {showButton && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          style={{
            marginTop: '0.25rem',
            background: 'none',
            border: 'none',
            padding: 0,
            color: 'var(--accent, currentColor)',
            font: 'inherit',
            fontWeight: 500,
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
          }}
          data-slot="paragraph-toggle"
        >
          {expanded ? collapseLabel : expandLabel}
        </button>
      )}
    </div>
  );
}

Paragraph.displayName = 'Paragraph';
