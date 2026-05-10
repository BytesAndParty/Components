import type { Layer } from '../layer-panel/layer-panel'
import type { ValidationWarning } from '../../validator-badge/validator-badge'

/**
 * Mandatory fields for EU Regulation 2023/2977
 */
const MANDATORY_KEYS = [
  { key: 'alcoholPercent', label: 'Alcohol percentage', description: 'Required by EU Reg. 1308/2013', severity: 'error' },
  { key: 'volumeMl',       label: 'Volume (ml)',        description: 'Nominal volume is mandatory', severity: 'error' },
  { key: 'allergenNote',   label: 'Allergen note',      description: 'Contains sulphites — mandatory', severity: 'error' },
  { key: 'qrCode',         label: 'QR code (nutritional info)', description: 'EU Reg. 2023/2977 requires nutritional declaration', severity: 'warning' },
] as const

export function validateCompliance(layers: any[]): ValidationWarning[] {
  const presentKeys = new Set(layers.map(l => l._fieldKey).filter(Boolean))
  
  const warnings: ValidationWarning[] = []
  
  for (const mandatory of MANDATORY_KEYS) {
    if (!presentKeys.has(mandatory.key)) {
      warnings.push({
        key: mandatory.key,
        label: mandatory.label,
        description: mandatory.description,
        severity: mandatory.severity as 'error' | 'warning'
      })
    }
  }
  
  return warnings
}
