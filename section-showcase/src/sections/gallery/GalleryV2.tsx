import { BlurFade } from '@components/blur-fade/blur-fade'
import { AmbientImage } from '@components/ambient-image/ambient-image'
import { AuroraText } from '@components/aurora-text/aurora-text'

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80',
    alt: 'Vineyard morning',
    className: 'lg:col-span-4 lg:row-span-3',
  },
  {
    src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    alt: 'Cellar detail',
    className: 'lg:col-span-2 lg:row-span-2 lg:mt-24',
  },
  {
    src: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&q=80',
    alt: 'Grapes close-up',
    className: 'lg:col-span-2 lg:row-span-2 lg:-mt-12',
  },
  {
    src: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80',
    alt: 'Bottle in light',
    className: 'lg:col-span-2 lg:row-span-3 lg:-mt-24',
  },
]

export function GalleryV2() {
  return (
    <section className="relative overflow-hidden bg-[#fdfcf9] px-6 py-32">
      {/* Background Watermark */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap opacity-[0.02]">
        <AuroraText 
          colors={['#000', '#333', '#666']} 
          speed={0.3} 
          className="font-display text-[25rem] font-bold italic"
        >
          L'ATMOSPHÈRE
        </AuroraText>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-24 flex flex-col items-center gap-6 text-center">
          <BlurFade delay={100}>
            <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">Impressionen</span>
          </BlurFade>
          <BlurFade delay={200}>
            <h2 className="font-display text-4xl font-light tracking-tight text-zinc-900 italic sm:text-5xl lg:text-6xl">
              Ein Blick in unsere Welt
            </h2>
          </BlurFade>
        </div>

        <div className="grid min-h-0 grid-cols-1 gap-8 lg:min-h-250 lg:grid-cols-6 lg:grid-rows-5 lg:gap-12">
          {galleryImages.map((img, i) => (
            <BlurFade
              key={i}
              delay={300 + i * 150}
              className={img.className}
              direction="up"
            >
              <AmbientImage
                src={img.src}
                alt={img.alt}
                borderRadius="0"
                intensity={0.1}
                blur={100}
                className="h-full w-full grayscale-20 transition-all duration-[1.5s] hover:grayscale-0"
              />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
