import { createContext, useContext, useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Folder as FolderIcon, FolderOpen, FileText } from 'lucide-react'

// ─── Context ────────────────────────────────────────────────────────────────────

interface FileTreeContextValue {
  /** Einrückung pro Ebene in px (default: 16) */
  indent: number
}

const FileTreeContext = createContext<FileTreeContextValue>({ indent: 16 })

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface FileTreeProps {
  children: ReactNode
  /** Einrückung pro Ebene in px (default: 16) */
  indent?: number
  className?: string
  style?: CSSProperties
}

export interface FolderProps {
  name: string
  /** Standardmäßig aufgeklappt (default: false) */
  defaultOpen?: boolean
  children?: ReactNode
  className?: string
}

export interface FileProps {
  name: string
  className?: string
}

// ─── FileTree (Root) ─────────────────────────────────────────────────────────────

export function FileTree({ children, indent = 16, className, style }: FileTreeProps) {
  return (
    <FileTreeContext.Provider value={{ indent }}>
      <ul
        role="tree"
        className={className}
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          color: 'var(--foreground, inherit)',
          ...style,
        }}
      >
        {children}
      </ul>
    </FileTreeContext.Provider>
  )
}

// ─── Folder ──────────────────────────────────────────────────────────────────────

export function Folder({ name, defaultOpen = false, children, className }: FolderProps) {
  const [open, setOpen] = useState(defaultOpen)
  const { indent } = useContext(FileTreeContext)

  return (
    <li role="treeitem" aria-expanded={open} className={className} style={{ listStyle: 'none' }}>
      {/* Folder-Header */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          width: '100%',
          padding: '0.2rem 0.25rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'inherit',
          borderRadius: '0.25rem',
          textAlign: 'left',
          fontSize: 'inherit',
          fontFamily: 'inherit',
          transition: 'background 150ms ease',
        }}
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLElement).style.background =
            'color-mix(in oklch, var(--foreground, #fff) 8%, transparent)'
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLElement).style.background = 'none'
        }}
      >
        {open
          ? <FolderOpen size={15} style={{ flexShrink: 0, color: 'var(--accent, #6366f1)' }} />
          : <FolderIcon size={15} style={{ flexShrink: 0, color: 'var(--accent, #6366f1)' }} />
        }
        <span>{name}</span>
      </button>

      {/* Children: AnimatePresence für height 0 → auto */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            role="group"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{
              listStyle: 'none',
              margin: 0,
              paddingLeft: indent,
              overflow: 'hidden',
            }}
          >
            {children}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  )
}

// ─── File ────────────────────────────────────────────────────────────────────────

export function File({ name, className }: FileProps) {
  return (
    <li
      role="treeitem"
      className={className}
      style={{
        listStyle: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.2rem 0.25rem',
        borderRadius: '0.25rem',
        color: 'var(--muted-foreground, rgba(255,255,255,0.6))',
      }}
    >
      <FileText size={14} style={{ flexShrink: 0 }} />
      <span>{name}</span>
    </li>
  )
}
