import { VelocityScroll, TestimonialCard } from '@components/velocity-scroll/velocity-scroll'
import { BlurFade } from '@components/blur-fade/blur-fade'

/**
 * Moving Voices — two slowly drifting rows of guest voices. Deliberately
 * calm (low base velocity): the movement should read like a procession,
 * not a ticker.
 */

const testimonials = [
  {
    name: 'F. Mairhofer',
    role: 'Sommelier · Wien',
    content: 'Der 21er Loibenberg hat unsere Weinkarte neu sortiert.',
  },
  {
    name: 'K. Berger',
    role: 'Stammkundin seit 2009',
    content: 'Meine Kellerliste hat genau eine Konstante: dieses Haus.',
  },
  {
    name: 'H. & R. Winkler',
    role: 'Sammler · Salzburg',
    content: 'Sechs Kisten im Keller, und keine davon wird alt.',
  },
  {
    name: 'M. Fuchs',
    role: 'Gastgeberin · Loiben',
    content: 'Die Verkostung im Gewölbe war der stillste Luxus des Jahres.',
  },
  {
    name: 'J. Steiner',
    role: 'Weinhändler · Krems',
    content: 'Was auf dem Etikett steht, liegt im Glas. Sonst nichts.',
  },
]

// Kopie statt reverse() auf dem Original: keine Mutation im Render.
const reversed = [...testimonials].reverse()

export function TestimonialsV4() {
  return (
    <section className="bg-background overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <BlurFade delay={100}>
            <h2 className="text-accent text-base leading-7 font-semibold tracking-widest uppercase">
              Stimmen
            </h2>
          </BlurFade>
          <BlurFade delay={200}>
            <p className="font-display text-foreground mt-2 text-4xl font-medium tracking-tight sm:text-5xl">
              Was unsere Gäste sagen.
            </p>
          </BlurFade>
        </div>
      </div>

      <div className="relative mt-16">
        <VelocityScroll baseVelocity={-12} rows={1} gap="2rem">
          {testimonials.map(t => (
            <TestimonialCard key={t.name} testimonial={t} className="w-80" />
          ))}
        </VelocityScroll>

        <div className="mt-8">
          <VelocityScroll baseVelocity={12} rows={1} gap="2rem">
            {reversed.map(t => (
              <TestimonialCard key={t.name} testimonial={t} className="w-80" />
            ))}
          </VelocityScroll>
        </div>

        {/* Gradient overlays for smooth fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-linear-to-l from-background to-transparent" />
      </div>
    </section>
  )
}
