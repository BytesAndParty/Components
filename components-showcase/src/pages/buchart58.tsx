import { useState } from 'react'
import { Link } from 'react-router'
import { Section } from '../components/section'
import { VariantDemo, type VariantOption } from '../components/variant-demo'
import { useToast } from '@components/toast/toast-context'
import { AddToCartButton } from '@components/add-to-cart-button/add-to-cart-button'
import { ProductTag, type ProductTagVariant } from '@components/product-tag/product-tag'
import { Rating } from '@components/rating/rating'
import { BookingCalendar, type BookingSlot } from '@components/booking-calendar/booking-calendar'
import { AmbientImage } from '@components/ambient-image/ambient-image'
import { Backlight } from '@components/backlight/backlight'
import { RevealImage, type RevealImageProps } from '@components/reveal-image/reveal-image'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { ShinyText, ShinyButton } from '@components/shiny-text/shiny-text'
import { Timeline } from '@components/timeline/timeline'
import { Tooltip } from '@components/tooltip/tooltip'
import { NumberInput } from '@components/number-input/number-input'

// ── Tooltip ───────────────────────────────────────────────────────────────────

function TooltipDemo() {
  return (
    <div className="bg-card border-border flex flex-wrap items-center gap-10 rounded-xl border p-8">
      <Tooltip content="Speichern (Strg+S)">
        <button className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium">
          Hover me
        </button>
      </Tooltip>

      <Tooltip content="Ebene löschen" position="bottom">
        <button className="bg-muted hover:bg-muted/80 text-foreground rounded-lg p-2 transition-colors">
          Bottom
        </button>
      </Tooltip>

      <Tooltip content="Hilfe anzeigen" position="left">
        <button className="bg-muted hover:bg-muted/80 text-foreground rounded-lg p-2 transition-colors">
          Left
        </button>
      </Tooltip>

      <Tooltip content="Eigenschaften" position="right">
        <button className="bg-muted hover:bg-muted/80 text-foreground rounded-lg p-2 transition-colors">
          Right
        </button>
      </Tooltip>
    </div>
  )
}

// ── Number Input ──────────────────────────────────────────────────────────────

function NumberInputDemo() {
  const [x, setX] = useState(120)
  const [y, setY] = useState(45)
  const [rot, setRot] = useState(0)
  const [opacity, setOpacity] = useState(100)

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card border-border flex flex-wrap items-center gap-8 rounded-xl border p-4 shadow-sm">
        <NumberInput label="X" value={x} onChange={setX} unit="mm" />
        <NumberInput label="Y" value={y} onChange={setY} unit="mm" />
        <NumberInput label="Rot" value={rot} onChange={setRot} unit="°" min={0} max={360} />
        <NumberInput label="Opac" value={opacity} onChange={setOpacity} unit="%" min={0} max={100} />
      </div>
      <p className="text-muted-foreground text-xs">
        Hochpräzise Steuerung für Geometrie. <kbd className="bg-muted rounded px-1 text-[10px]">Double-Click</kbd> zum Editieren · <kbd className="bg-muted rounded px-1 text-[10px]">Mouse Wheel</kbd> zum nudgen.
      </p>
    </div>
  )
}

// ── RevealImage ───────────────────────────────────────────────────────────────

type RevealDirection = NonNullable<RevealImageProps['direction']>

const REVEAL_OPTIONS: VariantOption<RevealDirection>[] = [
  { value: 'up', label: 'up', snippet: 'direction="up" · Default' },
  { value: 'right', label: 'right', snippet: 'direction="right" · delay={150}' },
  { value: 'down', label: 'down', snippet: 'direction="down" · delay={300} · duration={1600}' },
  { value: 'left', label: 'left', snippet: 'direction="left" · delay={450} · zoom={1.25} · once={false}' },
]

