import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDeviceCapabilities } from './use-device-capabilities'

// Mock motion/react
vi.mock('motion/react', () => ({
  useReducedMotion: vi.fn(() => false),
}))

describe('useDeviceCapabilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(hover: hover)' || query === '(pointer: fine)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('detects desktop-like capabilities (hover and fine pointer)', () => {
    const { result } = renderHook(() => useDeviceCapabilities())
    
    expect(result.current.hasHover).toBe(true)
    expect(result.current.hasFinePointer).toBe(true)
    expect(result.current.isTouch).toBe(false)
    expect(result.current.prefersReducedMotion).toBe(false)
  })

  it('detects touch capabilities', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(pointer: coarse)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    const { result } = renderHook(() => useDeviceCapabilities())
    
    expect(result.current.hasHover).toBe(false)
    expect(result.current.hasFinePointer).toBe(false)
    expect(result.current.isTouch).toBe(true)
  })
})
