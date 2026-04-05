import {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useImperativeHandle,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function splitText(text: string, splitBy: string): string[] {
  if (splitBy === 'characters') {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      return [...new Intl.Segmenter().segment(text)].map((s) => s.segment);
    }
    return text.split('');
  }
  if (splitBy === 'words') return text.split(/(\s+)/);
  if (splitBy === 'lines') return text.split('\n');
  return text.split(splitBy);
}

function getStaggerDelay(
  index: number,
  total: number,
  staggerFrom: 'first' | 'last' | 'center' | 'random' | number,
  staggerDuration: number
): number {
  if (staggerFrom === 'first') return index * staggerDuration;
  if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration;
  if (staggerFrom === 'center') {
    const center = (total - 1) / 2;
    return Math.abs(index - center) * staggerDuration;
  }
  if (staggerFrom === 'random') return Math.random() * total * staggerDuration;
  return Math.abs(index - staggerFrom) * staggerDuration;
}

export interface TextRotateRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

export interface TextRotateProps {
  texts: string[];
  rotationInterval?: number;
  initial?: object;
  animate?: object;
  exit?: object;
  transition?: object;
  staggerDuration?: number;
  staggerFrom?: 'first' | 'last' | 'center' | 'random' | number;
  splitBy?: 'characters' | 'words' | 'lines' | string;
  loop?: boolean;
  auto?: boolean;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
  mainStyle?: React.CSSProperties;
  splitLevelStyle?: React.CSSProperties;
  elementLevelStyle?: React.CSSProperties;
}

export const TextRotate = forwardRef<TextRotateRef, TextRotateProps>(
  (
    {
      texts,
      rotationInterval = 2000,
      initial = { y: '100%', opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: '-120%', opacity: 0 },
      transition,
      staggerDuration = 0.03,
      staggerFrom = 'first',
      splitBy = 'characters',
      loop = true,
      auto = true,
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      mainStyle,
      splitLevelStyle,
      elementLevelStyle,
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const advance = useCallback(
      (direction: 1 | -1) => {
        setCurrentIndex((prev) => {
          let next = prev + direction;
          if (loop) {
            next = ((next % texts.length) + texts.length) % texts.length;
          } else {
            next = Math.max(0, Math.min(texts.length - 1, next));
          }
          onNext?.(next);
          return next;
        });
      },
      [texts.length, loop, onNext]
    );

    useImperativeHandle(ref, () => ({
      next: () => advance(1),
      previous: () => advance(-1),
      jumpTo: (index: number) => {
        setCurrentIndex(Math.max(0, Math.min(texts.length - 1, index)));
      },
      reset: () => setCurrentIndex(0),
    }));

    useEffect(() => {
      if (!auto) return;
      const id = setInterval(() => advance(1), rotationInterval);
      return () => clearInterval(id);
    }, [auto, rotationInterval, advance]);

    const currentText = texts[currentIndex];
    const elements = useMemo(
      () => splitText(currentText, splitBy),
      [currentText, splitBy]
    );

    const defaultTransition = {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    };

    return (
      <div
        className={mainClassName}
        style={{
          position: 'relative',
          display: 'inline-flex',
          overflow: 'hidden',
          verticalAlign: 'bottom',
          ...mainStyle,
        }}
      >
        {/* Invisible spacer: all texts overlap in one grid cell → width = widest, height = 1 line */}
        <span
          style={{
            display: 'inline-grid',
            visibility: 'hidden',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          {texts.map((t) => (
            <span
              key={t}
              style={{
                gridArea: '1 / 1',
                whiteSpace: 'pre',
                ...elementLevelStyle,
              }}
            >
              {t}
            </span>
          ))}
        </span>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              display: 'inline-flex',
              flexWrap: 'wrap',
              ...splitLevelStyle,
            }}
            className={splitLevelClassName}
          >
            {elements.map((el, i) => (
              <motion.span
                key={`${currentIndex}-${i}`}
                initial={initial}
                animate={animate}
                exit={exit}
                transition={{
                  ...(transition ?? defaultTransition),
                  delay: getStaggerDelay(
                    i,
                    elements.length,
                    staggerFrom,
                    staggerDuration
                  ),
                }}
                className={elementLevelClassName}
                style={{
                  display: 'inline-block',
                  whiteSpace: 'pre',
                  ...elementLevelStyle,
                }}
              >
                {el}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }
);

TextRotate.displayName = 'TextRotate';
