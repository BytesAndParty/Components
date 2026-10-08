import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { BUCHART_FONTS } from '../family-fonts'
import { RibbonFill, RunningHead } from '../buchart-kit'
import { ADDRESS, CONTACTS, telHref } from '../buchart-data'

/**
 * Buch·Art — Kontakt & Anreise, die Seite „Sooss“ der Original-Website: Adresse,
 * Öffnungszeiten ab Hof, die Durchwahlen nach Zuständigkeit. Statt eines
 * eingebetteten Karten-iFrames eine schematische Lagekarte in Goldlinie —
 * Sooss zwischen Baden und Bad Vöslau am Fuß des Wienerwalds — und ein Link
 * zur Routenplanung.
 */

const ROUTE = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ADDRESS.street}, ${ADDRESS.zip} Sooß`)}`

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e1919] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f3e8]'

function LocationMap() {
  const reduce = useReducedMotion()
  const draw = (delay: number) =>
    reduce
      ? {}
      : { initial: { pathLength: 0 }, whileInView: { pathLength: 1 }, viewport: { once: true, amount: 0.4 }, transition: { duration: 1.6, delay, ease: [0.65, 0, 0.35, 1] as const } }

  return (
    <svg viewBox="0 0 400 480" role="img" aria-label="Schematische Lage: Sooss liegt zwischen Baden im Norden und Bad Vöslau im Süden, westlich beginnt der Wienerwald." className="h-auto w-full">
      {/* Wienerwald: Höhenlinien im Westen */}
      {[0, 1, 2, 3].map(i => (
        <motion.path
          key={i}
          d={`M${18 + i * 22} 20c${30 - i * 4} 60-${20 - i * 3} 120 ${10 + i * 2} 190s-${26 - i * 4} 140 ${4 + i * 3} 250`}
          fill="none"
          stroke="#be9f55"
          strokeOpacity={0.55 - i * 0.1}
          strokeWidth="1"
          {...draw(i * 0.15)}
        />
      ))}
      <text x="40" y="250" fill="#7d6226" fontSize="11" letterSpacing="3" transform="rotate(-90 40 250)" textAnchor="middle" style={{ fontFamily: 'var(--font-buchart-sans)' }}>
        WIENERWALD
      </text>

      {/* Verbindung Baden — Sooss — Bad Vöslau */}
      <motion.path d="M290 40C270 140 240 200 232 250s4 120 -14 190" fill="none" stroke="#1c1a17" strokeWidth="1.2" {...draw(0.4)} />

      {[
        { x: 290, y: 40, label: 'Baden', anchor: 'start' as const, dx: 14 },
        { x: 218, y: 440, label: 'Bad Vöslau', anchor: 'start' as const, dx: 14 },
      ].map(t => (
        <g key={t.label}>
          <circle cx={t.x} cy={t.y} r="4" fill="#f7f3e8" stroke="#1c1a17" strokeWidth="1.2" />
          <text x={t.x + t.dx} y={t.y + 4} fontSize="14" fill="#1c1a17" textAnchor={t.anchor} style={{ fontFamily: 'var(--font-buchart-display)' }}>
            {t.label}
          </text>
        </g>
      ))}

      {/* Sooss — mit dem roten Band markiert */}
      <g>
        <circle cx="232" cy="250" r="22" fill="none" stroke="#be9f55" strokeWidth="1" />
        <circle cx="232" cy="250" r="6" fill="#9e1919" />
        <text x="266" y="246" fontSize="24" fill="#1c1a17" style={{ fontFamily: 'var(--font-buchart-display)' }}>
          Sooss
        </text>
        <text x="266" y="266" fontSize="11" fill="#5e574b" letterSpacing="1" style={{ fontFamily: 'var(--font-buchart-sans)' }}>
          Hauptstraße 58
        </text>
      </g>

      {/* Nordpfeil */}
      <g transform="translate(360 418)" stroke="#7d6226" fill="none" strokeWidth="1">
        <path d="M0 22V-10M-6 -2l6-8 6 8" />
        <text x="0" y="40" fontSize="11" fill="#7d6226" stroke="none" textAnchor="middle" style={{ fontFamily: 'var(--font-buchart-sans)' }}>
          N
        </text>
      </g>
    </svg>
  )
}

