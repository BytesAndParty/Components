import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Maison Stimmen — testimonials in the layered HeroV6 language: the
 * pull-quote physically overlaps a portrait plate, a vertical rail
 * anchors the edge, and two quiet voices close along the hairline base.
 * Cream ground, zinc ink, Fig. numbering.
 */
export function TestimonialsV6() {
  return (
    <section className="relative w-full overflow-hidden bg-[#fdfcf9] px-6 py-16 sm:py-24 lg:px-16 lg:py-32">
      {/* Vertical meta rail — left edge */}
      <div className="absolute top-1/2 left-6 hidden -translate-y-1/2 lg:block">
        <BlurFade delay={900} direction="right">
          <span className="block text-[9px] font-bold tracking-[0.45em] whitespace-nowrap text-zinc-400 uppercase [writing-mode:vertical-rl]">
            Kapitel IV — Was man uns nachsagt
          </span>
        </BlurFade>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Layered composition — portrait right, quote overlaps from the left */}
        <div className="relative flex flex-col lg:block lg:min-h-192">
          {/* Portrait plate */}
          <div className="lg:absolute lg:top-0 lg:right-0 lg:w-[42%]">
            <RevealImage
              src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80"
              alt="Terrassenweingärten, aus denen die zitierten Flaschen stammen"
              direction="up"
              duration={1500}
              className="aspect-3/4 w-full"
            />
            <BlurFade delay={1000} className="mt-4 flex items-baseline justify-between">
              <span className="font-display text-sm font-light text-zinc-400 italic">
                Zu Gast in den Terrassen
              </span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                Fig. 01
              </span>
            </BlurFade>
          </div>

          {/* Quote block — overlaps the plate */}
          <div className="relative z-10 order-first mt-0 mb-12 flex flex-col gap-9 lg:absolute lg:top-[8%] lg:left-0 lg:order-0 lg:mb-0 lg:max-w-[64%]">
            <BlurFade delay={150} direction="up">
              <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
                Stimmen · Aus aller Welt
              </span>
            </BlurFade>

            <BlurFade delay={300} direction="up">
              <blockquote>
                <p className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] font-light tracking-tighter text-zinc-900">
                  „Sechs Flaschen
                  <br />
                  waren der <span className="italic">Grund</span>,
                  <br />
                  nicht der <span className="italic">Anfang.“</span>
                </p>
                <footer className="mt-8">
                  <p className="font-display text-lg font-light text-zinc-900 italic">Kenji Tanaka</p>
                  <p className="mt-1 text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                    Importeur · Tokio
                  </p>
                </footer>
              </blockquote>
            </BlurFade>
          </div>
        </div>

        {/* Two quiet voices along the hairline base */}
        <div className="mt-20 grid grid-cols-1 gap-10 border-t border-zinc-200 pt-10 sm:grid-cols-2 lg:mt-28">
          <BlurFade delay={600} direction="up">
            <blockquote className="max-w-md">
              <p className="font-display text-xl leading-relaxed font-light text-zinc-600 italic">
                „Vier Kisten im Keller, und keine wird alt. Nicht weil sie
                nicht dürften — sie kommen nur nie so weit.“
              </p>
              <footer className="mt-5 flex items-baseline justify-between">
                <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                  H. &amp; R. Winkler · Salzburg
                </span>
                <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-300 uppercase">
                  Fig. 02
                </span>
              </footer>
            </blockquote>
          </BlurFade>
          <BlurFade delay={750} direction="up">
            <blockquote className="max-w-md">
              <p className="font-display text-xl leading-relaxed font-light text-zinc-600 italic">
                „Die Verkostung im Gewölbe war der stillste Luxus des Jahres.
                Kein Wort zu viel, kein Wein zu wenig.“
              </p>
              <footer className="mt-5 flex items-baseline justify-between">
                <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                  Margit Fuchs · Loiben
                </span>
                <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-300 uppercase">
                  Fig. 03
                </span>
              </footer>
            </blockquote>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
