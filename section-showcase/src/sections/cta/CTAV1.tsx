import { AuroraText } from '@components/aurora-text/aurora-text'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { MagneticButton } from '@components/magnetic-button/magnetic-button'

export function CTAV1() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-card px-6 py-24 shadow-2xl rounded-3xl sm:px-24 xl:py-32 border border-border">
          <div className="mx-auto max-w-2xl text-center">
            <BlurFade delay={100}>
              <h2 className="font-display text-4xl font-medium tracking-tight text-foreground sm:text-6xl">
                Ready for the <br />
                <AuroraText variant="gradient">Perfect Pour?</AuroraText>
              </h2>
            </BlurFade>
            
            <BlurFade delay={200}>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                Werden Sie Teil unserer exklusiven Community und erhalten Sie Zugang zu limitierten Editionen und privaten Tastings.
              </p>
            </BlurFade>

            <BlurFade delay={300} className="mt-10 flex items-center justify-center gap-x-6">
              <MagneticButton variant="primary" strength={0.2} className="!px-10 !py-4 !text-base">
                Jetzt Mitglied werden
              </MagneticButton>
              <a href="#" className="text-sm font-semibold leading-6 text-foreground hover:text-accent transition-colors">
                Mehr erfahren <span aria-hidden="true">→</span>
              </a>
            </BlurFade>
          </div>

          {/* Background circles */}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
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
