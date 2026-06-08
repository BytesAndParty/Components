import { describe, it, expect } from 'vitest';
import { validateCompliance } from '../validator';
import type { FabricObjectMeta } from '../../store/types';

describe('Compliance: Label Validator (EU 2023/2977)', () => {
  it('returns errors for all missing mandatory fields', () => {
    const objects: FabricObjectMeta[] = [];
    const warnings = validateCompliance(objects);

    // Expecting 5 warnings based on MANDATORY_KEYS
    expect(warnings).toHaveLength(5);
    expect(warnings.some(w => w.key === 'alcoholPercent')).toBe(true);
    expect(warnings.some(w => w.key === 'qrCode')).toBe(true);
  });

  it('removes warning when a mandatory field is added', () => {
    const objects: FabricObjectMeta[] = [
      { id: '1', _type: 'wine-field', _fieldKey: 'alcoholPercent' } as any,
    ];
    const warnings = validateCompliance(objects);

    expect(warnings).toHaveLength(4);
    expect(warnings.some(w => w.key === 'alcoholPercent')).toBe(false);
  });

  it('passes when all mandatory fields are present', () => {
    const objects: FabricObjectMeta[] = [
      { id: '1', _type: 'wine-field', _fieldKey: 'alcoholPercent' } as any,
      { id: '2', _type: 'wine-field', _fieldKey: 'volumeMl' } as any,
      { id: '3', _type: 'wine-field', _fieldKey: 'allergenNote' } as any,
      { id: '4', _type: 'wine-field', _fieldKey: 'countryOfOrigin' } as any,
      { id: '5', _type: 'wine-field', _fieldKey: 'qrCode' } as any,
    ];
    const warnings = validateCompliance(objects);

    expect(warnings).toHaveLength(0);
  });

  it('distinguishes between errors and warnings (severity)', () => {
    const objects: FabricObjectMeta[] = [];
    const warnings = validateCompliance(objects);

    const errorKeys = ['alcoholPercent', 'volumeMl', 'allergenNote', 'countryOfOrigin'];
    const warningKeys = ['qrCode'];

    warnings.forEach(w => {
      if (errorKeys.includes(w.key)) {
        expect(w.severity).toBe('error');
      } else if (warningKeys.includes(w.key)) {
        expect(w.severity).toBe('warning');
      }
    });
  });
});
