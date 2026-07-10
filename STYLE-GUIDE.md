# Style Guide — Buchart58 Design System

> **Zweck:** Die systematische Kohärenz-Schicht. [DESIGN-VORGABE.md](./DESIGN-VORGABE.md) sagt _welche_
> Sections; dieses Dokument sagt _nach welchen Regeln_ jede Seite gebaut wird — Tokens, Typo-Skala,
> Spacing, Motion, Do/Don't. Implementiert in [`storefront/src/styles.css`](./storefront/src/styles.css).
> Bauregeln für Komponenten: [../__Components__/COMPONENT-GUIDELINES.md](../__Components__/COMPONENT-GUIDELINES.md).

---

## 1. Drei Oberflächen — bewusst getrennt

Buchart58 hat **drei kohärente Flächen**, nicht eine:

| Fläche | Wo | Grund |
|---|---|---|
| **Paper (Editorial)** | Marketing-Sections (Hero, Story, Galerie, Chronik …) | Cream-Magazin-Look, „Produkt als Hero", themen-**unabhängig** hell. Token: `bg-paper`. |
| **Nocturne (Cinematic)** | Commerce-Erlebnis (Storefront „Cave", Produkt-Detail „Chiaroscuro", Abendkarte) | Warmes Fast-Schwarz + Kerzengold — der Keller unter dem Magazin. Bewusster **Kontrast** zur Paper-Fläche, nicht deren Dark-Mode. |
| **App-Chrome (Semantic)** | Funktionale UI (Header, Cart, Konto, Formulare) | Dark/Light + Accent umschaltbar über semantische Tokens (`bg-background`, `text-foreground`, `bg-accent`). |

> Das ist Absicht: ein **Magazin über einem Keller, beides in einer App**. Editorial-Sections bleiben
> Cream, auch wenn die App im Dark-Mode läuft; Nocturne-Sections bleiben dunkel, auch im Light-Mode.
> Der Sprung Cream → Nocturne inszeniert den Abstieg ins Gewölbe (Verkauf/Degustation). Nicht mischen —
> eine Section gehört genau **einer** Fläche.

**Kanonische Komposition** (Referenz-Auswahl, Stand Juli 2026):
`nav:v3 · hero:v6 · features:v5 · showcase:v5 · storefront:nocturne · pricing:v6+v7 · cta:v5 ·
timeline:v2 · testimonials:v2 · gallery:v3 · footer:v5` — Maison führt, Domaine Privée liefert
einzelne Sections (Rieden), Nocturne trägt den Commerce-Teil als Kontrast.

---

## 2. Farbe (nur Tokens, kein Roh-Hex)

Quelle der Wahrheit: `@theme` in [`storefront/src/styles.css`](./storefront/src/styles.css). Farben in
**oklch**. Sanktionierte Hex-Konstanten (je genau **einmal** im Theme definiert, theme-unabhängig):
`--color-paper` `#fdfcf9` (Maison-Cream) sowie die **Domaine-Privée-Fläche** (Strategy B):
`--color-parchment` `#f6f3ec`, `--color-ink` `#221b16`, `--color-linen` `#ddd5c4`,
`--color-bordeaux` `#5c2331` (fixes Marken-Bordeaux der Editorial-Sections — bewusst **nicht** der
schaltbare `--accent`). Warme Zwischentöne (`#8a8070`, `#6f6657`, …) sind die Domaine-Grauskala,
analog zur `zinc`-Skala der Maison-Sections (§2 unten).

**Nocturne-Fläche** (Cinematic, §1): warmes Fast-Schwarz `#0d0a09` (Varianten `#171210`, `#2a2019`),
**Kerzengold** `#c9a25e` (Hairlines, Kicker, Numerale), Highlight `#e8d5ae`, Cream-Typo `#f3ece0`,
warme Grauskala `#a89a85` / `#6b5f50`. Gold ist Licht, keine Marken-Farbe — Bordeaux bleibt der Marke.

- **Semantisch konsumieren:** `bg-background`, `text-foreground`, `text-muted-foreground`,
  `border-border`, `bg-accent`, `text-accent`. **Nie** `bg-zinc-900` als Marken-Farbe.
