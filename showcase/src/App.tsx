import { useState } from 'react'
import { GlowCard } from '../../glow-card/glow-card'
import { RotatingGlowCard } from '../../glow-card/rotating-glow-card'
import { MagneticButton } from '../../magnetic-button/magnetic-button'
import { TextScramble } from '../../text-scramble/text-scramble'
import { ScrollRotate, RotatingDecoration } from '../../scroll-rotate/scroll-rotate'
import { AccentSwitcher } from '../../accent-switcher/accent-switcher'
import { AutocompleteCell } from '../../autocomplete-cell/autocomplete-cell'
import { HeartFavorite } from '../../heart-favorite/heart-favorite'
import { Footer } from '../../footer-section/footer-section'
import { TextRotate } from '../../text-rotate/text-rotate'
import { useImageUpload } from '../../use-image-upload/use-image-upload'
import { PricingInteraction } from '../../pricing-interaction/pricing-interaction'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '../../breadcrumb/breadcrumb'
import { Checkbox } from '../../checkbox/checkbox'
import { Switch } from '../../switch/switch'
import { ToastProvider, useToast } from '../../toast/toast'
import {
  SunIcon, MoonIcon, CloudIcon, RainIcon, HeavyRainIcon, SnowIcon,
  ThunderIcon, WindIcon, FogIcon, PartlyCloudyIcon, SunriseIcon, RainbowIcon,
} from '../../animated-weather-icons/animated-weather-icons'
import { AuroraText } from '../../aurora-text/aurora-text'
import { AnimatedThemeToggler } from '../../animated-theme-toggler/animated-theme-toggler'
import { AnimatedSearch } from '../../animated-search/animated-search'
import { VelocityScroll, TestimonialCard, type Testimonial } from '../../velocity-scroll/velocity-scroll'

const palettes = {
  indigo: { label: 'Indigo', oklch: 'oklch(0.585 0.233 277)' },
  amber: { label: 'Amber', oklch: 'oklch(0.555 0.146 49)' },
  emerald: { label: 'Emerald', oklch: 'oklch(0.511 0.086 186.4)' },
  rose: { label: 'Rose', oklch: 'oklch(0.585 0.22 5)' },
}

const testimonials: Testimonial[] = [
  { name: 'Anna Müller', role: 'Frontend Lead, Acme Corp', content: 'Die Komponenten sind extrem gut durchdacht. Die Animationen fühlen sich nativ an und die API ist intuitiv.' },
  { name: 'Marco Rossi', role: 'Design Engineer, Stripe', content: 'Endlich eine Component Library die Framer Motion richtig nutzt. Die Velocity Scroll Testimonials sind ein Highlight.' },
  { name: 'Sarah Chen', role: 'CTO, StartupXYZ', content: 'Wir haben unsere gesamte Landing Page damit gebaut. Die Performance ist hervorragend, auch auf Mobile.' },
  { name: 'Lukas Weber', role: 'Fullstack Dev', content: 'Der TextRotate allein hat uns Stunden gespart. Kein Layout-Shift mehr, einfach plug & play.' },
  { name: 'Elena Petrova', role: 'UX Designer, Figma', content: 'Als Designerin liebe ich die Detailverliebtheit. Jede Micro-Interaction ist perfekt getimed.' },
  { name: 'James O\'Brien', role: 'Indie Hacker', content: 'Die AccentSwitcher Farbübergänge in oklch sind butterweich. Sowas findet man sonst nirgends.' },
  { name: 'Yuki Tanaka', role: 'Senior Engineer, Vercel', content: 'Sehr clean, kein Overhead. Jede Komponente ist eigenständig und hat keine unnötigen Dependencies.' },
  { name: 'Nina Hoffmann', role: 'Product Manager', content: 'Unsere Conversion Rate ist um 12% gestiegen seit wir die animierten Komponenten einsetzen.' },
]

