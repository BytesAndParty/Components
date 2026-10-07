import { useState, useEffect, createContext, useContext } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaOptionsType, EmblaCarouselType, EmblaPluginType } from 'embla-carousel'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils'
import { useComponentMessages } from '../i18n'
import { MESSAGES, type CarouselMessages } from './messages'

// ─── Context ────────────────────────────────────────────────────────────────────

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: EmblaCarouselType | undefined
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedIndex: number
  scrollSnaps: number[]
  scrollTo: (index: number) => void
  opts?: EmblaOptionsType
  orientation?: 'horizontal' | 'vertical'
  m: CarouselMessages
}

const CarouselContext = createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = useContext(CarouselContext)
  if (!context) throw new Error('useCarousel must be used within a <Carousel>')
  return context
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export interface CarouselProps {
  opts?: EmblaOptionsType
  plugins?: EmblaPluginType[]
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: EmblaCarouselType) => void
  className?: string
  messages?: Partial<CarouselMessages>
  children: React.ReactNode
}

export function Carousel({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  className,
  messages,
  children,
}: CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const m = useComponentMessages(MESSAGES, messages)

  const scrollPrev = () => api?.scrollPrev()
  const scrollNext = () => api?.scrollNext()
  const scrollTo = (index: number) => api?.scrollTo(index)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollPrev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollNext()
    }
  }

  useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  useEffect(() => {
    if (!api) return

    const onSelect = (emblaApi: EmblaCarouselType) => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
      setScrollSnaps(emblaApi.scrollSnapList())
    }

    // Initialize state
    onSelect(api)

    api.on('reInit', onSelect)
    api.on('select', onSelect)

    return () => {
      api.off('reInit', onSelect)
      api.off('select', onSelect)
    }
  }, [api])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnaps,
        scrollTo,
        m,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        aria-label={m.region}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

export function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        className={cn(
          'flex',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          className
        )}
        {...props}
      />
    </div>
  )
}

export function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className
      )}
      {...props}
    />
  )
}

export function CarouselPrevious({ className, hide, ...props }: React.ComponentProps<'button'> & { hide?: boolean }) {
  const { orientation, scrollPrev, canScrollPrev, m } = useCarousel()

  if (hide) return null

  return (
    <button
      type="button"
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      className={cn(
        'absolute flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur-md transition-all hover:bg-muted after:absolute after:-inset-2 disabled:pointer-events-none disabled:opacity-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        orientation === 'horizontal'
          ? 'left-2 sm:-left-12 top-1/2 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{m.previous}</span>
    </button>
  )
}

export function CarouselNext({ className, hide, ...props }: React.ComponentProps<'button'> & { hide?: boolean }) {
  const { orientation, scrollNext, canScrollNext, m } = useCarousel()

  if (hide) return null

  return (
    <button
      type="button"
      disabled={!canScrollNext}
      onClick={scrollNext}
      className={cn(
        'absolute flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur-md transition-all hover:bg-muted after:absolute after:-inset-2 disabled:pointer-events-none disabled:opacity-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        orientation === 'horizontal'
          ? 'right-2 sm:-right-12 top-1/2 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      {...props}
    >
      <ChevronRight className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{m.next}</span>
    </button>
  )
}

// ─── Thumbnails ─────────────────────────────────────────────────────────────────

export function CarouselThumbs({ children, className }: { children: React.ReactNode; className?: string }) {
  const { orientation } = useCarousel()
  return (
    <div
      className={cn(
        'flex gap-2 py-4',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CarouselThumb({ index, className, children }: { index: number; className?: string; children: React.ReactNode }) {
  const { selectedIndex, scrollTo, m } = useCarousel()
  const isActive = selectedIndex === index

  return (
    <button
      type="button"
      onClick={() => scrollTo(index)}
      aria-label={m.goTo.replace('{n}', String(index + 1))}
      aria-current={isActive ? 'true' : undefined}
      className={cn(
        'border-border relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        // Der Rand markiert die Auswahl und braucht 3:1 (WCAG 1.4.11) — auf
        // --ring statt --accent, das auf dunklem Grund bis 2,2:1 abfällt.
        // Der weiche Halo daneben ist Deko und bleibt bei /20.
        isActive ? 'border-ring ring-ring/20 ring-2' : 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:grayscale-0',
        className
      )}
    >
      {children}
    </button>
  )
}
