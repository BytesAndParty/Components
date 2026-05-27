import { AuroraText } from '@components/aurora-text/aurora-text'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { AmbientImage } from '@components/ambient-image/ambient-image'

export function FeaturesV2() {
  return (
    <section className="bg-background overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-10">
            <BlurFade direction="left" delay={100}>
              <span className="text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground">
                Craftsmanship
              </span>
            </BlurFade>
            
            <BlurFade direction="left" delay={200}>
              <h2 className="text-5xl font-display font-medium leading-[1.1] tracking-tight text-foreground sm:text-7xl">
                The Art of <br />
                <AuroraText variant="aurora">Winemaking</AuroraText>
              </h2>
            </BlurFade>

            <BlurFade direction="left" delay={300}>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Vom ersten Trieb im Frühjahr bis zur Abfüllung — jeder Schritt ist ein Akt der Präzision. Unsere Winzer vereinen ökologische Verantwortung mit einer Leidenschaft für Perfektion.
              </p>
            </BlurFade>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <BlurFade direction="up" delay={400}>
                <div className="flex flex-col gap-2">
                  <span className="text-2xl font-display text-foreground">Biologische Vielfalt</span>
                  <p className="text-sm text-muted-foreground">Minimal invasive Bewirtschaftung für lebendige Böden.</p>
                </div>
              </BlurFade>
              <BlurFade direction="up" delay={500}>
                <div className="flex flex-col gap-2">
                  <span className="text-2xl font-display text-foreground">Zeitlose Reifung</span>
                  <p className="text-sm text-muted-foreground">Geduld als wichtigste Zutat in unseren historischen Kellern.</p>
                </div>
              </BlurFade>
            </div>
          </div>

          <div className="relative">
            <BlurFade delay={600} direction="right">
              <AmbientImage
                src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80"
                alt="Vineyard at sunset"
                borderRadius="2rem"
                intensity={0.4}
                className="aspect-[4/5] w-full"
              />
            </BlurFade>
            
            {/* Float badge */}
            <BlurFade delay={800} className="absolute -bottom-8 -left-8 z-20 hidden sm:block">
              <div className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-xl">
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-display text-accent">98+</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Points Average</span>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  )
}
