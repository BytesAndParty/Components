# Fehlende Animated Icons (Lottie)

Quelle: [useanimations.com](https://useanimations.com/)

## Fehlend

### Prio 1

| Icon | Zweck |
|---|---|
| ~~**Cart / Shopping Bag**~~ | ✅ Vorhanden |
| ~~**Arrow / Chevron**~~ | ✅ `ChevronDownIconCss` / `ChevronRightIconCss` in `animated-icons.tsx` |

### Prio 2

| Icon | Zweck |
|---|---|
| ~~**User / Account**~~ | ✅ `UserIconCss` in `animated-icons.tsx` |
| ~~**Star**~~ | ✅ `StarIconCss` in `animated-icons.tsx` |
| ~~**Plus / Minus**~~ | ✅ `PlusIconCss` / `MinusIconCss` in `animated-icons.tsx` |
| ~~**Truck / Delivery**~~ | ✅ `TruckIconCss` in `animated-icons.tsx` |
| ~~**Tag / Discount**~~ | ✅ `TagIconCss` in `animated-icons.tsx` |

## Alle CSS-Icons (Micro-Interaction via hover)

Alle folgenden Icons sind als CSS-animierte SVGs in `components/animated-icons/animated-icons.tsx` umgesetzt:

| Export | Animation |
|---|---|
| `SunIconCss` | Rays rotieren |
| `MoonIconCss` | Rocking + Sterne twinkeln |
| `StarIconCss` | Spin + Glow |
| `WineIconCss` | Tilt + Liquid slosh |
| `ChevronDownIconCss` | Bounce nach unten |
| `ChevronRightIconCss` | Bounce nach rechts |
| `UserIconCss` | Kopf popt hoch |
| `PlusIconCss` | Rotate 45° + scale |
| `MinusIconCss` | Horizontal stretch |
| `TruckIconCss` | Gleitet nach rechts |
| `TagIconCss` | Pendelt/swing |

## Produkt-Kennzeichnung

Separates Badge-Komponent: `components/product-badge/product-badge.tsx`

| Variant | Farbe | Effekt |
|---|---|---|
| `new` | Grün | Entrance-bounce + Shimmer on hover |
| `sale` | Rot/Rose | Entrance-bounce + Shimmer on hover |
| `low-stock` | Amber | Entrance-bounce + Pulsierender Punkt |
