import { Link } from 'react-router'
import { Heart } from 'lucide-react'
import { sections } from '../sections/registry'
import { useShowcase } from '../showcase-state'

export function IndexPage() {
  const { favoriteVariant } = useShowcase()

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
