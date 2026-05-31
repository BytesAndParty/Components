import { Timeline } from '@components/timeline/timeline'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { ShinyText } from '@components/shiny-text/shiny-text'

const heritageItems = [
  {
    year: '1892',
    title: 'Die Gründung',
    content: 'Jean-Baptiste Lacombe erwirbt die ersten Hektar im Rhône-Tal und legt den Grundstein für unsere Tradition.',
  },
  {
    year: '1945',
    title: 'Neubeginn',
    content: 'Nach den Kriegsjahren wird der Keller modernisiert und die ersten Flaschen unter eigenem Etikett abgefüllt.',
  },
  {
    year: '1988',
    title: 'Ökologische Wende',
    content: 'Wir stellen als eines der ersten Güter der Region komplett auf biologischen Anbau um.',
  },
  {
    year: '2024',
    title: 'Digitale Exzellenz',
    content: 'Einführung von AtelierUI und Cellar Canvas, um Genuss und Technologie perfekt zu vereinen.',
  },
]

export function TimelineV2() {
  return (
    <section className="bg-[#fdfcf9] px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-32 flex flex-col items-center gap-12 text-center">
          <BlurFade delay={100}>
            <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">Chronik</span>
          </BlurFade>
          <BlurFade delay={200}>
            <h2 className="font-display text-7xl leading-tight font-light tracking-tight text-zinc-900">
              Geschichte <br />
              <span className="pl-[0.1em] italic">geschrieben</span> in Wein.
            </h2>
          </BlurFade>
        </div>

        <div className="relative pl-12 sm:pl-0">
          <Timeline 
            items={heritageItems.map(item => ({
              ...item,
              marker: (
                <ShinyText duration={6} shineColor="rgba(255,255,255,0.6)">
                  {item.year.slice(2)}
                </ShinyText>
              )
            }))} 
            dotColor="#18181b"
            lineColor="#e4e4e7"
            className="artisanal-timeline"
          />
        </div>
      </div>
      
      <style>{`
        .artisanal-timeline h3 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 400;
          color: #18181b;
        }
        .artisanal-timeline [data-timeline-item] {
          margin-bottom: 4rem;
        }
      `}</style>
    </section>
  )
}
