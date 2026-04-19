import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(' ');

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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
  className,
  style,
  onMeasure,
}: ParagraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [overflow, setOverflow] = useState(false);
  const [expanded, setExpanded] = useState(false);

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
        // Fallback: einfacher Längen-Heuristik wenn pretext nicht verfügbar
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

  return (
    <div
      ref={containerRef}
      className={cn('paragraph', className)}
      style={{ ...style }}
      data-slot="paragraph"
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
        {text}
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
