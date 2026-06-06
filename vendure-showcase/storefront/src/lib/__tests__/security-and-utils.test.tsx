import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { isValidWineSlug, wineHref } from '../utils';
import { WineText } from '../wine-text';
import { AtelierInitScript } from '@components/atelier';

describe('Security & Utility Tests', () => {
  describe('isValidWineSlug', () => {
    it('accepts valid kebab-case ASCII slugs', () => {
      expect(isValidWineSlug('blaufrankisch-reserve')).toBe(true);
      expect(isValidWineSlug('gruner-veltliner-2022')).toBe(true);
      expect(isValidWineSlug('chardonnay')).toBe(true);
      expect(isValidWineSlug('zweigelt-rose')).toBe(true);
    });

    it('rejects empty, undefined, or invalid type values', () => {
      expect(isValidWineSlug('')).toBe(false);
      expect(isValidWineSlug(undefined)).toBe(false);
      expect(isValidWineSlug(null)).toBe(false);
      expect(isValidWineSlug(123)).toBe(false);
      expect(isValidWineSlug({})).toBe(false);
    });

    it('rejects slugs with underscores or uppercase letters', () => {
      expect(isValidWineSlug('Blaufrankisch-Reserve')).toBe(false);
      expect(isValidWineSlug('blaufrankisch_reserve')).toBe(false);
    });

    it('rejects malformed kebab-case slugs', () => {
      expect(isValidWineSlug('double--hyphen')).toBe(false);
      expect(isValidWineSlug('-leading-hyphen')).toBe(false);
      expect(isValidWineSlug('trailing-hyphen-')).toBe(false);
      expect(isValidWineSlug('multiple---hyphens')).toBe(false);
    });

    it('rejects slugs longer than 100 characters', () => {
      const longSlug = 'a'.repeat(101);
      expect(isValidWineSlug(longSlug)).toBe(false);
      
      const exactLimitSlug = 'a'.repeat(100);
      expect(isValidWineSlug(exactLimitSlug)).toBe(true);
    });

    it('blocks security vectors like XSS payloads, traversal paths, or Unicode lookup manipulation', () => {
      expect(isValidWineSlug('javascript:alert(1)')).toBe(false);
      expect(isValidWineSlug('path/../traversal')).toBe(false);
      // Cyrillic "о" lookalike
      expect(isValidWineSlug('unicode-lооkalike-with-cyrillic-o')).toBe(false);
      expect(isValidWineSlug('<script>')).toBe(false);
      expect(isValidWineSlug('data:text/html,xss')).toBe(false);
    });
  });

  describe('wineHref', () => {
    it('generates detail path for valid slugs', () => {
      expect(wineHref('blaufrankisch')).toBe('/wine/blaufrankisch');
    });

    it('falls back to root for invalid slugs', () => {
      expect(wineHref('javascript:alert(1)')).toBe('/');
      expect(wineHref('Blaufrankisch-Reserve')).toBe('/');
      expect(wineHref(null)).toBe('/');
    });
  });

  describe('WineText Component', () => {
    it('renders text content safely and escapes HTML tags', () => {
      const payload = '<script>alert("XSS")</script>';
      render(<WineText>{payload}</WineText>);
      
      // React's auto-escaping renders this as text, it doesn't execute
      const textEl = screen.getByText(payload);
      expect(textEl).toBeDefined();
    });

    it('renders fallback when children is empty/null/undefined', () => {
      render(
        <div data-testid="fallback-test">
          <WineText children={null} fallback={<span>Keine Info</span>} />
        </div>
      );
      expect(screen.getByText('Keine Info')).toBeDefined();
    });
  });

  describe('AtelierInitScript FOUC Prevention', () => {
    it('generates valid script that correctly runs in the DOM to set attributes', () => {
      const defaultTheme = 'dark';
      const defaultAccent = 'bordeaux';
      const defaultLocale = 'de';
      
      const { container } = render(
        <AtelierInitScript
          defaultTheme={defaultTheme}
          defaultAccent={defaultAccent}
          defaultLocale={defaultLocale}
        />
      );
      
      const scriptEl = container.querySelector('script');
      expect(scriptEl).not.toBeNull();
      const scriptContent = scriptEl?.textContent || '';
      
      // Reset localStorage and documentElement classlist/attributes
      window.localStorage.clear();
      const doc = document.documentElement;
      doc.removeAttribute('data-theme');
      doc.removeAttribute('data-accent');
      doc.removeAttribute('data-locale');
      doc.lang = '';
      doc.classList.remove('dark');
      
      // Execute the script
      const runInitScript = new Function(scriptContent);
      runInitScript();
      
      // Expect default values to be set
      expect(doc.getAttribute('data-theme')).toBe(defaultTheme);
      expect(doc.getAttribute('data-accent')).toBe(defaultAccent);
      expect(doc.getAttribute('data-locale')).toBe(defaultLocale);
      expect(doc.lang).toBe(defaultLocale);
      expect(doc.classList.contains('dark')).toBe(true);
      
      // Set values in localStorage and verify the script uses them instead of defaults
      window.localStorage.setItem('atelier-theme', 'light');
      window.localStorage.setItem('atelier-accent', 'gold');
      window.localStorage.setItem('atelier-locale', 'en');
      doc.classList.remove('dark');
      
      runInitScript();
      
      expect(doc.getAttribute('data-theme')).toBe('light');
      expect(doc.getAttribute('data-accent')).toBe('gold');
      expect(doc.getAttribute('data-locale')).toBe('en');
      expect(doc.lang).toBe('en');
      expect(doc.classList.contains('dark')).toBe(false);
    });
  });
});
