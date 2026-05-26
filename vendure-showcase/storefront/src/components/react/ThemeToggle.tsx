import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Hydrate from the data-theme attribute that the SSR layer set.
    // Cannot be a lazy initializer because document is unavailable on
    // the server; the two-render hydration is intentional.
    const isLight = document.documentElement.getAttribute('data-theme') === 'light'
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(!isLight)
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.setAttribute('data-theme', next ? '' : 'light')
    // Store preference
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
      aria-label="Theme wechseln"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
