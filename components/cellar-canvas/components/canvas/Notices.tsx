import { TriangleAlert, X } from 'lucide-react'
import { useCellarCanvasMessages } from '../../messages-context'
import { useDesignerStore } from '../../store/designer-store'

/**
 * Notices over the top edge of the canvas: the autosave warning and whatever
 * last went wrong (image, QR code, export). Both can be closed. They float
 * above the canvas instead of sitting in a bar, so a notice never resizes the
 * canvas area.
 */
export function Notices() {
  const m = useCellarCanvasMessages()
  const showDraftNotice = useDesignerStore(s => s.draftSaveFailed && !s.draftNoticeDismissed)
  const notice = useDesignerStore(s => s.notice)
  const dismissDraftNotice = useDesignerStore(s => s.dismissDraftNotice)
  const setNotice = useDesignerStore(s => s.setNotice)

  if (!showDraftNotice && !notice) return null

  const noticeText = notice && { image: m.imageInsertFailed, qr: m.qrInsertFailed, export: m.exportFailed }[notice.kind]

  return (
    <div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex flex-col items-center gap-2 px-3">
      {showDraftNotice && (
        <Notice text={m.draftSaveFailed} dismissLabel={m.dismissHint} onDismiss={dismissDraftNotice} />
      )}
      {notice && noticeText && (
        // New key per failure: a repeated error re-mounts the alert and is announced again.
        <Notice key={notice.id} text={noticeText} dismissLabel={m.dismissHint} onDismiss={() => setNotice(null)} />
      )}
    </div>
  )
}

function Notice({ text, dismissLabel, onDismiss }: { text: string; dismissLabel: string; onDismiss: () => void }) {
  return (
    <div className="bg-card border-destructive/40 text-foreground pointer-events-auto flex max-w-lg items-center gap-2 rounded-lg border py-1 pr-1 pl-3 text-xs shadow-lg">
      <TriangleAlert size={14} aria-hidden className="text-destructive shrink-0" />
      <span role="alert" className="py-1">{text}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={dismissLabel}
        title={dismissLabel}
        className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-accent/60 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none pointer-coarse:h-11 pointer-coarse:w-11"
      >
        <X size={14} aria-hidden />
      </button>
    </div>
  )
}
