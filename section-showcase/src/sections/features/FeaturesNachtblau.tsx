import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'

/**
 * Nachtblau — die Rieden als selbstgezeichnete Landkarte. Eine stilisierte
 * Österreich-Kontur in Haarlinie auf Navy, vier rote Marker, daneben das
 * Datenblatt der aktiven Riede und ein Akkordeon der übrigen. Die Karte ist
 * Illustration, keine Geodatenquelle — die Information steht im Datenblatt.
 * Abgrenzung zu Nocturne (FeaturesV8): kein Triptychon aus Filmstills, keine
 * Partikel, keine Ghost-Ziffern, kein Gold. Statt Atmosphäre: ein Register,
 * das man befragen kann. Rot markiert ausschließlich das Anfassbare.
 */

interface Riede {
  id: string
  name: string
  region: string
  /** Kurzer Anriss für die eingeklappte Zeile */
  teaser: string
  soil: string
  altitude: string
  area: string
  varieties: string
  /** Serif-Absatz im Datenblatt */
  note: string
  /** Marker-Position in Prozent der Kartenfläche */
  x: number
  y: number
  /** Auf welcher Seite des Punkts das Label sitzt */
  side: 'left' | 'right'
}

const RIEDEN: Riede[] = [
  {
    id: 'loibenberg',
    name: 'Ried Loibenberg',
    region: 'Wachau · Unterloiben',
    teaser: 'Der steilste Hang im Betrieb. Einundvierzig Terrassen, die niemand mit einer Maschine erreicht.',
    soil: 'Gföhler Gneis, verwittertes Urgestein',
    altitude: '210 – 380 m',
    area: '3,4 ha · 41 Terrassen',
    varieties: 'Grüner Veltliner, Riesling',
    note: 'Am Loibenberg steht der Wein den ganzen Tag im Licht und kühlt nachts von der Donau her aus. Diese Spanne schmeckt man: straff, salzig, mit einem Rest Wärme im Nachhall.',
    x: 66.3,
    y: 26.7,
    side: 'right',
  },
  {
    id: 'kreutles',
    name: 'Ried Kreutles',
    region: 'Wachau · Dürnstein',
    teaser: 'Löss über Urgestein, flacher gelegen. Die Riede, die den Alltagswein trägt — und ihn ernst nimmt.',
    soil: 'Sandiger Löss über Urgestein',
    altitude: '190 – 240 m',
    area: '2,1 ha · 12 Parzellen',
    varieties: 'Grüner Veltliner',
    note: 'Der Löss hält Wasser, wo der Gneis keines hat. Was hier wächst, ist runder, offener, früher trinkreif — und trotzdem eindeutig Wachau.',
    x: 62,
    y: 30.7,
    side: 'right',
  },
  {
    id: 'steinriegl',
    name: 'Ried Steinriegl',
    region: 'Thermenregion · Gumpoldskirchen',
    teaser: 'Kalkschotter, kaum Feinerde. Der Steinanteil ist so hoch, dass wir die Zeilen von Hand räumen.',
    soil: 'Kalkschotter mit hohem Steinanteil',
    altitude: '230 – 290 m',
    area: '1,8 ha · 9 Parzellen',
    varieties: 'Zweigelt, Rosé',
    note: 'Steine speichern die Hitze des Tages und geben sie in der Nacht zurück. Die Rotweine von hier haben Frucht, aber keine Schwere — der Kalk hält sie aufrecht.',
    x: 78.7,
    y: 41.3,
    side: 'right',
  },
  {
    id: 'leithaberg',
    name: 'Leithaberg',
    region: 'Burgenland · Leithagebirge',
    teaser: 'Glimmerschiefer mit Kalkauflage, östliche Hanglage. Achtzehn Monate Fass, kein Tag weniger.',
    soil: 'Glimmerschiefer mit Kalkauflage',
    altitude: '180 – 320 m',
    area: '2,7 ha · 14 Parzellen',
    varieties: 'Blaufränkisch',
    note: 'Der Schiefer gibt dem Blaufränkisch seine Kante, der Kalk die Länge. Es ist die einzige Lage, die wir außerhalb der Wachau bewirtschaften — und die einzige, für die wir zwei Stunden fahren.',
    x: 86.7,
    y: 46.7,
    side: 'left',
  },
]

/** Stilisierte Kontur — Illustration, bewusst ohne Geodaten-Genauigkeit. */
const OUTLINE =
  'M 48 128 L 72 100 L 96 112 L 128 96 L 176 120 L 214 96 L 238 74 L 286 58 L 330 44 ' +
  'L 382 52 L 424 40 L 470 46 L 508 74 L 524 108 L 556 130 L 536 158 L 548 196 L 516 212 ' +
  'L 486 196 L 440 220 L 392 232 L 344 214 L 300 226 L 250 218 L 206 200 L 168 214 ' +
  'L 128 190 L 92 178 L 64 158 Z'

