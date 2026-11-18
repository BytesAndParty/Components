import { useState, useRef, useEffect, type FocusEvent, type ReactNode, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 0.2,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();

  const show = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay * 1000);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  // The wrapper is not focusable, so the description goes to the element that
  // actually took focus (any depth, also inside components that do not forward
  // props). Opens without delay: the tooltip must exist when the screen reader
  // reads the newly focused element, a delayed one is not announced.
  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    const ids = e.target.getAttribute('aria-describedby');
    if (!ids?.split(' ').includes(id)) {
      e.target.setAttribute('aria-describedby', ids ? `${ids} ${id}` : id);
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    const rest = e.target
      .getAttribute('aria-describedby')
      ?.split(' ')
      .filter((describedBy) => describedBy !== id)
      .join(' ');
    if (rest) e.target.setAttribute('aria-describedby', rest);
    else e.target.removeAttribute('aria-describedby');
    hide();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 mb-2',
    bottom: 'top-full left-1/2 mt-2',
    left: 'right-full top-1/2 mr-2',
    right: 'left-full top-1/2 ml-2',
  };

  const origins = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };

  const animationVariants = {
    top: { opacity: 0, y: 4, x: '-50%', scale: 0.95 },
    bottom: { opacity: 0, y: -4, x: '-50%', scale: 0.95 },
    left: { opacity: 0, x: 4, y: '-50%', scale: 0.95 },
    right: { opacity: 0, x: -4, y: '-50%', scale: 0.95 },
  };

  const animateValues = {
    top: { opacity: 1, y: 0, x: '-50%', scale: 1 },
    bottom: { opacity: 1, y: 0, x: '-50%', scale: 1 },
    left: { opacity: 1, x: 0, y: '-50%', scale: 1 },
    right: { opacity: 1, x: 0, y: '-50%', scale: 1 },
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            id={id}
            role="tooltip"
            initial={animationVariants[position]}
            animate={animateValues[position]}
            exit={animationVariants[position]}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{ transformOrigin: origins[position] }}
            className={cn(
              "absolute z-100 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap pointer-events-none",
              "bg-(--card,#141416) border border-(--border,#2a2a2e) text-(--foreground,#e4e4e7) shadow-xl",
              "backdrop-blur-md",
              positionClasses[position],
              className
            )}
            >
            {content}
            {/* Arrow */}
            <div 
              className={cn(
                "absolute w-2 h-2 rotate-45 bg-(--card,#141416) border-(--border,#2a2a2e)",
                position === 'top' && "bottom-[-5px] left-1/2 -translate-x-1/2 border-r border-b",
                position === 'bottom' && "top-[-5px] left-1/2 -translate-x-1/2 border-l border-t",
                position === 'left' && "right-[-5px] top-1/2 -translate-y-1/2 border-r border-t",
                position === 'right' && "left-[-5px] top-1/2 -translate-y-1/2 border-l border-b",
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
