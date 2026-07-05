import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Maison Editorial — die Chronik als Magazin-Register. Hairline-getrennte Einträge,
 * übergroße italic Jahres-Ziffern mit römischem Marker, das „Heute" trägt eine Foto-
 * Tafel. Cream-Grund, Zink-Tinte. Distinkt zu TimelineV2 (Linien-Timeline) und
 * TimelineV3 (Ledger).
 */

const CHRONIK: Array<{ year: string; roman: string; title: string; text: string; plate?: string; plateAlt?: string }> = [
  {
    year: '1958',
    roman: 'I',
    title: 'Der erste Keller',
    text: 'Josef Buchart füllt den ersten eigenen Jahrgang — sechs Fässer, ein Handschlag, noch ohne Etikett.',
  },
  {
    year: '1981',
    roman: 'II',
    title: 'Die Steillagen',
    text: 'Die Familie pachtet die Terrassen am Loibenberg. Was steil ist, trägt Urgestein — und Charakter.',
  },
  {
    year: '2003',
    roman: 'III',
    title: 'Zurück zur Spontangärung',
    text: 'Schluss mit Reinzuchthefe. Der Most bekommt seine Zeit zurück, der Keller seine Geduld.',
  },
  {
    year: 'Heute',
    roman: 'IV',
    title: 'Achtzehn Fässer',
    text: 'Drei Generationen, sieben Rieden, achtzehn Fässer je Jahrgang — nicht mehr, aus Überzeugung.',
    plate: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1200&q=80',
    plateAlt: 'Rebzeilen der Ried Loibenberg im Morgennebel',
  },
]

export function TimelineV6() {
  return (
    <section className="relative w-full overflow-hidden bg-[#fdfcf9] px-6 py-24 lg:px-16 lg:py-32">
      {/* Vertical meta rail — right edge */}
      <div className="absolute top-1/2 right-6 hidden -translate-y-1/2 lg:block">
        <BlurFade delay={900} direction="left">
          <span className="block rotate-180 text-[9px] font-bold tracking-[0.45em] whitespace-nowrap text-zinc-400 uppercase [writing-mode:vertical-rl]">
            Kapitel III — Die Chronik
          </span>
        </BlurFade>
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 max-w-3xl lg:mb-24">
          <BlurFade delay={100} direction="up">
            <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">Seit MCMLVIII</span>
          </BlurFade>
          <BlurFade delay={250} direction="up">
            <h2 className="font-display mt-6 text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.88] font-light tracking-tighter text-zinc-900">
              Vier Daten,
              <br />
              <span className="italic">ein Weingut.</span>
            </h2>
          </BlurFade>
        </div>

        {/* Chronik entries */}
        <div className="flex flex-col">
          {CHRONIK.map((entry, i) => (
            <BlurFade key={entry.year} delay={400 + i * 150} direction="up">
              <article className="grid grid-cols-1 gap-6 border-t border-zinc-200 py-10 lg:grid-cols-[0.8fr_2fr] lg:gap-16 lg:py-14">
                <div className="flex items-start gap-4">
                  <span className="mt-3 text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">{entry.roman}</span>
                  <span className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.8] font-light tracking-tighter text-zinc-900 italic">
                    {entry.year}
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="font-display text-2xl font-light tracking-tight text-zinc-900">{entry.title}</h3>
                  <p className="max-w-lg text-base leading-relaxed font-light text-zinc-500">{entry.text}</p>
                  {entry.plate && (
                    <RevealImage
                      src={entry.plate}
                      alt={entry.plateAlt ?? ''}
                      direction="up"
                      duration={1400}
                      className="mt-4 aspect-video w-full max-w-xl shadow-[24px_32px_60px_-24px_rgba(24,24,27,0.2)]"
                    />
                  )}
                </div>
              </article>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
