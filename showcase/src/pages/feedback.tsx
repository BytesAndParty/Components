import { useState } from 'react'
import { Section } from '../components/section'
import { useToast } from '@components/toast/toast'
import { PricingInteraction } from '@components/pricing-interaction/pricing-interaction'
import { Rating } from '@components/rating/rating'
import { ConfettiButton, ConfettiRain } from '@components/confetti/confetti'
import { HeartLike } from '@components/heart-like/heart-like'
import { BounceLoader } from '@components/bounce-loader/bounce-loader'
import { Countdown } from '@components/countdown/countdown'
import { NumberTicker } from '@components/number-ticker/number-ticker'
import { CircularProgress } from '@components/circular-progress/circular-progress'

function ToastDemoButtons() {
  const { add } = useToast()
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => add({ title: 'Success', description: 'Action completed successfully.', variant: 'success' })}
        className="px-3.5 py-1.5 rounded-md border border-border bg-card text-foreground text-[0.8125rem] cursor-pointer transition-colors hover:bg-white/5 active:scale-95"
      >
        Show Toast
      </button>
    </div>
  )
}

function NumberTickerDemo() {
  const [count, setCount] = useState(128)
  return (
    <div className="flex items-center gap-8">
      <span className="text-5xl font-bold tabular-nums text-foreground">
        <NumberTicker value={count} duration={700} />
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => setCount(v => v + 1)}
          className="w-9 h-9 rounded-lg border border-border bg-card text-foreground text-lg font-medium hover:bg-white/5 transition flex items-center justify-center"
        >
          +
        </button>
        <button
          onClick={() => setCount(Math.floor(Math.random() * 999) + 1)}
          className="px-3 h-9 rounded-lg border border-border bg-card text-foreground text-sm hover:bg-white/5 transition"
        >
          Random
        </button>
      </div>
    </div>
  )
}

function CircularProgressDemo() {
  const [progress, setProgress] = useState(65)
  return (
    <div className="flex items-center gap-8">
      <CircularProgress value={progress} size={100} strokeWidth={8}>
        <span className="text-sm font-semibold text-foreground">{progress}%</span>
      </CircularProgress>
      <input
        type="range"
        min={0}
        max={100}
        value={progress}
        onChange={e => setProgress(Number(e.target.value))}
        style={{ width: '160px', accentColor: 'var(--accent)' }}
      />
    </div>
  )
}

export function FeedbackPage() {
  const [raining, setRaining] = useState(false)
  // Urlaub am 14. September 2026
  const [countdownTarget] = useState(() => new Date('2026-09-14T00:00:00').getTime())

  return (
    <>
      <Section title="NumberTicker" description="Animated roll-digit counter for values, scores or badges.">
        <NumberTickerDemo />
      </Section>

      <Section title="CircularProgress" description="SVG-based progress indicator with smooth transitions.">
        <CircularProgressDemo />
      </Section>

      <Section title="Toast" description="Stacked notifications with swipe-to-dismiss and enter/exit animations.">
        <ToastDemoButtons />
      </Section>

      <Section title="PricingInteraction" description="Shipping method selector with smooth number transitions.">
        <PricingInteraction
          periodLabels={['National', 'International']}
          periodMultiplier={2.5}
          currency="EUR"
          priceSuffix=""
          ctaLabel="Weiter zur Kasse"
          options={[
            { label: 'Standard', description: '5-7 Werktage', price: 4.99 },
            { label: 'Express', description: '2-3 Werktage', price: 9.99, badge: 'Beliebt' },
          ]}
        />
      </Section>

      <Section title="Rating" description="Star rating component with hover preview and pop animation.">
        <Rating size={28} defaultValue={4} activeColor="#f59e0b" />
      </Section>

      <Section title="HeartLike" description="Favorite heart with pop-in fill and spark burst.">
        <div className="flex items-center gap-6">
          <HeartLike size={48} />
          <HeartLike size={48} defaultChecked />
        </div>
      </Section>

      <Section title="BounceLoader" description="Three bouncing dots with squish-on-impact animation.">
        <BounceLoader />
      </Section>

      <Section title="Countdown" description="Rolling-digit timer with high-precision CSS animations.">
        <Countdown target={countdownTarget} size="lg" />
      </Section>

      <Section title="Confetti" description="Fullscreen particle bursts triggered by interactions.">
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
            Burst Confetti
          </ConfettiButton>
          <button
            onClick={() => setRaining(true)}
            disabled={raining}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--card)',
              color: 'var(--foreground)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: raining ? 'default' : 'pointer',
              fontFamily: 'inherit',
              opacity: raining ? 0.6 : 1,
            }}
          >
            Rain Confetti
          </button>
          <ConfettiRain
            active={raining}
            particleCount={500}
            onComplete={() => setRaining(false)}
          />
        </div>
      </Section>
    </>
  )
}
