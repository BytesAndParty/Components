import { VelocityScroll, TestimonialCard } from '@components/velocity-scroll/velocity-scroll'
import { BlurFade } from '@components/blur-fade/blur-fade'

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Weinsammlerin',
    content: 'Die Auswahl ist einfach phänomenal. Man merkt, dass hier echte Kenner am Werk sind.',
  },
  {
    name: 'Thomas K.',
    role: 'Sommelier',
    content: 'Endlich ein Shop, der auch die Geschichten hinter den Winzern erzählt.',
  },
  {
    name: 'Julia B.',
    role: 'Hobby-Genießerin',
    content: 'Die Lieferung war super schnell und die Verpackung absolut sicher.',
  },
  {
    name: 'Michael R.',
    role: 'Restaurantbesitzer',
    content: 'Beste Qualität zu fairen Preisen. Meine Gäste lieben die neuen Weine.',
  },
  {
    name: 'Elena G.',
    role: 'Wein-Bloggerin',
    content: 'Ein Muss für jeden, der das Besondere sucht. Klare Empfehlung!',
  },
]

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
              Was unsere Kunden sagen.
            </p>
          </BlurFade>
        </div>
      </div>

      <div className="relative mt-16">
        <VelocityScroll baseVelocity={-20} rows={1} gap="2rem">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} className="w-80" />
          ))}
        </VelocityScroll>
        
        <div className="mt-8">
          <VelocityScroll baseVelocity={20} rows={1} gap="2rem">
            {testimonials.reverse().map((t, i) => (
              <TestimonialCard key={i} testimonial={t} className="w-80" />
            ))}
          </VelocityScroll>
        </div>

        {/* Gradient overlays for smooth fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      </div>
    </section>
  )
}
