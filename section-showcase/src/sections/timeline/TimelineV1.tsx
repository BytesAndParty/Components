import { Timeline } from '@components/timeline/timeline'
import { BlurFade } from '@components/blur-fade/blur-fade'

const heritageItems = [
  {
    year: '1892',
    title: 'Die Gründung',
    content: 'Jean-Baptiste Lacombe erwirbt die ersten Hektar im Rhône-Tal und legt den Grundstein für unsere Tradition.',
  },
  {
    year: '1945',
    title: 'Neubeginn',
    content: 'Nach den Kriegsjahren wird der Keller modernisiert und die ersten Flaschen unter eigenem Etikett abgefüllt.',
  },
  {
    year: '1988',
    title: 'Ökologische Wende',
    content: 'Wir stellen als eines der ersten Güter der Region komplett auf biologischen Anbau um.',
  },
  {
    year: '2024',
    title: 'Digitale Exzellenz',
    content: 'Einführung von AtelierUI und Cellar Canvas, um Genuss und Technologie perfekt zu vereinen.',
  },
]

export function TimelineV1() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <BlurFade delay={100}>
              <h2 className="text-sm font-bold tracking-widest uppercase text-accent">L'Héritage</h2>
            </BlurFade>
            <BlurFade delay={200}>
              <p className="mt-4 text-4xl font-display font-medium tracking-tight text-foreground sm:text-6xl">
                Generationen von <br />
                <span className="italic text-accent">Leidenschaft.</span>
              </p>
            </BlurFade>
            <BlurFade delay={300}>
              <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
                Seit über einem Jahrhundert pflegen wir unsere Reben mit derselben Hingabe. Entdecken Sie die Meilensteine, die uns zu dem gemacht haben, was wir heute sind.
              </p>
            </BlurFade>
            
            <BlurFade delay={400} className="mt-12">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-border">
                <img 
                  src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=80" 
                  alt="Historisches Weingut" 
                  className="h-full w-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
            </BlurFade>
          </div>

          <div className="lg:pl-8">
            <Timeline items={heritageItems} dotColor="var(--accent)" />
          </div>
        </div>
      </div>
    </section>
  )
}
