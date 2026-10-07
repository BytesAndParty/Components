# Carousel

High-end, touch-enabled carousel component based on `embla-carousel`. Features synchronized thumbnails, keyboard navigation, and seamless integration with the wine showcase's view transitions.

## Features

- **Touch & Drag:** Native feeling inertia and bounce.
- **Accessible:** Arrow-key navigation, named `region` landmark, localized button labels (de/en), visible focus ring on arrows and thumbs, `aria-current` on the active thumb. All buttons are `type="button"`, so they never submit a surrounding form.
- **Arrows on every screen size:** 32 px visible, 46 px hit area (invisible `::after`, inset from inside the 1 px border). Below `sm` they sit inside the slide edges, from `sm` on 48 px outside. Glass background (`bg-card/80` + blur) keeps them readable over photos. A disabled arrow is invisible and lets touches through, so it never blocks swiping.
- **Thumbnails:** Integrated thumb-sync logic for product galleries.
- **Orientation:** Supports both horizontal and vertical scrolling.
- **View Transitions:** Optimized for morphing the primary slide image.

## Usage

```tsx
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext,
  CarouselThumbs,
  CarouselThumb
} from '@components/carousel/carousel'

export function ProductGallery() {
  return (
    <Carousel>
      <CarouselContent>
        <CarouselItem>Slide 1</CarouselItem>
        <CarouselItem>Slide 2</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      
      <CarouselThumbs>
        <CarouselThumb index={0}>Thumb 1</CarouselThumb>
        <CarouselThumb index={1}>Thumb 2</CarouselThumb>
      </CarouselThumbs>
    </Carousel>
  )
}
```

## Props

### Carousel
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `opts` | `EmblaOptionsType` | `undefined` | Embla options (loop, speed, etc.) |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Scroll direction |
| `plugins` | `EmblaPluginType[]` | `undefined` | Embla plugins (autoplay, etc.) |
| `setApi` | `(api: EmblaCarouselType) => void` | `undefined` | Callback to get the Embla API instance |
| `className` | `string` | — | Classes on the carousel region |
| `messages` | `Partial<CarouselMessages>` | — | i18n override: `region`, `previous`, `next`, `goTo` (`{n}` = 1-based slide number) |
| `children` | `ReactNode` | required | Content, previous/next buttons and thumbs |

### CarouselPrevious / CarouselNext
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `hide` | `boolean` | `false` | Renders nothing. Only together with another single-tap way to change slides (thumbs, dots): swiping alone fails WCAG 2.5.1. To hide them on mobile only, pass `className="max-sm:hidden"` instead |
| …rest | `ComponentProps<'button'>` | — | Forwarded to the `<button>`; disabled automatically at the ends |

`CarouselContent` and `CarouselItem` forward all `<div>` props; `CarouselThumbs` takes `children` and `className`.

### CarouselThumb
| Prop | Type | Description |
| :--- | :--- | :--- |
| `index` | `number` | The slide index this thumb controls. The button is labelled with `goTo` ("Zu Folie {n}"), so images inside can use `alt=""` |
| `children` | `ReactNode` | Thumb content |
| `className` | `string` | Additional classes |

## Dependencies

- `embla-carousel-react` (+ `embla-carousel` types) — scroll engine
- `lucide-react` — arrow icons
- `cn()` from `components/lib/utils`, `useComponentMessages` from `components/i18n`
