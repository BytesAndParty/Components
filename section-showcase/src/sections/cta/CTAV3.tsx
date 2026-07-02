import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Die Einladung — closing page of a lookbook. Full-bleed photography,
 * type set bottom-left (deliberately not centered), an RSVP corner note
 * top-right and a hairline footer with place & date. The CTA is a quiet
 * underlined line, not a button: confidence instead of urgency.
 */
export function CTAV3() {
  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden">
      {/* Full-bleed photography */}
      <RevealImage
        src="https://images.unsplash.com/photo-1543418219-44e30b057fea?w=2000&q=80"
        alt="Weinterrassen in der Abenddämmerung"
        direction="up"
        duration={1800}
        zoom={1.08}
        className="absolute inset-0 h-full w-full"
        imgClassName="brightness-[0.65]"
      />
      {/* Soft legibility gradient, bottom-heavy */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(12,10,9,0.75) 0%, rgba(12,10,9,0.15) 45%, transparent 70%)' }}
      />

      {/* RSVP corner note — top right */}
      <BlurFade delay={800} className="absolute top-10 right-8 z-10 hidden text-right lg:block">
        <span className="block text-[10px] font-bold tracking-[0.35em] text-white/60 uppercase">
          Um Antwort wird gebeten
        </span>
        <span className="font-display mt-2 block text-lg font-light text-white/80 italic">
          bis zum 14. August
        </span>
      </BlurFade>

      {/* Invitation block — bottom left */}
      <div className="absolute right-6 bottom-0 left-6 z-10 lg:right-16 lg:left-16">
        <div className="flex flex-col gap-8 pb-12 lg:max-w-3xl">
          <BlurFade delay={300}>
            <span className="text-[11px] font-bold tracking-[0.4em] text-white/60 uppercase">
              Hoftor offen · Nur an diesem Abend
            </span>
          </BlurFade>

          <BlurFade delay={450}>
            <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] font-light tracking-tighter text-white">
              Kommen Sie,
              <br />
              <span className="italic">wenn es dunkel wird.</span>
            </h2>
          </BlurFade>

          <BlurFade delay={600}>
            <p className="max-w-md text-lg leading-relaxed font-light text-white/70">
              Eine Nacht im Jahr öffnen wir den Keller für Fremde.
              Achtzig Plätze, ein langer Tisch, der neue Jahrgang.
            </p>
          </BlurFade>

          <BlurFade delay={750}>
            <a
              href="/einladung"
              className="group inline-flex min-h-11 items-center gap-5 text-sm font-bold tracking-[0.25em] text-white uppercase"
            >
              Platz erbitten
              <span aria-hidden="true" className="h-px w-12 bg-white/70 transition-all duration-500 group-hover:w-20 group-hover:bg-white" />
            </a>
          </BlurFade>
        </div>

        {/* Hairline footer — place & date like a printed invitation */}
        <BlurFade delay={900}>
          <div className="flex flex-col gap-3 border-t border-white/20 py-6 sm:flex-row sm:items-baseline sm:justify-between">
            <span className="text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase">
              Kellergasse 12 · Dürnstein an der Donau
            </span>
            <span className="font-display text-sm font-light text-white/60 italic">
              Sankt-Lorenz-Nacht, 22. August MMXXVI
            </span>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
