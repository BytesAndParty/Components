/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { renderHydrated } from '../../lib/render-hydrated'
import { AtelierProvider } from '../provider'
import { ATELIER_KEYS, useAtelier } from '../atelier-context'

function Probe() {
  const { theme, accent, locale } = useAtelier()
  return <p data-testid="probe">{`${theme}|${accent}|${locale}`}</p>
}

describe('AtelierProvider hydration', () => {
  afterEach(() => {
    localStorage.clear()
    document.body.innerHTML = ''
  })

  it('hydrates the defaults without a mismatch, then adopts the stored values', async () => {
    localStorage.setItem(ATELIER_KEYS.theme, 'light')
    localStorage.setItem(ATELIER_KEYS.accent, 'amber')
    localStorage.setItem(ATELIER_KEYS.locale, 'en')

    const { container, html, problems, unmount } = await renderHydrated(
      <AtelierProvider>
        <Probe />
      </AtelierProvider>,
    )

    // The server has no localStorage: its HTML carries the defaults.
    expect(html).toContain('dark|indigo|de')
    expect(problems).toEqual([])
    expect(container.querySelector('[data-testid="probe"]')?.textContent).toBe('light|amber|en')
    await unmount()
  })
})
