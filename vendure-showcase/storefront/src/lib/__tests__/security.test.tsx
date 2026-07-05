/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WineText } from '../wine-text';
import { isValidWineSlug, wineHref } from '../utils';

describe('Security: Render Seams & Input Validation', () => {

  describe('WineText (XSS Protection)', () => {
    it('escapes HTML tags in custom field content', () => {
      const maliciousInput = '<script>alert("xss")</script><b>Bold Content</b>';
      
      render(<WineText>{maliciousInput}</WineText>);

      // React should escape everything. We should see the literal text.
      // queryByText with a string will look for the exact text content of the DOM node.
      expect(screen.getByText(maliciousInput)).toBeDefined();
      
      // The script tag should not be in the DOM as an element
      const script = document.querySelector('script');
      expect(script).toBeNull();
      
      // The bold tag should not be rendered as an element either
      const bold = document.querySelector('b');
      expect(bold).toBeNull();
    });

    it('handles null/undefined gracefully', () => {
      const { container: c1 } = render(<WineText>{null}</WineText>);
      expect(c1.innerHTML).toBe('');

      render(<WineText fallback="No info">{undefined}</WineText>);
      expect(screen.getByText('No info')).toBeDefined();
    });
  });

  describe('isValidWineSlug (Path Traversal & Injection Protection)', () => {
    it('accepts valid kebab-case slugs', () => {
      expect(isValidWineSlug('blaufränkisch-reserve')).toBe(false); // contains 'ä' - wait, is 'ä' allowed?
      // Re-checking the regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
      // Only [a-z0-9] is allowed. 'ä' is not allowed.
      expect(isValidWineSlug('blaufraenkisch-reserve')).toBe(true);
      expect(isValidWineSlug('wine-2021')).toBe(true);
    });

    it('rejects path traversal attempts', () => {
      expect(isValidWineSlug('../admin')).toBe(false);
      expect(isValidWineSlug('wine/../../etc/passwd')).toBe(false);
    });

    it('rejects protocol injection', () => {
      expect(isValidWineSlug('javascript:alert(1)')).toBe(false);
      expect(isValidWineSlug('data:text/html,xss')).toBe(false);
    });

    it('rejects non-kebab-case or malformed strings', () => {
      expect(isValidWineSlug('Wine-Name')).toBe(false); // Uppercase
      expect(isValidWineSlug('wine--name')).toBe(false); // Double hyphen
      expect(isValidWineSlug('-wine')).toBe(false); // Leading hyphen
      expect(isValidWineSlug('wine-')).toBe(false); // Trailing hyphen
      expect(isValidWineSlug('wine name')).toBe(false); // Space
    });

    it('respects length limits', () => {
      expect(isValidWineSlug('a'.repeat(100))).toBe(true);
      expect(isValidWineSlug('a'.repeat(101))).toBe(false);
    });
  });

  describe('wineHref (Safe Link Generation)', () => {
    it('returns valid route for safe slugs', () => {
      expect(wineHref('valid-slug')).toBe('/wine/valid-slug');
    });

    it('returns fallback for dangerous slugs', () => {
      expect(wineHref('javascript:alert(1)')).toBe('/');
      expect(wineHref('../secret')).toBe('/');
    });
  });
});
