import { Section } from '../components/section'
import { ToastProvider, useToast } from '@components/toast/toast'
import { HeartFavorite } from '@components/heart-favorite/heart-favorite'
import { PricingInteraction } from '@components/pricing-interaction/pricing-interaction'

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
    </>
  )
}
