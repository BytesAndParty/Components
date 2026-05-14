import { motion, useScroll, useTransform } from 'motion/react';

interface ScrollRotateProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function ScrollRotate({ children, className = '', speed = 1 }: ScrollRotateProps) {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360 * speed]);

  return (
    <motion.div
      className={className}
      style={{ rotate }}
    >
      {children}
    </motion.div>
  );
}

interface RotatingDecorationProps {
  className?: string;
}

export function RotatingDecoration({ className = '' }: RotatingDecorationProps) {
  return (
    <ScrollRotate className={className} speed={2}>
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="text-primary opacity-25"
      >
        <circle
          cx="60"
          cy="60"
          r="55"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="8 4"
        />
        <circle
          cx="60"
          cy="60"
          r="40"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        <circle
          cx="60"
          cy="60"
          r="25"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line x1="60" y1="5" x2="60" y2="35" stroke="currentColor" strokeWidth="1" />
        <line x1="60" y1="85" x2="60" y2="115" stroke="currentColor" strokeWidth="1" />
        <line x1="5" y1="60" x2="35" y2="60" stroke="currentColor" strokeWidth="1" />
        <line x1="85" y1="60" x2="115" y2="60" stroke="currentColor" strokeWidth="1" />
        <line x1="18" y1="18" x2="38" y2="38" stroke="currentColor" strokeWidth="1" />
        <line x1="82" y1="82" x2="102" y2="102" stroke="currentColor" strokeWidth="1" />
        <line x1="102" y1="18" x2="82" y2="38" stroke="currentColor" strokeWidth="1" />
        <line x1="18" y1="102" x2="38" y2="82" stroke="currentColor" strokeWidth="1" />
        <circle cx="60" cy="60" r="4" fill="currentColor" />
      </svg>
    </ScrollRotate>
  );
}
