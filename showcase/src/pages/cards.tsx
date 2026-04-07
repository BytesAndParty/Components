import { Section } from '../components/section'
import { GlowCard } from '@components/glow-card/glow-card'
import { RotatingGlowCard } from '@components/glow-card/rotating-glow-card'
import { MagneticButton } from '@components/magnetic-button/magnetic-button'
import { Hover3DCard } from '@components/hover-3d-card/hover-3d-card'
import { ClickSpark } from '@components/click-spark/click-spark'

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
    </>
  )
}
