import type { ComponentMessages } from '../i18n'

export type AlignmentBarMessages = {
  alignLeft: string
  alignCenterH: string
  alignRight: string
  alignTop: string
  alignCenterV: string
  alignBottom: string
  distributeH: string
  distributeV: string
  ariaLabel: string
}

export const MESSAGES = {
  de: {
    alignLeft: 'Links ausrichten',
    alignCenterH: 'Horizontal zentrieren',
    alignRight: 'Rechts ausrichten',
    alignTop: 'Oben ausrichten',
    alignCenterV: 'Vertikal zentrieren',
    alignBottom: 'Unten ausrichten',
    distributeH: 'Horizontal verteilen',
    distributeV: 'Vertikal verteilen',
    ariaLabel: 'Objekt-Ausrichtung',
  },
  en: {
    alignLeft: 'Align left',
    alignCenterH: 'Align center horizontal',
    alignRight: 'Align right',
    alignTop: 'Align top',
    alignCenterV: 'Align center vertical',
    alignBottom: 'Align bottom',
    distributeH: 'Distribute horizontally',
    distributeV: 'Distribute vertically',
    ariaLabel: 'Object alignment',
  },
} as const satisfies ComponentMessages<AlignmentBarMessages>
