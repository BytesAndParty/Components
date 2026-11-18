import {
  useState,
  useRef,
  useEffect,
  useEffectEvent,
} from 'react';
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useComponentMessages } from '../i18n';
import { MESSAGES, type ToastMessages } from './messages';
import {
  ToastContext,
  toastBridge,
  type ToastData,
  type ToastVariant,
  type Placement,
} from './toast-context';

/* ---------- Provider ---------- */

interface ToastProviderProps {
  children: React.ReactNode;
  placement?: Placement;
  maxVisible?: number;
  messages?: Partial<ToastMessages>;
  /** Classes for the fixed toast container (layout, offsets, z-index). */
  className?: string;
  /** Classes for every toast card (background, border, radius, width, shadow). */
  toastClassName?: string;
}

export function ToastProvider({
  children,
  placement = 'bottom-right',
  maxVisible = 4,
  messages,
  className,
  toastClassName,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const counter = useRef(0);
  const m = useComponentMessages(MESSAGES, messages);

  const add = (opts: Omit<ToastData, 'id'>) => {
    const id = `toast-${++counter.current}`;
    setToasts((prev: ToastData[]) => [...prev, { ...opts, id, duration: opts.duration ?? 4000 }]);
    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prev: ToastData[]) => prev.filter((t) => t.id !== id));
  };

  // Expose global `toast()`
  useEffect(() => {
    toastBridge.add = (opts: Omit<ToastData, 'id'>) => {
      const id = `toast-${++counter.current}`;
      setToasts((prev: ToastData[]) => [...prev, { ...opts, id, duration: opts.duration ?? 4000 }]);
      return id;
    };
    return () => { toastBridge.add = null; };
  }, []);

  const isTop = placement.startsWith('top');
  const isCenter = placement.endsWith('center');

  const visible = toasts.slice(-maxVisible);

  return (
    <ToastContext.Provider value={{ toasts, add, dismiss }}>
      {children}
      {/* Always mounted so screen readers pick up toasts added later. No role="status":
          it implies aria-atomic="true" and would re-read every visible toast. */}
      <div
        aria-live="polite"
        className={cn(
          'pointer-events-none fixed z-9999 flex gap-2 p-4',
          isTop ? 'top-0 flex-col' : 'bottom-0 flex-col-reverse',
          isCenter ? 'left-1/2 -translate-x-1/2' : 'right-0',
          className,
        )}
      >
        <AnimatePresence>
          {visible.map((t) => (
            <ToastItem
              key={t.id}
              data={t}
              placement={placement}
              messages={m}
              className={toastClassName}
              onDismiss={dismiss}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/* ---------- Single Toast ---------- */

const variantBg: Record<ToastVariant, string> = {
  default: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
};

interface ToastItemProps {
  data: ToastData;
  placement: Placement;
  messages: ToastMessages;
  className?: string;
  onDismiss: (id: string) => void;
}

function ToastItem({ data, placement, messages, className, onDismiss }: ToastItemProps) {
  const { id, title, description, variant = 'default', duration = 4000 } = data;
  const progressRef = useRef<HTMLDivElement>(null);
  // Read inside the rAF loop, so hover/focus changes never restart the effect.
  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  const elapsedRef = useRef(0);
  const reduceMotion = useReducedMotion();
  // Effect event: a new `onDismiss` identity (provider re-render) must not restart the timer.
  const dismissSelf = useEffectEvent(() => onDismiss(id));

  const isTop = placement.startsWith('top');
  const isCenter = placement.endsWith('center');
  const yMul = isTop ? -1 : 1;

  // Progress bar via rAF. Only unpaused frames add to the elapsed time, so the
  // remaining time continues exactly where it stopped.
  useEffect(() => {
    let last: number | null = null;
    let rafId: number;

    const tick = (now: number) => {
      if (last !== null && !hoverRef.current && !focusRef.current) {
        elapsedRef.current += now - last;
      }
      last = now;

      const pct = Math.min((elapsedRef.current / duration) * 100, 100);

      if (progressRef.current) {
        progressRef.current.style.width = `${pct}%`;
      }

      if (pct >= 100) {
        dismissSelf();
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [duration]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (isCenter) {
      if (Math.abs(info.offset.y) > 20) onDismiss(id);
    } else {
      if (info.offset.x > 100) onDismiss(id);
    }
  };

  return (
    <motion.div
      layout={!reduceMotion}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 40 * yMul, scale: 1 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{ opacity: 0, y: reduceMotion ? 0 : 20 * yMul, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      drag={isCenter ? 'y' : 'x'}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={isCenter ? { top: 0.6, bottom: 0.6, left: 0, right: 0 } : { left: 0, right: 1, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      onHoverStart={() => { hoverRef.current = true; }}
      onHoverEnd={() => { hoverRef.current = false; }}
      onFocus={() => { focusRef.current = true; }}
      onBlur={() => { focusRef.current = false; }}
      className={cn(
        'group border-border bg-card pointer-events-auto relative w-[min(22rem,calc(100vw-2rem))] cursor-grab overflow-hidden rounded-lg border shadow-[0_8px_24px_oklch(0_0_0/0.3)]',
        className,
      )}
    >
      {/* Progress bar */}
      <div className="bg-foreground/5 absolute bottom-0 left-0 h-0.75 w-full">
        <div ref={progressRef} className={cn('h-full w-0 opacity-50', variantBg[variant])} />
      </div>

      {/* Content */}
      <div className="py-3.5 pr-11 pl-4">
        {/* Variant indicator dot */}
        <div className="flex items-center gap-2">
          <span className={cn('size-2 shrink-0 rounded-full', variantBg[variant])} />
          <span className="text-foreground text-[0.8125rem] font-semibold">
            {title}
          </span>
        </div>
        {description && (
          <p className="text-muted-foreground mt-1 ml-4 text-[0.8125rem]">
            {description}
          </p>
        )}
      </div>

      {/* Close button: 44px hit area, small visual square inside. Hidden until hover only
          on fine pointers; always visible on touch, shown on keyboard focus. */}
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label={messages.dismiss}
        className="group/close text-muted-foreground absolute top-0 right-0 flex size-11 cursor-pointer items-center justify-center transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none pointer-fine:opacity-0"
      >
        <span className="group-hover/close:bg-foreground/8 group-focus-visible/close:ring-accent/60 group-focus-visible/close:ring-offset-card flex size-6 items-center justify-center rounded-sm transition-colors duration-150 group-focus-visible/close:ring-2 group-focus-visible/close:ring-offset-2">
          <X className="size-3.5" />
        </span>
      </button>
    </motion.div>
  );
}
