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

    setActiveArea: (activeArea: LabelArea) => set({ activeArea }),
    setZoom: (zoom: number) => set({ zoom }),
    setActiveTool: (activeTool) => set({ activeTool }),
    setSelectedIds: (selectedIds: string[]) => set({ selectedIds }),
    setDirty: (isDirty: boolean) => set({ isDirty }),
  }))
)
