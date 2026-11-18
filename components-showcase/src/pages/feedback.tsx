import { useId, useState } from 'react'
import { X } from 'lucide-react'
import { Section } from '../components/section'
import { DemoTabs } from '../components/demo-tabs'
import { VariantDemo, type VariantOption } from '../components/variant-demo'
import { useToast } from '@components/toast/toast-context'
import { PricingInteraction } from '@components/pricing-interaction/pricing-interaction'
import { ConfettiButton, ConfettiRain } from '@components/confetti/confetti'
import { HeartLike } from '@components/heart-like/heart-like'
import { Countdown } from '@components/countdown/countdown'
import { NumberTicker } from '@components/number-ticker/number-ticker'
import { CircularProgress } from '@components/circular-progress/circular-progress'
import { ProgressBar } from '@components/progress-bar/progress-bar'
import { Modal } from '@components/modal/modal'

function ToastDemoButtons() {
  const { add } = useToast()
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => add({ title: 'Success', description: 'Action completed successfully.', variant: 'success' })}
        className="border-border bg-card text-foreground cursor-pointer rounded-md border px-3.5 py-1.5 text-[0.8125rem] transition-colors hover:bg-foreground/5 active:scale-95"
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
      <span className="text-foreground text-5xl font-bold tabular-nums">
        <NumberTicker value={count} duration={700} />
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => setCount(v => v + 1)}
          className="border-border bg-card text-foreground flex h-9 w-9 items-center justify-center rounded-lg border text-lg font-medium transition hover:bg-foreground/5"
        >
          +
        </button>
        <button
          onClick={() => setCount(Math.floor(Math.random() * 999) + 1)}
          className="border-border bg-card text-foreground h-9 rounded-lg border px-3 text-sm transition hover:bg-foreground/5"
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
        <span className="text-foreground text-sm font-semibold">{progress}%</span>
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

const SEATS = 12

const PROGRESS_BAR_CASES: VariantOption<'empty' | 'full' | 'over' | 'zero-max' | 'styled'>[] = [
  { value: 'empty', label: 'leer', snippet: 'value={0}' },
  { value: 'full', label: 'voll', snippet: 'value={12} max={12}' },
  { value: 'over', label: 'über max', snippet: 'value={140} → clamped to 100' },
  { value: 'zero-max', label: 'max 0', snippet: 'value={5} max={0} → empty, no NaN' },
  { value: 'styled', label: 'Verlauf', snippet: 'className="h-3 bg-card ring-1 ring-border" · fillClassName="bg-linear-to-r from-accent to-accent-lifted"' },
]

const STEP_BUTTON = 'border-border bg-card text-foreground focus-visible:ring-accent/60 flex size-11 cursor-pointer items-center justify-center rounded-lg border text-lg font-medium transition hover:bg-foreground/5 focus-visible:ring-2 focus-visible:outline-none active:scale-95'

function ProgressBarDemo() {
  const [booked, setBooked] = useState(7)

  return (
    <div className="flex flex-col gap-10">
      <div className="max-w-md">
        <div className="mb-2 flex items-baseline justify-between gap-4 text-sm">
          <span id="progress-bar-demo-label" className="text-foreground font-medium">Kellerführung am Samstag</span>
          <span className="text-muted-foreground tabular-nums">{booked} von {SEATS} Plätzen gebucht</span>
        </div>
        <ProgressBar value={booked} max={SEATS} aria-labelledby="progress-bar-demo-label" />
        <div className="mt-4 flex gap-2">
          <button type="button" aria-label="Einen Platz weniger" onClick={() => setBooked(v => Math.max(0, v - 1))} className={STEP_BUTTON}>−</button>
          <button type="button" aria-label="Einen Platz mehr" onClick={() => setBooked(v => Math.min(SEATS, v + 1))} className={STEP_BUTTON}>+</button>
        </div>
      </div>

      <VariantDemo
        label="case"
        options={PROGRESS_BAR_CASES}
        className="min-h-16"
        render={c => (
          <div className="w-full max-w-md">
            {c === 'empty' && <ProgressBar value={0} />}
            {c === 'full' && <ProgressBar value={SEATS} max={SEATS} />}
            {c === 'over' && <ProgressBar value={140} />}
            {c === 'zero-max' && <ProgressBar value={5} max={0} />}
            {c === 'styled' && (
              <ProgressBar
                value={64}
                className="bg-card ring-border h-3 ring-1"
                fillClassName="from-accent to-accent-lifted bg-linear-to-r"
              />
            )}
          </div>
        )}
      />
    </div>
  )
}

type ModalExample = 'golden' | 'long'

const MODAL_EXAMPLES: VariantOption<ModalExample>[] = [
  { value: 'golden', label: 'Golden Path', snippet: 'open={open} onClose={…} aria-labelledby={titleId}' },
  { value: 'long', label: 'lange Inhalte', snippet: 'the card scrolls inside (max 100dvh − 2rem); close button first, so initial focus stays at the top' },
]

