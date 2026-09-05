import { describe, it, expect } from 'vitest';
import { romanToArabic } from './roman';

describe('romanToArabic', () => {
  it('reads additive numerals', () => {
    expect(romanToArabic('I')).toBe(1);
    expect(romanToArabic('II')).toBe(2);
    expect(romanToArabic('XXX')).toBe(30);
    expect(romanToArabic('MMXXVI')).toBe(2026);
  });

  it('applies the subtractive rule', () => {
    expect(romanToArabic('IV')).toBe(4);
    expect(romanToArabic('IX')).toBe(9);
    expect(romanToArabic('XL')).toBe(40);
    expect(romanToArabic('XC')).toBe(90);
    expect(romanToArabic('CM')).toBe(900);
    expect(romanToArabic('XXIX')).toBe(29);
  });

  it('is case-insensitive and ignores surrounding whitespace', () => {
    expect(romanToArabic('xiv')).toBe(14);
    expect(romanToArabic('  XIV  ')).toBe(14);
  });

  it('returns null for anything outside the Roman alphabet', () => {
    expect(romanToArabic('ABC')).toBeNull();
    expect(romanToArabic('42')).toBeNull();
    expect(romanToArabic('X-II')).toBeNull();
  });

  it('returns null for empty input', () => {
    expect(romanToArabic('')).toBeNull();
    expect(romanToArabic('   ')).toBeNull();
  });

  it('accepts non-canonical spellings rather than grading them', () => {
    expect(romanToArabic('IIII')).toBe(4);
  });
});
