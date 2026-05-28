import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { AddToCartButton } from '@components/add-to-cart-button/add-to-cart-button'
import { ShinyText } from '@components/shiny-text/shiny-text'
import { AuroraText } from '@components/aurora-text/aurora-text'

export function ProductV2() {
  const [selectedFormat, setSelectedFormat] = useState('750ml')

  return (
    <section className="relative bg-[#fdfcf9] py-32 px-6 overflow-hidden">
      {/* Very subtle background texture using AuroraText */}
      <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none rotate-90 origin-top-right translate-y-20">
        <AuroraText 
          colors={['#000', '#444', '#222']} 
          speed={0.5} 
          className="text-[12rem] font-bold tracking-tighter whitespace-nowrap"
        >
          AUTHENTIC · VINTAGE · TRADITION
        </AuroraText>
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          {/* Product Image - Pure & Focused */}
          <div className="flex justify-center items-center">
            <BlurFade delay={100} direction="up" className="w-full max-w-[450px]">
              <div className="relative group">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[60%] h-8 bg-black/5 blur-2xl rounded-[50%]" />
                <img 
                  src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1200&q=80" 
                  alt="Réserve Particulière 2018" 
                  className="w-full relative z-10 transition-transform duration-700 group-hover:translate-y-[-10px]"
                />
              </div>
            </BlurFade>
          </div>

          {/* Details - Extreme White Space & Component Precision */}
          <div className="flex flex-col gap-12">
            <div>
              <BlurFade delay={200} direction="up">
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-400 block mb-4">
                  Einzellage · Handernte
                </span>
              </BlurFade>
              <BlurFade delay={300} direction="up">
                <h2 className="font-display text-6xl font-light text-zinc-900 tracking-tight leading-[1.1]">
                  Réserve Particulière <br />
                  <span className="italic">
                    <ShinyText 
                      duration={10} 
                      shineColor="oklch(0.85 0.03 90 / 0.4)" 
                      className="!inline-block"
                    >
                      Vintage 2018
                    </ShinyText>
                  </span>
                </h2>
              </BlurFade>
            </div>

            <BlurFade delay={400} direction="up">
              <p className="text-xl leading-relaxed text-zinc-500 font-light max-w-lg">
                Ein Wein von zeitloser Eleganz. Komplex am Gaumen mit Noten von reifen Waldbeeren und einem Hauch von Zedernholz. Seine Kraft ist leise, sein Abgang endlos.
              </p>
            </BlurFade>

            <BlurFade delay={500} direction="up">
              <div className="flex flex-col gap-6">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">Format</span>
                <div className="flex gap-8">
                  {['375ml', '750ml', '1.5L'].map((format) => (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      className={`text-sm font-medium transition-all pb-1 border-b-2 ${
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
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-1">Preis</span>
                <span className="text-4xl font-display font-light text-zinc-900 tabular-nums">89,00 €</span>
              </div>
              
              <AddToCartButton 
                onClick={() => console.log('Added to cart')}
                bgColor="#18181b" 
                className="!rounded-none !px-12 !py-6 !text-base"
              />
            </BlurFade>

            <BlurFade delay={700} direction="up" className="grid grid-cols-2 gap-x-12 gap-y-8 pt-12 border-t border-zinc-100">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 block mb-1">Rebsorte</span>
                <p className="text-sm font-medium text-zinc-700">Grüner Veltliner</p>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 block mb-1">Alkohol</span>
                <p className="text-sm font-medium text-zinc-700">14.5% Vol.</p>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 block mb-1">Boden</span>
                <p className="text-sm font-medium text-zinc-700">Urgesteinsverwitterungsboden</p>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 block mb-1">Trinktemperatur</span>
                <p className="text-sm font-medium text-zinc-700">10 – 12 °C</p>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  )
}
