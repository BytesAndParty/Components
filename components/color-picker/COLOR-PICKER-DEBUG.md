# Color Picker — Debug Log & Resolution

**Status: gelöst.** Alle sechs Varianten rendern jetzt korrekt. Root cause unten.

---

## Root Cause

**Tailwind v4 hat die Klassen aus `components/**` nie generiert.** Die 2D-Flächen
hatten effektiv `height: 0` (visuell 2px nur durch den `border`), weil die
Tailwind-Utilities (`h-40`, `h-52`, `w-4`, `cursor-crosshair`, …), die nur in den
shared components verwendet werden, in der finalen CSS-Datei fehlten.

### Warum?

Tailwind v4 mit `@tailwindcss/vite` macht **Auto-Source-Detection** — scannt aber
nur den Vite-Project-Root (hier `showcase/`). Die shared components leben in
einem **Schwester-Verzeichnis** (`../components/`), das vom Auto-Scan nicht
erfasst wird. Andere Komponenten haben "funktioniert", weil ihre Klassen
zufällig auch im Showcase-Code vorkommen — aber spezifische Color-Picker-Klassen
wie `h-40` oder `cursor-crosshair` existieren nirgendwo sonst.

### Fix

In [`showcase/src/styles.css`](../../showcase/src/styles.css):

```css
@import "tailwindcss";

@source "../../components/**/*.{ts,tsx}";
```

Die `@source`-Direktive teilt Tailwind v4 explizit mit, auch das
`components/`-Verzeichnis nach Klassen zu scannen. Sofortige Wirkung: alle
2D-Flächen werden in voller Größe gerendert, Thumbs sind sichtbar an der
richtigen Position, Slider-Tracks zeigen den Verlauf, Palette-Swatches haben
ihre 6×6-Quadrate.

### Wie das diagnostiziert wurde

Headless-Chrome screenshot der `/designer`-Seite + Playwright-DOM-Inspection.
Computed-Styles der 2D-Area-Divs zeigten:

```json
{
  "classes": "w-full h-40 rounded-lg cursor-crosshair overflow-hidden border...",
  "width": 316,    // ← w-full hat über parent gegriffen, weil parent volle Breite hatte
  "height": 2,     // ← h-40 war NICHT angewendet, nur 2× 1px border
  "bgImage": "linear-gradient(to top, rgb(0,0,0), rgba(0,0,0,0)), linear-gradient(...)"
}
```

Der Gradient war korrekt gesetzt — aber das Element hatte keine sichtbare Höhe.
Nach dem `@source`-Fix:

```json
{ "width": 316, "height": 208 }   // h-52 = 13rem = 208px ✓
```

---

## Übersicht der Varianten (jetzt alle funktionsfähig)

| ID         | Funktion                              | Status |
|------------|---------------------------------------|--------|
| `before`   | `ColorPickerPanelBeforeChanges`       | ✅     |
| `ark`      | `ColorPickerPanelArkBackground`       | ✅     |
| `manual`   | `ColorPickerPanelManualArea`          | ✅     |
| `native`   | `ColorPickerPanelNativeArea`          | ✅     |
| `sliders`  | `ColorPickerPanelTwoSliders`          | ✅     |
| `pure`     | `ColorPickerPanelPureCustom`          | ✅     |

`ColorPickerPanel` ist auf `ColorPickerPanelPureCustom` aliasiert (siehe
[`color-picker.tsx:48`](color-picker.tsx#L48)).

---

## Sekundäre Bugs, die unterwegs gefixt wurden

Diese waren real, aber ohne den Tailwind-Fix nicht sichtbar:

### 1. AreaThumb-Compound-Transform (Tailwind v4 vs. Ark UI)

Ark UI setzt auf `<ColorPicker.AreaThumb>` per Inline-Style:
```css
transform: translate(-50%, -50%);
```

Tailwind v4 nutzt die separate CSS `translate`-Property für `-translate-x-1/2`
`-translate-y-1/2`:
```css
translate: -50% -50%;
```

Beide Properties (`transform` und `translate`) **kompoundieren** —
der Thumb war damit effektiv um -100%/-100% versetzt, also an der oberen
linken Ecke des Klickpunkts statt zentriert.

**Fix:** Tailwind `-translate-*` Klassen vom `AreaThumb` entfernt — Arks Inline-
Style übernimmt die Zentrierung allein.

### 2. AreaBackground Sizing

Ark UI setzt auf `<ColorPicker.AreaBackground>` Inline-`position: relative`.
Mit `className="absolute inset-0 w-full h-full"` wurde `absolute` von Inline
überschrieben — übrig blieben nur `w-full h-full`, was funktionierte. Das
`inset-0` war wirkungslos.

**Fix:** Klassen vereinfacht zu `w-full h-full` (klar zur Intention).

### 3. Inline `position: absolute` auf AreaBackground im Ark-Variant

Ein früherer Versuch hatte `style={{ position: 'absolute', inset: 0, … }}`.
Über Zag's `mergeProps` (Object.assign-basiert) hätte das Arks
`position: relative` überschrieben und damit den Stacking-Kontext gebrochen.

**Fix:** Inline-Style entfernt, nur Klassen verwenden.

---

## Wie der Gradient intern in Zag aufgebaut ist (für die Ark-Varianten)

Aus `@zag-js/color-utils/dist/color-format-gradient.mjs`, Funktion `generateHSB_H`
(wird bei `xChannel='saturation' yChannel='brightness'` → `zChannel='hue'` genutzt):

```js
areaStyles: {} // ← Area selbst hat KEIN background
areaGradientStyles: { // ← AreaBackground bekommt 3-Layer-Gradient
  background: [
    'linear-gradient(to top, hsla(0,0%,0%,1) 0%, hsla(0,0%,0%,0) 50%, hsla(0,0%,100%,0) 50%, hsla(0,0%,100%,1) 100%)',
    'linear-gradient(to right, hsla(0,0%,50%,1), hsla(0,0%,50%,0))',
    'hsl(${hue}, 100%, 50%)'
  ].join(',')
}
```

Heißt: das **gesamte sichtbare Bild** liegt auf `AreaBackground`. Wenn dieses
Element keine Höhe hat (was vor dem Fix der Fall war), bleibt die Fläche leer.
Deshalb ist `w-full h-full` auf `AreaBackground` zwingend.

Die manuellen Custom-Varianten (`manual`, `native`, `pure`) nutzen den
klassischen Photoshop-Aufbau:
```css
linear-gradient(to top, #000, transparent),
linear-gradient(to right, #fff, hsl(H, 100%, 50%));
```
→ weiß oben-links, schwarz unten, hue oben-rechts.

---

## Empfehlung für Aufräumen

Da jetzt alles funktioniert, kann man die Variant-Vielfalt auf eine reduzieren:

1. **Behalten:** `ColorPickerPanelPureCustom` als alleinige Implementation —
   keine Ark-Layout-Eigenheiten, volle Kontrolle, klassischer Photoshop-Style.
2. **Löschen:** `ColorPickerPanelBeforeChanges`, `ColorPickerPanelArkBackground`,
   `ColorPickerPanelManualArea`, `ColorPickerPanelNativeArea`,
   `ColorPickerPanelTwoSliders` und der gesamte `ColorPickerPanelCore` /
   `ColorArea` / `NativePointerArea` / `SaturationBrightnessSliders`-Pfad.
3. **Designer-Demo** entsprechend zurückbauen auf eine Komponente mit Default-
   und Alpha-Varianten.

Falls du die Vergleichsmöglichkeit weiter brauchst → die anderen Varianten
funktionieren ja jetzt, also kein Druck.
