import { GlowCard } from '@components/glow-card/glow-card'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { Check } from 'lucide-react'
import { MagneticButton } from '@components/magnetic-button/magnetic-button'

const tiers = [
  {
    name: 'Basis',
    price: '29',
    description: 'Der perfekte Einstieg für neugierige Genießer.',
    features: ['3 Flaschen / Quartal', 'Expertisen beigelegt', '10% Shop-Rabatt'],
    color: 'oklch(0.6 0.1 200)',
  },
  {
    name: 'Premium',
    price: '59',
    description: 'Unsere beliebteste Wahl für regelmäßigen Genuss.',
    features: ['6 Flaschen / Quartal', 'Vorabzugriff auf Raritäten', '15% Shop-Rabatt', 'Kostenloser Versand'],
    color: 'oklch(0.6 0.2 30)',
    featured: true,
  },
  {
    name: 'Exklusiv',
    price: '99',
    description: 'Das ultimative Erlebnis für echte Weinliebhaber.',
    features: ['12 Flaschen / Quartal', 'Persönlicher Sommelier', '20% Shop-Rabatt', 'Einladungen zu Events'],
    color: 'oklch(0.8 0.2 90)',
  },
]

export function PricingV3() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <BlurFade delay={100}>
            <h2 className="text-accent text-base font-semibold leading-7 tracking-widest uppercase">Mitgliedschaft</h2>
          </BlurFade>
          <BlurFade delay={200}>
            <p className="font-display text-foreground mt-2 text-4xl font-medium tracking-tight sm:text-5xl">
              Wählen Sie Ihren Genuss.
            </p>
          </BlurFade>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-12 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
          {tiers.map((tier, i) => (
            <BlurFade key={tier.name} delay={400 + i * 100} direction="up">
              <GlowCard 
                className={`flex flex-col justify-between p-8 h-full ${tier.featured ? 'border-accent/50 ring-1 ring-accent/20' : ''}`}
                glowColor={tier.color}
                accentColor={tier.color}
              >
                <div>
                  <h3 className="text-foreground text-lg font-semibold leading-8">{tier.name}</h3>
                  <p className="text-muted-foreground mt-4 text-sm leading-6">{tier.description}</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-foreground text-4xl font-bold tracking-tight">{tier.price}€</span>
                    <span className="text-muted-foreground text-sm font-semibold leading-6">/Monat</span>
                  </p>
                  <ul role="list" className="text-muted-foreground mt-8 space-y-3 text-sm leading-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <Check className="text-accent h-6 w-5 flex-none" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  <MagneticButton 
                    variant={tier.featured ? 'default' : 'outline'}
                    className="w-full !rounded-xl !py-4"
                  >
                    Jetzt starten
                  </MagneticButton>
                </div>
              </GlowCard>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
