import { Section } from '../components/section'
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis,
} from '@components/breadcrumb/breadcrumb'
import { AccentSwitcher } from '@components/accent-switcher/accent-switcher'
import { AnimatedThemeToggler } from '@components/animated-theme-toggler/animated-theme-toggler'
import { Footer } from '@components/footer-section/footer-section'
import { Banner, BannerLink } from '@components/banner/banner'
import { StickyBanner } from '@components/sticky-banner/sticky-banner'
import { Countdown } from '@components/countdown/countdown'
import {
  Navbar as NavbarComponent, NavbarSection, NavbarItem, NavbarLogo,
  NavbarDropdown, NavbarDropdownGroup, NavbarDropdownItem,
  NavbarIconButton,
} from '@components/navbar/navbar'
import { Dock, DockItem } from '@components/dock/dock'
import { FileTree, Folder, File } from '@components/file-tree/file-tree'
import { palettes } from '../data'

export function NavigationPage() {
  return (
    <>
      <Section title="Banner" description="Dismissible announcement bar for promotions and notices.">
        <div className="flex flex-col gap-4">
          <Banner>
            20% Rabatt auf alle Rotweine — nur dieses Wochenende!{' '}
            <BannerLink href="#">Jetzt entdecken</BannerLink>
          </Banner>
          <Banner bgColor="#10b981" dismissible={false}>
            Kostenloser Versand ab 50€ Bestellwert
          </Banner>
        </div>
      </Section>

      <Section title="StickyBanner" description="Sticky, dismissable banner with gradient variants, localStorage persistence, and an action slot (e.g. for an inline Countdown).">
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="max-h-80 overflow-y-auto">
              <StickyBanner
                variant="accent"
                action={
                  <Countdown
                    target={Date.now() + 1000 * 60 * 60 * 6}
                    hideLeadingZeros
                    size="sm"
                    transparent
                    labels={{ hours: 'Std', minutes: 'Min', seconds: 'Sek' }}
                  />
                }
              >
                <strong>Flash Sale:</strong> -20 % auf alle Rotweine — endet in
              </StickyBanner>
              <div className="p-8 space-y-4">
                {[...Array(12)].map((_, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    Scroll-Content Zeile {i + 1} — der Banner bleibt oben kleben, während dieser Container scrollt.
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <div className="max-h-40 overflow-y-auto">
                <StickyBanner variant="neutral" dismissible={false}>
                  Neutraler Hinweis – passt sich Theme an
                </StickyBanner>
                <div className="p-4 h-64" />
              </div>
            </div>
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <div className="max-h-40 overflow-y-auto">
                <StickyBanner variant="warning" dismissible={false}>
                  Wartungsfenster: Heute 22:00 Uhr
                </StickyBanner>
                <div className="p-4 h-64" />
              </div>
            </div>
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <div className="max-h-40 overflow-y-auto">
                <StickyBanner variant="danger" dismissible={false}>
                  Störung: Checkout derzeit nicht verfügbar
                </StickyBanner>
                <div className="p-4 h-64" />
              </div>
            </div>
          </div>

          <p className="text-muted-foreground text-xs">
            Varianten: <code>accent</code> folgt dem Accent-Switcher (oklch gradient), <code>neutral/warning/danger</code> sind
            semantisch fix. <code>persistKey</code> speichert Dismiss in localStorage.
          </p>
        </div>
      </Section>

      <Section title="ScrollProgress" description="Scroll position indicator bar, typically placed below a navbar.">
        <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
          <div className="border-b border-border p-3 px-8 flex justify-between text-[0.7rem] text-muted-foreground bg-white/[0.01]">
            <span>ScrollProgress · position: fixed · top: 56px · scaleX transform</span>
            <span>Scroll this page to see it fill ↑</span>
          </div>
          <div className="p-8 text-sm text-muted-foreground">
            The accent bar directly below the navbar is the <code className="text-xs bg-muted px-1 py-0.5 rounded">ScrollProgress</code> component — active on every page of this showcase.
          </div>
        </div>
      </Section>

      <Section title="Navbar" description="Composable navbar with dropdowns, mega-menu, icon buttons, and mobile drawer.">
        <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
          {/* Inline navbar demo – UIkit-inspired: transparent, minimal, uppercase */}
          <NavbarComponent
            sticky={false}
            transparent
            height={56}
            bgColor="transparent"
            borderColor="transparent"
            style={{ borderRadius: '12px 12px 0 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <NavbarSection position="left">
              <NavbarLogo href="#" style={{ fontSize: '16px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
                Weinhaus
              </NavbarLogo>
            </NavbarSection>

            <NavbarSection position="center">
              <NavbarItem active style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.1em', fontWeight: 400 }}>Home</NavbarItem>
              <NavbarDropdown trigger={<span style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.1em' }}>Weine</span>} id="demo-weine" mega>
                <NavbarDropdownGroup title="Rotwein">
                  <NavbarDropdownItem href="#" subtitle="Piemonte, Italien">Barolo</NavbarDropdownItem>
                  <NavbarDropdownItem href="#" subtitle="Veneto, Italien">Amarone</NavbarDropdownItem>
                  <NavbarDropdownItem href="#" subtitle="Toskana, Italien">Chianti</NavbarDropdownItem>
                </NavbarDropdownGroup>
                <NavbarDropdownGroup title="Weißwein">
                  <NavbarDropdownItem href="#" subtitle="Wachau, Österreich">Grüner Veltliner</NavbarDropdownItem>
                  <NavbarDropdownItem href="#" subtitle="Burgund, Frankreich">Chardonnay</NavbarDropdownItem>
                  <NavbarDropdownItem href="#" subtitle="Mosel, Deutschland">Riesling</NavbarDropdownItem>
                </NavbarDropdownGroup>
                <NavbarDropdownGroup title="Rosé & Sekt">
                  <NavbarDropdownItem href="#" subtitle="Provence, Frankreich">Rosé de Provence</NavbarDropdownItem>
                  <NavbarDropdownItem href="#" subtitle="Champagne, Frankreich">Champagner</NavbarDropdownItem>
                </NavbarDropdownGroup>
              </NavbarDropdown>
              <NavbarDropdown trigger={<span style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.1em' }}>Über Uns</span>} id="demo-about">
                <NavbarDropdownItem href="#">Unsere Geschichte</NavbarDropdownItem>
                <NavbarDropdownItem href="#" subtitle="Direkt vom Winzer">Herkunft</NavbarDropdownItem>
                <NavbarDropdownItem href="#">Kontakt</NavbarDropdownItem>
              </NavbarDropdown>
              <NavbarItem style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.1em', fontWeight: 400 }}>Blog</NavbarItem>
            </NavbarSection>

            <NavbarSection position="right">
              <NavbarIconButton aria-label="Suche">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </NavbarIconButton>
              <NavbarIconButton aria-label="Warenkorb" badge={3}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
              </NavbarIconButton>
            </NavbarSection>
          </NavbarComponent>

          <div className="border-t border-border p-3 px-8 flex justify-between text-[0.7rem] text-muted-foreground bg-white/[0.01]">
            <span>Navbar · transparent · uppercase · minimal UIkit-style</span>
            <span>Hover "Weine" for mega-menu</span>
          </div>
        </div>
      </Section>

      <Section title="Breadcrumb" description="Composable breadcrumb navigation with separators and ellipsis.">
        <div className="flex flex-col gap-6">
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

      <Section title="AccentSwitcher" description="Accent color picker dropdown with colored dots on hover.">
        <div className="flex items-center gap-6">
          <div className="border border-border rounded-lg p-4 bg-card">
            <AccentSwitcher palettes={palettes} defaultPalette="indigo" />
          </div>
          <p className="text-muted-foreground text-sm">
            Hover over the icon to see the 4 palette colors on the dots.
          </p>
        </div>
      </Section>

      <Section title="AnimatedThemeToggler" description="Theme toggle with View Transitions API circle-clip animation.">
        <div className="flex items-center gap-4">
          <AnimatedThemeToggler />
          <p className="text-muted-foreground text-sm">
            The theme toggle uses the View Transitions API for a smooth circle-clip animation expanding from the button.
          </p>
        </div>
      </Section>

      <Section title="Dock" description="macOS-Dock-Style Navigation mit Framer Motion Magnification-Effekt. Scale aus Distanz zur Maus berechnet.">
        <div className="flex flex-col items-center gap-8">
          <Dock magnification={1.7} distance={110}>
            <DockItem
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>}
              label="Home"
              href="#"
            />
            <DockItem
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>}
              label="Suche"
              href="#"
            />
            <DockItem
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>}
              label="Shop"
              href="#"
            />
            <DockItem
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>}
              label="Favoriten"
              href="#"
            />
            <DockItem
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
              label="Profil"
              href="#"
            />
          </Dock>
          <p className="text-xs text-muted-foreground">Hover langsam über die Icons, um die Magnification zu sehen</p>
        </div>
      </Section>

      <Section title="FileTree" description="Composable rekursiver Dateibaum mit AnimatePresence height 0→auto. Expand/Collapse via Lucide-Icons.">
        <div className="grid grid-cols-2 gap-8">
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Component Library</p>
            <FileTree>
              <Folder name="components" defaultOpen>
                <Folder name="magnetic-button" defaultOpen>
                  <File name="magnetic-button.tsx" />
                </Folder>
                <Folder name="aurora-text">
                  <File name="aurora-text.tsx" />
                </Folder>
                <Folder name="dock">
                  <File name="dock.tsx" />
                </Folder>
                <File name="index.ts" />
              </Folder>
              <Folder name="showcase">
                <Folder name="src">
                  <File name="App.tsx" />
                  <File name="layout.tsx" />
                </Folder>
                <File name="package.json" />
              </Folder>
              <File name="CLAUDE.md" />
            </FileTree>
          </div>

          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Weinshop Struktur</p>
            <FileTree indent={14}>
              <Folder name="src" defaultOpen>
                <Folder name="pages" defaultOpen>
                  <File name="index.tsx" />
                  <File name="products.tsx" />
                  <File name="checkout.tsx" />
                </Folder>
                <Folder name="components">
                  <File name="ProductCard.tsx" />
                  <File name="CartDrawer.tsx" />
                  <File name="Stepper.tsx" />
                </Folder>
                <Folder name="lib">
                  <File name="medusa.ts" />
                  <File name="stripe.ts" />
                </Folder>
              </Folder>
              <File name="package.json" />
            </FileTree>
          </div>
        </div>
      </Section>

      <Section title="Footer" description="Animated footer with link sections and social icons.">
        <Footer />
      </Section>
    </>
  )
}
