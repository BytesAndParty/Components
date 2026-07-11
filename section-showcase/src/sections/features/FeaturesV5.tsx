import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Die Rieden — three terroirs as arch plates (Domaine Privée line).
 * Each Riede stands in its own Rundbogen window: roman numeral seal,
 * engraved data line, quiet hover (arch lifts, link line grows).
 */

const RIEDEN = [
  {
    numeral: 'I',
    name: 'Achleiten',
    data: 'Urgestein · 450 m · Südlage',
    text: 'Gföhler Gneis und Amphibolit. Der kargste unserer Böden zwingt die Rebe in die Tiefe — und belohnt mit rauchiger Mineralik.',
    image: 'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=900&q=80',
    alt: 'Steile Terrassen der Ried Achleiten im Abendlicht',
  },
  {
    numeral: 'II',
    name: 'Loibenberg',
    data: 'Löss über Fels · 380 m · Südost',
    text: 'Die wärmste Parzelle des Hauses. Hier reift der Veltliner zu Fülle und weißem Pfeffer, ohne seine Spannung zu verlieren.',
    image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=900&q=80',
    alt: 'Rebzeilen am Loibenberg im Morgennebel',
  },
  {
    numeral: 'III',
    name: 'Steinriegl',
    data: 'Schiefer · 420 m · Terrassen',
    text: 'Alte Reben, 1962 gepflanzt. Kleine Beeren, dicke Schalen — der Riesling von hier braucht Jahre und dankt es mit Jahrzehnten.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80',
    alt: 'Trockensteinmauern der Ried Steinriegl',
  },
]

export function FeaturesV5() {
  return (
    <section className="bg-[#f6f3ec] px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-6xl">
        {/* Header — kicker left, intro right, hairline below */}
        <div className="grid grid-cols-1 gap-8 border-b border-[#ddd5c4] pb-12 lg:grid-cols-2 lg:items-end">
          <div>
            <BlurFade delay={100} direction="up">
              <span className="mb-5 block text-[10px] font-bold tracking-[0.4em] text-[#8a8070] uppercase">
                Die Lagen
              </span>
            </BlurFade>
            <BlurFade delay={220} direction="up">
              <h2 className="font-display text-5xl leading-[1.02] font-light tracking-tight text-[#221b16] sm:text-6xl">
                Drei Rieden,
                <br />
                ein <span className="italic text-[#5c2331]">Handschrift.</span>
              </h2>
            </BlurFade>
          </div>
          <BlurFade delay={340} direction="up">
            <p className="max-w-md text-lg leading-relaxed font-light text-[#6f6657] lg:ml-auto">
              Wir besitzen keine Weingärten in der Ebene. Jede unserer Parzellen
              hängt am Berg — dort, wo Maschinen aufgeben und Hände übernehmen.
            </p>
          </BlurFade>
        </div>

        {/* Arch plates */}
        <div className="mt-16 grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {RIEDEN.map((riede, i) => (
            <BlurFade key={riede.numeral} delay={300 + i * 150} direction="up">
              <article className="group flex h-full flex-col">
                {/* Arch window with numeral seal */}
                <div className="relative transition-transform duration-500 group-hover:-translate-y-2">
                  <RevealImage
                    src={riede.image}
                    alt={riede.alt}
                    direction="up"
                    delay={i * 200}
                    duration={1400}
                    className="aspect-[3/4] w-full rounded-t-full"
                  />
                  <span
                    aria-hidden="true"
                    className="font-display absolute -bottom-5 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-[#ddd5c4] bg-[#f6f3ec] text-base font-light text-[#5c2331] italic"
                  >
                    {riede.numeral}
                  </span>
                </div>

                <div className="mt-10 flex flex-1 flex-col text-center">
                  <h3 className="font-display text-3xl font-light tracking-tight text-[#221b16]">
                    Ried <span className="italic">{riede.name}</span>
                  </h3>
                  <span className="mt-2 block text-[9px] font-bold tracking-[0.3em] text-[#a89e8a] uppercase">
                    {riede.data}
                  </span>
                  <p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed font-light text-[#6f6657]">
                    {riede.text}
                  </p>
                  <div className="mt-auto pt-7">
                    <a
                      href={`/rieden/${riede.name.toLowerCase()}`}
                      className="group/link inline-flex min-h-11 items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-[#221b16] uppercase transition-colors hover:text-[#5c2331] focus-visible:ring-2 focus-visible:ring-[#5c2331]/60 focus-visible:outline-none"
                    >
                      <span>Zur Riede</span>
                      <span aria-hidden="true" className="h-px w-6 bg-current transition-all duration-500 group-hover/link:w-12" />
                    </a>
                  </div>
                </div>
              </article>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
