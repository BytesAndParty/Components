# useImageUpload / ImageUpload

Single-image upload in two layers: the headless `useImageUpload` hook (file picker, preview URL, cleanup) and the ready-made `ImageUpload` drop zone built on top of it.

## Features

| Feature | Detail |
|---|---|
| **File picker trigger** | `handleThumbnailClick` programmatically clicks a hidden `<input type="file">`, keeping the UI clean. |
| **Drag & drop** (`ImageUpload`) | The zone accepts a dropped file; while dragging it switches to an accent-tinted state with a "drop to upload" prompt. |
| **Preview URL** | Creates a `URL.createObjectURL` for instant local preview without uploading to a server. |
| **Memory cleanup** | Revokes the previous object URL when a new file replaces it, on removal, and on unmount via `useEffect` cleanup. |
| **File name tracking** | Exposes `fileName` for display (e.g., "photo.jpg"). |
| **Reset** | `handleRemove` clears preview, filename, and resets the file input's value so the same file can be re-selected. |
| **Keyboard** (`ImageUpload`) | The empty zone is a focusable `role="button"`; Enter/Space opens the file picker. |

## How It Works

1. A `fileInputRef` points to a hidden `<input>` that the consumer renders.
2. `handleThumbnailClick` triggers the native file dialog.
3. `handleFile(file)` — shared by the input and drag & drop — creates an object URL and stores it in both state (`previewUrl`) and a ref (`previewRef`), then calls `onUpload`.
4. The ref is needed for the unmount cleanup — React state may be stale in cleanup functions, but the ref always has the latest URL.
5. `handleRemove` revokes the URL and resets all state.
6. `ImageUpload` injects its styles once (`image-upload-styles`) and uses only theme tokens (`--border`, `--accent`, `--muted-foreground`).

## Return Value (`useImageUpload`)

| Field | Type | Description |
|---|---|---|
| `previewUrl` | `string \| null` | Current preview object URL |
| `fileName` | `string \| null` | Name of selected file |
| `fileInputRef` | `RefObject<HTMLInputElement>` | Ref to attach to hidden `<input>` |
| `handleThumbnailClick` | `() => void` | Opens file picker |
| `handleFile` | `(file: File) => void` | Sets a file directly (e.g. from a drop event) |
| `handleFileChange` | `(e: ChangeEvent) => void` | Handles file selection from the input |
| `handleRemove` | `() => void` | Clears image and revokes URL |

## Props

### useImageUpload

| Prop | Type | Default | Description |
|---|---|---|---|
| `onUpload` | `(url: string) => void` | — | Called with the object URL after selection |

### ImageUpload

| Prop | Type | Default | Description |
|---|---|---|---|
| `onUpload` | `(url: string) => void` | — | Called with the object URL after selection or drop |
| `accept` | `string` | `'image/*'` | Accepted file types for the input |
| `height` | `string \| number` | `200` | Zone height (number → px) |
| `messages` | `Partial<ImageUploadMessages>` | — | i18n overrides for prompts, alt text and remove button |
| `className` | `string` | — | Classes on the zone |
| `style` | `CSSProperties` | — | Inline styles on the zone |

## Usage

```tsx
import { ImageUpload } from '@components/use-image-upload/image-upload'

<ImageUpload height={240} onUpload={(url) => setLabelImage(url)} />
```

## Security Notes

- Only creates local blob URLs — no server upload logic. The consumer is responsible for upload validation (file type, size) if sending to a backend.

## Dependencies

- `lucide-react` — `ImagePlus`, `Trash2` icons (`ImageUpload` only; the hook is React only)
