import {
  useEffect,
  useId,
  useRef,
  useState,
  forwardRef,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../lib/utils';

export type FormInputType = 'text' | 'email' | 'tel' | 'number' | 'password' | 'url';

export interface FormInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'prefix'> {
  type?: FormInputType;
  label?: string;
  description?: string;
  error?: string;
  /** Show success state (e.g. green border/check) */
  success?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  wrapperClassName?: string;
}

const STYLE_ID = '__form-input-styles__';

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    @keyframes form-input-shake {
      10%, 90% { transform: translateX(-1px); }
      20%, 80% { transform: translateX(2px); }
      30%, 50%, 70% { transform: translateX(-4px); }
      40%, 60% { transform: translateX(4px); }
    }
    @keyframes form-input-check-draw {
      from { stroke-dashoffset: 24; }
      to   { stroke-dashoffset: 0; }
    }
  `;
  document.head.appendChild(el);
}

const sizes = {
  sm: { height: 36, fontSize: 13, pad: 10, labelSize: 11 },
  md: { height: 44, fontSize: 14, pad: 12, labelSize: 12 },
  lg: { height: 52, fontSize: 15, pad: 14, labelSize: 12 },
} satisfies Record<'sm' | 'md' | 'lg', { height: number; fontSize: number; pad: number; labelSize: number }>;

/**
 * FormInput - A high-end, accessible input component.
 * Optimized for integration with TanStack Form.
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  type = 'text',
  label,
  description,
  error,
  success,
  leftIcon,
  rightIcon,
  size = 'md',
  className,
  wrapperClassName,
  style,
  disabled,
  ...rest
}, ref) => {
  const reactId = useId();
  const id = rest.id ?? `form-input-${reactId}`;
  const sz = sizes[size];
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    if (error) {
      setShakeKey((k) => k + 1);
    }
  }, [error]);

  const state: 'idle' | 'error' | 'success' =
    error ? 'error' : success ? 'success' : 'idle';

  const borderColor =
    state === 'error'
      ? '#ef4444'
      : state === 'success'
        ? 'color-mix(in oklch, var(--accent) 70%, transparent)'
        : 'var(--border)';

  return (
    <div className={cn("w-full flex flex-col items-start", wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="block font-medium uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5"
          style={{ fontSize: sz.labelSize }}
        >
          {label}
        </label>
      )}
      <div
        key={shakeKey}
        className={cn(
          "relative flex items-center w-full rounded-xl bg-[var(--card)] transition-all duration-200",
          state === 'error' && "animate-[form-input-shake_360ms_cubic-bezier(.36,.07,.19,.97)]"
        )}
        style={{
          height: sz.height,
          border: `1px solid ${borderColor}`,
          padding: `0 ${sz.pad}px`,
          boxShadow:
            state === 'error'
              ? '0 0 0 3px rgba(239, 68, 68, 0.12)'
              : state === 'success'
                ? '0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent)'
                : 'none',
          opacity: disabled ? 0.55 : 1,
          ...style,
        }}
      >
        {leftIcon && (
          <span className="inline-flex text-[var(--muted-foreground)] mr-2 shrink-0">
            {leftIcon}
          </span>
        )}
        <input
          {...rest}
          ref={ref}
          id={id}
          type={type}
          disabled={disabled}
          className={cn(
            "flex-1 min-w-0 h-full bg-transparent border-none outline-none text-[var(--foreground)] font-inherit placeholder:text-[var(--muted-foreground)]/50",
            className
          )}
          style={{ fontSize: sz.fontSize }}
          aria-invalid={state === 'error' || undefined}
          aria-describedby={
            error ? `${id}-error` : description ? `${id}-desc` : undefined
          }
        />
        {state === 'success' && !rightIcon && (
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="ml-2 shrink-0"
          >
            <path
              d="M20 6 9 17l-5-5"
              strokeDasharray={24}
              style={{ animation: 'form-input-check-draw 240ms ease-out forwards' }}
            />
          </svg>
        )}
        {state === 'error' && !rightIcon && (
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="ml-2 shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        )}
        {rightIcon && (
          <span className="inline-flex text-[var(--muted-foreground)] ml-2 shrink-0">
            {rightIcon}
          </span>
        )}
      </div>
      
      {/* Footer Area: Errors & Description */}
      <div className="min-h-[20px] mt-1.5 w-full">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              id={`${id}-error`}
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-[12px] text-[#ef4444] font-medium"
            >
              {error}
            </motion.p>
          ) : description ? (
            <motion.p
              key="desc"
              id={`${id}-desc`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[12px] text-[var(--muted-foreground)]"
            >
              {description}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
});

FormInput.displayName = 'FormInput';
