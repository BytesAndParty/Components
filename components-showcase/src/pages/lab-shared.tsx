import { Fragment, useEffect, type ReactNode } from 'react'

// Temporär: gemeinsame Bausteine der Scrapbook-Werkbank (lab-marker-callout).
// Wird zusammen mit der Werkbank-Seite gelöscht.

const FONT_LINK_ID = '__lab-scrapbook-fonts__'
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Gochi+Hand&family=Kalam:wght@400;700&display=swap'

/** Lädt die Zusatzschriften der Entwürfe (nur Werkbank, die fertige Komponente nutzt self-hosted @fontsource). */
export function LabFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return
    const link = document.createElement('link')
    link.id = FONT_LINK_ID
    link.rel = 'stylesheet'
    link.href = FONT_HREF
    document.head.appendChild(link)
  }, [])
  return null
}

export function LabHeader({ title, children }: { title: string; children: ReactNode }) {
  return (
    <header className="mb-20 max-w-2xl">
      <p className="text-muted-foreground text-[0.7rem] tracking-[0.18em] uppercase">Werkbank · temporär</p>
      <h1 className="mt-3 text-6xl leading-none" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' }}>
        {title}
      </h1>
      <p className="text-muted-foreground mt-6 text-sm leading-relaxed">{children}</p>
    </header>
  )
}

export function Traits({ items }: { items: [string, string][] }) {
  return (
    <dl className="mb-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm sm:grid-cols-[auto_1fr_auto_1fr]">
      {items.map(([k, v]) => (
        <Fragment key={k}>
          <dt className="text-muted-foreground pt-0.5 text-[0.7rem] tracking-[0.15em] uppercase">{k}</dt>
          <dd>{v}</dd>
        </Fragment>
      ))}
    </dl>
  )
}

export function Board({ children, className = 'gap-x-20 gap-y-20' }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-wrap items-start px-4 pt-8 pb-16 ${className}`}>{children}</div>
}
