import { useRef, type ChangeEvent } from 'react'
import { useDesignerStore } from '../../store/designer-store'
import { useCellarCanvasMessages } from '../../messages-context'
import { TextToolOptions, type TextFormatValues } from '../../../text-tool-options/text-tool-options'
import { AlignmentBar } from '../../../alignment-bar/alignment-bar'
import { StackOrderControls } from '../../../stack-order-controls/stack-order-controls'
import { ColorSwatch } from '../../../color-swatch/color-swatch'
import { NumberInput } from '../shared'
import { Crop, ImageUp, Trash2 } from 'lucide-react'
import { imageSourceFromBlob } from '../../engine/image-source'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { FabricObjectProperties } from '../../store/types'

export interface ContextToolbarProps {
  bridge:      React.MutableRefObject<FabricBridge | null>
  activeProps: FabricObjectProperties | null
}

export function ContextToolbar({ bridge, activeProps }: ContextToolbarProps) {
  const m = useCellarCanvasMessages()
  const selectedIds = useDesignerStore(s => s.selectedIds)
  const setCropper = useDesignerStore(s => s.setCropper)
  const replaceInputRef = useRef<HTMLInputElement>(null)

  function handleReplaceFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const targetId = useDesignerStore.getState().selectedIds[0]
    if (file && targetId) {
      // Straight swap, no cropper: keeps id, position and layer meta.
      void imageSourceFromBlob(file).then(src => bridge.current?.updateImageSource(targetId, src))
    }
    // Reset so picking the same file twice in a row still fires change.
    e.target.value = ''
  }

  if (!activeProps) {
    return (
      <div className="text-muted-foreground flex h-full items-center px-4 text-xs italic">
        {m.contextEmpty}
      </div>
    )
  }

  const isText      = activeProps.type === 'text' || activeProps.type === 'wine-field'
  const isShape     = activeProps.type === 'rect' || activeProps.type === 'circle' || activeProps.type === 'line'
  const isImage     = activeProps.type === 'image'
  const isMulti     = selectedIds.length >= 2

  const handleTextChange = (newFmt: Partial<TextFormatValues>) => {
    const fabricProps: Partial<FabricObjectProperties> = {}
    if (newFmt.bold        !== undefined) fabricProps.fontWeight  = newFmt.bold ? 'bold' : 'normal'
    if (newFmt.italic      !== undefined) fabricProps.fontStyle   = newFmt.italic ? 'italic' : 'normal'
    if (newFmt.color       !== undefined) fabricProps.fill        = newFmt.color
    if (newFmt.fontFamily  !== undefined) fabricProps.fontFamily  = newFmt.fontFamily
    if (newFmt.fontSize    !== undefined) fabricProps.fontSize    = newFmt.fontSize
    if (newFmt.underline   !== undefined) fabricProps.underline   = newFmt.underline
    if (newFmt.textAlign   !== undefined) fabricProps.textAlign   = newFmt.textAlign
    if (newFmt.charSpacing !== undefined) fabricProps.charSpacing = newFmt.charSpacing
    if (newFmt.lineHeight  !== undefined) fabricProps.lineHeight  = newFmt.lineHeight
    bridge.current?.updateActiveObject(fabricProps)
  }

  return (
    <div className="flex h-full w-full items-center gap-4 px-4">
      {isImage && (
        <div className="flex items-center gap-2">
          <input
            ref={replaceInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={handleReplaceFile}
            className="sr-only"
            aria-hidden
            tabIndex={-1}
          />
          <button
            onClick={() => {
              const src = bridge.current?.getSelectedImageSrc()
              if (src) {
                setCropper({ open: true, src, targetId: selectedIds[0] })
              }
            }}
            className="bg-card border-border hover:bg-muted flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-colors"
          >
            <Crop size={14} />
            {m.toolCrop ?? 'Crop'}
          </button>
          <button
            onClick={() => replaceInputRef.current?.click()}
            className="bg-card border-border hover:bg-muted flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-colors"
          >
            <ImageUp size={14} />
            {m.toolReplace}
          </button>
          <div className="bg-border mx-2 h-5 w-px" />
          <div className="bg-card border-border flex h-9 items-center rounded-lg border px-2">
             <NumberInput
                label="OP"
                value={(activeProps.opacity ?? 1) * 100}
                onChange={(v) => bridge.current?.updateActiveObject({ opacity: v / 100 })}
                min={0} max={100} step={5} decimals={0}
                unit="%"
              />
          </div>
        </div>
      )}

      {isText && (
        <div className="flex items-center gap-4">
          <TextToolOptions
            value={{
              fontFamily:  activeProps.fontFamily,
              fontSize:    activeProps.fontSize,
              bold:        activeProps.fontWeight === 'bold',
              italic:      activeProps.fontStyle === 'italic',
              underline:   activeProps.underline,
              textAlign:   activeProps.textAlign,
              charSpacing: activeProps.charSpacing,
              lineHeight:  activeProps.lineHeight,
              color:       activeProps.fill,
            }}
            onChange={handleTextChange}
          />
        </div>
      )}

      {isShape && (
        <div className="bg-card border-border flex h-9 items-center rounded-lg border">
          {activeProps.type !== 'line' && (
            <>
              <ColorSwatch
                value={activeProps.fill ?? '#000000'}
                onChange={(v) => bridge.current?.updateActiveObject({ fill: v })}
                label="■"
                title={m.contextFill}
                showAlpha
              />
              <div className="bg-border h-5 w-px shrink-0" />
            </>
          )}
          <ColorSwatch
            value={(activeProps.stroke as string) ?? '#000000'}
            onChange={(v) => bridge.current?.updateActiveObject({ stroke: v })}
            label="◯"
            title={m.contextStroke}
            showAlpha
          />
          <div className="bg-border h-5 w-px shrink-0" />
          <div className="flex h-full items-center px-2">
            <NumberInput
              label="SW"
              value={activeProps.strokeWidth ?? 0}
              onChange={(v) => bridge.current?.updateActiveObject({ strokeWidth: v })}
              min={0} max={20} step={0.5} decimals={1}
              unit="px"
            />
          </div>
        </div>
      )}

      <StackOrderControls
        onBringToFront={() => bridge.current?.bringToFront()}
        onBringForward={() => bridge.current?.bringForward()}
        onSendBackward={() => bridge.current?.sendBackward()}
        onSendToBack={()   => bridge.current?.sendToBack()}
      />

      {isMulti && (
        <AlignmentBar onAlign={(action) => bridge.current?.alignSelected(action)} />
      )}

      <div className="flex-1" />

      <button
        onClick={() => bridge.current?.deleteSelected()}
        className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md p-2 transition-colors"
        title={m.toolDelete}
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