const suggestions = [
  { id: 1, key: 'react', label: 'React Framework' },
  { id: 2, key: 'vue', label: 'Vue.js' },
  { id: 3, key: 'svelte', label: 'Svelte' },
  { id: 4, key: 'angular', label: 'Angular' },
  { id: 5, key: 'solid', label: 'SolidJS' },
  { id: 6, key: 'next', label: 'Next.js' },
  { id: 7, key: 'nuxt', label: 'Nuxt' },
  { id: 8, key: 'typescript', label: 'TypeScript' },
  { id: 9, key: 'javascript', label: 'JavaScript' },
  { id: 10, key: 'tailwind', label: 'Tailwind CSS' },
  { id: 11, key: 'vite', label: 'Vite Bundler' },
  { id: 12, key: 'webpack', label: 'Webpack' },
  { id: 13, key: 'node', label: 'Node.js Runtime' },
  { id: 14, key: 'bun', label: 'Bun Runtime' },
  { id: 15, key: 'deno', label: 'Deno Runtime' },
  { id: 16, key: 'prisma', label: 'Prisma ORM' },
  { id: 17, key: 'drizzle', label: 'Drizzle ORM' },
  { id: 18, key: 'zod', label: 'Zod Validation' },
  { id: 19, key: 'trpc', label: 'tRPC' },
  { id: 20, key: 'graphql', label: 'GraphQL' },
  { id: 21, key: 'docker', label: 'Docker' },
  { id: 22, key: 'postgres', label: 'PostgreSQL' },
  { id: 23, key: 'redis', label: 'Redis' },
  { id: 24, key: 'eslint', label: 'ESLint' },
  { id: 25, key: 'prettier', label: 'Prettier' },
  { id: 26, key: 'vitest', label: 'Vitest Testing' },
  { id: 27, key: 'playwright', label: 'Playwright E2E' },
  { id: 28, key: 'storybook', label: 'Storybook' },
  { id: 29, key: 'turborepo', label: 'Turborepo' },
  { id: 30, key: 'remix', label: 'Remix Framework' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '4rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        {descriptions[title] ?? ''}
      </p>
      {children}
    </section>
  )
}

const descriptions: Record<string, string> = {
  GlowCard: 'Card with a cursor-following glow border effect.',
  RotatingGlowCard: 'Card with an animated rotating glow border.',
  MagneticButton: 'Button that magnetically follows the cursor on hover.',
  TextScramble: 'Text reveal with randomized character scramble animation.',
  ScrollRotate: 'Element that rotates based on scroll position.',
  AccentSwitcher: 'Accent color picker dropdown.',
  AutocompleteCell: 'Input field with filtered autocomplete suggestions.',
  HeartFavorite: 'Animated heart toggle with bounce effect.',
  useImageUpload: 'Hook for image upload with preview and cleanup.',
  Checkbox: 'Animated checkbox with stroke-draw checkmark and scale-from-center fill.',
  Switch: 'iOS-style toggle with thumb squish animation on press.',
  Toast: 'Stacked toasts with swipe-to-dismiss, progress bar, and enter/exit animations.',
  PricingInteraction: 'Animated selection with period toggle and smooth number transitions.',
  TextRotate: 'Animated text rotation with staggered character transitions.',
  Breadcrumb: 'Composable breadcrumb navigation with separators and ellipsis.',
  AnimatedWeatherIcons: '12 animated SVG weather icons with framer-motion.',
  AuroraText: 'Gradient text with animated color shifting and subtle rotation.',
  AnimatedThemeToggler: 'Theme toggle with View Transitions API circle-clip animation.',
  AnimatedSearch: 'Search icon that morphs into an expanding search input field.',
  VelocityScroll: 'Scroll-reactive testimonial rows that accelerate with page scroll velocity.',
  Footer: 'Animated footer with link sections and social icons.',
}


