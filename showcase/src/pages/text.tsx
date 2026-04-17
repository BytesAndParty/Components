import { Section } from '../components/section'
import { TextScramble } from '@components/text-scramble/text-scramble'
import { TextRotate } from '@components/text-rotate/text-rotate'
import { AuroraText } from '@components/aurora-text/aurora-text'
import { SparklesText } from '@components/sparkles-text/sparkles-text'
import { Highlighter } from '@components/highlighter/highlighter'
import { VelocityScroll, TestimonialCard } from '@components/velocity-scroll/velocity-scroll'
import { ScrollRotate, RotatingDecoration } from '@components/scroll-rotate/scroll-rotate'
import { MorphingText } from '@components/morphing-text/morphing-text'
import { ShinyText, ShinyButton } from '@components/shiny-text/shiny-text'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { testimonials } from '../data'

export function TextPage() {
  return (
    <>
      <Section title="SparklesText" description="Text with animated sparkle particles floating around it.">
        <div className="flex flex-col gap-6">
          <div className="text-4xl font-bold tracking-tight">
            <SparklesText>Premium Weine</SparklesText>
          </div>
          <div className="text-2xl font-semibold">
            <SparklesText sparkleColor="#f59e0b" sparkleCount={5} maxSize={22}>
              Gold Collection
            </SparklesText>
          </div>
        </div>
      </Section>

      <Section title="Highlighter" description="Text highlighting and underline effects that animate on scroll-into-view.">
        <div className="border border-border rounded-xl bg-card p-8 shadow-sm space-y-6">
          <p className="text-lg leading-relaxed text-foreground">
            Unser
            {' '}<Highlighter action="highlight" color="#6366f1">Barolo Riserva 2018</Highlighter>{' '}
            stammt aus den besten Lagen des Piemonte. Er überzeugt durch
            {' '}<Highlighter action="underline" color="#f43f5e" delay={300}>intensive Aromen von Kirschen und Veilchen</Highlighter>{' '}
            und entfaltet am Gaumen eine
            {' '}<Highlighter action="highlight" color="#10b981" delay={600}>bemerkenswerte Komplexität</Highlighter>.
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block w-3 h-3 rounded" style={{ background: '#6366f133' }} />
              Highlight
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block w-3 h-1 rounded" style={{ background: '#f43f5e' }} />
              Underline
            </div>
          </div>
        </div>
      </Section>

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

      <Section title="AuroraText" description="Gradient text with animated color shifting. variant='aurora' (default) sanft wechselnd, variant='gradient' stetiger Loop für CTAs.">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">variant="aurora" (default)</p>
            <div className="text-4xl font-bold tracking-tight">
              <AuroraText speed={1.5}>Premium Quality</AuroraText>
            </div>
            <div className="text-xl font-semibold mt-3">
              <AuroraText colors={['var(--accent)', '#7928CA', '#FF0080', 'var(--accent)']} speed={0.8}>
                Uses your accent color
              </AuroraText>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">variant="gradient" – stetiger Loop, knallig für CTAs</p>
            <div className="text-4xl font-bold tracking-tight">
              <AuroraText variant="gradient" speed={1.2}>Jetzt entdecken</AuroraText>
            </div>
            <div className="text-xl font-semibold mt-3">
              <AuroraText variant="gradient" colors={['#f43f5e', '#f97316', '#fbbf24', '#10b981']} speed={0.7}>
                Weinkollektion 2024
              </AuroraText>
            </div>
          </div>
        </div>
      </Section>

      <Section title="MorphingText" description="CSS-Blur-Überblend zwischen mehreren Texten – kein Framer Motion.">
        <div className="space-y-6">
          <div className="text-4xl font-bold tracking-tight text-foreground">
            Entdecke{' '}
            <MorphingText
              texts={['Barolo', 'Amarone', 'Brunello', 'Riesling', 'Champagner']}
              duration={2500}
              style={{ color: 'var(--accent)' }}
            />
          </div>
          <div className="text-xl text-muted-foreground">
            <MorphingText
              texts={['Frisch. Fruchtig. Fein.', 'Tief. Komplex. Unvergesslich.', 'Wild. Elegant. Pur.']}
              duration={3000}
            />
          </div>
        </div>
      </Section>

      <Section title="ShinyText + ShinyButton" description="Animierter Shine-Effekt auf Text und Button. Kein Framer Motion.">
        <div className="space-y-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">ShinyText</p>
            <div className="flex flex-wrap gap-6 items-center">
              <span className="text-2xl font-bold">
                <ShinyText duration={2.5}>Premium Weinkollektion</ShinyText>
              </span>
              <span className="text-lg font-semibold">
                <ShinyText shineColor="rgba(251,191,36,0.9)" duration={3}>Gold Reserve</ShinyText>
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">ShinyButton</p>
            <div className="flex flex-wrap gap-4 items-center">
              <ShinyButton>In den Warenkorb</ShinyButton>
              <ShinyButton duration={2} shineColor="rgba(251,191,36,0.7)" style={{ backgroundColor: '#92400e' }}>
                Gold Collection
              </ShinyButton>
            </div>
          </div>
        </div>
      </Section>

      <Section title="BlurFade" description="Viewport-Einblend-Wrapper mit Blur + Opacity-Transition via IntersectionObserver.">
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">direction="up" (default) – Elemente scrollen in den Viewport</p>
          <div className="grid grid-cols-3 gap-4">
            {['Barolo Riserva', 'Amarone Classico', 'Brunello DOCG'].map((name, i) => (
              <BlurFade key={name} delay={i * 120} duration={700}>
                <div
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <div className="w-8 h-8 rounded-full mb-3" style={{ background: 'var(--accent)', opacity: 0.7 }} />
                  <p className="font-semibold text-foreground text-sm">{name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Scroll-triggered fade</p>
                </div>
              </BlurFade>
            ))}
          </div>
          <div className="flex gap-4 flex-wrap mt-4">
            {(['up', 'down', 'left', 'right'] as const).map(dir => (
              <BlurFade key={dir} direction={dir} delay={100} duration={500}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    borderRadius: '999px',
                    border: '1px solid var(--border)',
                    background: 'var(--card)',
                    fontSize: '0.75rem',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  direction="{dir}"
                </span>
              </BlurFade>
            ))}
          </div>
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
