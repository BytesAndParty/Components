import { Section } from '../components/section'
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis,
} from '@components/breadcrumb/breadcrumb'
import { AccentSwitcher } from '@components/accent-switcher/accent-switcher'
import { AnimatedThemeToggler } from '@components/animated-theme-toggler/animated-theme-toggler'
import { Footer } from '@components/footer-section/footer-section'
import { Banner, BannerLink } from '@components/banner/banner'
import { ScrollProgress } from '@components/scroll-progress/scroll-progress'
import {
  Navbar as NavbarComponent, NavbarSection, NavbarItem, NavbarLogo,
  NavbarDropdown, NavbarDropdownGroup, NavbarDropdownItem,
  NavbarIconButton, NavbarDivider,
} from '@components/navbar/navbar'
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

      <Section title="ScrollProgress" description="Scroll position indicator bar, typically placed below a navbar.">
        <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
          <div className="p-8 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground text-center">
              The accent-colored line at the very top of the page is the ScrollProgress component.
            </p>
            <ScrollProgress top="0" color="var(--accent)" height={3} />
          </div>
          <div className="border-t border-border p-3 px-8 flex justify-between text-[0.7rem] text-muted-foreground bg-white/[0.01]">
            <span>ScrollProgress · position: fixed · scaleX transform</span>
            <span>Scroll to see it fill</span>
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

      <Section title="Footer" description="Animated footer with link sections and social icons.">
        <Footer />
      </Section>
    </>
  )
}
