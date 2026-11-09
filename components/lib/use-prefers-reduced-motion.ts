import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/**
 * True when the OS asks for reduced motion.
 *
 * Hydration-safe: the server and the hydration render report `false`, so the
 * markup matches; the real value follows right after hydration. Reading
 * `matchMedia` in a `useState` initializer instead would make a reduced-motion
 * client start with other styles than the server HTML, and React does not
 * patch up attribute mismatches (the server styles would stay).
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false)
}
