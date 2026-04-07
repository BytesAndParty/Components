import { useState, type ReactNode, type CSSProperties } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface BannerProps {
  children: ReactNode
  /** Background color (default: accent) */
  bgColor?: string
  /** Text color (default: white) */
  textColor?: string
  /** Show close/dismiss button (default: true) */
  dismissible?: boolean
  /** Callback when dismissed */
  onDismiss?: () => void
  className?: string
  style?: CSSProperties
}

export interface BannerLinkProps {
  children: ReactNode
  href: string
  className?: string
  style?: CSSProperties
}

// ─── Sub-Components ─────────────────────────────────────────────────────────────

export function BannerLink({ children, href, className, style }: BannerLinkProps) {
  return (
    <a
      href={href}
      className={className}
      style={{
        fontWeight: 600,
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        transition: 'opacity 150ms ease',
        ...style,
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        style={{ width: '18px', height: '18px' }}
      >
        <path
          fillRule="evenodd"
          d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
          clipRule="evenodd"
        />
      </svg>
    </a>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function Banner({
  children,
  bgColor = 'var(--accent, #6366f1)',
  textColor = '#ffffff',
  dismissible = true,
  onDismiss,
  className,
  style,
}: BannerProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div
      className={className}
      role="banner"
      style={{
        background: bgColor,
        color: textColor,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 300ms ease, opacity 300ms ease',
        ...style,
      }}
    >
      <div
        style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontFamily: 'inherit',
          fontSize: '14px',
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0 }}>{children}</p>

        {dismissible && (
          <button
            onClick={() => {
              setVisible(false)
              onDismiss?.()
            }}
            aria-label="Banner schließen"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.7,
              transition: 'opacity 150ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{ width: '18px', height: '18px' }}
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
