import { useState } from 'react'
import { Barrel, Droplets, Grape, MapPin, Sun, Wine } from 'lucide-react'
import { Section } from '../components/section'
import { TextScramble } from '@components/text-scramble/text-scramble'
import { TextRotate } from '@components/text-rotate/text-rotate'
import { AuroraText } from '@components/aurora-text/aurora-text'
import { SparklesText } from '@components/sparkles-text/sparkles-text'
import { Highlighter } from '@components/highlighter/highlighter'
import { Paragraph } from '@components/paragraph/paragraph'
import { PullQuote } from '@components/pull-quote/pull-quote'
import { PaperNote } from '@components/paper-note/paper-note'
import { PolaroidFrame } from '@components/polaroid-frame/polaroid-frame'
import { ProcessSteps, type ProcessStep } from '@components/process-steps/process-steps'
import { VelocityScroll, TestimonialCard } from '@components/velocity-scroll/velocity-scroll'
import { RotatingDecoration } from '@components/scroll-rotate/scroll-rotate'
import { Timeline } from '@components/timeline/timeline'
import { MorphingText } from '@components/morphing-text/morphing-text'
import { ShinyText, ShinyButton } from '@components/shiny-text/shiny-text'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { WaveText } from '@components/wave-text/wave-text'
import { NumeralReveal } from '@components/numeral-reveal/numeral-reveal'
import { testimonials } from '../data'

const wineDescriptionLong = 'Tiefdunkles Granatrot mit violetten Reflexen. In der Nase entfaltet sich ein vielschichtiges Bouquet aus reifen Brombeeren, schwarzen Kirschen und feinen Anklängen von Vanille, Tabak und mediterranen Kräutern. Am Gaumen kraftvoll und doch elegant, mit samtigen Tanninen, einer perfekten Balance zwischen Frucht und Holz und einem langen, anhaltenden Nachklang. Hervorragender Speisebegleiter zu kräftigem Wild, geschmortem Rind und gereiftem Hartkäse.'
const wineDescriptionShort = 'Frischer Grüner Veltliner mit feiner Pfeffernote.'

const STEP_ICON = { size: 34, strokeWidth: 1.4 } as const

const WINE_STEPS: ProcessStep[] = [
  { icon: <Sun {...STEP_ICON} />, label: 'Reifen am Stock' },
  { icon: <Grape {...STEP_ICON} />, label: 'Lese von Hand' },
  { icon: <Droplets {...STEP_ICON} />, label: 'Sanft pressen' },
  { icon: <Barrel {...STEP_ICON} />, label: 'Reifen im Fass' },
  { icon: <Wine {...STEP_ICON} />, label: 'Verkosten' },
]

