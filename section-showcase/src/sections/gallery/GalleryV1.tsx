import { BlurFade } from '@components/blur-fade/blur-fade'
import { AmbientImage } from '@components/ambient-image/ambient-image'

const images = [
  {
    src: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
    alt: 'Vineyard',
    className: 'col-span-2 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    alt: 'Wine Cellar',
    className: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&q=80',
    alt: 'Grapes',
    className: 'col-span-1 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80',
    alt: 'Bottle Pour',
    className: 'col-span-2 row-span-1',
  },
]

export function GalleryV1() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <BlurFade delay={100}>
            <h2 className="text-accent text-base leading-7 font-semibold tracking-widest uppercase">L'Atmosphère</h2>
          </BlurFade>
          <BlurFade delay={200}>
            <p className="font-display text-foreground mt-2 text-4xl font-medium tracking-tight sm:text-5xl">
              Ein Blick in unsere Welt
            </p>
          </BlurFade>
        </div>

        <div className="grid h-auto grid-cols-1 gap-4 sm:h-200 sm:grid-cols-3 sm:grid-rows-3">
          {images.map((img, i) => (
            <BlurFade
              key={i}
              delay={300 + i * 100}
              className={img.className}
            >
              <AmbientImage
                src={img.src}
                alt={img.alt}
                borderRadius="1.5rem"
                intensity={0.3}
                className="h-full w-full"
              />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
