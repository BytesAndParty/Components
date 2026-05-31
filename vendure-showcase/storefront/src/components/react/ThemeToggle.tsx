import { useAtelier } from '@components/atelier'
import { useT } from '@/lib/i18n'

export function ThemeToggle() {
  const { theme, toggleTheme } = useAtelier()
  const t = useT()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="border-border hover:bg-muted flex h-10 w-10 items-center justify-center rounded-lg border transition-colors"
      aria-label={t.themeToggle}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
