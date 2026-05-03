import {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { motion, AnimatePresence } from 'motion/react'

// ─── Context ────────────────────────────────────────────────────────────────────

interface NavbarContextValue {
  scrolled: boolean
  transparent: boolean
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  activeDropdown: string | null
  setActiveDropdown: (id: string | null) => void
}

const NavbarContext = createContext<NavbarContextValue>({
  scrolled: false,
  transparent: false,
  mobileOpen: false,
  setMobileOpen: () => {},
  activeDropdown: null,
  setActiveDropdown: () => {},
})

function useNavbar() {
  return useContext(NavbarContext)
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface NavbarProps {
  children: ReactNode
  /** Transparent background until scrolled (default: false) */
  transparent?: boolean
  /** Sticky at top (default: true) */
  sticky?: boolean
  /** Height in px (default: 64) */
  height?: number
  /** Scroll threshold before background appears in px (default: 20) */
  scrollThreshold?: number
  /** Background color when solid */
  bgColor?: string
  /** Border color */
  borderColor?: string
  className?: string
  style?: CSSProperties
}

export interface NavbarSectionProps {
  children: ReactNode
  /** Position within the navbar */
  position: 'left' | 'center' | 'right'
  className?: string
  style?: CSSProperties
}

export interface NavbarItemProps {
  children: ReactNode
  href?: string
  active?: boolean
  onClick?: (e: React.MouseEvent) => void
  className?: string
  style?: CSSProperties
}

export interface NavbarDropdownProps {
  children: ReactNode
  /** Trigger label */
  trigger: ReactNode
  /** Unique ID for this dropdown */
  id: string
  /** Dropdown alignment (default: 'center') */
  align?: 'left' | 'center' | 'right'
  /** Full-width mega-menu style (default: false) */
  mega?: boolean
  className?: string
  style?: CSSProperties
}

export interface NavbarDropdownItemProps {
  children: ReactNode
  href?: string
  /** Subtitle shown below the label */
  subtitle?: string
  /** Icon element */
  icon?: ReactNode
  onClick?: (e: React.MouseEvent) => void
  className?: string
  style?: CSSProperties
}

export interface NavbarDropdownGroupProps {
  children: ReactNode
  /** Group heading */
  title?: string
  className?: string
  style?: CSSProperties
}

export interface NavbarMobileToggleProps {
  className?: string
  style?: CSSProperties
}

export interface NavbarMobileMenuProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export interface NavbarIconButtonProps {
  children: ReactNode
  onClick?: (e: React.MouseEvent) => void
  /** Badge count (e.g. cart items) */
  badge?: number
  'aria-label': string
  className?: string
  style?: CSSProperties
}

// ─── Navbar (Root) ──────────────────────────────────────────────────────────────

export function Navbar({
  children,
  transparent = false,
  sticky = true,
  height = 64,
  scrollThreshold = 20,
  bgColor = 'var(--background, #0a0a0b)',
  borderColor = 'var(--border, #2a2a2e)',
  className,
  style,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    if (!sticky && !transparent) return

    function handleScroll() {
      setScrolled(window.scrollY > scrollThreshold)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sticky, transparent, scrollThreshold])

  // Close dropdown on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActiveDropdown(null)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const showBg = !transparent || scrolled

  return (
    <NavbarContext.Provider
      value={{ scrolled, transparent, mobileOpen, setMobileOpen, activeDropdown, setActiveDropdown }}
    >
      <nav
        className={className}
        role="navigation"
        aria-label="Hauptnavigation"
        style={{
          position: sticky ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          fontFamily: 'inherit',
          transition: 'background 300ms ease, border-color 300ms ease, box-shadow 300ms ease',
          background: showBg ? bgColor : 'transparent',
          borderBottom: showBg ? `1px solid ${borderColor}` : '1px solid transparent',
          backdropFilter: showBg ? 'blur(12px) saturate(1.2)' : 'none',
          WebkitBackdropFilter: showBg ? 'blur(12px) saturate(1.2)' : 'none',
          boxShadow: showBg ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          ...style,
        }}
      >
        {children}
      </nav>

      {/* Spacer for sticky navbar */}
      {sticky && <div style={{ height: `${height}px` }} />}
    </NavbarContext.Provider>
  )
}

// ─── NavbarSection ──────────────────────────────────────────────────────────────

export function NavbarSection({ children, position, className, style }: NavbarSectionProps) {
  const justifyMap = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flex: position === 'center' ? 1 : undefined,
        justifyContent: justifyMap[position],
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── NavbarItem ─────────────────────────────────────────────────────────────────

export function NavbarItem({ children, href, active, onClick, className, style }: NavbarItemProps) {
  const Tag = href ? 'a' : 'button'

  return (
    <Tag
      href={href}
      onClick={onClick}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 14px',
        fontSize: '14px',
        fontWeight: active ? 600 : 400,
        color: active ? 'var(--foreground, #e4e4e7)' : 'var(--muted-foreground, #71717a)',
        background: 'none',
        border: 'none',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'color 200ms ease',
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
        ...style,
      }}
      onMouseEnter={e => {
        if (!active) e.currentTarget.style.color = 'var(--foreground, #e4e4e7)'
      }}
      onMouseLeave={e => {
        if (!active) e.currentTarget.style.color = 'var(--muted-foreground, #71717a)'
      }}
    >
      {children}
      {active && (
        <span
          style={{
            position: 'absolute',
            bottom: '0',
            left: '14px',
            right: '14px',
            height: '2px',
            background: 'var(--accent, #6366f1)',
            borderRadius: '1px',
          }}
        />
      )}
    </Tag>
  )
}

// ─── NavbarDropdown ─────────────────────────────────────────────────────────────

export function NavbarDropdown({
  children,
  trigger,
  id,
  align = 'center',
  mega = false,
  className,
  style,
}: NavbarDropdownProps) {
  const { activeDropdown, setActiveDropdown } = useNavbar()
  const isOpen = activeDropdown === id
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const open = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveDropdown(id)
  }, [id, setActiveDropdown])

  const close = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }, [setActiveDropdown])

  // Clean up timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const alignmentStyles: CSSProperties = mega
    ? { left: '50%', transform: 'translateX(-50%)', width: 'min(90vw, 800px)' }
    : align === 'left'
      ? { left: 0 }
      : align === 'right'
        ? { right: 0 }
        : { left: '50%', transform: 'translateX(-50%)' }

  return (
    <div
      ref={containerRef}
      onMouseEnter={open}
      onMouseLeave={close}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => (isOpen ? setActiveDropdown(null) : setActiveDropdown(id))}
        aria-expanded={isOpen}
        aria-haspopup="true"
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '8px 14px',
          fontSize: '14px',
          fontWeight: 400,
          color: isOpen ? 'var(--foreground, #e4e4e7)' : 'var(--muted-foreground, #71717a)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 200ms ease',
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
          letterSpacing: '0.01em',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--foreground, #e4e4e7)')}
        onMouseLeave={e => {
          if (!isOpen) e.currentTarget.style.color = 'var(--muted-foreground, #71717a)'
        }}
      >
        {trigger}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'transform 200ms ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={className}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '100%',
              ...alignmentStyles,
              paddingTop: '8px',
              zIndex: 101,
              ...style,
            }}
          >
            <div
              onMouseEnter={open}
              onMouseLeave={close}
              style={{
                background: 'var(--card, #141416)',
                border: '1px solid var(--border, #2a2a2e)',
                borderRadius: '12px',
                padding: mega ? '24px' : '8px',
                minWidth: mega ? undefined : '200px',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.1)',
                display: mega ? 'grid' : 'flex',
                flexDirection: mega ? undefined : 'column',
                gridTemplateColumns: mega ? 'repeat(auto-fit, minmax(180px, 1fr))' : undefined,
                gap: mega ? '20px' : '2px',
              }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── NavbarDropdownGroup ────────────────────────────────────────────────────────

