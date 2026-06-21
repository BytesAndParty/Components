import { PricingInteraction } from '@components/pricing-interaction/pricing-interaction'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { ShinyText } from '@components/shiny-text/shiny-text'

const wineClubOptions = [
  {
    label: 'Connaisseur',
    description: '3 exklusive Flaschen pro Monat.',
    price: 49,
  },
  {
    label: 'Grand Cru',
    description: '6 Flaschen inklusive Raritäten.',
    price: 89,
    badge: 'Selection',
  },
  {
    label: 'Millésime',
    description: '12 Flaschen & private Tastings.',
    price: 159,
  },
]

export function PricingV2() {
  return (
    <section className="bg-[#fdfcf9] px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-24 lg:grid-cols-[1fr_0.7fr]">
          
          <div className="flex flex-col gap-12">
            <BlurFade delay={100}>
              <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">Le Club</span>
            </BlurFade>
            <BlurFade delay={200}>
              <h2 className="font-display text-4xl leading-tight font-light tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
                Ein Abo für <br />
                <span className="italic">Kenner.</span>
              </h2>
            </BlurFade>
            <BlurFade delay={300}>
              <p className="max-w-md text-xl leading-relaxed font-light text-zinc-500">
                Erhalten Sie jeden Monat eine kuratierte Auswahl unserer besten Jahrgänge, direkt aus dem Keller zu Ihnen nach Hause.
              </p>
            </BlurFade>
          </div>

          <div className="flex justify-center lg:justify-end">
            <BlurFade delay={400}>
              <PricingInteraction 
                options={wineClubOptions} 
                currency="€"
                priceSuffix=" / Monat"
                ctaLabel="Mitglied werden"
                style={{
                  maxWidth: '26rem',
                  border: 'none',
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '0',
                  boxShadow: '40px 40px 80px -20px rgba(0,0,0,0.08)',
                }}
              />
            </BlurFade>
          </div>
        </div>

        <BlurFade delay={600} className="mt-24 border-t border-zinc-100 pt-12 text-center">
          <p className="font-display text-2xl text-zinc-400 italic">
            <ShinyText duration={15} shineColor="rgba(0,0,0,0.2)">
              "Qualität ist keine Entscheidung, sondern eine Lebenseinstellung."
            </ShinyText>
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
