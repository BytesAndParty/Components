import { useState } from 'react'
import { Section } from '../components/section'
import { ToastProvider, useToast } from '../components/toast'
import { PricingInteraction } from '@components/pricing-interaction/pricing-interaction'
import { Rating } from '../components/rating'
import { ConfettiButton, ConfettiRain } from '@components/confetti/confetti'
import { HeartLike } from '@components/heart-like/heart-like'
import { BounceLoader } from '@components/bounce-loader/bounce-loader'
import { Countdown } from '@components/countdown/countdown'
import { NumberTicker } from '@components/number-ticker/number-ticker'
import { CircularProgress } from '@components/circular-progress/circular-progress'
import { CartIcon } from '../components/cart-icon'

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

function NumberTickerDemo() {
  const [count, setCount] = useState(0)
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Standalone – Slot-Machine-Rollen</p>
        <div className="flex items-center gap-8">
          <span className="text-5xl font-bold tabular-nums text-foreground">
            <NumberTicker value={count} duration={700} />
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCount(v => Math.max(0, v - 1))}
              className="w-9 h-9 rounded-lg border border-border bg-card text-foreground text-lg font-medium hover:bg-white/5 transition flex items-center justify-center"
            >
              −
            </button>
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
      </div>

      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">CartIcon – Badge mit NumberTicker-Integration</p>
        <div className="flex items-center gap-6">
          <CartIcon count={count} size={28} />
          <p className="text-xs text-muted-foreground">Badge rollt mit dem Counter oben</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Trust-Counter (statisch)</p>
        <div className="flex gap-8">
          {[
            { value: 1847, label: 'zufriedene Kunden' },
            { value: 312, label: 'Weine im Sortiment' },
            { value: 24, label: 'Winzer-Partner' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold text-foreground">
                <NumberTicker value={value} duration={1200} />
                <span className="text-accent">+</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CircularProgressDemo() {
  const [progress, setProgress] = useState(65)
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Interaktiv</p>
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
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Größen &amp; Farben</p>
        <div className="flex items-end gap-8">
          <CircularProgress value={75} size={60} strokeWidth={5}>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--foreground)' }}>75%</span>
          </CircularProgress>
          <CircularProgress value={40} size={90} strokeWidth={7} color="#f43f5e">
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)' }}>40%</span>
          </CircularProgress>
          <CircularProgress value={90} size={120} strokeWidth={10} color="#10b981">
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--foreground)' }}>90%</span>
          </CircularProgress>
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Checkout-Stepper-Kontext</p>
        <div className="flex items-center gap-6">
          {['Warenkorb', 'Lieferung', 'Zahlung', 'Bestätigung'].map((step, i) => (
            <div key={step} className="flex flex-col items-center gap-2">
              <CircularProgress value={(i + 1) * 25} size={56} strokeWidth={5} color={i < 3 ? 'var(--accent)' : '#10b981'}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--foreground)' }}>{i + 1}</span>
              </CircularProgress>
              <p className="text-xs text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FeedbackPage() {
  const [raining, setRaining] = useState(false)

  return (
    <>
      <Section title="NumberTicker" description="Slot-Machine-Rollen pro Ziffer via CSS translateY – kein Framer Motion. Integriert im CartIcon-Badge.">
        <NumberTickerDemo />
      </Section>

      <Section title="CircularProgress" description="SVG-Kreis-Fortschrittsanzeige via strokeDashoffset-Transition. Use-Cases: Stepper, Upload, Bestellstatus.">
        <CircularProgressDemo />
      </Section>

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

      <Section title="Countdown" description="Rolling-digit countdown via @property + CSS translate — smooth, accessible, tabular-num safe.">
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Großer Countdown (48 h voraus)</p>
            <Countdown target={Date.now() + 1000 * 60 * 60 * 48} size="lg" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Nur Stunden/Min/Sek (hideLeadingZeros)</p>
            <Countdown target={Date.now() + 1000 * 60 * 45} hideLeadingZeros size="md" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Transparent + englische Labels</p>
            <Countdown
              target={Date.now() + 1000 * 60 * 3 + 27 * 1000}
              hideLeadingZeros
              size="sm"
              transparent
              labels={{ minutes: 'Min', seconds: 'Sec' }}
            />
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
