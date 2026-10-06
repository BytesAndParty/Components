# Stepper

Multi-step wizard in two layouts: horizontal `Stepper` (indicator bar + sliding content panel) and `VerticalStepper` (accordion-style list where only the active step expands). Steps are declared as children, back/next navigation is built in.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Content slide** (`Stepper`) | Step panels slide in from the right (forward) or left (backward) by 60 px with an opacity fade — `motion/react` `AnimatePresence` with directional variants, 250 ms `easeInOut`. |
| **Connector fill** (`Stepper`) | The line between step circles fills with the accent colour as steps complete. |
| **Step circle states** | Completed steps show a checkmark, the active step is highlighted, upcoming steps stay numbered and muted. |
| **Expand/collapse** (`VerticalStepper`) | The active step's content and its inline back/next buttons expand via `height: 0 → auto` (280 ms); other steps collapse to their title. |
| **Button labels** | "Back" is unavailable on the first step; on the last step "Next" switches to the localized finalize label. |

## How It Works

1. **Children as steps**: Each `<Step>` / `<VerticalStep>` child is one step. `Step` renders its children unchanged; the wrapper reads titles and content via `Children.toArray`.
2. **Internal state**: `currentStep` (1-based, starts at `initialStep`) and a `direction` (`1` / `-1`) for the slide variants. `onStepChange` fires on every change, `onFinalStepCompleted` when the user confirms the last step.
3. **Accessibility**: The active indicator has `aria-current="step"`, completed circles carry a localized "completed" label, and the content region is a `role="group"` with `aria-live="polite"` and an "Step X of Y" label.
4. **StepList**: `StepList` / `StepListItem` render a connected bullet list for use inside a `VerticalStep` (sub-tasks of a step).

## Props

### Stepper / VerticalStepper

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | `Step` (horizontal) or `VerticalStep` (vertical) elements |
| `initialStep` | `number` | `1` | Starting step (1-based) |
| `onStepChange` | `(step: number) => void` | — | Called whenever the step changes |
| `onFinalStepCompleted` | `() => void` | — | Called when the last step is confirmed |
| `messages` | `Partial<StepperMessages>` | — | i18n overrides for back/next/finalize labels, the SR step counter and the "completed" label |
| `className` | `string` | — | Classes on the wrapper |
| `style` | `CSSProperties` | — | Inline styles on the wrapper |

### Step / VerticalStep

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Step content (required for `Step`) |
| `title` | `string` | — | Step title — optional for `Step` (shown under the indicator), required for `VerticalStep` |

### StepList

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | `StepListItem` elements |
| `className` / `style` | — | — | Forwarded to the list wrapper |

## Usage

```tsx
import { Stepper, Step } from '@components/stepper/stepper'
import { VerticalStepper, VerticalStep, StepList, StepListItem } from '@components/stepper/stepper-vertical'

<Stepper onFinalStepCompleted={placeOrder}>
  <Step title="Adresse"><AddressForm /></Step>
  <Step title="Versand"><ShippingOptions /></Step>
  <Step title="Zahlung"><PaymentForm /></Step>
</Stepper>

<VerticalStepper>
  <VerticalStep title="Weine wählen">
    <StepList>
      <StepListItem>Rebsorte</StepListItem>
      <StepListItem>Jahrgang</StepListItem>
    </StepList>
  </VerticalStep>
  <VerticalStep title="Etikett gestalten" />
</VerticalStepper>
```

## Dependencies

- `motion` (`motion/react`) — AnimatePresence + motion for slide and expand transitions
