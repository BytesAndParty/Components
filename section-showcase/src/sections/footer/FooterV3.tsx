/**
 * Cellar Minimal — dark cellar feel, oversized wordmark, single-row meta.
 * Maximum whitespace; brand carries the section.
 */
export function FooterV3() {
  return (
    <footer className="relative overflow-hidden bg-zinc-950 text-zinc-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-24 px-6 pt-16 sm:pt-32 pb-10 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold tracking-[0.4em] text-zinc-500 uppercase">
              Wachau · MMXXVI
            </span>
            <p className="font-display max-w-md text-2xl leading-snug font-light italic text-zinc-300">
              „Der Wein erinnert sich an alles — den Hang, das Jahr, die Hand,
              die ihn gelesen hat."
            </p>
          </div>
          <div className="flex flex-col text-right text-xs tracking-wider text-zinc-500 uppercase">
            <a href="https://instagram.com/lacombe.fils" className="inline-flex min-h-11 items-center justify-end transition-colors hover:text-zinc-100">Instagram</a>
            <a href="/newsletter" className="inline-flex min-h-11 items-center justify-end transition-colors hover:text-zinc-100">Newsletter</a>
            <a href="/haendler" className="inline-flex min-h-11 items-center justify-end transition-colors hover:text-zinc-100">Händlerportal</a>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="font-display text-center text-[clamp(5rem,18vw,14rem)] leading-none font-light tracking-tighter text-zinc-100 italic select-none"
        >
          Lacombe
        </div>

        <div className="flex flex-col gap-1 border-t border-zinc-800 pt-8 text-[11px] tracking-wider text-zinc-500 uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} · Familienbetrieb seit 1958</span>
          <span className="text-zinc-600">Kellergasse 58 · 3601 Dürnstein · AT</span>
          <div className="flex gap-4">
            <a href="/impressum" className="inline-flex min-h-11 items-center px-1 hover:text-zinc-300">Impressum</a>
            <a href="/datenschutz" className="inline-flex min-h-11 items-center px-1 hover:text-zinc-300">Datenschutz</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
