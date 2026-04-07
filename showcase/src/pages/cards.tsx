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

      <Section title="MagneticButton" description="Button that magnetically follows the cursor on hover.">
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
    </>
  )
}
