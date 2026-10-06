import { describe, it, expect } from 'vitest'
import { hasFieldValue } from './field-value'

describe('hasFieldValue', () => {
  it('accepts non-blank strings and finite numbers', () => {
    expect(hasFieldValue('Zweigelt')).toBe(true)
    expect(hasFieldValue('0')).toBe(true)
    expect(hasFieldValue(2023)).toBe(true)
    expect(hasFieldValue(0)).toBe(true)
  })

  it('rejects null, undefined, blank strings and non-finite numbers', () => {
    expect(hasFieldValue(null)).toBe(false)
    expect(hasFieldValue(undefined)).toBe(false)
    expect(hasFieldValue('')).toBe(false)
    expect(hasFieldValue('   ')).toBe(false)
    expect(hasFieldValue(Number.NaN)).toBe(false)
    expect(hasFieldValue(Number.POSITIVE_INFINITY)).toBe(false)
  })
})