export function KontaktBuchArt() {
  return (
    <section style={BUCHART_FONTS} className="bg-[#f7f3e8] px-6 py-20 text-[#1c1a17] lining-nums lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <RunningHead chapter="VI" title="Kontakt & Anreise" />

        <div className="mt-14 grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <BlurFade>
              <h2 className="font-display text-[clamp(2.6rem,5.4vw,4.4rem)] leading-[0.95]">
                Besuchen Sie uns
                <br />
                <span className="italic text-[#9e1919]">in Sooss.</span>
              </h2>
              <p className="mt-7 max-w-lg text-[1.0625rem] leading-[1.7] text-[#5e574b]">
                Verkosten Sie die Weine und wählen Sie in Ruhe aus, was Sie für Ihren Weinvorrat mitnehmen wollen.
              </p>
            </BlurFade>

            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <BlurFade delay={120}>
                <h3 className="text-[11px] font-medium tracking-[0.22em] text-[#7d6226] uppercase">Adresse</h3>
                <address className="font-display mt-3 text-[1.55rem] leading-[1.3] not-italic">
                  {ADDRESS.street}
                  <br />
                  {ADDRESS.zip} {ADDRESS.town}
                </address>
                <p className="mt-1 text-[13.5px] text-[#5e574b]">{ADDRESS.region}</p>
              </BlurFade>
              <BlurFade delay={200}>
                <h3 className="text-[11px] font-medium tracking-[0.22em] text-[#7d6226] uppercase">Ab Hof · Verkostung & Verkauf</h3>
                <p className="font-display mt-3 text-[1.55rem] leading-[1.3]">Täglich 8 – 19 Uhr</p>
                <p className="mt-1 text-[13.5px] text-[#5e574b]">auch an Sonn- und Feiertagen</p>
              </BlurFade>
            </div>

            <ul className="mt-12 divide-y divide-[#ddd3bc] border-y border-[#ddd3bc]">
              {CONTACTS.map(c => (
                <li key={c.name}>
                  <a href={telHref(c.phone)} className={`group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4 ${FOCUS}`}>
                    <span>
                      <span className="text-[12px] tracking-[0.12em] text-[#5e574b] uppercase">{c.role}</span>
                      <span className="font-display ml-3 text-[1.25rem]">{c.name}</span>
                    </span>
                    <span className="text-[15px] tabular-nums transition-colors group-hover:text-[#9e1919]">{c.phone}</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${ADDRESS.email}`} className={`group flex items-baseline justify-between gap-6 py-4 ${FOCUS}`}>
                  <span className="text-[12px] tracking-[0.12em] text-[#5e574b] uppercase">Bestellungen & Anfragen</span>
                  <span className="text-[15px] transition-colors group-hover:text-[#9e1919]">{ADDRESS.email}</span>
                </a>
              </li>
            </ul>

            <a href={ROUTE} className={`group relative mt-10 inline-flex min-h-12 items-center gap-2 py-3 pr-11 pl-7 text-[14px] font-medium text-[#f7f3e8] ${FOCUS}`}>
              <RibbonFill />
              <span className="relative inline-flex items-center gap-2">
                Route planen <ArrowUpRight size={16} />
              </span>
            </a>
          </div>

          <BlurFade delay={150} className="lg:col-span-5 lg:col-start-8">
            <figure className="border border-[#ddd3bc] bg-[#fbf9f3] p-6 sm:p-10">
              <LocationMap />
              <figcaption className="mt-4 text-[12px] text-[#5e574b]">Schematisch, nicht maßstabsgetreu.</figcaption>
            </figure>
            <p className="font-display mt-8 text-[1.2rem] italic text-[#5e574b]">Übrigens: Wir schreiben Sooß mit Doppel-s — also Sooss.</p>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
