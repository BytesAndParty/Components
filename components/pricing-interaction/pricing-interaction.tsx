import NumberFlow from '@number-flow/react';
import React from 'react';

export interface PricingOption {
  label: string;
  description?: string;
  price: number;
  badge?: string;
}

export interface PricingInteractionProps {
  options: PricingOption[];
  /** Labels for the period toggle. Default: ['Monthly', 'Yearly'] */
  periodLabels?: [string, string];
  /** Multiplier applied to prices when second period is selected. Default: 0.8 */
  periodMultiplier?: number;
  /** Currency symbol. Default: '$' */
  currency?: string;
  /** Price suffix. Default: '/month' */
  priceSuffix?: string;
  /** CTA button text. Default: 'Get Started' */
  ctaLabel?: string;
  /** Initial selected index. Default: 0 */
  defaultIndex?: number;
  onSelect?: (index: number, period: number) => void;
  style?: React.CSSProperties;
}

export function PricingInteraction({
  options,
  periodLabels = ['Monthly', 'Yearly'],
  periodMultiplier = 0.8,
  currency = '$',
  priceSuffix = '/month',
  ctaLabel = 'Get Started',
  defaultIndex = 0,
  onSelect,
  style,
}: PricingInteractionProps) {
  const [active, setActive] = React.useState(defaultIndex);
  const [period, setPeriod] = React.useState(0);

  const handleChangePlan = (index: number) => {
    setActive(index);
    onSelect?.(index, period);
  };

  const handleChangePeriod = (index: number) => {
    setPeriod(index);
    onSelect?.(active, index);
  };

  const getPrice = (basePrice: number) =>
    period === 1 ? Math.round(basePrice * periodMultiplier * 100) / 100 : basePrice;

  const optionHeight = 76;
  const gap = 12;

  return (
    <div
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
        {periodLabels.map((label, i) => (
          <button
            key={label}
            onClick={() => handleChangePeriod(i)}
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

      {/* Options */}
      <div
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
        {options.map((option, i) => (
          <div
            key={option.label}
            onClick={() => handleChangePlan(i)}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              border: '2px solid var(--border)',
              padding: '1rem',
              borderRadius: '1rem',
              height: `${optionHeight}px`,
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

            {/* Radio dot */}
            <div
              style={{
                border: '2px solid',
                borderColor: active === i ? 'var(--accent)' : 'var(--muted-foreground)',
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
                  opacity: active === i ? 1 : 0,
                  transition: 'opacity 0.3s',
                }}
              />
            </div>
          </div>
        ))}

        {/* Selection highlight */}
        <div
          style={{
            width: '100%',
            height: `${optionHeight}px`,
            position: 'absolute',
            top: 0,
            border: '3px solid var(--accent)',
            borderRadius: '1rem',
            pointerEvents: 'none',
            transform: `translateY(${active * optionHeight + gap * active}px)`,
            transition: 'transform 0.3s',
          }}
        />
      </div>

      {/* CTA */}
      <button
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
