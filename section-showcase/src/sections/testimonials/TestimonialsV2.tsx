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
    <section className="bg-[#fdfcf9] py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-24">
          {expertQuotes.map((q, i) => (
            <BlurFade key={q.name} delay={100 + i * 150} direction="up">
              <div className={`flex flex-col ${i % 2 === 0 ? 'items-start text-left' : 'items-end text-right ml-auto'} max-w-3xl gap-8`}>
                <span className="text-[6rem] font-display leading-[0] text-zinc-200 block h-8">“</span>
                <p className="font-display text-4xl lg:text-5xl font-light text-zinc-900 leading-tight">
                  {q.content}
                </p>
                <div className={`flex flex-col ${i % 2 === 0 ? 'items-start' : 'items-end'} gap-1`}>
                  <span className="font-bold tracking-[0.2em] uppercase text-zinc-900 text-xs">
                    <ShinyText duration={8} shineColor="rgba(0,0,0,0.2)">
                      {q.name}
                    </ShinyText>
                  </span>
                  <span className="text-[10px] tracking-widest uppercase text-zinc-400 font-medium">
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
