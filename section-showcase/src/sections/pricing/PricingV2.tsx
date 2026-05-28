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
    <section className="bg-[#fdfcf9] py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.7fr] gap-24 items-center">
          
          <div className="flex flex-col gap-12">
            <BlurFade delay={100}>
              <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-zinc-400">Le Club</span>
            </BlurFade>
            <BlurFade delay={200}>
              <h2 className="font-display text-7xl font-light text-zinc-900 tracking-tight leading-tight">
                Ein Abo für <br />
                <span className="italic">Kenner.</span>
              </h2>
            </BlurFade>
            <BlurFade delay={300}>
              <p className="max-w-md text-xl leading-relaxed text-zinc-500 font-light">
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

        <BlurFade delay={600} className="mt-24 text-center border-t border-zinc-100 pt-12">
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
