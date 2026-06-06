// fallow-ignore-file security-sink — inline FOUC script: only JSON.stringify'd
// internal constants / dev-supplied props are interpolated (no user input), and
// any "</script>" breakout is neutralized before render (see below).
import { ATELIER_KEYS } from './atelier-context'

/**
 * AtelierInitScript — FOUC prevention for SSR frameworks (Astro, Next.js).
 *
 * Place this as the FIRST element inside <head>. It runs synchronously
 * before the browser paints, reading localStorage and setting the correct
 * data-theme, data-accent, and lang attributes on <html> immediately.
 *
 * Without this, users see a flash of the wrong theme/accent/locale
 * on first load before React hydrates and AtelierProvider takes over.
 *
 * Astro:
 *   <head>
 *     <AtelierInitScript client:only="react" />  ← or as a plain script
 *   </head>
 *
 * Next.js App Router:
 *   // app/layout.tsx
 *   import { AtelierInitScript } from '@/components/atelier'
 *   export default function RootLayout({ children }) {
 *     return <html><head><AtelierInitScript /></head><body>{children}</body></html>
 *   }
 */

interface AtelierInitScriptProps {
  defaultTheme?:  string
  defaultAccent?: string
  defaultLocale?: string
}

export function AtelierInitScript({
  defaultTheme  = 'dark',
  defaultAccent = 'indigo',
  defaultLocale = 'de',
}: AtelierInitScriptProps) {
  const script = `(function(){
    try {
      var s = window.localStorage;
      var t = s.getItem(${JSON.stringify(ATELIER_KEYS.theme)})  || ${JSON.stringify(defaultTheme)};
      var a = s.getItem(${JSON.stringify(ATELIER_KEYS.accent)}) || ${JSON.stringify(defaultAccent)};
      var l = s.getItem(${JSON.stringify(ATELIER_KEYS.locale)}) || ${JSON.stringify(defaultLocale)};
      var d = document.documentElement;
      d.setAttribute('data-theme',  t);
      d.setAttribute('data-accent', a);
      d.setAttribute('data-locale', l);
      d.lang = l;
      if (t === 'dark') d.classList.add('dark');
    } catch(e) {}
  })();`

  // Defense-in-depth: even though only dev-controlled defaults are interpolated,
  // neutralize any "</script>" so a value can never break out of the tag.
  const inline = script.replace(/<\/(script)/gi, '<\\/$1')

  return <script dangerouslySetInnerHTML={{ __html: inline }} />
}
