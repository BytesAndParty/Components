import { GlowCard } from '@components/glow-card/glow-card'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { Wine, Shield, Truck, Zap } from 'lucide-react'

const features = [
  {
    title: 'Kuratiertes Sortiment',
    description: 'Jede Flasche wird von unseren Experten persönlich verkostet und ausgewählt.',
    icon: Wine,
    color: 'oklch(0.6 0.15 30)', // Terracotta
  },
  {
    title: 'Garantierte Herkunft',
    description: 'Lückenlose Rückverfolgbarkeit direkt bis zum Weinberg des Erzeugers.',
    icon: Shield,
    color: 'oklch(0.6 0.1 240)', // Blueish
  },
  {
    title: 'Express Lieferung',
    description: 'Sicher verpackt und innerhalb von 48 Stunden bei Ihnen zu Hause.',
    icon: Truck,
    color: 'oklch(0.7 0.15 140)', // Greenish
  },
  {
    title: 'Exklusive Events',
    description: 'Zugang zu privaten Tastings und Winzer-Dinnern für unsere Club-Mitglieder.',
    icon: Zap,
    color: 'oklch(0.8 0.2 90)', // Gold/Yellow
  },
]

export function FeaturesV4() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <BlurFade delay={100}>
            <h2 className="text-accent text-base leading-7 font-semibold tracking-widest uppercase">
              Warum Atelier
            </h2>
          </BlurFade>
          <BlurFade delay={200}>
            <p className="font-display text-foreground mt-2 text-4xl font-medium tracking-tight sm:text-5xl">
              Qualität, die man schmeckt.
            </p>
          </BlurFade>
          <BlurFade delay={300}>
            <p className="text-muted-foreground mt-6 text-lg leading-8">
              Wir verbinden jahrhundertealte Tradition mit modernem Service, um Ihnen das bestmögliche Weinerlebnis zu bieten.
            </p>
          </BlurFade>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature, i) => (
              <BlurFade key={feature.title} delay={400 + i * 100} direction="up">
                <GlowCard 
                  className="flex h-full flex-col p-8 transition-transform hover:-translate-y-1"
                  glowColor={feature.color}
                  accentColor={feature.color}
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <feature.icon className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                  </div>
                  <h3 className="text-foreground text-lg font-semibold leading-7">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mt-4 flex-auto text-sm leading-6">
                    {feature.description}
                  </p>
                </GlowCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
