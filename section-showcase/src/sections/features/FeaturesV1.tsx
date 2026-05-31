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
            <h2 className="text-accent text-base leading-7 font-semibold">Exzellenz im Detail</h2>
          </BlurFade>
          <BlurFade delay={200}>
            <p className="font-display text-foreground mt-2 text-4xl font-medium tracking-tight sm:text-5xl">
              <ShinyText duration={8}>Mehr als nur ein Online-Shop</ShinyText>
            </p>
          </BlurFade>
          <BlurFade delay={300}>
            <p className="text-muted-foreground mt-6 text-lg leading-8">
              Wir verbinden jahrhundertealte Tradition mit modernster Technologie, um Ihnen ein unvergleichliches Erlebnis zu bieten.
            </p>
          </BlurFade>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-4">
            {features.map((feature, i) => (
              <BlurFade key={feature.title} delay={400 + i * 100}>
                <GlowCard className="h-full p-8 transition-all hover:scale-[1.02]">
                  <div className="bg-accent/10 mb-6 flex h-10 w-10 items-center justify-center rounded-lg">
                    <feature.icon className="text-accent h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-foreground text-lg leading-7 font-medium">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
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
