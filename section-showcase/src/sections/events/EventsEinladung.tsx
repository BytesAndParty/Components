import { Eye, Flower2, MessagesSquare, Wine } from 'lucide-react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { Highlighter } from '@components/highlighter/highlighter'
import { MarkerCallout } from '@components/marker-callout/marker-callout'
import { PolaroidFrame } from '@components/polaroid-frame/polaroid-frame'
import { ProcessSteps, type ProcessStep } from '@components/process-steps/process-steps'

/**
 * Die Einladung — eine Verkostung im Keller, gebaut wie eine handgemachte
 * Einladungskarte (das Vorbild des ganzen Scrapbook-Sets). Die Serif-Headline
 * hält das Haus-Niveau, darunter übernimmt die persönliche Stimme: ein Satz
 * auf dem Pinselstrich, Textmarker im Fließtext, Polaroids vom letzten Abend,
 * die Eckdaten auf Kreppband. Unten erklärt eine Papierkreis-Kette, wie
 * verkostet wird.
 */

const ICON = { size: 32, strokeWidth: 1.4 } as const

const STEPS: ProcessStep[] = [
  { icon: <Eye {...ICON} />, label: 'Sehen: Farbe und Schliere' },
  { icon: <Flower2 {...ICON} />, label: 'Riechen: Frucht, Boden, Holz' },
  { icon: <Wine {...ICON} />, label: 'Schmecken: Säure und Länge' },
  { icon: <MessagesSquare {...ICON} />, label: 'Austauschen am langen Tisch' },
]

export function EventsEinladung() {
  return (
    <section className="bg-background text-foreground relative overflow-hidden px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-start gap-20 lg:grid-cols-[6fr_5fr] lg:gap-16">
          <div>
            <BlurFade delay={100} direction="up">
              <span className="text-accent-readable mb-5 block text-[10px] font-bold tracking-[0.4em] uppercase">
                Einladung · Verkostung im Keller
              </span>
            </BlurFade>
            <BlurFade delay={200} direction="up">
              <h2 className="font-display text-4xl leading-tight font-light tracking-tight sm:text-5xl">
                Ein Abend, <span className="italic">sechs Weine</span> und alle Fragen, die ihr mitbringt.
              </h2>
            </BlurFade>

            <MarkerCallout rotate={-1.5} className="mt-12 max-w-md">
              Ein besonderes Erlebnis für alle, die mehr schmecken wollen – mit euch!
            </MarkerCallout>

            <BlurFade delay={300} direction="up">
              <p className="text-muted-foreground mt-12 max-w-lg text-lg leading-loose font-light">
                Simon öffnet den Keller in Sooß und schenkt{' '}
                <Highlighter action="marker">sechs Weine aus unseren Rieden</Highlighter> ein, vom Grünen
                Veltliner bis zum Zweigelt. Wir verkosten wie die Profis, nur ohne Spucknapf-Ernst, und reden
                darüber, <Highlighter action="marker" delay={300}>bis jede Frage beantwortet ist</Highlighter>.
              </p>
            </BlurFade>

            <BlurFade delay={400} direction="up">
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

          {/* Fotos vom letzten Abend, darunter die Eckdaten auf Kreppband */}
          <div className="relative flex flex-col items-center gap-14 pt-4 sm:items-start">
            <PolaroidFrame
              src="https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=700&q=80"
              alt="Weinflaschen nebeneinander in einem Holzregal"
              caption="Sechs Flaschen warten schon"
              rotate={-3}
              tape
            />
            <PolaroidFrame
              src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&q=80"
              alt="Zwei Weingläser beim Anstoßen"
              caption="Auf den Jahrgang!"
              rotate={2.5}
              // Weit genug rechts, dass die Caption des ersten Polaroids frei bleibt
              className="w-56 sm:-mt-48 sm:ml-64"
            />
            <MarkerCallout
              variant="tape"
              color="rose"
              rotate={-1}
              lines={['Sa., 17. Oktober · 18 Uhr', 'kleine Probe 6,–', 'große Probe 30,– inkl. 10,– Gutschein']}
              className="sm:-mt-4"
            />
          </div>
        </div>

        <div className="border-border mt-24 border-t pt-14">
          <span className="text-muted-foreground mb-10 block text-[10px] font-bold tracking-[0.4em] uppercase">
            So wird verkostet
          </span>
          <ProcessSteps steps={STEPS} />
        </div>
      </div>
    </section>
  )
}
