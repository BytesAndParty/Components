# Navbar

Full-featured navigation system with sections, dropdowns, mega menus, mobile slide-in panel, and scroll-aware transparency.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Scroll-aware background** | When `transparent` is enabled, the navbar starts transparent and transitions to a solid blurred background after passing `scrollThreshold`. |
| **Backdrop blur** | Background uses `backdrop-filter: blur(12px) saturate(1.2)` for a frosted glass effect. |
| **Dropdown entrance** | Dropdown panels fade in with a slight upward slide (opacity + y via `motion/react`). |
| **Chevron rotation** | The dropdown trigger's chevron rotates 180° when the panel is open. |
| **Mobile panel slide** | The mobile menu slides in from the right with spring physics (`damping: 30, stiffness: 300`). |
| **Backdrop overlay** | Mobile menu includes a blurred darkened backdrop that closes the menu on click. |
| **Hover delay close** | Dropdowns use a 150ms timeout on mouse leave, so the menu doesn't close when briefly moving between trigger and panel. |
| **Active indicator** | Active `NavbarItem` shows a 2px accent-colored underline at the bottom. |
| **Item hover** | Nav items transition from muted to full text color on hover (200ms). |
| **Icon badge** | `NavbarIconButton` supports a count badge with 99+ cap. |
| **Keyboard dismiss** | Escape closes dropdowns and mobile menu. |

## Architecture

The navbar uses a **Context + composable parts** pattern:

- `Navbar` — Root provider (scroll state, mobile state, dropdown state)
- `NavbarSection` — Left/center/right layout sections
- `NavbarLogo` — Styled logo link
- `NavbarItem` — Individual nav links/buttons
- `NavbarDropdown` — Hover/click dropdown with trigger
- `NavbarDropdownGroup` — Group heading within a dropdown
- `NavbarDropdownItem` — Individual dropdown option (with icon/subtitle support)
- `NavbarIconButton` — Icon-only button with optional badge
- `NavbarMobileToggle` — Hamburger/close toggle
- `NavbarMobileMenu` — Slide-in mobile panel with body scroll lock
- `NavbarDesktopOnly` / `NavbarMobileOnly` — Responsive visibility wrappers
- `NavbarDivider` — Visual separator

## Props (Navbar root)

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Navbar content (sections, items, etc.) |
| `transparent` | `boolean` | `false` | Start with transparent background |
| `sticky` | `boolean` | `true` | Fix to top of viewport (`position: fixed`) |
| `height` | `number` | `64` | Navbar height in px |
| `scrollThreshold` | `number` | `20` | Scroll distance before background appears |
| `bgColor` | `string` | `'var(--background)'` | Background color when solid |
| `borderColor` | `string` | `'var(--border)'` | Border color |
| `messages` | `Partial<NavbarMessages>` | — | i18n overrides for the landmark label and the open/close menu labels |
| `className` | `string` | — | Classes on the `<nav>` |
| `style` | `CSSProperties` | — | Inline styles on the `<nav>` |

## Props (Parts)

All parts accept `className` and `style`, except `NavbarDivider` (no props) and the Desktop/Mobile-only wrappers (`style` only).

| Part | Props |
|---|---|
| `NavbarSection` | `position: 'left' \| 'center' \| 'right'` (required), `children` |
| `NavbarLogo` | `href` (default `'/'`), `children` |
| `NavbarItem` | `href?`, `active?` (accent underline), `onClick?`, `children` |
| `NavbarDropdown` | `id` (required, unique), `trigger` (required), `align?: 'left' \| 'center' \| 'right'` (default `'center'`), `mega?` (full-width, default `false`), `children` |
| `NavbarDropdownGroup` | `title?` (group heading), `children` |
| `NavbarDropdownItem` | `href?`, `subtitle?`, `icon?`, `onClick?`, `children` |
| `NavbarIconButton` | `aria-label` (required), `badge?` (count, capped at 99+), `onClick?`, `children` |
| `NavbarMobileToggle` | — (labels from the root `messages`) |
| `NavbarMobileMenu` | `children` |
| `NavbarDesktopOnly` / `NavbarMobileOnly` | `children` |

## Dependencies

- `motion` (`motion/react`) — Dropdown and mobile menu animations (AnimatePresence, motion.div)

## Responsive Behavior

Responsive styles are injected as a `<style>` element with `@media (max-width: 768px)` queries. Desktop sections hide on mobile; the mobile toggle shows. The injection uses an ID-deduplicated approach consistent with other components.
