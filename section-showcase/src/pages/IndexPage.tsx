import { Link } from 'react-router'
import { ArrowRight, Heart } from 'lucide-react'
import { sections } from '../sections/registry'
import { PREVIEW_HIGHLIGHT_AT, useShowcase } from '../showcase-state'
import { encodeComposition } from '../composition-url'

export function IndexPage() {
  const { favoriteVariant, composition } = useShowcase()
  const favoriteCount = composition.order.length
  const previewParam = encodeComposition(composition)

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12">
        <h1 className="font-display text-4xl font-medium tracking-tight">
          Sections für die Webseite
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl">
          Jede Section ist in mehreren Varianten ausgearbeitet. Klick auf eine
          Section, vergleich die Varianten nebeneinander und such die aus, die
          am besten passt.
        </p>
        {favoriteCount > 0 && (
          <Link
            to={previewParam ? `/preview?s=${previewParam}` : '/preview'}
            className={`group focus-visible:ring-ring mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-[color,background-color,border-color,transform] duration-200 hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0 ${
              favoriteCount >= PREVIEW_HIGHLIGHT_AT
                ? 'bg-accent text-accent-foreground shadow-md shadow-black/20'
                : 'border-border hover:border-accent/40 border'
            }`}
          >
            Deine Seite ansehen
            <span className="tabular-nums opacity-70">
              {favoriteCount} von {sections.length} Sections
            </span>
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sections.map(s => {
          const chosen = favoriteVariant(s.id)
          return (
          <li key={s.id}>
            <Link
              to={`/${s.id}`}
              className={`group border-border bg-card hover:border-accent/60 block rounded-xl border p-6 transition-colors ${
                chosen ? 'border-accent/50' : ''
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display flex items-center gap-2 text-2xl font-medium tracking-tight">
                  {s.label}
                  {chosen && (
                    <Heart
                      size={15}
                      className="text-accent fill-accent translate-y-px"
                      aria-label="favorisiert"
                    />
                  )}
                </h2>
                <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                  {s.variants.length}&nbsp;Varianten
                </span>
              </div>
              {s.description && (
                <p className="text-muted-foreground mt-2 text-sm">{s.description}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.variants.map(v => {
                  const isChosen = chosen === v.id
                  return (
                    <span
                      key={v.id}
                      className={`rounded-full border px-2 py-0.5 text-[11px] tracking-wider uppercase ${
                        isChosen
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border text-muted-foreground group-hover:border-accent/40'
                      }`}
                    >
                      {v.label}
                    </span>
                  )
                })}
              </div>
            </Link>
          </li>
          )
        })}
      </ul>
    </div>
  )
}
