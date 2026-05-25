import { useEffect, useRef, useState } from 'react'
import { Dialog } from '@ark-ui/react/dialog'
import { ImageCropper, useImageCropperContext } from '@ark-ui/react/image-cropper'
import { Portal } from '@ark-ui/react/portal'
import { X, RotateCcw, FlipHorizontal, FlipVertical, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '../lib/utils'
import { useComponentMessages, useArkTranslations } from '../i18n'
import { MESSAGES, type ImageCropperMessages } from './messages'

const VIEWPORT_HEIGHT = 340
const DEFAULT_CROP_FILL = 0.95

export interface ImageCropperModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageSrc?: string
  aspectRatio?: number
  onCrop: (blob: Blob) => void
  className?: string
  messages?: Partial<ImageCropperMessages>
}

interface Size { width: number; height: number }
interface MeasuredImage extends Size { src: string }

export function ImageCropperModal({
  open,
  onOpenChange,
  imageSrc,
  aspectRatio,
  onCrop,
  className,
  messages,
}: ImageCropperModalProps) {
  const m = useComponentMessages(MESSAGES, messages)
  const dialogTranslations = useArkTranslations('dialog')
  const cropperTranslations = useArkTranslations('imageCropper')

  const measureRef = useRef<HTMLDivElement>(null)
  // naturalSize carries the src it was measured for so a sequential upload
  // with a different imageSrc can't briefly pass the previous image's
  // dimensions through as `defaultZoom` / `initialCrop` — see the
  // "ImageCropper drift on sequential uploads" entry in cellar-canvas
  // STATUS.md for the race this guards against.
  const [naturalSize, setNaturalSize] = useState<MeasuredImage | null>(null)
  const [viewportSize, setViewportSize] = useState<Size | null>(null)

  // Pre-decode the image to read naturalWidth/Height before mounting the
  // cropper. Zag's drawCroppedImageToCanvas hardcodes "1 viewport-px ==
  // 1 natural-px at zoom=1", so the initial zoom MUST be the fit zoom from
  // the very first render — anything else makes setDefaultCrop place the
  // selection over the un-shrunk image, and after a later setZoom() the
  // selection covers more than the visible bitmap.
  useEffect(() => {
    if (!open || !imageSrc) return
    let cancelled = false
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (cancelled) return
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight, src: imageSrc })
    }
    img.src = imageSrc
    return () => { cancelled = true }
  }, [open, imageSrc])

  // Measure the viewport container BEFORE the cropper mounts so we can pass
  // a matching initialCrop. Once the cropper is mounted, its own
  // ResizeObserver picks up the same box.
  useEffect(() => {
    if (!open) return
    const el = measureRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) {
        setViewportSize(prev =>
          prev && prev.width === width && prev.height === height ? prev : { width, height }
        )
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [open])

  // `naturalSize.src === imageSrc` is the actual guard against the
  // sequential-upload drift bug: a stale measurement from a previous image
  // (or a slow onload that resolves after the user switched images) is
  // treated as not-ready, keeping the loading shell up until the new image
  // is fully measured. Without this gate the cropper could mount with the
  // previous image's `defaultZoom` / `initialCrop`, baking in a wrong
  // mapping that the Apply pipeline then propagates to the output.
  const ready =
    naturalSize !== null &&
    naturalSize.src === imageSrc &&
    viewportSize !== null
  const fitZoom = ready
    ? Math.min(1, Math.min(
        viewportSize.width / naturalSize.width,
        viewportSize.height / naturalSize.height,
      ))
    : 1
  const visibleW = ready ? naturalSize.width * fitZoom : 0
  const visibleH = ready ? naturalSize.height * fitZoom : 0
  const initialCrop = ready
    ? {
        x: Math.max(0, (viewportSize.width - visibleW * DEFAULT_CROP_FILL) / 2),
        y: Math.max(0, (viewportSize.height - visibleH * DEFAULT_CROP_FILL) / 2),
        width: visibleW * DEFAULT_CROP_FILL,
        height: visibleH * DEFAULT_CROP_FILL,
      }
    : undefined

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(d: { open: boolean }) => onOpenChange(d.open)}
      modal
      translations={dialogTranslations}
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

            {imageSrc ? (
              ready ? (
                <ImageCropper.Root
                  key={imageSrc}
                  aspectRatio={aspectRatio}
                  defaultZoom={fitZoom}
                  initialCrop={initialCrop}
                  minZoom={fitZoom * 0.5}
                  maxZoom={4}
                  zoomStep={0.1}
                  translations={cropperTranslations}
                >
                  <div className="relative w-full bg-muted/30" style={{ height: VIEWPORT_HEIGHT }}>
                    <ImageCropper.Viewport className="w-full h-full flex items-center justify-center">
                      {/*
                        Image renders at its natural CSS size and is centered
                        by flex; Zag applies the user-controlled zoom as a
                        CSS transform on top. We pre-compute fitZoom and pass
                        it as defaultZoom so the very first setDefaultCrop
                        sees the already-scaled visible region.
                      */}
                      <ImageCropper.Image
                        src={imageSrc}
                        crossOrigin="anonymous"
                        style={{ flexShrink: 0 }}
                      />
                      <ImageCropper.Selection className="border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                        <ImageCropper.Handle position="nw" className={handleCls} />
                        <ImageCropper.Handle position="ne" className={handleCls} />
                        <ImageCropper.Handle position="sw" className={handleCls} />
                        <ImageCropper.Handle position="se" className={handleCls} />
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
                    <ApplyButton src={imageSrc} onCrop={onCrop} onClose={() => onOpenChange(false)} label={m.apply} />
                  </div>
                </ImageCropper.Root>
              ) : (
                // Measuring shell — the ref captures the eventual viewport
                // size, the spinner-style label fills the box.
                <>
                  <div
                    ref={measureRef}
                    className="relative w-full bg-muted/30 flex items-center justify-center text-muted-foreground text-xs"
                    style={{ height: VIEWPORT_HEIGHT }}
                  >
                    {m.loading}
                  </div>
                  <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
                    <Dialog.CloseTrigger asChild>
                      <button
                        type="button"
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {m.cancel}
                      </button>
                    </Dialog.CloseTrigger>
                  </div>
                </>
              )
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
        min={5} max={400} step={5}
        value={Math.round(api.zoom * 100)}
        onChange={(e) => api.setZoom(Number(e.target.value) / 100)}
        className="flex-1 h-1 accent-accent cursor-pointer"
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
  src,
  onCrop,
  onClose,
  label,
}: {
  src: string
  onCrop: (blob: Blob) => void
  onClose: () => void
  label: string
}) {
  const api = useImageCropperContext()
  const processingRef = useRef(false)

  // We deliberately do NOT use api.getCroppedImage(): Zag's built-in renders
  // the output canvas at viewport-pixel resolution (crop.width × crop.height),
  // which throws away source resolution — a 6000×4000 photo cropped at 95%
  // of a 600×340 viewport ends up as ~570×323 px, way below print quality.
  // We re-use Zag's math but size the output canvas in source pixels
  // (crop.width / zoom), capped at a sane maximum so a tiny zoom doesn't
  // blow up memory.
  async function handleApply() {
    if (processingRef.current) return
    processingRef.current = true
    try {
      const blob = await renderHighResCrop({
        src,
        crop: api.crop,
        zoom: api.zoom,
        offset: api.offset,
        rotation: api.rotation,
        flip: api.flip,
        viewportRect: api.viewportRect,
      })
      if (blob) {
        onCrop(blob)
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

const MAX_OUTPUT_PX = 4096

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = src
  })
}

/**
 * Mirrors @zag-js/image-cropper's `drawCroppedImageToCanvas` but renders into
 * a canvas sized in source pixels (crop.width / zoom) instead of viewport
 * pixels. Position/rotation/flip math is byte-for-byte identical so users
 * see exactly the area they selected — just in print-grade resolution.
 */
async function renderHighResCrop(params: {
  src: string
  crop: { x: number; y: number; width: number; height: number }
  zoom: number
  offset: { x: number; y: number }
  rotation: number
  flip: { horizontal: boolean; vertical: boolean }
  viewportRect: { width: number; height: number }
}): Promise<Blob | null> {
  const { src, crop, zoom, offset, rotation, flip, viewportRect } = params
  if (zoom <= 0 || crop.width <= 0 || crop.height <= 0) return null

  const img = await loadImage(src)
  const sourceW = crop.width / zoom
  const sourceH = crop.height / zoom
  const downscale = Math.min(1, MAX_OUTPUT_PX / Math.max(sourceW, sourceH))
  const outW = Math.max(1, Math.round(sourceW * downscale))
  const outH = Math.max(1, Math.round(sourceH * downscale))

  const canvas = document.createElement('canvas')
  canvas.width = outW
  canvas.height = outH
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.save()
  ctx.translate(outW / 2, outH / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)

  const cropCenterX = crop.x + crop.width / 2
  const cropCenterY = crop.y + crop.height / 2
  const deltaX = cropCenterX - viewportRect.width / 2
  const deltaY = cropCenterY - viewportRect.height / 2
  const imageCenterX = img.naturalWidth / 2
  const imageCenterY = img.naturalHeight / 2
  const sourceX = imageCenterX + (deltaX - offset.x) / zoom
  const sourceY = imageCenterY + (deltaY - offset.y) / zoom

  ctx.drawImage(
    img,
    sourceX - sourceW / 2,
    sourceY - sourceH / 2,
    sourceW,
    sourceH,
    -outW / 2,
    -outH / 2,
    outW,
    outH,
  )
  ctx.restore()

  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob((blob) => resolve(blob), 'image/png', 1),
  )
}
