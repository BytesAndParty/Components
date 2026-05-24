# ProductTag

Highly visual, animated labels for highlighting product status, certifications, or promotions. Designed for storefronts, these tags include entrance animations, hover effects, and contextual elements like pulsing dots or shimmering gradients.

## Features

- **Thematic Variants**: Optimized styles for `new`, `sale`, `low-stock`, `bestseller`, `limited`, `organic`, `vegan`, and `award`.
- **Contextual UI**:
    - **Shimmer**: Glossy hover effect for high-priority variants (`new`, `sale`, `bestseller`, `award`).
    - **Pulsing Dot**: Animated status indicator for urgent variants (`low-stock`).
- **Dynamic Sale Labels**: Automatically formats discount numbers (e.g., `20` → `−20%`) when using the `sale` variant.
- **Entrance Animation**: Smooth scale and rotate "pop-in" effect on mount.
- **A11y & Performance**:
    - Respects `prefers-reduced-motion`.
    - `aria-hidden` decorations (shimmer, dots).
    - Self-injecting CSS to minimize external bundle dependencies.
- **Tag Grouping**: Dedicated `ProductTagGroup` for clean, wrapped layouts of multiple badges.

## How It Works

1. **Configuration Map**: Uses an internal `variantConfig` to define background colors, glow intensity, and whether to enable shimmer or dots per variant.
2. **CSS Injection**: A small block of optimized CSS keyframes is injected into the document head once on first use, ensuring animations are available without global CSS imports.
3. **i18n Integration**: Default labels (e.g., "NEU" vs "NEW") are managed via the design engine's `useComponentMessages` hook.
4. **Layout**: Uses `inline-flex` for precise alignment of text and decorative elements like the pulse dot.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `ProductTagVariant` | — | One of: `new`, `sale`, `low-stock`, `bestseller`, `limited`, `organic`, `vegan`, `award`. |
| `discount` | `number` | — | Numeric discount value. Only applies to `sale` variant. |
| `label` | `string` | — | Explicit label override (bypasses i18n and discount logic). |
| `messages` | `Partial<ProductTagMessages>` | — | Custom message overrides for variant labels. |
| `className` | `string` | — | Additional CSS classes. |

## Usage

### Basic Storefront Implementation

```tsx
import { ProductTag, ProductTagGroup } from '@components/product-tag'

function ProductCard({ product }) {
  return (
    <div className="relative">
      <ProductTagGroup className="absolute top-2 left-2">
        {product.isNew && <ProductTag variant="new" />}
        {product.discount > 0 && (
          <ProductTag variant="sale" discount={product.discount} />
        )}
        {product.stock < 5 && <ProductTag variant="low-stock" />}
      </ProductTagGroup>
      <img src={product.image} alt={product.name} />
    </div>
  )
}
```

### Static Label Override

```tsx
<ProductTag variant="award" label="Winner 2024" />
```

## Dependencies

- `@components/i18n` — Internationalization hooks
