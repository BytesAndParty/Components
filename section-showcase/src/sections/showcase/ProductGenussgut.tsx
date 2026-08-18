import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Genussgut — ein Wein als ruhige Warenkunde auf Creme: die Flasche steht im
 * 3:4-Hochformat auf einem Aprikose-hell-Feld, der Name daneben in großer
 * Kleinschreib-Grotesk, darüber der kursive Serif-Kicker. Notizen und Daten
 * bleiben kleine Sans-Zeilen in Petrol, der Warenkorb ist ein Outline-Button.
 * Abgrenzung zu ProductV6 (Serif-Held, überlappende Tafeln, Versalien-Fiche):
 * hier führt die Grotesk und nichts überlappt — die Fläche ordnet.
 */

const NOTIZEN: Array<[string, string]> = [
  ['nase', 'rauch über nassem stein, quitte, ein hauch weißer pfeffer'],
  ['gaumen', 'straff und salzig, mit einer mitte aus reifem apfel'],
  ['abgang', 'lang, kühl, mineralisch — kommt zweimal zurück'],
]

const DATEN: Array<[string, string]> = [
  ['riede', 'loibenberg · urgestein'],
  ['rebsorte', 'grüner veltliner'],
  ['ausbau', '18 monate, großes holz'],
  ['füllung', '2.400 flaschen'],
  ['alkohol', '13,5 % vol.'],
  ['trinkreife', '2026 – 2034'],
]

/** Orangerot hat in dieser Familie genau eine Aufgabe: den gewählten Zustand
 *  markieren. Hier ist das die Gebinde-Auswahl — als Linie, nie als Textfarbe. */
const GEBINDE = [
  { id: '1er', label: '1 flasche', price: '€ 38,—' },
  { id: '3er', label: '3er-karton', price: '€ 111,—' },
  { id: '6er', label: '6er-karton', price: '€ 216,—' },
]

export interface ProductGenussgutProps {
  onBack?: () => void
}

