/** Default cap on retained snapshots. */
const HISTORY_LIMIT = 50

/**
 * Single owner of the editor's undo/redo stack: the snapshot list, the cursor,
 * and the reentrancy lock that serialises async restores.
 *
 * Snapshots are opaque strings — the manager never parses them. Capture
 * (`serializeState`) and apply (`loadFromJSON`) stay in the bridge. Pulling the
 * stack out of the Zustand store ends the previous split ownership (store held
 * the array + cursor, the bridge held save/restore + lock) that let rapid Cmd+Z
 * fire overlapping `loadFromJSON` runs.
 */
export class HistoryManager {
  private stack: string[] = []
  private index = -1
  private tail: Promise<void> = Promise.resolve()

  /** True while an async restore is applying — the capture path must skip. */
  isRestoring = false

  constructor(private readonly limit: number = HISTORY_LIMIT) {}

  get canUndo(): boolean {
    return this.index > 0
  }

  get canRedo(): boolean {
    return this.index < this.stack.length - 1
  }

  /**
   * Pushes a snapshot, discarding any redo branch ahead of the cursor and
   * capping the stack at `limit` (oldest dropped). No-op while a restore is in
   * flight, so a `loadFromJSON` re-adding objects can't pollute the history.
   */
  push(snapshot: string): void {
    if (this.isRestoring) return
    this.stack = this.stack.slice(0, this.index + 1)
    this.stack.push(snapshot)
    if (this.stack.length > this.limit) this.stack.shift()
    this.index = this.stack.length - 1
  }

  /** Steps the cursor back and returns the snapshot to apply, or null at the start. */
  undo(): string | null {
    if (!this.canUndo) return null
    this.index -= 1
    return this.stack[this.index]
  }

  /** Steps the cursor forward and returns the snapshot to apply, or null at the end. */
  redo(): string | null {
    if (!this.canRedo) return null
    this.index += 1
    return this.stack[this.index]
  }

  /**
   * Runs an async restore exclusively: each call waits for the previous to
   * settle, with `isRestoring` held for the duration. This serialises the
   * `loadFromJSON` calls that Cmd+Z hammering used to overlap. The chain
   * survives a failing restore (a rejected apply doesn't poison later ones),
   * while the caller still receives the rejection.
   */
  runExclusive(apply: () => Promise<void>): Promise<void> {
    const run = this.tail.then(async () => {
      this.isRestoring = true
      try {
        await apply()
      } finally {
        this.isRestoring = false
      }
    })
    this.tail = run.catch(() => {})
    return run
  }

  /** Empties the stack — e.g. before loading a fresh document. */
  clear(): void {
    this.stack = []
    this.index = -1
  }
}
