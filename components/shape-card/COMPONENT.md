# ShapeCard

Non-rectangular card primitive built on the new CSS `corner-shape` property (Chrome 139+, fallback-safe). Supports per-corner shape control and an optional circular cutout for badges/seals.

## Why this component

`border-radius` only rounds corners. `corner-shape` lets you pick *what kind* of curve — concave (`scoop`/`notch`), super-elliptic (`squircle`), straight (`bevel`), or none (`square`) — and unlocks card silhouettes that aren't possible with classic CSS:

- **`squircle`** — Apple-soft luxury (premium products, profile cards).
- **`scoop`** — concave dip, evokes chalices / wine-glass shoulders.
- **`notch`** — 90° concave cut, ticket / coupon aesthetics.
- **`bevel`** — straight diagonal, art-deco / industrial.
- **Mixed corners** — asymmetric layouts (e.g. `[scoop, scoop, squircle, squircle]` for a chalice-style top with refined bottom).

The optional **cutout slot** punches a perfect circular hole into the card via a `radial-gradient` mask. A drop-shadow on the wrapper traces the actual cutout edge (native `box-shadow` cannot follow masked elements). Use it for "Wein des Monats"-style seals, version-tags, NEW-stamps, etc.

## Browser Support

| Property | Status |
|---|---|
| `corner-shape` | Chrome/Edge/Brave 139+ (May 2026). Firefox/Safari: not yet. |
| `mask: radial-gradient(...)` | All modern browsers. |
| `filter: drop-shadow(...)` | All modern browsers. |

Fallback path: browsers without `corner-shape` ignore the property and render plain `border-radius` corners — visually softer than intended but never broken.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `shape` | `CornerShape \| [TL, TR, BR, BL]` | `'round'` | Single keyword or per-corner tuple. |
| `radius` | `number \| string` | `16` | Border-radius. Number → px. Strings (e.g. `"2rem 2rem 1rem 1rem"`) for asymmetric. |
| `cutout` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | — | Which corner gets the circular hole. |
| `cutoutSize` | `number` | `64` | Cutout diameter (px). |
| `cutoutInset` | `number` | `16` | Distance from the corner (px). |
| `cutoutGap` | `number` | `6` | Visual gap between hole edge and the slot content. |
| `cutoutSlot` | `ReactNode` | — | What to render in the hole (badge, seal, avatar). |
| `cornerSlot` | `CornerSlotConfig` | — | Rectangular **corner-fit slot**: a tag that fills a notched corner exactly (`{ corner, width, height, content }`). Uses `corner-shape: notch` + elliptical radius so native `box-shadow` follows correctly — no mask/filter trickery. Mutually exclusive with `cutout`. |
| `hoverLift` | `boolean` | `true` | Lift `translateY(-3px)` on hover. |
| `hoverAccent` | `boolean` | `true` | Border color shifts toward `--accent` on hover. |

`CornerShape` keywords: `round` · `squircle` · `scoop` · `notch` · `bevel` · `square`.

## How It Works

1. **Shape**: `corner-shape` + `border-radius` are set inline on the inner card. Both follow the React style flow — TS doesn't yet type `cornerShape`, so the inner style is cast through `Record`.
2. **Cutout**: a `radial-gradient` mask carves a transparent circle at the chosen corner. `WebkitMask` and `mask` are both set.
3. **Shadow under cutout**: native `box-shadow` would still trace the original rectangle. So when `cutout` is active, `box-shadow` on the inner is set to `none` and `filter: drop-shadow(...)` moves to the outer shell — the filter follows the masked silhouette correctly.
4. **Slot**: positioned absolutely over the hole, sized to `cutoutSize`, anchored by `cutoutInset`.

## Composition Examples

### Premium product card
```tsx
<ShapeCard shape="squircle" radius={28}>
  <ProductImage />
  <ProductBody />
</ShapeCard>
```

### Wine-glass silhouette
```tsx
<ShapeCard shape={['scoop', 'scoop', 'squircle', 'squircle']} radius="3rem 3rem 1.25rem 1.25rem">
  <WineCardContent />
</ShapeCard>
```

### Featured product with floating seal
```tsx
<ShapeCard
  shape="squircle"
  radius={28}
  cutout="top-right"
  cutoutSize={68}
  cutoutSlot={<WaxSeal>Wein des Monats</WaxSeal>}
>
  <ProductBody />
</ShapeCard>
```

### Corner-fit tag (puzzle-piece style)
```tsx
<ShapeCard
  shape="squircle"
  radius={28}
  cornerSlot={{
    corner: 'top-left',
    width: 96,
    height: 36,
    content: <Tag>Bio</Tag>,
  }}
>
  <ProductBody />
</ShapeCard>
```
The tag fills a 96×36 notched negative space at top-left while the other three corners stay squircle. Use this whenever the badge is a label/text/date rather than a circular stamp.

### Ticket / coupon
```tsx
<ShapeCard shape={['notch', 'notch', 'round', 'round']} radius={24}>
  <TicketContent />
</ShapeCard>
```

## Caveats

- **`overflow: hidden`** is forced on the inner. If you need overflowing children (e.g. tooltips, hover popovers), render them in a portal.
- **Mask + `box-shadow` conflict**: when `cutout` is set, the shell uses `filter: drop-shadow` instead. Slightly heavier on paint cost, but visually correct.
- **Drag/drop**: the masked region is fully transparent and not hit-testable — this is the intended behavior for the cutout area.

## Dependencies

None (React only).
