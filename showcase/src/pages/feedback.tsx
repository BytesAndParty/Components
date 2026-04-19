import { useState } from 'react'
import { Section } from '../components/section'
import { ToastProvider, useToast } from '@components/toast/toast'
import { PricingInteraction } from '@components/pricing-interaction/pricing-interaction'
import { Rating } from '@components/rating/rating'
import { ConfettiButton, ConfettiRain } from '@components/confetti/confetti'
import { ScrollProgress } from '@components/scroll-progress/scroll-progress'
import { HeartLike } from '@components/heart-like/heart-like'
import { BounceLoader } from '@components/bounce-loader/bounce-loader'

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

export function FeedbackPage() {
  const [raining, setRaining] = useState(false)

  return (
    <>
      <ScrollProgress top="56px" color="var(--accent)" height={2} zIndex={99} />
      <Section title="Toast" description="Stacked toasts with swipe-to-dismiss, progress bar, and enter/exit animations.">
        <ToastDemoButtons />
      </Section>

      <Section title="PricingInteraction" description="Animated selection with period toggle and smooth number transitions.">
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

      <Section title="Rating" description="Star rating component with hover preview, pop animation, and controlled/uncontrolled mode.">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Interactive</p>
            <div className="flex items-center gap-6">
              <Rating size={28} />
              <Rating size={28} defaultValue={3} activeColor="#f59e0b" />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Read-only (Productbewertungen)</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Rating size={18} value={5} readOnly activeColor="#f59e0b" />
                <span className="text-sm text-muted-foreground">(42)</span>
              </div>
              <div className="flex items-center gap-2">
                <Rating size={18} value={4} readOnly activeColor="#f59e0b" />
                <span className="text-sm text-muted-foreground">(128)</span>
              </div>
              <div className="flex items-center gap-2">
                <Rating size={18} value={3} readOnly activeColor="#f59e0b" />
                <span className="text-sm text-muted-foreground">(7)</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Sizes</p>
            <div className="flex items-center gap-6">
              <Rating size={16} defaultValue={4} />
              <Rating size={24} defaultValue={4} />
              <Rating size={32} defaultValue={4} />
            </div>
          </div>
        </div>
      </Section>

      <Section title="HeartLike" description="Like/favorite heart with pop-in fill and spark burst on activate.">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Default (accent)</p>
            <div className="flex items-center gap-6">
              <HeartLike size={48} />
              <HeartLike size={48} defaultChecked />
              <HeartLike size={48} disabled />
              <HeartLike size={48} disabled defaultChecked />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Sizes & custom colors</p>
            <div className="flex items-center gap-6">
              <HeartLike size={28} color="#ef4444" />
              <HeartLike size={40} color="#ef4444" defaultChecked />
              <HeartLike size={56} color="#f43f5e" defaultChecked />
              <HeartLike size={72} color="#ec4899" defaultChecked />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">In-product usage</p>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card max-w-80">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Château Margaux 2015</p>
                <p className="text-xs text-muted-foreground mt-0.5">Premium Bordeaux · 750 ml</p>
              </div>
              <HeartLike size={32} ariaLabel="Zu Favoriten hinzufügen" />
            </div>
          </div>
        </div>
      </Section>

      <Section title="BounceLoader" description="Three bouncing dots with squish-on-impact — pure CSS, accent-aware.">
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Default (accent)</p>
            <BounceLoader />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Sizes</p>
            <div className="flex items-end gap-10">
              <BounceLoader size={10} />
              <BounceLoader size={16} />
              <BounceLoader size={24} />
              <BounceLoader size={32} />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Speeds & custom colors</p>
            <div className="flex items-end gap-10">
              <BounceLoader size={16} speed={0.3} color="#ef4444" label="Laden, schnell" />
              <BounceLoader size={16} speed={0.5} color="#10b981" label="Laden" />
              <BounceLoader size={16} speed={0.9} color="#f59e0b" label="Laden, langsam" />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Confetti" description="Particle confetti burst – always fullscreen via canvas-confetti. Origin is calculated from the button position.">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Vom Button aus</p>
            <div className="flex gap-4">
              <ConfettiButton
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Add to Cart
              </ConfettiButton>
              <ConfettiButton
                confettiOptions={{ colors: ['#f59e0b', '#f97316', '#ef4444'], particleCount: 80 }}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: 'var(--foreground)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Warm colors
              </ConfettiButton>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Confetti-Regen (volle Breite)</p>
            <button
              onClick={() => setRaining(true)}
              disabled={raining}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--accent)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 500,
                cursor: raining ? 'default' : 'pointer',
                fontFamily: 'inherit',
                opacity: raining ? 0.6 : 1,
              }}
            >
              Bestellung abgeschlossen!
            </button>
            <ConfettiRain
              active={raining}
              particleCount={700}
              waves={7}
              onComplete={() => setRaining(false)}
            />
          </div>
        </div>
      </Section>
    </>
  )
}
