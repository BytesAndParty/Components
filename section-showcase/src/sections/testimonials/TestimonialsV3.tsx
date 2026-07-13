import { BlurFade } from '@components/blur-fade/blur-fade'

/**
 * Editorial Letter — single oversized lead testimonial as a printed letter,
 * flanked by two short supporting voices on a thin grid line below.
 * Cream ground, hairline frame on the lead quote.
 *
 * NOTE: Uses the brand cream ground (#fdfcf9) intentionally; this is the
 * "artisanal minimal" treatment from CLAUDE.md §5 and does not follow the
 * dark/light theme toggle for the background — only theme-neutral text
 * relations are used inside the cream area.
 */

const lead = {
  body:
    'Man kann Terroir behaupten, oder man kann es schmecken. Hier braucht es kein Adjektiv: der Urgestein-Hang steht im Glas — vom ersten Zug bis in einen Abgang, der seine Minuten nicht als Werbung meint, sondern als Selbstverständlichkeit.',
  attribution: 'Dr. Anna Moser',
  role: 'Weinakademikerin · Decanter',
}

const supporting = [
  {
    body: 'Wir führen dreißig österreichische Winzer. Diesen einen erklären wir den Gästen nicht — er erklärt sich selbst.',
    attribution: 'Restaurant Hofer',
    role: 'Krems an der Donau',
  },
  {
    body: 'Was auf dem Etikett steht, liegt im Glas. In dieser Branche grenzt das an eine Provokation.',
    attribution: 'Josef Steiner',
    role: 'Weinhändler · Krems',
  },
]

export function TestimonialsV3() {
  return (
    <section className="bg-[#fdfcf9] px-6 py-16 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <header className="mb-20 flex flex-col items-center gap-6 text-center">
          <BlurFade delay={100}>
            <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
              Aus der Presse · Jahrgang 2018
            </span>
          </BlurFade>
          <BlurFade delay={200}>
            <h2 className="font-display max-w-2xl text-5xl leading-[0.95] font-light tracking-tight text-zinc-900 lg:text-6xl">
              Was Sommeliers <br />
              <span className="italic">über uns</span> schreiben.
            </h2>
          </BlurFade>
        </header>

        {/* Lead letter — framed plate */}
        <BlurFade delay={300} direction="up">
          <div className="relative mx-auto max-w-4xl">
            {/* Hairline frame */}
            <figure className="border border-zinc-200 bg-white/40 px-8 py-16 backdrop-blur-sm sm:px-16 sm:py-20">
              <div className="flex flex-col gap-10">
                <span
                  aria-hidden="true"
                  className="font-display block h-8 text-[7rem] leading-0 font-light text-zinc-200 select-none lg:text-[9rem]"
                >
                  &ldquo;
                </span>
                <blockquote className="font-display max-w-3xl text-3xl leading-tight font-light tracking-tight text-zinc-900 lg:text-[2.75rem]">
                  {lead.body}
                </blockquote>
                <figcaption className="flex flex-col gap-2">
                  <span aria-hidden="true" className="h-px w-12 bg-zinc-300" />
                  <span className="text-[11px] font-bold tracking-[0.3em] text-zinc-900 uppercase">
                    {lead.attribution}
                  </span>
                  <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-400 uppercase">
                    {lead.role}
                  </span>
                </figcaption>
              </div>
            </figure>

            {/* Paper-stamp date in the corner */}
            <div className="absolute top-0 right-0 translate-x-2 -translate-y-1/2 rotate-3 border border-zinc-200 bg-[#fdfcf9] px-4 py-2 shadow-sm">
              <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                Mai · MMXXVI
              </span>
            </div>
          </div>
        </BlurFade>

        {/* Supporting voices — quiet grid below */}
        <div className="mt-24 grid grid-cols-1 gap-12 border-t border-zinc-200 pt-16 lg:grid-cols-2 lg:gap-20">
          {supporting.map((q, i) => (
            <BlurFade key={q.attribution} delay={500 + i * 150} direction="up">
              <figure className="flex flex-col gap-6">
                <blockquote className="font-display text-2xl leading-snug font-light text-zinc-800 italic lg:text-3xl">
                  „{q.body}"
                </blockquote>
                <figcaption className="flex flex-col gap-1">
                  <span aria-hidden="true" className="mb-1 h-px w-8 bg-zinc-300" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-900 uppercase">
                    {q.attribution}
                  </span>
                  <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-400 uppercase">
                    {q.role}
                  </span>
                </figcaption>
              </figure>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
