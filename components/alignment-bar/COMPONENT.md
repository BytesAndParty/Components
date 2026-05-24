# AlignmentBar

A compact toolbar for aligning and distributing objects on a canvas. Built with accessibility in mind, it supports roaming tabindex for keyboard navigation and localized tooltips.

## Features

- **Alignment Controls**: Quick access to left, center (h/v), right, top, and bottom alignment.
- **Distribution**: Horizontal and vertical distribution actions.
- **Keyboard Navigation**: Full support for arrow keys (`ArrowRight`, `ArrowLeft`, `ArrowUp`, `ArrowDown`), `Home`, and `End` to navigate the toolbar via roaming tabindex.
- **Accessible**: Uses `role="toolbar"` and appropriate `aria-label` and `title` attributes.
- **i18n Ready**: Integrated with the design engine's message system for localized tooltips.
- **Visual Grouping**: Automatic divider between alignment and distribution groups.

## How It Works

1. **Toolbar Pattern**: Implements the WAI-ARIA Toolbar pattern where only one element is focusable at a time (`tabIndex={0}` for the active/focused item, `-1` for others).
2. **Focus Management**: Uses a `focusIndex` state and a `handleKeyDown` listener to manage focus between buttons without triggering a page tab cycle.
3. **Internal i18n**: Utilizes `useComponentMessages` to merge default messages (German/English) with optional prop overrides.
4. **Style Integration**: Uses `cn` utility for Tailwind CSS class merging, supporting standard design engine themes and disabled states.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onAlign` | `(action: AlignAction) => void` | — | Fired when an alignment button is clicked. `AlignAction` includes `align-left`, `align-center-h`, `align-right`, `align-top`, `align-center-v`, `align-bottom`, `distribute-h`, `distribute-v`. |
| `disabled` | `boolean` | `false` | If true, the toolbar is visually dimmed and interaction is disabled. |
| `className` | `string` | — | Additional CSS classes for the wrapper element. |
| `messages` | `Partial<AlignmentBarMessages>` | — | Custom message overrides for localized tooltips. |

## Usage

### Basic

```tsx
import { AlignmentBar } from '@components/alignment-bar'

function Toolbar() {
  const handleAlign = (action) => {
    // Integrate with your canvas engine (e.g., Fabric.js)
    console.log('Action triggered:', action)
  }

  return <AlignmentBar onAlign={handleAlign} />
}
```

### With Custom Messages

```tsx
<AlignmentBar
  onAlign={handleAlign}
  messages={{
    ariaLabel: 'Design Alignment Tools',
    alignLeft: 'Push to Left'
  }}
/>
```

## Dependencies

- `lucide-react` — Icons
- `clsx` & `tailwind-merge` — Style utility (`cn`)
- `@components/i18n` — Internationalization hooks
