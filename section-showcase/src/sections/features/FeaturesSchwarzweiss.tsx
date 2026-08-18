import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'
import { SCHWARZWEISS_FONTS } from '../family-fonts'

/**
 * Schwarzweiß — der Dreitakt in Reinform: schmale zentrierte Textspalte,
 * versetztes Bildraster mit gemischten Formaten (16:9 und 3:4, unterschiedliche
 * Höhen und Einzüge), dann ein ganzseitiges Serif-Zitat über die volle Breite
 * als Rhythmuswechsel. Alle Fotos entsättigt, damit die Bildstimmung eine ist.
 * Abgrenzung zu Maison/Artisanal: reines Weiß statt Cream, kein überlappendes
 * Tafel-Layout, keine Fig.-Nummern, keine vertikale Schriftleiste.
 */

const TERRASSEN = 'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=1600&q=80'
const REBZEILEN = 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1400&q=80'
const KELLER = 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1400&q=80'
const FLASCHE = 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1200&q=80'

/** Bildunterschrift: kleine Sans, mit Haarlinie darüber. */
function Caption({ children }: { children: string }) {
  return (
    <p className="mt-4 border-t border-[#000101]/20 pt-3 text-[10px] font-semibold tracking-[0.24em] text-[#5f5f5f] uppercase">
      {children}
    </p>
  )
}

export function FeaturesSchwarzweiss() {
  return (
    <section style={SCHWARZWEISS_FONTS} className="w-full bg-[#ffffff] px-6 py-20 sm:px-10 sm:py-28 lg:px-16 lg:py-36">
      {/* Erster Takt — schmale zentrierte Textspalte. */}
      <div className="mx-auto max-w-2xl text-center">
        <BlurFade delay={0} direction="up">
          <span className="block text-[10px] font-semibold tracking-[0.4em] text-[#5f5f5f] uppercase">
            Der Betrieb
          </span>
        </BlurFade>
        <BlurFade delay={120} direction="up">
          <h2 className="font-display mt-7 text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] font-light tracking-tight text-[#000101]">
            Zwischen Terrasse
            <br />
            und Keller liegt
            <br />
            ein ganzes Jahr.
          </h2>
        </BlurFade>
        <BlurFade delay={260} direction="up">
          <p className="mx-auto mt-10 max-w-lg text-[17px] leading-[2] text-[#5f5f5f]">
            Achtzehn Hektar in Steillage, dazu drei Parzellen in der
            Thermenregion. Gearbeitet wird von Hand, weil zwischen den Zeilen
            kein Traktor Platz hat — und weil man mit der Hand merkt, was eine
            Maschine übersieht.
          </p>
        </BlurFade>
      </div>

      {/* Zweiter Takt — versetztes Raster, bewusst nicht gleichförmig. */}
      <div className="mx-auto mt-20 max-w-6xl sm:mt-28">
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-1">
            <RevealImage
              src={TERRASSEN}
              alt="Terrassierte Rebhänge über der Donau im Oktoberlicht"
              direction="up"
              duration={1400}
              className="aspect-16/9 w-full"
              imgClassName="grayscale"
            />
            <Caption>Ried Loibenberg — Terrassen, Oktober</Caption>
          </div>

          <div className="md:col-span-4 md:col-start-9 md:mt-40">
            <RevealImage
              src={REBZEILEN}
              alt="Enge Rebzeilen im Morgennebel, Blick den Hang hinauf"
              direction="up"
              delay={200}
              duration={1400}
              className="aspect-3/4 w-full"
              imgClassName="grayscale"
            />
            <Caption>Ried Kreutles — Rebzeilen im Nebel</Caption>
          </div>

          <div className="md:col-span-4 md:col-start-2 md:mt-4">
            <RevealImage
              src={KELLER}
              alt="Holzfässer in der dritten Reihe des Gewölbekellers"
              direction="up"
              duration={1400}
              className="aspect-3/4 w-full"
              imgClassName="grayscale"
            />
            <Caption>Gewölbekeller — dritte Fassreihe</Caption>
          </div>

          <div className="md:col-span-5 md:col-start-7 md:mt-32">
            <BlurFade delay={100} direction="up">
              <p className="text-[17px] leading-[2] text-[#5f5f5f]">
                Im Keller passiert wenig. Spontane Gärung, langes Hefelager,
                kein Schönen, keine Korrektur. Was der Jahrgang nicht hergibt,
                holen wir auch später nicht mehr heraus — und was er hergibt,
                braucht vor allem Zeit und eine kühle Wand.
              </p>
              <p className="mt-8 text-[17px] leading-[2] text-[#5f5f5f]">
                Gefüllt wird, wenn der Wein so weit ist. In manchen Jahren im
                März, in anderen erst im Herbst darauf.
              </p>
            </BlurFade>
          </div>
        </div>
      </div>

      {/* Dritter Takt — ganzseitiges Serif-Zitat über die volle Breite. */}
      <div className="mt-24 border-y border-[#000101] py-20 sm:mt-32 sm:py-28 lg:py-36">
        <BlurFade delay={0} direction="up">
          <blockquote className="mx-auto max-w-5xl text-center">
            <p className="font-display text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.22] font-light tracking-tight text-[#000101]">
              „Im Weingarten entscheidet sich, was im Keller nicht mehr
              zu retten ist. Alles danach ist nur noch Geduld.“
            </p>
            <footer className="mt-10 text-[10px] font-semibold tracking-[0.32em] text-[#5f5f5f] uppercase">
              Martin Buchart — zweite Generation
            </footer>
          </blockquote>
        </BlurFade>
      </div>

      {/* Reprise — Bild und schmale Spalte, wieder versetzt. */}
      <div className="mx-auto mt-24 max-w-6xl sm:mt-32">
        <div className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-12">
          <div className="md:col-span-6 md:col-start-1">
            <RevealImage
              src={FLASCHE}
              alt="Abgefüllte Flasche vor weißer Kellermauer"
              direction="up"
              duration={1400}
              className="aspect-4/5 w-full"
              imgClassName="grayscale"
            />
            <Caption>Abfüllung — 2.400 Flaschen, von Hand etikettiert</Caption>
          </div>

          <div className="flex flex-col justify-end md:col-span-5 md:col-start-8 md:pb-16">
            <BlurFade delay={100} direction="up">
              <h3 className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.1] font-light tracking-tight text-[#000101]">
                Kein Sortiment
                <br />
                für jeden Anlass.
              </h3>
              <p className="mt-8 text-[17px] leading-[2] text-[#5f5f5f]">
                Sechs Positionen, mehr nicht. Grüner Veltliner und Riesling von
                den Terrassen, Blaufränkisch und Zweigelt aus der Thermenregion,
                dazu ein Rosé, der nur in guten Jahren entsteht.
              </p>
            </BlurFade>
            <BlurFade delay={220} direction="up" className="mt-10">
              <a
                href="/sortiment"
                className="group inline-flex min-h-11 items-center gap-5 rounded-xs text-[11px] font-semibold tracking-[0.28em] text-[#000101] uppercase focus-visible:ring-2 focus-visible:ring-[#000101] focus-visible:ring-offset-4 focus-visible:ring-offset-[#ffffff] focus-visible:outline-none"
              >
                Zum Sortiment
                <span
                  aria-hidden="true"
                  className="h-px w-10 bg-[#000101] transition-all duration-500 group-hover:w-20"
                />
              </a>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  )
}
