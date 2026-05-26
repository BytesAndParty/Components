import { useDesignerStore } from '../../store/designer-store'
import { useCellarCanvasMessages } from '../../messages-context'
import { TextToolOptions, type TextFormatValues } from '../../../text-tool-options/text-tool-options'
import { AlignmentBar } from '../../../alignment-bar/alignment-bar'
import { StackOrderControls } from '../../../stack-order-controls/stack-order-controls'
import { ColorSwatch } from '../../../color-swatch/color-swatch'
import { NumberInput } from '../shared'
import { Crop } from 'lucide-react'
import type { FabricBridge } from '../../engine/fabric-bridge'
import { useEffect, useState } from 'react'
import type { FabricObjectProperties } from '../../store/types'

interface ContextToolbarProps {
  bridge: React.MutableRefObject<FabricBridge | null>
}

export function ContextToolbar({ bridge }: ContextToolbarProps) {
  const m = useCellarCanvasMessages()
  const selectedIds = useDesignerStore(s => s.selectedIds)
  const setCropper = useDesignerStore(s => s.setCropper)
  const [props, setProps] = useState<FabricObjectProperties | null>(null)

  // Update local state when selection changes or object is modified
  useEffect(() => {
    const update = () => {
      setProps(bridge.current?.getActiveObjectProperties() ?? null)
    }

    update()

    const canvas = bridge.current?.canvas
    if (canvas) {
      canvas.on('object:moving', update)
      canvas.on('object:scaling', update)
      canvas.on('object:resizing', update)
      canvas.on('object:rotating', update)
      canvas.on('selection:created', update)
      canvas.on('selection:updated', update)
      canvas.on('selection:cleared', update)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(canvas as any).on('cellar:property-changed', update)
    }

    return () => {
      if (canvas) {
        canvas.off('object:moving', update)
        canvas.off('object:scaling', update)
        canvas.off('object:resizing', update)
        canvas.off('object:rotating', update)
        canvas.off('selection:created', update)
        canvas.off('selection:updated', update)
        canvas.off('selection:cleared', update)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(canvas as any).off('cellar:property-changed', update)
      }
    }
  }, [selectedIds, bridge])

  if (!props) {
    return (
      <div className="h-full flex items-center px-4 text-xs text-muted-foreground italic">
        {m.contextEmpty}
      </div>
    )
  }

  const isText      = props.type === 'text' || props.type === 'wine-field'
  const isShape     = props.type === 'rect' || props.type === 'circle' || props.type === 'line'
  const isImage     = props.type === 'image'
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
    <div className="h-full flex items-center px-4 gap-4">
      {isImage && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const src = bridge.current?.getSelectedImageSrc()
              if (src) {
                setCropper({ open: true, src, targetId: selectedIds[0] })
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-muted transition-colors"
          >
            <Crop size={14} />
            {m.toolCrop ?? 'Crop'}
          </button>
          <div className="w-px h-5 bg-border mx-2" />
          <div className="flex items-center h-9 bg-card border border-border rounded-lg px-2">
             <NumberInput
                label="OP"
                value={(props.opacity ?? 1) * 100}
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
              fontFamily:  props.fontFamily,
              fontSize:    props.fontSize,
              bold:        props.fontWeight === 'bold',
              italic:      props.fontStyle === 'italic',
              underline:   props.underline,
              textAlign:   props.textAlign,
              charSpacing: props.charSpacing,
              lineHeight:  props.lineHeight,
              color:       props.fill,
            }}
            onChange={handleTextChange}
          />
        </div>
      )}

      {isShape && (
        <div className="flex items-center h-9 bg-card border border-border rounded-lg">
          {props.type !== 'line' && (
            <>
              <ColorSwatch
                value={props.fill ?? '#000000'}
                onChange={(v) => bridge.current?.updateActiveObject({ fill: v })}
                label="■"
                title={m.contextFill}
                showAlpha
              />
              <div className="w-px h-5 bg-border shrink-0" />
            </>
          )}
          <ColorSwatch
            value={(props.stroke as string) ?? '#000000'}
            onChange={(v) => bridge.current?.updateActiveObject({ stroke: v })}
            label="◯"
            title={m.contextStroke}
            showAlpha
          />
          <div className="w-px h-5 bg-border shrink-0" />
          <div className="flex items-center px-2 h-full">
            <NumberInput
              label="SW"
              value={props.strokeWidth ?? 0}
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
    </div>
  )
}
