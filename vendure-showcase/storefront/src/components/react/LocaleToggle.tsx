import { useAtelier } from '@components/atelier'
import { useT } from '@/lib/i18n'

const NEXT = { de: 'en', en: 'de' } as const

export function LocaleToggle() {
  const { locale, setLocale } = useAtelier()
  const t = useT()
  const next = NEXT[locale as 'de' | 'en'] ?? 'en'

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-xs font-bold tabular-nums uppercase"
      aria-label={t.localeToggle}
      title={t.localeToggle}
    >
      {locale.toUpperCase()}
    </button>
  )
}
