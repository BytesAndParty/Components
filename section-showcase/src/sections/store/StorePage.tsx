import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { ProductV1 } from '../showcase/ProductV1'
import { ProductV2 } from '../showcase/ProductV2'
import { ProductV3 } from '../showcase/ProductV3'
import { WineCardModern } from './cards/WineCardModern'
import { WineCardArtisanal } from './cards/WineCardArtisanal'
import { WineCardEditorial } from './cards/WineCardEditorial'
import type { WineCardData } from './cards/types'

type SelectedProduct = 'v1' | 'v2' | 'v3' | null

const BOTTLE = 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80'

const MODERN: WineCardData = {
  name: 'Réserve Particulière',
  vintage: 2018,
  lage: 'Bordeaux · Frankreich',
  price: '89,00 €',
  description:
    'Ein kräftiger Bordeaux-Verschnitt mit samtigen Tanninen und reifen Kirschnoten. Reifte 18 Monate in Eichenfässern.',
  imageSrc: BOTTLE,
  imageAlt: 'Premium Red Wine Bottle',
}

const ARTISANAL: WineCardData = {
  name: 'Grüner Veltliner',
  vintage: 2020,
  edition: 'Urgestein',
  lage: 'Einzellage · Handernte',
  price: '54,00 €',
  description:
    'Ein Wein von zeitloser Eleganz. Mineralischer Urgesteinsboden, präzise Säure, endloser, feiner Abgang.',
  imageSrc: BOTTLE,
  imageAlt: 'Grüner Veltliner Bottle',
}

const EDITORIAL: WineCardData = {
  name: 'Loibenberg Smaragd',
  vintage: 2021,
  lage: 'Riede Loibenberg',
  price: '€ 38,—',
  description:
    'Rauch über nassem Stein, Quitte und weißer Pfeffer. Ausdrucksstarker Charakter aus alten Reben.',
  imageSrc: BOTTLE,
  imageAlt: 'Loibenberg Smaragd Bottle',
}

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
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <BlurFade delay={100} direction="down">
            <span className="text-accent text-xs font-bold tracking-[0.4em] uppercase">Château Cellar</span>
          </BlurFade>
          <BlurFade delay={200} direction="down">
            <h1 className="font-display text-foreground mt-4 text-5xl font-light tracking-tight sm:text-6xl">
              Unsere Kollektion
            </h1>
          </BlurFade>
          <BlurFade delay={300}>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed font-light">
              Drei Lagen. Drei Geschichten. Drei exklusive Designs, kuratiert für Kenner edler Tropfen.
            </p>
          </BlurFade>
        </div>

        {/* 3-Column Storefront — je Spalte ein eigenständiges Card-Design */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <BlurFade delay={200} className="flex h-full flex-col">
            <WineCardModern wine={MODERN} rating="4.9 · Premium Selection" onSelect={() => setActiveProduct('v1')} />
          </BlurFade>
          <BlurFade delay={300} className="flex h-full flex-col">
            <WineCardArtisanal wine={ARTISANAL} onSelect={() => setActiveProduct('v2')} />
          </BlurFade>
          <BlurFade delay={400} className="flex h-full flex-col">
            <WineCardEditorial
              wine={EDITORIAL}
              plate="Platte XII · Riede Loibenberg"
              fiche="№ 4 / 18"
              onSelect={() => setActiveProduct('v3')}
            />
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
