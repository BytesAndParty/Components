import { Barrel, DoorOpen, UtensilsCrossed, Wine } from 'lucide-react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { MarkerCallout } from '@components/marker-callout/marker-callout'
import { ProcessSteps, type ProcessStep } from '@components/process-steps/process-steps'

/**
 * Das Programm — der Herbstabend am Hof in Maison-Sprache: Serif, Hairlines,
 * römische Ziffern statt Badges. Einziger handgemachter Moment ist der
 * Aquarell-Satz, der leise neben der Headline steht.
 */

const ICON = { size: 24, strokeWidth: 1.1 } as const

const ACTS: ProcessStep[] = [
  { icon: <DoorOpen {...ICON} />, label: 'Empfang am Hoftor' },
  { icon: <Barrel {...ICON} />, label: 'Gang durch den Keller' },
  { icon: <Wine {...ICON} />, label: 'Verkostung der Lagen' },
  { icon: <UtensilsCrossed {...ICON} />, label: 'Jause am langen Tisch' },
]

export function EventsProgramm() {
  return (
    <section className="bg-background text-foreground relative overflow-hidden px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-end gap-14 lg:grid-cols-[7fr_5fr] lg:gap-16">
          <div>
            <BlurFade delay={100} direction="up">
              <span className="text-accent-readable mb-5 block text-[10px] font-bold tracking-[0.4em] uppercase">
                Herbst am Hof · Programm
              </span>
            </BlurFade>
            <BlurFade delay={200} direction="up">
              <h2 className="font-display text-4xl leading-tight font-light tracking-tight sm:text-6xl">
                Ein Abend <span className="italic">in vier Akten.</span>
              </h2>
            </BlurFade>
            <BlurFade delay={300} direction="up">
              <p className="text-muted-foreground mt-6 max-w-lg text-lg leading-relaxed font-light">
                Seit 1958 öffnet die Familie Buchart im Herbst Hof und Keller. Jeder Abend folgt demselben ruhigen
                Ablauf, nur der Jahrgang im Glas ist jedes Mal ein anderer.
              </p>
            </BlurFade>
          </div>

          <MarkerCallout variant="watercolor" color="sage" rotate={-0.5} className="justify-self-start lg:justify-self-end">
            Kleine Runden, keine Bühne – nur der Jahrgang und ein langer Tisch.
          </MarkerCallout>
        </div>

        <ProcessSteps variant="ledger" steps={ACTS} className="mt-24" />

        <BlurFade delay={200} direction="up">
          <a
            href="/termine"
            className="group focus-visible:ring-ring focus-visible:ring-offset-background mt-20 inline-flex min-h-11 items-center gap-5 text-sm font-bold tracking-[0.25em] uppercase focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
          >
            Termine ansehen
            <span
              aria-hidden="true"
              className="bg-foreground/70 group-hover:bg-foreground h-px w-12 transition-all duration-500 group-hover:w-20"
            />
          </a>
        </BlurFade>
      </div>
    </section>
  )
}
