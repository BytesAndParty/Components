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
      className="border-border hover:bg-muted flex h-10 w-10 items-center justify-center rounded-lg border text-xs font-bold uppercase tabular-nums transition-colors"
      aria-label={t.localeToggle}
      title={t.localeToggle}
    >
      {locale.toUpperCase()}
    </button>
  )
}
