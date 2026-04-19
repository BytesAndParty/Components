import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

/**
 * Minimal Zod-compatible validator shape. Accepts Zod v4 or any lib with
 * `.safeParse(value) → { success, data, error: { issues: [{ message }] } }`.
 * We type loosely so we don't force a peer dep.
 */
export interface FormInputSchema {
  safeParse: (value: unknown) => {
    success: boolean;
    data?: unknown;
    error?: { issues: Array<{ message: string }> };
  };
}

export type FormInputType = 'text' | 'email' | 'tel' | 'number' | 'password' | 'url';
export type FormInputValidateMode = 'onBlur' | 'onChange' | 'onSubmit';

export interface FormInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  type?: FormInputType;
  label?: string;
  description?: string;
  /** Zod schema (or any lib with .safeParse) */
  schema?: FormInputSchema;
  /** When to run validation. Default: onBlur (after user leaves field) */
  validateMode?: FormInputValidateMode;
  /** Override validation trigger from parent form */
  forceError?: string | null;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onValidate?: (result: { valid: boolean; error: string | null }) => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** Format phone as you type (only for type="tel") */
  autoFormatPhone?: boolean;
  /** Numeric min/max for type="number" (beyond native) */
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  wrapperClassName?: string;
  style?: CSSProperties;
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

/** Simple progressive phone formatting — pure presentation, no locale detection */
function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('49')) {
    // DE: +49 XXX XXX XXXX
    const rest = digits.slice(2);
    const a = rest.slice(0, 3);
    const b = rest.slice(3, 6);
    const c = rest.slice(6, 10);
    return `+49 ${a}${b ? ' ' + b : ''}${c ? ' ' + c : ''}`.trim();
  }
  if (digits.startsWith('1') && digits.length <= 11) {
    // US: +1 (XXX) XXX-XXXX
    const rest = digits.slice(1);
    const a = rest.slice(0, 3);
    const b = rest.slice(3, 6);
    const c = rest.slice(6, 10);
    return `+1 ${a ? `(${a})` : ''}${b ? ' ' + b : ''}${c ? '-' + c : ''}`.trim();
  }
  // fallback: group 2-3-3-...
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d+)?/, (_m, a, b, c, d) =>
    [a, b, c, d].filter(Boolean).join(' ')
  );
}

export function FormInput({
  type = 'text',
  label,
  description,
  schema,
  validateMode = 'onBlur',
  forceError = null,
  value: controlled,
  defaultValue = '',
  onChange,
  onValidate,
  onBlur,
  leftIcon,
  rightIcon,
  autoFormatPhone = false,
  min,
  max,
  size = 'md',
  className,
  wrapperClassName,
  style,
  disabled,
  ...rest
}: FormInputProps) {
  const reactId = useId();
  const id = rest.id ?? `form-input-${reactId}`;
  const [internal, setInternal] = useState(defaultValue);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const value = controlled ?? internal;
  const sz = sizes[size];

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    if (forceError !== null) {
      setError(forceError);
      if (forceError) setShakeKey((k) => k + 1);
    }
  }, [forceError]);

  function runValidate(v: string) {
    if (!schema) return { valid: true, error: null as string | null };
    const parsed = schema.safeParse(
      type === 'number' ? (v === '' ? undefined : Number(v)) : v
    );
    if (parsed.success) {
      return { valid: true, error: null };
    }
    const firstIssue = parsed.error?.issues?.[0]?.message ?? 'Invalid value';
    return { valid: false, error: firstIssue };
  }

  function updateValue(next: string) {
    let out = next;
    if (type === 'tel' && autoFormatPhone) {
      out = formatPhone(next);
    }
    if (type === 'number' && next !== '') {
      const n = Number(next);
      if (!Number.isNaN(n)) {
        if (min !== undefined && n < min) out = String(min);
        if (max !== undefined && n > max) out = String(max);
      }
    }
    if (controlled === undefined) setInternal(out);
    onChange?.(out);
    if (validateMode === 'onChange' && touched) {
      const r = runValidate(out);
      setError(r.error);
      setShowSuccess(r.valid && out.length > 0);
      onValidate?.(r);
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setTouched(true);
    if (validateMode === 'onBlur' || validateMode === 'onChange') {
      const r = runValidate(value);
      setError(r.error);
      setShowSuccess(r.valid && value.length > 0);
      if (!r.valid) setShakeKey((k) => k + 1);
      onValidate?.(r);
    }
    onBlur?.(e);
  }

  const effectiveError = forceError ?? error;
  const state: 'idle' | 'error' | 'success' =
    effectiveError ? 'error' : showSuccess ? 'success' : 'idle';

  const borderColor =
    state === 'error'
      ? '#ef4444'
      : state === 'success'
        ? 'color-mix(in oklch, var(--accent) 70%, transparent)'
        : 'var(--border)';

  return (
    <div className={wrapperClassName} style={{ width: '100%' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            fontSize: sz.labelSize,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--muted-foreground)',
            marginBottom: 6,
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}
      <div
        key={shakeKey}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          height: sz.height,
          borderRadius: 10,
          background: 'var(--card)',
          border: `1px solid ${borderColor}`,
          padding: `0 ${sz.pad}px`,
          transition: 'border-color 160ms ease, box-shadow 160ms ease',
          boxShadow:
            state === 'error'
              ? '0 0 0 3px rgba(239, 68, 68, 0.12)'
              : state === 'success'
                ? '0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent)'
                : 'none',
          animation: effectiveError && shakeKey > 0 ? 'form-input-shake 360ms cubic-bezier(0.36, 0.07, 0.19, 0.97)' : undefined,
          opacity: disabled ? 0.55 : 1,
          ...style,
        }}
      >
        {leftIcon && (
          <span style={{ display: 'inline-flex', color: 'var(--muted-foreground)', marginRight: 8 }}>
            {leftIcon}
          </span>
        )}
        <input
          {...rest}
          id={id}
          type={type}
          value={value}
          disabled={disabled}
          onChange={(e) => updateValue(e.target.value)}
          onBlur={handleBlur}
          inputMode={
            type === 'number' ? 'decimal' :
            type === 'tel' ? 'tel' :
            type === 'email' ? 'email' :
            type === 'url' ? 'url' :
            undefined
          }
          autoComplete={
            type === 'email' ? 'email' :
            type === 'tel' ? 'tel' :
            type === 'password' ? 'current-password' :
            rest.autoComplete
          }
          className={className}
          aria-invalid={state === 'error' || undefined}
          aria-describedby={
            effectiveError ? `${id}-error` : description ? `${id}-desc` : undefined
          }
          style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--foreground)',
            fontSize: sz.fontSize,
            fontFamily: 'inherit',
          }}
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
            style={{ marginLeft: 8, flexShrink: 0 }}
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
            style={{ marginLeft: 8, flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        )}
        {rightIcon && (
          <span style={{ display: 'inline-flex', color: 'var(--muted-foreground)', marginLeft: 8 }}>
            {rightIcon}
          </span>
        )}
      </div>
      {effectiveError ? (
        <p
          id={`${id}-error`}
          role="alert"
          style={{ fontSize: 12, color: '#ef4444', marginTop: 6, minHeight: '1em' }}
        >
          {effectiveError}
        </p>
      ) : description ? (
        <p
          id={`${id}-desc`}
          style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 6, minHeight: '1em' }}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
