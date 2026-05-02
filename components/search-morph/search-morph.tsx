import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';

interface SearchMorphProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  expandedWidth?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function SearchMorph({
  placeholder = 'Search...',
  onSearch,
  onChange,
  expandedWidth = 280,
  strokeWidth = 2.5,
  className,
  style,
}: SearchMorphProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setValue('');
    onChange?.('');
  }, [onChange]);

  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => inputRef.current?.focus(), 700);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) onSearch?.(value.trim());
    if (e.key === 'Escape') close();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e.target.value);
  };

  const size = 28;
  const r = 8;
  const circumference = 2 * Math.PI * r;

  // Icon center (local coords within the g group)
  const cx = 12;
  const cy = 12;
  const xSize = 5; // half-size of X arms

  const spring = { type: 'spring' as const, damping: 16, stiffness: 90 };

  return (
    <motion.div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        height: size,
        color: 'currentColor',
        overflow: 'hidden',
        cursor: isOpen ? 'text' : 'pointer',
        ...style,
      }}
      animate={{ width: isOpen ? expandedWidth : size }}
      transition={spring}
      onClick={() => {
        if (!isOpen) setIsOpen(true);
        else inputRef.current?.focus();
      }}
      role={isOpen ? undefined : 'button'}
      tabIndex={isOpen ? undefined : 0}
      onKeyDown={(e) => {
        if (!isOpen && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          setIsOpen(true);
        }
      }}
      aria-label={isOpen ? undefined : 'Open search'}
    >
      <svg
        width={expandedWidth}
        height={size}
        viewBox={`0 0 ${expandedWidth} ${size}`}
        fill="none"
        style={{ position: 'absolute', left: 0, top: 0, pointerEvents: isOpen ? 'none' : undefined }}
      >
        {/* Underline - extends from right to left as circle unrolls */}
        <motion.line
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          y1={size - 1}
          y2={size - 1}
          initial={false}
          animate={
            isOpen
              ? { x1: 0, x2: expandedWidth, opacity: 1 }
              : { x1: cx, x2: cx, opacity: 0 }
          }
          transition={{
            ...spring,
            opacity: { duration: 0.15 },
          }}
        />

        {/* Icon group - slides from left to right */}
        <motion.g
          initial={false}
          animate={{ x: isOpen ? expandedWidth - size : 0 }}
          transition={spring}
        >
          {/* Magnifying glass circle - unrolls on open */}
          <motion.circle
            cx={cx}
            cy={cy}
            r={r}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={false}
            animate={{ strokeDashoffset: isOpen ? -circumference : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />

          {/* Handle → X arm 1 (same 45° angle, endpoints shift) */}
          <motion.line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={false}
            animate={
              isOpen
                ? { x1: cx - xSize, y1: cy - xSize, x2: cx + xSize, y2: cy + xSize }
                : { x1: 18, y1: 18, x2: 24, y2: 24 }
            }
            transition={spring}
          />

          {/* X arm 2 - appears when open */}
          <motion.line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={false}
            animate={
              isOpen
                ? { x1: cx + xSize, y1: cy - xSize, x2: cx - xSize, y2: cy + xSize, opacity: 1 }
                : { x1: cx, y1: cy, x2: cx, y2: cy, opacity: 0 }
            }
            transition={{
              ...spring,
              opacity: { duration: 0.15, delay: isOpen ? 0.35 : 0 },
            }}
          />
        </motion.g>
      </svg>

      {/* Blinking cursor (only when open + empty) */}
      {isOpen && !value && (
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            bottom: strokeWidth + 1,
            width: strokeWidth,
            height: 16,
            background: 'currentColor',
            borderRadius: strokeWidth / 2,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            times: [0, 0.05, 0.5, 0.55],
            delay: 0.7,
          }}
        />
      )}

      {/* Input field */}
      <motion.input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (!value) close();
        }}
        placeholder={placeholder}
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2, delay: isOpen ? 0.55 : 0 }}
        style={{
          position: 'absolute',
          left: 8,
          top: 0,
          width: expandedWidth - size - 8,
          height: size - strokeWidth - 4,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'currentColor',
          fontSize: '0.875rem',
          fontFamily: 'inherit',
          caretColor: 'transparent',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      {/* X click target */}
      {isOpen && (
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: size,
            height: size,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label="Close search"
        />
      )}
    </motion.div>
  );
}
