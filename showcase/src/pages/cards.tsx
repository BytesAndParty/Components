import { Section } from '../components/section'
import { GlowCard } from '@components/glow-card/glow-card'
import { RotatingGlowCard } from '@components/glow-card/rotating-glow-card'
import { MagneticButton } from '@components/magnetic-button/magnetic-button'

export function CardsPage() {
  return (
    <>
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
        <div className="space-y-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Variants</p>
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
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Call to Action</p>
            <div className="flex flex-wrap gap-4 items-center">
              <MagneticButton variant="cta">Get started</MagneticButton>
              <MagneticButton variant="cta" strength={0.5}>Strong pull (0.5)</MagneticButton>
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
    </>
  )
}
