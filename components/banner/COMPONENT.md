# Banner

Dismissible notification banner with configurable colors and an optional link sub-component.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Dismiss** | Close button removes the banner from the DOM (state-driven, not animated). |
| **Link hover** | `BannerLink` reduces opacity to 0.8 on hover for subtle feedback. |
| **Close button hover** | Dismiss button transitions from 70% to 100% opacity on hover. |
| **Arrow icon** | `BannerLink` includes an inline arrow SVG for visual affordance. |

## How It Works

1. **Visibility state**: A simple `useState(true)` controls visibility. When dismissed, the component returns `null`.
2. **Composable API**: `Banner` renders the container; `BannerLink` is a separate export for composing links inside the banner content.
3. **Theming**: `bgColor` defaults to `var(--accent)`, integrating with the project's accent system.

## Props

### Banner

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Banner content |
| `bgColor` | `string` | `'var(--accent)'` | Background color |
| `textColor` | `string` | `'#ffffff'` | Text color |
| `dismissible` | `boolean` | `true` | Show close button |
| `onDismiss` | `() => void` | — | Callback when dismissed |

### BannerLink

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Link text |
| `href` | `string` | required | Link URL |

## Dependencies

None (React only).
