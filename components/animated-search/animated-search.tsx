import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface AnimatedSearchProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  expandedWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedSearch({
  placeholder = 'Search...',
  onSearch,
  onChange,
  expandedWidth = 280,
  className,
  style,
}: AnimatedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const iconSize = 42;
  const hasContent = value.length > 0;

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setValue('');
    onChange?.('');
  }, [onChange]);

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
        open();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, open]);

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
      className={className}
      style={{
        position: 'relative',
        height: iconSize,
        display: 'inline-flex',
        alignItems: 'center',
        ...style,
      }}
      animate={{ width: isOpen ? expandedWidth : iconSize }}
      transition={{ type: 'spring', damping: 22, stiffness: 170 }}
    >
      {/* Background pill */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: iconSize / 2,
          border: '2.5px solid var(--border)',
          background: 'var(--card)',
          cursor: isOpen ? 'default' : 'pointer',
        }}
        animate={{
          borderColor: isOpen ? 'var(--accent)' : 'var(--border)',
        }}
        transition={{ duration: 0.3 }}
        onClick={!isOpen ? open : undefined}
      />

      {/* Border pulse overlay — visible while typing */}
      {hasContent && isOpen && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: iconSize / 2,
            pointerEvents: 'none',
            animation: 'as-border-pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Search icon button */}
      <motion.button
        type="button"
        onClick={isOpen ? () => { if (value.trim()) onSearch?.(value.trim()); else close(); } : open}
        style={{
          position: 'relative',
          zIndex: 1,
          width: iconSize,
          height: iconSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          color: hasContent && isOpen ? 'var(--accent)' : 'var(--foreground)',
          transition: 'color 0.25s ease',
          flexShrink: 0,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Submit search' : 'Open search'}
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
            style={{
              position: 'relative',
              zIndex: 1,
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--foreground)',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                caretColor: 'var(--accent)',
              }}
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
            style={{
              position: 'relative',
              zIndex: 1,
              width: iconSize,
              height: iconSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: 'var(--muted-foreground)',
              flexShrink: 0,
            }}
            whileHover={{ scale: 1.1, color: 'var(--foreground)' }}
            whileTap={{ scale: 0.95 }}
            aria-label="Close search"
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
