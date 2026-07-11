import { BlurFade } from '@components/blur-fade/blur-fade'
import { ShinyText } from '@components/shiny-text/shiny-text'

/**
 * Artisanal Minimal — the story as a typographic manifesto (HeroV4 line).
 * One oversized serif statement steps down the page like set type, three
 * margin notes hang staggered below it, and everything else is whitespace.
 * Deliberately image-free: the counterpart to the Vintage Index table.
 */

const NOTES = [
  {
    kicker: 'Boden',
    title: 'Sieben Hektar',
    text: 'Alles Urgestein, alles Hang. Wir haben nie zugekauft — die Rebe soll wissen, wo sie steht.',
  },
  {
    kicker: 'Ertrag',
    title: 'Halb so viel',
    text: 'Wo dreißig Hektoliter erlaubt wären, lesen wir fünfzehn. Konzentration ist eine Entscheidung.',
  },
  {
    kicker: 'Zeit',
    title: 'Kein Kalender',
    text: 'Gefüllt wird, wenn der Wein so weit ist. Manche Jahrgänge brauchen ein drittes Jahr — dann warten wir.',
  },
]

export function FeaturesV7() {
  return (
    <section className="relative w-full overflow-hidden bg-[#fdfcf9] px-6 py-16 sm:py-32 lg:px-16 lg:py-44">
      {/* Vertical meta rail — left edge, quiet */}
      <div className="absolute top-1/2 left-6 hidden -translate-y-1/2 lg:block">
        <BlurFade delay={900} direction="right">
          <span className="block text-[9px] font-bold tracking-[0.45em] whitespace-nowrap text-zinc-300 uppercase [writing-mode:vertical-rl]">
            Handwerk seit 1958 — ohne Eile
          </span>
        </BlurFade>
      </div>

      <div className="mx-auto max-w-6xl">
        <BlurFade delay={100} direction="up">
          <span className="block text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
            Das Weingut · Ein Manifest
          </span>
        </BlurFade>

        {/* Statement staircase — each line steps further in */}
        <BlurFade delay={250} direction="up">
          <h2 className="font-display mt-16 text-[clamp(3.25rem,9vw,7.5rem)] leading-[0.95] font-light tracking-tighter text-zinc-900">
            <span className="block">Wir machen</span>
            <span className="block pl-[7vw] text-zinc-800 italic">wenig.</span>
            <span className="block pl-[14vw]">
              Das aber{' '}
              <ShinyText
                duration={12}
                shineColor="oklch(0.85 0.03 90 / 0.5)"
                className="inline-block! italic"
              >
                ganz.
              </ShinyText>
            </span>
          </h2>
        </BlurFade>

        {/* Margin notes — staggered like handwritten annotations */}
        <div className="mt-28 grid grid-cols-1 gap-14 sm:grid-cols-3 sm:gap-10 lg:mt-36">
          {NOTES.map((note, i) => (
            <BlurFade
              key={note.kicker}
              delay={650 + i * 150}
              direction="up"
              className={i === 1 ? 'lg:mt-14' : i === 2 ? 'lg:mt-28' : ''}
            >
              <article className="border-t border-zinc-200 pt-6">
                <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                  № 0{i + 1} · {note.kicker}
                </span>
                <h3 className="font-display mt-4 text-2xl font-light tracking-tight text-zinc-900">
                  {note.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed font-light text-zinc-500">
                  {note.text}
                </p>
              </article>
            </BlurFade>
          ))}
        </div>

        {/* Quiet CTA — bottom right, growing hairline */}
        <BlurFade delay={1150} direction="up" className="mt-28 flex justify-end">
          <a
            href="/weingut"
            className="group inline-flex min-h-11 items-center gap-4 text-xs font-bold tracking-[0.25em] text-zinc-900 uppercase transition-colors hover:text-zinc-600 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
          >
            Das ganze Manifest
            <span
              aria-hidden="true"
              className="h-px w-10 bg-current transition-all duration-500 group-hover:w-16"
            />
          </a>
        </BlurFade>
      </div>
    </section>
  )
}
