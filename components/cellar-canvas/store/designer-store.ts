import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { DesignerState, LabelArea } from './types'

export const useDesignerStore = create<DesignerState>()(
  subscribeWithSelector((set) => ({
    activeArea: 'front',
    zoom: 1,
    activeTool: 'select',
    selectedIds: [],
    isDragging: false,
    isDirty: false,
    canUndo: false,
    canRedo: false,
    draftSaveFailed: false,
    insertError: null,
    cropperOpen: false,
    cropperSrc: undefined,
    cropperTargetId: undefined,

    setActiveArea: (activeArea: LabelArea) => set({ activeArea }),
    setZoom: (zoom: number) => set({ zoom }),
    setActiveTool: (activeTool) => set({ activeTool }),
    setSelectedIds: (selectedIds: string[]) => set({ selectedIds }),
    setDirty: (isDirty: boolean) => set({ isDirty }),
    setHistoryFlags: (canUndo: boolean, canRedo: boolean) => set({ canUndo, canRedo }),
    setDraftSaveFailed: (draftSaveFailed: boolean) => set({ draftSaveFailed }),
    setInsertError: (kind) => set((s) => ({
      insertError: kind ? { kind, id: (s.insertError?.id ?? 0) + 1 } : null,
    })),
    setCropper: (cropper) => set({
      cropperOpen: cropper.open,
      cropperSrc: cropper.src,
      cropperTargetId: cropper.targetId
    }),
  }))
)

/**
 * `.catch` handler for the image-preparation chains (file picker, drop, paste,
 * replace, cropper): shows the header hint instead of an unhandled rejection.
 */
export const reportImageError = () => useDesignerStore.getState().setInsertError('image')
