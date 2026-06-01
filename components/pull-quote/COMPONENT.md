# PullQuote

Editorial-grade blockquote primitive for testimonial, magazine and brand-letter layouts. Built for the "Artisanal Minimalism" Buchart-style sections: large serif body, hairline divider, all-caps small-print attribution.

## Features

- Three visual treatments (`editorial`, `plate`, `cellar`) covering cream-on-paper, framed-card and dark-cellar grounds.
- Three sizes (`sm`, `md`, `lg`) that scale only the headline text and decorative quote mark — paddings stay constant.
- Three alignments (`left`, `center`, `right`) — fully control which side the hairline rule sits on.
- Optional decorative opening quotation mark (rendered via `&ldquo;` so screen readers can ignore it via `aria-hidden`).
- Uses semantic tokens (`text-foreground`, `bg-card`, `text-muted-foreground`) so dark/light mode and accent switches Just Work.
- Pure layout — no animation, no JS state. Compose with `BlurFade` for entrance effects.

## How It Works

1. The figure is a flex column. `align` toggles `items-start | items-center | items-end` plus the text-alignment class.
2. The big `&ldquo;` is rendered above the body in a `text-[6rem]/0` block so the line-height collapses to zero; the visual mark hangs in the whitespace without pushing layout.
3. The blockquote uses `font-display` (Cormorant Garamond) at the chosen size with `leading-tight`.
4. Attribution sits under a 1-px / w-10 rule. The rule sticks to the chosen alignment side via the `alignAttrib` map.
5. `variant` swaps a small token bundle (`wrapper`, `mark`, `body`, `rule`, `name`, `role` classes). No inline styles, no hex colors — everything is `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | The quote body. Plain text. |
| `attribution` | `ReactNode` | — | Speaker name (rendered all-caps, letter-spaced). |
| `byline` | `ReactNode` | — | Speaker role / context line below attribution. |
| `variant` | `'editorial' \| 'plate' \| 'cellar'` | `'editorial'` | Visual treatment. |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Content + text alignment. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Headline scale. |
| `showMark` | `boolean` | `true` | Show / hide the decorative quotation glyph. |
| `className` | `string` | — | Extra classes on the outer `<figure>`. |
| `style` | `CSSProperties` | — | Extra inline styles on the outer `<figure>`. |

## Usage

### Editorial (default) — cream Buchart layouts

```tsx
import { PullQuote } from '@components/pull-quote/pull-quote'

<PullQuote
  attribution="Marc-André Leclerc"
  byline="Chef Sommelier, Le Bristol"
>
  Ein Paradebeispiel für Terroir-Treue. Ein Muss für jeden Keller,
  der auf Qualität statt Masse setzt.
</PullQuote>
```

### Plate — framed card on bg-card

```tsx
<PullQuote
  variant="plate"
  align="center"
  size="lg"
  attribution="Elena Rossi"
  byline="Weinkritikerin"
>
  Selten habe ich eine so konsistente Qualität über verschiedene
  Jahrgänge hinweg erlebt.
</PullQuote>
```

### Cellar — dark backgrounds (zinc-950 hero, footer)

```tsx
<PullQuote
  variant="cellar"
  align="right"
  size="md"
  showMark={false}
  attribution="Aus dem Keller"
>
  Der Wein erinnert sich an alles — den Hang, das Jahr, die Hand.
</PullQuote>
```

### Composition with BlurFade

```tsx
<BlurFade delay={200} direction="up">
  <PullQuote size="lg" attribution="Julian Schmidt" byline="Sammler">
    Was hier abgefüllt wird, finde ich sonst nirgends.
  </PullQuote>
</BlurFade>
```

## Dependencies

None beyond React and the project's own `cn()` utility (`@components/lib/utils`).
