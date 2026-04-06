import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface HeartFavoriteProps {
  /** Size of the heart icon in px. Default: 32 */
  size?: number;
  /** Initial liked state */
  defaultLiked?: boolean;
  /** Callback when toggled */
  onToggle?: (liked: boolean) => void;
  className?: string;
}

export function HeartFavorite({
  size = 32,
  defaultLiked = false,
  onToggle,
  className,
}: HeartFavoriteProps) {
  const [isLiked, setIsLiked] = useState(defaultLiked);

  const toggle = () => {
    const next = !isLiked;
    setIsLiked(next);
    onToggle?.(next);
  };

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.9 }}
      className={className}
      style={{
        background: 'transparent',
        border: 'none',
        borderRadius: '9999px',
        padding: '0.5rem',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}
    >
      <motion.div
        animate={{
          scale: isLiked ? [1, 1.3, 1] : 1,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
      >
        <Heart
          size={size}
          fill={isLiked ? '#ef4444' : 'none'}
          color={isLiked ? '#ef4444' : 'currentColor'}
          style={{ transition: 'fill 0.2s, color 0.2s' }}
        />
      </motion.div>
    </motion.button>
  );
}
