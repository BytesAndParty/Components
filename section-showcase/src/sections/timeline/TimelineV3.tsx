import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Jahrhundert-Register — a typographic ledger instead of a timeline.
 * No vertical line, no dots: each epoch is one hairline row with an
 * oversized outlined year numeral that fills with ink on hover. The
 * current epoch is pre-filled and carries a small photographic plate.
 * Type IS the structure.
 */

interface Entry {
  year: string
  title: string
  text: string
  current?: boolean
}

const entries: Entry[] = [
  {
    year: '1892',
    title: 'Die Gründung',
    text: 'Jean-Baptiste Lacombe erwirbt die ersten Hektar im Rhône-Tal und legt den Grundstein für unsere Tradition.',
  },
  {
    year: '1945',
    title: 'Neubeginn',
    text: 'Nach den Kriegsjahren wird der Keller modernisiert und die ersten Flaschen unter eigenem Etikett abgefüllt.',
  },
  {
    year: '1988',
    title: 'Ökologische Wende',
    text: 'Wir stellen als eines der ersten Güter der Region komplett auf biologischen Anbau um.',
  },
  {
    year: '2024',
    title: 'Digitale Exzellenz',
    text: 'Einführung von AtelierUI und Cellar Canvas, um Genuss und Technologie perfekt zu vereinen.',
    current: true,
  },
]

export function TimelineV3() {
  return (
    <section className="bg-[#fdfcf9] px-6 py-32 lg:py-44">
      <div className="mx-auto max-w-6xl">
        {/* Header — asymmetric: label left, intro right */}
        <header className="mb-24 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-24">
          <div className="flex flex-col gap-6">
            <BlurFade delay={100}>
              <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
                Register · 1892–2024
              </span>
            </BlurFade>
            <BlurFade delay={250}>
              <h2 className="font-display text-5xl leading-[0.95] font-light tracking-tight text-zinc-900 lg:text-7xl">
                Vier Zahlen,
                <br />
                <span className="italic">ein Handwerk.</span>
              </h2>
            </BlurFade>
          </div>
          <BlurFade delay={400}>
            <p className="max-w-sm text-base leading-relaxed font-light text-zinc-500">
              Kein Gut wird in einer Generation gebaut. Was bleibt, sind
              die Jahre, in denen jemand etwas gewagt hat — vier davon
              stehen in unserem Register.
            </p>
          </BlurFade>
        </header>

        {/* Ledger rows */}
        <div className="flex flex-col">
          {entries.map((entry, i) => (
            <BlurFade key={entry.year} delay={500 + i * 150}>
              <article className="group grid grid-cols-1 items-baseline gap-4 border-t border-zinc-200 py-10 transition-colors duration-500 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)_auto] lg:gap-12 lg:py-12">
                {/* Year numeral — outlined, fills on hover; current is pre-filled */}
                <span
                  className={
                    entry.current
                      ? 'font-display text-7xl leading-none font-light tracking-tighter text-zinc-900 lg:text-8xl'
                      : 'font-display text-7xl leading-none font-light tracking-tighter text-transparent transition-colors duration-700 group-hover:text-zinc-900 lg:text-8xl'
                  }
                  style={entry.current ? undefined : { WebkitTextStroke: '1px rgba(24,24,27,0.35)' }}
                >
                  {entry.year}
                </span>

                {/* Entry text */}
                <div className="flex max-w-md flex-col gap-3">
                  <h3 className="font-display text-2xl font-light text-zinc-900 italic">
                    {entry.title}
                  </h3>
                  <p className="text-base leading-relaxed font-light text-zinc-500">
                    {entry.text}
                  </p>
                </div>

                {/* Right meta — index or current marker + plate */}
                <div className="hidden flex-col items-end gap-4 lg:flex">
                  {entry.current ? (
                    <>
                      <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-900 uppercase">
                        Heute
                      </span>
                      <RevealImage
                        src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80"
                        alt="Aktueller Jahrgang im Glas"
                        direction="left"
                        delay={300}
                        className="aspect-4/3 w-44"
                      />
                    </>
                  ) : (
                    <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-300 uppercase transition-colors duration-500 group-hover:text-zinc-400">
                      {String(i + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}
                    </span>
                  )}
                </div>
              </article>
            </BlurFade>
          ))}
          <div className="border-t border-zinc-200" />
        </div>

        {/* Colophon */}
        <BlurFade delay={1200} className="mt-16 flex items-center gap-6">
          <span aria-hidden="true" className="h-px w-16 bg-zinc-300" />
          <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
            Fortschreibung durch die fünfte Generation
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
