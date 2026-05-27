import { Shield, Zap, Globe, Heart } from 'lucide-react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { GlowCard } from '@components/glow-card/glow-card'
import { ShinyText } from '@components/shiny-text/shiny-text'

const features = [
  {
    icon: Shield,
    title: 'Authentizitäts-Garantie',
    description: 'Jede Flasche wird direkt vom Weingut bezogen und mit einem fälschungssicheren NFC-Tag versiegelt.',
  },
  {
    icon: Zap,
    title: 'Express Sommelier',
    description: 'KI-gestützte Beratung, die basierend auf Ihrem Menü in Sekunden den perfekten Wein empfiehlt.',
  },
  {
    icon: Globe,
    title: 'Terroir Tracking',
    description: 'Verfolgen Sie die klimatischen Bedingungen Ihres Jahrgangs in Echtzeit über Sensordaten der Weinberge.',
  },
  {
    icon: Heart,
    title: 'Winzer-Direkt-Support',
    description: '100% der Marge abzüglich Logistik geht direkt an die kleinen Familienbetriebe.',
  },
]

export function FeaturesV1() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <BlurFade delay={100}>
            <h2 className="text-base font-semibold leading-7 text-accent">Exzellenz im Detail</h2>
          </BlurFade>
          <BlurFade delay={200}>
            <p className="mt-2 text-4xl font-display font-medium tracking-tight text-foreground sm:text-5xl">
              <ShinyText duration={8}>Mehr als nur ein Online-Shop</ShinyText>
            </p>
          </BlurFade>
          <BlurFade delay={300}>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Wir verbinden jahrhundertealte Tradition mit modernster Technologie, um Ihnen ein unvergleichliches Erlebnis zu bieten.
            </p>
          </BlurFade>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-4">
            {features.map((feature, i) => (
              <BlurFade key={feature.title} delay={400 + i * 100}>
                <GlowCard className="h-full p-8 transition-all hover:scale-[1.02]">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <feature.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-display font-medium leading-7 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
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
