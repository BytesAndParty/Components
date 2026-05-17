import { useState, useRef, useEffect, ReactNode, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useComponentMessages } from '../i18n';
import { MESSAGES, type TooltipMessages } from './messages';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  messages?: Partial<TooltipMessages>;
}

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 0.2,
  className,
  messages,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  const m = useComponentMessages(MESSAGES, messages);

  const show = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay * 1000);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const animationVariants = {
    top: { opacity: 0, y: 4, x: '-50%', scale: 0.95 },
    bottom: { opacity: 0, y: -4, x: '-50%', scale: 0.95 },
    left: { opacity: 0, x: 4, y: '-50%', scale: 0.95 },
    right: { opacity: 0, x: -4, y: '-50%', scale: 0.95 },
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      aria-describedby={isVisible ? id : undefined}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            id={id}
            role="tooltip"
            aria-label={m.ariaLabel}
            initial={animationVariants[position]}
            animate={{ opacity: 1, y: position === 'top' || position === 'bottom' ? 0 : '-50%', x: position === 'left' || position === 'right' ? 0 : '-50%', scale: 1 }}
            exit={animationVariants[position]}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              "absolute z-[100] px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap pointer-events-none",
              "bg-[var(--card,#141416)] border border-[var(--border,#2a2a2e)] text-[var(--foreground,#e4e4e7)] shadow-xl",
              positionClasses[position],
              className
            )}
            >
            {content}
            {/* Arrow */}
            <div 
              className={cn(
                "absolute w-2 h-2 rotate-45 bg-[var(--card,#141416)] border-[var(--border,#2a2a2e)]",
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
