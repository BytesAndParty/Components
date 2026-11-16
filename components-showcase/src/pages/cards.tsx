import { Section } from '../components/section'
import { DemoTabs } from '../components/demo-tabs'
import { VariantDemo, type VariantOption } from '../components/variant-demo'
import { ShapeCard, type CornerShape } from '@components/shape-card/shape-card'
import { GlowCard } from '@components/glow-card/glow-card'
import { RotatingGlowCard } from '@components/glow-card/rotating-glow-card'
import { MagneticButton, type MagneticButtonVariant } from '@components/magnetic-button/magnetic-button'
import { Hover3DCard } from '@components/hover-3d-card/hover-3d-card'
import { LightRays } from '@components/light-rays/light-rays'
import { PixelImage } from '@components/pixel-image/pixel-image'
import { Backlight } from '@components/backlight/backlight'
import { BounceCards } from '@components/bounce-cards/bounce-cards'
import { Particles } from '@components/particles/particles'
import { ParticlesCard } from '@components/particles/particles-card'
import { CursorGlow } from '@components/cursor-glow/cursor-glow'
import { Lens } from '@components/lens/lens'
import { ImagesSlider } from '@components/images-slider/images-slider'
import { ShaderBackdrop } from '@components/shader-backdrop/shader-backdrop'
import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router'

/* ── BottleStage ────────────────────────────────────────── */

// three.js is large: the stage loads as its own chunk.
const BottleStage = lazy(() =>
  import('@components/bottle-stage/bottle-stage').then(module => ({ default: module.BottleStage })),
)

const DEMO_LABEL_SRC = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="570" height="800" viewBox="0 0 570 800">
  <rect width="570" height="800" fill="#f1ebdd"/>
  <rect x="30" y="30" width="510" height="740" fill="none" stroke="#1c1a17" stroke-width="2"/>
  <g fill="#1c1a17" text-anchor="middle" font-family="Georgia, serif">
    <text x="285" y="170" font-size="30" letter-spacing="14">ATELIER</text>
    <text x="285" y="430" font-size="120" font-style="italic">Demo</text>
    <text x="285" y="640" font-size="44" letter-spacing="10">2023</text>
  </g>
</svg>`)}`

/* ── Variant switchers ──────────────────────────────────── */

const GLOW_DURATIONS: VariantOption[] = [
  { value: '1.5', label: 'Fast (1.5s)', snippet: 'duration={1.5}' },
  { value: '3', label: 'Full gradient (3s)', snippet: 'duration={3} · Default' },
  { value: '6', label: 'Slow (6s)', snippet: 'duration={6}' },
  { value: '14', label: 'Very slow (14s)', snippet: 'duration={14}' },
]

const MAGNETIC_VARIANTS: VariantOption<MagneticButtonVariant>[] = [
  { value: 'primary', label: 'Primary', snippet: 'variant="primary"' },
  { value: 'secondary', label: 'Secondary', snippet: 'variant="secondary"' },
  { value: 'outline', label: 'Outline', snippet: 'variant="outline"' },
  { value: 'ghost', label: 'Ghost', snippet: 'variant="ghost"' },
  { value: 'default', label: 'Default', snippet: 'variant="default" · Default' },
  { value: 'destructive', label: 'Destructive', snippet: 'variant="destructive"' },
  { value: 'shimmer', label: 'Shimmer CTA', snippet: 'variant="shimmer" · animiert' },
  { value: 'glow', label: 'Glow Pulse', snippet: 'variant="glow" · animiert' },
  { value: 'gradient', label: 'Gradient Flow', snippet: 'variant="gradient" · animiert' },
  { value: 'beam', label: 'Border Beam', snippet: 'variant="beam" · animiert' },
]

const MAGNETIC_STRENGTHS: VariantOption[] = [
  { value: '0.1', label: 'Subtle', snippet: 'strength={0.1}' },
  { value: '0.3', label: 'Default', snippet: 'strength={0.3} · Default' },
  { value: '0.6', label: 'Strong', snippet: 'strength={0.6}' },
]

/* ── ShapeCard helpers ──────────────────────────────────── */

function WineMedia({ src, alt, vtName }: { src: string; alt: string; vtName?: string }) {
  return (
    <div
      style={{
        aspectRatio: '3 / 4',
        display: 'grid',
        placeItems: 'center',
        background:
          'radial-gradient(circle at 30% 20%, color-mix(in oklch, var(--accent) 14%, transparent), transparent 60%), var(--muted)',
      }}
    >
      <img
        src={src}
        alt={alt}
        className={vtName ? 'vt-wine' : undefined}
        style={{
          width: '100%',
          height: '100%',
          padding: '10%',
          objectFit: 'contain',
          ...(vtName ? { viewTransitionName: vtName } : null),
        }}
      />
    </div>
  )
}

