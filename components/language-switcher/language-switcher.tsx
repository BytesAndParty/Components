/**
 * LanguageSwitcher — Locale picker for the Design Engine navbar.
 *
 * Integrates with I18nProvider via useI18n() and persists the selected
 * locale in localStorage under 'design-engine-locale'. Also syncs
 * document.documentElement.lang and data-locale for CSS/SSR consumers.
 *
 * Visual: globe icon with current locale badge, dropdown with all options.
 * Follows the same self-contained pattern as AccentSwitcher and
 * AnimatedThemeToggler — no Tailwind dependency, pure inline styles.
 *
 * Usage:
 *   <LanguageSwitcher />
 *   <LanguageSwitcher languages={{ de: { label: 'Deutsch', shortLabel: 'DE' }, en: ... }} />
 */

import { useState, useEffect, useRef } from 'react'
import { useAtelier } from '../atelier'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LanguageOption {
  /** Full language name, shown in dropdown. */
  label: string
  /** Short code shown in the badge (max 2–3 chars). */
  shortLabel: string
}

export interface LanguageSwitcherProps {
  /** Language options. Defaults to de + en. */
  languages?: Record<string, LanguageOption>
  /** Aria label for the trigger button. */
  triggerLabel?: string
  className?: string
  style?: React.CSSProperties
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_LANGUAGES: Record<string, LanguageOption> = {
  de: { label: 'Deutsch', shortLabel: 'DE' },
  en: { label: 'English', shortLabel: 'EN' },
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LanguageSwitcher({
  languages = DEFAULT_LANGUAGES,
  triggerLabel = 'Select language',
  className,
  style,
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useAtelier()
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [flipping, setFlipping] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const current = languages[locale] ?? Object.values(languages)[0]
  const localeKeys = Object.keys(languages)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      const t = e.target as Node
      if (!triggerRef.current?.contains(t) && !menuRef.current?.contains(t)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function select(key: string) {
    if (key === locale) { setOpen(false); return }
    setFlipping(true)
    setTimeout(() => {
      setLocale(key as typeof locale)
      setFlipping(false)
    }, 150)
    setOpen(false)
  }

  return (
    <>
      <style>{`
        @keyframes ls-badge-out {
          to { transform: rotateX(90deg) scale(0.8); opacity: 0; }
        }
        @keyframes ls-badge-in {
          from { transform: rotateX(-90deg) scale(0.8); opacity: 0; }
        }
        @keyframes ls-globe-spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(15deg); }
        }
        .ls-btn:hover .ls-globe { animation: ls-globe-spin 0.4s ease forwards; }
        .ls-badge-flip-out { animation: ls-badge-out 0.15s ease forwards; }
        .ls-badge-flip-in  { animation: ls-badge-in  0.15s ease forwards; }
        @media (prefers-reduced-motion: reduce) {
          .ls-btn:hover .ls-globe { animation: none !important; }
          .ls-badge-flip-out, .ls-badge-flip-in { animation: none !important; }
        }
      `}</style>

      <div
        className={className}
        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', ...style }}
      >
        {/* ── Trigger ─────────────────────────────────────────── */}
        <button
          ref={triggerRef}
          type="button"
          className="ls-btn"
          onClick={() => setOpen(v => !v)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label={triggerLabel}
          aria-expanded={open}
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: '0.375rem',
            border: 'none',
            background: hovered || open ? 'rgba(128,128,128,0.12)' : 'transparent',
            color: 'inherit',
            cursor: 'pointer',
            transition: 'background 0.15s',
            perspective: '200px',
          }}
        >
          {/* Globe icon */}
          <svg
            className="ls-globe"
            width="18" height="18"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            style={{ display: 'block', flexShrink: 0 }}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>

          {/* Locale badge — bottom-right */}
          <span
            className={flipping ? 'ls-badge-flip-out' : 'ls-badge-flip-in'}
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '1px',
              right: '1px',
              fontSize: '7px',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '0.04em',
              color: 'var(--accent, currentColor)',
              pointerEvents: 'none',
              transformOrigin: 'center',
            }}
          >
            {current.shortLabel}
          </span>
        </button>

        {/* ── Dropdown ────────────────────────────────────────── */}
        {open && (
          <div
            ref={menuRef}
            role="listbox"
            aria-label={triggerLabel}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.25rem',
              zIndex: 50,
              minWidth: '10rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border)',
              background: 'var(--card)',
              padding: '0.25rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '0.375rem 0.5rem 0.25rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--muted-foreground)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              Language
            </div>

            <div style={{ height: '1px', margin: '0.25rem -0.25rem', background: 'var(--border)' }} />

            {localeKeys.map(key => {
              const opt = languages[key]
              const isActive = key === locale
              return (
                <button
                  key={key}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => select(key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    width: '100%',
                    padding: '0.4rem 0.5rem',
                    borderRadius: '0.25rem',
                    border: 'none',
                    background: 'transparent',
                    color: isActive ? 'var(--accent)' : 'inherit',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(128,128,128,0.1)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  {/* Short badge */}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.5rem',
                    height: '1.25rem',
                    borderRadius: '3px',
                    border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    color: isActive ? 'var(--accent)' : 'var(--muted-foreground)',
                    background: isActive ? 'color-mix(in oklch, var(--accent) 12%, transparent)' : 'transparent',
                    flexShrink: 0,
                  }}>
                    {opt.shortLabel}
                  </span>

                  {/* Full name */}
                  <span style={{ flex: 1 }}>{opt.label}</span>

                  {/* Active checkmark */}
                  {isActive && (
                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>✓</span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