function ToastDemoButtons() {
  const { add } = useToast()
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {([
        { label: 'Default', variant: 'default' as const, title: 'Action completed', description: 'Your changes have been saved.' },
        { label: 'Success', variant: 'success' as const, title: 'Upload successful', description: 'File has been uploaded.' },
        { label: 'Warning', variant: 'warning' as const, title: 'Rate limit', description: 'You are approaching the API limit.' },
        { label: 'Danger', variant: 'danger' as const, title: 'Error occurred', description: 'Could not connect to server.' },
      ]).map((t) => (
        <button
          key={t.variant}
          onClick={() => add({ title: t.title, description: t.description, variant: t.variant })}
          style={{
            padding: '0.4rem 0.85rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--border)',
            background: 'var(--card)',
            color: 'var(--text)',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--card)' }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

function ImageUploadDemo() {
  const {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  } = useImageUpload()

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: '0.75rem',
        background: 'var(--card)',
        overflow: 'hidden',
        maxWidth: '24rem',
      }}
    >
      {/* Upload area / Preview */}
      <div
        onClick={!previewUrl ? handleThumbnailClick : undefined}
        style={{
          height: '12rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: previewUrl ? 'default' : 'pointer',
          position: 'relative',
          background: previewUrl ? 'transparent' : 'rgba(255,255,255,0.02)',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!previewUrl) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
        }}
        onMouseLeave={(e) => {
          if (!previewUrl) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={fileName ?? 'Preview'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ margin: '0 auto 0.75rem', opacity: 0.5 }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <p style={{ fontSize: '0.8125rem' }}>Click to upload an image</p>
            <p style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.25rem' }}>
              JPG, PNG, GIF, WebP
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* Info bar */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8125rem',
        }}
      >
        <span
          style={{
            color: fileName ? 'var(--text)' : 'var(--text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '70%',
          }}
        >
          {fileName ?? 'No file selected'}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {previewUrl && (
            <button
              onClick={handleRemove}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '0.375rem',
                color: '#ef4444',
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent'
              }}
            >
              Remove
            </button>
          )}
          <button
            onClick={handleThumbnailClick}
            style={{
              background: previewUrl ? 'transparent' : 'var(--accent)',
              border: previewUrl ? '1px solid var(--border)' : 'none',
              borderRadius: '0.375rem',
              color: previewUrl ? 'var(--text)' : '#fff',
              padding: '0.25rem 0.6rem',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
          >
            {previewUrl ? 'Replace' : 'Browse'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function App() {
  const [autocompleteValue, setAutocompleteValue] = useState('')

  return (
    <ToastProvider placement="bottom-right">
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
            Components
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Interactive showcase of the component collection.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <AnimatedThemeToggler />
          <AccentSwitcher
            palettes={palettes}
            defaultPalette="indigo"
          />
        </div>
      </header>

      <Section title="GlowCard">
        <GlowCard style={{ padding: '2rem' }}>
          <p style={{ fontWeight: 500 }}>Hover over this card</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            The border glows and follows your cursor.
          </p>
        </GlowCard>
      </Section>

      <Section title="RotatingGlowCard">
        <RotatingGlowCard>
          <p style={{ fontWeight: 500 }}>Rotating glow border</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            A rectangle with a conic-gradient rotates behind the card. The content layer sits on top, so only the border glow is visible.
          </p>
        </RotatingGlowCard>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <RotatingGlowCard duration={1.5} style={{ flex: 1 }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Fast (1.5s)</p>
          </RotatingGlowCard>
          <RotatingGlowCard duration={6} style={{ flex: 1 }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Slow (6s)</p>
          </RotatingGlowCard>
        </div>
      </Section>

      <Section title="MagneticButton">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <MagneticButton>Default strength</MagneticButton>
          <MagneticButton strength={0.5} variant="outline">
            Stronger (0.5)
          </MagneticButton>
          <MagneticButton strength={0.8} variant="ghost">
            Very strong (0.8)
          </MagneticButton>
        </div>
      </Section>

      <Section title="PricingInteraction">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '1rem' }}>
          Adapted as a shipping method selector for an online shop:
        </p>
        <PricingInteraction
          periodLabels={['National', 'International']}
          periodMultiplier={2.5}
          currency="EUR"
          priceSuffix=""
          ctaLabel="Weiter zur Kasse"
          options={[
            { label: 'Standard', description: '5-7 Werktage', price: 4.99 },
            { label: 'Express', description: '2-3 Werktage', price: 9.99, badge: 'Beliebt' },
            { label: 'Same Day', description: 'Heute bis 18 Uhr', price: 14.99 },
          ]}
        />
      </Section>

      <Section title="useImageUpload">
        <ImageUploadDemo />
      </Section>

      <Section title="TextScramble">
        <div style={{ fontSize: '1.5rem', fontWeight: 600, fontFamily: 'monospace' }}>
          <TextScramble text="Hello, this is TextScramble!" speed={25} />
        </div>
      </Section>

      <Section title="ScrollRotate">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <RotatingDecoration />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Scroll the page to see the decoration rotate.
          </p>
        </div>
      </Section>

      <Section title="AccentSwitcher">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          The accent color picker in the top-right corner controls the global accent color for the entire page. Theme mode is handled by the AnimatedThemeToggler.
        </p>
      </Section>

      <Section title="Checkbox">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Checkbox label="Accept terms and conditions" size="md" />
          <Checkbox label="Subscribe to newsletter" size="md" defaultChecked />
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Checkbox label="Small" size="sm" />
            <Checkbox label="Medium" size="md" />
            <Checkbox label="Large" size="lg" />
          </div>
          <Checkbox label="Disabled" size="md" disabled />
        </div>
      </Section>

      <Section title="Switch">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Switch label="Dark mode" size="md" />
          <Switch label="Notifications" size="md" defaultChecked />
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Switch label="Small" size="sm" />
            <Switch label="Medium" size="md" />
            <Switch label="Large" size="lg" />
          </div>
          <Switch label="Disabled" size="md" disabled />
        </div>
      </Section>

      <Section title="Toast">
        <ToastDemoButtons />
      </Section>

      <Section title="HeartFavorite">
        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Card with heart */}
          <div
            style={{
              flex: 1,
              border: '1px solid var(--border)',
              borderRadius: '0.75rem',
              background: 'var(--card)',
              overflow: 'hidden',
            }}
          >
            {/* Image placeholder */}
            <div
              style={{
                height: '10rem',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                <HeartFavorite size={24} />
              </div>
            </div>
            <div style={{ padding: '1rem' }}>
              <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Project Alpha</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                A sample card with the animated heart favorite button.
              </p>
            </div>
          </div>

          {/* Standalone sizes */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              border: '1px solid var(--border)',
              borderRadius: '0.75rem',
              background: 'var(--card)',
              padding: '1.5rem',
            }}
          >
            <HeartFavorite size={20} />
            <HeartFavorite size={32} />
            <HeartFavorite size={44} defaultLiked />
          </div>
        </div>
      </Section>

      <Section title="AutocompleteCell">
        <div
          className="autocomplete-wrapper"
          style={{
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            maxWidth: '24rem',
            background: 'var(--card)',
          }}
        >
          <AutocompleteCell
            value={autocompleteValue}
            onChange={setAutocompleteValue}
            suggestions={suggestions}
            placeholder="Search tools & frameworks..."
          />
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
          Try: "re", "type", "vi", "dr", "node"
        </p>
      </Section>

      <Section title="TextRotate">
        {/* Wine-themed hero demo */}
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            background: 'var(--card)',
          }}
        >
          {/* Hero area */}
          <div
            style={{
              padding: '3rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '1rem',
            }}
          >
            <p
              style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--text-muted)',
              }}
            >
              Curated Selection
            </p>

            <div style={{ fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.025em' }}>
              <span style={{ color: 'var(--text)' }}>Discover </span>
              <TextRotate
                texts={[
                  'Barolo',
                  'Amarone',
                  'Brunello',
                  'Chianti',
                  'Sassicaia',
                  'Barbaresco',
                ]}
                rotationInterval={2500}
                staggerDuration={0.04}
                staggerFrom="first"
                mainStyle={{}}
                elementLevelStyle={{ color: 'var(--accent)' }}
              />
            </div>

            <p
              style={{
                maxWidth: '28rem',
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                marginTop: '0.5rem',
              }}
            >
              Handverlesene Weine aus den besten Lagen Italiens.
              Jeder Jahrgang erzählt eine Geschichte.
            </p>

            {/* Wine cards row */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '1.5rem',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              {[
                { name: 'Barolo Riserva', year: '2018', region: 'Piemonte' },
                { name: 'Amarone Classico', year: '2019', region: 'Veneto' },
                { name: 'Brunello DOCG', year: '2017', region: 'Toscana' },
              ].map((wine) => (
                <div
                  key={wine.name}
                  style={{
                    flex: 1,
                    maxWidth: '10rem',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      marginBottom: '0.75rem',
                      opacity: 0.7,
                    }}
                  />
                  <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text)' }}>
                    {wine.name}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {wine.region} · {wine.year}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: '1px solid var(--border)',
              padding: '0.75rem 2rem',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>TextRotate · splitBy: characters · staggerFrom: first</span>
            <span>rotationInterval: 2500ms</span>
          </div>
        </div>
      </Section>

      <Section title="Breadcrumb">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Basic */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* With ellipsis */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Library</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </Section>

      <Section title="AuroraText">
        <div style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
          <AuroraText speed={1.5}>Premium Quality</AuroraText>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.75rem' }}>
          <AuroraText colors={['var(--accent)', '#7928CA', '#FF0080', 'var(--accent)']} speed={0.8}>
            Uses your accent color
          </AuroraText>
        </div>
      </Section>

      <Section title="AnimatedWeatherIcons">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '1rem',
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
            background: 'var(--card)',
            padding: '1.5rem',
          }}
        >
          {([
            ['Sun', SunIcon], ['Moon', MoonIcon], ['Cloud', CloudIcon],
            ['Rain', RainIcon], ['Heavy Rain', HeavyRainIcon], ['Snow', SnowIcon],
            ['Thunder', ThunderIcon], ['Wind', WindIcon], ['Fog', FogIcon],
            ['Partly Cloudy', PartlyCloudyIcon], ['Sunrise', SunriseIcon], ['Rainbow', RainbowIcon],
          ] as const).map(([label, Icon]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <Icon size={40} />
              <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textAlign: 'center' }}>{label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="AnimatedThemeToggler">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          The theme toggle in the top-right uses the View Transitions API for a smooth circle-clip animation expanding from the button.
        </p>
      </Section>

      <Section title="AnimatedSearch">
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            background: 'var(--card)',
          }}
        >
          <div
            style={{
              padding: '3rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Click the icon:</span>
              <AnimatedSearch
                placeholder="Search components..."
                onSearch={(v) => console.log('Search:', v)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Wider variant:</span>
              <AnimatedSearch
                placeholder="What are you looking for?"
                expandedWidth={360}
                onSearch={(v) => console.log('Search:', v)}
              />
            </div>
          </div>
          <div
            style={{
              borderTop: '1px solid var(--border)',
              padding: '0.75rem 2rem',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>AnimatedSearch · spring physics · icon morph</span>
            <span>Esc to close · Enter to submit</span>
          </div>
        </div>
      </Section>

      <Section title="VelocityScroll">
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            background: 'var(--card)',
          }}
        >
          <div style={{ padding: '2rem 0' }}>
            <VelocityScroll baseVelocity={-30} rows={2} gap="1rem">
              {testimonials.map((t) => (
                <TestimonialCard key={t.name} testimonial={t} />
              ))}
            </VelocityScroll>
          </div>
          <div
            style={{
              borderTop: '1px solid var(--border)',
              padding: '0.75rem 2rem',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>VelocityScroll · useVelocity + useSpring · 2 rows</span>
            <span>Scroll the page to accelerate</span>
          </div>
        </div>
      </Section>

      <Section title="Footer">
        <Footer />
      </Section>

      {/* extra height so ScrollRotate has room to work */}
      <div style={{ height: '50vh' }} />
    </div>
    </ToastProvider>
  )
}
