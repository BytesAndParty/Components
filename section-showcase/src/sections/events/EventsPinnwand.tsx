import { BlurFade } from '@components/blur-fade/blur-fade'
import { PaperNote } from '@components/paper-note/paper-note'

/**
 * Die Pinnwand — Termine am Hof, wie von Hand an die Wand geheftet. Links
 * trägt die Section die ruhige Haus-Sprache (Serif-Headline, Hairline-Liste,
 * leiser CTA), rechts kommt die persönliche Stimme dazu: PaperNotes in beiden
 * Varianten, leicht verdreht und mit Klebestreifen.
 *
 * Die Zettel ergänzen die Termine statt sie zu wiederholen — was in der Liste
 * steht, ist verbindlich; was auf den Zetteln steht, klingt nach Gastgeber.
 */

const EVENTS = [
  { date: 'Sa., 12. September', title: 'Kellerführung', time: '16:00 · 2 Std.' },
  { date: 'So., 27. September', title: 'Weinwanderung durch die Riede', time: '10:00 · mit Jause' },
  { date: 'Sa., 10. Oktober', title: 'Sturm & Kastanien am Hof', time: 'ab 14:00' },
]

export function EventsPinnwand() {
  return (
    <section className="bg-background text-foreground relative overflow-hidden px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-20 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div className="lg:sticky lg:top-24">
          <BlurFade delay={100} direction="up">
            <span className="text-accent-readable mb-5 block text-[10px] font-bold tracking-[0.4em] uppercase">
              Termine am Hof · Herbst
            </span>
          </BlurFade>
          <BlurFade delay={200} direction="up">
            <h2 className="font-display text-4xl leading-tight font-light tracking-tight sm:text-5xl">
              Kommt vorbei, solange{' '}
              <span className="italic">die Fässer offen sind.</span>
            </h2>
          </BlurFade>
          <BlurFade delay={300} direction="up">
            <p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed font-light">
              Dreimal im Herbst öffnen wir Hof und Keller. Kleine Runden, keine Bühne –
              nur der Jahrgang, ein langer Tisch und die Leute, die ihn gemacht haben.
            </p>
          </BlurFade>

          <BlurFade delay={400} direction="up">
            <ol className="border-border mt-12 border-t">
              {EVENTS.map(e => (
                <li key={e.title} className="border-border flex flex-col gap-1 border-b py-5 sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="font-display text-muted-foreground w-40 shrink-0 text-lg italic">{e.date}</span>
                  <span className="flex-1 text-base">{e.title}</span>
                  <span className="text-muted-foreground shrink-0 text-[10px] font-bold tracking-[0.25em] whitespace-nowrap uppercase">{e.time}</span>
                </li>
              ))}
            </ol>
          </BlurFade>

          <BlurFade delay={500} direction="up">
            <a
              href="/termine"
              className="group focus-visible:ring-ring focus-visible:ring-offset-background mt-10 inline-flex min-h-11 items-center gap-5 text-sm font-bold tracking-[0.25em] uppercase focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
            >
              Platz reservieren
              <span
                aria-hidden="true"
                className="bg-foreground/70 group-hover:bg-foreground h-px w-12 transition-all duration-500 group-hover:w-20"
              />
            </a>
          </BlurFade>
        </div>

        {/* Pinnwand: zwei Spalten ab sm, versetzt, damit es nicht nach Raster aussieht */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-24 pt-4 sm:grid-cols-2">
          <PaperNote paper="kraft" rotate={-3} tape arrow="down" className="justify-self-start">
            Kellerführung am Samstag – wir öffnen die alten Fässer nur für euch.
          </PaperNote>
          <PaperNote variant="notepad" paper="cream" rotate={2} className="justify-self-end sm:mt-20">
            Mitbringen: festes Schuhwerk, eine Jacke für den Keller – und Durst.
          </PaperNote>
          <PaperNote paper="dark" rotate={-1.5} tape className="justify-self-start sm:ml-6">
            Sturm & Kastanien: das erste Glas geht aufs Haus!
          </PaperNote>
          <PaperNote variant="notepad" paper="kraft" rotate={1} tape className="justify-self-end sm:mt-12">
            Wanderung mit Jause am Marterl – Decken bringen wir mit.
          </PaperNote>
        </div>
      </div>
    </section>
  )
}
