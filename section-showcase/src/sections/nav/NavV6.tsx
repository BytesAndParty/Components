/**
 * Editorial — Kopf einer Zeitungs-Titelseite (Editorial-Spread-Linie von
 * ProductV3/StoreEditorial): Folio-Zeile oben, zentrierter Serif-Wortmark
 * mit Untertitel, darunter die Ressort-Leiste zwischen Doppellinien —
 * jeder Link trägt seine Seitenzahl als Serif-Fußnote. Bewusst ohne
 * Burger: auf kleinen Screens scrollt die Ressort-Zeile horizontal.
 */

const RESSORTS = [
  { label: 'Sortiment', href: '/sortiment', page: '04' },
  { label: 'Die Lagen', href: '/lagen', page: '14' },
  { label: 'Der Keller', href: '/keller', page: '22' },
  { label: 'Besuch', href: '/besuch', page: '31' },
  { label: 'Journal', href: '/journal', page: '40' },
]

export function NavV6() {
  return (
    <nav aria-label="Hauptnavigation" className="bg-[#efece5] px-6 pt-7 lg:px-12">
      {/* Folio row */}
      <div className="flex items-baseline justify-between text-[9px] font-bold tracking-[0.35em] text-zinc-400 uppercase">
        <span>Jahrgangsheft MMXXVI</span>
        <span className="hidden sm:block">Wachau · Loiben</span>
        <span>№ 12</span>
      </div>

      {/* Centered wordmark with subtitle */}
      <div className="mt-7 text-center">
        <a
          href="/"
          className="font-display inline-flex min-h-11 items-center justify-center text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-light tracking-tight text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
        >
          Buchart&nbsp;<span className="italic">&amp; Söhne.</span>
        </a>
        <p className="mt-2.5 text-[9px] font-bold tracking-[0.45em] text-zinc-400 uppercase">
          Wein &amp; Handwerk seit 1958
        </p>
      </div>

      {/* Ressort bar between double rules — thick over thin, print style */}
      <div className="mt-7 border-t-2 border-zinc-900">
        <div className="mt-[3px] border-t border-zinc-300" />
        <div className="no-scrollbar flex items-center justify-start gap-7 overflow-x-auto py-1 lg:justify-center lg:gap-10">
          {RESSORTS.map((ressort, i) => (
            <span key={ressort.href} className="flex shrink-0 items-center gap-7 lg:gap-10">
              {i > 0 && (
                <span aria-hidden="true" className="text-zinc-300">
                  ·
                </span>
              )}
              <a
                href={ressort.href}
                className="group inline-flex min-h-11 items-baseline gap-1.5 text-[10px] font-bold tracking-[0.25em] text-zinc-900 uppercase transition-colors hover:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
              >
                {ressort.label}
                <span className="font-display text-[11px] leading-none font-light text-zinc-400 italic normal-case transition-colors group-hover:text-zinc-900">
                  {ressort.page}
                </span>
              </a>
            </span>
          ))}
        </div>
        <div className="border-t border-zinc-300" />
      </div>
    </nav>
  )
}
