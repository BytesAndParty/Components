import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { AmbientImage } from '@components/ambient-image/ambient-image'
import { AddToCartButton } from '@components/add-to-cart-button/add-to-cart-button'
import { Star } from 'lucide-react'

export function ProductV1() {
  const [selectedSize, setSelectedSize] = useState('750ml')

  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start">
          {/* Image Side */}
          <div className="w-full lg:w-1/2">
            <BlurFade delay={100} direction="right">
              <AmbientImage
                src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1200&q=80"
                alt="Premium Red Wine Bottle"
                borderRadius="1.5rem"
                intensity={0.5}
                blur={60}
                className="mx-auto aspect-[3/4] max-w-md shadow-2xl"
              />
            </BlurFade>
          </div>

          {/* Content Side */}
          <div className="flex w-full flex-col lg:w-1/2">
            <BlurFade delay={200}>
              <div className="flex items-center gap-1 text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                <span className="ml-2 text-xs font-bold tracking-widest uppercase text-muted-foreground">
                  Excellent · 4.9/5
                </span>
              </div>
            </BlurFade>

            <BlurFade delay={300}>
              <h2 className="mt-4 font-display text-5xl font-medium tracking-tight text-foreground sm:text-6xl">
                Réserve Particulière <br />
                <span className="text-accent italic">Vintage 2018</span>
              </h2>
            </BlurFade>

            <BlurFade delay={400}>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Ein kraftvoller Körper trifft auf seidige Tannine. Noten von dunkler Kirsche, Tabak und einem Hauch Vanille. Achtzehn Monate in französischen Eichenfässern gereift.
              </p>
            </BlurFade>

            <BlurFade delay={500} className="mt-10">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Format wählen</span>
                <div className="flex gap-3">
                  {['375ml', '750ml', '1.5L'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-full border px-6 py-2 text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-accent bg-accent/5 text-accent'
                          : 'border-border bg-transparent text-muted-foreground hover:border-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={600} className="mt-12 flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground line-through">129.00 €</span>
                <span className="text-3xl font-display font-medium text-foreground">89.00 €</span>
              </div>
              
              <AddToCartButton 
                onClick={() => console.log('Added to cart')} 
                className="!py-4 !px-10 !text-base"
              />
            </BlurFade>
            
            <BlurFade delay={700} className="mt-12 border-t border-border pt-8">
              <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                  <span className="font-bold text-foreground">Region:</span>
                  <p className="text-muted-foreground">Bordeaux, Frankreich</p>
                </div>
                <div>
                  <span className="font-bold text-foreground">Alkohol:</span>
                  <p className="text-muted-foreground">14.5% Vol.</p>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  )
}
