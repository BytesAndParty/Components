import { Link } from 'react-router'
import { sections } from '../sections/registry'

export function IndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12">
        <h1 className="font-display text-4xl font-medium tracking-tight">
          Sections für die Webseite
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Jede Section ist in mehreren Varianten ausgearbeitet. Klick auf eine
          Section, vergleich die Varianten nebeneinander und such die aus, die
          am besten passt.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sections.map(s => (
          <li key={s.id}>
            <Link
              to={`/${s.id}`}
              className="group block rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/60"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-2xl font-medium tracking-tight">
                  {s.label}
                </h2>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {s.variants.length}&nbsp;Varianten
                </span>
              </div>
              {s.description && (
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.variants.map(v => (
                  <span
                    key={v.id}
                    className="rounded-full border border-border px-2 py-0.5 text-[11px] uppercase tracking-wider text-muted-foreground group-hover:border-accent/40"
                  >
                    {v.label}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
