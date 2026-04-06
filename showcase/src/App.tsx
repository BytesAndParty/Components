import { useState } from 'react'
import { GlowCard } from '../../components/glow-card/glow-card'
import { RotatingGlowCard } from '../../components/glow-card/rotating-glow-card'
import { MagneticButton } from '../../components/magnetic-button/magnetic-button'
import { TextScramble } from '../../components/text-scramble/text-scramble'
import { ScrollRotate, RotatingDecoration } from '../../components/scroll-rotate/scroll-rotate'
import { AccentSwitcher } from '../../components/accent-switcher/accent-switcher'
import { AccentSwitcherBefore } from '../../components/accent-switcher/_accent-switcher-BEFORE'
import { AutocompleteCell } from '../../components/autocomplete-cell/autocomplete-cell'
import { HeartFavorite } from '../../components/heart-favorite/heart-favorite'
import { Footer } from '../../components/footer-section/footer-section'
import { TextRotate } from '../../components/text-rotate/text-rotate'
import { useImageUpload } from '../../components/use-image-upload/use-image-upload'
import { PricingInteraction } from '../../components/pricing-interaction/pricing-interaction'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '../../components/breadcrumb/breadcrumb'
import { Checkbox } from '../../components/checkbox/checkbox'
import { Switch } from '../../components/switch/switch'
import { ToastProvider, useToast } from '../../components/toast/toast'
import {
  SunIcon, MoonIcon, CloudIcon, RainIcon, HeavyRainIcon, SnowIcon,
  ThunderIcon, WindIcon, FogIcon, PartlyCloudyIcon, SunriseIcon, RainbowIcon,
} from '../../components/animated-weather-icons/animated-weather-icons'
import { AuroraText } from '../../components/aurora-text/aurora-text'
import { AnimatedThemeToggler } from '../../components/animated-theme-toggler/animated-theme-toggler'
import { AnimatedSearch } from '../../components/animated-search/animated-search'
import { VelocityScroll, TestimonialCard, type Testimonial } from '../../components/velocity-scroll/velocity-scroll'
import {
  HomeIcon, SearchToXIcon, MenuIcon, MenuAltIcon,
  FilterIcon, NotificationIcon, VisibilityIcon,
  CheckmarkIcon, CopyIcon, LoadingIcon, MaximizeMinimizeIcon,
  ShareIcon, TrashIcon,
  SunIconCss, MoonIconCss, StarIconCss, WineIconCss,
} from '../../components/animated-icons/animated-icons'

const palettes = {
  indigo: { label: 'Indigo', oklch: 'oklch(0.585 0.233 277)' },
  amber: { label: 'Amber', oklch: 'oklch(0.555 0.146 49)' },
  emerald: { label: 'Emerald', oklch: 'oklch(0.511 0.086 186.4)' },
  rose: { label: 'Rose', oklch: 'oklch(0.585 0.22 5)' },
}