const REVEAL_PROPS: Record<RevealDirection, Omit<RevealImageProps, 'direction'>> = {
  up: { src: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80', alt: 'Rotweinglas im Streiflicht' },
  right: { src: 'https://images.unsplash.com/photo-1643087448435-72f70bd4ce88?w=600&q=80', alt: 'Weinflaschen im Regal', delay: 150 },
  down: { src: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600&q=80', alt: 'Weinberg am Hang', delay: 300, duration: 1600 },
  left: { src: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&q=80', alt: 'Reife Trauben am Stock', delay: 450, zoom: 1.25, once: false },
}

// ── Page ──────────────────────────────────────────────────────────────────────

/** Exactly the components the Buchart58 shop imports; their demos live only on this page. */
export function Buchart58Page() {
  const { add } = useToast()

  const tagVariants: ProductTagVariant[] = ['new', 'sale', 'low-stock', 'bestseller', 'limited', 'organic', 'vegan', 'award']

  // Dummy-Slots relativ zu heute, damit der Kalender im aktuellen Monat Termine zeigt.
  const isoDay = (offset: number) => {
    const d = new Date()
    d.setDate(d.getDate() + offset)
    return d.toISOString().slice(0, 10)
  }
  const bookingSlots: BookingSlot[] = [
    { id: 'b1', date: isoDay(3), time: '15:00', capacity: 6, price: 45 },
    { id: 'b2', date: isoDay(3), time: '17:30', capacity: 4, price: 45 },
    { id: 'b3', date: isoDay(10), time: '16:00', capacity: 8, price: 45 },
    { id: 'b4', date: isoDay(17), time: '11:00', capacity: 12, price: 35 },
  ]

  return (
    <>
      <header className="mb-10">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Buchart58</h1>
        <p className="text-muted-foreground text-sm">
          Genau die Komponenten, die der Buchart58-Shop einsetzt. Den LanguageSwitcher zeigt die Navigationsleiste oben rechts,
          der Etiketten-Designer hat eine eigene Seite (Link am Ende).
        </p>
      </header>

      <Section title="AddToCartButton" description="Cart roll-in animation with state feedback. The full shop flow with the cart badge is on the Shop page.">
        <div className="flex flex-wrap items-center gap-6">
          <AddToCartButton>Add to cart</AddToCartButton>
        </div>
      </Section>

      <Section title="Product Tag" description="Pill-Badges für Produktkarten: Entrance-Pop, Shimmer-Sweep beim Hover, Puls-Dot bei knappem Bestand. 8 Varianten, i18n-Labels, reduced-motion-safe.">
        <div className="border-border bg-card flex flex-col gap-6 rounded-xl border p-8 shadow-sm">
          <VariantDemo
            options={tagVariants.map(v => ({ value: v, label: v, snippet: `variant="${v}"` }))}
            secondary={variant =>
              variant === 'sale'
                ? {
                    label: 'discount',
                    options: [
                      { value: 'none', label: 'ohne' },
                      { value: '20', label: '20 %', snippet: 'discount={20}' },
                      { value: '33', label: '33 %', snippet: 'discount={33}' },
                    ],
                  }
                : variant === 'award'
                  ? {
                      label: 'label',
                      options: [
                        { value: 'none', label: 'Standard' },
                        { value: 'falstaff', label: 'Falstaff 95', snippet: 'label="Falstaff 95"' },
                      ],
                    }
                  : undefined
            }
            className="min-h-16"
            render={(variant, override) => (
              <ProductTag
                variant={variant}
                discount={override === '20' || override === '33' ? Number(override) : undefined}
                label={override === 'falstaff' ? 'Falstaff 95' : undefined}
              />
            )}
          />
          <div className="border-border text-muted-foreground flex justify-between border-t pt-3 text-[0.7rem]">
            <span>ProductTag · injected keyframes · prefers-reduced-motion aware</span>
            <span>No dependencies</span>
          </div>
        </div>
      </Section>

      <Section title="Rating" description="Star rating component with hover preview and pop animation.">
        <Rating size={28} defaultValue={4} activeColor="#f59e0b" />
      </Section>

      <Section title="Booking Calendar" description="Datengetriebener Termin-Picker auf Ark UI DatePicker: buchbare Tage aktiv, Rest deaktiviert → Uhrzeit-Chips → Gäste → Absenden. Slots als Prop, onSubmit app-seitig (hier Dummy). i18n DE/EN, semantische Tokens.">
        <div className="mx-auto max-w-2xl">
          <BookingCalendar
            slots={bookingSlots}
            onSubmit={({ slotId, guests }) => {
              add({ title: 'Anfrage gesendet', description: `Slot ${slotId} · ${guests} Gäste`, variant: 'success' })
            }}
          />
        </div>
      </Section>

      <Section title="AmbientImage" description="Ambilight-style glow extracted from image edge colors – like LED TV backlighting.">
        <div className="grid grid-cols-3 gap-12" style={{ padding: '40px 20px' }}>
          <AmbientImage
            src="https://images.unsplash.com/photo-1643087448435-72f70bd4ce88?w=400&q=80"
            alt="Weinflaschen"
            blur={45}
            intensity={0.55}
            spread={25}
            borderRadius="14px"
            style={{ width: '100%', aspectRatio: '3/4' }}
          />
          <AmbientImage
            src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&q=80"
            alt="Rotwein Glas"
            blur={50}
            intensity={0.7}
            spread={30}
            borderRadius="14px"
            style={{ width: '100%', aspectRatio: '3/4' }}
          />
          <AmbientImage
            src="https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&q=80"
            alt="Weinberg"
            blur={40}
            intensity={0.5}
            spread={20}
            borderRadius="14px"
            style={{ width: '100%', aspectRatio: '3/4' }}
          />
        </div>
      </Section>

      <Section title="Backlight" description="Animated gradient glow behind images or content. interactive=true lässt den primären Blob dem Cursor folgen.">
        <div className="grid grid-cols-3 gap-12" style={{ padding: '40px 20px' }}>
          <Backlight intensity={0.45} blur={50}>
            <div
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                overflow: 'hidden',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p className="text-foreground font-medium">Accent glow (auto)</p>
            </div>
          </Backlight>
          <Backlight color="#f43f5e" blobs={4} intensity={0.35} blur={40}>
            <div
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                overflow: 'hidden',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p className="text-foreground font-medium">Rose, 4 blobs</p>
            </div>
          </Backlight>
          <Backlight color="#10b981" blobs={3} intensity={0.4} blur={55} interactive>
            <div
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                overflow: 'hidden',
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <p className="text-foreground font-medium">interactive=true</p>
              <p className="text-muted-foreground text-xs">Hover, um den Glow zu bewegen</p>
            </div>
          </Backlight>
        </div>
      </Section>

      <Section title="RevealImage" description="Editorial curtain reveal — clip-path wipe mit Gegen-Zoom beim Scroll-In. Vier Wipe-Richtungen." canReload>
        <VariantDemo
          label="direction"
          options={REVEAL_OPTIONS}
          className="min-h-86"
          render={direction => (
            <RevealImage
              {...REVEAL_PROPS[direction]}
              direction={direction}
              className="aspect-3/4 w-64 rounded-xl"
            />
          )}
        />
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

      <Section title="Tooltip" description="Leichtgewichtige Overlays für Tooltips mit smarten Positions-Defaults und Micro-Animations.">
        <TooltipDemo />
      </Section>

      <Section title="Number Input" description="Kompakter Stepper für exakte mm/grad/pixel Werte. Unterstützt Scrubbing (Scrollrad) und Tastatur-Nudges.">
        <NumberInputDemo />
      </Section>

      <Section title="Etiketten-Designer" description="Der Shop bindet den kompletten Designer (CellarCanvas) ein. Wegen seiner Größe hat er eine eigene Seite unter Werkzeuge.">
        <Link
          to="/designer"
          viewTransition
          className="group border-border bg-card hover:border-accent/50 flex items-center justify-between gap-6 rounded-xl border p-6 no-underline shadow-sm transition-all hover:shadow-md"
        >
          <div>
            <p className="text-foreground group-hover:text-accent text-lg font-semibold transition-colors">Designer öffnen</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Vorlagen, Ebenen, Farbwähler, EU-Pflichtangaben und druckfertiger PDF-Export.
            </p>
          </div>
          <span aria-hidden="true" className="text-accent text-xl transition-transform motion-safe:group-hover:translate-x-1">→</span>
        </Link>
      </Section>
    </>
  )
}
