import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { AddToCartButton } from '@components/add-to-cart-button/add-to-cart-button'
import { ShinyText } from '@components/shiny-text/shiny-text'
import { AuroraText } from '@components/aurora-text/aurora-text'

export function ProductV2() {
  const [selectedFormat, setSelectedFormat] = useState('750ml')

  return (
    <section className="relative overflow-hidden bg-[#fdfcf9] px-6 py-32">
      {/* Very subtle background texture using AuroraText */}
      <div className="pointer-events-none absolute top-0 right-0 origin-top-right translate-y-20 rotate-90 opacity-[0.03]">
        <AuroraText 
          colors={['#000', '#444', '#222']} 
          speed={0.5} 
          className="text-[12rem] font-bold tracking-tighter whitespace-nowrap"
        >
          AUTHENTIC · VINTAGE · TRADITION
        </AuroraText>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-24 lg:grid-cols-2">
          
          {/* Product Image - Pure & Focused */}
          <div className="flex items-center justify-center">
            <BlurFade delay={100} direction="up" className="w-full max-w-[450px]">
              <div className="group relative">
                <div className="absolute -bottom-10 left-1/2 h-8 w-[60%] -translate-x-1/2 rounded-[50%] bg-black/5 blur-2xl" />
                <img 
                  src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1200&q=80" 
                  alt="Réserve Particulière 2018" 
                  className="relative z-10 w-full transition-transform duration-700 group-hover:translate-y-[-10px]"
                />
              </div>
            </BlurFade>
          </div>

          {/* Details - Extreme White Space & Component Precision */}
          <div className="flex flex-col gap-12">
            <div>
              <BlurFade delay={200} direction="up">
                <span className="mb-4 block text-[10px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
                  Einzellage · Handernte
                </span>
              </BlurFade>
              <BlurFade delay={300} direction="up">
                <h2 className="font-display text-6xl leading-[1.1] font-light tracking-tight text-zinc-900">
                  Réserve Particulière <br />
                  <span className="italic">
                    <ShinyText 
                      duration={10} 
                      shineColor="oklch(0.85 0.03 90 / 0.4)" 
                      className="inline-block!"
                    >
                      Vintage 2018
                    </ShinyText>
                  </span>
                </h2>
              </BlurFade>
            </div>

            <BlurFade delay={400} direction="up">
              <p className="max-w-lg text-xl leading-relaxed font-light text-zinc-500">
                Ein Wein von zeitloser Eleganz. Komplex am Gaumen mit Noten von reifen Waldbeeren und einem Hauch von Zedernholz. Seine Kraft ist leise, sein Abgang endlos.
              </p>
            </BlurFade>

            <BlurFade delay={500} direction="up">
              <div className="flex flex-col gap-6">
                <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Format</span>
                <div className="flex gap-8">
                  {['375ml', '750ml', '1.5L'].map((format) => (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      className={`border-b-2 pb-1 text-sm font-medium transition-all ${
                        selectedFormat === format
                          ? 'border-zinc-900 text-zinc-900'
                          : 'border-transparent text-zinc-300 hover:text-zinc-500'
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={600} direction="up" className="flex items-center gap-16 pt-8">
              <div className="flex flex-col">
                <span className="mb-1 text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Preis</span>
                <span className="font-display text-4xl font-light text-zinc-900 tabular-nums">89,00 €</span>
              </div>
              
              <AddToCartButton 
                onClick={() => console.log('Added to cart')}
                bgColor="#18181b" 
                className="rounded-none! px-12! py-6! text-base!"
              />
            </BlurFade>

            <BlurFade delay={700} direction="up" className="grid grid-cols-2 gap-x-12 gap-y-8 border-t border-zinc-100 pt-12">
              <div>
                <span className="mb-1 block text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Rebsorte</span>
                <p className="text-sm font-medium text-zinc-700">Grüner Veltliner</p>
              </div>
              <div>
                <span className="mb-1 block text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Alkohol</span>
                <p className="text-sm font-medium text-zinc-700">14.5% Vol.</p>
              </div>
              <div>
                <span className="mb-1 block text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Boden</span>
                <p className="text-sm font-medium text-zinc-700">Urgesteinsverwitterungsboden</p>
              </div>
              <div>
                <span className="mb-1 block text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Trinktemperatur</span>
                <p className="text-sm font-medium text-zinc-700">10 – 12 °C</p>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  )
}
