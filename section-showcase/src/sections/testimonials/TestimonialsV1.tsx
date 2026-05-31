import { GlowCard } from '@components/glow-card/glow-card'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Marc-André Leclerc',
    role: 'Chef Sommelier, Le Bristol',
    content: 'Die Selektion Lacombe ist ein Paradebeispiel für Terroir-Treue. Ein Muss für jeden Weinkeller, der auf Qualität statt Masse setzt.',
    rating: 5,
  },
  {
    name: 'Elena Rossi',
    role: 'Weinkritikerin',
    content: 'Selten habe ich eine so konsistente Qualität über verschiedene Jahrgänge hinweg erlebt. Die Bio-Wende 1988 spürt man in jeder Nuance.',
    rating: 5,
  },
  {
    name: 'Julian Schmidt',
    role: 'Sammler',
    content: 'Der Millésime Club ist mein Highlight des Monats. Die Raritäten, die man hier bekommt, sind auf dem freien Markt kaum zu finden.',
    rating: 5,
  },
]

export function TestimonialsV1() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <BlurFade delay={100}>
            <h2 className="text-accent text-base leading-7 font-semibold tracking-widest uppercase">Le Verdict</h2>
          </BlurFade>
          <BlurFade delay={200}>
            <p className="font-display text-foreground mt-2 text-4xl font-medium tracking-tight sm:text-5xl">
              Stimmen der Experten
            </p>
          </BlurFade>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <BlurFade key={t.name} delay={300 + i * 100}>
              <GlowCard className="flex h-full flex-col justify-between p-8">
                <div>
                  <div className="text-accent mb-6 flex gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-foreground text-lg leading-relaxed italic">
                    "{t.content}"
                  </p>
                </div>
                <div className="border-border mt-8 flex flex-col gap-1 border-t pt-6">
                  <span className="font-display text-foreground font-medium">{t.name}</span>
                  <span className="text-muted-foreground text-xs tracking-wider uppercase">{t.role}</span>
                </div>
              </GlowCard>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