const testimonials: Testimonial[] = [
  { name: 'Anna Müller', role: 'Frontend Lead', content: 'Butterweich' },
  { name: 'Marco Rossi', role: 'Design Engineer', content: 'Game-Changer' },
  { name: 'Sarah Chen', role: 'CTO', content: 'Performant' },
  { name: 'Lukas Weber', role: 'Fullstack Dev', content: 'Plug & Play' },
  { name: 'Elena Petrova', role: 'UX Designer', content: 'Detailverliebt' },
  { name: 'James O\'Brien', role: 'Indie Hacker', content: 'Einzigartig' },
  { name: 'Yuki Tanaka', role: 'Senior Engineer', content: 'Zero Overhead' },
  { name: 'Nina Hoffmann', role: 'Product Manager', content: '+12% Conversion' },
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

function Section({ title, children }: { title: keyof typeof descriptions; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground text-sm mb-6">
        {descriptions[title] ?? ''}
      </p>
      {children}
    </section>
  )
}

const descriptions = {
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
} as const


function ToastDemoButtons() {
  const { add } = useToast()
  return (
    <div className="flex flex-wrap gap-2">
      {([
        { label: 'Default', variant: 'default' as const, title: 'Action completed', description: 'Your changes have been saved.' },
        { label: 'Success', variant: 'success' as const, title: 'Upload successful', description: 'File has been uploaded.' },
        { label: 'Warning', variant: 'warning' as const, title: 'Rate limit', description: 'You are approaching the API limit.' },
        { label: 'Danger', variant: 'danger' as const, title: 'Error occurred', description: 'Could not connect to server.' },
      ]).map((t) => (
        <button
          key={t.variant}
          onClick={() => add({ title: t.title, description: t.description, variant: t.variant })}
          className="px-3.5 py-1.5 rounded-md border border-border bg-card text-foreground text-[0.8125rem] cursor-pointer transition-colors hover:bg-white/5 active:scale-95"
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
    <div className="border border-border rounded-xl bg-card overflow-hidden max-w-96 shadow-sm">
      {/* Upload area / Preview */}
      <div
        onClick={!previewUrl ? handleThumbnailClick : undefined}
        className={`h-48 flex items-center justify-center relative transition-colors ${
          previewUrl ? 'cursor-default' : 'cursor-pointer bg-white/[0.02] hover:bg-white/[0.04]'
        }`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={fileName ?? 'Preview'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center text-muted-foreground">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-3 opacity-50"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <p className="text-[0.8125rem]">Click to upload an image</p>
            <p className="text-[0.7rem] opacity-50 mt-1">
              JPG, PNG, GIF, WebP
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Info bar */}
      <div className="border-t border-border p-3 px-4 flex items-center justify-between text-[0.8125rem]">
        <span className={`truncate max-w-[70%] ${fileName ? 'text-foreground' : 'text-muted-foreground'}`}>
          {fileName ?? 'No file selected'}
        </span>
        <div className="flex gap-2">
          {previewUrl && (
            <button
              onClick={handleRemove}
              className="bg-transparent border border-border rounded-md text-red-500 px-2.5 py-1 text-xs cursor-pointer transition-colors hover:bg-red-500/10"
            >
              Remove
            </button>
          )}
          <button
            onClick={handleThumbnailClick}
            className={`rounded-md px-2.5 py-1 text-xs cursor-pointer transition-opacity active:scale-95 ${
              previewUrl ? 'bg-transparent border border-border text-foreground' : 'bg-accent text-white'
            }`}
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
    <div className="max-w-3xl mx-auto py-12 px-6">
      <header className="mb-16 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Components
          </h1>
          <p className="text-muted-foreground mt-2">
            Interactive showcase of the component collection.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <AnimatedThemeToggler />
          <AccentSwitcher
            palettes={palettes}
            defaultPalette="indigo"
          />
        </div>
      </header>

      <Section title="MagneticButton">
        <div className="flex flex-wrap gap-4">
          <MagneticButton>Default strength</MagneticButton>
          <MagneticButton strength={0.5} variant="outline">
            Stronger (0.5)
          </MagneticButton>
          <MagneticButton strength={0.8} variant="ghost">
            Very strong (0.8)
          </MagneticButton>
        </div>
      </Section>

      <Section title="GlowCard">
        <GlowCard className="p-8">
          <p className="font-medium text-foreground">Hover over this card</p>
          <p className="text-muted-foreground text-sm mt-2">
            The border glows and follows your cursor.
          </p>
        </GlowCard>
      </Section>

      <Section title="RotatingGlowCard">
        <RotatingGlowCard>
          <p className="font-medium text-foreground">Rotating glow border</p>
          <p className="text-muted-foreground text-sm mt-2">
            A rectangle with a conic-gradient rotates behind the card. The content layer sits on top, so only the border glow is visible.
          </p>
        </RotatingGlowCard>
        <div className="flex gap-4 mt-4">
          <RotatingGlowCard duration={1.5} className="flex-1">
            <p className="text-[0.8125rem] font-medium text-foreground">Fast (1.5s)</p>
          </RotatingGlowCard>
          <RotatingGlowCard duration={6} className="flex-1">
            <p className="text-[0.8125rem] font-medium text-foreground">Slow (6s)</p>
          </RotatingGlowCard>
        </div>
      </Section>

      <Section title="PricingInteraction">
        <p className="text-muted-foreground text-[0.8125rem] mb-4">
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
        <div className="text-2xl font-semibold font-mono text-foreground">
          <TextScramble text="Hello, this is TextScramble!" speed={25} />
        </div>
      </Section>

      <Section title="ScrollRotate">
        <div className="flex items-center gap-8">
          <RotatingDecoration />
          <p className="text-muted-foreground text-sm">
            Scroll the page to see the decoration rotate.
          </p>
        </div>
      </Section>

      <Section title="AccentSwitcher">
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[0.625rem] uppercase tracking-wider text-muted-foreground">Before</span>
            <div className="border border-border rounded-lg p-4 bg-card">
              <AccentSwitcherBefore
                palettes={palettes}
                defaultPalette="indigo"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[0.625rem] uppercase tracking-wider text-muted-foreground">After</span>
            <div className="border border-border rounded-lg p-4 bg-card">
              <AccentSwitcher
                palettes={palettes}
                defaultPalette="indigo"
              />
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Hover over the icons to see the difference. The new icon shows the 4 accent colors on hover.
          </p>
        </div>
      </Section>

      <Section title="Checkbox">
        <div className="flex flex-col gap-4">
          <Checkbox label="Accept terms and conditions" size="md" />
          <Checkbox label="Subscribe to newsletter" size="md" defaultChecked />
          <div className="flex gap-6">
            <Checkbox label="Small" size="sm" />
            <Checkbox label="Medium" size="md" />
            <Checkbox label="Large" size="lg" />
          </div>
          <Checkbox label="Disabled" size="md" disabled />
        </div>
      </Section>

      <Section title="Switch">
        <div className="flex flex-col gap-4">
          <Switch label="Dark mode" size="md" />
          <Switch label="Notifications" size="md" defaultChecked />
          <div className="flex gap-6">
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
        <div className="flex gap-4">
          {/* Card with heart */}
          <div className="flex-1 border border-border rounded-xl bg-card overflow-hidden shadow-sm">
            {/* Image placeholder */}
            <div className="h-40 bg-gradient-to-br from-indigo-500/15 to-violet-500/10 relative">
              <div className="absolute top-3 right-3">
                <HeartFavorite size={24} />
              </div>
            </div>
            <div className="p-4">
              <p className="font-semibold text-[0.9375rem] text-foreground">Project Alpha</p>
              <p className="text-muted-foreground text-[0.8125rem] mt-1">
                A sample card with the animated heart favorite button.
              </p>
            </div>
          </div>

          {/* Standalone sizes */}
          <div className="flex flex-col items-center justify-center gap-2 border border-border rounded-xl bg-card p-6 shadow-sm">
            <HeartFavorite size={20} />
            <HeartFavorite size={32} />
            <HeartFavorite size={44} defaultLiked />
          </div>
        </div>
      </Section>

      <Section title="AutocompleteCell">
        <div className="border border-border rounded-lg max-w-96 bg-card overflow-hidden shadow-sm">
          <AutocompleteCell
            value={autocompleteValue}
            onChange={setAutocompleteValue}
            suggestions={suggestions}
            placeholder="Search tools & frameworks..."
          />
        </div>
        <p className="text-muted-foreground text-xs mt-2">
          Try: "re", "type", "vi", "dr", "node"
        </p>
      </Section>

      <Section title="TextRotate">
        {/* Wine-themed hero demo */}
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
          {/* Hero area */}
          <div className="p-12 px-8 flex flex-col items-center text-center gap-4">
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
              Curated Selection
            </p>

            <div className="text-4xl font-bold leading-tight tracking-tight">
              <span className="text-foreground">Discover </span>
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

            <p className="max-w-md text-sm text-muted-foreground leading-relaxed mt-2">
              Handverlesene Weine aus den besten Lagen Italiens.
              Jeder Jahrgang erzählt eine Geschichte.
            </p>

            {/* Wine cards row */}
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
                  <p className="text-[0.8125rem] font-semibold text-foreground">
                    {wine.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {wine.region} · {wine.year}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border p-3 px-8 flex justify-between text-[0.7rem] text-muted-foreground bg-white/[0.01]">
            <span>TextRotate · splitBy: characters · staggerFrom: first</span>
            <span>rotationInterval: 2500ms</span>
          </div>
        </div>
      </Section>

      <Section title="Breadcrumb">
        <div className="flex flex-col gap-6">
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
        <div className="text-4xl font-bold tracking-tight text-foreground">
          <AuroraText speed={1.5}>Premium Quality</AuroraText>
        </div>
        <div className="text-xl font-semibold mt-3">
          <AuroraText colors={['var(--accent)', '#7928CA', '#FF0080', 'var(--accent)']} speed={0.8}>
            Uses your accent color
          </AuroraText>
        </div>
      </Section>

      <Section title="AnimatedWeatherIcons">
        <div className="grid grid-cols-6 gap-4 border border-border rounded-xl bg-card p-6 shadow-sm">
          {([
            ['Sun', SunIcon], ['Moon', MoonIcon], ['Cloud', CloudIcon],
            ['Rain', RainIcon], ['Heavy Rain', HeavyRainIcon], ['Snow', SnowIcon],
            ['Thunder', ThunderIcon], ['Wind', WindIcon], ['Fog', FogIcon],
            ['Partly Cloudy', PartlyCloudyIcon], ['Sunrise', SunriseIcon], ['Rainbow', RainbowIcon],
          ] as const).map(([label, Icon]) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <Icon size={40} />
              <span className="text-[0.625rem] text-muted-foreground text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="AnimatedIcons">
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-4">Trigger: Hover</p>
            <div className="grid grid-cols-7 gap-y-8 gap-4 border border-border rounded-xl bg-card p-6 shadow-sm">
              {([
                ['Home', HomeIcon],
                ['Search/X', SearchToXIcon],
                ['Menu', MenuIcon],
                ['Menu Alt', MenuAltIcon],
                ['Filter', FilterIcon],
                ['Notification', NotificationIcon],
                ['Visibility', VisibilityIcon],
                ['Checkmark', CheckmarkIcon],
                ['Copy', CopyIcon],
                ['Loading', LoadingIcon],
                ['Maximize', MaximizeMinimizeIcon],
                ['Share', ShareIcon],
                ['Trash', TrashIcon],
              ] as const).map(([label, Icon]) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <Icon size={32} trigger="hover" />
                  <span className="text-[0.625rem] text-muted-foreground text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-4">Trigger: Click</p>
            <div className="grid grid-cols-7 gap-y-8 gap-4 border border-border rounded-xl bg-card p-6 shadow-sm">
              {([
                ['Home', HomeIcon],
                ['Search/X', SearchToXIcon],
                ['Menu', MenuIcon],
                ['Menu Alt', MenuAltIcon],
                ['Filter', FilterIcon],
                ['Notification', NotificationIcon],
                ['Visibility', VisibilityIcon],
                ['Checkmark', CheckmarkIcon],
                ['Copy', CopyIcon],
                ['Loading', LoadingIcon],
                ['Maximize', MaximizeMinimizeIcon],
                ['Share', ShareIcon],
                ['Trash', TrashIcon],
              ] as const).map(([label, Icon]) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <Icon size={32} trigger="click" />
                  <span className="text-[0.625rem] text-muted-foreground text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-4">CSS-Animated SVG Icons</p>
            <div className="grid grid-cols-7 gap-y-8 gap-4 border border-border rounded-xl bg-card p-6 shadow-sm">
              {([
                ['Sun', SunIconCss],
                ['Moon', MoonIconCss],
                ['Star', StarIconCss],
                ['Wine', WineIconCss],
              ] as [string, typeof SunIconCss][]).map(([label, Icon]) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <Icon size={32} />
                  <span className="text-[0.625rem] text-muted-foreground text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="AnimatedThemeToggler">
        <div className="flex items-center gap-4">
          <AnimatedThemeToggler />
          <p className="text-muted-foreground text-sm">
            The theme toggle in the top-right uses the View Transitions API for a smooth circle-clip animation expanding from the button.
          </p>
        </div>
      </Section>

      <Section title="AnimatedSearch">
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
          <div className="p-12 px-8 flex flex-col items-center gap-8">
            <div className="flex items-center gap-6">
              <span className="text-muted-foreground text-sm">Click the icon:</span>
              <AnimatedSearch
                placeholder="Search components..."
                onSearch={(v) => add({ title: 'Search', description: `Searching for: ${v}`, variant: 'default' })}
              />
            </div>
            <div className="flex items-center gap-6">
              <span className="text-muted-foreground text-sm">Wider variant:</span>
              <AnimatedSearch
                placeholder="What are you looking for?"
                expandedWidth={360}
                onSearch={(v) => add({ title: 'Search', description: `Searching for: ${v}`, variant: 'default' })}
              />
            </div>
          </div>
          <div className="border-t border-border p-3 px-8 flex justify-between text-[0.7rem] text-muted-foreground bg-white/[0.01]">
            <span>AnimatedSearch · spring physics · icon morph</span>
            <span>Esc to close · Enter to submit</span>
          </div>
        </div>
      </Section>

      <Section title="VelocityScroll">
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

      <Section title="Footer">
        <Footer />
      </Section>

      {/* extra height so ScrollRotate has room to work */}
      <div className="h-[50vh]" />
    </div>
    </ToastProvider>
  )
}
