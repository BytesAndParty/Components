import type { FabricObjectMeta } from '../store/types'
import type { ValidationWarning } from '../../validator-badge/validator-badge'

/**
 * Pflichtangaben auf EU-Weinetiketten.
 * Rechtsgrundlage: VO (EU) Nr. 1308/2013 (Marktorganisation Wein),
 * Delegierte VO (EU) 2019/33, VO (EU) 2021/2117 (geänderte Kennzeichnung),
 * VO (EU) 2023/2977 (Nährwerte & Zutaten ab 08.12.2023).
 *
 * `label` = Feldname (Headline im Popover).
 * `description` = Begründung: warum es fehlt + welche Verordnung es vorschreibt.
 */
const MANDATORY_KEYS = [
  {
    key: 'alcoholPercent',
    label: 'Alkoholgehalt (% vol)',
    description:
      'Pflichtangabe nach Anhang VII Teil II VO (EU) 1308/2013 — vorhandener Alkoholgehalt in Volumenprozent mit max. einer Dezimale.',
    severity: 'error',
  },
  {
    key: 'volumeMl',
    label: 'Nennfüllmenge (ml/cl/l)',
    description:
      'Pflichtangabe nach VO (EU) 2019/33 — Nennvolumen ist gesetzlich vorgeschriebene Mengenangabe und muss auf der Etikettenvorderseite sichtbar sein.',
    severity: 'error',
  },
  {
    key: 'allergenNote',
    label: 'Allergenhinweis (Sulfite)',
    description:
      'Pflichtangabe nach VO (EU) 1169/2011 Anhang II — Sulfite > 10 mg/l SO₂ müssen ausgewiesen sein („enthält Sulfite" / „contains sulphites").',
    severity: 'error',
  },
  {
    key: 'countryOfOrigin',
    label: 'Herkunftsland',
    description:
      'Pflichtangabe nach VO (EU) 1308/2013 Art. 119 — Ursprungsland bzw. Erzeugungsregion muss klar erkennbar sein.',
    severity: 'error',
  },
  {
    key: 'qrCode',
    label: 'QR-Code (Nährwerte & Zutaten)',
    description:
      'Pflichtangabe nach VO (EU) 2023/2977 (gültig seit 08.12.2023) — vollständige Nährwertdeklaration & Zutatenliste dürfen per QR-Code/Off-Label-Link bereitgestellt werden; Brennwert (kcal) muss zusätzlich on-label stehen.',
    severity: 'warning',
  },
] as const

export function validateCompliance(objects: FabricObjectMeta[]): ValidationWarning[] {
  const presentKeys = new Set(objects.map(o => o._fieldKey).filter(Boolean))

  const warnings: ValidationWarning[] = []

  for (const mandatory of MANDATORY_KEYS) {
    if (!presentKeys.has(mandatory.key)) {
      warnings.push({
        key: mandatory.key,
        label: mandatory.label,
        description: mandatory.description,
        severity: mandatory.severity as 'error' | 'warning',
      })
    }
  }

  return warnings
}
