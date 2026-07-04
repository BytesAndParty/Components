import { test, expect } from '@playwright/test';

// Complements responsive.test.ts (which only guards horizontal overflow +
// broken images). This suite enforces the two mobile-design rules the overflow
// check can't see: interactive CTAs must meet the 44px touch-target minimum
// (COMPONENT-GUIDELINES §7 / WCAG 2.5.5), and body/label text must not fall
// below the ~9px legibility floor. Each section is rendered in "stack" mode
// (keyboard M in the showcase) so every variant is asserted at once.

const MIN_TAP = 44;
const MIN_FONT = 9; // uppercase eyebrow labels bottom out at 9px by brand design

// Per route, the CTA labels that must render at >= 44px tall. These are the
// secondary text-links/buttons the audit flagged as 17-25px. Segmented controls
// (pricing billing toggle, showcase format picker) are intentionally excluded —
// they're not in this list.
const TAP_CTAS: Record<string, string[]> = {
  '/hero': ['Unsere Winzer kennenlernen', 'oder als Abo', 'How it works', 'Die Weine'],
  '/showcase': ['Anfragen'],
  '/storefront': ['Entdecken', 'Detailansicht', 'Anfragen'],
  '/cta': ['Unser Versprechen', 'Platz erbitten'],
  '/footer': [
    'Impressum', 'Datenschutz', 'AGB', 'Eintragen',
    'Instagram', 'Newsletter', 'Händlerportal',
    'Funktionen', 'Preise', 'FAQ', 'Facebook',
  ],
}

// True when the element lives inside a position:fixed/sticky subtree — i.e. the
// showcase chrome (command bar, favorite heart), not the section under test.
const IN_CHROME = (el: Element): boolean => {
  let n: Element | null = el
  while (n && n !== document.body) {
    const p = getComputedStyle(n).position
    if (p === 'fixed' || p === 'sticky') return true
    n = n.parentElement
  }
  return false
}

async function enableStackMode(page: import('@playwright/test').Page) {
  // The showcase toggles single <-> stack on the "M" hotkey. Stack renders all
  // variants so every one gets audited in a single pass.
  await page.keyboard.press('m')
  await expect
    .poll(async () => page.locator('article').count(), { timeout: 5000 })
    .toBeGreaterThan(0)
}

test.describe('Mobile touch targets + legibility — section-showcase', () => {
  for (const [route, labels] of Object.entries(TAP_CTAS)) {
    test(`CTAs meet 44px tap target @ ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' })
      await enableStackMode(page)

      const measured = await page.evaluate(
        ({ labels, inChromeSrc }) => {
          const inChrome = new Function('el', `return (${inChromeSrc})(el)`) as (el: Element) => boolean
          const results: { label: string; found: number; minHeight: number }[] = []
          const controls = [...document.querySelectorAll('a, button, [role="button"]')]
          for (const label of labels) {
            const matches = controls.filter(
              (el) => !inChrome(el) && (el.textContent || '').trim().includes(label),
            )
            const heights = matches.map((el) => el.getBoundingClientRect().height)
            results.push({
              label,
              found: matches.length,
              minHeight: heights.length ? Math.min(...heights) : -1,
            })
          }
          return results
        },
        { labels, inChromeSrc: IN_CHROME.toString() },
      )

      for (const r of measured) {
        expect(r.found, `CTA "${r.label}" not found on ${route}`).toBeGreaterThan(0)
        expect(
          r.minHeight,
          `CTA "${r.label}" is ${r.minHeight}px tall on ${route} (< ${MIN_TAP}px tap target)`,
        ).toBeGreaterThanOrEqual(MIN_TAP - 1)
      }
    })
  }

  // Sections that used to carry hardcoded hex palettes (cream #fdfcf9 /
  // near-black #141110). After the semantic-token migration they must follow
  // the theme: their background has to differ between dark (:root) and light
  // ([data-theme="light"]). A frozen hex would read identical in both — this
  // catches a regression back to hardcoded colors.
  const THEME_ADAPTIVE_ROUTES = ['/cta', '/gallery', '/footer'] as const
  for (const route of THEME_ADAPTIVE_ROUTES) {
    test(`section backgrounds follow the theme @ ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' })
      await enableStackMode(page)

      const flipped = await page.evaluate(() => {
        const root = document.documentElement
        const surfaces = [...document.querySelectorAll('article section, article footer')]
        const bg = () => surfaces.map((el) => getComputedStyle(el).backgroundColor)

        root.setAttribute('data-theme', 'light')
        const light = bg()
        root.removeAttribute('data-theme') // back to dark (:root default)
        const dark = bg()

        // At least one surface must repaint when the theme flips.
        return light.some((c, i) => c !== dark[i])
      })

      expect(flipped, `no section on ${route} repaints between dark and light`).toBe(true)
    })
  }

  const FONT_ROUTES = ['/hero', '/showcase', '/storefront', '/cta', '/gallery', '/footer'] as const
  for (const route of FONT_ROUTES) {
    test(`no sub-${MIN_FONT}px text @ ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' })
      await enableStackMode(page)

      const tiny = await page.evaluate(
        ({ min, inChromeSrc }) => {
          const inChrome = new Function('el', `return (${inChromeSrc})(el)`) as (el: Element) => boolean
          const out: { fs: number; txt: string }[] = []
          const seen = new Set<string>()
          document
            .querySelectorAll('p,span,li,a,button,h1,h2,h3,h4,small,div,address')
            .forEach((el) => {
              if (inChrome(el)) return
              const hasDirectText = [...el.childNodes].some(
                (n) => n.nodeType === 3 && (n.textContent || '').trim(),
              )
              if (!hasDirectText) return
              const fs = parseFloat(getComputedStyle(el).fontSize)
              if (fs < min) {
                const txt = (el.textContent || '').trim().slice(0, 30)
                const key = `${fs}|${txt}`
                if (seen.has(key)) return
                seen.add(key)
                out.push({ fs, txt })
              }
            })
          return out
        },
        { min: MIN_FONT, inChromeSrc: IN_CHROME.toString() },
      )

      expect(
        tiny,
        `text below ${MIN_FONT}px on ${route}: ${tiny.map((t) => `${t.fs}px "${t.txt}"`).join(', ')}`,
      ).toEqual([])
    })
  }
})
