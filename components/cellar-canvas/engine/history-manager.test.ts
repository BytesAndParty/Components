import { describe, it, expect } from 'vitest'
import { HistoryManager } from './history-manager'

describe('HistoryManager', () => {
  it('push / undo / redo navigate the stack', () => {
    const h = new HistoryManager()
    h.push('a')
    h.push('b')
    h.push('c')

    expect(h.canUndo).toBe(true)
    expect(h.canRedo).toBe(false)

    expect(h.undo()).toBe('b')
    expect(h.undo()).toBe('a')
    expect(h.undo()).toBe(null) // already at the start
    expect(h.canUndo).toBe(false)

    expect(h.redo()).toBe('b')
    expect(h.canRedo).toBe(true)
  })

  it('returns null for redo at the tip', () => {
    const h = new HistoryManager()
    h.push('a')
    expect(h.redo()).toBe(null)
    expect(h.canRedo).toBe(false)
  })

  it('caps the stack at the limit, dropping the oldest', () => {
    const h = new HistoryManager(3)
    h.push('a')
    h.push('b')
    h.push('c')
    h.push('d') // 'a' falls off → [b, c, d]

    expect(h.undo()).toBe('c')
    expect(h.undo()).toBe('b')
    expect(h.undo()).toBe(null) // 'a' is gone
  })

  it('discards the redo branch when a new snapshot is pushed', () => {
    const h = new HistoryManager()
    h.push('a')
    h.push('b')
    h.push('c')
    h.undo()
    h.undo() // back at 'a'

    h.push('x') // truncates b, c

    expect(h.canRedo).toBe(false)
    expect(h.undo()).toBe('a')
  })

  it('ignores push while a restore is in flight', async () => {
    const h = new HistoryManager()
    h.push('a')

    await h.runExclusive(async () => {
      h.push('ignored') // suppressed: isRestoring is held
    })

    // Only 'a' was ever committed, so there is nothing to undo to.
    expect(h.canUndo).toBe(false)
    expect(h.undo()).toBe(null)
  })

  it('holds isRestoring during apply and clears it afterwards', async () => {
    const h = new HistoryManager()
    expect(h.isRestoring).toBe(false)

    let seenInside = false
    await h.runExclusive(async () => {
      seenInside = h.isRestoring
    })

    expect(seenInside).toBe(true)
    expect(h.isRestoring).toBe(false)
  })

  it('serialises overlapping restores — no interleaving', async () => {
    const h = new HistoryManager()
    const order: string[] = []
    const task = (label: string, ms: number) => () =>
      new Promise<void>((resolve) => {
        order.push(`start ${label}`)
        setTimeout(() => {
          order.push(`end ${label}`)
          resolve()
        }, ms)
      })

    // 'b' is faster but queued second — it must still wait for 'a' to finish.
    const a = h.runExclusive(task('a', 20))
    const b = h.runExclusive(task('b', 5))
    await Promise.all([a, b])

    expect(order).toEqual(['start a', 'end a', 'start b', 'end b'])
  })

  it('keeps the chain alive after a failing restore', async () => {
    const h = new HistoryManager()

    await expect(
      h.runExclusive(async () => {
        throw new Error('boom')
      }),
    ).rejects.toThrow('boom')

    // A later restore still runs despite the prior rejection.
    let ran = false
    await h.runExclusive(async () => {
      ran = true
    })
    expect(ran).toBe(true)
    expect(h.isRestoring).toBe(false)
  })

  it('clear() empties the stack', () => {
    const h = new HistoryManager()
    h.push('a')
    h.push('b')
    h.clear()
    expect(h.canUndo).toBe(false)
    expect(h.canRedo).toBe(false)
    expect(h.undo()).toBe(null)
  })
})
