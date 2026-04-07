import { Section } from '../components/section'
import { ToastProvider, useToast } from '@components/toast/toast'
import { HeartFavorite } from '@components/heart-favorite/heart-favorite'
import { PricingInteraction } from '@components/pricing-interaction/pricing-interaction'
import { Rating } from '@components/rating/rating'
import { ConfettiButton, fireConfetti } from '@components/confetti/confetti'

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
  return (
    <>
      <Section title="Toast" description="Stacked toasts with swipe-to-dismiss, progress bar, and enter/exit animations.">
        <ToastDemoButtons />
      </Section>

      <Section title="HeartFavorite" description="Animated heart toggle with bounce effect.">
        <div className="flex gap-4">
          <div className="flex-1 border border-border rounded-xl bg-card overflow-hidden shadow-sm">
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
          <div className="flex flex-col items-center justify-center gap-2 border border-border rounded-xl bg-card p-6 shadow-sm">
            <HeartFavorite size={20} />
            <HeartFavorite size={32} />
            <HeartFavorite size={44} defaultLiked />
          </div>
        </div>
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

      <Section title="Confetti" description="Particle confetti effect – fullscreen (imperative) and local (around button).">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Lokal (um den Button)</p>
            <div className="flex gap-4">
              <ConfettiButton
                mode="local"
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
                mode="local"
                confettiOptions={{ colors: ['#f59e0b', '#f97316', '#ef4444'], particleCount: 30 }}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: 'var(--text)',
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
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Fullscreen</p>
            <button
              onClick={() => fireConfetti({ particleCount: 120, spread: 90 })}
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
              Bestellung abgeschlossen!
            </button>
          </div>
        </div>
      </Section>
    </>
  )
}