export function NavbarDropdownGroup({ children, title, className, style }: NavbarDropdownGroupProps) {
  return (
    <div className={className} style={style}>
      {title && (
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--muted-foreground, #71717a)',
            padding: '6px 12px 8px',
          }}
        >
          {title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>{children}</div>
    </div>
  )
}

// ─── NavbarDropdownItem ─────────────────────────────────────────────────────────

export function NavbarDropdownItem({
  children,
  href,
  subtitle,
  icon,
  onClick,
  className,
  style,
}: NavbarDropdownItemProps) {
  const Tag = href ? 'a' : 'button'

  return (
    <Tag
      href={href}
      onClick={onClick}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '10px 12px',
        fontSize: '14px',
        color: 'var(--foreground, #e4e4e7)',
        background: 'none',
        border: 'none',
        borderRadius: '8px',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'background 150ms ease',
        fontFamily: 'inherit',
        textAlign: 'left',
        width: '100%',
        ...style,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
    >
      {icon && (
        <span style={{ flexShrink: 0, marginTop: '2px', opacity: 0.7 }}>{icon}</span>
      )}
      <div>
        <div style={{ fontWeight: 500 }}>{children}</div>
        {subtitle && (
          <div
            style={{
              fontSize: '12px',
              color: 'var(--muted-foreground, #71717a)',
              marginTop: '2px',
              lineHeight: '1.4',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </Tag>
  )
}

// ─── NavbarIconButton ───────────────────────────────────────────────────────────

export function NavbarIconButton({
  children,
  onClick,
  badge,
  'aria-label': ariaLabel,
  className,
  style,
}: NavbarIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        padding: 0,
        background: 'none',
        border: 'none',
        borderRadius: '8px',
        color: 'var(--muted-foreground, #71717a)',
        cursor: 'pointer',
        transition: 'color 200ms ease, background 200ms ease',
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = 'var(--foreground, #e4e4e7)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'var(--muted-foreground, #71717a)'
        e.currentTarget.style.background = 'none'
      }}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            minWidth: '16px',
            height: '16px',
            padding: '0 4px',
            borderRadius: '8px',
            background: 'var(--accent, #6366f1)',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  )
}

// ─── NavbarMobileToggle ─────────────────────────────────────────────────────────

export function NavbarMobileToggle({ className, style }: NavbarMobileToggleProps) {
  const { mobileOpen, setMobileOpen } = useNavbar()

  return (
    <button
      type="button"
      onClick={() => setMobileOpen(!mobileOpen)}
      aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
      aria-expanded={mobileOpen}
      className={className}
      style={{
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        padding: 0,
        background: 'none',
        border: 'none',
        color: 'var(--foreground, #e4e4e7)',
        cursor: 'pointer',
        ...style,
        // Show on mobile via media query workaround
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {mobileOpen ? (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        ) : (
          <>
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </>
        )}
      </svg>
    </button>
  )
}

// ─── NavbarMobileMenu ───────────────────────────────────────────────────────────

export function NavbarMobileMenu({ children, className, style }: NavbarMobileMenuProps) {
  const { mobileOpen, setMobileOpen } = useNavbar()

  // Lock body scroll
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 99,
            }}
          />

          {/* Slide-in panel */}
          <motion.div
            className={className}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(320px, 85vw)',
              background: 'var(--background, #0a0a0b)',
              borderLeft: '1px solid var(--border, #2a2a2e)',
              padding: '72px 24px 24px',
              zIndex: 100,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              ...style,
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Menü schließen"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                color: 'var(--muted-foreground, #71717a)',
                cursor: 'pointer',
                borderRadius: '8px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── NavbarLogo ─────────────────────────────────────────────────────────────────

export interface NavbarLogoProps {
  children: ReactNode
  href?: string
  className?: string
  style?: CSSProperties
}

export function NavbarLogo({ children, href = '/', className, style }: NavbarLogoProps) {
  return (
    <a
      href={href}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'var(--foreground, #e4e4e7)',
        fontWeight: 700,
        fontSize: '18px',
        letterSpacing: '-0.02em',
        ...style,
      }}
    >
      {children}
    </a>
  )
}

// ─── NavbarDivider ──────────────────────────────────────────────────────────────

export function NavbarDivider() {
  return (
    <div
      role="separator"
      style={{
        width: '1px',
        height: '20px',
        background: 'var(--border, #2a2a2e)',
        margin: '0 8px',
      }}
    />
  )
}

// ─── Keyframes for mobile toggle (inject responsive styles) ─────────────────────

// Responsive rules are defined in styles.css (.navbar-desktop, .navbar-mobile-toggle)

// Export a utility to mark desktop-only elements
export function NavbarDesktopOnly({ children, style, ...rest }: { children: ReactNode; style?: CSSProperties } & Record<string, unknown>) {
  return <div data-navbar-desktop="" style={{ display: 'flex', alignItems: 'center', gap: '4px', ...style }} {...rest}>{children}</div>
}

export function NavbarMobileOnly({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div data-navbar-mobile-toggle="" style={{ display: 'none', ...style }}>{children}</div>
}
