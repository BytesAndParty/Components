import { useId, useState } from 'react';

const FILTER_STD_DEVIATION = 6;
const GOO_MATRIX = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7';

type Size = 'sm' | 'md' | 'lg';

const sizes: Record<Size, { padding: string; fontSize: string; radius: string }> = {
  sm: { padding: '0.6em 1.6em', fontSize: '0.8125rem', radius: '1em' },
  md: { padding: '0.85em 2.2em', fontSize: '0.9375rem', radius: '1.2em' },
  lg: { padding: '1em 2.6em', fontSize: '1rem', radius: '1.4em' },
};

export interface JellyButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  size?: Size;
  color?: string;
}

export function JellyButton({
  children,
  size = 'md',
  color = 'var(--accent)',
  // Default to "button" to avoid implicit form submission. Consumers can opt in to submit.
  type = 'button',
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onFocus,
  onBlur,
  disabled,
  ...rest
}: JellyButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const filterId = `jelly-goo-${useId().replace(/:/g, '')}`;

  const s = sizes[size];
  const shadow = `color-mix(in oklch, ${color} 35%, transparent)`;
  // Focus ring stacks on top of the press shadow so it stays visible
  const focusRing = focusVisible
    ? `, 0 0 0 3px var(--background, #fff), 0 0 0 5px var(--accent)`
    : '';

  const buttonTransform = pressed
    ? 'scaleX(0.94) scaleY(1.06)'
    : hovered
      ? 'scaleX(1.06) scaleY(0.94)'
      : 'none';

  const textTransform = pressed
    ? 'scaleX(1.06) scaleY(0.94)'
    : hovered
      ? 'scaleX(0.94) scaleY(1.06)'
      : 'none';

  const blobBase: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    borderRadius: '50%',
    background: color,
    zIndex: -1,
    transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
  };

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        setPressed(false);
        onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        if (!disabled) setPressed(true);
        onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        setPressed(false);
        onMouseUp?.(e);
      }}
      onFocus={(e) => {
        setFocusVisible(e.target.matches(':focus-visible'));
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocusVisible(false);
        onBlur?.(e);
      }}
      style={{
        position: 'relative',
        padding: s.padding,
        border: 'none',
        borderRadius: s.radius,
        background: hovered && !pressed
          ? `color-mix(in oklch, ${color} 85%, white)`
          : color,
        color: 'white',
        fontFamily: 'inherit',
        fontSize: s.fontSize,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        overflow: 'visible',
        filter: `url(#${filterId})`,
        transform: buttonTransform,
        transition: pressed
          ? 'transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.1s ease, background 0.2s ease'
          : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, background 0.3s ease',
        boxShadow: pressed
          ? `0 0.15em 0.5em ${shadow}${focusRing}`
          : hovered
            ? `0 0.3em 1.2em ${shadow}${focusRing}`
            : `0 0.2em 0.8em ${shadow}${focusRing}`,
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >
      {/* Text */}
      <span
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'block',
          transform: textTransform,
          transition: pressed
            ? 'transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {children}
      </span>

      {/* Blobs — escape the button on hover, get sucked into the goo filter */}
      <span
        aria-hidden
        style={{
          ...blobBase,
          width: '1.6em',
          height: '1.6em',
          transform:
            hovered && !pressed
              ? 'translate(-160%, -120%) scale(1)'
              : 'translate(-50%, -50%) scale(0)',
          transitionDuration: pressed ? '0.15s' : '0.5s',
        }}
      />
      <span
        aria-hidden
        style={{
          ...blobBase,
          width: '1.2em',
          height: '1.2em',
          transform:
            hovered && !pressed
              ? 'translate(120%, -100%) scale(1)'
              : 'translate(-50%, -50%) scale(0)',
          transitionDelay: hovered && !pressed ? '0.05s' : '0s',
          transitionDuration: pressed ? '0.15s' : '0.5s',
        }}
      />
      <span
        aria-hidden
        style={{
          ...blobBase,
          width: '0.9em',
          height: '0.9em',
          transform:
            hovered && !pressed
              ? 'translate(-80%, 130%) scale(1)'
              : 'translate(-50%, -50%) scale(0)',
          transitionDelay: hovered && !pressed ? '0.1s' : '0s',
          transitionDuration: pressed ? '0.15s' : '0.5s',
        }}
      />

      {/* Glass gloss */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '0.1em',
          left: '10%',
          right: '10%',
          height: '40%',
          borderRadius: '1em 1em 50% 50%',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 100%)',
          pointerEvents: 'none',
          opacity: pressed ? 0.3 : hovered ? 0.7 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* SVG goo filter — scoped by id per instance */}
      <svg
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={FILTER_STD_DEVIATION} result="blur" />
            <feColorMatrix in="blur" mode="matrix" values={GOO_MATRIX} result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </button>
  );
}
