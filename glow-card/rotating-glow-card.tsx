interface RotatingGlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Animation duration in seconds. Default: 3 */
  duration?: number;
  /** Border width in px. Default: 2 */
  borderWidth?: number;
  /** Primary gradient color. Default: rgb(var(--theme-primary)) */
  primaryColor?: string;
  /** Secondary gradient color. Default: rgb(var(--theme-accent)) */
  accentColor?: string;
}

const spinnerBase: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '200%',
  height: '200%',
  translate: '-50% -50%',
};

/**
 * A card with an animated rotating glow border effect.
 */
export function RotatingGlowCard({
  children,
  className,
  duration = 3,
  borderWidth = 2,
  primaryColor = 'rgb(var(--theme-primary))',
  accentColor = 'rgb(var(--theme-accent))',
  style,
  ...props
}: RotatingGlowCardProps) {
  const conicBg = `conic-gradient(from 0deg, ${primaryColor}, ${accentColor}, transparent 25%, transparent 50%, ${accentColor}, ${primaryColor})`;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        padding: `${borderWidth}px`,
        ...style,
      }}
      {...props}
    >
      {/* Rotating gradient */}
      <div
        style={{
          ...spinnerBase,
          zIndex: 1,
          background: conicBg,
          animation: `glow-spin ${duration}s linear infinite`,
        }}
        aria-hidden="true"
      />

      {/* Blurred glow */}
      <div
        style={{
          ...spinnerBase,
          zIndex: 0,
          background: conicBg,
          filter: 'blur(12px)',
          opacity: 0.4,
          animation: `glow-spin ${duration}s linear infinite`,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          background: 'var(--card)',
          borderRadius: `calc(0.75rem - ${borderWidth}px)`,
          padding: '1.5rem',
          height: '100%',
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
}