/** Der Fluss als zweite Haarlinie — er erklärt, warum die Nächte kalt sind. */
const RIVER = 'M 234 74 C 276 96, 318 66, 366 80 C 414 94, 452 106, 512 96'

const CUE_BASE =
  'group inline-flex min-h-11 items-center gap-4 rounded-xs text-[#ffffff] focus-visible:ring-2 focus-visible:ring-[#ffffff] focus-visible:ring-offset-4 focus-visible:outline-none'

function CueLine() {
  return (
    <span
      aria-hidden="true"
      className="h-px w-10 bg-[#ffffff]/55 transition-all duration-500 group-hover:w-20 group-hover:bg-[#c0392b] motion-reduce:transition-none"
    />
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-[#ffffff]/12 py-4 sm:flex-row sm:items-baseline sm:gap-8">
      <span className="text-[10px] font-semibold tracking-[0.28em] text-[#d9d9d9]/60 uppercase sm:w-32 sm:shrink-0">
        {label}
      </span>
      <span className="font-display text-lg leading-snug font-light text-[#ffffff]">{value}</span>
    </div>
  )
}

export function FeaturesNachtblau() {
  const [activeId, setActiveId] = useState('loibenberg')
  const [openId, setOpenId] = useState<string | null>(null)

  const active = RIEDEN.find(riede => riede.id === activeId) ?? RIEDEN[0]
  const others = RIEDEN.filter(riede => riede.id !== active.id)

  return (
    <section className="w-full bg-[#0b1420]">
      {/* Kopf — zentrierte Mitte wie die zweite Tafel des Heros, damit die
          Familie ihren Rhythmus behält, bevor der Split wieder aufmacht. */}
      <div className="px-6 py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <BlurFade delay={0} direction="up">
            <span className="block text-[10px] font-semibold tracking-[0.4em] text-[#d9d9d9] uppercase">
              Vier Lagen — Wachau, Thermenregion, Leithaberg
            </span>
          </BlurFade>
          <BlurFade delay={120} direction="up">
            <h2 className="font-display mt-8 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.03] font-light tracking-tight text-[#ffffff]">
              Wo der Wein <span className="italic">herkommt.</span>
            </h2>
          </BlurFade>
          <BlurFade delay={240} direction="up">
            <p className="font-display mx-auto mt-7 max-w-xl text-[clamp(1.0625rem,1.8vw,1.3125rem)] leading-[1.6] font-light text-[#d9d9d9]">
              Zehn Hektar, verteilt auf vier Lagen und zwei Bundesländer.
              Jede hat ihren eigenen Boden, ihre eigene Höhe, ihre eigene Nacht.
            </p>
          </BlurFade>
        </div>
      </div>

      {/* Tafel — Karte links auf Navy, Register rechts auf Fast-Schwarz. */}
      <div className="grid grid-cols-1 border-t border-[#ffffff]/10 lg:grid-cols-[1.05fr_1fr]">
        <div className="bg-[#002450] px-6 py-14 sm:px-10 sm:py-20 lg:px-14">
          <BlurFade delay={80} direction="up">
            <div className="relative mx-auto aspect-2/1 w-full max-w-2xl">
              <svg
                aria-hidden="true"
                viewBox="0 0 600 300"
                className="absolute inset-0 h-full w-full"
                fill="none"
              >
                <path
                  d={OUTLINE}
                  fill="#ffffff"
                  fillOpacity="0.03"
                  stroke="#ffffff"
                  strokeOpacity="0.4"
                  strokeWidth="1.25"
                  strokeLinejoin="round"
                />
                <path d={RIVER} stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1" strokeLinecap="round" />
              </svg>

              {RIEDEN.map(riede => {
                const isActive = riede.id === active.id
                return (
                  <button
                    key={riede.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveId(riede.id)}
                    style={{ left: `${riede.x}%`, top: `${riede.y}%` }}
                    className={`absolute flex min-h-11 -translate-y-1/2 items-center gap-3 rounded-xs px-0 focus-visible:ring-2 focus-visible:ring-[#ffffff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#002450] focus-visible:outline-none ${
                      riede.side === 'left'
                        ? 'flex-row-reverse -translate-x-[calc(100%-22px)]'
                        : '-translate-x-[22px]'
                    }`}
                  >
                    {/* 44px-Trefferfläche, 12px sichtbarer Punkt */}
                    <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center">
                      <span
                        className={`block size-3 rounded-full bg-[#c0392b] transition-all duration-500 motion-reduce:transition-none ${
                          isActive ? 'scale-125 ring-4 ring-[#c0392b]/30' : 'opacity-70'
                        }`}
                      />
                    </span>
                    <span
                      className={`text-[9px] font-semibold tracking-[0.24em] whitespace-nowrap uppercase transition-colors duration-500 motion-reduce:transition-none ${
                        isActive ? 'text-[#ffffff]' : 'text-[#d9d9d9]/45'
                      }`}
                    >
                      {riede.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </BlurFade>

          <BlurFade delay={320} className="mx-auto mt-8 flex max-w-2xl items-baseline justify-between gap-6">
            <span className="text-[10px] font-semibold tracking-[0.28em] text-[#d9d9d9]/70 uppercase">
              Abb. 02 — Lagenkarte, schematisch
            </span>
            <span className="text-[10px] font-semibold tracking-[0.28em] text-[#d9d9d9]/70 uppercase">
              10,0 ha
            </span>
          </BlurFade>
        </div>

        {/* Datenblatt der aktiven Riede + Akkordeon der übrigen. */}
        <div className="px-6 py-14 sm:px-10 sm:py-20 lg:px-14">
          <div className="mx-auto max-w-xl">
            <span className="block text-[10px] font-semibold tracking-[0.32em] text-[#c0392b] uppercase">
              {active.region}
            </span>
            <h3 className="font-display mt-5 text-[clamp(1.875rem,3.4vw,2.75rem)] leading-[1.05] font-light tracking-tight text-[#ffffff]">
              {active.name}
            </h3>
            <p className="font-display mt-6 max-w-md text-lg leading-[1.65] font-light text-[#d9d9d9]">
              {active.note}
            </p>

            <div className="mt-10">
              <DataRow label="Boden" value={active.soil} />
              <DataRow label="Seehöhe" value={active.altitude} />
              <DataRow label="Fläche" value={active.area} />
              <DataRow label="Rebsorten" value={active.varieties} />
            </div>

            <div className="mt-9">
              <a href={`/rieden/${active.id}`} className={`${CUE_BASE} focus-visible:ring-offset-[#0b1420]`}>
                <span className="font-display text-xl leading-none font-light italic">Die Riede lesen</span>
                <CueLine />
              </a>
            </div>

            {/* Akkordeon — die übrigen Lagen. Genau eine Zeile offen; das rote
                Kreuz ist das einzige dekorative Rot und markiert die Bedienung. */}
            <div className="mt-14 border-t border-[#ffffff]/12">
              {others.map(riede => {
                const panelId = `nachtblau-riede-${riede.id}`
                const isOpen = openId === riede.id
                return (
                  <div key={riede.id} className="border-b border-[#ffffff]/12">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenId(isOpen ? null : riede.id)}
                      className="group flex min-h-11 w-full items-center justify-between gap-6 rounded-xs py-6 text-left focus-visible:ring-2 focus-visible:ring-[#ffffff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b1420] focus-visible:outline-none"
                    >
                      <span>
                        <span className="font-display block text-2xl leading-tight font-light text-[#ffffff]">
                          {riede.name}
                        </span>
                        <span className="mt-1.5 block text-[10px] font-semibold tracking-[0.28em] text-[#d9d9d9]/60 uppercase">
                          {riede.region}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="grid size-9 shrink-0 place-items-center rounded-full border border-[#c0392b] transition-colors duration-500 group-hover:bg-[#c0392b] motion-reduce:transition-none"
                      >
                        <span className="relative block size-3">
                          <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-[#ffffff]" />
                          <span
                            className={`absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-[#ffffff] transition-transform duration-500 motion-reduce:transition-none ${
                              isOpen ? 'scale-y-0' : 'scale-y-100'
                            }`}
                          />
                        </span>
                      </span>
                    </button>

                    <div
                      className="grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none"
                      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                    >
                      <div
                        id={panelId}
                        className={`overflow-hidden transition-[visibility] duration-500 motion-reduce:transition-none ${
                          isOpen ? 'visible' : 'invisible'
                        }`}
                      >
                        <div className="pb-7">
                          <p className="font-display max-w-md text-base leading-[1.65] font-light text-[#d9d9d9]">
                            {riede.teaser}
                          </p>
                          <p className="mt-4 text-[10px] font-semibold tracking-[0.28em] text-[#d9d9d9]/60 uppercase">
                            {riede.soil} · {riede.altitude}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveId(riede.id)
                              setOpenId(null)
                            }}
                            className={`${CUE_BASE} mt-5 focus-visible:ring-offset-[#0b1420]`}
                          >
                            <span className="font-display text-lg leading-none font-light italic">
                              Auf der Karte zeigen
                            </span>
                            <CueLine />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