function WineBody({
  name,
  region,
  vintage,
  price,
  note,
}: {
  name: string
  region: string
  vintage: number
  price: string
  note?: string
}) {
  return (
    <div style={{ padding: '1.25rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <p className="text-muted-foreground text-[0.625rem] tracking-[0.18em] uppercase">{region}</p>
      <h3 className="text-foreground m-0 text-base leading-tight font-bold">
        {name}
      </h3>
      <p className="text-muted-foreground m-0 text-xs">Jahrgang {vintage}</p>
      {note && <p className="text-muted-foreground m-0 mt-1 text-xs italic">{note}</p>}
      <p className="m-0 mt-2 text-base font-bold" style={{ color: 'var(--accent)' }}>{price}</p>
    </div>
  )
}

function CursorGlowDemo() {
  const [glowOn, setGlowOn] = useState(false)
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setGlowOn(v => !v)}
        className="border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground rounded-md border px-4 py-2 text-sm font-medium transition"
      >
        {glowOn ? 'CursorGlow deaktivieren' : 'CursorGlow aktivieren'}
      </button>
      <p className="text-muted-foreground text-xs">
        {glowOn
          ? 'Bewege die Maus über die Seite — subtiler Glow folgt.'
          : 'Klicke, um den globalen Cursor-Glow-Effekt zu aktivieren.'}
      </p>
      {glowOn && <CursorGlow opacity={0.28} size={350} blur={70} />}
    </div>
  )
}

