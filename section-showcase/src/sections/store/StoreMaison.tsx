import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { ProductV6 } from '../showcase/ProductV6'
import { WineCardEditorial } from './cards/WineCardEditorial'
import type { WineCardData } from './cards/types'

/**
 * Maison Editorial — das Sortiment als Magazin-Register. Cream-Grund, Maison-Kopf mit
 * übergroßer Serif, dann ein Raster aus WineCardEditorial-Karten (aus StorePage
 * herausgelöst). Jede Position öffnet die ProductV6-Detailseite. Distinkt zu
 * StorePage (3 Designs) und StoreCave/Nocturne.
 */

const BOTTLE = 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80'

const WINES: Array<{ wine: WineCardData; plate: string; fiche: string }> = [
  {
    wine: {
      name: 'Loibenberg Smaragd',
      vintage: 2021,
      lage: 'Ried Loibenberg',
      price: '€ 38,—',
      description: 'Rauch über nassem Stein, Quitte und weißer Pfeffer. Charakter aus alten Reben.',
      imageSrc: BOTTLE,
      imageAlt: 'Loibenberg Smaragd',
    },
    plate: 'Platte I · Loibenberg',
    fiche: '№ 1 / 06',
  },
  {
    wine: {
      name: 'Grüner Veltliner',
      vintage: 2023,
      lage: 'Ried Kreutles',
      price: '€ 19,—',
      description: 'Weißer Pfeffer, grüner Apfel, knackige Frische — der Alltagsklassiker.',
      imageSrc: BOTTLE,
      imageAlt: 'Grüner Veltliner',
    },
    plate: 'Platte II · Kreutles',
    fiche: '№ 2 / 06',
  },
  {
    wine: {
      name: 'Riesling Federspiel',
      vintage: 2022,
      lage: 'Ried Pfaffenberg',
      price: '€ 22,—',
      description: 'Zitrus, Pfirsich, Feuerstein. Straffer Terrassenwein mit Länge.',
      imageSrc: BOTTLE,
      imageAlt: 'Riesling Federspiel',
    },
    plate: 'Platte III · Pfaffenberg',
    fiche: '№ 3 / 06',
  },
  {
    wine: {
      name: 'Blaufränkisch Reserve',
      vintage: 2020,
      lage: 'Leithaberg',
      price: '€ 32,—',
      description: 'Brombeere, Schokolade, feine Tannine. Achtzehn Monate im Barrique.',
      imageSrc: BOTTLE,
      imageAlt: 'Blaufränkisch Reserve',
    },
    plate: 'Platte IV · Leithaberg',
    fiche: '№ 4 / 06',
  },
  {
    wine: {
      name: 'Zweigelt vom Urgestein',
      vintage: 2022,
      lage: 'Ried Steinriegl',
      price: '€ 16,—',
      description: 'Kirsche, Pflaume, weich und fruchtbetont. Der offene Allrounder.',
      imageSrc: BOTTLE,
      imageAlt: 'Zweigelt vom Urgestein',
    },
    plate: 'Platte V · Steinriegl',
    fiche: '№ 5 / 06',
  },
  {
    wine: {
      name: 'Rosé de Saignée',
      vintage: 2023,
      lage: 'Ried Höhereck',
      price: '€ 17,—',
      description: 'Erdbeere, Wassermelone, trocken und belebend. Sommer in der Flasche.',
      imageSrc: BOTTLE,
      imageAlt: 'Rosé de Saignée',
    },
    plate: 'Platte VI · Höhereck',
    fiche: '№ 6 / 06',
  },
]

export function StoreMaison() {
  const [active, setActive] = useState(false)

  if (active) {
    return <ProductV6 onBack={() => setActive(false)} />
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#fdfcf9] px-6 py-24 lg:px-16 lg:py-32">
      {/* Vertical meta rail — right edge */}
      <div className="absolute top-1/2 right-6 hidden -translate-y-1/2 lg:block">
        <BlurFade delay={900} direction="left">
          <span className="block rotate-180 text-[9px] font-bold tracking-[0.45em] whitespace-nowrap text-zinc-400 uppercase [writing-mode:vertical-rl]">
            Das Sortiment · MMXXVI
          </span>
        </BlurFade>
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-14 lg:mb-20">
          <BlurFade delay={100} direction="up">
            <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">Der Keller</span>
          </BlurFade>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <BlurFade delay={250} direction="up">
              <h2 className="font-display text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.88] font-light tracking-tighter text-zinc-900">
                Die <span className="italic">Weine.</span>
              </h2>
            </BlurFade>
            <BlurFade delay={400} direction="up">
              <p className="max-w-xs text-sm leading-relaxed font-light text-zinc-500">
                Sieben Rieden, ein Jahrgangsheft. Jede Flasche trägt ihre Platte.
              </p>
            </BlurFade>
          </div>
          <BlurFade delay={500} className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">Sechs Positionen</span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">Jahrgang 2020–2023</span>
          </BlurFade>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {WINES.map((item, i) => (
            <BlurFade key={item.wine.name} delay={550 + i * 100} direction="up" className="flex flex-col">
              <WineCardEditorial wine={item.wine} plate={item.plate} fiche={item.fiche} onSelect={() => setActive(true)} />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
