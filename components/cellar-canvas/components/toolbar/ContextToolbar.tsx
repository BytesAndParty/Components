import { useRef, type ChangeEvent, type RefObject } from 'react'
import { AlignCenterHorizontal, AlignCenterVertical, Copy, Crop, ImageUp, Trash2 } from 'lucide-react'
import { useDesignerStore, reportImageError } from '../../store/designer-store'
import { useCellarCanvasMessages } from '../../messages-context'
import { TextToolOptions, type TextFormatValues } from '../../../text-tool-options/text-tool-options'
import { AlignmentBar } from '../../../alignment-bar/alignment-bar'
import { StackOrderControls } from '../../../stack-order-controls/stack-order-controls'
import { ColorSwatch } from '../../../color-swatch/color-swatch'
import { NumberInput } from '../../../number-input/number-input'
import { cn } from '../../../lib/utils'
import { toolbarArrowKeys } from './toolbar-keys'
import { barButtonCls } from '../shared/button-styles'
import { useShortcutTitle } from '../shared/use-shortcut-title'
import { prepareImageSource } from '../../engine/image-source'
import type { FabricBridge } from '../../engine/fabric-bridge'
import type { FabricObjectProperties } from '../../store/types'

export interface ContextToolbarProps {
  bridge:      RefObject<FabricBridge | null>
  activeProps: FabricObjectProperties | null
}

const groupCls = 'bg-card border-border flex h-9 shrink-0 items-center rounded-lg border'
const textButtonCls = cn(barButtonCls, 'border-border border px-3')

/**
 * Bar above the canvas for the selected element: what can be changed about
 * it (text format, shape colours, crop / replace), where it sits (centre on
 * the label, stacking, alignment of a multi-selection) and duplicate /
 * delete. One row; it scrolls sideways when the editor is narrower than its
 * content, so the canvas below never changes size with the selection.
 */
