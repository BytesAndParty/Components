import { useState } from 'react'
import { Section } from '../components/section'
import { useToast } from '@components/toast/toast-context'
import { SplashCursor } from '@components/splash-cursor/splash-cursor'
import { SparklesText } from '@components/sparkles-text/sparkles-text'
import { TextScramble } from '@components/text-scramble/text-scramble'
import { GooeyInput } from '@components/gooey-input/gooey-input'
import { ClickSpark } from '@components/click-spark/click-spark'
import {
  SunIcon, MoonIcon, CloudIcon, RainIcon, HeavyRainIcon, SnowIcon,
  ThunderIcon, WindIcon, FogIcon, PartlyCloudyIcon, SunriseIcon, RainbowIcon,
} from '@components/animated-weather-icons/animated-weather-icons'

export function LaborPage() {
  const [splashOn, setSplashOn] = useState(false)
  const { add } = useToast()

  return (
    <>
      <header className="mb-10">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Labor</h1>
        <p className="text-muted-foreground text-sm">
          Verspielte Effekte zum Ausprobieren. Sie bleiben in der Bibliothek, sind aber bewusst nicht für den Shop gedacht.
        </p>
      </header>

      <Section
        title="SplashCursor"
        description="Fullscreen WebGL fluid-simulation cursor effect. Toggle to test — performance-kritisch auf Mobile."
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSplashOn((v) => !v)}
            className="border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground rounded-md border px-4 py-2 text-sm font-medium transition"
          >
            {splashOn ? 'Stop splash cursor' : 'Start splash cursor'}
          </button>
          <p className="text-muted-foreground text-xs">
            {splashOn
              ? 'Move the cursor anywhere on the page — the fluid reacts globally.'
              : 'Click to activate the fullscreen fluid simulation overlay.'}
          </p>
        </div>
        {splashOn && (
          <SplashCursor
            SIM_RESOLUTION={128}
            DYE_RESOLUTION={1024}
            SPLAT_RADIUS={0.2}
            SPLAT_FORCE={6000}
            CURL={3}
          />
        )}
      </Section>

      <Section title="SparklesText" description="Text with animated sparkle particles floating around it.">
        <div className="flex flex-col gap-6">
          <div className="text-4xl font-bold tracking-tight">
            <SparklesText>Premium Weine</SparklesText>
          </div>
          <div className="text-2xl font-semibold">
            <SparklesText sparkleColor="#f59e0b" sparkleCount={5} maxSize={22}>
              Gold Collection
            </SparklesText>
          </div>
        </div>
      </Section>

      <Section title="TextScramble" description="Text reveal with randomized character scramble animation." canReload>
        <div className="text-foreground font-mono text-2xl font-semibold">
          <TextScramble text="Hello, this is TextScramble!" speed={25} />
        </div>
      </Section>

      <Section title="GooeyInput" description="Icon-only circle that morphs into a full input via SVG-goo filter.">
        <div className="border-border bg-card flex flex-col gap-6 rounded-xl border p-10">
          <GooeyInput
            placeholder="Weine durchsuchen..."
            onSubmit={(v) => add({ title: 'Suche gestartet', description: `Suchen nach: "${v}"`, variant: 'default' })}
          />
          <p className="text-muted-foreground text-[0.7rem]">Esc zum Schließen · Enter zum Absenden</p>
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
          <p className="text-foreground pointer-events-none font-medium select-none">
            Click anywhere in this box
          </p>
        </ClickSpark>
      </Section>

      <Section title="AnimatedWeatherIcons" description="12 animated SVG weather icons with framer-motion.">
        <div className="border-border bg-card grid grid-cols-6 gap-4 rounded-xl border p-6 shadow-sm">
          {([
            ['Sun', SunIcon], ['Moon', MoonIcon], ['Cloud', CloudIcon],
            ['Rain', RainIcon], ['Heavy Rain', HeavyRainIcon], ['Snow', SnowIcon],
            ['Thunder', ThunderIcon], ['Wind', WindIcon], ['Fog', FogIcon],
            ['Partly Cloudy', PartlyCloudyIcon], ['Sunrise', SunriseIcon], ['Rainbow', RainbowIcon],
          ] as const).map(([label, Icon]) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <Icon size={40} />
              <span className="text-muted-foreground text-center text-[0.625rem] leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
