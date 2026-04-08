# AutocompleteCell

Input field with filtered autocomplete suggestions, keyboard navigation, and animated dropdown.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Dropdown entrance** | Suggestion list fades in with a slight upward slide and scale (`opacity + y + scale`) via framer-motion. |
| **Highlight tracking** | Arrow keys move a visual highlight across suggestions; mouse enter also updates the highlight index. |
| **Clear button** | An animated X button fades in/out (scale + opacity) when the input has a value. |
| **Icon swap** | The left icon switches between a search icon and a spinning loader when `isLoading` is true. |
| **Focus accent** | The left icon color transitions from muted to accent on input focus. |
| **Focus ring** | Input shows an accent-colored ring on focus. |

## How It Works

1. **Filtering + ranking**: Suggestions are filtered by matching `key` or `label` against the input value (case-insensitive). Results are ranked: starts-with matches appear first.
2. **Keyboard navigation**: ArrowUp/Down moves the highlight index. Enter selects. Escape closes. Tab auto-completes to the highlighted suggestion if no exact match exists.
3. **Outside click**: A `mousedown` listener on `document` closes the dropdown when clicking outside.
4. **Ref forwarding**: Accepts an external `inputRef` for imperative focus control, falling back to an internal ref.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | required | Current input value (controlled) |
| `suggestions` | `AutocompleteSuggestion[]` | required | Array of `{ id, key, label, subLabel? }` |
| `onChange` | `(value: string) => void` | required | Called on input change or selection |
| `onKeyDown` | `(e: KeyboardEvent) => void` | — | Additional keyboard handler |
| `inputRef` | `RefObject<HTMLInputElement>` | — | External ref for the input |
| `placeholder` | `string` | `'Suchen...'` | Input placeholder |
| `isLoading` | `boolean` | `false` | Show loading spinner instead of search icon |

## Dependencies

- `framer-motion` — Dropdown and clear button animations
- `lucide-react` — Search, X, ChevronRight, Loader2 icons

## Note

This component uses Tailwind CSS classes (unlike most other components in this library that use inline styles). If using outside the showcase, ensure Tailwind is configured.
