import { BlurFade } from '@components/blur-fade/blur-fade'

/**
 * Vintage Index — table-like editorial layout with hairlines, oversized
 * index numbers, serif row-headlines and tight Sans-Serif body.
 *
 * Style: Buchart "Artisanal Minimal" — cream ground (#fdfcf9), no glow, no
 * cards, no icons. Hierarchy is built purely through type sizing and
 * 1-px hairlines.
 *
 * NOTE: This variant uses the brand cream ground intentionally and does
 * NOT switch with the dark/light theme toggle — it is the editorial
 * showcase of the section.
 */

interface FeatureRow {
  index: string
  title: string
  subtitle: string
  body: string
}

const rows: FeatureRow[] = [
  {
    index: '01',
    title: 'Handlese',
    subtitle: 'Drei Durchgänge · Korbweise',
    body: 'Jede Traube wird zwischen September und Oktober in drei Reifegraden gesondert geerntet, im Korb zur Sortierung gebracht und am selben Tag eingemaischt.',
  },
  {
    index: '02',
    title: 'Spontangärung',
    subtitle: 'Natürliche Hefe · 28 Tage',
    body: 'Wir verzichten auf Reinzuchthefen. Die Maische gärt in offenen Stahltanks mit den weinbergseigenen Hefen — länger, leiser, charaktertreuer.',
  },
  {
    index: '03',
    title: 'Holzfass-Reife',
    subtitle: 'Eiche · 18 Monate',
    body: 'Französische Eiche aus dem Allier, drittbelegt, in 500-Liter Tonneaux. Wir holen Struktur, keinen Vanille-Lack — der Wein bleibt Hauptdarsteller.',
  },
  {
    index: '04',
    title: 'Abfüllung',
    subtitle: 'Schwerkraft · Korken',
    body: 'Keine Pumpen, keine Kontaktstellen. Der Wein fließt aus dem Fass per Schwerkraft in die Flasche und wird mit Naturkorken verschlossen.',
  },
]

export function FeaturesV3() {
  return (
    <section className="bg-[#fdfcf9] px-6 py-32 lg:py-40">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-24 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div className="flex flex-col gap-6">
            <BlurFade delay={100}>
              <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
                Index · Vinifikation
              </span>
            </BlurFade>
            <BlurFade delay={200}>
              <h2 className="font-display text-5xl leading-[0.95] font-light tracking-tight text-zinc-900 lg:text-6xl">
                Vier Schritte.<br />
                <span className="italic">Eine</span> Hand­schrift.
              </h2>
            </BlurFade>
          </div>
          <div className="flex items-end">
            <BlurFade delay={300}>
              <p className="max-w-xl text-lg leading-relaxed font-light text-zinc-500">
                Was unsere Weine ausmacht, ist nicht eine geheime Formel,
                sondern ein präzises Zusammenspiel aus Geduld, Handarbeit
                und der bewussten Entscheidung, weniger zu tun.
              </p>
            </BlurFade>
          </div>
        </header>

        {/* Vintage Index table */}
        <ol className="border-t border-zinc-200">
          {rows.map((row, i) => (
            <BlurFade key={row.index} delay={400 + i * 100} direction="up">
              <li className="group grid grid-cols-1 gap-6 border-b border-zinc-200 py-12 lg:grid-cols-[auto_1fr_1.6fr] lg:gap-16 lg:py-16">
                {/* Index column */}
                <div className="flex items-start">
                  <span className="font-display text-5xl leading-none font-light text-zinc-300 tabular-nums lg:text-7xl">
                    {row.index}
                  </span>
                </div>

                {/* Title column */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-3xl leading-tight font-light text-zinc-900 lg:text-4xl">
                    {row.title}
                  </h3>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
                    {row.subtitle}
                  </span>
                </div>

                {/* Body column */}
                <div className="flex items-start lg:pt-3">
                  <p className="max-w-prose text-base leading-relaxed font-light text-zinc-600">
                    {row.body}
                  </p>
                </div>
              </li>
            </BlurFade>
          ))}
        </ol>

        {/* Footer note */}
        <BlurFade delay={900} className="mt-12 flex flex-col items-center gap-4 text-center">
          <span className="h-px w-12 bg-zinc-300" aria-hidden="true" />
          <p className="font-display text-lg text-zinc-500 italic">
            „Weniger Eingriffe. Mehr Antworten aus dem Boden."
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
