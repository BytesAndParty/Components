# AutocompleteCell

Input field with filtered autocomplete suggestions, keyboard navigation, and animated dropdown. Built on Ark UI `Combobox`, free text stays allowed.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Dropdown entrance/exit** | Suggestion list fades in with a slight upward slide and scale (`opacity + translateY + scale`), and out again, via CSS keyframes on Ark's `data-state` (injected once, `STYLE_ID`). |
| **Highlight tracking** | Arrow keys and the pointer move one shared highlight (`data-highlighted`); typing highlights the first match. |
| **Clear button** | An animated X button fades in/out (scale + opacity, `motion/react`) when the input has a value. |
| **Icon swap** | The left icon switches between a search icon and a spinning loader when `isLoading` is true. |
| **Focus accent** | The left icon color transitions from muted to accent on input focus. |
| **Focus ring** | Input shows an accent-colored ring on focus. |

## How It Works

1. **Filtering + ranking**: Suggestions are filtered by matching `key` or `label` against the input value (case-insensitive). Results are ranked: starts-with matches appear first. The filtered list is the `collection` of the Ark `Combobox` (`useCombobox` + `Combobox.RootProvider`); Ark does no filtering of its own.
2. **Free text**: `inputValue` is the `value` prop, every change goes to `onChange`. Picking a suggestion writes its `label` into the input and thus into `onChange`; no selection state is kept (`value: []`, `allowCustomValue`).
3. **Open state**: The list opens while typing and only shows when there are matches (`open && filtered.length > 0`). It does not open on focus: Ark moves the caret to the end when the list opens, which would undo the select-all on focus.
4. **Keyboard navigation** (Ark): ArrowUp/Down move the highlight (no wrap-around), Home/End jump to the first/last match, Enter picks the highlighted match, Escape closes. Tab auto-completes to the highlighted match (or the top one) if no exact label match exists; that part is a custom handler.
5. **Key pass-through**: The caller's `onKeyDown` gets every key except the ones the open list handles (arrows, Home/End, Enter, Escape) and a completing Tab. On a closed list arrow keys are not used to open it (`openOnKeyPress: false`), so they stay free for table navigation.
6. **Outside click / focus loss**: Ark's dismissable layer closes the list, no own document listener.
7. **Portal**: The list portals into `useOverlayContainer()` (falls back to `<body>`), so table cells with `overflow: hidden` and hosts with their own `z-index` do not clip it. It keeps the control's width (`sameWidth`).
8. **Label**: A `sr-only` `Combobox.Label` with the placeholder text labels the input (`for`) and the list: Ark points the list's `aria-labelledby` at it, which takes precedence over the list's `aria-label` (`suggestionsLabel`).
9. **Ref forwarding**: Accepts an external `inputRef` for imperative focus control, falling back to an internal ref.
10. **Reduced motion**: handled once via `useReducedMotion()`: the list gets no keyframe class, the clear button only fades.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | required | Current input value (controlled) |
| `suggestions` | `AutocompleteSuggestion[]` | required | Array of `{ id, key, label, subLabel? }` |
| `onChange` | `(value: string) => void` | required | Called on input change or selection |
| `onKeyDown` | `(e: KeyboardEvent) => void` | — | Additional keyboard handler |
| `inputRef` | `RefObject<HTMLInputElement>` | — | External ref for the input |
| `placeholder` | `string` | `messages.placeholder` | Input placeholder and hidden label (localized fallback: `Suchen...` / `Search...`) |
| `isLoading` | `boolean` | `false` | Show loading spinner instead of search icon |
| `onFocus` | `() => void` | — | Called when the input gains focus |
| `onBlur` | `() => void` | — | Called when the input loses focus |
| `messages` | `Partial<AutocompleteMessages>` | — | i18n overrides |
| `className` | `string` | — | Additional classes on the wrapper |

## Dependencies

- `@ark-ui/react` (`/combobox`, `/collection`, `/portal`) — listbox semantics, keyboard, positioning, dismiss
- `motion` (`motion/react`) — clear button animation, `useReducedMotion`
- `lucide-react` — Search, X, ChevronRight, Loader2 icons

## Note

This component uses Tailwind CSS classes (unlike most other components in this library that use inline styles). If using outside the showcase, ensure Tailwind is configured.
