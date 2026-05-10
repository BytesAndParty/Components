export type LabelArea = 'front' | 'back' | 'neck'

export interface FabricObjectMeta {
  id: string
  _layerName: string
  _type: 'text' | 'wine-field' | 'image' | 'rect' | 'circle' | 'line' | 'group' | 'qr-code'
  _fieldKey?: string
  _locked?: boolean
  _extras?: boolean
}

export interface DesignerState {
  activeArea: LabelArea
  zoom: number
  activeTool: 'select' | 'text' | 'image' | 'rect' | 'circle' | 'line' | 'pan'
  
  // Selection state
  selectedIds: string[]
  
  // History
  history: Array<Record<LabelArea, any>>
  historyIndex: number
  
  // UI State
  isDragging: boolean
  isDirty: boolean
  
  // Actions
  setActiveArea: (area: LabelArea) => void
  setZoom: (zoom: number) => void
  setActiveTool: (tool: DesignerState['activeTool']) => void
  setSelectedIds: (ids: string[]) => void
  setDirty: (dirty: boolean) => void
}
