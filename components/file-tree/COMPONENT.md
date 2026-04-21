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
2. **Framer Motion**: Handles the `height: 0 -> auto` transitions for expanding folders using `AnimatePresence`.
3. **Recursive Structure**: Can be nested infinitely to represent deep file systems.

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

- `framer-motion`
- `lucide-react` (for icons)
