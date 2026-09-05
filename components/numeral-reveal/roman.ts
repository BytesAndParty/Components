const ROMAN_VALUES: Record<string, number> = {
  I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000,
};

/**
 * Converts a Roman numeral to its Arabic value, subtractive notation included
 * (IV = 4, XL = 40). Returns `null` for anything that is not a valid Roman
 * numeral, so callers can fall back instead of guessing or throwing.
 *
 * Note: this validates the *alphabet*, not the orthography — it accepts
 * non-canonical spellings such as `IIII` (= 4). That is deliberate: the job is
 * to read a numeral a designer put on screen, not to grade it.
 */
export function romanToArabic(roman: string): number | null {
  const chars = Array.from(roman.trim().toUpperCase());
  if (chars.length === 0) return null;

  let total = 0;
  for (let i = 0; i < chars.length; i++) {
    const value = ROMAN_VALUES[chars[i]];
    if (value === undefined) return null;
    const next = ROMAN_VALUES[chars[i + 1]];
    total += next !== undefined && next > value ? -value : value;
  }
  return total;
}