const SHORT_STEPS: ProcessStep[] = [
  { icon: <MapPin {...STEP_ICON} />, label: 'Treffpunkt am Hoftor' },
  { icon: <Grape {...STEP_ICON} />, label: 'Durch die Ried Hölzer bis hinauf zum Aussichtspunkt' },
  { icon: <Wine {...STEP_ICON} />, label: 'Verkostung im Keller' },
]

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
        <div className="border-border bg-card space-y-6 rounded-xl border p-8 shadow-sm">
          <p className="text-foreground text-lg leading-relaxed">
            Unser
            {' '}<Highlighter action="highlight" color="#6366f1">Barolo Riserva 2018</Highlighter>{' '}
            stammt aus den besten Lagen des Piemonte. Er überzeugt durch
            {' '}<Highlighter action="underline" color="#f43f5e" delay={300}>intensive Aromen von Kirschen und Veilchen</Highlighter>{' '}
            und entfaltet am Gaumen eine
            {' '}<Highlighter action="highlight" color="#10b981" delay={600}>bemerkenswerte Komplexität</Highlighter>.
          </p>
          <div className="flex gap-4">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span className="inline-block h-3 w-3 rounded" style={{ background: '#6366f133' }} />
              Highlight
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span className="inline-block h-1 w-3 rounded" style={{ background: '#f43f5e' }} />
              Underline
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Paragraph"
        description="Truncating paragraph with optional 'Show more' toggle. Uses @chenglou/pretext for font-engine line measurement — no getBoundingClientRect reflow. Button only appears when text actually overflows."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Long text → button SHOULD appear */}
          <div className="border-border bg-card rounded-xl border p-5 shadow-sm">
            <p className="text-muted-foreground mb-3 text-[0.7rem] tracking-[0.15em] uppercase">
              Long · clamp 3 · expandable
            </p>
            <h3 className="text-foreground mb-2 text-base font-semibold">
              Barolo Riserva 2018
            </h3>
            <Paragraph
              text={wineDescriptionLong}
              clamp={3}
              expandable
              style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--muted-foreground)' }}
            />
          </div>

          {/* Short text → button should NOT appear (key feature) */}
          <div className="border-border bg-card rounded-xl border p-5 shadow-sm">
            <p className="text-muted-foreground mb-3 text-[0.7rem] tracking-[0.15em] uppercase">
              Short · clamp 3 · expandable
            </p>
            <h3 className="text-foreground mb-2 text-base font-semibold">
              Grüner Veltliner 2023
            </h3>
            <Paragraph
              text={wineDescriptionShort}
              clamp={3}
              expandable
              style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--muted-foreground)' }}
            />
            <p className="text-muted-foreground mt-3 text-[0.7rem] italic">
              No button rendered — Pretext detected the text fits.
            </p>
          </div>

          {/* Silent clamp, no button */}
          <div className="border-border bg-card rounded-xl border p-5 shadow-sm">
            <p className="text-muted-foreground mb-3 text-[0.7rem] tracking-[0.15em] uppercase">
              Long · clamp 2 · silent
            </p>
            <h3 className="text-foreground mb-2 text-base font-semibold">
              Amarone Classico 2019
            </h3>
            <Paragraph
              text={wineDescriptionLong}
              clamp={2}
              style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--muted-foreground)' }}
            />
            <p className="text-muted-foreground mt-3 text-[0.7rem] italic">
              Silent truncation — no toggle, just CSS clamp.
            </p>
          </div>
        </div>

        <ParagraphMeasureDemo />

        <div className="border-border text-muted-foreground mt-6 flex justify-between border-t pt-3 text-[0.7rem]">
          <span>Paragraph · @chenglou/pretext · ResizeObserver</span>
          <span>Container-Query-friendly · zero reflow measurement</span>
        </div>
      </Section>

      <Section
        title="PullQuote"
        description="Editorial blockquote primitive — serif body, hairline rule, all-caps attribution. Three variants (editorial · plate · cellar), three sizes (sm/md/lg), three alignments. Uses semantic tokens; light/dark/accent aware."
      >
        <div className="flex flex-col gap-12">
          {/* Variant: editorial (default) */}
          <div className="border-border bg-card rounded-xl border p-10 shadow-sm">
            <p className="text-muted-foreground mb-6 text-[0.7rem] tracking-[0.15em] uppercase">
              variant="editorial" · align="left" · size="md"
            </p>
            <PullQuote
              attribution="Marc-André Leclerc"
              byline="Chef Sommelier, Le Bristol"
            >
              Ein Paradebeispiel für Terroir-Treue. Ein Muss für jeden
              Keller, der auf Qualität statt Masse setzt.
            </PullQuote>
          </div>

          {/* Variant: plate, centered, lg */}
          <div className="bg-muted/40 rounded-xl p-10">
            <p className="text-muted-foreground mb-6 text-[0.7rem] tracking-[0.15em] uppercase">
              variant="plate" · align="center" · size="lg"
            </p>
            <PullQuote
              variant="plate"
              align="center"
              size="lg"
              attribution="Elena Rossi"
              byline="Weinkritikerin · Decanter"
            >
              Selten habe ich eine so konsistente Qualität über
              verschiedene Jahrgänge hinweg erlebt.
            </PullQuote>
          </div>

          {/* Variant: cellar (dark), right, sm, no mark */}
          <div className="rounded-xl bg-zinc-950 p-10">
            <p className="mb-6 text-[0.7rem] tracking-[0.15em] text-zinc-400 uppercase">
              variant="cellar" · align="right" · size="sm" · showMark={'{false}'}
            </p>
            <PullQuote
              variant="cellar"
              align="right"
              size="sm"
              showMark={false}
              attribution="Aus dem Hofbuch"
              byline="Eintrag · MMXXIV"
            >
              Der Wein erinnert sich an alles — den Hang, das Jahr, die
              Hand, die ihn gelesen hat.
            </PullQuote>
          </div>

          {/* Edge case: no attribution */}
          <div className="border-border bg-card rounded-xl border p-10 shadow-sm">
            <p className="text-muted-foreground mb-6 text-[0.7rem] tracking-[0.15em] uppercase">
              edge · no attribution · no role
            </p>
            <PullQuote size="md">
              Weniger Eingriffe. Mehr Antworten aus dem Boden.
            </PullQuote>
          </div>
        </div>

        <div className="border-border text-muted-foreground mt-6 flex justify-between border-t pt-3 text-[0.7rem]">
          <span>PullQuote · semantic tokens · no animation</span>
          <span>Compose with BlurFade for entrance · light/dark/accent aware</span>
        </div>
      </Section>

      <Section
        title="PaperNote"
        description="Scrapbook-Notiz aus echtem Papier: variant='torn' (rundum gerissen, Washi-Tape, fällt beim Scrollen ins Bild) und variant='notepad' (vom Block gerissen, Kreppband, statisch). Papierfarben kraft · cream · dark bleiben bewusst theme-unabhängig; der Pfeil übernimmt die Textfarbe."
        canReload
      >
        <div className="flex flex-col gap-10">
          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              variant="torn" · Caveat
            </p>
            <div className="flex flex-wrap items-start gap-x-24 gap-y-24 px-4 pt-8 pb-16">
              <PaperNote paper="kraft" rotate={-3} tape arrow="right">
                Kellerführung am Samstag – wir öffnen die alten Fässer nur für euch.
              </PaperNote>
              <PaperNote paper="cream" rotate={2}>
                Wir schenken dir ein Glas vom 2019er zum Anstoßen.
              </PaperNote>
              <PaperNote paper="dark" rotate={-1.5} tape arrow="down">
                Auf einen unvergesslichen Abend zwischen den Reben!
              </PaperNote>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              variant="notepad" · Kalam · cream mit Linien
            </p>
            <div className="flex flex-wrap items-start gap-x-24 gap-y-24 px-4 pt-8 pb-16">
              <PaperNote variant="notepad" paper="kraft" rotate={-2} tape arrow="right">
                Kellerführung am Samstag – wir öffnen die alten Fässer nur für euch.
              </PaperNote>
              <PaperNote variant="notepad" paper="cream">
                Wir schenken dir ein Glas vom 2019er zum Anstoßen.
              </PaperNote>
              <PaperNote variant="notepad" paper="dark" rotate={-1} tape arrow="down">
                Auf einen unvergesslichen Abend zwischen den Reben!
              </PaperNote>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              edge · langer Inhalt · sehr kurz · ohne Drehung · Pfeil in Akzentfarbe
            </p>
            <div className="flex flex-wrap items-start gap-x-24 gap-y-16 px-4 pt-8 pb-8">
              <PaperNote paper="kraft" rotate={4} tape>
                Bis bald!
              </PaperNote>
              <PaperNote paper="cream" rotate={0} arrow="left" className="text-accent">
                Ohne Drehung, Pfeil per text-accent eingefärbt.
              </PaperNote>
              <PaperNote variant="notepad" paper="cream" rotate={-0.5}>
                Bitte festes Schuhwerk mitbringen: Der Weg durch die Riede ist steil und nach Regen rutschig.
                Treffpunkt ist um 16 Uhr am Hoftor, die Führung dauert etwa zwei Stunden und endet im Keller.
              </PaperNote>
            </div>
          </div>
        </div>

        <div className="border-border text-muted-foreground mt-6 flex justify-between border-t pt-3 text-[0.7rem]">
          <span>PaperNote · fixe Papierfarben · Fonts self-hosted via @fontsource</span>
          <span>Deko aria-hidden · torn respektiert prefers-reduced-motion</span>
        </div>
      </Section>

      <Section
        title="PolaroidFrame"
        description="Foto im klassischen Polaroid-Rahmen mit breitem Fuß für eine Caption in Caveat, optional mit Washi-Tape. Fällt beim Scrollen ins Bild und richtet sich beim Hover gerade. Rahmen und Tinte bleiben bewusst theme-unabhängig."
        canReload
      >
        <div className="flex flex-col gap-10">
          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              golden path · Caption · Tape
            </p>
            <div className="flex flex-wrap items-start gap-x-20 gap-y-20 px-4 pt-8 pb-16">
              <PolaroidFrame
                src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=700&q=80"
                alt="Reihen von Weinstöcken im Abendlicht"
                caption="Riedenwanderung im Oktober"
                rotate={-3}
                tape
              />
              <PolaroidFrame
                src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&q=80"
                alt="Zwei Weingläser beim Anstoßen"
                caption="Anstoßen im Kellergewölbe"
                rotate={2}
              />
              <PolaroidFrame
                src="https://images.unsplash.com/photo-1474722883778-792e7990302f?w=700&q=80"
                alt="Gewölbekeller mit Holzfässern"
                rotate={-1}
              />
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              edge · lange Caption mit Markup · Bild fehlt · breiter ohne Drehung · mit PaperNote
            </p>
            <div className="flex flex-wrap items-start gap-x-20 gap-y-20 px-4 pt-8 pb-8">
              <PolaroidFrame
                src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=700&q=80"
                alt="Reihen von Weinstöcken im Abendlicht"
                caption={<>Die ganze Familie bei der Lese <em>2025</em>, mit Simon, Oma und den Nachbarskindern</>}
                rotate={1.5}
              />
              <PolaroidFrame src="/does-not-exist.jpg" alt="Foto vom Hoffest (Bild fehlt)" caption="Bild fehlt" rotate={-2} />
              <PolaroidFrame
                src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&q=80"
                alt="Zwei Weingläser beim Anstoßen"
                caption="Ohne Drehung, w-80"
                rotate={0}
                className="w-80"
              />
              <div className="flex items-start gap-6">
                <PolaroidFrame
                  src="https://images.unsplash.com/photo-1474722883778-792e7990302f?w=700&q=80"
                  alt="Gewölbekeller mit Holzfässern"
                  caption="Kellerführung"
                  rotate={-2.5}
                  tape
                  className="w-56"
                />
                <PaperNote paper="kraft" rotate={3} className="mt-24">
                  Samstag, 16 Uhr am Hoftor
                </PaperNote>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border text-muted-foreground mt-6 flex justify-between border-t pt-3 text-[0.7rem]">
          <span>PolaroidFrame · fixe Rahmenfarbe · Caveat self-hosted via @fontsource</span>
          <span>figure + figcaption · Hover nur mit feinem Zeiger · respektiert prefers-reduced-motion</span>
        </div>
      </Section>

      <Section
        title="ProcessSteps"
        description="Statische Erklär-Kette in drei Darstellungen: variant='paper' (Papier-Kreise mit Pfeilen), 'trail' (Kraft-Stempel auf einem gepunkteten Pfad) und 'ledger' (römische Ziffern über Hairlines, Maison-Stil). Unter 42 rem Containerbreite stapeln sich die Schritte vertikal."
        canReload
      >
        <div className="flex flex-col gap-14">
          <div>
            <p className="text-muted-foreground mb-6 text-[0.7rem] tracking-[0.15em] uppercase">
              variant="paper" · Default
            </p>
            <ProcessSteps steps={WINE_STEPS} />
          </div>

          <div>
            <p className="text-muted-foreground mb-6 text-[0.7rem] tracking-[0.15em] uppercase">
              variant="trail" · Caveat
            </p>
            <ProcessSteps variant="trail" steps={WINE_STEPS} />
          </div>

          <div>
            <p className="text-muted-foreground mb-6 text-[0.7rem] tracking-[0.15em] uppercase">
              variant="ledger" · font-display
            </p>
            <ProcessSteps variant="ledger" steps={WINE_STEPS} />
          </div>

          <div>
            <p className="text-muted-foreground mb-6 text-[0.7rem] tracking-[0.15em] uppercase">
              edge · drei Schritte mit langem Label · schmaler Container (max-w-sm) stapelt vertikal
            </p>
            <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
              <ProcessSteps steps={SHORT_STEPS} className="lg:flex-1" />
              <ProcessSteps variant="trail" steps={SHORT_STEPS} className="max-w-sm" />
            </div>
          </div>
        </div>

        <div className="border-border text-muted-foreground mt-6 flex justify-between border-t pt-3 text-[0.7rem]">
          <span>ProcessSteps · Container-Query @2xl · Papier fix, Linien folgen dem Theme</span>
          <span>ol · Deko aria-hidden · respektiert prefers-reduced-motion</span>
        </div>
      </Section>

      <Section title="TextScramble" description="Text reveal with randomized character scramble animation." canReload>
        <div className="text-foreground font-mono text-2xl font-semibold">
          <TextScramble text="Hello, this is TextScramble!" speed={25} />
        </div>
      </Section>

      <Section title="TextRotate" description="Animated text rotation with staggered character transitions." canReload>
        <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
          <div className="flex flex-col items-center gap-4 p-12 px-8 text-center">
            <p className="text-muted-foreground text-[0.7rem] tracking-[0.2em] uppercase">
              Curated Selection
            </p>
            <div className="text-4xl leading-tight font-bold tracking-tight">
              <span className="text-foreground">Discover </span>
              <TextRotate
                texts={['Barolo', 'Amarone', 'Brunello', 'Chianti', 'Sassicaia', 'Barbaresco']}
                rotationInterval={4000}
                staggerDuration={0.06}
                staggerFrom="first"
                mainStyle={{}}
                elementLevelStyle={{ color: 'var(--accent)' }}
              />
            </div>
            <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
              Handverlesene Weine aus den besten Lagen Italiens.
              Jeder Jahrgang erzählt eine Geschichte.
            </p>
            <div className="mt-6 flex w-full justify-center gap-4">
              {[
                { name: 'Barolo Riserva', year: '2018', region: 'Piemonte' },
                { name: 'Amarone Classico', year: '2019', region: 'Veneto' },
                { name: 'Brunello DOCG', year: '2017', region: 'Toscana' },
              ].map((wine) => (
                <div
                  key={wine.name}
                  className="border-border bg-background max-w-40 flex-1 rounded-lg border p-4 text-left shadow-sm"
                >
                  <div className="bg-accent mb-3 h-8 w-8 rounded-full opacity-70" />
                  <p className="text-foreground text-[0.8125rem] font-semibold">{wine.name}</p>
                  <p className="text-muted-foreground mt-1 text-xs">{wine.region} · {wine.year}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border-border text-muted-foreground flex justify-between border-t bg-white/1 p-3 px-8 text-[0.7rem]">
            <span>TextRotate · splitBy: characters · staggerFrom: first</span>
            <span>rotationInterval: 4000ms</span>
          </div>
        </div>
      </Section>

      <Section title="AuroraText" description="Gradient text with animated color shifting. variant='aurora' (default) sanft wechselnd, variant='gradient' stetiger Loop für CTAs." canReload>
        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">variant="aurora" (default)</p>
            <div className="text-4xl font-bold tracking-tight">
              <AuroraText speed={0.8}>Premium Quality</AuroraText>
            </div>
            <div className="mt-3 text-xl font-semibold">
              <AuroraText colors={['var(--accent)', '#7928CA', '#FF0080', 'var(--accent)']} speed={0.5}>
                Uses your accent color
              </AuroraText>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">variant="gradient" – stetiger Loop, knallig für CTAs</p>
            <div className="text-4xl font-bold tracking-tight">
              <AuroraText variant="gradient" speed={0.8}>Jetzt entdecken</AuroraText>
            </div>
            <div className="mt-3 text-xl font-semibold">
              <AuroraText variant="gradient" colors={['#f43f5e', '#f97316', '#fbbf24', '#10b981']} speed={0.5}>
                Weinkollektion 2024
              </AuroraText>
            </div>
          </div>
        </div>
      </Section>

      <Section title="MorphingText" description="CSS-Blur-Überblend zwischen mehreren Texten – kein Framer Motion.">
        <div className="space-y-6">
          <div className="text-foreground text-4xl font-bold tracking-tight">
            Entdecke{' '}
            <MorphingText
              texts={['Barolo', 'Amarone', 'Brunello', 'Riesling', 'Champagner']}
              duration={4000}
              style={{ color: 'var(--accent)' }}
            />
          </div>
          <div className="text-muted-foreground text-xl">
            <MorphingText
              texts={['Frisch. Fruchtig. Fein.', 'Tief. Komplex. Unvergesslich.', 'Wild. Elegant. Pur.']}
              duration={5000}
            />
          </div>
        </div>
      </Section>

      <Section title="ShinyText + ShinyButton" description="Animierter Shine-Effekt auf Text und Button. Kein Framer Motion.">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">ShinyText</p>
            <div className="flex flex-wrap items-center gap-6">
              <span className="text-2xl font-bold">
                <ShinyText duration={6}>Premium Weinkollektion</ShinyText>
              </span>
              <span className="text-lg font-semibold">
                <ShinyText shineColor="rgba(251,191,36,0.9)" duration={8}>Gold Reserve</ShinyText>
              </span>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">ShinyButton</p>
            <div className="flex flex-wrap items-center gap-4">
              <ShinyButton>In den Warenkorb</ShinyButton>
              <ShinyButton shineColor="rgba(251,191,36,0.7)" style={{ backgroundColor: '#92400e' }}>
                Gold Collection
              </ShinyButton>
            </div>
          </div>
        </div>
      </Section>

      <Section title="BlurFade" description="Viewport-Einblend-Wrapper mit Blur + Opacity-Transition via IntersectionObserver." canReload>
        <div className="space-y-4">
          <p className="text-muted-foreground text-xs tracking-widest uppercase">direction="up" (default) – Elemente scrollen in den Viewport</p>
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
                  <div className="mb-3 h-8 w-8 rounded-full" style={{ background: 'var(--accent)', opacity: 0.7 }} />
                  <p className="text-foreground text-sm font-semibold">{name}</p>
                  <p className="text-muted-foreground mt-1 text-xs">Scroll-triggered fade</p>
                </div>
              </BlurFade>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
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
        <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
          <div className="py-8">
            <VelocityScroll baseVelocity={-30} rows={2} gap="1rem">
              {testimonials.map((t) => (
                <TestimonialCard key={t.name} testimonial={t} />
              ))}
            </VelocityScroll>
          </div>
          <div className="border-border text-muted-foreground flex justify-between border-t bg-white/1 p-3 px-8 text-[0.7rem]">
            <span>VelocityScroll · useVelocity + useSpring · 2 rows</span>
            <span>Scroll the page to accelerate</span>
          </div>
        </div>
      </Section>

      <Section title="Timeline" description="Vertical timeline with scroll-reveal dots and content. Pure IntersectionObserver + CSS keyframes.">
        <div className="border-border bg-card rounded-xl border p-8 shadow-sm">
          <Timeline
            items={[
              {
                year: '1952',
                title: 'Gründung des Weinguts',
                content:
                  'Großvater Alessandro kauft den ersten Weinberg in den Hügeln von Barolo. Sechs Hektar Nebbiolo auf kalkhaltigem Boden.',
              },
              {
                year: '1987',
                title: 'Erste internationale Auszeichnung',
                content:
                  'Der Barolo Riserva erhält beim Concours Mondial in Brüssel die Goldmedaille — der Beginn einer langen Erfolgsgeschichte.',
              },
              {
                year: '2005',
                title: 'Umstellung auf biologischen Anbau',
                content:
                  'Komplette Umstellung aller Parzellen auf biologisch-dynamische Bewirtschaftung. Zertifizierung nach Demeter-Richtlinien.',
              },
              {
                year: '2018',
                title: 'Jahrgang des Jahrhunderts',
                content:
                  'Ein außergewöhnlich warmer Sommer mit perfekten Reifebedingungen. Der Barolo 2018 wird als bester Jahrgang seit 1990 gefeiert.',
              },
              {
                year: '2024',
                title: 'Direct-to-Consumer',
                content:
                  'Start des Online-Shops. Weine direkt ab Hof, ohne Zwischenhändler — die dritte Generation führt Tradition in die Digitalisierung.',
              },
            ]}
          />
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

      <Section
        title="WaveText"
        description="Verstecktes Klick-Easteregg: Ein Klick schickt eine Welle durch die Zeichen. Bewusst ohne Cursor-Wechsel und ohne Fokus-Ring — in Produktion soll man es zufällig finden. Hier steht der Hinweis nur, damit die Demo bedienbar bleibt."
      >
        <div className="space-y-8">
          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">
              Golden Path — vertikale Meta-Rail (Seitenkante). Auf den Text klicken.
            </p>
            <div className="border-border flex h-56 items-center rounded-lg border px-6">
              <WaveText className="text-muted-foreground block text-[9px] font-bold tracking-[0.45em] whitespace-nowrap uppercase [writing-mode:vertical-rl]">
                Sooss · Niederösterreich — Familie Buchart
              </WaveText>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">
              Horizontal, Defaults (amplitude 6 · duration 600 · stagger 40)
            </p>
            <div className="text-2xl font-semibold">
              <WaveText>Weingut Buchart 58</WaveText>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">
              Enger und schneller — amplitude 3, stagger 18
            </p>
            <div className="text-2xl font-semibold">
              <WaveText amplitude={3} stagger={18}>Grüner Veltliner Kaiserstein</WaveText>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">
              Edge Case — langer Text: Durchlauf dauert Zeichenzahl × stagger
            </p>
            <p className="max-w-xl text-sm leading-relaxed">
              <WaveText amplitude={4} stagger={12}>
                Tiefdunkles Granatrot mit violetten Reflexen und feinen Anklängen von Vanille.
              </WaveText>
            </p>
          </div>

          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">
              Edge Case — einzelnes Zeichen (kein Versatz möglich, schwingt als Ganzes)
            </p>
            <div className="text-3xl font-semibold">
              <WaveText>58</WaveText>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="NumeralReveal"
        description="Verstecktes Klick-Easteregg: Ein Klick blendet für drei Sekunden den arabischen Wert ein. Beide Schreibweisen liegen in derselben Grid-Zelle — der Wechsel kann das Layout nicht verschieben."
      >
        <div className="space-y-8">
          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">
              Golden Path — Preis-Ledger. Auf eine Ziffer klicken.
            </p>
            <div className="border-border grid grid-cols-3 divide-x divide-[var(--border)] rounded-lg border">
              {[
                { numeral: 'I', name: 'Ein Jahr', price: 'ab 220 €' },
                { numeral: 'II', name: 'Zwei Jahre', price: 'ab 290 €' },
                { numeral: 'XXX', name: 'La Grande', price: '820 €' },
              ].map(tier => (
                <div key={tier.numeral} className="flex flex-col px-6 py-8">
                  <NumeralReveal numeral={tier.numeral} className="text-accent text-lg font-light italic" />
                  <span className="mt-3 text-xl font-light tracking-tight">{tier.name}</span>
                  <span className="text-muted-foreground mt-1 text-sm tabular-nums">{tier.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">
              Subtraktionsregel — IV, IX, XL, XC, CM
            </p>
            <div className="flex flex-wrap items-baseline gap-8 text-2xl font-light italic">
              {['IV', 'IX', 'XL', 'XC', 'CM'].map(n => (
                <NumeralReveal key={n} numeral={n} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">
              Edge Case — arabisch kürzer bzw. länger als römisch: kein Layout-Sprung
            </p>
            <div className="flex flex-wrap items-baseline gap-8 text-2xl font-light italic">
              <NumeralReveal numeral="XXIX" />
              <NumeralReveal numeral="MMXXVI" />
              <NumeralReveal numeral="I" />
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">
              Edge Case — ungültige Eingabe: wird unverändert und ohne Klick-Verhalten gerendert
            </p>
            <div className="flex flex-wrap items-baseline gap-8 text-2xl font-light italic">
              <NumeralReveal numeral="ABC" />
              <NumeralReveal numeral="" />
              <NumeralReveal numeral="42" />
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">
              Kurze Standzeit — revealDuration 1200, transitionDuration 150
            </p>
            <div className="text-2xl font-light italic">
              <NumeralReveal numeral="XII" revealDuration={1200} transitionDuration={150} />
            </div>
          </div>
        </div>
      </Section>

    </>
  )
}

function ParagraphMeasureDemo() {
  const [width, setWidth] = useState(420)
  const [info, setInfo] = useState<{ lineCount: number; truncated: boolean } | null>(null)

  return (
    <div className="border-border bg-card mt-4 rounded-xl border p-5 shadow-sm">
      <p className="text-muted-foreground mb-3 text-[0.7rem] tracking-[0.15em] uppercase">
        Live measurement · drag the slider to resize
      </p>
      <div className="mb-4 flex items-center gap-4">
        <input
          type="range"
          min={180}
          max={720}
          step={10}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          className="accent-accent flex-1"
        />
        <span className="text-muted-foreground text-xs tabular-nums" style={{ minWidth: '60px' }}>
          {width}px
        </span>
      </div>
      <div
        style={{
          width: `${width}px`,
          maxWidth: '100%',
          border: '1px dashed var(--border)',
          borderRadius: '8px',
          padding: '12px',
          transition: 'width 150ms ease',
        }}
      >
        <Paragraph
          text={wineDescriptionLong}
          clamp={3}
          expandable
          onMeasure={setInfo}
          style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--foreground)' }}
        />
      </div>
      {info && (
        <p className="text-muted-foreground mt-3 text-xs tabular-nums">
          measured: <span className="text-foreground font-medium">{info.lineCount} lines</span>
          {' · '}
          truncated:{' '}
          <span className={info.truncated ? 'text-accent font-medium' : 'text-foreground'}>
            {info.truncated ? 'yes' : 'no'}
          </span>
        </p>
      )}
    </div>
  )
}
