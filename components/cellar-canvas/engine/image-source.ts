/**
 * Converts a Blob/File into a data URL for use as a Fabric image `src`.
 *
 * Always prefer this over `URL.createObjectURL`: Fabric serializes the `src`
 * verbatim into history snapshots and the localStorage autosave, and re-fetches
 * it on every `loadFromJSON` (undo/redo, restore). A `blob:` URL dies with the
 * session — or earlier, if revoked — leaving dead image references. A data URL
 * survives both.
 */
export function imageSourceFromBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read blob'))
    reader.readAsDataURL(blob)
  })
}
