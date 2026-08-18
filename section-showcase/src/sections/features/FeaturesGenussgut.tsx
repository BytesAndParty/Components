import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Genussgut — Rhythmus durch großflächige Farbfelder statt durch Karten:
 * Aprikose, Petrol, Creme laufen über die volle Breite, die Typo-Farbe kippt
 * mit dem Feld. Jeder Block ist ein Satz aus kursivem Serif-Kicker und großer
 * Kleinschreib-Grotesk, daneben ein 3:4-Hochformat. Kein Container-Rand, keine
 * Versalien — Abgrenzung zu FeaturesV6/V8, die mit Serif-Headlines,
 * gesperrten Versalien-Labels und Karten-Triptychen arbeiten.
 */

const IMAGES = {
  lagen: 'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=1200&q=80',
  keller: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80',
  tafel: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80',
}

export function FeaturesGenussgut() {
  return (
    <div className="w-full">
      {/* ── Feld 01 · Aprikose ─────────────────────────────────────────────
          Petrol-Typo auf Aprikose (5,6:1). Auf dieser Fläche steht Fließtext
          in vollem Petrol statt in einer aufgehellten Variante — Aprikose
          frisst Kontrast schneller als Creme. */}
      <section className="w-full bg-[#f9bc88] px-6 py-20 sm:py-24 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-[100rem] grid-cols-1 gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-20">
          <div>
            <BlurFade delay={80} direction="down">
              <span className="block text-[11px] tracking-[0.3em] text-[#204c52]">01 · unsere lagen</span>
            </BlurFade>
            <BlurFade delay={200} direction="up">
              <p className="font-display mt-10 text-[clamp(1.6rem,3.6vw,2.75rem)] leading-[1.02] font-light text-[#204c52] italic">
                unser boden
              </p>
            </BlurFade>
            <BlurFade delay={320} direction="up">
              <h2 className="mt-1 text-[clamp(2rem,5.4vw,4.25rem)] leading-[0.98] font-medium tracking-[-0.03em] text-[#204c52]">
                ist urgestein, sieben
                <br />
                mal steil und sieben
                <br />
                mal anders.
              </h2>
            </BlurFade>
            <BlurFade delay={460} direction="up">
              <p className="mt-8 max-w-lg text-base leading-relaxed text-[#204c52]">
                loibenberg, kreutles, pfaffenberg, steinriegl, höhereck — jede ried
                bringt ihren eigenen ton mit. wir sortieren sie nicht um, wir hören zu.
              </p>
            </BlurFade>
            <BlurFade delay={580} direction="up">
              <a
                href="/rieden"
                className="mt-10 inline-flex min-h-11 items-center justify-center rounded-full border-[1.5px] border-[#204c52] px-8 text-sm tracking-[0.14em] text-[#204c52] transition-colors duration-300 hover:bg-[#204c52] hover:text-[#f9bc88] focus-visible:ring-2 focus-visible:ring-[#204c52] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f9bc88] focus-visible:outline-none"
              >
                die rieden ansehen
              </a>
            </BlurFade>
          </div>

          <div className="lg:justify-self-end lg:pb-2">
            <RevealImage
              src={IMAGES.lagen}
              alt="Steile Riedenterrassen über der Donau im Abendlicht"
              direction="up"
              duration={1400}
              className="aspect-3/4 w-full max-w-md"
            />
            <BlurFade delay={700} className="mt-4">
              <span className="font-display block text-sm font-light text-[#204c52] italic">
                ried loibenberg, 450 m über der donau
              </span>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ── Feld 02 · Petrol ───────────────────────────────────────────────
          Kontrast-Umkehr: Creme-Typo auf Petrol. Bild wandert nach links,
          damit zwei benachbarte Felder nie dieselbe Achse benutzen. */}
      <section className="relative w-full overflow-hidden bg-[#204c52] px-6 py-20 sm:py-24 lg:px-12 lg:py-32">
        <span
          aria-hidden="true"
          className="font-display pointer-events-none absolute -right-[6vw] -bottom-[6vw] text-[26vw] leading-none font-light tracking-tighter whitespace-nowrap text-[#f9bc88]/15 select-none"
        >
          1958
        </span>

        <div className="relative z-10 mx-auto grid max-w-[100rem] grid-cols-1 gap-12 lg:grid-cols-[1fr_1.35fr] lg:items-end lg:gap-20">
          <div className="lg:order-first">
            <RevealImage
              src={IMAGES.keller}
              alt="Holzfässer im gewölbten Keller bei gedämpftem Licht"
              direction="right"
              duration={1400}
              className="aspect-3/4 w-full max-w-md"
            />
            <BlurFade delay={700} className="mt-4">
              <span className="font-display block text-sm font-light text-[#fff3e8]/80 italic">
                gewölbekeller, zwölf meter unter dem hof
              </span>
            </BlurFade>
          </div>

          <div>
            <BlurFade delay={80} direction="down">
              <span className="block text-[11px] tracking-[0.3em] text-[#fff3e8]/80">02 · im keller</span>
            </BlurFade>
            <BlurFade delay={200} direction="up">
              <p className="font-display mt-10 text-[clamp(1.6rem,3.6vw,2.75rem)] leading-[1.02] font-light text-[#fff3e8] italic">
                unsere geduld
              </p>
            </BlurFade>
            <BlurFade delay={320} direction="up">
              <h2 className="mt-1 text-[clamp(2rem,5.4vw,4.25rem)] leading-[0.98] font-medium tracking-[-0.03em] text-[#fff3e8]">
                arbeitet bei neun grad
                <br />
                und ohne licht. wir
                <br />
                stören sie nicht.
              </h2>
            </BlurFade>
            <BlurFade delay={460} direction="up">
              <p className="mt-8 max-w-lg text-base leading-relaxed text-[#fff3e8]/80">
                achtzehn fässer je jahrgang, großes holz, kein eingriff auf zuruf.
                der keller meldet sich, wenn ein wein so weit ist — nicht umgekehrt.
              </p>
            </BlurFade>
            <BlurFade delay={580} direction="up">
              <a
                href="/keller"
                className="mt-10 inline-flex min-h-11 items-center justify-center rounded-full border-[1.5px] border-[#fff3e8] px-8 text-sm tracking-[0.14em] text-[#fff3e8] transition-colors duration-300 hover:bg-[#fff3e8] hover:text-[#204c52] focus-visible:ring-2 focus-visible:ring-[#fff3e8] focus-visible:ring-offset-4 focus-visible:ring-offset-[#204c52] focus-visible:outline-none"
              >
                in den keller schauen
              </a>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ── Feld 03 · Creme ────────────────────────────────────────────────
          Drittes Layout statt Wiederholung: die Aussage steht breit und allein,
          Bild und Daten sitzen als schmale Spalte darunter rechts. */}
      <section className="relative w-full overflow-hidden bg-[#fff3e8] px-6 py-20 sm:py-24 lg:px-12 lg:py-32">
        <span
          aria-hidden="true"
          className="font-display pointer-events-none absolute -bottom-[7vw] -left-[4vw] text-[28vw] leading-none font-light tracking-tighter whitespace-nowrap text-[#fee0c9] select-none"
        >
          tafel
        </span>

        <div className="relative z-10 mx-auto max-w-[100rem]">
          <BlurFade delay={80} direction="down">
            <span className="block text-[11px] tracking-[0.3em] text-[#204c52]/80">03 · an der tafel</span>
          </BlurFade>
          <BlurFade delay={200} direction="up">
            <p className="font-display mt-10 max-w-5xl text-[clamp(1.6rem,3.6vw,2.75rem)] leading-[1.02] font-light text-[#204c52] italic">
              unser heuriger
            </p>
          </BlurFade>
          <BlurFade delay={320} direction="up">
            <h2 className="mt-1 max-w-5xl text-[clamp(2rem,5.4vw,4.25rem)] leading-[0.98] font-medium tracking-[-0.03em] text-[#204c52]">
              ist ein langer tisch, an dem der wein nur die halbe geschichte erzählt.
            </h2>
          </BlurFade>

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div className="flex flex-col justify-between gap-10">
              <BlurFade delay={460} direction="up">
                <p className="max-w-lg text-base leading-relaxed text-[#204c52]/80">
                  freitag bis sonntag, brettljause vom hof, offener grüner veltliner
                  im viertel. verkostungen im gewölbe nach anmeldung, für vier bis
                  vierzehn personen.
                </p>
              </BlurFade>

              <BlurFade delay={560} direction="up">
                <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[#204c52]/15 pt-8 sm:grid-cols-3">
                  {[
                    ['geöffnet', 'fr – so, ab 15 uhr'],
                    ['plätze', '80 innen, 120 im hof'],
                    ['verkostung', 'ab 4 personen'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex flex-col gap-1.5">
                      <dt className="text-[10px] tracking-[0.24em] text-[#204c52]/80">{label}</dt>
                      <dd className="text-sm text-[#204c52]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </BlurFade>

              <BlurFade delay={660} direction="up">
                {/* Einziger Auftritt von Orangerot in diesem Abschnitt: als Linie
                    unter dem gerade angesteuerten Link, nie als Textfarbe. */}
                <a
                  href="/heuriger"
                  className="group inline-flex min-h-11 flex-col justify-center focus-visible:ring-2 focus-visible:ring-[#204c52] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fff3e8] focus-visible:outline-none"
                >
                  <span className="text-lg tracking-[-0.01em] text-[#204c52]">tisch reservieren</span>
                  <span
                    aria-hidden="true"
                    className="mt-1 block h-[1.5px] w-10 bg-[#d04c20] transition-all duration-500 group-hover:w-full group-focus-visible:w-full"
                  />
                </a>
              </BlurFade>
            </div>

            <div className="lg:justify-self-end">
              <RevealImage
                src={IMAGES.tafel}
                alt="Gedeckte Tafel bei Kerzenschein mit gefüllten Gläsern"
                direction="up"
                delay={200}
                duration={1400}
                className="aspect-3/4 w-full max-w-md"
              />
              <BlurFade delay={760} className="mt-4">
                <span className="font-display block text-sm font-light text-[#204c52] italic">
                  freitagabend, hofstube
                </span>
              </BlurFade>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
