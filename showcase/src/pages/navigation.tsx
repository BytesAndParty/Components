import { Section } from '../components/section'
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis,
} from '@components/breadcrumb/breadcrumb'
import { AccentSwitcher } from '@components/accent-switcher/accent-switcher'
import { AccentSwitcherBefore } from '@components/accent-switcher/_accent-switcher-BEFORE'
import { AnimatedThemeToggler } from '@components/animated-theme-toggler/animated-theme-toggler'
import { Footer } from '@components/footer-section/footer-section'
import { palettes } from '../data'

export function NavigationPage() {
  return (
    <>
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

      <Section title="AccentSwitcher" description="Accent color picker dropdown.">
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[0.625rem] uppercase tracking-wider text-muted-foreground">Before</span>
            <div className="border border-border rounded-lg p-4 bg-card">
              <AccentSwitcherBefore palettes={palettes} defaultPalette="indigo" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[0.625rem] uppercase tracking-wider text-muted-foreground">After</span>
            <div className="border border-border rounded-lg p-4 bg-card">
              <AccentSwitcher palettes={palettes} defaultPalette="indigo" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Hover over the icons to see the difference. The new icon shows the 4 accent colors on hover.
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
