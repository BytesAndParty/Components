import { useDesignerStore } from '../../store/designer-store'
import { TextToolOptions, type TextFormatValues } from '../../../text-tool-options/text-tool-options'
import { AlignmentBar } from '../../../alignment-bar/alignment-bar'
import { Tooltip } from '../shared'
import type { FabricBridge } from '../../engine/fabric-bridge'
import { useEffect, useState } from 'react'
import { BringToFront, SendToBack } from 'lucide-react'
import type { FabricObjectProperties } from '../../store/types'

interface ContextToolbarProps {
  bridge: React.MutableRefObject<FabricBridge | null>
}

export function ContextToolbar({ bridge }: ContextToolbarProps) {
  const selectedIds = useDesignerStore(s => s.selectedIds)
  const [props, setProps] = useState<FabricObjectProperties | null>(null)

  // Update local state when selection changes or object is modified
  useEffect(() => {
    const update = () => {
      setProps(bridge.current?.getActiveObjectProperties())
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
      canvas.on('text:changed', update)
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
        canvas.off('text:changed', update)
      }
    }
  }, [selectedIds, bridge])

  if (!props) {
    return (
      <div className="h-full flex items-center px-4 text-xs text-muted-foreground italic">
        Select an object to see options
      </div>
    )
  }

  const isText = props.type === 'text' || props.type === 'wine-field'
  const isWineField = props.type === 'wine-field'

  const handleTextChange = (newFmt: Partial<TextFormatValues>) => {
    const fabricProps: Partial<FabricObjectProperties> = {}
    if (newFmt.bold !== undefined) fabricProps.fontWeight = newFmt.bold ? 'bold' : 'normal'
    if (newFmt.italic !== undefined) fabricProps.fontStyle = newFmt.italic ? 'italic' : 'normal'
    if (newFmt.color !== undefined) fabricProps.fill = newFmt.color
    if (newFmt.fontFamily !== undefined) fabricProps.fontFamily = newFmt.fontFamily
    if (newFmt.fontSize !== undefined) fabricProps.fontSize = newFmt.fontSize
    if (newFmt.underline !== undefined) fabricProps.underline = newFmt.underline
    if (newFmt.textAlign !== undefined) fabricProps.textAlign = newFmt.textAlign
    
    bridge.current?.updateActiveObject(fabricProps)
  }

  return (
    <div className="h-full flex items-center px-4 gap-6">
      {isText && (
        <div className="flex items-center gap-4">
          {!isWineField && (
            <input 
              type="text" 
              value={props.text || ''} 
              onChange={(e) => bridge.current?.updateActiveObject({ text: e.target.value })}
              className="text-xs font-medium bg-muted/50 border border-border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary w-32"
              placeholder="Text content..."
            />
          )}
          <TextToolOptions 
            value={{
              fontFamily: props.fontFamily,
              fontSize: props.fontSize,
              bold: props.fontWeight === 'bold',
              italic: props.fontStyle === 'italic',
              underline: props.underline,
              textAlign: props.textAlign,
              charSpacing: props.charSpacing,
              lineHeight: props.lineHeight,
              color: props.fill,
            }}
            onChange={handleTextChange}
          />
        </div>
      )}

      <div className="flex items-center gap-1 border-l border-border pl-4">
        <Tooltip content="Bring to Front">
          <button 
            onClick={() => bridge.current?.bringToFront()}
            className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
          >
            <BringToFront size={16} />
          </button>
        </Tooltip>
        <Tooltip content="Send to Back">
          <button 
            onClick={() => bridge.current?.sendToBack()}
            className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
          >
            <SendToBack size={16} />
          </button>
        </Tooltip>
      </div>

      {selectedIds.length >= 2 && (
        <div className="flex items-center gap-2 border-l border-border pl-4">
          <AlignmentBar onAlign={(action) => {
            // Alignment logic would go here
            console.log('Align:', action)
          }} />
        </div>
      )}
    </div>
  )
}
