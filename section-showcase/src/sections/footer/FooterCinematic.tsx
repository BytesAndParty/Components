import { Particles } from '@components/particles/particles'
import { ShinyText } from '@components/shiny-text/shiny-text'

/**
 * Cinematic Atmosphere — Fotografie im Hintergrund statt FooterV3s reinem
 * Zinc-Ton, Partikel treiben durch, Ghost-Wortmark trägt ShinyText.
 * Newsletter-Feld wie in FooterV2, aber auf dunkler Fläche.
 */
export function FooterCinematic() {
  return (
    <footer className="relative overflow-hidden bg-zinc-950 text-zinc-300">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1600&q=80"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-20 saturate-[1.1]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-zinc-950/60 via-zinc-950/85 to-zinc-950" />
      </div>

      <Particles
        particleColors={['#fff', 'var(--accent-lifted)']}
        particleCount={50}
        speed={0.05}
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-20 px-6 pt-16 pb-10 sm:pt-28 lg:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <span className="text-[10px] font-bold tracking-[0.4em] text-accent-lifted uppercase">
              Weingut · seit 1958
            </span>
            <p className="font-display max-w-xs text-2xl leading-snug font-medium tracking-tight text-white">
              Kommen Sie, bevor der{' '}
              <ShinyText duration={9} shineColor="color-mix(in oklch, var(--accent) 65%, white)">Nebel</ShinyText>{' '}
              geht.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
              Besuch
            </span>
            <address className="text-sm leading-relaxed text-zinc-300 not-italic">
              Kellergasse 58<br />
              3601 Dürnstein<br />
              Wachau, Österreich
            </address>
            <div className="flex flex-col text-sm text-zinc-300">
              <a href="tel:+43271155800" className="inline-flex min-h-11 items-center transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-accent-lifted/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none">+43 2711 55 800</a>
              <a href="mailto:hallo@buchart58.at" className="inline-flex min-h-11 items-center transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-accent-lifted/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none">hallo@buchart58.at</a>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
              Notiz erhalten
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
              Drei Briefe pro Jahr. Neue Jahrgänge, offene Abende, Nebel über der Terrasse.
            </p>
            <form className="flex flex-col gap-3" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="ihre@adresse.at"
                aria-label="E-Mail-Adresse"
                className="min-h-11 border-b border-white/20 bg-transparent pb-2 text-sm text-white placeholder:text-zinc-400 focus:border-accent-lifted focus-visible:ring-2 focus-visible:ring-accent-lifted/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none"
              />
              <button
                type="submit"
                className="inline-flex min-h-11 items-center self-start text-[11px] font-bold tracking-[0.3em] text-accent-lifted uppercase transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-accent-lifted/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none"
              >
                Eintragen →
              </button>
            </form>
          </div>
        </div>

        {/* Ghost wordmark */}
        <div
          aria-hidden="true"
          className="font-display text-center text-[clamp(4rem,16vw,12rem)] leading-none font-medium tracking-tighter text-white/[0.06] select-none"
        >
          Buchart°58
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-8 text-[11px] tracking-wider text-zinc-400 uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Buchart°58 · Familienbetrieb</span>
          <div className="flex gap-4">
            <a href="/impressum" className="inline-flex min-h-11 items-center px-1 hover:text-zinc-300 focus-visible:ring-2 focus-visible:ring-accent-lifted/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none">Impressum</a>
            <a href="/datenschutz" className="inline-flex min-h-11 items-center px-1 hover:text-zinc-300 focus-visible:ring-2 focus-visible:ring-accent-lifted/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none">Datenschutz</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
