import { AuroraText } from '@components/aurora-text/aurora-text'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { MagneticButton } from '@components/magnetic-button/magnetic-button'

export function CTAV1() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="bg-card border-border relative isolate overflow-hidden rounded-3xl border px-6 py-24 shadow-2xl sm:px-24 xl:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <BlurFade delay={100}>
              <h2 className="font-display text-foreground text-4xl font-medium tracking-tight sm:text-6xl">
                Ready for the <br />
                <AuroraText variant="gradient">Perfect Pour?</AuroraText>
              </h2>
            </BlurFade>
            
            <BlurFade delay={200}>
              <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg leading-8">
                Werden Sie Teil unserer exklusiven Community und erhalten Sie Zugang zu limitierten Editionen und privaten Tastings.
              </p>
            </BlurFade>

            <BlurFade delay={300} className="mt-10 flex items-center justify-center gap-x-6">
              <MagneticButton variant="primary" strength={0.2} className="!px-10 !py-4 !text-base">
                Jetzt Mitglied werden
              </MagneticButton>
              <a href="/mehr-erfahren" className="text-foreground hover:text-accent text-sm leading-6 font-semibold transition-colors">
                Mehr erfahren <span aria-hidden="true">→</span>
              </a>
            </BlurFade>
          </div>

          {/* Background circles */}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute top-1/2 left-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#gradient)" fillOpacity="0.1" />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="var(--accent)" />
                <stop offset={1} stopColor="var(--accent)" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  )
}
