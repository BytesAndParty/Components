# Stepper

Multi-step wizard component with animated step indicators and slide transitions between step content panels. Supports back/next navigation and an optional completion callback.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Step indicator pulse** | The current step circle pulses via a ring animation (`box-shadow` scale) to draw attention. |
| **Connector fill** | The line between step circles fills with the accent color as each step completes, using a width transition. |
| **Content slide** | Step content panels slide in from the right (forward) or left (backward) using framer-motion `AnimatePresence` with directional variants. |
| **Button state** | "Back" fades in/out on the first step. "Next" changes label to a configurable completion text on the last step. |
| **Step circle transitions** | Completed steps show a checkmark icon that scales in; upcoming steps remain numbered with muted styling. |

## How It Works

1. **Step definition**: Each step is defined as `{ label, content }` where `content` is a `ReactNode`.
2. **Direction tracking**: A `direction` state (`1` or `-1`) determines slide direction for `AnimatePresence` variants: `enter`, `center`, `exit`.
3. **Spring animation**: Content transitions use framer-motion springs with `type: "spring", stiffness: 300, damping: 30`.
4. **Indicator bar**: Steps are rendered as a horizontal bar of circles connected by lines. Each circle/line reflects the current progress via conditional styling.
5. **Controlled mode**: The component manages its own `currentStep` state but calls `onComplete` when the user advances past the last step.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `steps` | `StepDef[]` | — | Array of `{ label: string, content: ReactNode }` |
| `onComplete` | `() => void` | — | Called when user clicks "Next" on the last step |
| `completeLabel` | `string` | `'Complete'` | Label for the final step's button |

## Dependencies

- `framer-motion` — AnimatePresence + motion for slide transitions
- `lucide-react` — Check icon for completed steps
