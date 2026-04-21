import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { X } from 'lucide-react';

/* ---------- Types ---------- */

type ToastVariant = 'default' | 'success' | 'warning' | 'danger';
type Placement = 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';

interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastData[];
  add: (t: Omit<ToastData, 'id'>) => string;
  dismiss: (id: string) => void;
}

/* ---------- Context ---------- */

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

/* Convenience function — requires ToastProvider to be mounted */
let globalAdd: ToastContextValue['add'] | null = null;

export function toast(opts: Omit<ToastData, 'id'>) {
  if (!globalAdd) throw new Error('toast() called before <ToastProvider> mounted');
  return globalAdd(opts);
}

/* ---------- Provider ---------- */

interface ToastProviderProps {
  children: React.ReactNode;
  placement?: Placement;
  maxVisible?: number;
}

export function ToastProvider({
  children,
  placement = 'bottom-right',
  maxVisible = 4,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const counter = useRef(0);

  const add = useCallback((opts: Omit<ToastData, 'id'>) => {
    const id = `toast-${++counter.current}`;
    setToasts((prev) => [...prev, { ...opts, id, duration: opts.duration ?? 4000 }]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Expose global `toast()`
  useEffect(() => {
    globalAdd = add;
    return () => { globalAdd = null; };
  }, [add]);

  const isTop = placement.startsWith('top');
  const isCenter = placement.endsWith('center');

  const visible = toasts.slice(-maxVisible);

  return (
    <ToastContext.Provider value={{ toasts, add, dismiss }}>
      {children}
      <div 
        className={`fixed z-[9999] flex flex-col pointer-events-none p-4 gap-2 
          ${isTop ? 'top-0 flex-col' : 'bottom-0 flex-col-reverse'} 
          ${isCenter ? 'left-1/2 -translate-x-1/2' : 'right-0'}`}
      >
        <AnimatePresence>
          {visible.map((t, i) => (
            <ToastItem
              key={t.id}
              data={t}
              index={i}
              total={visible.length}
              placement={placement}
              onDismiss={dismiss}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/* ---------- Single Toast ---------- */

const variantClasses: Record<ToastVariant, string> = {
  default: 'bg-accent',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
};

interface ToastItemProps {
  data: ToastData;
  index: number;
  total: number;
  placement: Placement;
  onDismiss: (id: string) => void;
}

function ToastItem({ data, index, total, placement, onDismiss }: ToastItemProps) {
  const { id, title, description, variant = 'default', duration = 4000 } = data;
  const progressRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const isTop = placement.startsWith('top');
  const isCenter = placement.endsWith('center');
  const yMul = isTop ? -1 : 1;

  // Progress bar via rAF
  useEffect(() => {
    let start: number | null = null;
    let pausedAt: number | null = null;
    let pausedTotal = 0;
    let rafId: number;

    const tick = (now: number) => {
      if (!start) start = now;

      if (hovered) {
        if (!pausedAt) pausedAt = now;
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (pausedAt) {
        pausedTotal += now - pausedAt;
        pausedAt = null;
      }

      const elapsed = now - start - pausedTotal;
      const pct = Math.min((elapsed / duration) * 100, 100);

      if (progressRef.current) {
        progressRef.current.style.width = `${pct}%`;
      }

      if (pct >= 100) {
        onDismiss(id);
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [duration, id, onDismiss, hovered]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (isCenter) {
      if (Math.abs(info.offset.y) > 20) onDismiss(id);
    } else {
      if (info.offset.x > 100) onDismiss(id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 * yMul, scale: 1 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{ opacity: 0, y: 20 * yMul, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      drag={isCenter ? 'y' : 'x'}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={isCenter ? { top: 0.6, bottom: 0.6, left: 0, right: 0 } : { left: 0, right: 1, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="pointer-events-auto relative w-[22rem] bg-card border border-border rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.3)] cursor-grab"
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-white/5">
        <div
          ref={progressRef}
          className={`h-full ${variantClasses[variant]} opacity-50 w-0`}
        />
      </div>

      {/* Content */}
      <div className="py-3.5 px-4 pr-10">
        {/* Variant indicator dot */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${variantClasses[variant]}`} />
          <span className="font-semibold text-[0.8125rem] text-foreground">
            {title}
          </span>
        </div>
        {description && (
          <p className="text-[0.8125rem] text-muted-foreground mt-1 ml-4">
            {description}
          </p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => onDismiss(id)}
        className={`
          absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center bg-transparent border-none text-muted-foreground cursor-pointer rounded-md transition-all duration-200 hover:bg-white/10
          ${hovered ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
