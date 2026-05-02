import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MagneticButton } from '../magnetic-button/magnetic-button';
import { useDesignEngineHotkey } from '../hotkeys/hotkeys-provider';
import { cn } from '../lib/utils';

interface BackToTopProps {
  threshold?: number;
  className?: string;
  labels?: {
    shortcutLabel?: string;
    description?: string;
  };
}

export function BackToTop({ 
  threshold = 400, 
  className,
  labels = {}
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  const {
    shortcutLabel = "Nach oben",
    description = "Scrollt sanft zum Seitenanfang"
  } = labels;

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
    label: shortcutLabel,
    description,
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
            aria-label="Nach oben scrollen"
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
