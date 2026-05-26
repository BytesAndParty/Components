import { useAtelier } from '@components/atelier'

export function ThemeToggle() {
  const { theme, toggleTheme } = useAtelier()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
      aria-label="Theme wechseln"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
