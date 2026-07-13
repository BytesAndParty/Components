import { BlurFade } from '@components/blur-fade/blur-fade'
import { ShinyText } from '@components/shiny-text/shiny-text'

const expertQuotes = [
  {
    name: 'Florian Mairhofer',
    role: 'Sommelier · Wien',
    content: 'Der 21er Loibenberg hat unsere Weinkarte neu sortiert — und zwei Kellner zu Winzern gemacht.',
  },
  {
    name: 'Céline Blanchard',
    role: 'La Revue du Vin',
    content: 'Österreich exportiert Präzision. Dieses Haus exportiert Geduld — die seltenere Ware.',
  },
  {
    name: 'Katharina Berger',
    role: 'Stammkundin seit 2009',
    content: 'Meine Kellerliste hat genau eine Konstante. Alles andere kommt und geht.',
  },
]

export function TestimonialsV2() {
  return (
    <section className="bg-[#fdfcf9] px-6 py-16 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-24">
          {expertQuotes.map((q, i) => (
            <BlurFade key={q.name} delay={100 + i * 150} direction="up">
              <div className={`flex flex-col ${i % 2 === 0 ? 'items-start text-left' : 'ml-auto items-end text-right'} max-w-3xl gap-8`}>
                <span className="font-display block h-8 text-[6rem] leading-0 text-zinc-200">“</span>
                <p className="font-display text-4xl leading-tight font-light text-zinc-900 lg:text-5xl">
                  {q.content}
                </p>
                <div className={`flex flex-col ${i % 2 === 0 ? 'items-start' : 'items-end'} gap-1`}>
                  <span className="text-xs font-bold tracking-[0.2em] text-zinc-900 uppercase">
                    <ShinyText duration={8} shineColor="rgba(0,0,0,0.2)">
                      {q.name}
                    </ShinyText>
                  </span>
                  <span className="text-[10px] font-medium tracking-widest text-zinc-400 uppercase">
                    {q.role}
                  </span>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
