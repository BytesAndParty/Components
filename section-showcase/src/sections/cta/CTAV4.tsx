import { BlurFade } from '@components/blur-fade/blur-fade'
import { ShinyText } from '@components/shiny-text/shiny-text'

/**
 * Die Karte — Domaine Privée CTA as a letterpress invitation: double
 * hairline frame, centered serif, engraved date/place columns and a
 * bordeaux reservation action. Reads like printed matter, not like UI.
 */
export function CTAV4() {
  return (
    <section className="bg-[#f6f3ec] px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-3xl">
        <BlurFade delay={100} direction="up">
          {/* Outer frame + inner hairline = letterpress double rule */}
          <div className="border border-[#ddd5c4] bg-[#fbf9f3] p-2.5 shadow-[0_32px_64px_-40px_rgba(34,27,22,0.3)]">
            <div className="border border-[#ddd5c4] px-8 py-14 text-center sm:px-16 sm:py-18">
              <BlurFade delay={250} direction="up">
                <span className="font-display mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#ddd5c4] text-lg font-light text-[#5c2331] italic">
                  D
                </span>
              </BlurFade>

              <BlurFade delay={350} direction="up">
                <span className="mt-8 block text-[10px] font-bold tracking-[0.4em] text-[#8a8070] uppercase">
                  Auf persönliche Einladung
                </span>
              </BlurFade>

              <BlurFade delay={450} direction="up">
                <h2 className="font-display mt-6 text-4xl leading-[1.08] font-light tracking-tight text-[#221b16] sm:text-5xl">
                  Eine Degustation
                  <br />
                  im <span className="italic text-[#5c2331]">Kellergewölbe.</span>
                </h2>
              </BlurFade>

              <BlurFade delay={550} direction="up">
                <p className="mx-auto mt-7 max-w-md text-base leading-relaxed font-light text-[#6f6657]">
                  Sechs Weine, drei Jahrzehnte, ein Tisch aus Fassdauben.
                  Der Kellermeister öffnet, was der Handel nie sehen wird.
                </p>
              </BlurFade>

              {/* Engraved date/place columns */}
              <BlurFade delay={650} direction="up">
                <div className="mx-auto mt-11 grid max-w-md grid-cols-2 divide-x divide-[#ddd5c4] border-y border-[#ddd5c4]">
                  <div className="px-4 py-5">
                    <span className="block text-[9px] font-bold tracking-[0.3em] text-[#a89e8a] uppercase">Wann</span>
                    <span className="font-display mt-1.5 block text-lg font-light text-[#221b16] italic">
                      Freitags, 18 Uhr
                    </span>
                  </div>
                  <div className="px-4 py-5">
                    <span className="block text-[9px] font-bold tracking-[0.3em] text-[#a89e8a] uppercase">Wo</span>
                    <span className="font-display mt-1.5 block text-lg font-light text-[#221b16] italic">
                      Gewölbe, Kellergasse 7
                    </span>
                  </div>
                </div>
              </BlurFade>

              <BlurFade delay={750} direction="up">
                <div className="mt-11 flex flex-col items-center gap-6">
                  <a
                    href="/degustation"
                    className="inline-flex min-h-11 items-center bg-[#5c2331] px-11 py-3.5 text-xs font-bold tracking-[0.25em] text-[#f6f3ec] uppercase transition-all duration-300 hover:bg-[#471a26] hover:shadow-[0_12px_32px_-12px_rgba(92,35,49,0.5)] focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf9f3] focus-visible:outline-none"
                  >
                    Platz reservieren
                  </a>
                  <ShinyText
                    duration={9}
                    shineColor="oklch(0.78 0.08 85 / 0.5)"
                    className="font-display text-sm font-light text-[#8a8070]! italic"
                  >
                    Limitiert auf zwölf Gäste je Abend — u. A. w. g.
                  </ShinyText>
                </div>
              </BlurFade>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
