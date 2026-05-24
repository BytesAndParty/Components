import type { ComponentMessages } from '../i18n'

export type StackOrderControlsMessages = {
  bringToFront: string
  bringForward: string
  sendBackward: string
  sendToBack: string
  ariaLabel: string
}

export const MESSAGES = {
  de: {
    bringToFront: 'In den Vordergrund',
    bringForward: 'Eine Ebene nach vorne',
    sendBackward: 'Eine Ebene nach hinten',
    sendToBack: 'In den Hintergrund',
    ariaLabel: 'Stapelreihenfolge',
  },
  en: {
    bringToFront: 'Bring to front',
    bringForward: 'Bring forward',
    sendBackward: 'Send backward',
    sendToBack: 'Send to back',
    ariaLabel: 'Stack order',
  },
} as const satisfies ComponentMessages<StackOrderControlsMessages>
