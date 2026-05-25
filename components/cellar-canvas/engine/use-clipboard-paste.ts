import { useEffect, useRef } from 'react'

/**
 * Document-level `paste` handler that intercepts image clipboard data and
 * forwards a blob URL to the caller. Skips when focus is inside a text input
 * so plain text paste keeps working.
 *
 * The caller is responsible for revoking the blob URL once the image is
 * loaded into the canvas (see `URL.revokeObjectURL`).
 */
export function useClipboardPaste(onImage: (blobUrl: string) => void | Promise<void>) {
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
            void cbRef.current(URL.createObjectURL(file))
            return
          }
        }
      }
    }

    document.addEventListener('paste', handler)
    return () => document.removeEventListener('paste', handler)
  }, [])
}
