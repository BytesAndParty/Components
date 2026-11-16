// Order = desktop nav order. Entries with `menu: 'tools'` share the "Werkzeuge" dropdown on
// desktop; the mobile menu and the index page list every entry flat.
export const groups = [
  {
    path: '/buchart58',
    titleKey: 'nav.buchart58',
    descKey: 'desc.buchart58',
    title: 'Buchart58',
    description: 'Genau die Komponenten, die der Buchart58-Shop einsetzt.',
    components: ['AddToCartButton', 'ProductTag', 'Rating', 'BookingCalendar', 'AmbientImage', 'Backlight', 'RevealImage', 'BlurFade', 'ShinyText', 'ShinyButton', 'Timeline', 'Tooltip', 'NumberInput'],
  },
  {
    path: '/cards',
    titleKey: 'nav.cards',
    descKey: 'desc.cards',
    title: 'Effekte',
    description: 'Glow effects, magnetic interactions, 3D hover, light and image effects, and animated icons.',
    components: ['ShapeCard', 'GlowCard', 'RotatingGlowCard', 'MagneticButton', 'Hover3DCard', 'LightRays', 'ShaderBackdrop', 'BottleStage', 'PixelImage', 'BounceCards', 'Lens', 'ImagesSlider', 'Particles', 'CursorGlow', 'AnimatedIcons'],
  },
  {
    path: '/text',
    titleKey: 'nav.text',
    descKey: 'desc.text',
    title: 'Text & Motion',
    description: 'Text animations, highlights, paper elements, and scroll-reactive motion.',
    components: ['Highlighter', 'Paragraph', 'PullQuote', 'PaperNote', 'PolaroidFrame', 'ProcessSteps', 'MarkerCallout', 'HangTag', 'Signature', 'Stamp', 'TextRotate', 'AuroraText', 'MorphingText', 'VelocityScroll', 'ScrollRotate', 'WaveText', 'NumeralReveal'],
  },
  {
    path: '/inputs',
    titleKey: 'nav.inputs',
    descKey: 'desc.inputs',
    title: 'Formulare & Feedback',
    description: 'Form controls, search interactions, and file uploads, plus toasts, counters, countdown, and confetti.',
    components: ['PasswordSetup', 'PasswordConfirmation', 'FormInput', 'FieldHint', 'Checkbox', 'Switch', 'Slider', 'AutocompleteCell', 'AnimatedSearch', 'SearchMorph', 'useImageUpload', 'ImageUpload', 'NumberTicker', 'CircularProgress', 'Toast', 'PricingInteraction', 'HeartLike', 'Countdown', 'Confetti'],
  },
  {
    path: '/navigation',
    titleKey: 'nav.navigation',
    descKey: 'desc.navigation',
    title: 'Navigation & Layout',
    description: 'Navbar, banner, breadcrumbs, scroll progress, theme controls, footer, and view transitions.',
    components: ['Banner', 'StickyBanner', 'ScrollProgress', 'Navbar', 'Breadcrumb', 'AccentSwitcher', 'AnimatedThemeToggler', 'Dock', 'FileTree', 'Footer', 'ViewTransition'],
  },
  {
    path: '/shop',
    titleKey: 'nav.shop',
    descKey: 'desc.shop',
    title: 'Shop Components',
    description: 'E-Commerce-spezifische Komponenten für den Wein-Onlineshop.',
    components: ['Carousel', 'AddToCartButton', 'CartIcon', 'FloatingCart', 'Stepper', 'VerticalStepper'],
  },
  {
    path: '/designer',
    titleKey: 'nav.designer',
    descKey: 'desc.designer',
    title: 'Designer',
    description: 'Building blocks für den Wine Label Designer: Color Picker, Text Toolbar und weitere Editor-Komponenten.',
    components: ['CellarCanvas', 'TextToolOptions', 'AlignmentBar', 'LayerPanel', 'ValidatorBadge', 'ImageCropperModal', 'ColorPicker'],
    menu: 'tools',
  },
  {
    path: '/data',
    titleKey: 'nav.data',
    descKey: 'desc.data',
    title: 'Data & Tables',
    description: 'Leistungsstarke Tabellen mit TanStack Table Integration, Sortierung und Pagination.',
    components: ['DataTable'],
    menu: 'tools',
  },
  {
    path: '/labor',
    titleKey: 'nav.labor',
    descKey: 'desc.labor',
    title: 'Labor',
    description: 'Verspielte Effekte, bewusst nicht für den Shop gedacht.',
    components: ['SplashCursor', 'SparklesText', 'TextScramble', 'GooeyInput', 'ClickSpark', 'AnimatedWeatherIcons'],
  },
] as const

export const palettes = {
  indigo: { label: 'Indigo', oklch: 'oklch(0.585 0.233 277)' },
  amber: { label: 'Amber', oklch: 'oklch(0.555 0.146 49)' },
  emerald: { label: 'Emerald', oklch: 'oklch(0.511 0.086 186.4)' },
  rose: { label: 'Rose', oklch: 'oklch(0.585 0.22 5)' },
}

export const suggestions = [
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

export const testimonials = [
  { name: 'Anna Müller', role: 'Frontend Lead', content: 'Butterweich' },
  { name: 'Marco Rossi', role: 'Design Engineer', content: 'Game-Changer' },
  { name: 'Sarah Chen', role: 'CTO', content: 'Performant' },
  { name: 'Lukas Weber', role: 'Fullstack Dev', content: 'Plug & Play' },
  { name: 'Elena Petrova', role: 'UX Designer', content: 'Detailverliebt' },
  { name: 'James O\'Brien', role: 'Indie Hacker', content: 'Einzigartig' },
  { name: 'Yuki Tanaka', role: 'Senior Engineer', content: 'Zero Overhead' },
  { name: 'Nina Hoffmann', role: 'Product Manager', content: '+12% Conversion' },
]

// Platzhalter-Unterschrift „Simon“ für <Signature>, bis die echte als SVG-Pfad vorliegt.
// Federzüge in Schreibreihenfolge: Namenszug, i-Punkt, Schwung.
export const SIGNATURE_SIMON = {
  viewBox: '4 4 254 104',
  strokes: [
    {
      d: 'M 105 20 C 97 4, 56 8, 50.5 30 C 45.5 50, 79 52, 66.6 78 C 55.1 100, 14.6 102, 8.6 86 C 5.5 74, 25 68, 42 72 C 53.3 75, 62.1 80, 72.6 78 C 79.1 76, 83.5 66, 86 60 C 83.5 70, 80.1 80, 86.1 80 C 91.1 80, 97.5 62, 101.5 62 C 105.5 62, 99.1 80, 103.1 80 C 107.1 80, 113.5 62, 117.5 62 C 121.5 62, 115.1 80, 120.1 80 C 126.1 80, 133.5 66, 130.3 63 C 126 60, 118 72, 123.8 77 C 128.1 80, 135.5 70, 140 64 C 143.5 62, 139.1 80, 144.1 80 C 149.1 80, 155.3 63, 160.3 63 C 165.3 63, 159.1 80, 165.1 80 C 174.1 80, 186.5 70, 197.5 58',
      duration: 1.7,
    },
    { d: 'M 89.3 47 L 93.8 45', duration: 0.1 },
    { d: 'M 20.1 104 C 70.1 96, 150.1 88, 235.6 90 C 251.6 90, 257.6 94, 247.6 98', duration: 0.5 },
  ],
}
