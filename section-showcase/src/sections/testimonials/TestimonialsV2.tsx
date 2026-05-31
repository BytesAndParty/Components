import { BlurFade } from '@components/blur-fade/blur-fade'
import { ShinyText } from '@components/shiny-text/shiny-text'

const expertQuotes = [
  {
    name: 'Marc-André Leclerc',
    role: 'Chef Sommelier, Le Bristol',
    content: 'Die Selektion Lacombe ist ein Paradebeispiel für Terroir-Treue. Ein Muss für jeden Weinkeller, der auf Qualität statt Masse setzt.',
  },
  {
    name: 'Elena Rossi',
    role: 'Weinkritikerin',
    content: 'Selten habe ich eine so konsistente Qualität über verschiedene Jahrgänge hinweg erlebt. Die Bio-Wende 1988 spürt man in jeder Nuance.',
  },
  {
    name: 'Julian Schmidt',
    role: 'Sammler & Connaisseur',
    content: 'Der Millésime Club ist mein Highlight des Monats. Die Raritäten, die man hier bekommt, sind auf dem freien Markt kaum zu finden.',
  },
]

export function TestimonialsV2() {
  return (
    <section className="bg-[#fdfcf9] px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-24">
          {expertQuotes.map((q, i) => (
            <BlurFade key={q.name} delay={100 + i * 150} direction="up">
              <div className={`flex flex-col ${i % 2 === 0 ? 'items-start text-left' : 'ml-auto items-end text-right'} max-w-3xl gap-8`}>
                <span className="font-display block h-8 text-[6rem] leading-[0] text-zinc-200">“</span>
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
