import { ArrowRight, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

interface PreviewHintProps {
  open: boolean
  count: number
  onOpenPreview: () => void
  onClose: () => void
  /** Positioning against the anchor, e.g. `absolute right-0 bottom-full mb-3`. */
  className: string
}

/**
 * One-off callout pointing at the preview once the composition has enough
 * sections to judge as a page. The caller owns the open state and the
 * auto-dismiss timer; the highlighted preview button stays as the lasting entry.
 */
export function PreviewHint({ open, count, onOpenPreview, onClose, className }: PreviewHintProps) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
          className={`border-border bg-elevated flex w-max max-w-[min(86vw,340px)] items-center gap-3 rounded-xl border py-2 pr-2 pl-3.5 shadow-xl shadow-black/30 ${className}`}
        >
          <p className="text-sm leading-snug">
            <span className="font-display text-base tracking-tight">{count} Sections gewählt.</span>
            <br />
            <span className="text-muted-foreground">Sieh dir deine Seite im Ganzen an.</span>
          </p>
          <button
            type="button"
            onClick={onOpenPreview}
            className="group bg-accent text-accent-foreground focus-visible:ring-ring flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-transform hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0 max-sm:min-h-11"
          >
            Ansehen
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Hinweis schließen"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex shrink-0 items-center justify-center rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none max-sm:h-11 max-sm:w-11"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
