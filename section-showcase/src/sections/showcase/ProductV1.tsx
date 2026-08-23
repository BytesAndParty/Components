import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { AmbientImage } from '@components/ambient-image/ambient-image'
import { AddToCartButton } from '@components/add-to-cart-button/add-to-cart-button'
import { Star, ArrowLeft } from 'lucide-react'

export interface ProductV1Props {
  onBack?: () => void
}

export function ProductV1({ onBack }: ProductV1Props) {
  const [selectedSize, setSelectedSize] = useState('750ml')

  return (
    <section className="bg-background py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {onBack && (
          <BlurFade delay={50} direction="down" className="mb-8">
            <button
              onClick={onBack}
              className="border-border text-muted-foreground hover:text-foreground hover:border-accent/40 focus-visible:ring-ring bg-card/50 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <ArrowLeft size={16} />
              <span>Zurück zum Sortiment</span>
            </button>
          </BlurFade>
        )}
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
                className="mx-auto aspect-3/4 max-w-md shadow-2xl"
              />
            </BlurFade>
          </div>

          {/* Content Side */}
          <div className="flex w-full flex-col lg:w-1/2">
            <BlurFade delay={200}>
              <div className="text-accent flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                <span className="text-muted-foreground ml-2 text-xs font-bold tracking-widest uppercase">
                  Excellent · 4.9/5
                </span>
              </div>
            </BlurFade>

            <BlurFade delay={300}>
              <h2 className="font-display text-foreground mt-4 text-5xl font-medium tracking-tight sm:text-6xl">
                Réserve Particulière <br />
                <span className="text-accent italic">Vintage 2018</span>
              </h2>
            </BlurFade>

            <BlurFade delay={400}>
              <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                Ein kraftvoller Körper trifft auf seidige Tannine. Noten von dunkler Kirsche, Tabak und einem Hauch Vanille. Achtzehn Monate in französischen Eichenfässern gereift.
              </p>
            </BlurFade>

            <BlurFade delay={500} className="mt-10">
              <div className="flex flex-col gap-4">
                <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">Format wählen</span>
                <div className="flex gap-3">
                  {['375ml', '750ml', '1.5L'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-full border px-6 py-2 text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-accent bg-accent/5 text-accent'
                          : 'border-border text-muted-foreground hover:border-foreground bg-transparent'
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
                <span className="text-muted-foreground text-sm line-through">129.00 €</span>
                <span className="font-display text-foreground text-3xl font-medium">89.00 €</span>
              </div>
              
              <AddToCartButton 
                onClick={() => console.log('Added to cart')} 
                className="px-10! py-4! text-base!"
              />
            </BlurFade>
            
            <BlurFade delay={700} className="border-border mt-12 border-t pt-8">
              <div className="grid grid-cols-1 gap-8 text-sm sm:grid-cols-2">
                <div>
                  <span className="text-foreground font-bold">Region:</span>
                  <p className="text-muted-foreground">Bordeaux, Frankreich</p>
                </div>
                <div>
                  <span className="text-foreground font-bold">Alkohol:</span>
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
