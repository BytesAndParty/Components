# Particles

Canvas-based floating particle background with optional mouse interaction.

## Micro-Interactions

| Interaction | Detail |
|---|---|
| **Floating drift** | Particles move continuously in random directions with configurable speed. |
| **Edge wrapping** | Particles wrap around canvas edges for seamless infinite movement. |
| **Mouse repulsion** | When `moveParticlesOnHover` is enabled, particles push away from the cursor within `hoverRadius`. |

## How It Works

1. **Canvas 2D**: Renders on a `<canvas>` element using the 2D context — no WebGL dependency.
2. **DPR-aware**: Canvas resolution is multiplied by `devicePixelRatio` for crisp rendering on retina displays.
3. **ResizeObserver**: Automatically re-initializes particles when the container size changes.
4. **requestAnimationFrame**: Animation loop runs at display refresh rate with proper cleanup on unmount.
5. **CSS-Variablen in `particleColors`**: `ctx.fillStyle` versteht kein `var(…)` — ein solcher Wert wird still verworfen und der Partikel erbt die zuletzt gesetzte Farbe. Deshalb hängt pro var()-Eintrag ein `display:none`-Sonde-Element im Container, dessen *computed color* alle 20 Frames ausgelesen wird. So folgen die Partikel dem laufenden Accent-/Theme-Wechsel, ohne pro Frame das DOM zu mutieren.
6. **IntersectionObserver**: Die RAF-Schleife läuft nur, solange der Container im Viewport ist — mehrere gestapelte Particles-Sections kosten sonst gemeinsam Framezeit, auch die unsichtbaren.
7. **`prefers-reduced-motion`**: Statt die Partikel zu entfernen, wird genau ein Standbild gezeichnet (inkl. Redraw nach Resize) und keine Schleife gestartet; die Maus-Repulsion bleibt aus.
8. **Positionierung**: Der Wrapper setzt bewusst **kein** `position` — Consumer platzieren den Layer per `className="absolute inset-0"`, und ein Inline-`position` würde diese Klasse überstimmen (Inline schlägt Klasse). Damit das absolut gesetzte Canvas trotzdem am Wrapper hängt, macht `contain: layout paint` ihn zum Containing Block.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `particleColors` | `string[]` | `['#ffffff']` | Color palette — each particle picks a random color. `var(--token)` und `color-mix(…)` sind erlaubt und werden gegen den Container aufgelöst (siehe How It Works #5) |
| `particleCount` | `number` | `200` | Total number of particles |
| `particleSpread` | `number` | `10` | Spread factor (scales initial distribution) |
| `speed` | `number` | `0.1` | Base movement speed multiplier |
| `particleBaseSize` | `number` | `2` | Maximum additional radius in px (actual: 1 to baseSize+1) |
| `moveParticlesOnHover` | `boolean` | `false` | Enable mouse repulsion effect |
| `hoverRadius` | `number` | `80` | Radius of the mouse repulsion zone in px |

## Dependencies

None (React only, uses Canvas 2D API).
