import { useEffect, useState, type RefObject } from 'react'
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'
import { useCellarCanvasMessages } from '../../messages-context'
import type { FabricBridge } from '../../engine/fabric-bridge'

export interface ExtrasPanelProps {
  bridge: RefObject<FabricBridge | null>
}

/**
 * Picks the picker theme to match the current app theme. We watch the
 * `data-theme` attribute on `<html>` because the picker re-themes its
 * categories / hover states / chrome — `Theme.AUTO` would only honour
 * `prefers-color-scheme`, which the controlled atelier theme can
 * deliberately diverge from.
 */
function useDocTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(() => readTheme())
  useEffect(() => {
    const el = document.documentElement
    const obs = new MutationObserver(() => setTheme(readTheme()))
    obs.observe(el, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return theme
}

function readTheme(): Theme {
  if (typeof document === 'undefined') return Theme.DARK
  return document.documentElement.dataset.theme === 'light' ? Theme.LIGHT : Theme.DARK
}

/**
 * Extras tab — currently houses the emoji picker. Picked emojis drop onto
 * the canvas as a Textbox via `bridge.addEmoji`, marked `_extras: true` in
 * the layer metadata. The picker uses the native (system) emoji font for
 * insertion, which keeps the canvas state tiny (a single codepoint) and
 * scales vector-clean.
 */
export function ExtrasPanel({ bridge }: ExtrasPanelProps) {
  const m = useCellarCanvasMessages()
  const theme = useDocTheme()

  return (
    <section className="flex h-full flex-col space-y-3">
      <div className="space-y-1">
        <h4 className="text-muted-foreground/60 text-[10px] font-bold uppercase">{m.emojiHeading}</h4>
        <p className="text-muted-foreground text-xs">{m.emojiHint}</p>
      </div>
      <div className="-mx-4 -mb-4 min-h-0 flex-1">
        <EmojiPicker
          onEmojiClick={(data) => bridge.current?.addEmoji(data.emoji)}
          theme={theme}
          emojiStyle={EmojiStyle.NATIVE}
          lazyLoadEmojis
          width="100%"
          height="100%"
          previewConfig={{ showPreview: false }}
          searchPlaceholder="…"
          autoFocusSearch={false}
        />
      </div>
    </section>
  )
}
