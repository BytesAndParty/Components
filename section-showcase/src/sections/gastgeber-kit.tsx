/**
 * Gastgeber — gemeinsame Stempel-Zeichnungen der Familie. Lagen vorher als
 * identische Kopien in Hero, Produkt und Shop; hier genau einmal.
 */

/**
 * Handgezeichneter Stempelrahmen. Liegt absolut hinter dem Label und wird über
 * `preserveAspectRatio="none"` auf die Buttonbreite gezogen — `vectorEffect`
 * hält die Strichstärke dabei konstant, damit die Linie nicht ausfranst.
 */
export function StampFrame() {
  return (
    <svg
      viewBox="0 0 240 64"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
    >
      <path
        d="M6.5 7.5C62 3.8 152 4.6 233 7.2c2.8 16.4 2.4 36.4.9 49.4C160 60 68 59.4 6.8 56.9 3.6 40.2 4.4 21.6 6.5 7.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** Stempel-Glas für „Verkostung buchen“ — dünne, leicht schiefe Linie, kein Fill. */
export function GlassStamp({ className, strokeWidth = 1.15 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="rotate(-2.5 12 12)">
        <path d="M7.9 3.5c2.8-.35 5.6-.3 8.3.1" />
        <path d="M8 3.6c-.35 4.7 1.1 8 3.9 8.3 2.9-.25 4.45-3.6 4.3-8.3" />
        <path d="M11.9 11.9c.12 2.2.12 4.4 0 6.6" />
        <path d="M8.4 18.9c2.5-.55 5.1-.5 7.4-.05" />
      </g>
    </svg>
  )
}

/** Stempel-Kiste — Flaschenhälse über der handgezeichneten Steige („Ab Hof“, „In den Warenkorb“). */
export function CrateStamp({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="rotate(1.5 12 12)">
        <path d="M8.2 3.4c-.2 1.7-.2 3.3-.1 4.7" />
        <path d="M12 2.9c-.1 1.9-.1 3.7 0 5.2" />
        <path d="M15.8 3.6c.12 1.5.12 3 0 4.5" />
        <path d="M4.4 8.4c5.2-.45 10.4-.4 15.4.1.3 3.9.25 8-.05 11.9-5.2.4-10.6.35-15.6 0-.3-4-.2-8 .25-12Z" />
        <path d="M4.6 13.2c5.1-.35 10.2-.3 15 .05" />
      </g>
    </svg>
  )
}
