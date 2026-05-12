import type { ComponentMessages } from '../i18n'

export type LayerPanelMessages = {
  deleteLayer: string
  renameLayer: string
  dragHandle: string
  visibility: string
  lock: string
  layersHeader: string
  noObjects: string
}

export const MESSAGES = {
  de: {
    deleteLayer: 'Ebene löschen',
    renameLayer: 'Ebene umbenennen',
    dragHandle:  'Zum Sortieren ziehen (Shift + ↑/↓)',
    visibility:  'Sichtbarkeit umschalten',
    lock:        'Sperre umschalten',
    layersHeader: 'Ebenen',
    noObjects: 'Noch keine Objekte. Füge Text, Bilder oder Formen hinzu.',
  },
  en: {
    deleteLayer: 'Delete layer',
    renameLayer: 'Rename layer',
    dragHandle:  'Drag to reorder (Shift + ↑/↓)',
    visibility:  'Toggle visibility',
    lock:        'Toggle lock',
    layersHeader: 'Layers',
    noObjects: 'No objects yet. Add text, images or shapes to the canvas.',
  },
} as const satisfies ComponentMessages<LayerPanelMessages>