export function ContextToolbar({ bridge, activeProps }: ContextToolbarProps) {
  const m = useCellarCanvasMessages()
  const shortcutTitle = useShortcutTitle()
  const selectedIds = useDesignerStore(s => s.selectedIds)
  const setCropper = useDesignerStore(s => s.setCropper)
  const replaceInputRef = useRef<HTMLInputElement>(null)

  function handleReplaceFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const targetId = useDesignerStore.getState().selectedIds[0]
    if (file && targetId) {
      // Straight swap, no cropper: keeps id, position and layer meta.
      void prepareImageSource(file)
        .then(src => bridge.current?.updateImageSource(targetId, src))
        .catch(reportImageError)
    }
    // Reset so picking the same file twice in a row still fires change.
    e.target.value = ''
  }

  if (!activeProps) {
    return (
      <p className="text-muted-foreground flex h-full min-w-0 items-center truncate px-4 text-xs">
        {m.contextEmpty}
      </p>
    )
  }

  const isText  = activeProps.type === 'text' || activeProps.type === 'wine-field'
  const isShape = activeProps.type === 'rect' || activeProps.type === 'circle' || activeProps.type === 'line' || activeProps.type === 'path'
  const isImage = activeProps.type === 'image'
  const isMulti = selectedIds.length >= 2

  const update = (props: Partial<FabricObjectProperties>) => bridge.current?.updateActiveObject(props)

  const handleTextChange = (fmt: Partial<TextFormatValues>) => {
    const fabricProps: Partial<FabricObjectProperties> = {}
    if (fmt.bold        !== undefined) fabricProps.fontWeight  = fmt.bold ? 'bold' : 'normal'
    if (fmt.italic      !== undefined) fabricProps.fontStyle   = fmt.italic ? 'italic' : 'normal'
    if (fmt.color       !== undefined) fabricProps.fill        = fmt.color
    if (fmt.fontFamily  !== undefined) fabricProps.fontFamily  = fmt.fontFamily
    if (fmt.fontSize    !== undefined) fabricProps.fontSize    = fmt.fontSize
    if (fmt.textAlign   !== undefined) fabricProps.textAlign   = fmt.textAlign
    update(fabricProps)
  }

  const duplicateTitle = shortcutTitle(m.hotkeyDuplicateLabel, 'Mod+D')
  const deleteTitle = shortcutTitle(m.hotkeyDeleteLabel, 'Delete')

  return (
    <div
      role="toolbar"
      aria-label={m.contextToolbarLabel}
      onKeyDown={toolbarArrowKeys('horizontal')}
      className="flex h-full min-w-0 items-center gap-2 overflow-x-auto px-3 [scrollbar-width:none]"
    >
      {isImage && (
        <>
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
            type="button"
            onClick={() => {
              const src = bridge.current?.getSelectedImageSrc()
              if (src) setCropper({ open: true, src, targetId: selectedIds[0] })
            }}
            className={textButtonCls}
          >
            <Crop size={14} aria-hidden />
            {m.toolCrop}
          </button>
          <button type="button" onClick={() => replaceInputRef.current?.click()} className={textButtonCls}>
            <ImageUp size={14} aria-hidden />
            {m.toolReplace}
          </button>
        </>
      )}

      {isText && (
        <TextToolOptions
          basic
          className="shrink-0"
          value={{
            fontFamily: activeProps.fontFamily,
            fontSize:   activeProps.fontSize,
            bold:       activeProps.fontWeight === 'bold',
            italic:     activeProps.fontStyle === 'italic',
            textAlign:  activeProps.textAlign,
            color:      activeProps.fill,
          }}
          onChange={handleTextChange}
        />
      )}

      {isShape && (
        <div className={groupCls}>
          {activeProps.type !== 'line' && (
            <>
              <ColorSwatch
                value={activeProps.fill ?? '#000000'}
                onChange={(v) => update({ fill: v })}
                label={m.contextFill}
                title={m.contextFill}
                showAlpha
              />
              <div className="bg-border h-5 w-px shrink-0" />
            </>
          )}
          <ColorSwatch
            value={activeProps.stroke ?? '#000000'}
            onChange={(v) => update({ stroke: v })}
            label={m.contextStroke}
            title={m.contextStroke}
            showAlpha
          />
          <div className="bg-border h-5 w-px shrink-0" />
          <div className="flex h-full items-center px-2">
            <NumberInput
              label={m.contextStrokeWidth}
              value={activeProps.strokeWidth ?? 0}
              onChange={(v) => update({ strokeWidth: v })}
              min={0} max={20} step={0.5} decimals={1}
              unit="px"
            />
          </div>
          {activeProps.type === 'rect' && (
            <>
              <div className="bg-border h-5 w-px shrink-0" />
              <div className="flex h-full items-center px-2">
                <NumberInput
                  label={m.contextCornerRadius}
                  value={activeProps.cornerRadius ?? 0}
                  onChange={(v) => update({ cornerRadius: v })}
                  min={0} max={50} step={0.5} decimals={1}
                  unit="mm"
                />
              </div>
            </>
          )}
        </div>
      )}

      <div className={groupCls}>
        <button
          type="button"
          onClick={() => bridge.current?.centerOnLabel('h')}
          title={m.contextCenterH}
          aria-label={m.contextCenterH}
          className={cn(iconButtonCls, 'border-border border-r')}
        >
          <AlignCenterVertical size={14} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => bridge.current?.centerOnLabel('v')}
          title={m.contextCenterV}
          aria-label={m.contextCenterV}
          className={iconButtonCls}
        >
          <AlignCenterHorizontal size={14} aria-hidden />
        </button>
      </div>

      {isMulti ? (
        <AlignmentBar className="shrink-0" onAlign={(action) => bridge.current?.alignSelected(action)} />
      ) : (
        // Stacking moves one object; a multi-selection has no place in the stack.
        <StackOrderControls
          className="shrink-0"
          onBringToFront={() => bridge.current?.bringToFront()}
          onBringForward={() => bridge.current?.bringForward()}
          onSendBackward={() => bridge.current?.sendBackward()}
          onSendToBack={()   => bridge.current?.sendToBack()}
        />
      )}

      <div className="flex-1" />

      <button
        type="button"
        onClick={() => void bridge.current?.duplicateSelected()}
        title={duplicateTitle}
        aria-label={duplicateTitle}
        className={barButtonCls}
      >
        <Copy size={16} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => bridge.current?.deleteSelected()}
        title={deleteTitle}
        aria-label={deleteTitle}
        className={cn(barButtonCls, 'hover:bg-destructive/10 hover:text-destructive')}
      >
        <Trash2 size={16} aria-hidden />
      </button>
    </div>
  )
}

const iconButtonCls =
  'text-muted-foreground hover:bg-muted/50 hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground flex h-full w-8 items-center justify-center transition-colors outline-none'
