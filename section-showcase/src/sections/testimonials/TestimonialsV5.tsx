import { BlurFade } from '@components/blur-fade/blur-fade'

/**
 * Livre d'Or — Domaine Privée testimonials as an opened guestbook:
 * paper spread with a center fold hairline, one lead voice on the left
 * page, two quiet entries on the right, italic signatures and page
 * numbers like printed matter.
 */
export function TestimonialsV5() {
  return (
    <section className="bg-[#f6f3ec] px-6 py-28 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <BlurFade delay={100} direction="down">
            <span className="mb-5 block text-[10px] font-bold tracking-[0.4em] text-[#8a8070] uppercase">
              Livre d’Or · Stimmen aus dem Gewölbe
            </span>
          </BlurFade>
          <BlurFade delay={220} direction="up">
            <h2 className="font-display text-5xl leading-[1.02] font-light tracking-tight text-[#221b16] sm:text-6xl">
              Was Gäste
              <br />
              <span className="italic text-[#5c2331]">eintragen.</span>
            </h2>
          </BlurFade>
        </div>

        {/* The opened book */}
        <BlurFade delay={400} direction="up">
          <div className="mt-20 border border-[#ddd5c4] bg-[#fbf9f3] shadow-[0_40px_80px_-48px_rgba(34,27,22,0.35)]">
            <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-[#ddd5c4]">
              {/* Left page — lead voice */}
              <div className="flex flex-col px-8 py-12 sm:px-12 sm:py-16">
                <span
                  aria-hidden="true"
                  className="font-display -mb-8 text-[7rem] leading-none font-light text-[#5c2331]/15 select-none"
                >
                  „
                </span>
                <blockquote className="relative">
                  <p className="font-display text-2xl leading-snug font-light tracking-tight text-[#221b16] sm:text-[1.75rem]">
                    Ich habe in dreißig Jahren als Sommelière selten einen Riesling
                    getrunken, der so wenig beweisen will — und so viel beweist.
                    Man schmeckt, dass hier niemand in Eile ist.
                  </p>
                  <footer className="mt-9">
                    <p className="font-display text-lg font-light text-[#5c2331] italic">Marie Aubert</p>
                    <p className="mt-1 text-[9px] font-bold tracking-[0.3em] text-[#a89e8a] uppercase">
                      Sommelière · Restaurant Steirereck, Wien
                    </p>
                  </footer>
                </blockquote>
                <div className="mt-auto flex items-baseline justify-between border-t border-[#ddd5c4]/70 pt-6">
                  <span className="text-[9px] font-bold tracking-[0.3em] text-[#a89e8a] uppercase">
                    Eintrag · Oktober 2025
                  </span>
                  <span className="font-display text-xs font-light text-[#a89e8a] italic">12</span>
                </div>
              </div>

              {/* Right page — two quiet entries */}
              <div className="flex flex-col border-t border-[#ddd5c4] md:border-t-0">
                <div className="flex-1 px-8 py-12 sm:px-12 sm:py-14">
                  <blockquote>
                    <p className="font-display text-lg leading-relaxed font-light text-[#4d4436] italic">
                      „Der Steinriegl 2019 hat an unserem Hochzeitstisch mehr
                      Gesprächsstoff geliefert als die Verwandtschaft.“
                    </p>
                    <footer className="mt-6">
                      <p className="font-display text-base font-light text-[#5c2331] italic">Familie Leitner</p>
                      <p className="mt-1 text-[9px] font-bold tracking-[0.3em] text-[#a89e8a] uppercase">
                        Cercle Privé seit 2016
                      </p>
                    </footer>
                  </blockquote>
                </div>

                <div aria-hidden="true" className="mx-8 h-px bg-[#ddd5c4]/70 sm:mx-12" />

                <div className="flex-1 px-8 py-12 sm:px-12 sm:py-14">
                  <blockquote>
                    <p className="font-display text-lg leading-relaxed font-light text-[#4d4436] italic">
                      „96 Punkte — und die stille Gewissheit, dass dieses Haus
                      auch ohne uns Kritiker genau so weitermachen würde.“
                    </p>
                    <footer className="mt-6">
                      <p className="font-display text-base font-light text-[#5c2331] italic">Falstaff Magazin</p>
                      <p className="mt-1 text-[9px] font-bold tracking-[0.3em] text-[#a89e8a] uppercase">
                        Jahrgangsverkostung 2024
                      </p>
                    </footer>
                  </blockquote>
                </div>

                <div className="flex items-baseline justify-between border-t border-[#ddd5c4]/70 px-8 pt-6 pb-12 sm:px-12">
                  <span className="font-display text-xs font-light text-[#a89e8a] italic">13</span>
                  <span className="text-[9px] font-bold tracking-[0.3em] text-[#a89e8a] uppercase">
                    Domaine Privée
                  </span>
                </div>
              </div>
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={700}>
          <p className="mt-12 text-center font-display text-sm font-light text-[#8a8070] italic">
            Das Buch liegt im Gewölbe auf — der nächste Eintrag könnte Ihrer sein.
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
