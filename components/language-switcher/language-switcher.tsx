/**
 * LanguageSwitcher — Locale picker for the Design Engine navbar.
 *
 * Reads and sets the locale via useAtelier(); the AtelierProvider persists it
 * in localStorage under 'atelier-locale' and syncs
 * document.documentElement.lang and data-locale for CSS/SSR consumers.
 *
 * Built on Ark UI `Select` (keyboard navigation, Escape, typeahead, outside
 * click and focus return). The list portals into useOverlayContainer().
 *
 * Visual: globe icon with current locale badge, dropdown with all options.
 * Follows the same self-contained pattern as AccentSwitcher and
 * AnimatedThemeToggler — no Tailwind dependency, pure inline styles.
 *
 * Usage:
 *   <LanguageSwitcher />
 *   <LanguageSwitcher languages={{ de: { label: 'Deutsch', shortLabel: 'DE' }, en: ... }} />
 */

import { useRef, useState } from 'react'
import { Portal } from '@ark-ui/react/portal'
import { Select } from '@ark-ui/react/select'
import { createListCollection } from '@ark-ui/react/collection'
import { useAtelier } from '../atelier'
import { useComponentMessages } from '../i18n'
import { useOverlayContainer } from '../lib/overlay-container'
import { MESSAGES, type LanguageSwitcherMessages } from './messages'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LanguageOption {
  /** Full language name, shown in dropdown. */
  label: string
  /** Short code shown in the badge (max 2–3 chars). */
  shortLabel: string
}

export interface LanguageSwitcherProps {
  /** Language options. Defaults to de + en + pl. */
  languages?: Record<string, LanguageOption>
  /** Aria label for the trigger button. */
  triggerLabel?: string
  /** Translation overrides. */
  messages?: Partial<LanguageSwitcherMessages>
  /** Called when language is changed. */
  onChange?: (locale: string) => void
  className?: string
  style?: React.CSSProperties
}

type LanguageItem = LanguageOption & { value: string }

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_LANGUAGES: Record<string, LanguageOption> = {
  de: { label: 'Deutsch', shortLabel: 'DE' },
  en: { label: 'English', shortLabel: 'EN' },
  pl: { label: 'Polski', shortLabel: 'PL' },
}

// Visually hidden: Ark points aria-labelledby of the trigger and the list at this label's id.
const VISUALLY_HIDDEN: React.CSSProperties = {
  position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px',
  overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0,
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LanguageSwitcher({
  languages = DEFAULT_LANGUAGES,
  triggerLabel: _triggerLabel,
  messages,
  onChange,
  className,
  style,
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useAtelier()
  const m = useComponentMessages(MESSAGES, messages)
  const overlayContainer = useOverlayContainer()
  const [flipping, setFlipping] = useState(false)
  // `value` stays on the old locale until the flip ends; further changes in that window are ignored.
  const switching = useRef(false)

  const current = languages[locale] ?? Object.values(languages)[0]
  const collection = createListCollection<LanguageItem>({
    items: Object.entries(languages).map(([value, opt]) => ({ value, ...opt })),
    itemToValue: (item) => item.value,
    itemToString: (item) => item.label,
  })

  const effectiveTriggerLabel = _triggerLabel ?? m.triggerLabel

  function select(key: string) {
    if (switching.current) return
    switching.current = true
    setFlipping(true)
    setTimeout(() => {
      setLocale(key as typeof locale)
      onChange?.(key)
      setFlipping(false)
      switching.current = false
    }, 150)
  }

  // Select changes its value on arrow keys, Home/End and typeahead even while the list is
  // closed. Switching the whole UI language that way is too easy to trigger by accident,
  // so these keys do nothing on the trigger. Enter, Space and ArrowDown still open the list.
  function handleTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const isTypeahead = e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey
    if (isTypeahead || ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) e.preventDefault()
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
        .ls-btn { background: transparent; }
        .ls-btn:hover, .ls-btn[data-state="open"] { background: rgba(128,128,128,0.12); }
        .ls-btn:hover .ls-globe { animation: ls-globe-spin 0.4s ease forwards; }
        .ls-item { background: transparent; }
        .ls-item[data-highlighted] { background: rgba(128,128,128,0.1); }
        .ls-badge-flip-out { animation: ls-badge-out 0.15s ease forwards; }
        .ls-badge-flip-in  { animation: ls-badge-in  0.15s ease forwards; }
        @media (prefers-reduced-motion: reduce) {
          .ls-btn:hover .ls-globe { animation: none !important; }
          .ls-badge-flip-out, .ls-badge-flip-in { animation: none !important; }
        }
      `}</style>

      <Select.Root
        collection={collection}
        value={[locale]}
        onValueChange={(details) => {
          const next = details.value[0]
          if (next && next !== locale) select(next)
        }}
        positioning={{ placement: 'bottom-end', gutter: 4 }}
        lazyMount
        unmountOnExit
        className={className}
        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', ...style }}
      >
        <Select.Label style={VISUALLY_HIDDEN}>{effectiveTriggerLabel}</Select.Label>

        {/* ── Trigger ─────────────────────────────────────────── */}
        <Select.Trigger
          className="ls-btn"
          aria-label={effectiveTriggerLabel}
          onKeyDown={handleTriggerKeyDown}
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: '0.375rem',
            border: 'none',
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
        </Select.Trigger>

        {/* ── Dropdown ────────────────────────────────────────── */}
        <Portal container={overlayContainer}>
          {/* Above the fixed navbar (z-index 100), like NavbarDropdown. */}
          <Select.Positioner style={{ zIndex: 101 }}>
            <Select.Content
              aria-label={effectiveTriggerLabel}
              style={{
                minWidth: '10rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border)',
                background: 'var(--card)',
                padding: '0.25rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                outline: 'none',
              }}
            >
              {/* Header — decorative, the list is labelled via the hidden Select.Label */}
              <div aria-hidden="true" style={{
                padding: '0.375rem 0.5rem 0.25rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--muted-foreground)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                {m.header}
              </div>

              <div aria-hidden="true" style={{ height: '1px', margin: '0.25rem -0.25rem', background: 'var(--border)' }} />

              {collection.items.map(item => {
                const isActive = item.value === locale
                return (
                  <Select.Item
                    key={item.value}
                    item={item}
                    className="ls-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      width: '100%',
                      padding: '0.4rem 0.5rem',
                      borderRadius: '0.25rem',
                      color: isActive ? 'var(--accent)' : 'inherit',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.1s',
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
                      {item.shortLabel}
                    </span>

                    {/* Full name */}
                    <Select.ItemText style={{ flex: 1 }}>{item.label}</Select.ItemText>

                    {/* Active checkmark */}
                    {isActive && (
                      <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>✓</span>
                    )}
                  </Select.Item>
                )
              })}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </>
  )
}
