import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { DesignerState, LabelArea } from './types'

export const useDesignerStore = create<DesignerState>()(
  subscribeWithSelector((set) => ({
    activeArea: 'front',
    zoom: 1,
    activeTool: 'select',
    selectedIds: [],
    history: [],
    historyIndex: -1,
    isDragging: false,
    isDirty: false,
    snappingEnabled: true,
    cropperOpen: false,
    cropperSrc: undefined,
    cropperTargetId: undefined,

    setActiveArea: (activeArea: LabelArea) => set({ activeArea }),
    setZoom: (zoom: number) => set({ zoom }),
    setActiveTool: (activeTool) => set({ activeTool }),
    setSelectedIds: (selectedIds: string[]) => set({ selectedIds }),
    setDirty: (isDirty: boolean) => set({ isDirty }),
    setSnappingEnabled: (snappingEnabled: boolean) => set({ snappingEnabled }),
    setCropper: (cropper) => set({ 
      cropperOpen: cropper.open, 
      cropperSrc: cropper.src, 
      cropperTargetId: cropper.targetId 
    }),

    pushHistory: (state: string) => set((s) => {
      const newHistory = s.history.slice(0, s.historyIndex + 1)
      newHistory.push(state)
      // Limit history to 50 steps
      if (newHistory.length > 50) newHistory.shift()
      return { 
        history: newHistory, 
        historyIndex: newHistory.length - 1,
        isDirty: true 
      }
    }),

    undo: () => set((s) => {
      if (s.historyIndex <= 0) return {}
      return { historyIndex: s.historyIndex - 1 }
    }),

    redo: () => set((s) => {
      if (s.historyIndex >= s.history.length - 1) return {}
      return { historyIndex: s.historyIndex + 1 }
    }),
  }))
)
