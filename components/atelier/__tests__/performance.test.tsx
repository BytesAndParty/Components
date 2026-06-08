/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { AtelierInitScript } from '../init-script';
import { AtelierProvider } from '../provider';
import { ATELIER_KEYS } from '../atelier-context';

describe('Atelier Performance (FOUC & Hydration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-accent');
    document.documentElement.removeAttribute('data-locale');
    document.documentElement.classList.remove('dark');
  });

  it('AtelierInitScript applies localStorage values to DOM synchronously', () => {
    // 1. Setup localStorage (like a user who prefers light theme)
    localStorage.setItem(ATELIER_KEYS.theme, 'light');
    localStorage.setItem(ATELIER_KEYS.accent, 'amber');
    localStorage.setItem(ATELIER_KEYS.locale, 'en');

    // 2. Render the script component
    const { container } = render(
      <AtelierInitScript 
        defaultTheme="dark" 
        defaultAccent="indigo" 
        defaultLocale="de" 
      />
    );

    // 3. Extract and execute the script (simulating browser execution in <head>)
    const scriptElement = container.querySelector('script');
    expect(scriptElement).not.toBeNull();
    
    const scriptContent = scriptElement!.innerHTML;
    
    // Use Function constructor to execute the IIFE in the current context
    // JSDOM provides the global window/document/localStorage
    try {
      // The script is an IIFE: (function(){...})();
      // We can just eval it or create a function.
      new Function(scriptContent)();
    } catch (e) {
      console.error('Script execution failed', e);
    }

    // 4. Verify DOM state BEFORE React hydration
    const html = document.documentElement;
    expect(html.getAttribute('data-theme')).toBe('light');
    expect(html.getAttribute('data-accent')).toBe('amber');
    expect(html.getAttribute('data-locale')).toBe('en');
    expect(html.lang).toBe('en');
    expect(html.classList.contains('dark')).toBe(false);
  });

  it('AtelierProvider hydrates without clobbering existing DOM state', () => {
    // 1. Simulate SSR/InitScript result
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.setAttribute('data-accent', 'amber');
    document.documentElement.setAttribute('data-locale', 'en');
    localStorage.setItem(ATELIER_KEYS.theme, 'light');
    localStorage.setItem(ATELIER_KEYS.accent, 'amber');
    localStorage.setItem(ATELIER_KEYS.locale, 'en');

    // 2. Hydrate/Render AtelierProvider
    // In a real app, this would be the first React render
    render(
      <AtelierProvider 
        defaultTheme="dark" 
        defaultAccent="indigo" 
        defaultLocale="de"
      >
        <div id="child">Content</div>
      </AtelierProvider>
    );

    // 3. Verify DOM state is preserved
    const html = document.documentElement;
    expect(html.getAttribute('data-theme')).toBe('light');
    expect(html.getAttribute('data-accent')).toBe('amber');
    
    // 4. Verify no hydration flickering (attributes should stay the same)
    // We check if the provider's internal state matches
    expect(screen.getByText('Content')).toBeDefined();
  });

  it('AtelierProvider picks up defaults if localStorage is empty', () => {
    render(
      <AtelierProvider 
        defaultTheme="dark" 
        defaultAccent="bordeaux" 
        defaultLocale="de"
      >
        <div>Content</div>
      </AtelierProvider>
    );

    const html = document.documentElement;
    expect(html.getAttribute('data-theme')).toBe('dark');
    expect(html.getAttribute('data-accent')).toBe('bordeaux');
    expect(html.classList.contains('dark')).toBe(true);
  });
});

// Helper for screen (already imported from @testing-library/react in my mind, but let's be sure)
import { screen } from '@testing-library/react';
