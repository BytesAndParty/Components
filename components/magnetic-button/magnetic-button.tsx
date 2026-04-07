import { useRef, useState, useCallback } from 'react';

const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

type Variant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'cta';

const variantClasses: Record<Variant, string> = {
  default:     'bg-neutral-800 text-white hover:bg-neutral-700 px-4 py-2 rounded-md text-sm font-medium',
  primary:     'text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-85',
  secondary:   'px-4 py-2 rounded-md text-sm font-medium hover:opacity-85',
  outline:     'border px-4 py-2 rounded-md text-sm font-medium hover:opacity-70',
  ghost:       'text-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-200',
  destructive: 'bg-rose-600 text-white hover:bg-rose-500 px-4 py-2 rounded-md text-sm font-medium',
  cta:         'text-white px-6 py-3 rounded-lg text-base font-semibold hover:opacity-85',
};

function getVariantStyle(variant: Variant): React.CSSProperties {
  switch (variant) {
    case 'primary':
      return { backgroundColor: 'var(--accent)', color: 'white' };
    case 'secondary':
      return {
        backgroundColor: 'color-mix(in oklch, var(--accent) 15%, transparent)',
        color: 'var(--accent)',
      };
    case 'outline':
      return { borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'transparent' };
    case 'cta':
      return {
        backgroundColor: 'var(--accent)',
        color: 'white',
        boxShadow: '0 4px 20px color-mix(in oklch, var(--accent) 40%, transparent)',
      };
    default:
      return {};
  }
}

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number;
  variant?: Variant;
}

/**
 * A button component that magnetically follows the cursor on hover.
 */
export function MagneticButton({
  className,
  strength = 0.3,
  variant = 'default',
  onMouseMove,
  onMouseLeave,
  style,
  children,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;

    setPosition({ x: distanceX, y: distanceY });
    onMouseMove?.(e);
  }, [strength, onMouseMove]);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setPosition({ x: 0, y: 0 });
    onMouseLeave?.(e);
  }, [onMouseLeave]);

  return (
    <button
      ref={buttonRef}
      className={cn(
        'relative before:absolute before:-inset-3 before:-z-10',
        'motion-safe:transition-[transform,background-color,opacity] motion-safe:duration-200 motion-safe:ease-out',
        'motion-reduce:transition-none',
        variantClasses[variant],
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...getVariantStyle(variant),
        ...style,
        transform: `translate(${position.x}px, ${position.y}px)`,
        willChange: 'transform',
      }}
      {...props}
    >
      {children}
    </button>
  );
}
