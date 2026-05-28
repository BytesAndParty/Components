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
    src: 'https://images.unsplash.com/photo-1504279589104-dbdf49c73cbc?w=800&q=80',
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
    <section className="relative bg-[#fdfcf9] py-32 px-6 overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none whitespace-nowrap">
        <AuroraText 
          colors={['#000', '#333', '#666']} 
          speed={0.3} 
          className="text-[25rem] font-display italic font-bold"
        >
          L'ATMOSPHÈRE
        </AuroraText>
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col gap-6 mb-24 items-center text-center">
          <BlurFade delay={100}>
            <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-zinc-400">Impressionen</span>
          </BlurFade>
          <BlurFade delay={200}>
            <h2 className="font-display text-6xl font-light text-zinc-900 tracking-tight italic">
              Ein Blick in unsere Welt
            </h2>
          </BlurFade>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 lg:grid-rows-5 gap-8 lg:gap-12 min-h-[1000px]">
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
                className="h-full w-full grayscale-[20%] hover:grayscale-0 transition-all duration-[1.5s]"
              />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
