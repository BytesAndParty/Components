# useImageUpload

Custom React hook for single-image upload with preview URL management and proper cleanup of object URLs to prevent memory leaks.

## Features

| Feature | Detail |
|---|---|
| **File picker trigger** | `handleThumbnailClick` programmatically clicks a hidden `<input type="file">`, keeping the UI clean. |
| **Preview URL** | Creates a `URL.createObjectURL` for instant local preview without uploading to a server. |
| **Memory cleanup** | Revokes the previous object URL on removal, and revokes any remaining URL on unmount via `useEffect` cleanup. |
| **File name tracking** | Exposes `fileName` for display (e.g., "photo.jpg"). |
| **Reset** | `handleRemove` clears preview, filename, and resets the file input's value so the same file can be re-selected. |

## How It Works

1. A `fileInputRef` points to a hidden `<input>` that the consumer renders.
2. `handleThumbnailClick` triggers the native file dialog.
3. `handleFileChange` reads the first selected file, creates an object URL, and stores it in both state (`previewUrl`) and a ref (`previewRef`).
4. The ref is needed for the unmount cleanup — React state may be stale in cleanup functions, but the ref always has the latest URL.
5. `handleRemove` revokes the URL and resets all state.

## Return Value

| Field | Type | Description |
|---|---|---|
| `previewUrl` | `string \| null` | Current preview object URL |
| `fileName` | `string \| null` | Name of selected file |
| `fileInputRef` | `RefObject<HTMLInputElement>` | Ref to attach to hidden `<input>` |
| `handleThumbnailClick` | `() => void` | Opens file picker |
| `handleFileChange` | `(e: ChangeEvent) => void` | Handles file selection |
| `handleRemove` | `() => void` | Clears image and revokes URL |

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onUpload` | `(url: string) => void` | — | Called with the object URL after selection |

## Security Notes

- Only creates local blob URLs — no server upload logic. The consumer is responsible for upload validation (file type, size) if sending to a backend.
- Object URLs are properly revoked to prevent memory leaks.

## Dependencies

- None (React only)
