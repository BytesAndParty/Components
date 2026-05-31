import { Link } from 'react-router'
import { sections } from '../sections/registry'

export function IndexPage() {
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
        {sections.map(s => (
          <li key={s.id}>
            <Link
              to={`/${s.id}`}
              className="group border-border bg-card hover:border-accent/60 block rounded-xl border p-6 transition-colors"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-2xl font-medium tracking-tight">
                  {s.label}
                </h2>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {s.variants.length}&nbsp;Varianten
                </span>
              </div>
              {s.description && (
                <p className="text-muted-foreground mt-2 text-sm">{s.description}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.variants.map(v => (
                  <span
                    key={v.id}
                    className="border-border text-muted-foreground group-hover:border-accent/40 rounded-full border px-2 py-0.5 text-[11px] tracking-wider uppercase"
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
