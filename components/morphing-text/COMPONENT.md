# MorphingText

A text transition effect that morphs between different strings using CSS blur filters and opacity.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Blur Morph** | One word blurs out while the next blurs in, creating a "liquid" transformation effect. |
| **Seamless Loop** | Cycles through an array of strings continuously. |

## How It Works

1. **SVG Filters (optional/simulated)**: Uses a combination of `filter: blur()` and high-contrast overlays to simulate a gooey morphing effect between text states.
2. **Double Buffering**: Two text elements swap visibility and blur states to ensure smooth transitions without layout jumps.
3. **No Motion Library**: Uses standard `setInterval` and CSS transitions for lightweight performance.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `texts` | `string[]` | | Array of strings to cycle through |
| `duration` | `number` | `2000` | Duration for each word in ms |
| `className` | `string` | | |

## Dependencies

None.
