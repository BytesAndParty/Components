import { useRef, useState, useCallback } from 'react';

const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number;
}

/**
 * A button component that magnetically follows the cursor on hover.
 */
export function MagneticButton({
  className,
  strength = 0.3,
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
        'relative before:absolute before:-inset-3 before:-z-10', // Expand hover area
        'motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out',
        'motion-reduce:transition-none',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
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
