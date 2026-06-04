import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useComponentMessages } from '../i18n';
import { MESSAGES, type AnimatedSearchMessages } from './messages';

const STYLE_ID = 'animated-search-styles';
function injectStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes as-border-pulse {
      0%, 100% { box-shadow: 0 0 0 0px color-mix(in oklch, var(--accent) 0%, transparent); }
      50%       { box-shadow: 0 0 0 4px color-mix(in oklch, var(--accent) 20%, transparent); }
    }
  `;
  document.head.appendChild(s);
}
injectStyles();

export interface AnimatedSearchProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  expandedWidth?: number;
  messages?: Partial<AnimatedSearchMessages>;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedSearch({
  placeholder: _placeholder,
  onSearch,
  onChange,
  expandedWidth = 280,
  messages,
  className,
  style,
}: AnimatedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const m = useComponentMessages(MESSAGES, messages);
  const placeholder = _placeholder ?? m.placeholder;

  const iconSize = 42;
  const hasContent = value.length > 0;

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setValue('');
    onChange?.('');
  }

  useEffect(() => {
    if (isOpen) {
      // Small delay to let the animation start before focusing
      const id = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  // Keyboard shortcut: / or ⌘K opens the search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;
      if ((e.key === '/' || (e.metaKey && e.key === 'k')) && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onSearch?.(value.trim());
    }
    if (e.key === 'Escape') {
      close();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <motion.div
      className={cn("relative inline-flex items-center h-10.5", className)}
      style={{ ...style }}
      animate={{ width: isOpen ? expandedWidth : iconSize }}
      transition={{ type: 'spring', damping: 22, stiffness: 170 }}
    >
      {/* Background pill */}
      <motion.div
        className={cn(
          "absolute inset-0 border-[2.5px] bg-card transition-colors duration-300",
          isOpen ? "border-accent cursor-default" : "border-border cursor-pointer"
        )}
        style={{ borderRadius: iconSize / 2 }}
        animate={{
          borderColor: isOpen ? 'var(--accent)' : 'var(--border)',
        }}
        transition={{ duration: 0.3 }}
        onClick={!isOpen ? open : undefined}
      />

      {/* Border pulse overlay — visible while typing */}
      {hasContent && isOpen && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: iconSize / 2,
            animation: 'as-border-pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Search icon button */}
      <motion.button
        type="button"
        onClick={isOpen ? () => { if (value.trim()) onSearch?.(value.trim()); else close(); } : open}
        className={cn(
          "relative z-10 w-10.5 h-10.5 flex items-center justify-center bg-transparent border-none cursor-pointer p-0 shrink-0 transition-colors duration-250",
          hasContent && isOpen ? "text-accent" : "text-foreground"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? m.submitLabel : m.openLabel}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
      </motion.button>

      {/* Input field */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: expandedWidth - iconSize - iconSize }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 170 }}
            className="relative z-10 flex h-full items-center overflow-hidden"
          >
            <input
              ref={inputRef}
              type="search"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              aria-label={m.placeholder}
              className="font-inherit h-full w-full border-none bg-transparent text-sm text-foreground caret-accent outline-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close button */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
            transition={{ type: 'spring', damping: 18, stiffness: 170 }}
            onClick={close}
            className="relative z-10 flex h-10.5 w-10.5 shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-muted-foreground"
            whileHover={{ scale: 1.1, color: 'var(--foreground)' }}
            whileTap={{ scale: 0.95 }}
            aria-label={m.closeLabel}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
