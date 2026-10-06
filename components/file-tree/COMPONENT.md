# FileTree

A composable, recursive file tree component with expand/collapse animations.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Expand/Collapse** | Folders smoothly animate their height when opened or closed. |
| **Hover Highlighting** | Items show a subtle background highlight on hover for better navigation. |
| **Icon States** | Folder icons change from closed to open state based on expansion. |

## How It Works

1. **Composable API**: Uses a set of sub-components (`Folder`, `File`) to build complex trees easily.
2. **motion/react**: Handles the `height: 0 -> auto` transitions for expanding folders using `AnimatePresence`.
3. **Recursive Structure**: Can be nested infinitely to represent deep file systems.
4. **Tree semantics**: The root is `role="tree"`, folders are `role="treeitem"` with `aria-expanded` and an `aria-level` that grows per nesting level. Folder headers are real buttons; files become focusable (Enter/Space) only when they have an `onClick`.

## Props

### FileTree

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | `Folder` / `File` elements |
| `indent` | `number` | `16` | Indentation per level in px |
| `aria-label` | `string` | — | Accessible name of the tree |
| `className` | `string` | — | Classes on the tree container |
| `style` | `CSSProperties` | — | Inline styles on the tree container |

### Folder

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | required | Folder label |
| `defaultOpen` | `boolean` | `false` | Expanded on first render |
| `children` | `ReactNode` | — | Nested `Folder` / `File` elements |
| `className` | `string` | — | Classes on the folder item |

### File

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | required | File label |
| `onClick` | `() => void` | — | Makes the file interactive and focusable |
| `className` | `string` | — | Classes on the file item |

## Usage

```tsx
<FileTree>
  <Folder name="src" defaultOpen>
    <File name="App.tsx" />
    <Folder name="components">
      <File name="Button.tsx" />
    </Folder>
  </Folder>
</FileTree>
```

## Dependencies

- `motion` (`motion/react`)
- `lucide-react` (for icons)
