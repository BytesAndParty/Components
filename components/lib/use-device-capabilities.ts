import { useState, useEffect } from 'react'
import { useReducedMotion } from 'motion/react'

export interface DeviceCapabilities {
  /** True on devices with real hover (mouse/trackpad). Gates hover animations. */
  hasHover: boolean
  /** True on precise pointer devices (mouse/stylus). False on touch-only. */
  hasFinePointer: boolean
  /** True when OS prefers reduced motion. Disable or shorten all animations. */
  prefersReducedMotion: boolean
  /** True on touch-primary devices — use touch-friendly targets (≥ 44px). */
  isTouch: boolean
}

function queryCapabilities(): Omit<DeviceCapabilities, 'prefersReducedMotion'> {
  if (typeof window === 'undefined') {
    return { hasHover: true, hasFinePointer: true, isTouch: false }
  }
  return {
    hasHover:      window.matchMedia('(hover: hover)').matches,
    hasFinePointer: window.matchMedia('(pointer: fine)').matches,
    isTouch:       window.matchMedia('(pointer: coarse)').matches,
  }
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [caps, setCaps] = useState(queryCapabilities)

  useEffect(() => {
    const queries = [
      window.matchMedia('(hover: hover)'),
      window.matchMedia('(pointer: fine)'),
      window.matchMedia('(pointer: coarse)'),
    ]
    const handler = () => setCaps(queryCapabilities())
    queries.forEach(q => q.addEventListener('change', handler))
    return () => queries.forEach(q => q.removeEventListener('change', handler))
  }, [])

  return { ...caps, prefersReducedMotion }
}
