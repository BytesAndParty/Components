import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { motion, AnimatePresence, type PanInfo } from 'motion/react';
import { X } from 'lucide-react';
import { useComponentMessages } from '../i18n';
import { MESSAGES, type ToastMessages } from './messages';

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
  messages?: Partial<ToastMessages>;
}

export function ToastProvider({
  children,
  placement = 'bottom-right',
  maxVisible = 4,
  messages,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const counter = useRef(0);
  const m = useComponentMessages(MESSAGES, messages);

  const add = useCallback((opts: Omit<ToastData, 'id'>) => {
    const id = `toast-${++counter.current}`;
    setToasts((prev: ToastData[]) => [...prev, { ...opts, id, duration: opts.duration ?? 4000 }]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev: ToastData[]) => prev.filter((t) => t.id !== id));
  }, []);

  // Expose global `toast()`
  useEffect(() => {
    globalAdd = add;
    return () => { globalAdd = null; };
  }, [add]);

  const isTop = placement.startsWith('top');
  const isCenter = placement.endsWith('center');

  const positionStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    display: 'flex',
    flexDirection: isTop ? 'column' : 'column-reverse',
    gap: '0.5rem',
    padding: '1rem',
    pointerEvents: 'none',
    ...(isTop ? { top: 0 } : { bottom: 0 }),
    ...(isCenter
      ? { left: '50%', transform: 'translateX(-50%)' }
      : { right: 0 }),
  };

  const visible = toasts.slice(-maxVisible);

  return (
    <ToastContext.Provider value={{ toasts, add, dismiss }}>
      {children}
      <div style={positionStyle}>
        <AnimatePresence>
          {visible.map((t, i) => (
            <ToastItem
              key={t.id}
              data={t}
              index={i}
              total={visible.length}
              placement={placement}
              messages={m}
              onDismiss={dismiss}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/* ---------- Single Toast ---------- */

const variantColors: Record<ToastVariant, string> = {
  default: 'var(--accent)',
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
};

interface ToastItemProps {
  data: ToastData;
  index: number;
  total: number;
  placement: Placement;
  messages: ToastMessages;
  onDismiss: (id: string) => void;
}

function ToastItem({ data, index: _index, total: _total, placement, messages, onDismiss }: ToastItemProps) {
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

  const accentColor = variantColors[variant];

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
      style={{
        pointerEvents: 'auto',
        position: 'relative',
        width: '22rem',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        cursor: 'grab',
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 3,
          width: '100%',
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        <div
          ref={progressRef}
          style={{
            height: '100%',
            background: accentColor,
            opacity: 0.5,
            width: '0%',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '0.875rem 1rem', paddingRight: '2.5rem' }}>
        {/* Variant indicator dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: accentColor,
              flexShrink: 0,
            }}
          />
          <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--foreground)' }}>
            {title}
          </span>
        </div>
        {description && (
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--muted-foreground)',
              marginTop: '0.25rem',
              marginLeft: '1rem',
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => onDismiss(id)}
        aria-label={messages.dismiss}
        style={{
          position: 'absolute',
          top: '0.625rem',
          right: '0.625rem',
          width: '1.5rem',
          height: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          color: 'var(--muted-foreground)',
          cursor: 'pointer',
          borderRadius: '0.25rem',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s, background 0.15s',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
        }}
      >
        <X style={{ width: '0.875rem', height: '0.875rem' }} />
      </button>
    </motion.div>
  );
}
