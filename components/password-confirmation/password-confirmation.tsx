import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type CSSProperties,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface PasswordConfirmationProps {
  /** The original password to confirm against */
  password: string
  /** Called when confirmation value changes */
  onChange?: (value: string) => void
  /** Called when passwords match */
  onMatch?: () => void
  /** Placeholder text (default: 'Confirm password') */
  placeholder?: string
  /** Dot size in px (default: 10) */
  dotSize?: number
  /** Match color (default: '#22c55e') */
  matchColor?: string
  /** Mismatch color (default: '#ef4444') */
  mismatchColor?: string
  /** Neutral dot color (default: 'var(--muted-foreground, #71717a)') */
  neutralColor?: string
  className?: string
  style?: CSSProperties
}

// ─── Keyframe injection ─────────────────────────────────────────────────────────

const STYLE_ID = '__password-confirm-styles__'

function injectStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes pw-shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(5px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(3px); }
    }
    @keyframes pw-bounce {
      0% { transform: scale(1); }
      40% { transform: scale(1.06); }
      100% { transform: scale(1); }
    }
    @keyframes pw-dot-pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.4); }
      100% { transform: scale(1); }
    }
  `
  document.head.appendChild(style)
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function PasswordConfirmation({
  password,
  onChange,
  onMatch,
  placeholder = 'Confirm password',
  dotSize = 10,
  matchColor = '#22c55e',
  mismatchColor = '#ef4444',
  neutralColor = 'var(--muted-foreground, #71717a)',
  className,
  style,
}: PasswordConfirmationProps) {
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)
  const [matched, setMatched] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const injected = useRef(false)
  const matchedRef = useRef(false)

  useEffect(() => {
    if (!injected.current) {
      injectStyles()
      injected.current = true
    }
  }, [])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newVal = e.target.value

      // Shake if exceeding password length
      if (newVal.length > password.length) {
        setShake(true)
        setTimeout(() => setShake(false), 400)
        return
      }

      setValue(newVal)
      onChange?.(newVal)

      // Check for full match
      if (newVal === password && !matchedRef.current) {
        matchedRef.current = true
        setMatched(true)
        onMatch?.()
      } else if (newVal !== password) {
        matchedRef.current = false
        setMatched(false)
      }
    },
    [password, onChange, onMatch]
  )

  // Reset when password changes
  useEffect(() => {
    setValue('')
    setMatched(false)
    matchedRef.current = false
  }, [password])

  // Build dots
  const dots: React.ReactNode[] = []
  for (let i = 0; i < password.length; i++) {
    const isTyped = i < value.length
    const isMatch = isTyped && value[i] === password[i]
    const isMismatch = isTyped && value[i] !== password[i]
    const justTyped = i === value.length - 1

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
          animation: justTyped ? 'pw-dot-pop 200ms ease' : 'none',
          opacity: isTyped ? 1 : 0.3,
        }}
      />
    )
  }

  // Border color
  let borderColor = 'var(--border, #2a2a2e)'
  if (matched) {
    borderColor = matchColor
  } else if (value.length > 0) {
    const allMatch = value === password.slice(0, value.length)
    borderColor = allMatch ? (focused ? 'var(--accent, #6366f1)' : 'var(--border, #2a2a2e)') : mismatchColor
  } else if (focused) {
    borderColor = 'var(--accent, #6366f1)'
  }

  // Focus ring glow
  let boxShadow = 'none'
  if (focused && !matched) {
    boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)'
  } else if (matched) {
    boxShadow = `0 0 0 3px ${matchColor}26`
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        ...style,
      }}
    >
      {/* Hidden real input */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          position: 'relative',
          border: `2px solid ${borderColor}`,
          borderRadius: '10px',
          padding: '14px 16px',
          cursor: 'text',
          background: 'var(--card, #141416)',
          transition: 'border-color 300ms ease, box-shadow 300ms ease, transform 200ms ease',
          boxShadow,
          animation: shake
            ? 'pw-shake 400ms ease'
            : matched
              ? 'pw-bounce 300ms ease'
              : 'none',
        }}
      >
        <input
          ref={inputRef}
          type="password"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
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

        {/* Display – dots or placeholder */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            minHeight: `${Math.max(21, dotSize + 4)}px`,
          }}
        >
          {value.length === 0 && placeholder ? (
            <span
              style={{
                fontSize: '14px',
                color: 'var(--muted-foreground, #71717a)',
                lineHeight: '21px',
              }}
            >
              {placeholder}
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
        </div>
      </div>

      {/* Match indicator */}
      {matched && (
        <span
          style={{
            fontSize: '13px',
            color: matchColor,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Passwords match
        </span>
      )}
    </div>
  )
}
