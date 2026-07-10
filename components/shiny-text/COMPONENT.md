# ShinyText & ShinyButton

A metallic shine effect for text and buttons that uses a moving linear gradient.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Moving Shine** | A bright highlight sweep across the text or button in a continuous loop. |

## How It Works

1. **Background Clip**: `ShinyText` uses `background-clip: text` combined with a `linear-gradient` to create the metallic look.
2. **Base = `currentColor`**: The gradient's resting color is the element's inherited text color — not a theme token. Sections with fixed palettes (Nocturne cream, Artisanal ink) stay readable in both themes; theme-following text keeps working because its `color` already is the theme foreground.
3. **Keyframe Animation**: Animates `background-position` to create the "sweep" effect. Injected once per page (`__shiny-text-keyframes__`), disabled under `prefers-reduced-motion`.
4. **Zero Runtime**: Pure CSS animation, no JavaScript overhead for the effect itself.

## Props (ShinyText)

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | | Text content |
| `shineColor` | `string` | `var(--shiny-text-shine)` (theme-aware weiß/hellgrau) | Farbe des Sweeps. Auf fixen Farbwelten explizit setzen — mit sichtbarem Abstand zur Textfarbe, sonst ist der Glint unsichtbar. |
| `duration` | `number` | `10` | Gesamtdauer eines Zyklus in Sekunden (Sweep ≈ 25 % davon). |
| `className` | `string` | | |
| `style` | `CSSProperties` | | |

## Props (ShinyButton)

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | | Button content |
| `shineColor` | `string` | `rgba(255,255,255,0.6)` | Farbe des Sweeps über dem Accent-Hintergrund. |
| `duration` | `number` | `10` | Gesamtdauer eines Zyklus in Sekunden. |
| `type` | `ButtonHTMLAttributes['type']` | `'button'` | Verhindert versehentliches Form-Submit. |
| …rest | `ButtonHTMLAttributes` | | Wird an das `<button>` durchgereicht. |

## Usage

```tsx
// Theme-folgend (Basis erbt die Foreground-Farbe des Kontexts)
<ShinyText duration={8}>Mehr als nur ein Online-Shop</ShinyText>

// Fixe Farbwelt: Basis kommt vom Parent (cream), Glint explizit in Kerzengold
<h1 className="text-[#f3ece0]">
  nur die <ShinyText duration={7} shineColor="#c9a25e">Zeit.</ShinyText>
</h1>
```

## Dependencies

None.