- **Marken-Akzent = Bordeaux** `oklch(0.42 0.15 18)` — Default in `:root`. Erdig, weinnah. Kein Neon.
- **Paper-Sections** nutzen `bg-paper` + die `zinc`-Skala für Typo (`text-zinc-900/500/400`) — das ist
  die editoriale Graustufen-Sprache, bewusst neben dem Token-System.
- Modi: Dark = Default (`:root`), Light = `[data-theme="light"]`, Accent = `[data-accent="…"]`.

## 3. Typografie

| Rolle | Font | Einsatz |
|---|---|---|
| **Display** | `font-display` = Cormorant Garamond (Serif, self-hosted via `@fontsource`) | Headlines, große Ziffern, italic Captions. Eleganz/Tradition. |
| **Funktional** | `font-sans` = System-Sans | Fließtext, Daten, UI, Micro-Labels. Handwerk/Präzision. |

**Skala & Muster (aus der Design-Vorgabe):**
- Hero-Headline: `font-display text-[clamp(3.5rem,9.5vw,8.5rem)] leading-[0.88] font-light tracking-tighter`.
- Fluid-Typo generell mit `clamp()` statt fixer Breakpoints.
- **Micro-Label / Kapitälchen:** `text-[9px]–[11px] font-bold tracking-[0.3em–0.45em] uppercase text-zinc-400`.
- **Italic-Caption:** `font-display italic text-zinc-400` (z. B. „Ried Loibenberg, Oktober").
- Große Ziffern/Kennzahlen: `font-display font-light italic` (siehe Hero-Meta-Row).

## 4. Whitespace & Layout

- **Viel Raum zum Atmen** (CLAUDE.md §5). Sections großzügig: `py-24 lg:py-32`, `px-6 lg:px-16`.
- Container `max-w-7xl mx-auto`. Asymmetrie & Überlappung erlaubt (Editorial), keine starren 2-Spalten-Zwänge.
- **Mobile-First**, `aspect-ratio` statt fixer Höhen (`aspect-4/5`, `aspect-3/4`).
- Container-Queries pro Komponente, wo eine Komponente in mehreren Breiten lebt (ARCHITECTURE.md §7).

## 5. Motion

- **Bibliothek:** kopierte AtelierUI-Primitives — `BlurFade` (gestaffelte Einblendung),
  `RevealImage` (Clip-Wipe + Gegen-Zoom, Ease `cubic-bezier(0.16,1,0.3,1)`). Für JS-Animationen sonst `motion/react`.
- **Subtil & erdig:** Fades, Scale, Reveals, Hairline-Draws. **Kein** Partikel-/Glow-/Neon-Spam.
- **Stagger** über `delay`-Props (`150 → 300 → 500 …` ms), nicht über Top-Level-Transition.
- **`prefers-reduced-motion`** ist Pflicht — Primitives sampeln es selbst; global zusätzlich entschärft
  im `@media`-Block von `styles.css`.

## 6. Editoriale Devices (der „Maison"-Look)

Wiederkehrende Signaturen, die Kohärenz erzeugen — sparsam einsetzen:
- Bild-Signaturen `Fig. 01`, römische Plate-Nummern, große Jahrgangs-Ziffern.
- **Vertikale Meta-Rails** (`[writing-mode:vertical-rl]`) am Rand.
- Hairline-Trenner (`border-t border-zinc-200`) über stillen Datenzeilen.
- Weiche, weite Schatten (`shadow-[24px_32px_60px_-24px_rgba(24,24,27,0.25)]`), nie harte Kanten.

## 7. Leit-Motif: „Maison Editorial"

Der **verbindende Ton aller Paper-Sections**: eine kuratierte Magazin-Doppelseite statt klassischer
Web-Sektion — Art-Direction eines Modehauses, das sich als Website verkleidet. Referenz-Umsetzung:
[`Hero.tsx`](./storefront/src/pages/_home/components/Hero.tsx) (Vorlage HeroV6).

**Essenz:** Hierarchie durch **Größe, Überlappung, Weißraum** — nicht durch Boxen/Rahmen/Buttons.
Luxus durch **Zurückhaltung**. Produkt/Bild als Held, UI unsichtbar.

**Flat zuerst, Detail belohnt:** Auf den ersten Blick wirkt eine Maison-Section flach und still —
erst der zweite Blick findet die Verspieltheit: Fußnoten-Ziffern am Preis (`ab 220,–¹`), römische
Numerale, Fig.-Signaturen, Ghost-Wörter, ein Kolophon. Genau diese Dosierung ist der Premium-Ton:
**nie** Ornament, das um Aufmerksamkeit ruft; immer Detail, das Aufmerksamkeit belohnt.

**Box-Verbot:** Karten-Grids mit Border+Shadow sind App-Sprache, keine Maison-Sprache. Listen,
Preise, Stufen → **Hairline-Ledger** (Zeilen über `border-t`, große italic Serif-Werte rechts),
Hervorhebung über Bordeaux-Marginalie statt Rahmen. (Learning aus PricingV5 → PricingV6.)

**Tragende Gesten:**
- **Geschichtete Komposition** — Typografie überlappt Fotografie (`z-10`, `lg:absolute`), eine zweite
  Tafel hängt versetzt darüber. Tiefe durch Overlap, nicht durch Grid.
- **Papier statt Bildschirm** (`bg-paper`) — Farbe kommt fast nur aus der Fotografie; Typo in `zinc`-Grau.
- **Serif riesig & leicht** — `font-display clamp(…,8.5rem) leading-[0.88] font-light tracking-tighter`,
  italic-Akzente auf Schlüsselwörtern („wohnt *im* *Stein.*").
- **Magazin-Möblierung** — Kapitälchen `tracking-[0.4em]`, römische Ziffern (`Édition MMXXVI`),
  Bildsignaturen (`Fig. 01`), italic Foto-Captions, vertikale Meta-Rail (`writing-mode: vertical-rl`).
- **Stille Daten** — Kennzahlen als große italic-Serif-Ziffern über einer Hairline (`border-t border-zinc-200`).
  Fakten als Eleganz, nicht als Marketing.
- **Physik** — weite, weiche Schatten (`shadow-[24px_32px_60px_-24px_…]`); bewusste Asymmetrie;
  Portrait-Aspect (`aspect-4/5`, `aspect-3/4`).

**Bewegung — „die Seite entwickelt sich wie ein Foto":** gestaffelte `BlurFade` (150→300→500→…ms) +
`RevealImage` Clip-Wipe mit Gegen-Zoom (1200–1500 ms, Expo-Out `cubic-bezier(0.16,1,0.3,1)`). Langsam,
kinematografisch — nie zappelig.

**Micro-Interactions — physisch & leise.** Sie **belohnen** Aufmerksamkeit, erzwingen sie nicht.
Regel: nur `scale` / `translate` / Hairline-Draw / Parallax-Tiefe / Weight-Tracking-Shift.
**Nie** Glow, Neon, Partikel, „Tech-Noise". Referenz-Muster steckt im Hero-CTA (`group-hover:w-12→w-20`).

| Interaction | Wirkung | Warum brand-konform |
|---|---|---|
| **Parallax der Tafeln** bei Mausbewegung (wenige px, versch. Tiefen) | verstärkt die Schichtung | subtil, physisch |
| **Slow counter-zoom** auf Foto-Tafeln bei Hover | „lebendes" Bild | erdig, kein Effekt-Feuerwerk |
| **Count-up** der Kennzahlen beim Scroll-In (07, 18, 450 m) | Daten „setzen sich" | ruhig, kurz |
| **Hairline-Draw** der Trennlinien beim Reveal | Zeichnung wie Tinte | editorial |
| **Weight/Tracking-Shift** von Links bei Hover (light→regular) | taktiles Feedback | Typo-nativ |
| **Meta-Rail als Scroll-Fortschritt** | Doppelnutzen des Print-Devices | unsichtbar-funktional |
| **Filmkorn-Overlay** (sehr fein) | Papier-Haptik | Grenzfall — dezent halten |

> `prefers-reduced-motion` deaktiviert **alle** obigen Interactions (§5). Touch-Geräte: Hover-basierte
> weglassen (Parallax/Hover-Zoom), Scroll-basierte (Count-up, Rail) bleiben.

---

## 8. Accessibility (Fundament, nicht optional)

- 100 % Tastatur; sichtbarer Fokus `focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2`.
- Touch-Targets ≥ 44×44 px (Hero-CTA nutzt `min-h-11`).
- `alt` an allen Bildern (leer `''` nur bei rein dekorativ). Korrekte ARIA-Rollen.
- Kontrast in **beiden** Modi prüfen; keine Same-Hue-Pills (COMPONENT-GUIDELINES §9).

## 9. Sections aus dem Showcase übernehmen — Regeln

1. **Neu bauen nach Vorlage**, nicht cross-repo referenzieren (SPEC-DRIVEN.md). Zielort:
   `storefront/src/pages/<seite>/components/` bzw. `_home/components/`.
2. **Roh-Hex → Token:** `bg-[#fdfcf9]` wird zu `bg-paper`. Andere Marken-Farben → semantische Tokens.
3. **Platzhalter → echt:** Unsplash-URLs später durch Vendure-Assets (`astro:assets`) ersetzen; Copy an
   die echte Buchart-Stimme anpassen (die Vorlagen sind bereits gut getextet — behalten wo passend).
   **Fakten von buchart58.at** haben dabei Vorrang vor erfundenem Terroir: Weinort **Sooss** (nicht
   Wachau), Familie Buchart seit 1958, Kellermeister Simon. Reale Angebote: **Rebstockmiete**
   (6 Stöcke, 1 J. ab 220,– / 2 J. ab 290,– / XXL 30 Stöcke 820,–; Holzkassette, Urkunde,
   Riedenwanderung + Verkostung für 4 — „Die Miete ist rein symbolisch"), **Weinverkostung**
   (kleine Probe 6,– / große 30,– inkl. 10,– Gutschein / beim Einkauf 10,–, frei ab 150,–),
   personalisierte Etiketten, Magnumflaschen, geführte Riedenwanderung. Rebsorten: Zweigelt,
   Grüner Veltliner, Merlot, Chardonnay. Referenz-Umsetzung: `PricingV6`/`PricingV7`.
4. **AtelierUI-Deps zuerst kopieren** nach `src/atelier/` (Alias `@components`, siehe GROUNDWORK §G3),
   dann die Section bauen. Kopierten Code nicht editieren.
5. **Eine Section = eine Datei** in `_home/components/`, sprechender Domänen-Name (`Hero`, `Rieden`,
   `Chronik`, `Stimmen`, `Galerie`), Named Export.

## 10. Do / Don't (Kurz)

- ✅ `bg-paper`, `text-zinc-900`, `font-display`, `bg-accent` · ❌ neue Hex-Werte in Komponenten.
- ✅ subtile Springs/Fades · ❌ Glows, Neon, Partikel-Wolken, „Tech-Noise".
  (Ausnahme: der langsame Kerzenstaub der Nocturne-Fläche — Familien-Signatur, sparsam.)
- ✅ viel Whitespace, Produkt/Bild als Held · ❌ gedrängte, überladene Raster.
- ✅ Serif-Headline + Sans-Daten · ❌ Serif für Fließtext/UI.
- ✅ `prefers-reduced-motion` respektieren · ❌ Doppel-Polyfills (Hook _oder_ CSS, nicht beides).
- ✅ Hairline-Ledger für Stufen/Preise · ❌ Karten-Boxen mit Border+Shadow in Paper-Sections (§7).
- ✅ Bilder **füllen ihren Rahmen** (`object-cover`, `h-full w-full`) — besonders in Bogen-/Tafel-Masken
  · ❌ `object-contain`-Fotos mit eigenem Bildhintergrund, die als Rechteck im Rahmen schweben.

## 11. Technische Gotchas (aus Audits gelernt)

- **Gradient-Text + enges Leading:** `background-clip: text` bemalt nur die Element-Box — bei
  `leading-[0.88]` werden Unterlängen („g", „y") abgeschnitten. Zentral gelöst in `ShinyText`/
  `AuroraText` (Padding + negatives Margin); bei neuen Gradient-Text-Stellen dasselbe Muster nutzen.
- **`clip-path` nie auf dem IntersectionObserver-Target:** Chromium rechnet die eigene clip-path in
  die Intersection ein — `inset(100%)` hat nie eine Intersection, das Reveal startet nie (Deadlock).
  Clip auf einen inneren Wrapper legen; Referenz: `RevealImage`.
