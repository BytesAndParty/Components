import { useEffect, useState, useRef } from 'react';
import { useInView } from 'motion/react';

const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
const defaultPlaceholder = '0';

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
  placeholder?: string;
  chars?: string;
}

function generatePlaceholder(text: string, placeholderChar: string = defaultPlaceholder): string {
  return text
    .split('')
    .map((char) => (char === ' ' ? ' ' : placeholderChar))
    .join('');
}

export function TextScramble({
  text,
  className = '',
  delay = 0,
  speed = 30,
  onComplete,
  placeholder = defaultPlaceholder,
  chars = defaultChars,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(() => generatePlaceholder(text, placeholder));
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const hasStarted = useRef(false);

  // Reset scramble state when the displayed text or its placeholder changes,
  // so the animation re-runs from scratch on prop swap.
  useEffect(() => {
    hasStarted.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsComplete(false);
    setDisplayText(generatePlaceholder(text, placeholder));
  }, [text, placeholder]);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;

    let intervalId: ReturnType<typeof setInterval> | undefined;

    const timeoutId = setTimeout(() => {
      let iteration = 0;
      const maxIterations = text.length;

      intervalId = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < iteration) return text[index];
              return chars[Math.floor(Math.random() * chars.length)] || text[index];
            })
            .join('')
        );

        if (iteration >= maxIterations) {
          if (intervalId) clearInterval(intervalId);
          setDisplayText(text);
          setIsComplete(true);
          onComplete?.();
        }

        iteration += 1 / 3;
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isInView, text, delay, speed, onComplete, chars]);

  return (
    <span
      ref={ref}
      className={className}
      aria-label={text}
      data-complete={isComplete}
    >
      <span aria-hidden>{displayText}</span>
    </span>
  );
}
