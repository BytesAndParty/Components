import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility', () => {
  it('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-2', 'p-4')).toBe('p-4')
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  it('handles conditional classes', () => {
    // eslint-disable-next-line no-constant-binary-expression -- intentional: simulates app code patterns like `isActive && 'cls'`
    expect(cn('px-2', true && 'py-2', false && 'm-4')).toBe('px-2 py-2')
    expect(cn('px-2', undefined, null, 'py-2')).toBe('px-2 py-2')
  })

  it('handles object syntax', () => {
    expect(cn({ 'px-2': true, 'm-4': false })).toBe('px-2')
  })
})
