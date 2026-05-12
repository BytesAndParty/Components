import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MagneticButton } from '../magnetic-button/magnetic-button';
import { useDesignEngineHotkey } from '../hotkeys/hotkeys-provider';
import { cn } from '../lib/utils';
import { useComponentMessages } from '../i18n';
import { MESSAGES, type BackToTopMessages } from './messages';

interface BackToTopProps {
  threshold?: number;
  className?: string;
  messages?: Partial<BackToTopMessages>;
}

export function BackToTop({
  threshold = 400,
  className,
  messages,
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const m = useComponentMessages(MESSAGES, messages);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Register Shortcut with Design Engine
  useDesignEngineHotkey('Mod+ArrowUp', (e) => {
    if (isVisible) {
      e.preventDefault();
      scrollToTop();
    }
  }, {
    label: m.shortcutLabel,
    description: m.shortcutDescription,
    category: 'Navigation'
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className={cn("fixed bottom-8 right-8 z-[90]", className)}
        >
          <MagneticButton
            onClick={scrollToTop}
            variant="default"
            className="w-12 h-12 flex items-center justify-center !p-0 rounded-full shadow-2xl"
            aria-label={m.ariaLabel}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </MagneticButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
