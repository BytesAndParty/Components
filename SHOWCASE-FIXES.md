# Analyse & Fix-Plan: Showcase UI Components

Dieser Plan beschreibt die Korrekturen für gemeldete Probleme im
Showcase-Projekt nach der Umstellung auf Tailwind CSS.

## 1. AuroraText (Doppelter Text & Varianten)

- **Problem:** "Premium QualityPremium Quality" (Text erscheint doppelt).
- **Ursache:** Die `sr-only` Implementierung für Screenreader-Support ist
  visuell nicht vollständig versteckt, wenn die umschließenden Container Styles
  (wie Clipping) nicht greifen. Zudem fehlen die spezifischen Varianten `aurora`
  und `gradient`.
- **Fix:**
    - Korrektur der `sr-only` CSS-Klasse in `styles.css` 2oder Nutzung der
      Tailwind-Utility `sr-only`.
    - Implementierung der `variant`-Prop in `aurora-text.tsx`:
        - `aurora` (Default): Sanft wechselnder Multi-Color-Effekt.
        - `gradient`: Kontinuierlicher Loop für auffällige CTAs.
    - Sicherstellen, dass nur der dekorative Span via `aria-hidden` angezeigt
      wird.

## 2. TextRotate & MorphingText Verlangsamung

- **Anforderung:** Animationen bei "Entdecke Brunello..." etc. flüssiger und
  langsamer gestalten.
- **Fix:**
    - `TextRotate`: Erhöhung des `rotationInterval` in `text.tsx`.
    - `MorphingText`: Anpassung der `duration` und der CSS-Transitions für
      `blur` und `opacity`.

## 3. ShinyText Verlangsamung

- **Anforderung:** Der Schimmer-Effekt ist zu schnell.
- **Fix:**
    - Änderung der Default-Dauer (`duration`) in `shiny-text.tsx` von 3s auf
      5-6s.
    - Optimierung der Keyframes für einen weicheren Verlauf.

## 4. Timeline (Überlappende Jahreszahlen)

- **Problem:** Subtitles (Jahreszahlen wie 1952) überlagern andere Elemente.
- **Fix:**
    - Erhöhung des Abstands (`padding-left`) für Content-Elemente in
      `timeline.tsx`.
    - Sicherstellen, dass der `subtitle` absolut oder mit genügend Margin
      positioniert ist, um nicht mit dem `marker` (Dot) zu kollidieren.

## 5. MagneticButton Border Beam

- **Problem:** Animation startet nicht.
- **Ursache:** Die Keyframes `@keyframes mb-beam` fehlen in der globalen
  `styles.css`.
- **Fix:** Ergänzung der Keyframes in `showcase/src/styles.css`.

## 6. CursorGlow Verstärkung

- **Anforderung:** Der Effekt soll deutlicher sichtbar sein.
- **Fix:** Erhöhung der Standard-Opacity von 0.15 auf 0.25 oder 0.3 in
  `cursor-glow.tsx`.

## 7. Reload Button für Animationen

- **Anforderung:** Button rechts oben, um Animationen (z.B. `TextScramble`)
  erneut zu triggern.
- **Fix:**
    - Erstellung einer Wrapper-Komponente `ComponentPreview`, die einen
      Refresh-Button enthält.
    - Dieser Wrapper nutzt einen `key={reloads}`, der bei Klick inkrementiert
      wird, um die Komponente neu zu mounten.

## 8. Scroll-Position nach Refresh

- **Anforderung:** Scroll-Position soll nach einem Seiten-Refresh erhalten
  bleiben.
- **Fix:**
    - Einbinden der `<ScrollRestoration />` Komponente von `react-router` in
      `App.tsx` oder `layout.tsx`.

## 9. CursorGlow Stärke

- **Anforderung:** Den Effekt etwas stärker machen.
- **Fix:** Anpassung der Default-Werte für `opacity` und `size` in
  `cursor-glow.tsx`.

manchmal wird heftig übertrieben beim showcase also oft macht es keinen sinn den
button oder die ladeanimation in so vielen unterschiedlichen sizes anzuzeigen
bitte ebenfalls ausdünnen

ScrollProgress befindet sich auf der feedback seite nicht auf der mit der
navigation haha

die add to cart animation ist kapuut geworden leider das cart befindet sich
außerhalb des buttons ist somit nicht sichtbar, wenn ich den button clicke

view transitions hat auch noch einen bug, aber idee gefällt mir, wie wir es
abbilden wollen

styling von AutocompleteCell fixen das search icon ist innerhalb des placeholder
textes
