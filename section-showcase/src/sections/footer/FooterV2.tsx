/**
 * Atelier Brief — editorial, three-column. Theme-adaptive surface, serif
 * headline, hairline dividers. Inspired by buchart58.at letter-press footers.
 */
export function FooterV2() {
  return (
    <footer className="bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 pt-16 sm:pt-24 pb-12 lg:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <div className="flex flex-col gap-8">
            <span className="text-[10px] font-bold tracking-[0.4em] text-muted-foreground uppercase">
              Weingut · seit 1958
            </span>
            <h2 className="font-display text-4xl leading-[0.95] font-light tracking-tight italic sm:text-5xl">
              Lacombe<br />& Fils.
            </h2>
            <p className="max-w-xs text-sm leading-relaxed font-light text-muted-foreground">
              Drei Generationen Handwerk, ein Hektar Schiefer, kein Kompromiss.
              Bestellungen ab Hof oder per Brief.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <span className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">
              Besuch
            </span>
            <address className="text-sm leading-relaxed font-light text-foreground not-italic">
              Kellergasse 58<br />
              3601 Dürnstein<br />
              Wachau, Österreich
            </address>
            <div className="flex flex-col text-sm font-light text-foreground">
              <a href="tel:+43271155800" className="inline-flex min-h-11 items-center hover:text-foreground">+43 2711 55 800</a>
              <a href="mailto:hallo@lacombe.at" className="inline-flex min-h-11 items-center hover:text-foreground">hallo@lacombe.at</a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <span className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">
              Notiz erhalten
            </span>
            <p className="max-w-xs text-sm leading-relaxed font-light text-muted-foreground">
              Drei Briefe pro Jahr. Lese, neue Jahrgänge, geschlossene Verkostungen.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="ihre@adresse.at"
                aria-label="E-Mail-Adresse"
                className="min-h-11 border-b border-border bg-transparent pb-2 text-sm font-light placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex min-h-11 items-center self-start text-[11px] font-bold tracking-[0.3em] text-foreground uppercase transition-opacity hover:opacity-60"
              >
                Eintragen →
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-2 border-t border-border pt-8 text-[11px] tracking-wider text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Lacombe & Fils · Familienbetrieb</span>
          <div className="flex gap-4">
            <a href="/impressum" className="inline-flex min-h-11 items-center px-1 hover:text-foreground">Impressum</a>
            <a href="/datenschutz" className="inline-flex min-h-11 items-center px-1 hover:text-foreground">Datenschutz</a>
            <a href="/agb" className="inline-flex min-h-11 items-center px-1 hover:text-foreground">AGB</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
