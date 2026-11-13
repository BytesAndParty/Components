import { lazy, Suspense, useRef, type CSSProperties } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { ShaderBackdrop } from '@components/shader-backdrop/shader-backdrop'
// The real Merlot label, cut from the Buchart 58 product photo the bottle shape
// was measured from. The cut-out is narrower than 5:7, so it sits centred on a
// field in the label's ground colour (sampled from its edge) instead of being stretched.
import merlotLabel from '../assets/weine/merlot-etikett.webp'

/**
 * Flaschenbühne — die Flasche ist kein Foto, sondern ein in Echtzeit
 * gerendertes 3D-Objekt vor einem fließenden Shader-Hintergrund. Die Sektion
 * ist zwei Bildschirme hoch und hält die Bühne per `sticky` fest: Beim
 * Scrollen dreht sich die Flasche mit dem Etikett nach vorn und wandert von
 * rechts in die Mitte, die Headline weicht den Eckdaten des Weins.
 * Die Sektion ist in jedem Theme dunkel; Hintergrund und Schraubverschluss folgen dem
 * Akzent, damit der Akzent-Schalter die ganze Bühne umfärbt.
 */

// three.js ist groß. Die Bühne lädt als eigener Chunk nach, Text und
// Hintergrund stehen sofort.
const BottleStage = lazy(() =>
  import('@components/bottle-stage/bottle-stage').then(module => ({ default: module.BottleStage })),
)

const GROUND = 'oklch(0.12 0.015 20)'

const BACKDROP_COLORS: [string, string, string] = [
  GROUND,
  `color-mix(in oklch, var(--accent) 32%, ${GROUND})`,
  'var(--accent-lifted)',
]

const FACTS = [
  ['Jahrgang', '2023'],
  ['Ausbau', '18 Monate im großen Holz'],
  ['Alkohol', '13,5 % vol'],
  ['Trinkreife', '2026 bis 2034'],
]

export function HeroBottle3D() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  // Ohne Bewegung bleiben nur die Überblendungen, nichts verschiebt sich: Die
  // Flasche steht dann durchgehend rechts, die Eckdaten rücken in die linke Spalte.
  const introOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const introY = useTransform(scrollYProgress, [0, 0.3], reducedMotion ? [0, 0] : [0, -48])
  const factsOpacity = useTransform(scrollYProgress, [0.62, 0.88], [0, 1])
  const factsY = useTransform(scrollYProgress, [0.62, 0.88], reducedMotion ? [0, 0] : [32, 0])
  const stageShift = useTransform(scrollYProgress, [0, 0.62], reducedMotion ? ['22vw', '22vw'] : ['22vw', '0vw'])
  // Ausgeblendet darf der Intro-Block keine Klicks mehr annehmen.
  const introPointerEvents = useTransform(scrollYProgress, value => (value > 0.3 ? 'none' : 'auto'))

  return (
    <section ref={sectionRef} className="relative h-[220vh] w-full" style={{ background: GROUND }}>
      <div className="sticky top-0 h-screen min-h-[640px] w-full overflow-hidden">
        <ShaderBackdrop colors={BACKDROP_COLORS} speed={0.8} className="absolute inset-0" />
        {/* Scrim: hält die linke Textspalte lesbar, egal was der Shader gerade zeigt. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-black/55 via-black/15 to-transparent"
        />

        {/* Bühne: mobil mittig in der unteren Hälfte, ab lg über die ganze
            Fläche und per --stage-shift von rechts in die Mitte geführt. */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[52%] lg:inset-0 lg:h-auto lg:translate-x-(--stage-shift)"
          style={{ '--stage-shift': stageShift } as CSSProperties}
        >
          <Suspense fallback={null}>
            <BottleStage
              labelSrc={merlotLabel}
              progress={scrollYProgress}
              capsuleColor="var(--accent-lifted)"
              className="h-full w-full"
            />
          </Suspense>
        </motion.div>

        {/* Tafel I — Markenversprechen */}
        <motion.div
          className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-start px-6 pt-24 sm:px-10 lg:justify-center lg:px-16 lg:pt-0"
          style={{ opacity: introOpacity, y: introY, pointerEvents: introPointerEvents }}
        >
          <BlurFade delay={100} direction="up">
            <span className="text-accent-lifted inline-block text-[10px] font-bold tracking-[0.4em] uppercase">
              Cuvée Nº 7 · Jahrgang 2023
            </span>
          </BlurFade>

          <BlurFade delay={220} direction="up">
            <h1 className="font-display mt-6 max-w-xl text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] font-light tracking-tight text-white">
              Was im Keller reift,
              <br />
              <span className="italic">verdient eine Bühne.</span>
            </h1>
          </BlurFade>

          <BlurFade delay={340} direction="up">
            <p className="mt-6 max-w-sm text-base leading-relaxed text-white/75">
              Scrollen Sie, und die Flasche dreht sich ins Licht. Kein Foto, kein Video: Glas, Verschluss und
              Etikett entstehen in Echtzeit.
            </p>
          </BlurFade>

          <BlurFade delay={460} direction="up" className="mt-9 flex flex-wrap items-center gap-x-9 gap-y-5">
            <a
              href="/kollektion"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-8 py-3 text-[11px] font-semibold tracking-[0.2em] text-black uppercase transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none active:translate-y-0"
            >
              Zur Kollektion
            </a>
            <a
              href="/jahrgang"
              className="group inline-flex min-h-11 items-center gap-4 rounded-xs text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black focus-visible:outline-none"
            >
              <span className="font-display text-xl leading-none font-light italic">Mehr zum Jahrgang</span>
              <span
                aria-hidden="true"
                className="group-hover:bg-accent-lifted h-px w-10 bg-white/55 transition-all duration-500 group-hover:w-20"
              />
            </a>
          </BlurFade>
        </motion.div>

        {/* Tafel II — Eckdaten, flankieren die Flasche, sobald sie in der Mitte steht.
            Die Ebene liegt über Tafel I und enthält nichts Klickbares: ohne
            pointer-events-none würde sie die Links darunter verdecken. */}
        <motion.div
          className={`pointer-events-none absolute inset-0 z-10 mx-auto grid w-full max-w-7xl grid-cols-1 content-start gap-8 px-6 pt-24 sm:px-10 lg:content-center lg:px-16 lg:pt-0 ${
            reducedMotion ? 'lg:grid-cols-[minmax(0,26rem)]' : 'lg:grid-cols-[1fr_minmax(16rem,22vw)_1fr] lg:gap-0'
          }`}
          style={{ opacity: factsOpacity, y: factsY }}
        >
          <div className={reducedMotion ? undefined : 'lg:pr-10 lg:text-right'}>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] font-light tracking-tight text-white">
              Cuvée <span className="italic">Nº 7</span>
            </h2>
            <p className={`mt-4 text-base leading-relaxed text-white/75 lg:max-w-xs ${reducedMotion ? '' : 'lg:ml-auto'}`}>
              Zweigelt, Blaufränkisch und Merlot. Dunkle Kirsche, etwas Graphit, ein langer, kühler Abgang.
            </p>
          </div>
          {!reducedMotion && <div aria-hidden="true" className="hidden lg:block" />}
          <dl className={`grid grid-cols-2 gap-x-6 gap-y-4 ${reducedMotion ? '' : 'lg:grid-cols-1 lg:pl-10'}`}>
            {FACTS.map(([term, value]) => (
              <div key={term} className="border-t border-white/20 pt-3">
                <dt className="text-accent-lifted text-[10px] font-semibold tracking-[0.3em] uppercase">{term}</dt>
                <dd className="font-display mt-1 text-xl font-light text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  )
}
