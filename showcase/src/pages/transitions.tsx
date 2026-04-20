import { useState } from 'react'
import { Section } from '../components/section'
import {
  runViewTransition,
  TransitionStage,
  VT_PRESETS,
  type VtPreset,
} from '@components/view-transition/view-transition'

const SCENES = [
  {
    title: 'Château Rouge 2023',
    subtitle: 'Bordeaux Blend · 14.5% vol.',
    note: 'Dichte Frucht, Eiche, Veilchen. 12 Monate im Fass.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80',
    gradient: 'linear-gradient(135deg, #4a0e1c 0%, #1a0508 100%)',
    accent: '#d4a574',
    badge: 'ROUGE',
  },
  {
    title: 'Blanc Cuvée Spéciale',
    subtitle: 'Chardonnay · 13% vol.',
    note: 'Knackige Säure, Zitrus, Mineralik. Stahltank-Ausbau.',
    image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=900&q=80',
    gradient: 'linear-gradient(135deg, #f4e4bc 0%, #c9a961 100%)',
    accent: '#5d4e1a',
    badge: 'BLANC',
  },
] as const

function WineCard({ scene }: { scene: typeof SCENES[number] }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 10',
        borderRadius: 20,
        overflow: 'hidden',
        background: scene.gradient,
        boxShadow: '0 24px 64px -20px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.04) inset',
      }}
    >
      <img
        src={scene.image}
        alt={scene.title}
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.55,
          mixBlendMode: 'multiply',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,.55) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          padding: '6px 12px',
          borderRadius: 999,
          background: 'rgba(255,255,255,.12)',
          backdropFilter: 'blur(8px)',
          color: scene.accent,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.18em',
        }}
      >
        {scene.badge}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          right: 24,
          color: '#fff',
        }}
      >
        <h3
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {scene.title}
        </h3>
        <p
          style={{
            fontSize: 13,
            opacity: 0.8,
            margin: '4px 0 12px',
            letterSpacing: '0.04em',
          }}
        >
          {scene.subtitle}
        </p>
        <p
          style={{
            fontSize: 13,
            opacity: 0.72,
            margin: 0,
            maxWidth: 420,
            lineHeight: 1.5,
          }}
        >
          {scene.note}
        </p>
      </div>
    </div>
  )
}

function PresetPill({
  preset,
  active,
  onSelect,
}: {
  preset: typeof VT_PRESETS[number]
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        position: 'relative',
        padding: '10px 14px',
        borderRadius: 10,
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        background: active ? 'color-mix(in oklch, var(--accent) 12%, var(--card))' : 'var(--card)',
        color: 'var(--foreground)',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'border-color 160ms, background 160ms',
        textAlign: 'left',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
        {preset.wine && (
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: 999,
              background: 'var(--accent)',
            }}
          />
        )}
        <span>{preset.label}</span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 400 }}>
        {preset.hint}
      </div>
    </button>
  )
}

function TransitionsDemo() {
  const [preset, setPreset] = useState<VtPreset>('vt-wine-pour')
  const [idx, setIdx] = useState(0)

  function swap(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    runViewTransition(preset, () => setIdx((i) => 1 - i), {
      origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
    })
  }

  function swapAtPoint(e: React.MouseEvent<HTMLDivElement>) {
    const needsOrigin = VT_PRESETS.find((p) => p.id === preset)?.needsOrigin
    if (!needsOrigin) return
    runViewTransition(preset, () => setIdx((i) => 1 - i), {
      origin: { x: e.clientX, y: e.clientY },
    })
  }

  const needsOrigin = VT_PRESETS.find((p) => p.id === preset)?.needsOrigin

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        onClick={swapAtPoint}
        style={{ cursor: needsOrigin ? 'crosshair' : 'default' }}
        role={needsOrigin ? 'button' : undefined}
        aria-label={needsOrigin ? 'Klicke irgendwo um Transition ab Klickpunkt zu triggern' : undefined}
      >
        <TransitionStage>
          <WineCard scene={SCENES[idx]} />
        </TransitionStage>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
          Aktiv: <strong style={{ color: 'var(--foreground)' }}>
            {VT_PRESETS.find((p) => p.id === preset)?.label}
          </strong>
          {needsOrigin && ' — klick irgendwo auf die Karte'}
        </div>
        <button
          type="button"
          onClick={swap}
          style={{
            padding: '10px 18px',
            borderRadius: 10,
            border: '1px solid var(--accent)',
            background: 'var(--accent)',
            color: 'var(--accent-foreground, #fff)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}
        >
          Swap ↻
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 10,
        }}
      >
        {VT_PRESETS.map((p) => (
          <PresetPill
            key={p.id}
            preset={p}
            active={preset === p.id}
            onSelect={() => setPreset(p.id)}
          />
        ))}
      </div>
    </div>
  )
}

export function TransitionsPage() {
  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">View Transitions</h1>
        <p className="text-muted-foreground text-sm">
          CSS View Transitions API (<code>document.startViewTransition</code>) mit 5 Standard-Presets
          + 3 custom wein-inspirierten: <em>Wine Pour</em>, <em>Cork Pop</em>, <em>Grape Burst</em>.
        </p>
      </header>

      <Section
        title="Preset-Playground"
        description="Wähle ein Preset, klicke Swap. Circular Reveal und Grape Burst reagieren zusätzlich auf Klickposition auf der Karte."
      >
        <TransitionsDemo />
      </Section>

      <Section
        title="Wie es funktioniert"
        description="Die Stage trägt einen view-transition-name. Der Helper wrapped den State-Swap in startViewTransition mit types-Array; CSS selektiert via :active-view-transition-type(…)."
      >
        <pre
          style={{
            background: 'var(--muted)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 16,
            fontSize: 12,
            lineHeight: 1.6,
            overflow: 'auto',
            color: 'var(--foreground)',
          }}
        >
{`import { runViewTransition, TransitionStage } from '@components/view-transition/view-transition'

function Demo() {
  const [idx, setIdx] = useState(0)
  return (
    <>
      <TransitionStage>
        {idx === 0 ? <CardA /> : <CardB />}
      </TransitionStage>
      <button onClick={e => runViewTransition('vt-wine-pour', () => setIdx(i => 1-i), {
        origin: { x: e.clientX, y: e.clientY },
      })}>
        Pour
      </button>
    </>
  )
}`}
        </pre>
      </Section>
    </>
  )
}
