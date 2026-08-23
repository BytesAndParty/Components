import { BlurFade } from '@components/blur-fade/blur-fade'
import { Particles } from '@components/particles/particles'
import { ShinyText } from '@components/shiny-text/shiny-text'
import { MagneticButton } from '@components/magnetic-button/magnetic-button'

/**
 * Cinematic Atmosphere — drei schwebende Karten statt Ledger-Liste
 * (Kontrast zu PricingV7 / Nocturne), Glassmorphism-Rahmen auf Zinc statt
 * Kerzengold-Hairlines. Die empfohlene Stufe trägt einen Akzent-Ring und
 * hebt sich beim Hover leicht an.
 *
 * Partikel bewusst dünn (25, zusätzlich gedimmt) — das dichte Feld gehört
 * Hero, CTA und Footer, sonst addieren sich die Sections zu Rauschen.
 */

const PLANS: Array<{
  name: string
  price: string
  period: string
  text: string
  features: string[]
  featured?: boolean
}> = [
  {
    name: 'Entdecker',
    price: '45,–',
    period: 'pro Verkostung',
    text: 'Vier Weine, eine Viertelstunde, keine Anmeldung nötig.',
    features: ['4 Weine frei wählbar', 'Kurzführung durch den Keller', 'Ohne Reservierung'],
  },
  {
    name: 'Atmosphäre',
    price: '89,–',
    period: 'pro Person',
    text: 'Der volle Abend: Terrasse, Nebel, acht Weine und Zeit.',
    features: ['8 Weine + Brotzeit', 'Sitzplatz auf der Terrasse', 'Persönliche Begleitung', 'Ein Glas zum Mitnehmen'],
    featured: true,
  },
  {
    name: 'Privatissime',
    price: 'auf Anfrage',
    period: 'für Gruppen',
    text: 'Exklusive Verkostung nach Feierabend, ganz für sich allein.',
    features: ['Individuelle Weinauswahl', 'Exklusive Nutzung der Terrasse', 'Persönliches Gespräch mit dem Winzer'],
  },
]

export function PricingCinematic() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      <Particles
        particleColors={['#fff', 'var(--accent-lifted)']}
        particleCount={25}
        speed={0.06}
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <BlurFade delay={100}>
            <span className="mb-5 inline-block text-[10px] font-bold tracking-[0.4em] text-accent-lifted uppercase">
              Verkostung wählen
            </span>
          </BlurFade>
          <BlurFade delay={220}>
            <h2 className="font-display text-4xl leading-tight font-medium tracking-tight text-white sm:text-5xl">
              Finden Sie Ihre <ShinyText duration={9} shineColor="color-mix(in oklch, var(--accent) 65%, white)">Stimmung.</ShinyText>
            </h2>
          </BlurFade>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <BlurFade key={plan.name} delay={350 + i * 150} direction="up" className="h-full">
              <div
                className={`flex h-full flex-col gap-8 rounded-2xl border p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 ${
                  plan.featured
                    ? 'border-accent-lifted/60 bg-accent-lifted/[0.06] shadow-[0_24px_60px_-24px_color-mix(in_oklch,var(--accent)_45%,transparent)]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                }`}
              >
                <div>
                  {plan.featured && (
                    <span className="mb-4 inline-block text-[9px] font-bold tracking-[0.3em] text-accent-lifted uppercase">
                      Meistgewählt
                    </span>
                  )}
                  <h3 className="font-display text-2xl font-medium tracking-tight text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {plan.text}
                  </p>
                </div>

                <div>
                  <span className="font-display text-4xl font-medium tracking-tight text-white">
                    {plan.price}
                  </span>
                  <span className="ml-2 text-xs tracking-wide text-zinc-400 uppercase">
                    {plan.period}
                  </span>
                </div>

                <ul className="flex flex-1 flex-col gap-3">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                      <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-accent-lifted" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <MagneticButton
                  variant={plan.featured ? 'primary' : 'outline'}
                  aria-label={`${plan.name} reservieren`}
                  className="w-full! justify-center!"
                >
                  Reservieren
                </MagneticButton>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
