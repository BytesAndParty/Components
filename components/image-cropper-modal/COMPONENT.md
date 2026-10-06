# ImageCropperModal

A high-end image cropping solution integrated into a modal dialog, supporting aspect ratio constraints, rotation, and flipping.

## Features

- **Modal Experience:** Uses `Dialog` with backdrop blur and smooth transitions.
- **Precision Cropping:** Handles high-resolution images with a performant canvas-based preview.
- **Aspect Ratio Control:** Optional fixed aspect ratio support.
- **Transformations:** Integrated zoom (slider + buttons), rotation reset, and horizontal/vertical flipping.
- **Smart Initial Zoom:** Automatically scales large images to fit the viewport on load.
- **Blob Output:** Returns the cropped result as a PNG `Blob` in source-pixel resolution (capped at 4096 px), ready for print or server upload.

## How It Works

This component is built on **Ark UI (Zag.js)**. 
- The `ImageCropper.Root` provides the state engine for cropping logic.
- Before the cropper mounts, the image's natural size (hidden `new Image()`) and the viewport size (`ResizeObserver`) are measured. From both it derives `defaultZoom` (fit) and an `initialCrop` covering 95 % of the visible image, so Zag's first default crop already matches what the user sees. A short loading skeleton covers the measuring phase.
- The measurement carries the `src` it belongs to; the cropper only mounts when it matches the current `imageSrc`, so sequential uploads never reuse the previous image's numbers.
- The `ApplyButton` does **not** use Zag's `getCroppedImage()` (it renders in viewport pixels, far below print resolution). Instead `renderHighResCrop()` redraws the selection with the same zoom/crop/rotation/flip math onto a canvas in source-pixel resolution.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `open` | `boolean` | - | Controls the visibility of the modal. |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when modal state changes. |
| `imageSrc` | `string` | - | URL of the image to crop. |
| `aspectRatio` | `number` | - | Optional fixed aspect ratio (e.g., 1 for square). |
| `onCrop` | `(blob: Blob) => void` | - | Callback receiving the final cropped image. |
| `className` | `string` | - | Custom classes for the dialog content. |
| `messages` | `Partial<ImageCropperMessages>` | - | Custom i18n overrides. |

## Usage

```tsx
import { ImageCropperModal } from '@components/image-cropper-modal/image-cropper-modal'

function UserProfile() {
  const [open, setOpen] = useState(false)
  const [img, setImg] = useState<string | null>(null)

  const handleCrop = async (blob: Blob) => {
    const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
    // upload(file)
  }

  return (
    <ImageCropperModal
      open={open}
      onOpenChange={setOpen}
      imageSrc="/path/to/image.jpg"
      aspectRatio={1}
      onCrop={handleCrop}
    />
  )
}
```

## Dependencies

- `@ark-ui/react`: Dialog and ImageCropper primitives.
- `lucide-react`: Icons.
- `components/i18n`: Internationalization and translations.
