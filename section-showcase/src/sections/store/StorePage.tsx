import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { AmbientImage } from '@components/ambient-image/ambient-image'
import { ShinyText } from '@components/shiny-text/shiny-text'
import { ProductV1 } from '../showcase/ProductV1'
import { ProductV2 } from '../showcase/ProductV2'
import { ProductV3 } from '../showcase/ProductV3'
import { Star, ArrowRight } from 'lucide-react'

type SelectedProduct = 'v1' | 'v2' | 'v3' | null

export function StorePage() {
  const [activeProduct, setActiveProduct] = useState<SelectedProduct>(null)

  // Sub-detail page rendering
  if (activeProduct === 'v1') {
    return <ProductV1 onBack={() => setActiveProduct(null)} />
  }
  if (activeProduct === 'v2') {
    return <ProductV2 onBack={() => setActiveProduct(null)} />
  }
  if (activeProduct === 'v3') {
    return <ProductV3 onBack={() => setActiveProduct(null)} />
  }

  return (
    <section className="bg-background py-24 transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-20">
          <BlurFade delay={100} direction="down">
            <span className="text-accent text-xs font-bold tracking-[0.4em] uppercase">
              Château Cellar
            </span>
          </BlurFade>
          <BlurFade delay={200} direction="down">
            <h1 className="font-display text-foreground mt-4 text-5xl font-light tracking-tight sm:text-6xl">
              Unsere Kollektion
            </h1>
          </BlurFade>
          <BlurFade delay={300}>
            <p className="text-muted-foreground mt-4 text-lg font-light leading-relaxed">
              Drei Lagen. Drei Geschichten. Drei exklusive Designs, kuratiert für Kenner edler Tropfen.
            </p>
          </BlurFade>
        </div>

        {/* 3-Column Storefront */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Column 1: Modern & Interactive */}
          <BlurFade delay={200} className="flex flex-col h-full">
            <div className="border-border bg-card/45 hover:border-accent/40 focus-within:ring-2 focus-within:ring-accent/50 flex flex-col justify-between h-full rounded-2xl border p-6 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div>
                {/* Visual */}
                <div className="relative mb-8 flex items-center justify-center rounded-xl overflow-hidden py-6 bg-radial from-accent/5 to-transparent">
                  <AmbientImage
                    src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80"
                    alt="Premium Red Wine Bottle"
                    borderRadius="1rem"
                    intensity={0.4}
                    blur={40}
                    className="aspect-3/4 w-44 shadow-lg"
                  />
                </div>
                
                {/* Meta */}
                <div className="text-accent flex items-center gap-1 mb-2">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    4.9 · Premium Selection
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-sans text-foreground text-2xl font-semibold tracking-tight">
                  Réserve Particulière
                </h3>
                <p className="text-accent text-sm font-medium mt-1">Vintage 2018</p>

                {/* Description */}
                <p className="text-muted-foreground mt-4 text-sm font-light leading-relaxed">
                  Ein kräftiger Bordeaux-Verschnitt mit samtigen Tanninen und reifen Kirschnoten. Reifte 18 Monate in Eichenfässern.
                </p>
              </div>

              {/* Price & Action */}
              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground block text-xs">Ab Hof</span>
                  <span className="text-foreground text-xl font-bold">89,00 €</span>
                </div>
                <button
                  onClick={() => setActiveProduct('v1')}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent/60 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none cursor-pointer"
                >
                  <span>Entdecken</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </BlurFade>

          {/* Column 2: Artisanal & Minimal */}
          <BlurFade delay={300} className="flex flex-col h-full">
            <div className="bg-[#fdfcf9] border border-zinc-100 flex flex-col justify-between h-full p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 text-zinc-900">
              <div>
                {/* Visual */}
                <div className="group relative mb-8 flex items-center justify-center py-6">
                  <div className="absolute -bottom-2 left-1/2 h-4 w-[40%] -translate-x-1/2 rounded-[50%] bg-black/5 blur-xl" />
                  <img
                    src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80"
                    alt="Grüner Veltliner Bottle"
                    className="relative z-10 w-36 transition-transform duration-500 group-hover:-translate-y-2"
                  />
                </div>

                {/* Meta */}
                <span className="mb-2 block text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                  Einzellage · Handernte
                </span>

                {/* Title */}
                <h3 className="font-display text-zinc-900 text-3xl font-light leading-tight tracking-tight">
                  Grüner Veltliner
                </h3>
                <p className="font-display italic text-zinc-600">
                  <ShinyText
                    duration={8}
                    shineColor="oklch(0.85 0.03 90 / 0.4)"
                    className="inline-block! text-zinc-700!"
                  >
                    Urgestein 2020
                  </ShinyText>
                </p>

                {/* Description */}
                <p className="text-zinc-500 mt-4 text-sm font-light leading-relaxed">
                  Ein Wein von zeitloser Eleganz. Mineralischer Urgesteinsboden, präzise Säure, endloser, feiner Abgang.
                </p>
              </div>

              {/* Price & Action */}
              <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <span className="text-zinc-400 block text-[9px] tracking-widest uppercase">Preis</span>
                  <span className="text-zinc-900 text-xl font-light tracking-tight">54,00 €</span>
                </div>
                <button
                  onClick={() => setActiveProduct('v2')}
                  className="border-b border-zinc-900 pb-0.5 text-xs font-bold tracking-[0.2em] text-zinc-900 uppercase hover:text-zinc-500 hover:border-zinc-300 transition-colors focus-visible:ring-zinc-400 focus-visible:ring-2 focus-visible:outline-none cursor-pointer"
                >
                  Detailansicht
                </button>
              </div>
            </div>
          </BlurFade>

          {/* Column 3: Editorial Spread */}
          <BlurFade delay={400} className="flex flex-col h-full">
            <div className="bg-white border border-zinc-200 flex flex-col justify-between h-full p-8 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 text-zinc-900">
              <div>
                {/* Visual */}
                <div className="relative mb-8 aspect-4/3 overflow-hidden bg-zinc-50 flex items-center justify-center border border-zinc-100">
                  <img
                    src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80"
                    alt="Loibenberg Smaragd Bottle"
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                  />
                  <span className="absolute bottom-2 left-3 text-[8px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                    Platte XII · Riede Loibenberg
                  </span>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2 mb-4">
                  <span className="text-[9px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
                    Fiche Technique
                  </span>
                  <span className="font-display text-xs italic text-zinc-400">№ 4 / 18</span>
                </div>

                {/* Title */}
                <span className="font-display block text-5xl font-light tracking-tighter text-zinc-900 mb-1">
                  ’21
                </span>
                <h3 className="font-display text-zinc-900 text-2xl font-light leading-tight tracking-tight">
                  Loibenberg <span className="italic">Smaragd</span>
                </h3>

                {/* Description */}
                <p className="text-zinc-500 mt-4 text-sm font-light leading-relaxed">
                  Rauch über nassem Stein, Quitte und weißer Pfeffer. Ausdrucksstarker Charakter aus alten Reben.
                </p>
              </div>

              {/* Price & Action */}
              <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <span className="text-zinc-400 block text-[9px] tracking-widest uppercase">Ab Hof</span>
                  <span className="text-zinc-900 text-xl font-light tracking-tight">€ 38,—</span>
                </div>
                <button
                  onClick={() => setActiveProduct('v3')}
                  className="group inline-flex items-center gap-3 pb-0.5 text-xs font-bold tracking-[0.2em] text-zinc-900 uppercase hover:text-zinc-500 transition-colors focus-visible:ring-zinc-400 focus-visible:ring-2 focus-visible:outline-none cursor-pointer"
                >
                  <span>Anfragen</span>
                  <span aria-hidden="true" className="h-px w-6 bg-zinc-900 transition-all duration-300 group-hover:w-10" />
                </button>
              </div>
            </div>
          </BlurFade>

        </div>
      </div>
    </section>
  )
}
