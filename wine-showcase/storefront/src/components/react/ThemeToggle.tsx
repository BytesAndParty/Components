import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Check initial theme
    const isLight = document.documentElement.getAttribute('data-theme') === 'light'
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
