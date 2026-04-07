import { Section } from '../components/section'
import { TextScramble } from '@components/text-scramble/text-scramble'
import { TextRotate } from '@components/text-rotate/text-rotate'
import { AuroraText } from '@components/aurora-text/aurora-text'
import { VelocityScroll, TestimonialCard } from '@components/velocity-scroll/velocity-scroll'
import { ScrollRotate, RotatingDecoration } from '@components/scroll-rotate/scroll-rotate'
import { testimonials } from '../data'

export function TextPage() {
  return (
    <>
      <Section title="TextScramble" description="Text reveal with randomized character scramble animation.">
        <div className="text-2xl font-semibold font-mono text-foreground">
          <TextScramble text="Hello, this is TextScramble!" speed={25} />
        </div>
      </Section>

      <Section title="TextRotate" description="Animated text rotation with staggered character transitions.">
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
          <div className="p-12 px-8 flex flex-col items-center text-center gap-4">
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
              Curated Selection
            </p>
            <div className="text-4xl font-bold leading-tight tracking-tight">
              <span className="text-foreground">Discover </span>
              <TextRotate
                texts={['Barolo', 'Amarone', 'Brunello', 'Chianti', 'Sassicaia', 'Barbaresco']}
                rotationInterval={2500}
                staggerDuration={0.04}
                staggerFrom="first"
                mainStyle={{}}
                elementLevelStyle={{ color: 'var(--accent)' }}
              />
            </div>
            <p className="max-w-md text-sm text-muted-foreground leading-relaxed mt-2">
              Handverlesene Weine aus den besten Lagen Italiens.
              Jeder Jahrgang erzählt eine Geschichte.
            </p>
            <div className="flex gap-4 mt-6 w-full justify-center">
              {[
                { name: 'Barolo Riserva', year: '2018', region: 'Piemonte' },
                { name: 'Amarone Classico', year: '2019', region: 'Veneto' },
                { name: 'Brunello DOCG', year: '2017', region: 'Toscana' },
              ].map((wine) => (
                <div
                  key={wine.name}
                  className="flex-1 max-w-40 p-4 rounded-lg border border-border bg-background text-left shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-accent mb-3 opacity-70" />
                  <p className="text-[0.8125rem] font-semibold text-foreground">{wine.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{wine.region} · {wine.year}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-border p-3 px-8 flex justify-between text-[0.7rem] text-muted-foreground bg-white/[0.01]">
            <span>TextRotate · splitBy: characters · staggerFrom: first</span>
            <span>rotationInterval: 2500ms</span>
          </div>
        </div>
      </Section>

      <Section title="AuroraText" description="Gradient text with animated color shifting and subtle rotation.">
        <div className="text-4xl font-bold tracking-tight text-foreground">
          <AuroraText speed={1.5}>Premium Quality</AuroraText>
        </div>
        <div className="text-xl font-semibold mt-3">
          <AuroraText colors={['var(--accent)', '#7928CA', '#FF0080', 'var(--accent)']} speed={0.8}>
            Uses your accent color
          </AuroraText>
        </div>
      </Section>

      <Section title="VelocityScroll" description="Scroll-reactive testimonial rows that accelerate with page scroll velocity.">
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
          <div className="py-8">
            <VelocityScroll baseVelocity={-30} rows={2} gap="1rem">
              {testimonials.map((t) => (
                <TestimonialCard key={t.name} testimonial={t} />
              ))}
            </VelocityScroll>
          </div>
          <div className="border-t border-border p-3 px-8 flex justify-between text-[0.7rem] text-muted-foreground bg-white/[0.01]">
            <span>VelocityScroll · useVelocity + useSpring · 2 rows</span>
            <span>Scroll the page to accelerate</span>
          </div>
        </div>
      </Section>

      <Section title="ScrollRotate" description="Element that rotates based on scroll position.">
        <div className="flex items-center gap-8">
          <RotatingDecoration />
          <p className="text-muted-foreground text-sm">
            Scroll the page to see the decoration rotate.
          </p>
        </div>
      </Section>

      {/* Extra height so ScrollRotate has room to work */}
      <div className="h-[50vh]" />
    </>
  )
}
