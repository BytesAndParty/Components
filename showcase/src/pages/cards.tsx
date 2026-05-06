import { Section } from '../components/section'
import { ShapeCard, type CornerShape } from '@components/shape-card/shape-card'
import { GlowCard } from '@components/glow-card/glow-card'
import { RotatingGlowCard } from '@components/glow-card/rotating-glow-card'
import { MagneticButton } from '@components/magnetic-button/magnetic-button'
import { JellyButton } from '@components/jelly-button/jelly-button'
import { Hover3DCard } from '@components/hover-3d-card/hover-3d-card'
import { ClickSpark } from '@components/click-spark/click-spark'
import { LightRays } from '@components/light-rays/light-rays'
import { SplashCursor } from '@components/splash-cursor/splash-cursor'
import { PixelImage } from '@components/pixel-image/pixel-image'
import { Backlight } from '@components/backlight/backlight'
import { AmbientImage } from '@components/ambient-image/ambient-image'
import { BounceCards } from '@components/bounce-cards/bounce-cards'
import { Particles } from '@components/particles/particles'
import { ParticlesCard } from '@components/particles/particles-card'
import { CursorGlow } from '@components/cursor-glow/cursor-glow'
import { Lens } from '@components/lens/lens'
import { ImagesSlider } from '@components/images-slider/images-slider'
import { useState } from 'react'

/* ── ShapeCard helpers ──────────────────────────────────── */

function WineMedia({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        aspectRatio: '4 / 3',
        display: 'grid',
        placeItems: 'center',
        background:
          'radial-gradient(circle at 30% 20%, color-mix(in oklch, var(--accent) 14%, transparent), transparent 60%), var(--muted)',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          height: '88%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 8px 16px oklch(0 0 0 / 0.25))',
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
      <p className="text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground">{region}</p>
      <h3 className="text-foreground font-bold text-base leading-tight m-0">{name}</h3>
      <p className="text-muted-foreground text-xs m-0">Jahrgang {vintage}</p>
      {note && <p className="text-muted-foreground text-xs italic m-0 mt-1">{note}</p>}
      <p className="font-bold text-base mt-2 m-0" style={{ color: 'var(--accent)' }}>{price}</p>
    </div>
  )
}

function CursorGlowDemo() {
  const [glowOn, setGlowOn] = useState(false)
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setGlowOn(v => !v)}
        className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition"
      >
        {glowOn ? 'CursorGlow deaktivieren' : 'CursorGlow aktivieren'}
      </button>
      <p className="text-xs text-muted-foreground">
        {glowOn
          ? 'Bewege die Maus über die Seite — subtiler Glow folgt.'
          : 'Klicke, um den globalen Cursor-Glow-Effekt zu aktivieren.'}
      </p>
      {glowOn && <CursorGlow opacity={0.28} size={350} blur={70} />}
    </div>
  )
}

