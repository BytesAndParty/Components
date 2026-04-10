import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type CSSProperties,
  type ChangeEvent,
  type ReactNode,
} from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface PasswordSetupProps {
  /** Called when both passwords match */
  onMatch?: (password: string) => void
  /** Called when password changes */
  onPasswordChange?: (password: string) => void
  /** Label for the password field (default: 'Password') */
  passwordLabel?: string
  /** Label for the confirm field (default: 'Confirm password') */
  confirmLabel?: string
  /** Placeholder for the password field */
  passwordPlaceholder?: string
  /** Show strength meter (default: true) */
  showStrength?: boolean
  /** Show checklist (default: true) */
  showChecklist?: boolean
  /** Allow password generation (default: true) */
  allowGenerate?: boolean
  /** Custom visibility toggle icon. Receives `visible` state. */
  renderVisibilityIcon?: (visible: boolean) => ReactNode
  /** Dot size for confirmation dots (default: 10) */
  dotSize?: number
  /** Match color (default: '#22c55e') */
  matchColor?: string
  /** Mismatch color (default: '#ef4444') */
  mismatchColor?: string
  className?: string
  style?: CSSProperties
}

// ─── Keyframe injection ─────────────────────────────────────────────────────────

const STYLE_ID = '__password-setup-styles__'

function injectStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes pws-shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(5px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(3px); }
    }
    @keyframes pws-bounce {
      0% { transform: scale(1); }
      40% { transform: scale(1.04); }
      100% { transform: scale(1); }
    }
    @keyframes pws-dot-pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.4); }
      100% { transform: scale(1); }
    }
    @keyframes pws-fade-in {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pws-strength-grow {
      from { width: 0%; }
    }
  `
  document.head.appendChild(style)
}

// ─── Shared input style ─────────────────────────────────────────────────────────

const inputBaseStyle: CSSProperties = {
  width: '100%',
  padding: '12px 44px 12px 14px',
  background: 'var(--card, #141416)',
  border: '2px solid var(--border, #2a2a2e)',
  borderRadius: '10px',
  color: 'var(--foreground, #e4e4e7)',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 200ms ease, box-shadow 200ms ease',
}

const labelStyle: CSSProperties = {
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--muted-foreground, #71717a)',
  letterSpacing: '0.02em',
}

// ─── Default SVG icons ──────────────────────────────────────────────────────────

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

// ─── Visibility toggle button (module-level – stabil über Re-renders) ───────────

interface VisibilityToggleProps {
  visible: boolean
  onToggle: () => void
  renderVisibilityIcon?: (visible: boolean) => ReactNode
}

function VisibilityToggle({ visible, onToggle, renderVisibilityIcon }: VisibilityToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? 'Hide password' : 'Show password'}
      style={{
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--foreground, currentColor)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        borderRadius: '6px',
        transition: 'opacity 200ms ease',
        opacity: 0.5,
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '0.5' }}
    >
      {renderVisibilityIcon
        ? renderVisibilityIcon(visible)
        : visible ? <EyeOffIcon /> : <EyeIcon />
      }
    </button>
  )
}

// ─── Strength checks ────────────────────────────────────────────────────────────

interface Check {
  label: string
  test: (v: string) => boolean
}

const defaultChecks: Check[] = [
  { label: 'Mindestens 8 Zeichen', test: v => v.length >= 8 },
  { label: 'Ein Großbuchstabe', test: v => /[A-Z]/.test(v) },
  { label: 'Eine Zahl', test: v => /\d/.test(v) },
  { label: 'Ein Sonderzeichen', test: v => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v) },
]

function getStrength(passed: number, total: number) {
  if (passed === 0) return { label: 'Sehr schwach', color: '#ef4444' }
  if (passed === 1) return { label: 'Schwach', color: '#f97316' }
  if (passed === 2) return { label: 'Mittel', color: '#eab308' }
  if (passed === 3) return { label: 'Stark', color: '#3b82f6' }
  return { label: 'Sehr stark', color: '#22c55e' }
}

function generatePassword(length = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, v => charset[v % charset.length]).join('')
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function PasswordSetup({
  onMatch,
  onPasswordChange,
  passwordLabel = 'Password',
  confirmLabel = 'Confirm password',
  passwordPlaceholder = 'Enter your password',
  showStrength = true,
  showChecklist = true,
  allowGenerate = true,
  renderVisibilityIcon,
  dotSize = 10,
  matchColor = '#22c55e',
  mismatchColor = '#ef4444',
  className,
  style,
}: PasswordSetupProps) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pwVisible, setPwVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [focused1, setFocused1] = useState(false)
  const [focused2, setFocused2] = useState(false)
  const [shake, setShake] = useState(false)
  const [matched, setMatched] = useState(false)
  const [copied, setCopied] = useState(false)
  const confirmInputRef = useRef<HTMLInputElement>(null)
  const injected = useRef(false)
  const matchedRef = useRef(false)

  useEffect(() => {
    if (!injected.current) {
      injectStyles()
      injected.current = true
    }
  }, [])

  // ─── Password field handlers ──────────────────────────────────────────────

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setPassword(v)
    onPasswordChange?.(v)
    // Reset confirm state when password changes
    if (confirm && confirm !== v) {
      setMatched(false)
      matchedRef.current = false
    }
  }

  function handleGenerate() {
    const pw = generatePassword()
    setPassword(pw)
    setPwVisible(true)
    onPasswordChange?.(pw)
    setConfirm('')
    setMatched(false)
    matchedRef.current = false
  }

  async function handleCopy() {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // ─── Confirmation handlers ────────────────────────────────────────────────

  function handleConfirmChange(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    if (v.length > password.length) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }
    setConfirm(v)

    if (v === password && v.length > 0 && !matchedRef.current) {
      matchedRef.current = true
      setMatched(true)
      onMatch?.(password)
    } else if (v !== password) {
      matchedRef.current = false
      setMatched(false)
    }
  }

  // ─── Strength calculation ─────────────────────────────────────────────────

  const checkResults = defaultChecks.map(c => ({ ...c, valid: c.test(password) }))
  const passed = checkResults.filter(c => c.valid).length
  const strength = getStrength(passed, defaultChecks.length)

  // ─── Confirmation dots ────────────────────────────────────────────────────

  const neutralColor = 'var(--muted-foreground, #71717a)'
  const dots: ReactNode[] = []

  for (let i = 0; i < password.length; i++) {
    const isTyped = i < confirm.length
    const isMatch = isTyped && confirm[i] === password[i]
    const isMismatch = isTyped && confirm[i] !== password[i]
    const justTyped = i === confirm.length - 1

    let bgColor = neutralColor
    let glowColor = 'transparent'
    if (isMatch) {
      bgColor = matchColor
      glowColor = matchColor
    } else if (isMismatch) {
      bgColor = mismatchColor
      glowColor = mismatchColor
    }

    dots.push(
      <span
        key={i}
        style={{
          display: 'inline-block',
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          borderRadius: '50%',
          backgroundColor: bgColor,
          boxShadow: isTyped ? `0 0 6px ${glowColor}` : 'none',
          transition: 'background-color 150ms ease, box-shadow 150ms ease',
          animation: justTyped ? 'pws-dot-pop 200ms ease' : 'none',
          opacity: isTyped ? 1 : 0.3,
        }}
      />
    )
  }

  // ─── Border helpers ───────────────────────────────────────────────────────

  function getBorder1() {
    if (focused1) return 'var(--accent, #6366f1)'
    return 'var(--border, #2a2a2e)'
  }

  function getBorder2() {
    if (matched) return matchColor
    if (confirm.length > 0) {
      const allMatch = confirm === password.slice(0, confirm.length)
      return allMatch
        ? focused2 ? 'var(--accent, #6366f1)' : 'var(--border, #2a2a2e)'
        : mismatchColor
    }
    if (focused2) return 'var(--accent, #6366f1)'
    return 'var(--border, #2a2a2e)'
  }

  function getShadow2() {
    if (focused2 && !matched) return '0 0 0 3px rgba(99, 102, 241, 0.15)'
    if (matched) return `0 0 0 3px ${matchColor}26`
    return 'none'
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        ...style,
      }}
    >
      {/* ── Password field ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={labelStyle}>{passwordLabel}</label>
        <div style={{ position: 'relative' }}>
          <input
            type={pwVisible ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder={passwordPlaceholder}
            autoComplete="new-password"
            onFocus={() => setFocused1(true)}
            onBlur={() => setFocused1(false)}
            style={{
              ...inputBaseStyle,
              borderColor: getBorder1(),
              boxShadow: focused1 ? '0 0 0 3px rgba(99, 102, 241, 0.15)' : 'none',
            }}
          />
          <VisibilityToggle visible={pwVisible} onToggle={() => setPwVisible(v => !v)} renderVisibilityIcon={renderVisibilityIcon} />
        </div>

        {/* Actions row */}
        {(allowGenerate || password) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '2px',
            }}
          >
            {allowGenerate && (
              <button
                type="button"
                onClick={handleGenerate}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  fontSize: '12px',
                  color: 'var(--muted-foreground, #71717a)',
                  background: 'none',
                  border: '1px solid var(--border, #2a2a2e)',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  transition: 'border-color 200ms ease, color 200ms ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent, #6366f1)'
                  e.currentTarget.style.color = 'var(--foreground, #e4e4e7)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border, #2a2a2e)'
                  e.currentTarget.style.color = 'var(--muted-foreground, #71717a)'
                }}
              >
                <RefreshIcon /> Generate
              </button>
            )}
            {password && (
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  fontSize: '12px',
                  color: copied ? matchColor : 'var(--muted-foreground, #71717a)',
                  background: 'none',
                  border: '1px solid var(--border, #2a2a2e)',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  transition: 'border-color 200ms ease, color 200ms ease',
                }}
                onMouseEnter={e => {
                  if (!copied) {
                    e.currentTarget.style.borderColor = 'var(--accent, #6366f1)'
                    e.currentTarget.style.color = 'var(--foreground, #e4e4e7)'
                  }
                }}
                onMouseLeave={e => {
                  if (!copied) {
                    e.currentTarget.style.borderColor = 'var(--border, #2a2a2e)'
                    e.currentTarget.style.color = 'var(--muted-foreground, #71717a)'
                  }
                }}
              >
                {copied ? <><CheckIcon /> Copied!</> : <><CopyIcon /> Copy</>}
              </button>
            )}
          </div>
        )}

        {/* Strength meter */}
        {showStrength && password && (
          <div style={{ animation: 'pws-fade-in 200ms ease' }}>
            <div
              style={{
                height: '4px',
                width: '100%',
                background: 'var(--border, #2a2a2e)',
                borderRadius: '2px',
                overflow: 'hidden',
                marginTop: '4px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(passed / defaultChecks.length) * 100}%`,
                  background: strength.color,
                  borderRadius: '2px',
                  transition: 'width 300ms ease, background 300ms ease',
                  animation: 'pws-strength-grow 300ms ease',
                }}
              />
            </div>
            <span style={{ fontSize: '12px', color: strength.color, marginTop: '2px', display: 'block' }}>
              {strength.label}
            </span>
          </div>
        )}

        {/* Checklist */}
        {showChecklist && password && (
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              animation: 'pws-fade-in 200ms ease',
            }}
          >
            {checkResults.map((check, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: check.valid ? matchColor : 'var(--muted-foreground, #71717a)',
                  transition: 'color 200ms ease',
                }}
              >
                {check.valid ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="M22 4 12 14.01l-3-3" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 9-6 6" /><path d="m9 9 6 6" />
                  </svg>
                )}
                {check.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Confirmation field ── */}
      {password.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            animation: 'pws-fade-in 250ms ease',
          }}
        >
          <label style={labelStyle}>{confirmLabel}</label>

          <div
            onClick={() => confirmInputRef.current?.focus()}
            style={{
              position: 'relative',
              border: `2px solid ${getBorder2()}`,
              borderRadius: '10px',
              padding: '12px 44px 12px 14px',
              cursor: 'text',
              background: 'var(--card, #141416)',
              transition: 'border-color 300ms ease, box-shadow 300ms ease, transform 200ms ease',
              boxShadow: getShadow2(),
              animation: shake
                ? 'pws-shake 400ms ease'
                : matched
                  ? 'pws-bounce 300ms ease'
                  : 'none',
            }}
          >
            <input
              ref={confirmInputRef}
              type={confirmVisible ? 'text' : 'password'}
              value={confirm}
              onChange={handleConfirmChange}
              autoComplete="new-password"
              onFocus={() => setFocused2(true)}
              onBlur={() => setFocused2(false)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'text',
                border: 'none',
                background: 'none',
              }}
            />

            {/* Dots or plain text when visible */}
            {confirmVisible ? (
              <span style={{ fontSize: '14px', color: 'var(--foreground, #e4e4e7)', fontFamily: 'inherit' }}>
                {confirm || <span style={{ color: 'var(--muted-foreground, #71717a)' }}>Confirm…</span>}
              </span>
            ) : (
              <div
                style={{
                  display: 'flex',
                  gap: `${Math.max(6, dotSize * 0.6)}px`,
                  alignItems: 'center',
                  minHeight: `${dotSize + 4}px`,
                }}
              >
                {dots}
              </div>
            )}

            <VisibilityToggle visible={confirmVisible} onToggle={() => setConfirmVisible(v => !v)} renderVisibilityIcon={renderVisibilityIcon} />
          </div>

          {/* Match indicator */}
          {matched && (
            <span
              style={{
                fontSize: '12px',
                color: matchColor,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                animation: 'pws-fade-in 200ms ease',
              }}
            >
              <CheckIcon />
              Passwords match
            </span>
          )}
        </div>
      )}
    </div>
  )
}
