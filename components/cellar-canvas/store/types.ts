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

/** What a notice above the canvas reports: a failed image or QR insert, or a failed export. */
export type NoticeKind = 'image' | 'qr' | 'export'

export interface FabricObjectMeta {
  id: string
  _layerName: string
  _type: 'text' | 'wine-field' | 'image' | 'rect' | 'circle' | 'line' | 'group' | 'qr-code' | 'path'
  _fieldKey?: string
  _locked?: boolean
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
  /** Last autosave write failed (quota exceeded / storage blocked). */
  draftSaveFailed: boolean
  /** The autosave warning was closed. A successful write re-arms it for the next failure. */
  draftNoticeDismissed: boolean
  /**
   * What last went wrong (see `NoticeKind`). `id` changes with every failure
   * so a repeat of the same error is announced again. Cleared by the next
   * successful insert or export, or by closing the notice.
   */
  notice: { kind: NoticeKind; id: number } | null
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
  setDraftSaveFailed: (failed: boolean) => void
  dismissDraftNotice: () => void
  setNotice: (kind: NoticeKind | null) => void
  setCropper: (state: { open: boolean; src?: string; targetId?: string }) => void
}
