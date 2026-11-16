import { useState, type ReactNode } from 'react'
import { Barrel, Droplets, Grape, MapPin, Sun, Wine } from 'lucide-react'
import { Section } from '../components/section'
import { DemoTabs } from '../components/demo-tabs'
import { VariantDemo, type VariantAxis, type VariantOption } from '../components/variant-demo'
import { TextRotate } from '@components/text-rotate/text-rotate'
import { AuroraText, type AuroraTextProps } from '@components/aurora-text/aurora-text'
import { Highlighter, type HighlightAction, type HighlightPen } from '@components/highlighter/highlighter'
import { Paragraph } from '@components/paragraph/paragraph'
import { PullQuote } from '@components/pull-quote/pull-quote'
import { PaperNote, type PaperNoteArrow, type PaperNotePaper, type PaperNoteVariant } from '@components/paper-note/paper-note'
import { PolaroidFrame } from '@components/polaroid-frame/polaroid-frame'
import { ProcessSteps, type ProcessStep, type ProcessStepsVariant } from '@components/process-steps/process-steps'
import { MarkerCallout, type MarkerCalloutColor, type MarkerCalloutProps } from '@components/marker-callout/marker-callout'
import { HangTag, type HangTagVariant } from '@components/hang-tag/hang-tag'
import { Signature, type SignatureVariant } from '@components/signature/signature'
import { Stamp, type StampVariant } from '@components/stamp/stamp'
import { VelocityScroll, TestimonialCard } from '@components/velocity-scroll/velocity-scroll'
import { RotatingDecoration } from '@components/scroll-rotate/scroll-rotate'
import { MorphingText } from '@components/morphing-text/morphing-text'
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
      <Section title="Highlighter" description="Text highlighting, underline, hand-drawn marker and handwriting marks (circle, strike, squiggle) that animate on scroll-into-view. The handwriting marks come with three pens: pen (fountain pen, default), nib (broad nib) and pencil (sketched twice)." canReload>
        <VariantDemo
          label="action"
          options={HIGHLIGHTER_ACTIONS}
          secondary={highlighterExamples}
          className="min-h-48"
          render={(action, example) => <HighlighterStage action={action} example={example} />}
        />
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
        <DemoTabs
          tabs={[
            {
              value: 'editorial',
              label: 'Editorial',
              content: (
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
              ),
            },
            {
              value: 'plate',
              label: 'Plate',
              content: (
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
              ),
            },
            {
              value: 'cellar',
              label: 'Cellar',
              content: (
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
              ),
            },
            {
              value: 'plain',
              label: 'Ohne Zuschreibung',
              content: (
                <div className="border-border bg-card rounded-xl border p-10 shadow-sm">
                  <p className="text-muted-foreground mb-6 text-[0.7rem] tracking-[0.15em] uppercase">
                    edge · no attribution · no role
                  </p>
                  <PullQuote size="md">
                    Weniger Eingriffe. Mehr Antworten aus dem Boden.
                  </PullQuote>
                </div>
              ),
            },
          ]}
        />

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
        <VariantDemo
          options={PAPER_NOTE_VARIANTS}
          secondary={paperNoteExamples}
          className="min-h-90 justify-start px-4 pt-8 pb-16 sm:justify-center"
          render={(variant, example) => <PaperNoteStage variant={variant} example={example} />}
        />

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
        <VariantDemo
          label="Beispiel"
          options={POLAROID_EXAMPLES}
          className="min-h-112 px-4 pt-8 pb-8"
          render={example => <PolaroidStage example={example} />}
        />

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
        <VariantDemo
          options={PROCESS_VARIANTS}
          secondary={PROCESS_STEPS}
          className="min-h-195 flex-col items-stretch md:min-h-136"
          render={(variant, steps) => (
            <ProcessSteps
              variant={variant}
              steps={steps === 'five' ? WINE_STEPS : SHORT_STEPS}
              className={steps === 'narrow' ? 'max-w-sm' : undefined}
            />
          )}
        />

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
        <VariantDemo
          options={CALLOUT_VARIANTS}
          secondary={calloutExamples}
          className="min-h-77 px-4 pt-8 pb-12 md:min-h-62"
          render={(variant, example) => <CalloutStage variant={variant} example={example} />}
        />

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
        <VariantDemo
          options={HANG_TAG_VARIANTS}
          secondary={hangTagExamples}
          className="min-h-150 px-4 pt-8 pb-12"
          render={(_, example) => <HangTagStage example={example} />}
        />

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
        <VariantDemo
          options={SIGNATURE_VARIANTS}
          secondary={SIGNATURE_EXAMPLES}
          className="min-h-74 px-4 pt-8 pb-8"
          render={(variant, example) => <SignatureStage variant={variant} example={example} />}
        />

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
        <VariantDemo
          options={STAMP_VARIANTS}
          secondary={stampExamples}
          className="min-h-146 px-4 pt-8 pb-8"
          render={(variant, example) => <StampStage variant={variant} example={example} />}
        />

        <div className="border-border text-muted-foreground mt-6 flex justify-between border-t pt-3 text-[0.7rem]">
          <span>Stamp · Tinte = currentColor · „Jahrgang“ per i18n (de/en)</span>
          <span>role=img mit „Jahrgang 2025“ · respektiert prefers-reduced-motion</span>
        </div>
      </Section>

      <Section title="Animated text" description="Text that changes by itself: staggered character rotation and a blur cross-fade between phrases." canReload>
        <DemoTabs
          tabs={[
            {
              value: "textrotate",
              label: "TextRotate",
              content: (
                <>
                  <p className="text-muted-foreground mb-6 text-sm">{"Animated text rotation with staggered character transitions."}</p>
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
                </>
              ),
            },
            {
              value: "morphingtext",
              label: "MorphingText",
              content: (
                <>
                  <p className="text-muted-foreground mb-6 text-sm">{"CSS-Blur-Überblend zwischen mehreren Texten – kein Framer Motion."}</p>
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
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="AuroraText" description="Gradient text with animated color shifting. variant='aurora' (default) sanft wechselnd, variant='gradient' stetiger Loop für CTAs." canReload>
        <VariantDemo
          options={AURORA_VARIANTS}
          secondary={AURORA_COLORS}
          className="min-h-24"
          render={(variant, colors) => (
            <div className="text-4xl font-bold tracking-tight">
              <AuroraText
                variant={variant}
                colors={colors === 'accent' || colors === 'sunset' ? AURORA_PALETTES[colors] : undefined}
                speed={colors === 'default' ? 0.8 : 0.5}
              >
                {AURORA_TEXTS[colors === 'default' || !colors ? variant : colors]}
              </AuroraText>
            </div>
          )}
        />
      </Section>

      <Section title="Scroll motion" description="Elements that react to page scroll: velocity-driven rows and scroll-based rotation.">
        <DemoTabs
          tabs={[
            {
              value: "velocityscroll",
              label: "VelocityScroll",
              content: (
                <>
                  <p className="text-muted-foreground mb-6 text-sm">{"Scroll-reactive testimonial rows that accelerate with page scroll velocity."}</p>
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
                </>
              ),
            },
            {
              value: "scrollrotate",
              label: "ScrollRotate",
              content: (
                <>
                  <p className="text-muted-foreground mb-6 text-sm">{"Element that rotates based on scroll position."}</p>
                  <div className="flex items-center gap-8">
                    <RotatingDecoration />
                    <p className="text-muted-foreground text-sm">
                      Scroll the page to see the decoration rotate.
                    </p>
                  </div>
                </>
              ),
            },
          ]}
        />
      </Section>

      {/* Extra height so ScrollRotate has room to work */}
      <div className="h-[50vh]" />

      <Section
        title="WaveText"
        description="Verstecktes Klick-Easteregg: Ein Klick schickt eine Welle durch die Zeichen. Bewusst ohne Cursor-Wechsel und ohne Fokus-Ring — in Produktion soll man es zufällig finden. Hier steht der Hinweis nur, damit die Demo bedienbar bleibt."
      >
        <VariantDemo
          label="Beispiel"
          options={WAVE_EXAMPLES}
          className="min-h-119"
          render={example => <WaveStage example={example} />}
        />
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

          <VariantDemo
            label="Fall"
            options={NUMERAL_CASES}
            secondary={numeralExamples}
            className="min-h-16"
            render={(fall, numeral) => (
              <div className="text-2xl font-light italic">
                {fall === 'short'
                  ? <NumeralReveal numeral="XII" revealDuration={1200} transitionDuration={150} />
                  : <NumeralReveal numeral={numeral === 'empty' ? '' : (numeral ?? '')} />}
              </div>
            )}
          />
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

// ─── Variant demos: one instance per section, switched via VariantDemo ──────

const HIGHLIGHTER_ACTIONS: VariantOption<HighlightAction>[] = [
  { value: 'highlight', label: 'highlight', snippet: 'action="highlight"' },
  { value: 'underline', label: 'underline', snippet: 'action="underline" · color="#f43f5e"' },
  { value: 'marker', label: 'marker', snippet: 'action="marker"' },
  { value: 'strike', label: 'strike', snippet: 'action="strike"' },
  { value: 'circle', label: 'circle', snippet: 'action="circle"' },
  { value: 'squiggle', label: 'squiggle', snippet: 'action="squiggle"' },
]

const HIGHLIGHTER_PAPER_SNIPPET: Partial<Record<HighlightAction, string>> = {
  strike: 'auf PaperNote · color="currentColor" nimmt die Papiertinte',
  circle: 'auf PaperNote · pen="pencil" · color="currentColor"',
  squiggle: 'auf PaperNote · pen="nib" · color="oklch(0.43 0.13 18)"',
}

/** Second switcher per action: colors for highlight, examples for marker, pens and contexts for the handwriting marks. */
function highlighterExamples(action: HighlightAction): VariantAxis | undefined {
  if (action === 'underline') return undefined
  if (action === 'highlight') {
    return {
      label: 'color',
      options: [
        { value: 'indigo', label: 'Indigo', snippet: 'color="#6366f1"' },
        { value: 'emerald', label: 'Smaragd', snippet: 'color="#10b981"' },
      ],
    }
  }
  if (action === 'marker') {
    return {
      label: 'Beispiel',
      options: [
        { value: 'accent', label: 'Akzent', snippet: 'Farbe: Akzent (Default)' },
        { value: 'long', label: 'lange Phrase', snippet: 'color="oklch(0.85 0.13 140)" · über mehrere Zeilen' },
        { value: 'yellow', label: 'Gelb', snippet: 'color="oklch(0.87 0.13 88)"' },
      ],
    }
  }
  return {
    label: 'Beispiel',
    options: [
      { value: 'pen', label: 'pen', snippet: 'pen="pen" · Default' },
      { value: 'nib', label: 'nib', snippet: 'pen="nib"' },
      { value: 'pencil', label: 'pencil', snippet: 'pen="pencil"' },
      { value: 'paper', label: 'auf Papier', snippet: HIGHLIGHTER_PAPER_SNIPPET[action] },
      ...(action === 'squiggle' ? [{ value: 'static', label: 'ohne Scroll-Trigger', snippet: 'animateOnView={false}' }] : []),
    ],
  }
}

function HighlighterStage({ action, example }: { action: HighlightAction; example?: string }) {
  const prose = 'text-foreground max-w-xl text-lg leading-loose'
  const handwriting = 'font-display text-foreground text-2xl leading-[1.6]'

  if (action === 'highlight') {
    return example === 'emerald' ? (
      <p className={prose}>
        Am Gaumen entfaltet er eine <Highlighter action="highlight" color="#10b981">bemerkenswerte Komplexität</Highlighter>.
      </p>
    ) : (
      <p className={prose}>
        Unser <Highlighter action="highlight" color="#6366f1">Barolo Riserva 2018</Highlighter> stammt aus den besten Lagen des Piemonte.
      </p>
    )
  }
  if (action === 'underline') {
    return (
      <p className={prose}>
        Er überzeugt durch <Highlighter action="underline" color="#f43f5e">intensive Aromen von Kirschen und Veilchen</Highlighter>.
      </p>
    )
  }
  if (action === 'marker') {
    if (example === 'long') {
      return (
        <p className={prose}>
          Simon erzählt, warum{' '}
          <Highlighter action="marker" color="oklch(0.85 0.13 140)">der Grüne Veltliner hier oben mehr Säure und mehr Pfeffer bekommt als unten im Tal</Highlighter>.
        </p>
      )
    }
    if (example === 'yellow') {
      return (
        <p className={prose}>
          Danach geht es <Highlighter action="marker" color="oklch(0.87 0.13 88)">in den Keller</Highlighter>.
        </p>
      )
    }
    return (
      <p className={prose}>
        Bei der Riedenwanderung zeigt Simon euch <Highlighter action="marker">die steilsten Lagen von Sooß</Highlighter>.
      </p>
    )
  }

  // strike, circle, squiggle
  if (example === 'paper') {
    return (
      <PaperNote variant="notepad" paper="cream" rotate={1.5} className="max-w-72">
        Hofladen am Samstag: Veltliner{' '}
        {action === 'strike' ? <Highlighter action="strike" color="currentColor">9,50</Highlighter> : '9,50'} 8,– · nur{' '}
        {action === 'circle' ? <Highlighter action="circle" pen="pencil" color="currentColor">300 Flaschen</Highlighter> : '300 Flaschen'} ·{' '}
        {action === 'squiggle' ? <Highlighter action="squiggle" pen="nib" color="oklch(0.43 0.13 18)">unbedingt</Highlighter> : 'unbedingt'} kosten!
      </PaperNote>
    )
  }
  if (example === 'static') {
    return (
      <p className={prose}>
        Bei der Riedenwanderung zeigt Simon euch die steilsten Lagen von Sooß und danach{' '}
        <Highlighter action="squiggle" animateOnView={false}>den Keller</Highlighter>, ganz ohne Scroll-Trigger.
      </p>
    )
  }
  const pen = example as HighlightPen
  if (action === 'strike') {
    return <p className={handwriting}>Die Kellerführung kostet <Highlighter action="strike" pen={pen}>30,–</Highlighter> 25,– Euro.</p>
  }
  if (action === 'circle') {
    return <p className={handwriting}>Wir lesen <Highlighter action="circle" pen={pen}>von Hand</Highlighter>.</p>
  }
  return <p className={handwriting}>Der 2025er wird <Highlighter action="squiggle" pen={pen}>außergewöhnlich</Highlighter>.</p>
}

const PAPER_NOTE_VARIANTS: VariantOption<PaperNoteVariant>[] = [
  { value: 'torn', label: 'torn', snippet: 'variant="torn" · Default · Caveat' },
  { value: 'notepad', label: 'notepad', snippet: 'variant="notepad" · Kalam · cream mit Linien' },
]

const PAPER_NOTE_TEXT: Record<PaperNotePaper, string> = {
  kraft: 'Kellerführung am Samstag – wir öffnen die alten Fässer nur für euch.',
  cream: 'Wir schenken dir ein Glas vom 2019er zum Anstoßen.',
  dark: 'Auf einen unvergesslichen Abend zwischen den Reben!',
}

// Rotation, tape and arrow per variant and paper, as in the former rows.
const PAPER_NOTE_PROPS: Record<PaperNoteVariant, Record<PaperNotePaper, { rotate?: number; tape?: boolean; arrow?: PaperNoteArrow }>> = {
  torn: { kraft: { rotate: -3, tape: true, arrow: 'right' }, cream: { rotate: 2 }, dark: { rotate: -1.5, tape: true, arrow: 'down' } },
  notepad: { kraft: { rotate: -2, tape: true, arrow: 'right' }, cream: {}, dark: { rotate: -1, tape: true, arrow: 'down' } },
}

function paperNoteExamples(variant: PaperNoteVariant): VariantAxis {
  const papers: VariantOption[] = [
    { value: 'kraft', label: 'kraft', snippet: 'paper="kraft" · Default · tape · arrow="right"' },
    { value: 'cream', label: 'cream', snippet: 'paper="cream"' },
    { value: 'dark', label: 'dark', snippet: 'paper="dark" · tape · arrow="down"' },
  ]
  const edges: VariantOption[] = variant === 'torn'
    ? [
        { value: 'short', label: 'sehr kurz', snippet: 'paper="kraft" · rotate={4} · tape' },
        { value: 'flat', label: 'ohne Drehung', snippet: 'paper="cream" · rotate={0} · arrow="left" · Pfeil per text-accent' },
      ]
    : [{ value: 'long', label: 'langer Inhalt', snippet: 'paper="cream" · rotate={-0.5}' }]
  return { label: 'Beispiel', options: [...papers, ...edges] }
}

function PaperNoteStage({ variant, example }: { variant: PaperNoteVariant; example?: string }) {
  if (example === 'short') {
    return <PaperNote paper="kraft" rotate={4} tape>Bis bald!</PaperNote>
  }
  if (example === 'flat') {
    return (
      <PaperNote paper="cream" rotate={0} arrow="left" className="text-accent">
        Ohne Drehung, Pfeil per text-accent eingefärbt.
      </PaperNote>
    )
  }
  if (example === 'long') {
    return (
      <PaperNote variant="notepad" paper="cream" rotate={-0.5}>
        Bitte festes Schuhwerk mitbringen: Der Weg durch die Riede ist steil und nach Regen rutschig.
        Treffpunkt ist um 16 Uhr am Hoftor, die Führung dauert etwa zwei Stunden und endet im Keller.
      </PaperNote>
    )
  }
  const paper = (example ?? 'kraft') as PaperNotePaper
  return (
    <PaperNote variant={variant} paper={paper} {...PAPER_NOTE_PROPS[variant][paper]}>
      {PAPER_NOTE_TEXT[paper]}
    </PaperNote>
  )
}

const POLAROID_EXAMPLES: VariantOption[] = [
  { value: 'tape', label: 'Caption und Tape', snippet: 'caption · rotate={-3} · tape' },
  { value: 'caption', label: 'Caption', snippet: 'caption · rotate={2}' },
  { value: 'bare', label: 'ohne Caption', snippet: 'rotate={-1}' },
  { value: 'long', label: 'lange Caption', snippet: 'caption mit Markup · rotate={1.5}' },
  { value: 'missing', label: 'Bild fehlt', snippet: 'src ungültig · rotate={-2}' },
  { value: 'wide', label: 'breiter, ohne Drehung', snippet: 'rotate={0} · className="w-80"' },
  { value: 'note', label: 'mit PaperNote', snippet: 'tape · rotate={-2.5} · className="w-56" · daneben PaperNote' },
]

function PolaroidStage({ example }: { example: string }) {
  switch (example) {
    case 'caption':
      return (
        <PolaroidFrame
          src="https://images.unsplash.com/photo-1643087448435-72f70bd4ce88?w=700&q=80"
          alt="Eichenfässer in einem Weinkeller"
          caption="Anstoßen im Kellergewölbe"
          rotate={2}
        />
      )
    case 'bare':
      return (
        <PolaroidFrame
          src="https://images.unsplash.com/photo-1474722883778-792e7990302f?w=700&q=80"
          alt="Rotweinglas mit Trauben und Weinlaub auf dunklem Grund"
          rotate={-1}
        />
      )
    case 'long':
      return (
        <PolaroidFrame
          src="https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=700&q=80"
          alt="Reife blaue Trauben am Stock im Gegenlicht"
          caption={<>Die ganze Familie bei der Lese <em>2025</em>, mit Simon, Oma und den Nachbarskindern</>}
          rotate={1.5}
        />
      )
    case 'missing':
      return <PolaroidFrame src="/does-not-exist.jpg" alt="Test: leeres Polaroid, Bild fehlt absichtlich" caption="Test: absichtlich leer" rotate={-2} />
    case 'wide':
      return (
        <PolaroidFrame
          src="https://images.unsplash.com/photo-1643087448435-72f70bd4ce88?w=700&q=80"
          alt="Eichenfässer in einem Weinkeller"
          caption="Ohne Drehung, w-80"
          rotate={0}
          className="w-80"
        />
      )
    case 'note':
      return (
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
      )
    default:
      return (
        <PolaroidFrame
          src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=700&q=80"
          alt="Glas Rotwein auf einem Geländer vor Rebzeilen und einem See"
          caption="Ein Glas mit Aussicht"
          rotate={-3}
          tape
        />
      )
  }
}

const PROCESS_VARIANTS: VariantOption<ProcessStepsVariant>[] = [
  { value: 'paper', label: 'paper', snippet: 'variant="paper" · Default' },
  { value: 'trail', label: 'trail', snippet: 'variant="trail" · Caveat' },
  { value: 'ledger', label: 'ledger', snippet: 'variant="ledger" · font-display' },
]

const PROCESS_STEPS: VariantAxis = {
  label: 'steps',
  options: [
    { value: 'five', label: 'fünf Schritte', snippet: 'steps={WINE_STEPS}' },
    { value: 'three', label: 'drei, lange Labels', snippet: 'steps={SHORT_STEPS}' },
    { value: 'narrow', label: 'schmal', snippet: 'steps={SHORT_STEPS} · className="max-w-sm" stapelt vertikal' },
  ],
}

type CalloutVariant = NonNullable<MarkerCalloutProps['variant']>

const CALLOUT_VARIANTS: VariantOption<CalloutVariant>[] = [
  { value: 'brush', label: 'brush', snippet: 'variant="brush" · Default · Caveat · Form pro Instanz verschieden' },
  { value: 'watercolor', label: 'watercolor', snippet: 'variant="watercolor" · font-display kursiv' },
  { value: 'tape', label: 'tape', snippet: 'variant="tape" · Kalam fett · lines statt children' },
]

const CALLOUT_COPY: Record<MarkerCalloutColor, { text: string; lines: string[] }> = {
  kraft: { text: 'Ein besonderes Erlebnis für alle Weinliebhaber – mit euch!', lines: ['Ein besonderes Erlebnis', 'für alle Weinliebhaber', '– mit euch!'] },
  sage: { text: 'Reben mieten, durch die Ried wandern, im Keller verkosten.', lines: ['Reben mieten,', 'durch die Ried wandern,', 'im Keller verkosten.'] },
  rose: { text: 'Die Miete ist rein symbolisch.', lines: ['Die Miete', 'ist rein symbolisch.'] },
}

// Rotation per variant and color, as in the former rows.
const CALLOUT_ROTATE: Record<CalloutVariant, Record<MarkerCalloutColor, number>> = {
  brush: { kraft: -1.5, sage: 1, rose: -0.5 },
  watercolor: { kraft: -0.6, sage: 0.5, rose: -0.3 },
  tape: { kraft: -1.5, sage: 1, rose: -0.5 },
}

// Each variant had exactly one edge case.
const CALLOUT_EDGE: Record<CalloutVariant, VariantOption> = {
  brush: { value: 'edge', label: 'sehr kurz', snippet: 'color="rose" · rotate={3}' },
  watercolor: { value: 'edge', label: 'langer Satz', snippet: 'color="kraft" · rotate={0} · className="max-w-md"' },
  tape: { value: 'edge', label: 'ein Streifen', snippet: 'color="sage" · rotate={0} · lines={[…]}' },
}

function calloutExamples(variant: CalloutVariant): VariantAxis {
  return {
    label: 'Beispiel',
    options: [
      { value: 'kraft', label: 'kraft', snippet: 'color="kraft" · Default' },
      { value: 'sage', label: 'sage', snippet: 'color="sage"' },
      { value: 'rose', label: 'rose', snippet: 'color="rose"' },
      CALLOUT_EDGE[variant],
    ],
  }
}

function CalloutStage({ variant, example }: { variant: CalloutVariant; example?: string }) {
  if (example === 'edge') {
    if (variant === 'brush') return <MarkerCallout color="rose" rotate={3}>Prost!</MarkerCallout>
    if (variant === 'watercolor') {
      return (
        <MarkerCallout variant="watercolor" color="kraft" rotate={0} className="max-w-md">
          Bitte festes Schuhwerk mitbringen: Der Weg durch die Riede ist steil, und nach Regen wird er rutschig.
        </MarkerCallout>
      )
    }
    return <MarkerCallout variant="tape" color="sage" rotate={0} lines={['Samstag, 16 Uhr']} />
  }
  const color = (example ?? 'kraft') as MarkerCalloutColor
  const rotate = CALLOUT_ROTATE[variant][color]
  return variant === 'tape'
    ? <MarkerCallout variant="tape" color={color} rotate={rotate} lines={CALLOUT_COPY[color].lines} />
    : <MarkerCallout variant={variant} color={color} rotate={rotate}>{CALLOUT_COPY[color].text}</MarkerCallout>
}

const HANG_TAG_VARIANTS: VariantOption<HangTagVariant>[] = [
  { value: 'hanging', label: 'hanging', snippet: 'variant="hanging" · Default' },
  { value: 'loose', label: 'loose', snippet: 'variant="loose"' },
]

function hangTagExamples(variant: HangTagVariant): VariantAxis {
  return variant === 'hanging'
    ? {
        label: 'Beispiel',
        options: [
          { value: 'red', label: 'Widmung', snippet: 'neckWidth · rotate={-11} · cordLength={46} · sign="Simon"' },
          { value: 'white', label: 'Winzer-Notiz', snippet: 'neckWidth · rotate={8} · cordLength={40} · sign="Simon"' },
          { value: 'long', label: 'langer Text', snippet: 'neckWidth · rotate={-6} · ohne sign' },
          { value: 'hook', label: 'am Haken', snippet: 'ohne neckWidth · rotate={3} · cordLength={64} · sign="Simon"' },
        ],
      }
    : {
        label: 'Beispiel',
        options: [
          { value: 'voucher', label: 'Gutschein', snippet: 'sign="Simon"' },
          { value: 'short', label: 'sehr kurz', snippet: 'rotate={5}' },
        ],
      }
}

function HangTagStage({ example }: { example?: string }) {
  switch (example) {
    case 'white':
      return (
        <TaggedBottle bottle={SHOP_BOTTLES.white}>
          {knot => (
            <HangTag style={{ left: knot.left, top: knot.top }} neckWidth={knot.neckWidth} rotate={8} cordLength={40} sign="Simon">
              Gut gekühlt zum Backhendl. Prost!
            </HangTag>
          )}
        </TaggedBottle>
      )
    case 'long':
      return (
        <TaggedBottle bottle={SHOP_BOTTLES.red}>
          {knot => (
            <HangTag style={{ left: knot.left, top: knot.top }} neckWidth={knot.neckWidth} rotate={-6}>
              Für Oma Resi, die jeden Herbst als Erste im Weingarten steht und als Letzte geht. Alles Liebe zum Achtzigsten!
            </HangTag>
          )}
        </TaggedBottle>
      )
    case 'hook':
      // Without neckWidth only knot and cord, here on a nail
      return (
        <div className="relative h-80 w-40">
          <span aria-hidden="true" className="bg-muted-foreground absolute top-0 left-1/2 size-2 -translate-x-1/2 rounded-full" />
          <HangTag className="top-1 left-1/2" rotate={3} cordLength={64} sign="Simon">
            Danke fürs Mithelfen bei der Lese!
          </HangTag>
        </div>
      )
    case 'voucher':
      return (
        <HangTag variant="loose" sign="Simon">
          Gutschein für eine Kellerführung zu zweit
        </HangTag>
      )
    case 'short':
      return (
        <HangTag variant="loose" rotate={5}>
          Prost!
        </HangTag>
      )
    default:
      return (
        <TaggedBottle bottle={SHOP_BOTTLES.red}>
          {knot => (
            <HangTag style={{ left: knot.left, top: knot.top }} neckWidth={knot.neckWidth} rotate={-11} cordLength={46} sign="Simon">
              Für Anna – auf viele gemeinsame Abende!
            </HangTag>
          )}
        </TaggedBottle>
      )
  }
}

const SIGNATURE_VARIANTS: VariantOption<SignatureVariant>[] = [
  { value: 'nib', label: 'nib', snippet: 'variant="nib" · Default' },
  { value: 'pen', label: 'pen', snippet: 'variant="pen"' },
  { value: 'felt', label: 'felt', snippet: 'variant="felt"' },
]

const SIGNATURE_EXAMPLES: VariantAxis = {
  label: 'Beispiel',
  options: [
    { value: 'page', label: 'auf der Seite', snippet: 'Tinte folgt dem Theme' },
    { value: 'notepad', label: 'Notizblock', snippet: 'Bordeaux-Tinte per style' },
    { value: 'kraft', label: 'Kraftpapier', snippet: 'Tinte vom Papier geerbt' },
    { value: 'name', label: 'neben Namen', snippet: 'ohne label · Deko neben Klartext-Namen' },
    { value: 'small', label: 'sehr klein', snippet: 'className="w-24"' },
    { value: 'large', label: 'sehr groß', snippet: 'className="w-full max-w-md"' },
  ],
}

function SignatureStage({ variant, example }: { variant: SignatureVariant; example?: string }) {
  switch (example) {
    case 'notepad':
      return (
        <PaperNote variant="notepad" paper="cream" rotate={1.5}>
          Danke fürs Mithelfen bei der Lese! Ohne euch wär der 2025er noch am Stock.
          <Signature {...SIGNATURE_SIMON} variant={variant} label="Unterschrift: Simon" className="mt-4 w-40" style={{ color: 'oklch(0.36 0.1 15)' }} />
        </PaperNote>
      )
    case 'kraft':
      return (
        <PaperNote paper="kraft" rotate={-2}>
          Kellerführung am Samstag, 16 Uhr. Wir freuen uns!
          <Signature {...SIGNATURE_SIMON} variant={variant} label="Unterschrift: Simon" className="mt-3 w-36" />
        </PaperNote>
      )
    case 'name':
      return (
        <div className="text-foreground">
          <p className="font-display text-2xl italic">Herzlich,</p>
          <Signature {...SIGNATURE_SIMON} variant={variant} className="mt-1 w-52" />
          <div className="border-border mt-2 border-t pt-2.5">
            <p className="text-[0.68rem] font-medium tracking-[0.22em] uppercase">Simon Buchart</p>
            <p className="text-muted-foreground mt-1 text-xs">Winzer · Weingut Buchart</p>
          </div>
        </div>
      )
    case 'small':
      return <Signature {...SIGNATURE_SIMON} variant={variant} label="Unterschrift: Simon" className="text-foreground w-24" />
    case 'large':
      return <Signature {...SIGNATURE_SIMON} variant={variant} label="Unterschrift: Simon" className="text-foreground w-full max-w-md" />
    default:
      return <Signature {...SIGNATURE_SIMON} variant={variant} label="Unterschrift: Simon Buchart" className="text-foreground" />
  }
}

const STAMP_VARIANTS: VariantOption<StampVariant>[] = [
  { value: 'seal', label: 'seal', snippet: 'variant="seal" · Default' },
  { value: 'date', label: 'date', snippet: 'variant="date"' },
]

/** Shared contexts keep their value across the variant switch; the edge cases differ per variant. */
function stampExamples(variant: StampVariant): VariantAxis {
  const seal = variant === 'seal'
  const shared: VariantOption[] = [
    { value: 'page', label: 'auf der Seite', snippet: 'Tinte folgt dem Theme' },
    { value: 'label-light', label: 'helles Etikett', snippet: seal ? 'style={{ color: Bordeaux }}' : 'style={{ color: Schwarzblau }}' },
    { value: 'label-dark', label: 'dunkles Etikett', snippet: 'style={{ color: Deckweiß }}' },
    { value: 'paper', label: 'auf Papier', snippet: seal ? 'Notizblock · Bordeaux' : 'Kraftpapier · Schwarzblau' },
  ]
  const edges: VariantOption[] = seal
    ? [
        { value: 'bare', label: 'ohne Umschrift', snippet: 'nur year' },
        { value: 'long', label: 'lange Texte', snippet: 'gestaucht · messages={{ vintage: "Neuer Jahrgang" }}' },
        { value: 'small', label: 'sehr klein', snippet: 'className="w-20"' },
      ]
    : [
        { value: 'english', label: 'englisch', snippet: 'messages={{ vintage: "Vintage" }}' },
        { value: 'year', label: 'anderes Jahr', snippet: 'year={2019} · ohne issuer' },
        { value: 'decorative', label: 'decorative', snippet: 'decorative · Jahrgang steht im Titel' },
      ]
  return { label: 'Beispiel', options: [...shared, ...edges] }
}

function StampStage({ variant, example }: { variant: StampVariant; example?: string }) {
  const seal = variant === 'seal'
  const place = seal ? 'Sooß · Niederösterreich' : undefined
  switch (example) {
    case 'label-light':
    case 'label-dark': {
      const light = example === 'label-light'
      const ink = light ? (seal ? STAMP_INK.bordeaux : STAMP_INK.navy) : STAMP_INK.chalk
      return (
        <TaggedBottle bottle={light ? SHOP_BOTTLES.white : SHOP_BOTTLES.red}>
          {(_, label) => (
            <div className="absolute flex items-center justify-center" style={label}>
              <Stamp year={2025} variant={variant} issuer="Weingut Buchart" place={place} className={seal ? 'w-27' : 'w-29'} style={{ color: ink }} />
            </div>
          )}
        </TaggedBottle>
      )
    }
    case 'paper':
      return seal ? (
        <PaperNote variant="notepad" paper="cream" rotate={1.5} className="max-w-64">
          Der Veltliner ist abgefüllt, ab Samstag im Hofladen!
          <Stamp year={2025} issuer="Weingut Buchart" place="Sooß" className="mt-5 ml-auto w-28" style={{ color: STAMP_INK.bordeaux }} />
        </PaperNote>
      ) : (
        <PaperNote paper="kraft" rotate={-2} className="max-w-64">
          Jahrgangspräsentation am 14. November, wir freuen uns!
          <Stamp year={2025} variant="date" issuer="Weingut Buchart" className="mt-4 ml-auto w-36" style={{ color: STAMP_INK.navy }} />
        </PaperNote>
      )
    case 'bare':
      return <Stamp year={2025} className="text-foreground" />
    case 'long':
      return (
        <Stamp
          year={2025}
          issuer="Weingut Familie Buchart & Söhne"
          place="Sooß an der Südbahn · Niederösterreich · Österreich"
          messages={{ vintage: 'Neuer Jahrgang' }}
          className="text-foreground"
        />
      )
    case 'small':
      return <Stamp year={2025} issuer="Weingut Buchart" place="Sooß" className="text-foreground w-20" />
    case 'english':
      return <Stamp year={2025} variant="date" issuer="Domaine Buchart" messages={{ vintage: 'Vintage' }} className="text-foreground" />
    case 'year':
      return <Stamp year={2019} variant="date" className="text-foreground" />
    case 'decorative':
      // The vintage is in the title, the stamp is not read out
      return (
        <div className="text-foreground">
          <p className="font-display text-xl">Grüner Veltliner 2025</p>
          <p className="text-muted-foreground text-xs">Ried Hochfeld · trocken</p>
          <Stamp year={2025} variant="date" decorative className="mt-3 w-36" />
        </div>
      )
    default:
      return <Stamp year={2025} variant={variant} issuer="Weingut Buchart" place={place} className="text-foreground" />
  }
}

const AURORA_VARIANTS: VariantOption<NonNullable<AuroraTextProps['variant']>>[] = [
  { value: 'aurora', label: 'aurora', snippet: 'variant="aurora" · Default · sanft wechselnd' },
  { value: 'gradient', label: 'gradient', snippet: 'variant="gradient" · stetiger Loop, knallig für CTAs' },
]

const AURORA_PALETTES = {
  accent: ['var(--accent)', '#7928CA', '#FF0080', 'var(--accent)'],
  sunset: ['#f43f5e', '#f97316', '#fbbf24', '#10b981'],
}

const AURORA_COLORS: VariantAxis = {
  label: 'colors',
  options: [
    { value: 'default', label: 'Standard', snippet: 'speed={0.8}' },
    { value: 'accent', label: 'Akzent', snippet: `colors={['var(--accent)', '#7928CA', '#FF0080', 'var(--accent)']} · speed={0.5}` },
    { value: 'sunset', label: 'Sunset', snippet: `colors={['#f43f5e', '#f97316', '#fbbf24', '#10b981']} · speed={0.5}` },
  ],
}

const AURORA_TEXTS: Record<string, string> = {
  aurora: 'Premium Quality',
  gradient: 'Jetzt entdecken',
  accent: 'Uses your accent color',
  sunset: 'Weinkollektion 2024',
}

const WAVE_EXAMPLES: VariantOption[] = [
  { value: 'rail', label: 'Meta-Rail', snippet: 'vertikale Meta-Rail an der Seitenkante · auf den Text klicken' },
  { value: 'default', label: 'Defaults', snippet: 'amplitude={6} · duration={600} · stagger={40}' },
  { value: 'tight', label: 'eng und schnell', snippet: 'amplitude={3} · stagger={18}' },
  { value: 'long', label: 'langer Text', snippet: 'amplitude={4} · stagger={12} · Durchlauf dauert Zeichenzahl × stagger' },
  { value: 'single', label: 'ein Zeichen', snippet: 'kein Versatz möglich, schwingt als Ganzes' },
]

function WaveStage({ example }: { example: string }) {
  switch (example) {
    case 'default':
      return <div className="text-2xl font-semibold"><WaveText>Weingut Buchart 58</WaveText></div>
    case 'tight':
      return <div className="text-2xl font-semibold"><WaveText amplitude={3} stagger={18}>Grüner Veltliner Kaiserstein</WaveText></div>
    case 'long':
      return (
        <p className="max-w-xl text-sm leading-relaxed">
          <WaveText amplitude={4} stagger={12}>
            Tiefdunkles Granatrot mit violetten Reflexen und feinen Anklängen von Vanille.
          </WaveText>
        </p>
      )
    case 'single':
      return <div className="text-3xl font-semibold"><WaveText>58</WaveText></div>
    default:
      return (
        <div className="border-border flex w-full items-center rounded-lg border px-6 py-8">
          <WaveText className="text-muted-foreground block text-[9px] font-bold tracking-[0.45em] whitespace-nowrap uppercase [writing-mode:vertical-rl]">
            Sooss · Niederösterreich — Familie Buchart
          </WaveText>
        </div>
      )
  }
}

const NUMERAL_CASES: VariantOption[] = [
  { value: 'subtractive', label: 'Subtraktionsregel' },
  { value: 'length', label: 'Länge', snippet: 'arabisch kürzer bzw. länger als römisch: kein Layout-Sprung' },
  { value: 'invalid', label: 'ungültig', snippet: 'wird unverändert und ohne Klick-Verhalten gerendert' },
  { value: 'short', label: 'kurze Standzeit', snippet: 'numeral="XII" · revealDuration={1200} · transitionDuration={150}' },
]

function numeralExamples(fall: string): VariantAxis | undefined {
  const numerals = (values: string[]): VariantAxis => ({
    label: 'numeral',
    options: values.map(value => ({ value, label: value, snippet: `numeral="${value}"` })),
  })
  if (fall === 'subtractive') return numerals(['IV', 'IX', 'XL', 'XC', 'CM'])
  if (fall === 'length') return numerals(['XXIX', 'MMXXVI', 'I'])
  if (fall === 'invalid') {
    return {
      label: 'numeral',
      options: [
        { value: 'ABC', label: 'ABC', snippet: 'numeral="ABC"' },
        { value: 'empty', label: 'leer', snippet: 'numeral=""' },
        { value: '42', label: '42', snippet: 'numeral="42"' },
      ],
    }
  }
  return undefined
}
