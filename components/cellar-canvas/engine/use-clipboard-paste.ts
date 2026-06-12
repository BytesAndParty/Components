import { useEffect, useRef } from 'react'
import { imageSourceFromBlob } from './image-source'

/**
 * Document-level `paste` handler that intercepts image clipboard data and
 * forwards a data URL to the caller. Skips when focus is inside a text input
 * so plain text paste keeps working.
 *
 * Data URL (not blob:) so the source survives history restore, autosave
 * round-trips and page reloads — see `imageSourceFromBlob`.
 */
export function useClipboardPaste(onImage: (dataUrl: string) => void | Promise<void>) {
  const cbRef = useRef(onImage)
  useEffect(() => {
    cbRef.current = onImage
  })

  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const active = document.activeElement as HTMLElement | null
      if (
        active?.tagName === 'INPUT' ||
        active?.tagName === 'TEXTAREA' ||
        active?.isContentEditable
      ) {
        return
      }

      const items = e.clipboardData?.items
      if (!items) return

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            e.preventDefault()
            void imageSourceFromBlob(file).then(url => cbRef.current(url))
            return
          }
        }
      }
    }

    document.addEventListener('paste', handler)
    return () => document.removeEventListener('paste', handler)
  }, [])
}
