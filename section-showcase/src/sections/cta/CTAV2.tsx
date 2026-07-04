import { BlurFade } from '@components/blur-fade/blur-fade'
import { MagneticButton } from '@components/magnetic-button/magnetic-button'
import { AuroraText } from '@components/aurora-text/aurora-text'

export function CTAV2() {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-40">
      {/* Subtle Aurora Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
        <AuroraText 
          colors={['#000', '#222', '#444']} 
          speed={0.4} 
          className="text-[30rem] font-bold tracking-tighter"
        >
          JOIN US
        </AuroraText>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <BlurFade delay={100}>
          <span className="mb-8 block text-[11px] font-bold tracking-[0.4em] text-muted-foreground uppercase">
            Exklusiver Zugang
          </span>
        </BlurFade>
        
        <BlurFade delay={200}>
          <h2 className="font-display mb-12 text-7xl leading-none font-light tracking-tight text-foreground lg:text-8xl">
            Werde Teil der <br />
            <span className="italic">Familie.</span>
          </h2>
        </BlurFade>

        <BlurFade delay={300}>
          <p className="mx-auto mb-16 max-w-xl text-xl leading-relaxed font-light text-muted-foreground">
            Erhalten Sie Einladungen zu unseren privaten Keller-Tastings und sichern Sie sich Vorabzugriff auf limitierte Sonderfüllungen.
          </p>
        </BlurFade>

        <BlurFade delay={400} className="flex flex-col items-center justify-center gap-10 sm:flex-row">
          <MagneticButton 
            variant="default" 
            className="rounded-none! bg-foreground! px-16! py-6! text-lg! text-background! shadow-2xl transition-all hover:bg-foreground/90!"
          >
            Jetzt Registrieren
          </MagneticButton>
          <a href="/versprechen" className="inline-flex min-h-11 items-center border-b border-border pb-1 text-sm font-bold tracking-[0.2em] uppercase transition-colors hover:border-foreground">
            Unser Versprechen
          </a>
        </BlurFade>
      </div>
    </section>
  )
}
