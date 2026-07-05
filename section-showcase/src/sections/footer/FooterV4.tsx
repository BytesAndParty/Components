import { BlurFade } from '@components/blur-fade/blur-fade'

/**
 * Le Colophon — Domaine Privée footer on deep bordeaux ink: oversized
 * serif wordmark, engraved cream hairlines, three quiet columns and a
 * printed-matter closing line. The warm counterpart to the cream sections.
 */

const COLUMNS = [
  {
    heading: 'Besuch',
    lines: ['Kellergasse 7', '3601 Dürnstein, Wachau', 'Sa 10 – 17 Uhr & nach Vereinbarung'],
    links: [],
  },
  {
    heading: 'Kontakt',
    lines: [],
    links: [
      { label: '+43 2711 58 158', href: 'tel:+43271158158' },
      { label: 'gut@domaine-privee.at', href: 'mailto:gut@domaine-privee.at' },
      { label: 'Anfahrt & Karte', href: '/anfahrt' },
    ],
  },
  {
    heading: 'Das Haus',
    lines: [],
    links: [
      { label: 'Die Weinkarte', href: '/weine' },
      { label: 'Le Cercle', href: '/cercle' },
      { label: 'Degustationen', href: '/degustation' },
      { label: 'Die Chronik', href: '/chronik' },
    ],
  },
]

export function FooterV4() {
  return (
    <footer className="bg-[#2c1119] px-6 pt-24 pb-10 text-[#efe6da] lg:px-16 lg:pt-32">
      <div className="mx-auto max-w-6xl">
        {/* Wordmark */}
        <BlurFade delay={100} direction="up">
          <p className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.95] font-light tracking-tight text-[#efe6da]">
            Domaine
            <br />
            <span className="italic text-[#d9b98f]">Privée.</span>
          </p>
        </BlurFade>

        {/* Columns */}
        <div className="mt-16 grid grid-cols-1 gap-12 border-t border-[#efe6da]/15 pt-14 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col, i) => (
            <BlurFade key={col.heading} delay={250 + i * 120} direction="up">
              <div>
                <h3 className="mb-6 text-[10px] font-bold tracking-[0.35em] text-[#c4a5ab] uppercase">
                  {col.heading}
                </h3>
                <ul className="flex flex-col gap-3">
                  {col.lines.map(line => (
                    <li key={line} className="text-sm leading-relaxed font-light text-[#e3d5c8]">
                      {line}
                    </li>
                  ))}
                  {col.links.map(link => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group inline-flex min-h-8 items-center gap-3 text-sm font-light text-[#e3d5c8] transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#d9b98f]/70 focus-visible:outline-none"
                      >
                        <span aria-hidden="true" className="h-px w-0 bg-[#d9b98f] transition-all duration-400 group-hover:w-5" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </BlurFade>
          ))}

          {/* Closing note column */}
          <BlurFade delay={610} direction="up">
            <div className="flex h-full flex-col">
              <h3 className="mb-6 text-[10px] font-bold tracking-[0.35em] text-[#c4a5ab] uppercase">
                Colophon
              </h3>
              <p className="font-display text-lg leading-relaxed font-light text-[#e3d5c8] italic">
                „Gesetzt in achtzehn Fässern, gedruckt auf Schiefer, gebunden
                von drei Generationen.“
              </p>
              <span className="mt-6 block text-[9px] font-bold tracking-[0.3em] text-[#c4a5ab] uppercase">
                Anno 1958 · Wachau
              </span>
            </div>
          </BlurFade>
        </div>

        {/* Bottom rule */}
        <BlurFade delay={750}>
          <div className="mt-20 flex flex-col items-center gap-5 border-t border-[#efe6da]/15 pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#c4a5ab] uppercase">
              © MMXXVI Domaine Privée
            </span>
            <div className="flex gap-8">
              {['Impressum', 'Datenschutz', 'AGB'].map(label => (
                <a
                  key={label}
                  href={`/${label.toLowerCase()}`}
                  className="min-h-8 text-[10px] font-bold tracking-[0.25em] text-[#c4a5ab] uppercase transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#d9b98f]/70 focus-visible:outline-none"
                >
                  {label}
                </a>
              ))}
            </div>
            <span className="font-display text-xs font-light text-[#c4a5ab] italic">
              Verantwortungsvoller Genuss — ab 18 Jahren.
            </span>
          </div>
        </BlurFade>
      </div>
    </footer>
  )
}
