import { act, type ReactElement } from 'react'
import { hydrateRoot, type Root } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { vi } from 'vitest'

/**
 * Test helper for hydration checks. Renders `ui` to a string (the "server"
 * HTML, where `useSyncExternalStore` reports its server snapshot), mounts that
 * HTML in a container and hydrates it with the same element.
 *
 * `problems` collects everything React reports about the hydration: recoverable
 * errors and the dev warnings for mismatching attributes or text. An empty list
 * means the client render matched the server HTML.
 */
export async function renderHydrated(ui: ReactElement) {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  const container = document.createElement('div')
  document.body.appendChild(container)
  const html = renderToString(ui)
  container.innerHTML = html

  const problems: unknown[] = []
  const consoleError = vi.spyOn(console, 'error').mockImplementation((...args) => {
    problems.push(args)
  })
  let root!: Root
  await act(async () => {
    root = hydrateRoot(container, ui, { onRecoverableError: (error) => problems.push(error) })
  })
  consoleError.mockRestore()

  return { container, html, problems, unmount: () => act(() => root.unmount()) }
}
