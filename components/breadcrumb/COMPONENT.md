# Breadcrumb

Composable breadcrumb navigation primitives following the shadcn pattern — individual building blocks that can be assembled freely.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Link hover** | Breadcrumb links transition their color on hover via CSS transition (200ms). |

## How It Works

This is a **primitives-based API** — each part of the breadcrumb is a separate exported component:

- `Breadcrumb` — `<nav>` wrapper with `aria-label="breadcrumb"`
- `BreadcrumbList` — `<ol>` with flex layout and gap
- `BreadcrumbItem` — `<li>` container for each breadcrumb entry
- `BreadcrumbLink` — `<a>` with hover transition
- `BreadcrumbPage` — `<span>` for the current page (with `aria-current="page"`)
- `BreadcrumbSeparator` — `<li>` with ChevronRight icon (customizable via children)
- `BreadcrumbEllipsis` — `<span>` with MoreHorizontal icon and sr-only "More" text

All components use `data-slot` attributes for external styling hooks and accept `style` overrides.

`Breadcrumb` additionally takes `messages?: Partial<BreadcrumbMessages>` (i18n overrides for the nav `aria-label` and the ellipsis "More" text) and forwards all other `<nav>` props.

## Exports

`Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`

## Dependencies

- `lucide-react` — ChevronRight, MoreHorizontal icons

## Accessibility

- Nav has a localized `aria-label` (`messages.ariaLabel`)
- Current page has `aria-current="page"`
- Separators and ellipsis have `aria-hidden="true"` and `role="presentation"`
- Ellipsis includes a visually hidden, localized "More" text (`messages.more`) for screen readers
