import { formatForDisplay } from '@tanstack/react-hotkeys'
import { interpolate } from '../../../i18n'
import { useDeviceCapabilities } from '../../../lib/use-device-capabilities'
import { useCellarCanvasMessages } from '../../messages-context'

/**
 * Returns a function that builds a button title with its keyboard shortcut,
 * written the way the platform writes it ("⌘ Z" on a Mac, "Ctrl+Z"
 * elsewhere). Touch devices get the plain label: the shortcuts are switched
 * off there (see `useDesignEngineHotkey`).
 */
export function useShortcutTitle() {
  const m = useCellarCanvasMessages()
  const { hasFinePointer } = useDeviceCapabilities()
  return (label: string, hotkey: string) =>
    hasFinePointer ? interpolate(m.shortcutHint, { label, keys: formatForDisplay(hotkey) }) : label
}
