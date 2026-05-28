import { useAtelier } from '@components/atelier'
import { useT } from '@/lib/i18n'

export function ThemeToggle() {
  const { theme, toggleTheme } = useAtelier()
  const t = useT()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
      aria-label={t.themeToggle}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
