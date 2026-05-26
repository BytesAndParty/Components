export type LabelArea = 'front' | 'back' | 'neck'

/**
 * Persistable editor state — Fabric scene plus anything that lives outside
 * the object stack (label-paper colour). Used for `initialState`, the
 * `onChange`/`onSave` callbacks, and localStorage autosave.
 */
export interface CellarCanvasState {
  canvas: object
  bg: string
}

export interface FabricObjectMeta {
  id: string
  _layerName: string
  _type: 'text' | 'wine-field' | 'image' | 'rect' | 'circle' | 'line' | 'group' | 'qr-code'
  _fieldKey?: string
  _locked?: boolean
  _extras?: boolean
}

export interface FabricObjectProperties {
  type: string
  fill: string
  stroke: string
  strokeWidth?: number
  opacity?: number
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  text?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string | number
  fontStyle?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  underline?: boolean
  charSpacing?: number
  lineHeight?: number
}

export interface DesignerState {
  activeArea: LabelArea
  zoom: number
  activeTool: 'select' | 'text' | 'image' | 'rect' | 'circle' | 'line' | 'pan'
  
  // Selection state
  selectedIds: string[]
  
  // History — linear stack of JSON snapshots (one per committed mutation).
  history: string[]
  historyIndex: number

  // UI State
  isDragging: boolean
  isDirty: boolean
  snappingEnabled: boolean
  cropperOpen: boolean
  cropperSrc?: string
  cropperTargetId?: string

  // Actions
  setActiveArea: (area: LabelArea) => void
  setZoom: (zoom: number) => void
  setActiveTool: (tool: DesignerState['activeTool']) => void
  setSelectedIds: (ids: string[]) => void
  setDirty: (dirty: boolean) => void
  setSnappingEnabled: (enabled: boolean) => void
  setCropper: (state: { open: boolean; src?: string; targetId?: string }) => void

  // History actions
  pushHistory: (state: string) => void
  undo: () => void
  redo: () => void
}
