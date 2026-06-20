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
    snappingEnabled: true,
    cropperOpen: false,
    cropperSrc: undefined,
    cropperTargetId: undefined,

    setActiveArea: (activeArea: LabelArea) => set({ activeArea }),
    setZoom: (zoom: number) => set({ zoom }),
    setActiveTool: (activeTool) => set({ activeTool }),
    setSelectedIds: (selectedIds: string[]) => set({ selectedIds }),
    setDirty: (isDirty: boolean) => set({ isDirty }),
    setHistoryFlags: (canUndo: boolean, canRedo: boolean) => set({ canUndo, canRedo }),
    setSnappingEnabled: (snappingEnabled: boolean) => set({ snappingEnabled }),
    setCropper: (cropper) => set({
      cropperOpen: cropper.open,
      cropperSrc: cropper.src,
      cropperTargetId: cropper.targetId
    }),
  }))
)