export function ProductGenussgut({ onBack }: ProductGenussgutProps) {
  const [gebinde, setGebinde] = useState(GEBINDE[0].id)
  const gewaehlt = GEBINDE.find((g) => g.id === gebinde) ?? GEBINDE[0]

  return (
    <section className="relative w-full overflow-hidden bg-[#fff3e8] px-6 py-16 sm:py-20 lg:px-12 lg:py-24">
      {/* Wortmarken-Wasserzeichen — angeschnitten, rein dekorativ */}
      <span
        aria-hidden="true"
        className="font-display pointer-events-none absolute -right-[6vw] -bottom-[7vw] text-[26vw] leading-none font-light tracking-tighter whitespace-nowrap text-[#fee0c9] select-none"
      >
        buchart
      </span>

      <div className="relative z-10 mx-auto max-w-[100rem]">
        {onBack && (
          <BlurFade delay={50} direction="down">
            <button
              type="button"
              onClick={onBack}
              className="group inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm tracking-[0.14em] text-[#204c52] focus-visible:ring-2 focus-visible:ring-[#204c52] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fff3e8] focus-visible:outline-none"
            >
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
              zurück zum sortiment
            </button>
          </BlurFade>
        )}

        <div className="mt-10 grid grid-cols-1 gap-14 lg:mt-14 lg:grid-cols-[0.85fr_1fr] lg:gap-24">
          {/* Flasche auf Aprikose-hell — das Farbfeld ersetzt den Rahmen */}
          <div>
            <div className="bg-[#fee0c9] p-6 sm:p-10">
              <RevealImage
                src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1200&q=80"
                alt="Flasche loibenberg smaragd 2021 vor heller Wand"
                direction="up"
                duration={1500}
                className="aspect-3/4 w-full"
              />
            </div>
            <BlurFade delay={900} className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
              <span className="font-display text-sm font-light text-[#204c52] italic">
                jahrgang 2021, handlese am 12. oktober
              </span>
              <span className="text-[11px] tracking-[0.24em] text-[#204c52]/80">0,75 l</span>
            </BlurFade>
          </div>

          {/* Aussage-Spalte */}
          <div className="flex flex-col">
            <BlurFade delay={120} direction="up">
              <p className="font-display text-[clamp(1.5rem,3.2vw,2.5rem)] leading-[1.02] font-light text-[#204c52] italic">
                aus der ried loibenberg
              </p>
            </BlurFade>
            <BlurFade delay={240} direction="up">
              <h1 className="mt-1 text-[clamp(2.25rem,5.6vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.035em] text-[#204c52]">
                loibenberg
                <br />
                smaragd 2021
              </h1>
            </BlurFade>

            <BlurFade delay={380} direction="up">
              <p className="mt-8 max-w-xl text-base leading-relaxed text-[#204c52]/80">
                alte reben auf verwittertem urgestein, dreißig jahre wurzeltiefe.
                ein wein, der erst streng wirkt und sich dann in aller ruhe öffnet.
              </p>
            </BlurFade>

            {/* Verkostungsnotizen — ruhige Sans-Zeilen, Hairlines statt Karten */}
            <BlurFade delay={500} direction="up">
              <dl className="mt-12 divide-y divide-[#204c52]/15 border-y border-[#204c52]/15">
                {NOTIZEN.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[7rem_1fr] sm:gap-6">
                    <dt className="text-[11px] tracking-[0.24em] text-[#204c52]/80">{label}</dt>
                    <dd className="text-base leading-relaxed text-[#204c52]">{value}</dd>
                  </div>
                ))}
              </dl>
            </BlurFade>

            {/* Gebinde — die einzige Auswahl der Seite, deshalb der einzige
                Ort für Orangerot. Buttons statt Select: die Zeile bleibt flach. */}
            <BlurFade delay={620} direction="up">
              <div className="mt-12">
                <span id="gebinde-label" className="block text-[11px] tracking-[0.24em] text-[#204c52]/80">
                  gebinde
                </span>
                <div role="group" aria-labelledby="gebinde-label" className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                  {GEBINDE.map((g) => {
                    const aktiv = g.id === gewaehlt.id
                    return (
                      <button
                        key={g.id}
                        type="button"
                        aria-pressed={aktiv}
                        onClick={() => setGebinde(g.id)}
                        className="group flex min-h-11 cursor-pointer flex-col justify-center focus-visible:ring-2 focus-visible:ring-[#204c52] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fff3e8] focus-visible:outline-none"
                      >
                        <span
                          className={`text-base tracking-[-0.01em] text-[#204c52] ${aktiv ? 'font-medium' : 'font-normal'}`}
                        >
                          {g.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`mt-1 block h-[1.5px] bg-[#d04c20] transition-all duration-500 ${
                            aktiv ? 'w-full opacity-100' : 'w-6 opacity-0 group-hover:w-full group-hover:opacity-60'
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={740} direction="up">
              <div className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] tracking-[0.24em] text-[#204c52]/80">ab hof</span>
                  <span className="text-3xl font-medium tracking-[-0.02em] text-[#204c52]">
                    {gewaehlt.price}
                  </span>
                </div>
                <button
                  type="button"
                  className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-[#204c52] px-9 text-sm tracking-[0.14em] text-[#204c52] transition-colors duration-300 hover:bg-[#204c52] hover:text-[#fff3e8] focus-visible:ring-2 focus-visible:ring-[#204c52] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fff3e8] focus-visible:outline-none"
                >
                  {gewaehlt.label} in den warenkorb
                </button>
              </div>
            </BlurFade>
          </div>
        </div>

        {/* Daten — breite, ruhige Basiszeile über die volle Spaltenbreite */}
        <div className="mt-24 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-[#204c52]/15 pt-10 sm:grid-cols-3 lg:mt-32 lg:grid-cols-6">
          {DATEN.map(([label, value], i) => (
            <BlurFade key={label} delay={900 + i * 90} direction="up">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] tracking-[0.24em] text-[#204c52]/80">{label}</span>
                <span className="text-sm text-[#204c52]">{value}</span>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