const STORAGE_TIPS = [
  ['Liegend lagern', 'Flaschen mit Naturkorken liegen, damit der Korken feucht bleibt und nicht austrocknet.'],
  ['Kühl und gleichmäßig', 'Gut sind etwa 10 bis 15 °C. Wichtiger als der genaue Wert ist, dass die Temperatur kaum schwankt.'],
  ['Dunkel', 'Licht, vor allem UV-Licht, lässt Wein schneller altern, besonders in hellen Flaschen.'],
  ['Nicht zu trocken', 'In sehr trockener Luft schrumpft der Korken mit der Zeit, und Luft gelangt in die Flasche.'],
  ['Ruhig', 'Ständige Erschütterungen, etwa auf dem Kühlschrank, tun dem Wein nicht gut.'],
  ['Ohne Fremdgerüche', 'Korken sind nicht völlig dicht. Neben Farbe, Heizöl oder Zwiebeln nimmt Wein mit der Zeit Gerüche an.'],
  ['Schraubverschluss', 'Flaschen mit Schraubverschluss dürfen auch stehen, ihr Verschluss trocknet nicht aus.'],
  ['Nach dem Öffnen', 'Gut verschlossen und kühl gestellt hält sich ein offener Wein einige Tage.'],
  ['Trinkreife', 'Die meisten Weine sind für den baldigen Genuss gemacht, nur wenige gewinnen über viele Jahre.'],
  ['Vor dem Servieren', 'Rotwein rechtzeitig aus dem Keller holen, Weißwein kurz in den Kühlschrank stellen.'],
] as const

const DEMO_BUTTON = 'border-border bg-card text-foreground focus-visible:ring-accent/60 min-h-11 cursor-pointer rounded-lg border px-4 text-sm font-medium transition hover:bg-foreground/5 focus-visible:ring-2 focus-visible:outline-none active:scale-95'
const PRIMARY_BUTTON = 'bg-accent text-accent-foreground focus-visible:ring-accent/60 focus-visible:ring-offset-card min-h-11 cursor-pointer rounded-lg px-4 text-sm font-medium transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95'

function ModalDemo({ example }: { example: ModalExample }) {
  const [open, setOpen] = useState(false)
  const [closedBy, setClosedBy] = useState<string>()
  const titleId = useId()

  function close(by: string) {
    setOpen(false)
    setClosedBy(by)
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className={DEMO_BUTTON}>
        {example === 'golden' ? 'Weinpaket ansehen' : 'Lagertipps lesen'}
      </button>
      <p className="text-muted-foreground text-sm">
        {closedBy ? `Zuletzt geschlossen: ${closedBy}` : 'Schließt per Button, Esc oder Klick auf den Hintergrund.'}
      </p>

      {/* onClose fires only for Esc and the backdrop; the buttons set open themselves. */}
      <Modal open={open} onClose={() => close('Esc oder Hintergrund (onClose)')} aria-labelledby={titleId}>
        {example === 'golden' ? (
          <>
            <h2 id={titleId} className="text-xl font-semibold">Weinpaket „Sommer“</h2>
            <p className="text-muted-foreground mt-2 text-sm">Sechs Flaschen für warme Abende, je zwei Weißwein, Rosé und Rotwein. Gekühlt geliefert.</p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={() => close('Button „Abbrechen“')} className={DEMO_BUTTON}>Abbrechen</button>
              <button type="button" onClick={() => close('Button „In den Warenkorb“')} className={PRIMARY_BUTTON}>In den Warenkorb</button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <h2 id={titleId} className="text-xl font-semibold">Wein richtig lagern</h2>
              <button
                type="button"
                aria-label="Schließen"
                onClick={() => close('Button „Schließen“')}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-accent/60 -mt-2 -mr-2 grid size-11 shrink-0 cursor-pointer place-items-center rounded-lg transition hover:bg-foreground/5 focus-visible:ring-2 focus-visible:outline-none active:scale-95"
              >
                <X size={18} aria-hidden />
              </button>
            </div>
            <dl className="mt-4 space-y-4 text-sm">
              {STORAGE_TIPS.map(([title, text]) => (
                <div key={title}>
                  <dt className="font-medium">{title}</dt>
                  <dd className="text-muted-foreground mt-1">{text}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </Modal>
    </div>
  )
}

/** Rendered after the inputs on the "Formulare & Feedback" route (/inputs); /feedback redirects there. */
export function FeedbackSections() {
  const [raining, setRaining] = useState(false)
  // Urlaub am 14. September 2026
  const [countdownTarget] = useState(() => new Date('2026-09-14T00:00:00').getTime())

  return (
    <>
      <Section title="NumberTicker" description="Animated roll-digit counter for values, scores or badges.">
        <NumberTickerDemo />
      </Section>

      <Section title="Progress" description="Progress indicators with smooth transitions, as a ring or as a bar.">
        <DemoTabs
          tabs={[
            {
              value: 'circularprogress',
              label: 'CircularProgress',
              content: (
                <>
                  <p className="text-muted-foreground mb-6 text-sm">SVG-based progress indicator with smooth transitions.</p>
                  <CircularProgressDemo />
                </>
              ),
            },
            {
              value: 'progressbar',
              label: 'ProgressBar',
              content: (
                <>
                  <p className="text-muted-foreground mb-6 text-sm">Linear progress with role=&quot;progressbar&quot; and any max. The fill follows each change with a width transition; with reduced motion it jumps.</p>
                  <ProgressBarDemo />
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Toast" description="Stacked notifications with swipe-to-dismiss and enter/exit animations.">
        <ToastDemoButtons />
      </Section>

      <Section title="Modal" description="Modal dialog on the native <dialog> with showModal(): top layer, focus trap, Esc and a click on the backdrop close it, focus returns to the trigger. onClose reports only dismissals the parent did not trigger. With reduced motion it opens without transition.">
        <VariantDemo label="example" options={MODAL_EXAMPLES} render={example => <ModalDemo example={example} />} />
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

      <Section title="HeartLike" description="Favorite heart with pop-in fill and spark burst.">
        <div className="flex items-center gap-6">
          <HeartLike size={48} />
          <HeartLike size={48} defaultChecked />
        </div>
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
