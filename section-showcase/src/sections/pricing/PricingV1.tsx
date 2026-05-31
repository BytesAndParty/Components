import { PricingInteraction } from '@components/pricing-interaction/pricing-interaction'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { ShinyText } from '@components/shiny-text/shiny-text'

const wineClubOptions = [
  {
    label: 'Connaisseur',
    description: '3 exklusive Flaschen pro Monat, kuratiert von unseren Sommeliers.',
    price: 49,
    badge: 'Beliebt',
  },
  {
    label: 'Grand Cru',
    description: '6 Flaschen inklusive Raritäten und Vorabzugriff auf neue Jahrgänge.',
    price: 89,
  },
  {
    label: 'Millésime',
    description: '12 Flaschen, persönliche Beratung und Einladungen zu privaten Tastings.',
    price: 159,
  },
]

export function PricingV1() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <BlurFade delay={100}>
            <h2 className="text-accent text-base leading-7 font-semibold tracking-widest uppercase">Le Club</h2>
          </BlurFade>
          <BlurFade delay={200}>
            <p className="font-display text-foreground mt-2 text-4xl font-medium tracking-tight sm:text-5xl">
              <ShinyText duration={8}>Ihr Abo für Exzellenz</ShinyText>
            </p>
          </BlurFade>
          <BlurFade delay={300}>
            <p className="text-muted-foreground mt-6 text-lg leading-8">
              Wählen Sie Ihre Stufe und tauchen Sie ein in die Welt der feinsten Weine — flexibel kündbar, maximaler Genuss.
            </p>
          </BlurFade>
        </div>

        <div className="flex justify-center">
          <BlurFade delay={400}>
            <PricingInteraction 
              options={wineClubOptions} 
              currency="€"
              priceSuffix=" / Monat"
              ctaLabel="Jetzt abonnieren"
              onCta={(idx, period) => console.log('Subscribed to', wineClubOptions[idx].label, period === 1 ? 'yearly' : 'monthly')}
              style={{
                maxWidth: '28rem',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
              }}
            />
          </BlurFade>
        </div>
        
        <BlurFade delay={500} className="mt-16 text-center">
          <p className="text-muted-foreground text-sm italic">
            * 20% Ersparnis bei jährlicher Zahlung. Versandkostenfrei in ganz Europa.
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
