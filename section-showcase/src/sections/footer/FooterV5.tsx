/**
 * Maison Colophon — der Print-Kolophon am Ende des Magazins. Cream-Grund, übergroßer
 * italic Serif-Wortmark, Hairline-geführte Spalten und eine gesetzte Schlusszeile mit
 * römischem Jahr. Passt zur Maison-Editorial-Linie (HeroV6/FeaturesV6/ProductV6).
 */

const NAV = [
  { label: 'Die Weine', href: '/sortiment' },
  { label: 'Das Weingut', href: '/weingut' },
  { label: 'Besuch & Verkostung', href: '/besuch' },
  { label: 'Rebstockmiete', href: '/rebstock' },
]

export function FooterV5() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#fdfcf9] px-6 pt-16 sm:pt-24 pb-12 text-zinc-900 lg:px-16 lg:pt-32">
      <div className="mx-auto max-w-7xl">
        {/* Masthead row */}
        <div className="flex items-baseline justify-between border-b border-zinc-200 pb-8">
          <span className="text-[10px] font-bold tracking-[0.4em] text-zinc-400 uppercase">Domaine Buchart · Wachau</span>
          <span className="text-[10px] font-bold tracking-[0.4em] text-zinc-400 uppercase">Kolophon</span>
        </div>

        {/* Wordmark + columns */}
        <div className="grid grid-cols-1 gap-16 pt-14 lg:grid-cols-[1.3fr_0.9fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-8">
            <h2 className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.85] font-light tracking-tighter text-zinc-900">
              Buchart
              <br />
              <span className="italic">&amp; Söhne.</span>
            </h2>
            <p className="max-w-xs text-sm leading-relaxed font-light text-zinc-500">
              Drei Generationen, sieben Rieden in Steillage, achtzehn Fässer je Jahrgang. Bestellungen ab Hof oder per Brief.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-4" aria-label="Footer">
            <span className="mb-2 text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">Index</span>
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-display group inline-flex min-h-11 items-center gap-4 text-xl font-light text-zinc-900"
              >
                <span
                  aria-hidden="true"
                  className="h-px w-4 bg-zinc-300 transition-all duration-300 group-hover:w-8 group-hover:bg-zinc-900"
                />
                {item.label}
              </a>
            ))}
          </nav>

          {/* Besuch + Notiz */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">Besuch</span>
              <address className="text-sm leading-relaxed font-light text-zinc-600 not-italic">
                Kellergasse 58
                <br />
                3601 Dürnstein · Wachau
                <br />
                <a href="tel:+43271155800" className="hover:text-zinc-900">+43 2711 55 800</a>
              </address>
            </div>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              {/* Sichtbarer Feldname als <label> statt aria-label — bleibt
                  auch stehen, wenn der Platzhalter beim Tippen verschwindet. */}
              <label htmlFor="footer-v5-email" className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">Notiz erhalten</label>
              <input
                id="footer-v5-email"
                type="email"
                required
                placeholder="ihre@adresse.at"
                className="min-h-11 border-b border-zinc-300 bg-transparent pb-2 text-sm font-light text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
              />
              <button
                type="submit"
                className="group inline-flex min-h-11 cursor-pointer items-center gap-4 self-start text-[11px] font-bold tracking-[0.3em] text-zinc-900 uppercase"
              >
                Eintragen
                <span aria-hidden="true" className="h-px w-8 bg-zinc-900 transition-all duration-500 group-hover:w-14" />
              </button>
            </form>
          </div>
        </div>

        {/* Colophon closing line */}
        <div className="mt-20 flex flex-col gap-3 border-t border-zinc-200 pt-8 text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>Gesetzt &amp; gefüllt · Anno MMXXVI</span>
          <div className="flex gap-5">
            <a href="/impressum" className="inline-flex min-h-11 items-center hover:text-zinc-900">Impressum</a>
            <a href="/datenschutz" className="inline-flex min-h-11 items-center hover:text-zinc-900">Datenschutz</a>
            <a href="/agb" className="inline-flex min-h-11 items-center hover:text-zinc-900">AGB</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
