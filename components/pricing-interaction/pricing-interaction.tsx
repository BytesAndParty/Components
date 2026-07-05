import NumberFlow from '@number-flow/react';
import React from 'react';
import { useComponentMessages } from '../i18n';
import { MESSAGES, type PricingInteractionMessages } from './messages';

export interface PricingOption {
  label: string;
  description?: string;
  price: number;
  badge?: string;
}

export interface PricingInteractionProps {
  options: PricingOption[];
  /** Labels for the period toggle. Falls back to i18n defaults. */
  periodLabels?: [string, string];
  /** Multiplier applied to prices when second period is selected. Default: 0.8 */
  periodMultiplier?: number;
  /** Currency symbol. Default: '$' */
  currency?: string;
  /** Price suffix override. Falls back to i18n default. */
  priceSuffix?: string;
  /** CTA button text override. Falls back to i18n default. */
  ctaLabel?: string;
  /** Initial selected index. Default: 0 */
  defaultIndex?: number;
  onSelect?: (index: number, period: number) => void;
  /** Called when the CTA button is clicked. */
  onCta?: (index: number, period: number) => void;
  /** i18n overrides for period/cta/region labels. */
  messages?: Partial<PricingInteractionMessages>;
  style?: React.CSSProperties;
}

export function PricingInteraction({
  options,
  periodLabels,
  periodMultiplier = 0.8,
  currency = '$',
  priceSuffix: _priceSuffix,
  ctaLabel: _ctaLabel,
  defaultIndex = 0,
  onSelect,
  onCta,
  messages,
  style,
}: PricingInteractionProps) {
  const m = useComponentMessages(MESSAGES, messages);
  const labels: [string, string] = periodLabels ?? [m.monthly, m.yearly];
  const priceSuffix = _priceSuffix ?? m.priceSuffix;
  const ctaLabel = _ctaLabel ?? m.cta;

  const [active, setActive] = React.useState(defaultIndex);
  const [period, setPeriod] = React.useState(0);
  const radioRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const groupRef = React.useRef<HTMLDivElement>(null);
  // The selection highlight is measured from the active row's real geometry so
  // it stays aligned no matter how tall an option gets (badge, description,
  // wrapping). A fixed row height clipped multi-line options and detached the
  // highlight from the rows — hence measured top/height instead of a constant.
  const [highlight, setHighlight] = React.useState({ top: 0, height: 0 });

  const handleChangePlan = (index: number) => {
    setActive(index);
    onSelect?.(index, period);
  };

  const handleChangePeriod = (index: number) => {
    setPeriod(index);
    onSelect?.(active, index);
  };

  const handleRadioKey = (e: React.KeyboardEvent<HTMLDivElement>, idx: number) => {
    const last = options.length - 1;
    let next: number;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      next = idx === last ? 0 : idx + 1;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      next = idx === 0 ? last : idx - 1;
    } else if (e.key === 'Home') {
      next = 0;
    } else if (e.key === 'End') {
      next = last;
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleChangePlan(idx);
      return;
    } else {
      return;
    }
    e.preventDefault();
    handleChangePlan(next);
    radioRefs.current[next]?.focus();
  };

  const getPrice = (basePrice: number) =>
    period === 1 ? Math.round(basePrice * periodMultiplier * 100) / 100 : basePrice;

  const gap = 12;

  // Track the active row's real position/size and keep the highlight glued to
  // it across content changes, wrapping and viewport resizes.
  React.useLayoutEffect(() => {
    const measure = () => {
      const el = radioRefs.current[active];
      if (el) setHighlight({ top: el.offsetTop, height: el.offsetHeight });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    if (groupRef.current) ro.observe(groupRef.current);
    radioRefs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [active, options, period]);

  return (
    <div
      role="region"
      aria-label={m.plansLabel}
      style={{
        border: '2px solid var(--border)',
        borderRadius: '1.5rem',
        padding: '0.75rem',
        maxWidth: '22rem',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'var(--card)',
        ...style,
      }}
    >
      {/* Period Toggle */}
      <div
        role="group"
        aria-label={m.periodLabel}
        style={{
          borderRadius: '9999px',
          position: 'relative',
          width: '100%',
          background: 'rgba(255,255,255,0.05)',
          padding: '0.35rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => handleChangePeriod(i)}
            aria-pressed={period === i}
            style={{
              fontWeight: 600,
              borderRadius: '9999px',
              width: '100%',
              padding: '0.4rem',
              fontSize: '0.8125rem',
              color: 'var(--foreground)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {label}
          </button>
        ))}
        <div
          aria-hidden
          style={{
            padding: '0.35rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            inset: 0,
            width: '50%',
            zIndex: 1,
            transform: `translateX(${period * 100}%)`,
            transition: 'transform 0.3s',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '9999px',
              width: '100%',
              height: '100%',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
          />
        </div>
      </div>

      {/* Options as a radiogroup */}
      <div
        ref={groupRef}
        role="radiogroup"
        aria-label={m.plansLabel}
        style={{
          width: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: `${gap}px`,
        }}
      >
        {options.map((option, i) => {
          const isActive = active === i;
          return (
            <div
              key={option.label}
              ref={(el) => { radioRefs.current[i] = el; }}
              role="radio"
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleChangePlan(i)}
              onKeyDown={(e) => handleRadioKey(e, i)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                border: '2px solid var(--border)',
                padding: '1rem',
                borderRadius: '1rem',
                minHeight: '76px',
                boxSizing: 'border-box',
              }}
            >
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: 'var(--foreground)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {option.label}
                  {option.badge && (
                    <span
                      style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '0.4rem',
                        background: 'color-mix(in srgb, var(--accent) 15%, transparent)',
                        color: 'var(--accent)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}
                    >
                      {option.badge}
                    </span>
                  )}
                </p>
                {option.description && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.15rem' }}>
                    {option.description}
                  </p>
                )}
                <p
                  style={{
                    color: 'var(--muted-foreground)',
                    fontSize: '0.8125rem',
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '0.15rem',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--foreground)',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    {currency}&nbsp;
                    <NumberFlow value={getPrice(option.price)} />
                  </span>
                  {priceSuffix}
                </p>
              </div>

              {/* Decorative radio dot (aria-checked on parent is the source of truth) */}
              <div
                aria-hidden
                style={{
                  border: '2px solid',
                  borderColor: isActive ? 'var(--accent)' : 'var(--muted-foreground)',
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '9999px',
                  padding: '0.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'border-color 0.3s',
                }}
              >
                <div
                  style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    background: 'var(--accent)',
                    borderRadius: '9999px',
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.3s',
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Selection highlight — measured from the active row so it tracks
            variable-height options instead of assuming a fixed row height. */}
        <div
          aria-hidden
          style={{
            width: '100%',
            height: `${highlight.height}px`,
            position: 'absolute',
            top: 0,
            border: '3px solid var(--accent)',
            borderRadius: '1rem',
            pointerEvents: 'none',
            transform: `translateY(${highlight.top}px)`,
            transition: 'transform 0.3s, height 0.3s',
          }}
        />
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => onCta?.(active, period)}
        style={{
          borderRadius: '9999px',
          background: 'var(--accent)',
          color: '#fff',
          fontSize: '0.9375rem',
          fontWeight: 600,
          width: '100%',
          padding: '0.75rem',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
