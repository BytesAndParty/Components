/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHydrated } from './render-hydrated'
import { usePrefersReducedMotion } from './use-prefers-reduced-motion'
import { BlurFade } from '../blur-fade/blur-fade'
import { RevealImage } from '../reveal-image/reveal-image'

function stubReducedMotion(matches: boolean) {
  vi.stubGlobal('matchMedia', (media: string) => ({
    matches,
    media,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

function Probe() {
  return <p data-testid="probe">{String(usePrefersReducedMotion())}</p>
}

describe('usePrefersReducedMotion hydration (reduced motion on)', () => {
  beforeEach(() => {
    stubReducedMotion(true)
    // The first, still non-reduced render of BlurFade and RevealImage observes the element.
    vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('hydrates the server value without a mismatch, then reports the real one', async () => {
    const { container, html, problems, unmount } = await renderHydrated(<Probe />)

    expect(html).toContain('>false<')
    expect(problems).toEqual([])
    expect(container.querySelector('[data-testid="probe"]')?.textContent).toBe('true')
    await unmount()
  })

  it('BlurFade ends up visible and without a transition', async () => {
    const { container, html, problems, unmount } = await renderHydrated(
      <BlurFade>content</BlurFade>,
    )

    expect(html).toContain('opacity:0')
    expect(problems).toEqual([])
    const el = container.firstElementChild as HTMLElement
    expect(el.style.opacity).toBe('1')
    expect(el.style.transition).toContain('none')
    await unmount()
  })

  it('RevealImage ends up revealed and without a transition', async () => {
    const { container, html, problems, unmount } = await renderHydrated(
      <RevealImage src="/x.jpg" alt="" />,
    )

    expect(html).toContain('clip-path:inset(100% 0 0 0)')
    expect(problems).toEqual([])
    // jsdom does not know `clip-path`, so the revealed state is read from the image.
    const img = container.querySelector('img') as HTMLElement
    expect(img.style.transform).toBe('scale(1)')
    expect(img.style.transition).toContain('none')
    await unmount()
  })
})
