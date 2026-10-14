export type LabelArea = 'front' | 'back' | 'neck'

/**
 * Persistable editor state — Fabric scene plus anything that lives outside
 * the object stack (label-paper colour). Used for `initialState`, the
 * `onChange`/`onSave` callbacks, and localStorage autosave.
 */
/**
 * The label paper. A solid colour stays a plain CSS colour string, so drafts
 * and `initialState`s from before gradients and images keep loading.
 */
export type LabelBackground =
  | string
  | { type: 'gradient'; from: string; to: string; /** CSS `linear-gradient` angle in degrees */ angle: number }
  | { type: 'image'; /** data URL (see `prepareImageSource`) */ src: string }

export interface CellarCanvasState {
  canvas: object
  bg: LabelBackground
}

export interface FabricObjectMeta {
  id: string
  _layerName: string
  _type: 'text' | 'wine-field' | 'image' | 'rect' | 'circle' | 'line' | 'group' | 'qr-code' | 'path'
  _fieldKey?: string
  _locked?: boolean
  _extras?: boolean
  /** Wine field hidden by the sync because the current wine has no value for it. */
  _valueMissing?: boolean
  /** Rect corner radius in mm; rx/ry are derived from it for the current scale. */
  _cornerRadiusMm?: number
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
  /** Rect only: corner radius in mm (round corners regardless of scale). */
  cornerRadius?: number
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

  // UI State
  isDragging: boolean
  isDirty: boolean
  // History availability — the stack itself lives in the bridge's HistoryManager.
  canUndo: boolean
  canRedo: boolean
  snappingEnabled: boolean
  /** Last autosave write failed (quota exceeded / storage blocked). */
  draftSaveFailed: boolean
  /**
   * Last image/QR insert failed. `id` changes with every failure so a repeat
   * of the same error is announced again. Cleared by the next successful
   * insert or by dismissing the hint.
   */
  insertError: { kind: 'image' | 'qr'; id: number } | null
  /** Restarts the onboarding tour; registered by `OnboardingTour` while it is mounted. */
  startTour: (() => void) | null
  cropperOpen: boolean
  cropperSrc?: string
  cropperTargetId?: string

  // Actions
  setActiveArea: (area: LabelArea) => void
  setZoom: (zoom: number) => void
  setActiveTool: (tool: DesignerState['activeTool']) => void
  setSelectedIds: (ids: string[]) => void
  setDirty: (dirty: boolean) => void
  setHistoryFlags: (canUndo: boolean, canRedo: boolean) => void
  setSnappingEnabled: (enabled: boolean) => void
  setDraftSaveFailed: (failed: boolean) => void
  setInsertError: (kind: 'image' | 'qr' | null) => void
  setStartTour: (start: DesignerState['startTour']) => void
  setCropper: (state: { open: boolean; src?: string; targetId?: string }) => void
}