export function CardsPage() {
  const shapeVariants: { shape: CornerShape; label: string; sub: string; radius?: number }[] = [
    { shape: 'round',    label: 'round',    sub: 'classic ellipse' },
    { shape: 'squircle', label: 'squircle', sub: 'superellipse(2)' },
    { shape: 'scoop',    label: 'scoop',    sub: 'concave ellipse', radius: 12 },
    { shape: 'notch',    label: 'notch',    sub: '90° concave',     radius: 12 },
    { shape: 'bevel',    label: 'bevel',    sub: 'diagonal cut' },
  ]

  return (
    <>
      <Section
        title="ShapeCard"
        description="Eckengeometrien über corner-shape: fünf Grundformen und asymmetrische Varianten mit einem einzelnen Akzent oder einer Kerbe. Chrome 139+ zeigt die echten Shapes; Firefox/Safari fallen auf border-radius zurück."
      >
        <DemoTabs
          tabs={[
            {
              value: 'corners',
              label: 'Corner shapes',
              content: (
                <VariantDemo
                  label="shape"
                  options={shapeVariants.map(v => ({
                    value: v.shape,
                    label: v.label,
                    snippet: `shape="${v.shape}" · radius={${v.radius ?? 48}}`,
                  }))}
                  render={shape => {
                    const i = shapeVariants.findIndex(v => v.shape === shape)
                    const v = shapeVariants[i]
                    return (
                      <ShapeCard shape={v.shape} radius={v.radius ?? 48} hoverLift={false} className="w-56">
                        <div
                          style={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            aspectRatio: '3 / 4',
                            background:
                              'radial-gradient(circle at 50% 30%, color-mix(in oklch, var(--accent) 12%, transparent), transparent 65%)',
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              display: 'grid',
                              placeItems: 'center',
                              padding: '1.25rem 1rem 0.5rem',
                            }}
                          >
                            <img
                              src={i % 2 === 0 ? '/wine-default.png' : '/white-wine-default.png'}
                              alt={v.label}
                              style={{
                                maxHeight: '100%',
                                maxWidth: '70%',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 14px 22px oklch(0 0 0 / 0.35))',
                              }}
                            />
                          </div>
                          <div style={{ textAlign: 'center', padding: '0 1rem 1.25rem' }}>
                            <p
                              className="text-foreground font-bold"
                              style={{ fontSize: '0.9375rem', margin: 0, letterSpacing: '-0.01em' }}
                            >
                              {v.label}
                            </p>
                            <p
                              className="text-muted-foreground"
                              style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.18em', marginTop: 4 }}
                            >
                              {v.sub}
                            </p>
                          </div>
                        </div>
                      </ShapeCard>
                    )
                  }}
                />
              ),
            },
            {
              value: 'accent-top',
              label: 'Akzent oben',
              content: (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <Link to="/wine/barolo-riserva-2016" viewTransition className="block no-underline" style={{ color: 'inherit' }}>
                    <ShapeCard
                      shape={['round', 'bevel', 'round', 'round']}
                      radius="10px 28px 10px 10px"
                    >
                      <WineMedia src="/wine-default.png" alt="Barolo Riserva" vtName="wine-barolo-riserva-2016" />
                      <WineBody name="Barolo Riserva" region="Piemonte · Italien" vintage={2016} price="€ 92,00" note="Single bevel · Top-Right" />
                    </ShapeCard>
                  </Link>

                  <Link to="/wine/riesling-smaragd-2022" viewTransition className="block no-underline" style={{ color: 'inherit' }}>
                    <ShapeCard
                      shape={['scoop', 'scoop', 'squircle', 'squircle']}
                      radius="1.625rem 1.625rem 0.625rem 0.625rem"
                    >
                      <WineMedia src="/white-wine-default.png" alt="Riesling Smaragd" vtName="wine-riesling-smaragd-2022" />
                      <WineBody name="Riesling Smaragd" region="Wachau · Österreich" vintage={2022} price="€ 32,50" note="Wine-glass silhouette" />
                    </ShapeCard>
                  </Link>

                  <ShapeCard
                    shape={['scoop', 'round', 'round', 'round']}
                    radius="40px 10px 10px 10px"
                  >
                    <WineMedia src="/wine-default.png" alt="Brunello di Montalcino" />
                    <WineBody name="Brunello di Montalcino" region="Toskana · Italien" vintage={2018} price="€ 64,00" note="Single scoop · Top-Left" />
                  </ShapeCard>
                </div>
              ),
            },
            {
              value: 'accent-bottom',
              label: 'Akzent unten rechts',
              content: (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <ShapeCard
                    shape={['round', 'round', 'bevel', 'round']}
                    radius="10px 10px 28px 10px"
                  >
                    <WineMedia src="/white-wine-default.png" alt="Sauvignon Blanc" />
                    <WineBody name="Sauvignon Blanc Réserve" region="Steiermark · Österreich" vintage={2022} price="€ 42,00" note="Single bevel · Bottom-Right" />
                  </ShapeCard>

                  <ShapeCard
                    shape={['round', 'round', 'scoop', 'round']}
                    radius="10px 10px 36px 10px"
                  >
                    <WineMedia src="/wine-default.png" alt="Chianti Classico" />
                    <WineBody name="Chianti Classico" region="Toskana · Italien" vintage={2020} price="€ 26,80" note="Single scoop · Bottom-Right" />
                  </ShapeCard>

                  <ShapeCard
                    shape={['round', 'round', 'notch', 'round']}
                    radius="10px 10px 28px 10px"
                  >
                    <WineMedia src="/white-wine-default.png" alt="Grüner Veltliner" />
                    <WineBody name="Grüner Veltliner" region="Wachau · Österreich" vintage={2023} price="€ 18,90" note="Single notch · Bottom-Right" />
                  </ShapeCard>
                </div>
              ),
            },
            {
              value: 'side-notch',
              label: 'Seitenkerbe',
              content: (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <ShapeCard
                    shape="squircle"
                    radius={12}
                    sideNotch={{ side: 'top', size: 56 }}
                  >
                    <div style={{ paddingTop: 36 }}>
                      <WineMedia src="/wine-default.png" alt="Amarone" />
                      <WineBody name="Amarone Valpolicella" region="Venetien · Italien" vintage={2017} price="€ 78,00" note="Top-edge notch" />
                    </div>
                  </ShapeCard>

                  <ShapeCard
                    shape="squircle"
                    radius={12}
                    sideNotch={{ side: 'right', size: 64 }}
                  >
                    <WineMedia src="/white-wine-default.png" alt="Pinot Grigio" />
                    <WineBody name="Pinot Grigio Alto Adige" region="Südtirol · Italien" vintage={2023} price="€ 22,40" note="Right-edge notch" />
                  </ShapeCard>

                  <ShapeCard
                    shape="squircle"
                    radius={12}
                    sideNotch={{ side: 'bottom', size: 56 }}
                  >
                    <WineMedia src="/wine-default.png" alt="Cannonau" />
                    <WineBody name="Cannonau di Sardegna" region="Sardinien · Italien" vintage={2021} price="€ 28,90" note="Bottom-edge notch" />
                  </ShapeCard>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Glow cards" description="Cards with a glow border: following the cursor or rotating on its own.">
        <DemoTabs
          tabs={[
            {
              value: "glowcard",
              label: "GlowCard",
              content: (
                <>
                  <p className="text-muted-foreground mb-6 text-sm">{"Card with a cursor-following glow border effect."}</p>
                  <GlowCard className="p-8">
                    <p className="text-foreground font-medium">Hover over this card</p>
                    <p className="text-muted-foreground mt-2 text-sm">
                      The border glows and follows your cursor.
                    </p>
                  </GlowCard>
                </>
              ),
            },
            {
              value: "rotatingglowcard",
              label: "RotatingGlowCard",
              content: (
                <>
                  <p className="text-muted-foreground mb-6 text-sm">{"Card with an animated rotating glow border."}</p>
                  <VariantDemo
                    label="duration"
                    options={GLOW_DURATIONS}
                    defaultValue="3"
                    className="block min-h-0"
                    render={duration => (
                      <RotatingGlowCard duration={Number(duration)}>
                        <p className="text-foreground font-medium">
                          {GLOW_DURATIONS.find(o => o.value === duration)?.label}
                        </p>
                        <p className="text-muted-foreground mt-2 text-sm">
                          A conic-gradient rotates behind the card — only the border glow is visible.
                        </p>
                      </RotatingGlowCard>
                    )}
                  />
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="MagneticButton" description="Button that magnetically follows the cursor on hover.">
        <VariantDemo
          options={MAGNETIC_VARIANTS}
          secondary={{ label: 'strength', options: MAGNETIC_STRENGTHS, defaultValue: '0.3' }}
          className="min-h-24"
          render={(variant, strength) => (
            <MagneticButton variant={variant} strength={Number(strength)}>
              {MAGNETIC_VARIANTS.find(o => o.value === variant)?.label}
            </MagneticButton>
          )}
        />
      </Section>

      <Section title="Hover3DCard" description="Cursor-tracking 3D tilt effect with glare overlay.">
        <div className="grid grid-cols-3 gap-4">
          <Hover3DCard
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              height: '220px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 50%)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 20h40M20 0v40\' stroke=\'%23fff\' stroke-width=\'.5\' fill=\'none\'/%3E%3C/svg%3E")', borderRadius: 'inherit' }} />
            <p className="text-foreground font-medium">Default tilt</p>
            <p className="text-muted-foreground mt-1 text-sm">15° max, glare on</p>
          </Hover3DCard>
          <Hover3DCard
            maxRotate={25}
            glareIntensity={0.4}
            style={{
              background: 'linear-gradient(135deg, var(--card) 0%, rgba(99,102,241,0.08) 100%)',
              border: '1px solid var(--border)',
              height: '220px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(244,63,94,0.07) 0%, transparent 50%)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'1\' cy=\'1\' r=\'.7\' fill=\'%23fff\'/%3E%3C/svg%3E")', borderRadius: 'inherit' }} />
            <p className="text-foreground font-medium">Strong tilt</p>
            <p className="text-muted-foreground mt-1 text-sm">25° max, bright glare</p>
          </Hover3DCard>
          <Hover3DCard
            maxRotate={8}
            glare={false}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              height: '220px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 60%)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, opacity: 0.025, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 8h16M8 0v16\' stroke=\'%23fff\' stroke-width=\'.3\' fill=\'none\' stroke-dasharray=\'2 2\'/%3E%3C/svg%3E")', borderRadius: 'inherit' }} />
            <p className="text-foreground font-medium">Subtle, no glare</p>
            <p className="text-muted-foreground mt-1 text-sm">8° max, glare off</p>
          </Hover3DCard>
        </div>
      </Section>

      <Section title="LightRays" description="WebGL light rays (ogl). Hover a bottle to reveal the effect.">
        <div className="grid max-w-2xl grid-cols-3 gap-6">
          {[
            { src: '/wine-default.png', alt: 'Red wine bottle' },
            { src: '/white-wine-default.png', alt: 'White wine bottle' },
          ].map(bottle => (
            <div
              key={bottle.src}
              className="group border-border bg-card relative overflow-hidden rounded-xl border"
              style={{ aspectRatio: '3/4' }}
            >
              {/* WebGL light rays — hidden until hover */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <LightRays
                  raysOrigin="top-center"
                  raysColor="#ffffff"
                  raysSpeed={1}
                  lightSpread={0.5}
                  rayLength={3}
                  followMouse
                  mouseInfluence={0.1}
                />
              </div>

              <img
                src={bottle.src}
                alt={bottle.alt}
                className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:-translate-y-1"
                style={{ padding: '20px' }}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="ShaderBackdrop"
        description="Flowing WebGL backdrop without dependencies. Colors are CSS colors and follow theme and accent; under reduced motion it shows a still frame."
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="border-border relative h-72 overflow-hidden rounded-xl border">
            <ShaderBackdrop className="absolute inset-0" />
            <p className="text-foreground absolute bottom-5 left-5 text-sm font-medium">Default: background → accent</p>
          </div>
          <div className="border-border relative h-72 overflow-hidden rounded-xl border">
            <ShaderBackdrop
              colors={['oklch(0.16 0.03 60)', 'oklch(0.42 0.11 55)', 'oklch(0.86 0.12 85)']}
              speed={2}
              scale={1.8}
              grain={0.12}
              className="absolute inset-0"
            />
            <p className="absolute bottom-5 left-5 text-sm font-medium text-white">
              Custom colors, faster, smaller folds, more grain
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="BottleStage"
        description="Real-time 3D wine bottle (three.js + React Three Fiber), lazy-loaded. Move the mouse: the bottle leans toward the pointer."
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="border-border bg-card h-96 overflow-hidden rounded-xl border">
            <Suspense fallback={null}>
              <BottleStage labelSrc={DEMO_LABEL_SRC} className="h-full w-full" />
            </Suspense>
          </div>
          <div className="border-border relative h-96 overflow-hidden rounded-xl border">
            <ShaderBackdrop className="absolute inset-0" />
            <Suspense fallback={null}>
              <BottleStage labelSrc={DEMO_LABEL_SRC} capsuleColor="var(--foreground)" className="absolute inset-0" />
            </Suspense>
          </div>
          <div className="border-border bg-card h-96 overflow-hidden rounded-xl border">
            <Suspense fallback={null}>
              {/* Edge case: no label, amber glass, no pointer tracking */}
              <BottleStage
                glassColor="oklch(0.22 0.07 60)"
                capsuleColor="oklch(0.3 0.02 60)"
                followPointer={false}
                className="h-full w-full"
              />
            </Suspense>
          </div>
        </div>
      </Section>

      <Section title="Hover Image Reveal" description="Product card with hover fade-in to reveal an alternate image. Backlit glow behind.">
        <div className="flex justify-center gap-8">
          <Backlight intensity={0.45} blur={45}>
            <div
              className="group"
              style={{
                position: 'relative',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                overflow: 'hidden',
                width: '280px',
                height: '360px',
              }}
            >
              <img
                src="/wine-default.png"
                alt="Wine bottle"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '20px',
                }}
              />
              <img
                src="/wine-with-extra.png"
                alt="Wine bottle with grapes and glass"
                className="opacity-0 group-hover:opacity-100"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '20px',
                  transition: 'opacity 1600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              />
            </div>
          </Backlight>
          <Backlight intensity={0.45} blur={45}>
            <div
              className="group"
              style={{
                position: 'relative',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                overflow: 'hidden',
                width: '280px',
                height: '360px',
              }}
            >
              <img
                src="/white-wine-default.png"
                alt="White wine bottle"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '20px',
                }}
              />
              <img
                src="/white-wine-with-extra.png"
                alt="White wine bottle with grapes and glass"
                className="opacity-0 group-hover:opacity-100"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '20px',
                  transition: 'opacity 1600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              />
            </div>
          </Backlight>
        </div>
      </Section>

      <Section title="PixelImage" description="Pixelate-to-sharp cell-by-cell image reveal on scroll.">
        <div className="grid grid-cols-2 gap-4">
          <PixelImage
            src="https://images.unsplash.com/photo-1643087448435-72f70bd4ce88?w=600&q=80"
            alt="Wine bottles"
            grid={{ rows: 5, cols: 7 }}
            stagger={50}
            duration={600}
            style={{
              borderRadius: '12px',
              height: '220px',
              border: '1px solid var(--border)',
            }}
          />
          <PixelImage
            src="https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600&q=80"
            alt="Vineyard"
            grid={{ rows: 3, cols: 4 }}
            stagger={80}
            duration={900}
            grayscale
            style={{
              borderRadius: '12px',
              height: '220px',
              border: '1px solid var(--border)',
            }}
          />
        </div>
      </Section>

      <Section title="BounceCards" description="Stacked image cards with elastic spring entrance and hover push interaction.">
        <div className="flex items-center justify-center" style={{ minHeight: '400px', margin: '40px 0' }}>
          <BounceCards
            images={[
              'https://images.unsplash.com/photo-1643087448435-72f70bd4ce88?w=400&q=80',
              'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&q=80',
              'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&q=80',
              'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=400&q=80',
              'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80',
            ]}
          />
        </div>
      </Section>

      <Section title="Lens" description="Magnifying lens overlay — hover-follow or click-toggle mode. Zooms any DOM content inside a circular ring.">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">Hover-Modus</p>
            <Lens>
              <img
                src="https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=900&q=80"
                alt="Wine bottle"
                style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
                draggable={false}
              />
            </Lens>
          </div>
          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">Toggle-Modus (Klick)</p>
            <Lens mode="toggle" zoom={2.2} lensSize={200} ringColor="#f59e0b">
              <img
                src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=900&q=80"
                alt="Wine label detail"
                style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
                draggable={false}
              />
            </Lens>
          </div>
        </div>
      </Section>

      <Section title="ImagesSlider" description="Hero-style image slider with Ken-Burns zoom, directional slide, keyboard arrows, and overlay. Preloads for zero-flash transitions.">
        <div className="flex flex-col gap-6">
          <ImagesSlider
            images={[
              'https://images.unsplash.com/photo-1643087448435-72f70bd4ce88?w=1600&q=80',
              'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1600&q=80',
              'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1600&q=80',
              'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=1600&q=80',
            ]}
            height={420}
            direction="up"
            interval={4500}
          >
            <div style={{ maxWidth: 560 }}>
              <p
                style={{
                  fontSize: 12,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  opacity: 0.8,
                  marginBottom: 12,
                }}
              >
                Weinhaus
              </p>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
                Direkt vom Winzer,
                <br />
                in Ihr Glas.
              </h2>
              <p style={{ marginTop: 16, opacity: 0.85, fontSize: 15, lineHeight: 1.6 }}>
                Handverlesen aus Piemonte, Toskana und der Wachau.
              </p>
            </div>
          </ImagesSlider>
          <p className="text-muted-foreground text-xs">
            Pfeiltasten ← / → zum Navigieren. Direction prop: <code>up</code>, <code>down</code>, <code>left</code>, <code>right</code>.
          </p>
        </div>
      </Section>

      <Section title="Particles" description="Canvas-based floating particles: as a background layer with optional mouse repulsion, or as a card wrapper with content on top.">
        <DemoTabs
          tabs={[
            {
              value: 'background',
              label: 'Background',
              content: (
                <div
                  style={{
                    position: 'relative',
                    height: '300px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: 'var(--card)',
                    overflow: 'hidden',
                  }}
                >
                  <Particles
                    particleColors={['var(--accent, #6366f1)', 'var(--foreground)', '#a78bfa']}
                    particleCount={150}
                    particleSpread={10}
                    speed={0.3}
                    particleBaseSize={3}
                    moveParticlesOnHover
                    hoverRadius={100}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <p className="text-foreground text-lg font-medium">Move your cursor over the particles</p>
                  </div>
                </div>
              ),
            },
            {
              value: 'card',
              label: 'Card',
              content: (
                <div className="grid grid-cols-2 gap-4">
                  <ParticlesCard
                    particleColors={['var(--accent, #6366f1)', 'var(--foreground)', '#a78bfa']}
                    particleCount={120}
                    speed={0.2}
                    style={{
                      height: '220px',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                      background: 'var(--card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '32px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <p className="text-foreground text-xl font-bold">Premium Kollektion</p>
                      <p className="text-muted-foreground mt-2 text-sm">Handverlesene Weine aus Italien</p>
                    </div>
                  </ParticlesCard>

                  <ParticlesCard
                    particleColors={['#f59e0b', '#f97316', '#fbbf24']}
                    particleCount={80}
                    speed={0.15}
                    particleBaseSize={2}
                    moveParticlesOnHover
                    style={{
                      height: '220px',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                      background: 'var(--card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '32px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <p className="text-foreground text-xl font-bold">Gold Reserve</p>
                      <p className="text-muted-foreground mt-2 text-sm">moveParticlesOnHover</p>
                    </div>
                  </ParticlesCard>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section title="CursorGlow" description="Leichter CSS-Glow, der dem Cursor folgt (position: fixed). Toggle zum Testen.">
        <CursorGlowDemo />
      </Section>
    </>
  )
}
