import { useState, type ReactNode } from 'react'
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
import { MarkerCallout } from '@components/marker-callout/marker-callout'
import { HangTag } from '@components/hang-tag/hang-tag'
import { Signature } from '@components/signature/signature'
import { Stamp } from '@components/stamp/stamp'
import { VelocityScroll, TestimonialCard } from '@components/velocity-scroll/velocity-scroll'
import { RotatingDecoration } from '@components/scroll-rotate/scroll-rotate'
import { Timeline } from '@components/timeline/timeline'
import { MorphingText } from '@components/morphing-text/morphing-text'
import { ShinyText, ShinyButton } from '@components/shiny-text/shiny-text'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { WaveText } from '@components/wave-text/wave-text'
import { NumeralReveal } from '@components/numeral-reveal/numeral-reveal'
import { SIGNATURE_SIMON, testimonials } from '../data'

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

      <Section title="Highlighter" description="Text highlighting, underline, hand-drawn marker and handwriting marks (circle, strike, squiggle) that animate on scroll-into-view. The handwriting marks come with three pens: pen (fountain pen, default), nib (broad nib) and pencil (sketched twice)." canReload>
        <div className="border-border bg-card space-y-6 rounded-xl border p-8 shadow-sm">
          <p className="text-foreground text-lg leading-relaxed">
            Unser
            {' '}<Highlighter action="highlight" color="#6366f1">Barolo Riserva 2018</Highlighter>{' '}
            stammt aus den besten Lagen des Piemonte. Er überzeugt durch
            {' '}<Highlighter action="underline" color="#f43f5e" delay={300}>intensive Aromen von Kirschen und Veilchen</Highlighter>{' '}
            und entfaltet am Gaumen eine
            {' '}<Highlighter action="highlight" color="#10b981" delay={600}>bemerkenswerte Komplexität</Highlighter>.
          </p>
          <p className="text-foreground text-lg leading-loose">
            Bei der Riedenwanderung zeigt Simon euch
            {' '}<Highlighter action="marker">die steilsten Lagen von Sooß</Highlighter>{' '}
            und erzählt, warum
            {' '}<Highlighter action="marker" color="oklch(0.85 0.13 140)" delay={300}>der Grüne Veltliner hier oben mehr Säure und mehr Pfeffer bekommt als unten im Tal</Highlighter>.
            Danach geht es
            {' '}<Highlighter action="marker" color="oklch(0.87 0.13 88)" delay={600}>in den Keller</Highlighter>.
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
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span className="inline-block h-2.5 w-4 rounded-[40%_60%_45%_55%]" style={{ background: 'color-mix(in oklch, var(--accent) 45%, transparent)' }} />
              Marker
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-10">
          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              handschrift · circle · strike · squiggle · je Stift eine Zeile
            </p>
            <div className="flex flex-col gap-6 px-4 pt-6">
              {(['pen', 'nib', 'pencil'] as const).map(pen => (
                <p key={pen} className="font-display text-foreground text-2xl leading-[1.6]">
                  Die Kellerführung kostet <Highlighter action="strike" pen={pen}>30,–</Highlighter> 25,– Euro. Wir lesen{' '}
                  <Highlighter action="circle" pen={pen} delay={200}>von Hand</Highlighter>, und der 2025er wird{' '}
                  <Highlighter action="squiggle" pen={pen} delay={400}>außergewöhnlich</Highlighter>.
                  <span className="text-muted-foreground ml-3 font-sans text-xs">pen=&quot;{pen}&quot;{pen === 'pen' && ' · Default'}</span>
                </p>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              auf papier · color=&quot;currentColor&quot; nimmt die Papiertinte · edge: lange Phrase, ohne Scroll-Trigger
            </p>
            <div className="flex flex-wrap items-start gap-x-20 gap-y-12 px-4 pt-8 pb-8">
              <PaperNote variant="notepad" paper="cream" rotate={1.5} className="max-w-72">
                Hofladen am Samstag: Veltliner <Highlighter action="strike" color="currentColor">9,50</Highlighter> 8,– · nur{' '}
                <Highlighter action="circle" pen="pencil" color="currentColor">300 Flaschen</Highlighter> ·{' '}
                <Highlighter action="squiggle" pen="nib" color="oklch(0.43 0.13 18)">unbedingt</Highlighter> kosten!
              </PaperNote>
              <p className="text-foreground max-w-md text-lg leading-loose">
                Bei der Riedenwanderung zeigt Simon euch{' '}
                <Highlighter action="circle" pen="nib">die steilsten Lagen von Sooß</Highlighter> und danach{' '}
                <Highlighter action="squiggle" animateOnView={false}>den Keller</Highlighter>, ganz ohne Scroll-Trigger.
              </p>
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
        description="Editorial blockquote primitive — serif body, hairline rule, all-caps attribution. Three variants (editorial · plate · cellar), three sizes (sm/md/lg), three alignments. Uses semantic tokens; follows light/dark."
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

          {/* Variant: cellar (muted ground), right, sm, no mark */}
          <div className="bg-muted rounded-xl p-10">
            <p className="text-muted-foreground mb-6 text-[0.7rem] tracking-[0.15em] uppercase">
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
          <span>Compose with BlurFade for entrance · follows light/dark</span>
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
                alt="Glas Rotwein auf einem Geländer vor Rebzeilen und einem See"
                caption="Ein Glas mit Aussicht"
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
                alt="Rotweinglas mit Trauben und Weinlaub auf dunklem Grund"
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
                src="https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=700&q=80"
                alt="Reife blaue Trauben am Stock im Gegenlicht"
                caption={<>Die ganze Familie bei der Lese <em>2025</em>, mit Simon, Oma und den Nachbarskindern</>}
                rotate={1.5}
              />
              <PolaroidFrame src="/does-not-exist.jpg" alt="Test: leeres Polaroid, Bild fehlt absichtlich" caption="Test: absichtlich leer" rotate={-2} />
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
                  alt="Rotweinglas mit Trauben und Weinlaub auf dunklem Grund"
                  caption="Verkostung im Keller"
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

      <Section
        title="MarkerCallout"
        description="Ein Satz auf einer handgemachten Fläche: variant='brush' (Pinselstrich, zieht sich auf), 'watercolor' (Aquarell mit Pigmentrand) und 'tape' (eine Zeile pro Kreppband-Streifen). Farben kraft · sage · rose bleiben theme-unabhängig. Für Textmarker im Fließtext: Highlighter action='marker'."
        canReload
      >
        <div className="flex flex-col gap-10">
          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              variant="brush" · Caveat · Form pro Instanz verschieden
            </p>
            <div className="flex flex-wrap items-start gap-x-20 gap-y-16 px-4 pt-8 pb-12">
              <MarkerCallout rotate={-1.5}>Ein besonderes Erlebnis für alle Weinliebhaber – mit euch!</MarkerCallout>
              <MarkerCallout color="sage" rotate={1}>Reben mieten, durch die Ried wandern, im Keller verkosten.</MarkerCallout>
              <MarkerCallout color="rose" rotate={-0.5}>Die Miete ist rein symbolisch.</MarkerCallout>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              variant="watercolor" · font-display kursiv
            </p>
            <div className="flex flex-wrap items-start gap-x-24 gap-y-16 px-4 pt-8 pb-12">
              <MarkerCallout variant="watercolor" rotate={-0.6}>Ein besonderes Erlebnis für alle Weinliebhaber – mit euch!</MarkerCallout>
              <MarkerCallout variant="watercolor" color="sage" rotate={0.5}>Reben mieten, durch die Ried wandern, im Keller verkosten.</MarkerCallout>
              <MarkerCallout variant="watercolor" color="rose" rotate={-0.3}>Die Miete ist rein symbolisch.</MarkerCallout>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              variant="tape" · Kalam fett · lines statt children
            </p>
            <div className="flex flex-wrap items-start gap-x-20 gap-y-16 px-4 pt-8 pb-12">
              <MarkerCallout variant="tape" rotate={-1.5} lines={['Ein besonderes Erlebnis', 'für alle Weinliebhaber', '– mit euch!']} />
              <MarkerCallout variant="tape" color="sage" rotate={1} lines={['Reben mieten,', 'durch die Ried wandern,', 'im Keller verkosten.']} />
              <MarkerCallout variant="tape" color="rose" rotate={-0.5} lines={['Die Miete', 'ist rein symbolisch.']} />
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              edge · sehr kurz · langer Satz mit max-w-md · ohne Drehung · einzelner Streifen
            </p>
            <div className="flex flex-wrap items-start gap-x-20 gap-y-16 px-4 pt-8 pb-8">
              <MarkerCallout color="rose" rotate={3}>Prost!</MarkerCallout>
              <MarkerCallout variant="watercolor" color="kraft" rotate={0} className="max-w-md">
                Bitte festes Schuhwerk mitbringen: Der Weg durch die Riede ist steil, und nach Regen wird er rutschig.
              </MarkerCallout>
              <MarkerCallout variant="tape" color="sage" rotate={0} lines={['Samstag, 16 Uhr']} />
            </div>
          </div>
        </div>

        <div className="border-border text-muted-foreground mt-6 flex justify-between border-t pt-3 text-[0.7rem]">
          <span>MarkerCallout · fixe Mini-Palette · Texturen per Inline-SVG</span>
          <span>Deko aria-hidden · respektiert prefers-reduced-motion</span>
        </div>
      </Section>

      <Section
        title="HangTag"
        description="Kraftkarton-Anhänger mit Ösenring und Bäckergarn, Text in Caveat. variant='hanging' hängt an der Schnur am Flaschenhals: Der Wrapper ist der Knoten, der Anhänger pendelt beim Einblenden aus. variant='loose' liegt frei auf der Seite. Karton und Garn bleiben theme-unabhängig."
        canReload
      >
        <div className="flex flex-col gap-10">
          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              golden path · am Flaschenhals mit Widmung und Winzer-Notiz · frei als Gutschein
            </p>
            <div className="flex flex-wrap items-start gap-x-24 gap-y-16 px-4 pt-8 pb-12">
              <TaggedBottle bottle={SHOP_BOTTLES.red}>
                {knot => (
                  <HangTag style={{ left: knot.left, top: knot.top }} neckWidth={knot.neckWidth} rotate={-11} cordLength={46} sign="Simon">
                    Für Anna – auf viele gemeinsame Abende!
                  </HangTag>
                )}
              </TaggedBottle>
              <TaggedBottle bottle={SHOP_BOTTLES.white}>
                {knot => (
                  <HangTag style={{ left: knot.left, top: knot.top }} neckWidth={knot.neckWidth} rotate={8} cordLength={40} sign="Simon">
                    Gut gekühlt zum Backhendl. Prost!
                  </HangTag>
                )}
              </TaggedBottle>
              <HangTag variant="loose" sign="Simon" className="mt-40">
                Gutschein für eine Kellerführung zu zweit
              </HangTag>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              edge · langer Text ohne Unterschrift · am Haken ohne Halsschlaufe · sehr kurz
            </p>
            <div className="flex flex-wrap items-start gap-x-24 gap-y-16 px-4 pt-8 pb-8">
              <TaggedBottle bottle={SHOP_BOTTLES.red}>
                {knot => (
                  <HangTag style={{ left: knot.left, top: knot.top }} neckWidth={knot.neckWidth} rotate={-6}>
                    Für Oma Resi, die jeden Herbst als Erste im Weingarten steht und als Letzte geht. Alles Liebe zum Achtzigsten!
                  </HangTag>
                )}
              </TaggedBottle>
              {/* Ohne neckWidth nur Knoten und Schnur, hier an einem Nagel */}
              <div className="relative h-80 w-40">
                <span aria-hidden="true" className="bg-muted-foreground absolute top-0 left-1/2 size-2 -translate-x-1/2 rounded-full" />
                <HangTag className="top-1 left-1/2" rotate={3} cordLength={64} sign="Simon">
                  Danke fürs Mithelfen bei der Lese!
                </HangTag>
              </div>
              <HangTag variant="loose" rotate={5} className="mt-16">
                Prost!
              </HangTag>
            </div>
          </div>
        </div>

        <div className="border-border text-muted-foreground mt-6 flex justify-between border-t pt-3 text-[0.7rem]">
          <span>HangTag · fixe Karton- und Garnfarben · Caveat self-hosted via @fontsource</span>
          <span>Deko aria-hidden · Hover (loose) nur mit feinem Zeiger · respektiert prefers-reduced-motion</span>
        </div>
      </Section>

      <Section
        title="Signature"
        description="Handschriftliche Unterschrift, die sich beim Einscrollen Federzug für Federzug selbst zeichnet. variant='nib' (Default) schreibt mit der Breitfeder Haar- und Schattenstriche, 'pen' fein mit der Füllfeder, 'felt' kräftig mit dem Filzstift. Die Tinte ist currentColor: auf der Seite folgt sie dem Theme, auf Papier der Papiertinte. Pfad hier ein Platzhalter."
        canReload
      >
        <div className="flex flex-col gap-10">
          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              golden path · nib · pen · felt auf der Seite
            </p>
            <div className="flex flex-wrap items-end gap-x-20 gap-y-12 px-4 pt-8 pb-8">
              {(['nib', 'pen', 'felt'] as const).map(variant => (
                <figure key={variant} className="flex flex-col gap-3">
                  <Signature {...SIGNATURE_SIMON} variant={variant} label="Unterschrift: Simon Buchart" className="text-foreground" />
                  <figcaption className="text-muted-foreground text-xs">
                    variant="{variant}"{variant === 'nib' && ' · Default'}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              auf papier · Bordeaux-Tinte per style · Tinte vom Papier geerbt
            </p>
            <div className="flex flex-wrap items-start gap-x-24 gap-y-16 px-4 pt-8 pb-8">
              <PaperNote variant="notepad" paper="cream" rotate={1.5}>
                Danke fürs Mithelfen bei der Lese! Ohne euch wär der 2025er noch am Stock.
                <Signature {...SIGNATURE_SIMON} label="Unterschrift: Simon" className="mt-4 w-40" style={{ color: 'oklch(0.36 0.1 15)' }} />
              </PaperNote>
              <PaperNote paper="kraft" rotate={-2}>
                Kellerführung am Samstag, 16 Uhr. Wir freuen uns!
                <Signature {...SIGNATURE_SIMON} variant="felt" label="Unterschrift: Simon" className="mt-3 w-36" />
              </PaperNote>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              edge · Deko neben Klartext-Namen (ohne label) · sehr klein · sehr groß
            </p>
            <div className="flex flex-wrap items-end gap-x-20 gap-y-12 px-4 pt-8 pb-8">
              <div className="text-foreground">
                <p className="font-display text-2xl italic">Herzlich,</p>
                <Signature {...SIGNATURE_SIMON} variant="pen" className="mt-1 w-52" />
                <div className="border-border mt-2 border-t pt-2.5">
                  <p className="text-[0.68rem] font-medium tracking-[0.22em] uppercase">Simon Buchart</p>
                  <p className="text-muted-foreground mt-1 text-xs">Winzer · Weingut Buchart</p>
                </div>
              </div>
              <Signature {...SIGNATURE_SIMON} label="Unterschrift: Simon" className="text-foreground w-24" />
              <Signature {...SIGNATURE_SIMON} label="Unterschrift: Simon" className="text-foreground w-full max-w-md" />
            </div>
          </div>
        </div>

        <div className="border-border text-muted-foreground mt-6 flex justify-between border-t pt-3 text-[0.7rem]">
          <span>Signature · Tinte = currentColor · Strich skaliert mit der viewBox</span>
          <span>mit label role=img, sonst aria-hidden · respektiert prefers-reduced-motion</span>
        </div>
      </Section>

      <Section
        title="Stamp"
        description="Gummistempel für den Jahrgang, der sich beim Einscrollen aufdrückt. variant='seal' (Default) ist der Rundstempel mit Umschrift, 'date' der Datumsstempel, dessen Ziffernräder auf das Jahr einrasten. Die Tinte ist currentColor: auf der Seite folgt sie dem Theme, auf Etikett und Papier kommt sie per style. Jeder Abdruck hat eigene Fehlstellen."
        canReload
      >
        <div className="flex flex-col gap-10">
          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              golden path · seal · date auf der Seite
            </p>
            <div className="flex flex-wrap items-center gap-x-20 gap-y-12 px-4 pt-8 pb-8">
              <Stamp year={2025} issuer="Weingut Buchart" place="Sooß · Niederösterreich" className="text-foreground" />
              <Stamp year={2025} variant="date" issuer="Weingut Buchart" className="text-foreground" />
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              auf dem etikett · Bordeaux und Schwarzblau auf hellem, Deckweiß auf dunklem Etikett
            </p>
            {/* Der Schein hinter den Flaschen ragt seitlich über die Reihe: abschneiden, damit 390 px nicht quer scrollt,
                und am Rand ausblenden statt hart kappen */}
            <div className="flex flex-wrap items-center gap-x-12 gap-y-12 overflow-x-clip px-4 pt-8 pb-8 [mask-image:linear-gradient(to_right,transparent,black_1rem,black_calc(100%-1rem),transparent)]">
              <TaggedBottle bottle={SHOP_BOTTLES.white}>
                {(_, label) => (
                  <div className="absolute flex items-center justify-center" style={label}>
                    <Stamp year={2025} issuer="Weingut Buchart" place="Sooß · Niederösterreich" className="w-27" style={{ color: STAMP_INK.bordeaux }} />
                  </div>
                )}
              </TaggedBottle>
              <TaggedBottle bottle={SHOP_BOTTLES.red}>
                {(_, label) => (
                  <div className="absolute flex items-center justify-center" style={label}>
                    <Stamp year={2025} issuer="Weingut Buchart" place="Sooß · Niederösterreich" className="w-27" style={{ color: STAMP_INK.chalk }} />
                  </div>
                )}
              </TaggedBottle>
              <TaggedBottle bottle={SHOP_BOTTLES.white}>
                {(_, label) => (
                  <div className="absolute flex items-center justify-center" style={label}>
                    <Stamp year={2025} variant="date" issuer="Weingut Buchart" className="w-29" style={{ color: STAMP_INK.navy }} />
                  </div>
                )}
              </TaggedBottle>
              <TaggedBottle bottle={SHOP_BOTTLES.red}>
                {(_, label) => (
                  <div className="absolute flex items-center justify-center" style={label}>
                    <Stamp year={2025} variant="date" issuer="Weingut Buchart" className="w-29" style={{ color: STAMP_INK.chalk }} />
                  </div>
                )}
              </TaggedBottle>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              auf papier · Tinte per style
            </p>
            <div className="flex flex-wrap items-start gap-x-24 gap-y-16 px-4 pt-8 pb-8">
              <PaperNote variant="notepad" paper="cream" rotate={1.5} className="max-w-64">
                Der Veltliner ist abgefüllt, ab Samstag im Hofladen!
                <Stamp year={2025} issuer="Weingut Buchart" place="Sooß" className="mt-5 ml-auto w-28" style={{ color: STAMP_INK.bordeaux }} />
              </PaperNote>
              <PaperNote paper="kraft" rotate={-2} className="max-w-64">
                Jahrgangspräsentation am 14. November, wir freuen uns!
                <Stamp year={2025} variant="date" issuer="Weingut Buchart" className="mt-4 ml-auto w-36" style={{ color: STAMP_INK.navy }} />
              </PaperNote>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-[0.7rem] tracking-[0.15em] uppercase">
              edge · ohne Umschrift · lange Texte (gestaucht) · englisch per messages · anderes Jahr · sehr klein · decorative neben Produkttitel
            </p>
            <div className="flex flex-wrap items-center gap-x-16 gap-y-12 px-4 pt-8 pb-8">
              <Stamp year={2025} className="text-foreground" />
              <Stamp
                year={2025}
                issuer="Weingut Familie Buchart & Söhne"
                place="Sooß an der Südbahn · Niederösterreich · Österreich"
                messages={{ vintage: 'Neuer Jahrgang' }}
                className="text-foreground"
              />
              <Stamp year={2025} variant="date" issuer="Domaine Buchart" messages={{ vintage: 'Vintage' }} className="text-foreground" />
              <Stamp year={2019} variant="date" className="text-foreground" />
              <Stamp year={2025} issuer="Weingut Buchart" place="Sooß" className="text-foreground w-20" />
              {/* Jahrgang steht im Titel, der Stempel wird nicht vorgelesen */}
              <div className="text-foreground">
                <p className="font-display text-xl">Grüner Veltliner 2025</p>
                <p className="text-muted-foreground text-xs">Ried Hochfeld · trocken</p>
                <Stamp year={2025} variant="date" decorative className="mt-3 w-36" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-border text-muted-foreground mt-6 flex justify-between border-t pt-3 text-[0.7rem]">
          <span>Stamp · Tinte = currentColor · „Jahrgang“ per i18n (de/en)</span>
          <span>role=img mit „Jahrgang 2025“ · respektiert prefers-reduced-motion</span>
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
          <div className="border-border text-muted-foreground flex justify-between border-t bg-foreground/1 p-3 px-8 text-[0.7rem]">
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
          <div className="border-border text-muted-foreground flex justify-between border-t bg-foreground/1 p-3 px-8 text-[0.7rem]">
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
            <div className="border-border flex items-center rounded-lg border px-6 py-8">
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

// ─── HangTag- und Stamp-Demo ────────────────────────────────────────────────

// Freigestellte Shop-Flaschen (1024 × 1536). Maße in Bildpixeln, aus dem Alpha-Kanal vermessen:
// Umriss der Flasche, Knoten am Übergang Hals → Schulter, Halsbreite dort, Etikett.
const SHOP_BOTTLES = {
  red: { src: '/wine-default.png', alt: 'Rotweinflasche', x: 390, y: 253, w: 246, h: 986, knotX: 513.5, knotY: 514, neck: 92, label: { x: 392, y: 690, w: 240, h: 330 } },
  white: { src: '/white-wine-default.png', alt: 'Weißweinflasche', x: 410, y: 269, w: 212, h: 866, knotX: 516, knotY: 501, neck: 79, label: { x: 410, y: 652, w: 210, h: 306 } },
}

const BOTTLE_H = 520

// Stempeltinte auf Etikett und Papier. Auf der Seite folgt sie dem Theme.
const STAMP_INK = { bordeaux: 'oklch(0.43 0.13 18)', navy: 'oklch(0.34 0.07 258)', chalk: 'oklch(0.93 0.02 85)' }

/** Flasche auf 520 px Höhe zugeschnitten. Reicht Knotenpunkt und Halsbreite (HangTag) sowie das Etikett (Stamp) in px weiter. */
function TaggedBottle({
  bottle,
  children,
}: {
  bottle: (typeof SHOP_BOTTLES)['red']
  children: (
    knot: { left: number; top: number; neckWidth: number },
    label: { left: number; top: number; width: number; height: number },
  ) => ReactNode
}) {
  const s = BOTTLE_H / bottle.h
  return (
    <div className="relative shrink-0" style={{ width: bottle.w * s, height: BOTTLE_H }}>
      {/* Heller Schein hinter der Flasche, sonst verschwindet die dunkle Flasche im Dark Mode */}
      <span
        aria-hidden="true"
        className="absolute -inset-x-16 inset-y-0"
        style={{ background: 'radial-gradient(closest-side, color-mix(in oklch, var(--foreground) 9%, transparent), transparent)' }}
      />
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={bottle.src}
          alt={bottle.alt}
          className="absolute max-w-none"
          style={{ width: 1024 * s, left: -bottle.x * s, top: -bottle.y * s }}
        />
      </div>
      {children(
        { left: (bottle.knotX - bottle.x) * s, top: (bottle.knotY - bottle.y) * s, neckWidth: bottle.neck * s },
        { left: (bottle.label.x - bottle.x) * s, top: (bottle.label.y - bottle.y) * s, width: bottle.label.w * s, height: bottle.label.h * s },
      )}
    </div>
  )
}
