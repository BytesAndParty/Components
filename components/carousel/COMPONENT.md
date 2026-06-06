# Carousel

High-end, touch-enabled carousel component based on `embla-carousel`. Features synchronized thumbnails, keyboard navigation, and seamless integration with the wine showcase's view transitions.

## Features

- **Touch & Drag:** Native feeling inertia and bounce.
- **Accessible:** Keyboard navigation and ARIA roles built-in.
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
| `plugins` | `any[]` | `undefined` | Embla plugins (autoplay, etc.) |
| `setApi` | `(api: EmblaCarouselType) => void` | `undefined` | Callback to get the Embla API instance |

### CarouselThumb
| Prop | Type | Description |
| :--- | :--- | :--- |
| `index` | `number` | The slide index this thumb controls |
