import { useRef } from 'react'
import { Dialog } from '@ark-ui/react/dialog'
import { ImageCropper, useImageCropperContext } from '@ark-ui/react/image-cropper'
import { Portal } from '@ark-ui/react/portal'
import { X, RotateCcw, FlipHorizontal, FlipVertical, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '../lib/utils'
import { useComponentMessages } from '../i18n'
import type { ComponentMessages } from '../i18n'

// ── Messages ──────────────────────────────────────────────────────────────────

export type ImageCropperMessages = {
  title: string
  apply: string
  cancel: string
  zoomIn: string
  zoomOut: string
  zoom: string
  resetRotation: string
  flipH: string
  flipV: string
  noImage: string
  closeDialog: string
}

const CROPPER_MESSAGES = {
  de: {
    title:         'Bild zuschneiden',
    apply:         'Zuschnitt anwenden',
    cancel:        'Abbrechen',
    zoomIn:        'Vergrößern',
    zoomOut:       'Verkleinern',
    zoom:          'Zoom',
    resetRotation: 'Rotation zurücksetzen',
    flipH:         'Horizontal spiegeln',
    flipV:         'Vertikal spiegeln',
    noImage:       'Kein Bild ausgewählt.',
    closeDialog:   'Dialog schließen',
  },
  en: {
    title:         'Crop Image',
    apply:         'Apply Crop',
    cancel:        'Cancel',
    zoomIn:        'Zoom in',
    zoomOut:       'Zoom out',
    zoom:          'Zoom',
    resetRotation: 'Reset rotation',
    flipH:         'Flip horizontal',
    flipV:         'Flip vertical',
    noImage:       'No image selected.',
    closeDialog:   'Close dialog',
  },
} as const satisfies ComponentMessages<ImageCropperMessages>

export interface ImageCropperModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageSrc?: string
  aspectRatio?: number
  onCrop: (blob: Blob) => void
  className?: string
  messages?: Partial<ImageCropperMessages>
}

export function ImageCropperModal({
  open,
  onOpenChange,
  imageSrc,
  aspectRatio,
  onCrop,
  className,
  messages,
}: ImageCropperModalProps) {
  const m = useComponentMessages(CROPPER_MESSAGES, messages)

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(d: { open: boolean }) => onOpenChange(d.open)}
      modal
    >
      <Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Positioner className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Content
            className={cn(
              'bg-card border border-border rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              className,
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <Dialog.Title className="text-sm font-semibold text-foreground">
                {m.title}
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <button
                  type="button"
                  aria-label={m.closeDialog}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={16} />
                </button>
              </Dialog.CloseTrigger>
            </div>

            {/* Cropper */}
            {imageSrc ? (
              <ImageCropper.Root
                image={imageSrc}
                aspectRatio={aspectRatio}
                defaultZoom={1}
                minZoom={0.5}
                maxZoom={4}
                zoomStep={0.1}
              >
                {/* Canvas */}
                <div className="relative w-full bg-muted/30" style={{ height: 340 }}>
                  <ImageCropper.Viewport className="w-full h-full">
                    <ImageCropper.Image className="w-full h-full object-contain" />
                    <ImageCropper.Selection className="border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                      <ImageCropper.Handle position="top-left"     className={handleCls} />
                      <ImageCropper.Handle position="top-right"    className={handleCls} />
                      <ImageCropper.Handle position="bottom-left"  className={handleCls} />
                      <ImageCropper.Handle position="bottom-right" className={handleCls} />
                      <ImageCropper.Grid className="absolute inset-0 pointer-events-none" />
                    </ImageCropper.Selection>
                  </ImageCropper.Viewport>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 px-5 py-3 border-t border-border">
                  <CropperControls messages={m} />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
                  <Dialog.CloseTrigger asChild>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {m.cancel}
                    </button>
                  </Dialog.CloseTrigger>
                  <ApplyButton onCrop={onCrop} onClose={() => onOpenChange(false)} label={m.apply} />
                </div>
              </ImageCropper.Root>
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                {m.noImage}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

const handleCls =
  'absolute w-4 h-4 bg-white border-2 border-white rounded-sm shadow-md cursor-nwse-resize'

function CropperControls({ messages }: { messages: ImageCropperMessages }) {
  const api = useImageCropperContext()

  return (
    <div className="flex items-center gap-1 flex-1">
      {/* Zoom */}
      <button type="button" title={messages.zoomOut} onClick={() => api.setZoom(api.zoom - 0.1)}
        className={iconBtnCls}>
        <ZoomOut size={14} />
      </button>

      <input
        aria-label={messages.zoom}
        type="range"
        min={50} max={400} step={5}
        value={Math.round(api.zoom * 100)}
        onChange={(e) => api.setZoom(Number(e.target.value) / 100)}
        className="flex-1 h-1 accent-[var(--accent)] cursor-pointer"
      />

      <button type="button" title={messages.zoomIn} onClick={() => api.setZoom(api.zoom + 0.1)}
        className={iconBtnCls}>
        <ZoomIn size={14} />
      </button>

      {/* Divider */}
      <div className="w-px h-4 bg-border mx-1" />

      {/* Rotation reset */}
      <button type="button" title={messages.resetRotation}
        onClick={() => api.setRotation(0)}
        className={iconBtnCls}>
        <RotateCcw size={14} />
      </button>

      {/* Flip */}
      <button type="button" title={messages.flipH}
        onClick={() => api.setFlip({ horizontal: !api.flip.horizontal, vertical: api.flip.vertical })}
        className={cn(iconBtnCls, api.flip.horizontal && 'text-accent')}>
        <FlipHorizontal size={14} />
      </button>
      <button type="button" title={messages.flipV}
        onClick={() => api.setFlip({ horizontal: api.flip.horizontal, vertical: !api.flip.vertical })}
        className={cn(iconBtnCls, api.flip.vertical && 'text-accent')}>
        <FlipVertical size={14} />
      </button>
    </div>
  )
}

function ApplyButton({
  onCrop,
  onClose,
  label,
}: {
  onCrop: (blob: Blob) => void
  onClose: () => void
  label: string
}) {
  const api = useImageCropperContext()
  const processingRef = useRef(false)

  async function handleApply() {
    if (processingRef.current) return
    processingRef.current = true
    try {
      const result = await api.getCroppedImage({ format: 'blob' })
      if (result) {
        onCrop(result as Blob)
        onClose()
      }
    } finally {
      processingRef.current = false
    }
  }

  return (
    <button
      type="button"
      onClick={handleApply}
      className="px-4 py-2 text-sm font-medium bg-accent text-primary-foreground rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
    >
      {label}
    </button>
  )
}

const iconBtnCls =
  'flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors'
