import { useDesignerStore } from '../../store/designer-store'
import { TextToolOptions, type TextFormatValues } from '../../../text-tool-options/text-tool-options'
import { ColorPickerPanel } from '../../../color-picker/color-picker'
import { AlignmentBar, type AlignAction } from '../../../alignment-bar/alignment-bar'
import { Tooltip } from '../shared'
import { cn } from '../../../lib/utils'
import type { FabricBridge } from '../../engine/fabric-bridge'
import { useEffect, useState } from 'react'

interface ContextToolbarProps {
  bridge: React.MutableRefObject<FabricBridge | null>
}

export function ContextToolbar({ bridge }: ContextToolbarProps) {
  const selectedIds = useDesignerStore(s => s.selectedIds)
  const [props, setProps] = useState<any>(null)

  // Update local state when selection changes or object is modified
  useEffect(() => {
    const update = () => {
      setProps(bridge.current?.getActiveObjectProperties())
    }

    // Initial update
    update()

    // Listen for canvas events
    const canvas = bridge.current?.canvas
    if (canvas) {
      canvas.on('object:moving', update)
      canvas.on('object:scaling', update)
      canvas.on('object:resizing', update)
      canvas.on('object:rotating', update)
      canvas.on('selection:created', update)
      canvas.on('selection:updated', update)
      canvas.on('selection:cleared', update)
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

  const handleTextChange = (newFmt: Partial<TextFormatValues>) => {
    // Map UI values back to Fabric properties if necessary
    const fabricProps: any = { ...newFmt }
    if (newFmt.bold !== undefined) fabricProps.fontWeight = newFmt.bold ? 'bold' : 'normal'
    if (newFmt.italic !== undefined) fabricProps.fontStyle = newFmt.italic ? 'italic' : 'normal'
    
    bridge.current?.updateActiveObject(fabricProps)
  }

  return (
    <div className="h-full flex items-center px-4 gap-6">
      {isText && (
        <div className="flex items-center gap-4">
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

      {props.type === 'rect' && (
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase text-muted-foreground">Fill</span>
          <div className="w-8 h-8 rounded border border-border overflow-hidden">
             {/* Simple color trigger for now, ColorPicker is usually in a popover or panel */}
             <div 
               className="w-full h-full cursor-pointer" 
               style={{ background: props.fill }}
               onClick={() => {/* TODO: Open Color Picker Popover */}}
             />
          </div>
        </div>
      )}

      {selectedIds.length >= 2 && (
        <div className="flex items-center gap-2 border-l border-border pl-4">
          <AlignmentBar onAlign={(action) => {
            // TODO: Implement alignment in FabricBridge
            console.log('Align:', action)
          }} />
        </div>
      )}
    </div>
  )
}
