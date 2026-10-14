import type { KeyboardEvent } from 'react'

/**
 * WAI-ARIA toolbar keys for a `role="toolbar"` container: the arrow keys of
 * its orientation move focus to the previous / next button (wrapping),
 * Home / End to the first / last. Only acts while a button has focus —
 * inputs inside the toolbar (number fields) keep their own arrow keys.
 * Buttons marked `aria-disabled` stay reachable, so their tooltip can say
 * why they are unavailable.
 */
export function toolbarArrowKeys(orientation: 'horizontal' | 'vertical') {
  const prev = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
  const next = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
  return (e: KeyboardEvent<HTMLElement>) => {
    // A nested toolbar (e.g. the AlignmentBar) already moved focus.
    if (e.defaultPrevented) return
    if (!(e.target instanceof HTMLButtonElement)) return
    if (e.key !== prev && e.key !== next && e.key !== 'Home' && e.key !== 'End') return
    const buttons = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')]
    const i = buttons.indexOf(e.target)
    if (i === -1) return
    const target =
      e.key === 'Home' ? buttons[0]
      : e.key === 'End' ? buttons[buttons.length - 1]
      : buttons[(i + (e.key === next ? 1 : -1) + buttons.length) % buttons.length]
    e.preventDefault()
    target.focus()
  }
}
