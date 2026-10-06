import { describe, it, expect } from 'vitest';
import { validateCompliance, type ValidatableObject } from './validator';
import type { FabricObjectMeta } from '../store/types';

describe('EU Compliance Label Validator', () => {
  it('returns all warnings when the canvas is empty', () => {
    const warnings = validateCompliance([]);
    expect(warnings.length).toBe(5);

    const keys = warnings.map(w => w.key);
    expect(keys).toContain('alcoholPercent');
    expect(keys).toContain('volumeMl');
    expect(keys).toContain('allergenNote');
    expect(keys).toContain('countryOfOrigin');
    expect(keys).toContain('qrCode');

    // Check that warning severity is correct
    const qrCodeWarning = warnings.find(w => w.key === 'qrCode');
    expect(qrCodeWarning?.severity).toBe('warning');

    const alcoholWarning = warnings.find(w => w.key === 'alcoholPercent');
    expect(alcoholWarning?.severity).toBe('error');
  });

  it('returns no warnings when all mandatory fields are present', () => {
    const mockObjects: FabricObjectMeta[] = [
      { id: '1', _layerName: 'Alcohol', _type: 'wine-field', _fieldKey: 'alcoholPercent' },
      { id: '2', _layerName: 'Volume', _type: 'wine-field', _fieldKey: 'volumeMl' },
      { id: '3', _layerName: 'Allergens', _type: 'wine-field', _fieldKey: 'allergenNote' },
      { id: '4', _layerName: 'Origin', _type: 'wine-field', _fieldKey: 'countryOfOrigin' },
      { id: '5', _layerName: 'QR Code', _type: 'qr-code', _fieldKey: 'qrCode' },
    ];

    const warnings = validateCompliance(mockObjects);
    expect(warnings.length).toBe(0);
  });

  it('returns warnings only for the missing fields', () => {
    const mockObjects: FabricObjectMeta[] = [
      { id: '1', _layerName: 'Alcohol', _type: 'wine-field', _fieldKey: 'alcoholPercent' },
      { id: '2', _layerName: 'Volume', _type: 'wine-field', _fieldKey: 'volumeMl' },
    ];

    const warnings = validateCompliance(mockObjects);
    expect(warnings.length).toBe(3);

    const keys = warnings.map(w => w.key);
    expect(keys).toContain('allergenNote');
    expect(keys).toContain('countryOfOrigin');
    expect(keys).toContain('qrCode');
    expect(keys).not.toContain('alcoholPercent');
    expect(keys).not.toContain('volumeMl');
  });

  it('ignores objects without a _fieldKey', () => {
    const mockObjects: FabricObjectMeta[] = [
      { id: '1', _layerName: 'Custom Label Text', _type: 'text' },
      { id: '2', _layerName: 'Background Image', _type: 'image' },
    ];

    const warnings = validateCompliance(mockObjects);
    expect(warnings.length).toBe(5);
  });

  it('counts only what gets printed: hidden fields and blank text are missing', () => {
    const objects: ValidatableObject[] = [
      { _fieldKey: 'alcoholPercent', visible: false, text: '13 % vol' },
      { _fieldKey: 'volumeMl', text: '   ' },
      { _fieldKey: 'allergenNote', text: 'enthält Sulfite' },
      { _fieldKey: 'qrCode', visible: true },
    ];

    const keys = validateCompliance(objects).map(w => w.key);
    expect(keys).toContain('alcoholPercent');
    expect(keys).toContain('volumeMl');
    expect(keys).not.toContain('allergenNote');
    expect(keys).not.toContain('qrCode');
  });
});