export function CardsPage() {
  const [splashOn, setSplashOn] = useState(false)

  const shapeVariants: { shape: CornerShape; label: string; sub: string }[] = [
    { shape: 'round',    label: 'round',    sub: 'classic ellipse' },
    { shape: 'squircle', label: 'squircle', sub: 'superellipse(2)' },
    { shape: 'scoop',    label: 'scoop',    sub: 'concave ellipse' },
    { shape: 'notch',    label: 'notch',    sub: '90° concave' },
    { shape: 'bevel',    label: 'bevel',    sub: 'diagonal cut' },
  ]

  return (
    <>
      <Section
        title="ShapeCard – corner-shape variants"
        description="Was möglich ist: identische Cards, fünf verschiedene Eckengeometrien (radius 48px) — round, squircle, scoop, notch, bevel. Chrome 139+ zeigt die echten Shapes; Firefox/Safari fallen auf border-radius zurück."
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {shapeVariants.map((v, i) => (
            <ShapeCard key={v.shape} shape={v.shape} radius={48} hoverLift={false}>
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
                    className="font-bold text-foreground"
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
          ))}
        </div>
      </Section>

      <Section
        title="ShapeCard – Asymmetric / Premium"
        description="Asymmetrische Shapes wirken intentional und premium — eine Ecke besonders, die anderen drei sauber. Drei Varianten: einzelner Akzent oben (Reihe 1), unten rechts (Reihe 2), und mittig an einer Seite (Reihe 3, kein Eck-Cutout sondern Halbkreis im Edge)."
      >
        <div className="space-y-8">

          {/* Reihe 1: Akzent oben */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ShapeCard
              shape={['round', 'bevel', 'round', 'round']}
              radius="20px 56px 20px 20px"
            >
              <WineMedia src="/wine-default.png" alt="Barolo Riserva" />
              <WineBody name="Barolo Riserva" region="Piemonte · Italien" vintage={2016} price="€ 92,00" note="Single bevel · Top-Right" />
            </ShapeCard>

            <ShapeCard
              shape={['scoop', 'scoop', 'squircle', 'squircle']}
              radius="3.25rem 3.25rem 1.25rem 1.25rem"
            >
              <WineMedia src="/white-wine-default.png" alt="Riesling Smaragd" />
              <WineBody name="Riesling Smaragd" region="Wachau · Österreich" vintage={2022} price="€ 32,50" note="Wine-glass silhouette" />
            </ShapeCard>

            <ShapeCard
              shape={['scoop', 'round', 'round', 'round']}
              radius="80px 20px 20px 20px"
            >
              <WineMedia src="/wine-default.png" alt="Brunello di Montalcino" />
              <WineBody name="Brunello di Montalcino" region="Toskana · Italien" vintage={2018} price="€ 64,00" note="Single scoop · Top-Left" />
            </ShapeCard>
          </div>

          {/* Reihe 2: Akzent unten rechts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ShapeCard
              shape={['round', 'round', 'bevel', 'round']}
              radius="20px 20px 56px 20px"
            >
              <WineMedia src="/white-wine-default.png" alt="Sauvignon Blanc" />
              <WineBody name="Sauvignon Blanc Réserve" region="Steiermark · Österreich" vintage={2022} price="€ 42,00" note="Single bevel · Bottom-Right" />
            </ShapeCard>

            <ShapeCard
              shape={['round', 'round', 'scoop', 'round']}
              radius="20px 20px 72px 20px"
            >
              <WineMedia src="/wine-default.png" alt="Chianti Classico" />
              <WineBody name="Chianti Classico" region="Toskana · Italien" vintage={2020} price="€ 26,80" note="Single scoop · Bottom-Right" />
            </ShapeCard>

            <ShapeCard
              shape={['round', 'round', 'notch', 'round']}
              radius="20px 20px 56px 20px"
            >
              <WineMedia src="/white-wine-default.png" alt="Grüner Veltliner" />
              <WineBody name="Grüner Veltliner" region="Wachau · Österreich" vintage={2023} price="€ 18,90" note="Single notch · Bottom-Right" />
            </ShapeCard>
          </div>

          {/* Reihe 3: Halbkreis-Notch in der Mitte einer Seite */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ShapeCard
              shape="squircle"
              radius={24}
              sideNotch={{ side: 'top', size: 56 }}
            >
              <div style={{ paddingTop: 36 }}>
                <WineMedia src="/wine-default.png" alt="Amarone" />
                <WineBody name="Amarone Valpolicella" region="Venetien · Italien" vintage={2017} price="€ 78,00" note="Top-edge notch" />
              </div>
            </ShapeCard>

            <ShapeCard
              shape="squircle"
              radius={24}
              sideNotch={{ side: 'right', size: 64 }}
            >
              <WineMedia src="/white-wine-default.png" alt="Pinot Grigio" />
              <WineBody name="Pinot Grigio Alto Adige" region="Südtirol · Italien" vintage={2023} price="€ 22,40" note="Right-edge notch" />
            </ShapeCard>

            <ShapeCard
              shape="squircle"
              radius={24}
              sideNotch={{ side: 'bottom', size: 56 }}
            >
              <WineMedia src="/wine-default.png" alt="Cannonau" />
              <WineBody name="Cannonau di Sardegna" region="Sardinien · Italien" vintage={2021} price="€ 28,90" note="Bottom-edge notch" />
            </ShapeCard>
          </div>

        </div>
      </Section>

      <Section title="GlowCard" description="Card with a cursor-following glow border effect.">
        <GlowCard className="p-8">
          <p className="font-medium text-foreground">Hover over this card</p>
          <p className="text-muted-foreground text-sm mt-2">
            The border glows and follows your cursor.
          </p>
        </GlowCard>
      </Section>

      <Section title="RotatingGlowCard" description="Card with an animated rotating glow border.">
        <RotatingGlowCard>
          <p className="font-medium text-foreground">Full gradient (3s)</p>
          <p className="text-muted-foreground text-sm mt-2">
            A conic-gradient rotates behind the card — only the border glow is visible.
          </p>
        </RotatingGlowCard>

        <div className="flex gap-4 mt-4">
          <RotatingGlowCard duration={1.5} className="flex-1">
            <p className="text-[0.8125rem] font-medium text-foreground">Fast (1.5s)</p>
          </RotatingGlowCard>
          <RotatingGlowCard duration={6} className="flex-1">
            <p className="text-[0.8125rem] font-medium text-foreground">Slow (6s)</p>
          </RotatingGlowCard>
          <RotatingGlowCard duration={14} className="flex-1">
            <p className="text-[0.8125rem] font-medium text-foreground">Very slow (14s)</p>
          </RotatingGlowCard>
        </div>

      </Section>

      <Section title="MagneticButton" description="Button that magnetically follows the cursor on hover.">
        <div className="space-y-8">

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Base Variants</p>
            <div className="flex flex-wrap gap-4 items-center">
              <MagneticButton variant="primary">Primary</MagneticButton>
              <MagneticButton variant="secondary">Secondary</MagneticButton>
              <MagneticButton variant="outline">Outline</MagneticButton>
              <MagneticButton variant="ghost">Ghost</MagneticButton>
              <MagneticButton variant="default">Default</MagneticButton>
              <MagneticButton variant="destructive">Destructive</MagneticButton>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Animated – Call to Action</p>
            <div className="flex flex-wrap gap-4 items-center">
              <MagneticButton variant="shimmer">Shimmer CTA</MagneticButton>
              <MagneticButton variant="glow">Glow Pulse</MagneticButton>
              <MagneticButton variant="gradient">Gradient Flow</MagneticButton>
              <MagneticButton variant="beam">Border Beam</MagneticButton>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Magnetic strength</p>
            <div className="flex flex-wrap gap-4 items-center">
              <MagneticButton variant="primary" strength={0.1}>Subtle (0.1)</MagneticButton>
              <MagneticButton variant="primary" strength={0.3}>Default (0.3)</MagneticButton>
              <MagneticButton variant="primary" strength={0.6}>Strong (0.6)</MagneticButton>
            </div>
          </div>

        </div>
      </Section>

      <Section title="JellyButton" description="Rubbery CTA with SVG-goo blobs escaping on hover. Pure React state + inline styles.">
        <div className="space-y-8">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Sizes</p>
            <div className="flex flex-wrap items-center gap-6">
              <JellyButton size="sm">Small</JellyButton>
              <JellyButton size="md">Medium</JellyButton>
              <JellyButton size="lg">Large</JellyButton>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Accent (theme-aware) & custom colors</p>
            <div className="flex flex-wrap items-center gap-6">
              <JellyButton>Theme Accent</JellyButton>
              <JellyButton color="#ec4899">Pink</JellyButton>
              <JellyButton color="#10b981">Emerald</JellyButton>
              <JellyButton color="#f59e0b">Amber</JellyButton>
              <JellyButton disabled>Disabled</JellyButton>
            </div>
          </div>
        </div>
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
            <p className="font-medium text-foreground">Default tilt</p>
            <p className="text-muted-foreground text-sm mt-1">15° max, glare on</p>
          </Hover3DCard>
          <Hover3DCard
            maxTilt={25}
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
            <p className="font-medium text-foreground">Strong tilt</p>
            <p className="text-muted-foreground text-sm mt-1">25° max, bright glare</p>
          </Hover3DCard>
          <Hover3DCard
            maxTilt={8}
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
            <p className="font-medium text-foreground">Subtle, no glare</p>
            <p className="text-muted-foreground text-sm mt-1">8° max, glare off</p>
          </Hover3DCard>
        </div>
      </Section>

      <Section title="ClickSpark" description="Spark burst effect contained within a box on click.">
        <ClickSpark
          sparkColor="var(--accent)"
          sparkCount={10}
          sparkRadius={25}
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p className="text-foreground font-medium pointer-events-none select-none">
            Click anywhere in this box
          </p>
        </ClickSpark>
      </Section>

      <Section title="LightRays" description="WebGL light rays (ogl). Hover a bottle to reveal the effect.">
        <div className="grid grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-border bg-card"
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

              {/* Wine bottle */}
              <img
                src="/wine-default.png"
                alt="Wine bottle"
                className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:-translate-y-1"
                style={{ padding: '20px' }}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="LightRays (White Wine)" description="WebGL light rays with white wine bottles.">
        <div className="grid grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-border bg-card"
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

              {/* White wine bottle */}
              <img
                src="/white-wine-default.png"
                alt="White wine bottle"
                className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:-translate-y-1"
                style={{ padding: '20px' }}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="SplashCursor"
        description="Fullscreen WebGL fluid-simulation cursor effect. Toggle to test — performance-kritisch auf Mobile."
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSplashOn((v) => !v)}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition"
          >
            {splashOn ? 'Stop splash cursor' : 'Start splash cursor'}
          </button>
          <p className="text-xs text-muted-foreground">
            {splashOn
              ? 'Move the cursor anywhere on the page — the fluid reacts globally.'
              : 'Click to activate the fullscreen fluid simulation overlay.'}
          </p>
        </div>
        {splashOn && (
          <SplashCursor
            SIM_RESOLUTION={128}
            DYE_RESOLUTION={1024}
            SPLAT_RADIUS={0.2}
            SPLAT_FORCE={6000}
            CURL={3}
          />
        )}
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
              <p className="font-medium text-foreground">Accent glow (auto)</p>
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
              <p className="font-medium text-foreground">Rose, 4 blobs</p>
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
              <p className="font-medium text-foreground">interactive=true</p>
              <p className="text-xs text-muted-foreground">Hover, um den Glow zu bewegen</p>
            </div>
          </Backlight>
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
            src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80"
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

      <Section title="AmbientImage" description="Ambilight-style glow extracted from image edge colors – like LED TV backlighting.">
        <div className="grid grid-cols-3 gap-12" style={{ padding: '40px 20px' }}>
          <AmbientImage
            src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80"
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

      <Section title="BounceCards" description="Stacked image cards with elastic bounce entrance and hover push interaction (GSAP).">
        <div className="flex items-center justify-center" style={{ minHeight: '400px', margin: '40px 0' }}>
          <BounceCards
            images={[
              'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
              'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&q=80',
              'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&q=80',
              'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=400&q=80',
              'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80',
            ]}
            containerWidth={500}
            containerHeight={350}
            animationDelay={0.5}
            animationStagger={0.08}
            easeType="elastic.out(1, 0.5)"
            enableHover
          />
        </div>
      </Section>

      <Section title="Lens" description="Magnifying lens overlay — hover-follow or click-toggle mode. Zooms any DOM content inside a circular ring.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Hover-Modus</p>
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
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Toggle-Modus (Klick)</p>
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
              'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1600&q=80',
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

      <Section title="Particles" description="Canvas-based floating particle background with optional mouse repulsion.">
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
            particleColors={['var(--accent, #6366f1)', '#ffffff', '#a78bfa']}
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
            <p className="text-foreground font-medium text-lg">Move your cursor over the particles</p>
          </div>
        </div>
      </Section>

      <Section title="ParticlesCard" description="ParticlesCard-Wrapper: Particles als Hintergrund-Layer, beliebiger Content darüber.">
        <div className="grid grid-cols-2 gap-4">
          <ParticlesCard
            particleColors={['var(--accent, #6366f1)', '#ffffff', '#a78bfa']}
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
              <p className="font-bold text-foreground text-xl">Premium Kollektion</p>
              <p className="text-muted-foreground text-sm mt-2">Handverlesene Weine aus Italien</p>
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
              <p className="font-bold text-foreground text-xl">Gold Reserve</p>
              <p className="text-muted-foreground text-sm mt-2">moveParticlesOnHover</p>
            </div>
          </ParticlesCard>
        </div>
      </Section>

      <Section title="CursorGlow" description="Leichter CSS-Glow, der dem Cursor folgt (position: fixed). Toggle zum Testen.">
        <CursorGlowDemo />
      </Section>
    </>
  )
}
