# Bekannte Probleme

Stand: 2026-11-10. Die Punkte 3–7 bestanden schon vor den Dependency-Updates vom 25.–27.10., die Punkte 10–11 stammen aus dem Browser-Test des Etiketten-Designers vom 25.–27.10., Punkt 12 aus dem Code-Quality-Scan vom 8.11. (behobene Fehler: `components/cellar-canvas/STATUS.md` #30). Punkt 13 hält Entscheidungen und offene Punkte der 3D-Bühne vom 10.11. fest, Punkt 14 die Entscheidungen und Befunde zum Umbau des Etiketten-Designers vom 10.11. Alle sind bewusst noch nicht behoben. Erledigtes hier löschen, nicht abhaken; die Geschichte steht im git log. Die Nummern bleiben nach dem Löschen stabil, Buchart58 verweist auf diese Datei.

## Offene Fragen an den User (Stand 2026-11-10)

Noch nicht beantwortet, jeweils mit Empfehlung. Beantwortetes wandert als Entscheidung in den passenden Punkt unten oder wird gelöscht.

1. **Hydrations-Checks als echte Tests?** Der bestehende Test `components/atelier/__tests__/performance.test.tsx` rendert nur auf dem Client und deckt keine Hydration ab. Die Checks, mit denen der Provider-Fix (#1) und der Fix für `BlurFade`/`RevealImage` (12.1) geprüft wurden (`renderToString`, dann `hydrateRoot` in jsdom mit abweichendem `localStorage` bzw. `matchMedia`, jeweils vorher FAIL und nachher PASS), lagen nur im Scratchpad der Session und sind weg. Empfehlung: ja, als zwei kleine Vitest-Tests, einer für den Provider und einer für `usePrefersReducedMotion` mit den beiden Komponenten. Neue Tests entstehen nur nach ausdrücklichem Ja. Dasselbe gilt für die Browser-Checks vom 2026-11-09 (Playwright, Scratchpad: Sprachumschalter, gespeicherte Sprache, Reduced Motion, gleichmäßiges Scrollen für `reveal-image`, `Mod+/`). Als Tests in `vendure-showcase/storefront` bzw. Buchart58 wären sie die Absicherung, die bisher fehlt; der `reveal-image`-Fehler war ohne einen Browser mit echtem Scrollen nicht zu sehen.
2. **Scan der übrigen Komponenten?** Nicht geprüft sind `cellar-canvas/engine`, `store`, `templates`, `extras`, `wine-fields`, die übrigen Panels, `header`, `canvas`, alle Tests und die rund 70 Komponenten, die Buchart58 nicht kopiert hat. Empfehlung: `cellar-canvas` zuerst (größtes Risiko, Buchart58 nutzt es im Etiketten-Designer), den Rest später in Stücken. Jeder Lauf kostet einen Opus-Reviewer.
3. **Weitere SSR-Fallen vom Typ 12.1 beheben?** Die Suche nach `window.matchMedia` und `localStorage` ist gelaufen (2026-11-09), geändert wurde dabei nichts. `circular-progress/circular-progress.tsx:53`, `morphing-text/morphing-text.tsx:35` und `cursor-glow/cursor-glow.tsx:36` lesen `matchMedia` direkt im Render (`typeof window !== 'undefined' && window.matchMedia(…)`); ob das bei SSR sichtbare Attribute verändert, ist nicht geprüft. Unkritisch, weil erst zur Event- oder Effektzeit gelesen: `hover-3d-card`, `bounce-cards`, `particles`, `confetti/fire.ts`. `localStorage` kommt außerhalb des Atelier-Providers in `cellar-canvas/components/tour/OnboardingTour.tsx:118,130` und `cellar-canvas/engine/image-source.ts` vor, ob im Render, ist nicht geprüft. Der neue Hook `components/lib/use-prefers-reduced-motion.ts` passt für die drei Render-Fälle. Empfehlung: ja, die drei erst mit dem Check nachstellen, dann umstellen.
4. **Drift-Check zwischen `components/` und Buchart58?** Buchart58 kopiert Komponenten, Änderungen kommen nicht von selbst an, und der Scan fand in beiden Kopien denselben Fehler. Ein `diff -rq` je Ordner (Liste: `Buchart58/storefront/src/atelier/`) zeigt die Abweichungen in Sekunden. Einmal gelaufen am 2026-11-09 (nichts kopiert): 22 Code-Dateien in 11 Ordnern haben Inhaltsunterschiede (`ambient-image`, `atelier/provider.tsx`, `cellar-canvas` mit `fabric-bridge.ts` und Tests, `color-picker`, `hotkeys`, `i18n/provider.tsx`, `image-cropper-modal/messages.ts`, `layer-panel`, `reveal-image`, `shiny-text`, `tooltip`), einzeln nicht eingestuft; manche sind harmlos wie ein `type`-Modifier im Import. Ein echter Fund war `reveal-image.tsx`: Buchart58 trägt das `clip-path` noch am beobachteten Element, hier sitzt es seit dem Deadlock-Fix am inneren Wrapper (am 2026-11-09 im Browser bestätigt: Beim normalen Scrollen der Startseite blieben 4 von 6 Bildern unsichtbar; der Upstream-Stand ist dort inzwischen übernommen, die Datei ist identisch). In Buchart58 fehlen außerdem `cellar-canvas/components/panels/TemplatesPanel.tsx`, `hotkeys/messages.ts`, `hotkeys/shortcut-overview.tsx`, `lib/scrapbook.ts`, `lib/use-disclosure-dismiss.ts` und Tests. Nachtrag 2026-11-09: In Buchart58 ist der Ordner `atelier/atelier` (Provider, Kontext, Init-Script) inzwischen entfernt, weil dort nur die Sprache genutzt wurde, die Islands nutzen `I18nProvider` mit der Route-Sprache, und `language-switcher.tsx` liest dort `useI18n()` statt `useAtelier()`. Der Eintrag `atelier/provider.tsx` in der Liste oben ist damit überholt, die neue bewusste Abweichung ist genau diese eine Zeile. Ohne Filter ist die Zahl verrauscht (24 von 26 Ordnern, weil auch fehlende `COMPONENT.md` zählen): Ein Skript sollte nur Code-Dateien vergleichen. Empfehlung: ja, als kleines Skript oder Skill, das nur meldet und nichts kopiert.
5. **Wechsel von TanStack Hotkeys auf Ark UI Hotkeys?** Empfehlung vom 2026-10-27: beim nächsten Anlass, Aufwand ca. 1 Tag. Der Hinweis hing bis zum 2026-11-08 an Punkt 9 (Shortcut-Hinweis), der behoben ist; die Empfehlung gilt weiter.
6. **3D-Flasche: echtes Buchart58-Etikett und schwarzer Verschluss?** (2026-11-10) Die Form stammt schon von der echten Flasche, Etikett („Atelier · Cuvée Nº 7“) und akzentfarbener Verschluss sind Platzhalter. Der Hero ist als markenfreie Demo entschieden. Empfehlung: den Hero so lassen und eine zweite Variante in der Buch·Art-Familie bauen, statt die Demo umzufärben.
7. **Standbild als Fallback ohne WebGL?** (2026-11-10) Heute bleibt die Bühne dann leer. Empfehlung: erst, wenn die Bühne auf eine echte Shop-Seite kommt; für die Showcase-Demo nicht nötig.
8. **Komponentenzahl in README und Übersicht?** (2026-11-10) Beide nennen 95, im Ordner liegen 100 `COMPONENT.md`. Empfehlung: die Zahl streichen statt nachzuziehen, sie veraltet mit jeder neuen Komponente.

| # | Problem | Wo | Schwere | Aufwand |
|---|---|---|---|---|
| 3 | Falsche Herkunft „Wachau · seit 1958“ in weiteren Showcase-Sections | `section-showcase` | niedrig | später, Platzhalter (User, 8.11.) |
| 4 | Vendure-Showcase-Server ohne Scheduler (braucht getrennten Worker) | `vendure-showcase/server` | mittel | später (User, 8.11.), ca. 2 h Schätzung |
| 5 | Login-CSRF möglich (`csrfPrevention` aus) | beide Vendure-Server | mittel | 1 h |
| 6 | `pg`-Deprecation-Warnung im Worker | Buchart58-Server | niedrig | offen |
| 7 | fallow: 10 Befunde (Exports, Typen, eine Dev-Dependency) | Repo-weit | niedrig | bleibt vorerst (User, 8.11.) |
| 10 | Etiketten-Designer: Panel-Tabs und Vorlage „Classic“ brechen das Layout | `components/cellar-canvas/` | mittel | Entscheidung offen |
| 11 | Etiketten-Designer: kleinere Auffälligkeiten aus dem Browser-Test | `components/cellar-canvas/` u. a. | niedrig | je 0,5 h |
| 12 | Code-Quality-Scan: 12 Befunde (SSR/Hydration, A11y, i18n, toter Code) | `components/` u. a. | mittel | je Punkt |
| 13 | 3D-Bühne (`bottle-stage`, `shader-backdrop`, Hero „Flaschenbühne“): offene Punkte nach dem ersten Bau | `components/`, `section-showcase` | niedrig | je Punkt |
| 14 | Etiketten-Designer: Umbau auf Basics, Overlays und Flaschenansicht | `components/cellar-canvas/` u. a. | mittel | in Arbeit |

---

## 3. Falsche Herkunftsangaben in weiteren Showcase-Sections

**Symptom.** `nav/NavV3.tsx`, `hero/HeroNachtblau.tsx` und `hero/HeroGastgeber.tsx` sind korrigiert („Sooss · Thermenregion", „Hauptstraße 58"). In `HeroNachtblau` und `HeroGastgeber` sind nur die Orts- und Jahreszeilen korrigiert: Rieden (`REGISTER` mit Ried Kreutles, Loibenberg, Steinriegl), Fließtext und Bildtexte reden weiter von der Donau und der Wachau (`HeroNachtblau.tsx:45,57,73,97`, `HeroGastgeber.tsx:151`) und widersprechen damit der neuen Ortszeile. An rund 25 weiteren Stellen unter `section-showcase/src/sections/` stehen noch „Wachau", „Dürnstein", „Unterloiben" oder „seit 1958"/„Anno 1958": `footer/FooterV2` bis `FooterV5`, `footer/FooterCinematic`, `hero/HeroV1`, `HeroV4`, `HeroV6` bis `HeroV8`, `nav/NavV6`, `features/FeaturesV7`, `FeaturesGenussgut` und `FeaturesNachtblau`. Vollständig: `grep -rn "Wachau\|1958" section-showcase/src`.

**Ursache.** Platzhaltertexte aus der frühen Design-Phase, vermutlich für ein fiktives Weingut. Fakten laut buchart58.at: Weingut in **Sooss, Thermenregion** (nicht Wachau); „58" ist die **Hausnummer** (Hauptstraße 58), kein Gründungsjahr – das Gründungsjahr ist online nirgends belegt und muss von der Familie kommen.

**Lösung.** Entscheidung (User, 2026-11-08): Es sind Platzhalter, sie bleiben vorerst, müssen aber irgendwann weg. Dann wie die drei korrigierten Dateien auf die echten Fakten bringen („Sooss · Thermenregion", „Hauptstraße 58", „seit 1958" streichen). In `FeaturesNachtblau` hängen ganze Texte an den Wachau-Lagen, das wäre ein Inhaltsumbau und keine Textersetzung. In Buchart58 sind die Wachauer Riede/Stufe in den Demodaten bereits ersetzt (Commit „Demodaten mit echter Riede…").

## 4. Vendure-Showcase-Server ohne Scheduler

**Symptom.** Beim Start: `No scheduler strategy is configured! Scheduled tasks will not be executed.` – Server und Worker.

**Ursache.** `vendure-showcase/server/src/vendure-config.ts` registriert `DefaultSchedulerPlugin` nicht (Buchart58 tut es, `server/src/vendure-config.ts:84`).

**Auswirkung.** Vendures geplante Aufgaben laufen nicht, u. a. das Aufräumen abgelaufener Sessions und alter Job-Datensätze. Die Tabellen wachsen unbegrenzt; abgelaufene Session-Tokens bleiben in der DB liegen (relevant im Zusammenhang mit den Vendure-Advisories zu Tokens in Job-Daten, siehe `live-docs-collection/vendure/vendure-3.8-changes.md`).

**Lösung.** Das Plugin allein reicht nicht: `DefaultSchedulerPlugin.init()` in die Plugin-Liste aufzunehmen lässt den Start abstürzen (getestet am 2026-11-08 mit Vendure 3.8.1). `src/index.ts` bootstrappt Server und Worker im selben Prozess, Vendures `SchedulerService` legt pro Bootstrap benannte Cron-Jobs an, und `croner` führt diese Namen prozessweit: `Tried to initialize new named job 'clean-sessions', but name already taken`. Auf dem VPS läuft `CMD ["node", "dist/index.js"]`, der Container würde also nach dem Start abstürzen.

Voraussetzung ist die Trennung wie in Buchart58: `index.ts` nur Server, `index-worker.ts` mit `bootstrapWorker`, Scripts `dev:worker` und `start:worker`, ein zweiter Container in `compose.prod.yaml`. Das ist ein Umbau auf dem VPS und kein Ein-Zeiler. Erst danach `DefaultSchedulerPlugin.init()` ergänzen. `synchronize: true` legt die Tabelle des Plugins (`ScheduledTaskRecord`) selbst an. Vor einem Test die lokale `data/vendure.sqlite` sichern. Danach beim Start keine Scheduler-Warnung mehr. Entscheidung (User, 2026-11-08): später.

## 5. Login-CSRF möglich (beide Vendure-Server)

**Symptom.** Beim Start: `Login CSRF is possible: apiOptions.csrfPrevention is off and sessions use cookies, so a cross-site HTML form can POST a login mutation and set a session cookie …` – im Showcase-Server und in Buchart58 (dort ist `csrfPrevention` ebenfalls nicht gesetzt).

**Ursache.** Seit Vendure 3.8 warnt der Server, wenn Cookie-Sessions ohne Apollos CSRF-Schutz laufen. Die Konfiguration selbst ist unverändert.

**Auswirkung.** Eine fremde Seite könnte per HTML-Formular einen `login` auslösen und dem Besucher eine Session unterschieben (Login-CSRF). Für Buchart58 als echten Shop relevant, für das Showcase gering.

**Lösung.** `apiOptions.csrfPrevention: true` setzen. Apollo lässt dann nur Requests durch, die `Content-Type: application/json` oder einen Preflight-Header senden – `graphql-request` in der Storefront und das Dashboard tun das. Vorher prüfen, dass kein Client `multipart/form-data` oder `text/plain` ohne `apollo-require-preflight` schickt (Asset-Uploads im Dashboard!). Prüfen: Login, Warenkorb, Asset-Upload im Dashboard.

**Nicht betroffen.** Die zweite Startwarnung „Insecure CORS configuration" erscheint nur im Dev-Modus: `origin: IS_DEV ? true : (CORS_ORIGINS ?? false)` – in Produktion gilt die Allow-List. Ebenso „Default superadmin password": nur, wenn `SUPERADMIN_PASSWORD` fehlt; auf dem VPS kommt es aus `.env.prod`. Im Showcase fällt die Config dann still auf `superadmin` zurück; Buchart58 bricht stattdessen ab (`process.env.SUPERADMIN_PASSWORD!`) – das wäre auch hier die sicherere Wahl.

## 6. `pg`-Deprecation-Warnung im Buchart58-Worker

**Symptom.** Der Worker loggt: `client.query() when the client is already executing a query` (Deprecation von `pg`).

**Ursache.** Irgendwo laufen zwei Queries parallel auf demselben `pg`-Client statt über den Pool – vermutlich im Job-Queue- oder Scheduler-Pfad von Vendure/TypeORM, nicht in eigenem Code (nicht weiter eingegrenzt).

**Auswirkung.** Heute nur eine Warnung. `pg` kündigt an, das in einer kommenden Major-Version zum Fehler zu machen – dann würde der Worker brechen.

**Lösung.** Vor einem späteren `pg`-Major-Update eingrenzen (Stacktrace mit `NODE_OPTIONS=--trace-deprecation`), ggf. bei Vendure melden. Bis dahin `pg` auf 8.x halten.

## 7. fallow: 10 Befunde

`bunx fallow dead-code` (fallow 3.41.0) meldet noch:

- **7 ungenutzte Exports** in `section-showcase/src/sections/lineage/lineage-graph.ts` (`incomingOf`, `ancestorsOf`, `descendantsOf`, `pathCount`, `depthOf`) und `lineage-layout.ts` (`DEFAULT_LAYOUT`, `egoIds`). Entweder Graph-API, die bewusst vorgehalten wird (dann per `// fallow-ignore-next-line unused-export` mit Begründung markieren), oder entfernen.
- **2 ungenutzte Typ-Exports:** `HandAction` (`components/highlighter/hand-mark.tsx:10`), `MarkerCalloutColor` (`components/marker-callout/marker-callout.tsx:8`). Laut Triage-Regel (Skill `components-verify`) meist gewollte Deep-Import-API – bewusst lassen oder markieren.
- **1 Dev-Dependency:** `tailwindcss` im Root-`package.json` wird dort nicht importiert, nur in den Workspaces `components-showcase`, `launcher`, `section-showcase` und `vendure-showcase/storefront`, die es selbst deklarieren. Prüfen, ob das Root es braucht (ESLint/Tooling), sonst aus den Root-devDependencies entfernen (ändert `bun.lock`).

Das fallow-Gate bleibt rot (Exit 1, 9 Befunde auf Error-Stufe), solange die Exports und Typen nicht entschieden sind. Die CI führt fallow nicht aus. Die beiden Hinweise „boundaries/rule packs not configured“ sind reine Advisories. Entscheidung (User, 2026-11-08): Exports, Typen und `tailwindcss` bleiben vorerst so.

## 10. Etiketten-Designer: Layout bricht bei Tabs und Vorlage „Classic“

**Panel-Tabs.** Die fünf Tabs (Eigenschaften, Weindaten, Hintergrund, Vorlagen, Extras) passen nicht nebeneinander: bei 1440 px angeschnitten, bei 900 px im Vollbild fehlt „Extras“ ganz und die Labels laufen ineinander (`components/cellar-canvas/components/panels/RightPanel.tsx`). Buchart58 nutzt 9-px-Labels, gerechnet für vier Tabs. Optionen: Icons mit Tooltip, scrollbare Tab-Leiste, kürzere Labels oder zwei Zeilen – Gestaltungsentscheidung offen.

**Vorlage „Classic“.** Ein langer Weinname (z. B. „Grüner Veltliner Ried Loibenberg“) bricht in zwei Zeilen um und überdeckt den Jahrgang, weil `templates/templates.ts` die Felder an festen Positionen platziert. Optionen: Jahrgang/Region unter die tatsächliche Höhe des Namens setzen, Schrift für lange Namen verkleinern oder Zeilenlimit – Entscheidung offen. Buchart58 plant ohnehin einen eigenen Konfigurator für Vorlagen.

## 11. Etiketten-Designer: kleinere Auffälligkeiten aus dem Browser-Test

Einzeln behebbar, beim Erledigen den jeweiligen Punkt löschen.

- **Fehlerhinweis im Header bei schmalem Fenster abgeschnitten** (`components/header/CanvasHeader.tsx`): Bei 900 px wird der Text zu einer schmalen Spalte gequetscht und oben/unten abgeschnitten. Option: als Toast statt im Header.
- **Duplizieren erzeugt ein zweites Weinfeld** (`Mod+D`/Kopieren-Button), obwohl das Weindaten-Panel doppelte Felder sonst verhindert. Entscheiden: erlauben, sperren oder die Kopie in normalen Text umwandeln.
- **Rahmenlinie der Vorlage „Rustikal“ bei „Fit“ kaum anklickbar**: Bei Zoom ≈ 0,48 ist die Linie unter einem Pixel breit, `targetFindTolerance` ist 0. Erhöhen wirkt auf alle Objekte; Alternative: Auswahl über die Ebenenliste genügt.
- **Ebenennamen von Weinfeldern uneinheitlich**: Aus dem Weindaten-Panel heißt die Ebene wie der Wert („12.5%“, „750“), aus Vorlagen wie die Bedeutung („Alkoholgehalt“, „Füllmenge“).
- **Emoji-Picker auf deutscher Oberfläche englisch** (`components/panels/ExtrasPanel.tsx`, `emoji-picker-react`): Kategorien, „Skin tone“, „Frequently Used“. Prüfen, welche Texte die Lib per Prop übersetzen lässt.
- **Vollbild-Ausstieg hängt an `!e.defaultPrevented`** (`CellarCanvas.tsx`, Listener für `Escape`): Jede Host-Seite mit eigenem `Escape`-Hotkey (TanStack-Default `preventDefault: true`) blockiert ihn. Im Showcase behoben (#30), die Komponente bleibt anfällig.
- **Label-Stil der Zahlenfelder**: Das Winkel-Feld im Hintergrund-Tab zeigt sein Label seit #30 im `NumberInput`-Stil („WINKEL“, 10 px, Großbuchstaben) statt wie „Von“/„Bis“; gleiche Optik bräuchte einen Prop an `components/number-input/number-input.tsx`. Das Deckkraft-Feld im Eigenschaften-Panel (`PropertiesPanel.tsx`) hat noch ein unverknüpftes `<span>` als Label.
- **Tour**: Der Schritt „Canvas“ (Typ `floating`) sitzt in der Viewport-Mitte, nicht exakt über der Arbeitsfläche (Zag liefert dafür kein Ziel-Rechteck); im Vollbild ca. 120 px rechts der Canvas-Mitte. Bei Tooltip-Schritten ist der Backdrop von Zag `absolute` gesetzt; auf gescrollter Seite bleibt unten ein schmaler Streifen ohne Abdunklung.
- **Farbfeld weicht ab**: Das Swatch #722f37 im Kontur-Picker kommt als #732f37 an, vermutlich Rundung im gemeinsamen ColorPicker (`components/color-picker/`), nicht untersucht.

## 12. Befunde aus dem Code-Quality-Scan vom 2026-11-08

Ein Reviewer (Opus, nur lesend) hat den Diff dieser Runde und die 26 Ordner geprüft, die Buchart58 aus der Bibliothek kopiert hat. Jede zitierte Stelle wurde danach von Hand nachgelesen und stimmt. Der schwerste Befund (12.1, `BlurFade` und `RevealImage` bleiben bei Reduced Motion nach SSR unsichtbar) war per Hydrations-Test bestätigt und ist am 2026-11-09 behoben und gelöscht; seine Nummer bleibt frei. `cellar-canvas` ist nur zum Teil gelesen (`CellarCanvas.tsx` bis Zeile 440, `RightPanel.tsx`, `MainToolbar.tsx`, `components/shared/index.ts`). Nicht geprüft sind `cellar-canvas/engine`, `store`, `templates`, `extras`, `wine-fields`, die übrigen Panels, `header`, `canvas`, alle Tests und die rund 70 Komponenten, die Buchart58 nicht kopiert hat. „Buchart58: ja“ heißt, dieselbe Stelle steht in der Kopie dort. Behoben ist außer 12.1 nichts davon.

**12.2 ShortcutOverview rendert plattformabhängigen Text (niedrig, latent).** `components/hotkeys/shortcut-overview.tsx:92`. `formatForDisplay(OVERVIEW_HOTKEY)` liest `navigator`, und der Dialog wird auch geschlossen gerendert. Ein Server liefert „Ctrl+/“ (ohne `navigator` fällt die Plattform auf Linux zurück), ein Mac-Client „⌘ /“: bei SSR ein Text-Mismatch. Heute nur in der Vite-SPA eingebunden (`components-showcase/src/layout.tsx`), deshalb latent. Entstanden mit dem Fix für #9. Fix: den Hinweis erst rendern, wenn der Dialog offen ist, oder die Plattform per `useSyncExternalStore` mit Server-Snapshot bestimmen. Buchart58: nein, die Datei ist dort nicht kopiert.

**12.3 NumberInput-Stepper sind auf Touch unsichtbar und ohne Namen (mittel).** `components/number-input/number-input.tsx:84–93,130–139`, Einsatz `components/booking-calendar/booking-calendar.tsx:254`. Plus und Minus sind 20 px breite Tippflächen mit `opacity-0 group-hover:opacity-100`; `hover` ist projektweit auf `(hover: hover) and (pointer: fine)` umdefiniert (`components-showcase/src/styles.css`), vermutlich greift deshalb auch `group-hover` auf dem Handy nie (im Browser nicht geprüft). Die SVG-Buttons haben weder `aria-label` noch Text. Im Buchungskalender sieht man auf dem Handy nur die Gästezahl. Fix: Stepper ohne Hover-Bedingung sichtbar machen, mindestens 44 px, `aria-label` über `messages.ts`. Buchart58: ja (`pages/erlebnisse/components/Erlebnisse.tsx:304`).

**12.4 BookingCalendar: englische Screenreader-Texte, kleine Touch-Ziele (mittel).** `components/booking-calendar/booking-calendar.tsx:129–135,148,154,181`. An `DatePicker.Root` wird kein `translations` übergeben, Zag setzt dann seine englischen Defaults („Switch to previous month“, „Switch to next month“, bestätigt in `@zag-js/date-picker` 1.40 und 1.45). Monatspfeile sind 32 px, Tageszellen 36 px (§7: 44 px). Fix: `components/i18n/ark-bridge.ts` um `datePicker` erweitern und `translations` übergeben, Ziele auf `min-h-11 min-w-11`. Buchart58: ja.

**12.5 Backlight ohne Reduced-Motion-Behandlung (mittel).** `components/backlight/backlight.tsx:38–54,162`. Der injizierte Style-Block hat keine `@media (prefers-reduced-motion)`, die Animation läuft endlos. In Buchart58 setzt die globale Regel (`storefront/src/styles.css:123–127`) nur `animation-duration: 0.01ms !important`, ohne `animation-iteration-count`; die Animation läuft dort also mit 0,01 ms weiter. Ob das sichtbar flackert, ist nicht geprüft. Fix: im injizierten Block `@media (prefers-reduced-motion: reduce) { … animation: none !important }`. Buchart58: ja (`WineDetail.tsx:133`, `ProductShowcase.tsx:84`).

**12.6 TextToolOptions lädt Schriften von Google (mittel).** `components/text-tool-options/font-loader.ts`. Die Schriften kommen von `fonts.googleapis.com`; das ist in Buchart58 als B5 in `CELLAR-CANVAS-PLAN.md` bekannt (DSGVO). Fix: Schriften über `@fontsource` selbst hosten, der Lader (`ensureFontStylesheet`, `loadFonts`) bleibt dabei gleich. Die Tastaturbedienung der Schriftliste ist seit 2026-11-11 behoben (Ark `Select`, STATUS.md #32 der Komponente `cellar-canvas`). Buchart58: ja, dort noch mit der alten Liste ohne Tastatur.

**12.7 Rating markiert mehrere Radios als ausgewählt (mittel).** `components/rating/rating.tsx:124–131`. `aria-checked={i < currentValue}` markiert bei Wert 3 die Sterne 1 bis 3 als ausgewählt. Jeder Stern ist ein eigener Tab-Stopp, Pfeiltasten tun nichts. Fix: `aria-checked={i + 1 === currentValue}`, Roving-`tabIndex`, Pfeiltasten. Buchart58: ja, dort aber nicht eingebunden.

**12.8 ValidatorBadge: gleichfarbige Amber-Pill (niedrig).** `components/validator-badge/validator-badge.tsx:48,72,95`. `text-amber-500` auf fast weißem Grund liegt im Light-Mode bei etwa 2:1 (geschätzt, nicht gemessen) und verfehlt 4,5:1; COMPONENT-GUIDELINES §9 nennt genau dieses Muster als Anti-Pattern. Fix: `text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-500/40`. Buchart58: ja (Header des Etiketten-Designers).

**12.9 Tooltip: Beschreibung am falschen Element und überschrieben (niedrig).** `components/tooltip/tooltip.tsx:73–87`. `aria-describedby` hängt am nicht fokussierbaren Wrapper, und `aria-label` am Tooltip hat bei der Namensberechnung Vorrang vor dem Inhalt. Heute ohne Schaden, weil `MainToolbar` denselben Text als `aria-label` setzt. Fix: `aria-label` und den Key `ariaLabel` streichen, `aria-describedby` ans fokussierbare Kind hängen. Buchart58: ja.

**12.10 LayerPanel: motion ohne `useReducedMotion`, Umschalter ohne Zustand (niedrig).** `components/layer-panel/layer-panel.tsx:263–270,449–454`. Höhenanimation und Spring-Reorder laufen bei Reduced Motion weiter (kein `useReducedMotion`, kein `MotionConfig`). „Sichtbarkeit umschalten“ und „Sperre umschalten“ haben kein `aria-pressed`. Buchart58: ja.

**12.11 Etiketten-Designer: Panel-Tabs ohne Tab-Semantik (niedrig).** `components/cellar-canvas/components/panels/RightPanel.tsx:65–80`. Der aktive Tab ist nur an Farbe und Border erkennbar: kein `role="tablist"`, `"tab"` oder `"tabpanel"`, kein `aria-selected`, keine Pfeiltasten (#10 betrifft nur das Layout). Fix: Ark `Tabs`. Buchart58: ja.

**12.12 AmbientImage: `animated` ist wirkungslos (niedrig).** `components/ambient-image/ambient-image.tsx:149–166`. Die Glow-Layer werden erst gemountet, wenn `showGlow` true ist; der Zweig mit `opacity: 0` wird nie erreicht, und die Transition hat beim Mounten keinen Startwert. Dazu vier fast identische Style-Blöcke. Buchart58: ja (`pages/sortiment/components/CaveNocturne.tsx:547`).

**12.13 Regelverstöße und toter Code (niedrig).**

- `components/cellar-canvas/components/shared/index.ts`: Index-Reexport im Komponentenordner (§3), von vier Dateien importiert.
- `components/cellar-canvas/messages.ts:149` (`hotkeyCategory`) und `components/color-picker/messages.ts:11` (`presetsLabel`): Keys, die nirgends verwendet werden (§6).
- `components/product-tag/product-tag.tsx:124`: `injectCssOnce()` greift im Render in den DOM ein, §4c verlangt `useEffect` und `STYLE_ID`.
- `components/hotkeys/hotkeys-provider.tsx:28–29`: `React.useMemo` per Namespace-Zugriff, der Compiler memoisiert selbst (§9).
- `components/image-cropper-modal/image-cropper-modal.tsx:129–136` und `components/cellar-canvas/components/tour/OnboardingTour.tsx:156,176–178`: `animate-in` und `zoom-in-95` sind in `components-showcase/src/styles.css` und `package.json` nicht definiert, Dialog und Tour öffnen vermutlich ohne Animation.
- Buchart58: ja für diese fünf Punkte.
- Zusätzlich nachgelesen, nicht gegen Buchart58 geprüft: `components/add-to-cart-button/add-to-cart-button.tsx:160–161` (beide Zweige des Ternärs gleich, `3.4s` fest verdrahtet statt der Prop `duration`), `components/language-switcher/language-switcher.tsx:5,189` (Kopfkommentar nennt `design-engine-locale` statt `atelier-locale`, `role="listbox"` ohne Escape und Pfeiltasten), `components/alignment-bar/alignment-bar.tsx:81` (`disabled` setzt nur `pointer-events-none`, die Tastatur löst weiter `onAlign` aus), `components/color-picker/color-picker.tsx:159,436` (Eingabefelder ohne zugeordnetes Label) und `:281,:544` (englische ARIA-Texte).
- Hex-Fallbacks wie `var(--accent, #6366f1)` stehen in `tooltip`, `rating`, `add-to-cart-button`, `shiny-text` und `backlight` (formaler Verstoß gegen §2, nicht einzeln aufgeführt).

## 13. 3D-Bühne: Entscheidungen und offene Punkte (2026-11-10)

Gebaut am 2026-11-10: `components/shader-backdrop/`, `components/bottle-stage/`, `components/lib/css-color.ts` und der Hero `section-showcase/src/sections/hero/HeroBottle3D.tsx` (Variante `bottle-3d`).

**Entscheidungen (User, 10.11.):** Einsatz als Showcase-Demo, nicht für Buchart58. Motiv Flasche plus Shader-Hintergrund. `three` + `@react-three/fiber` sind die feste Lib für 3D (in `CLAUDE.md` eingetragen). Der Shader-Hintergrund nutzt bewusst kein three, damit er ohne den großen Chunk sofort steht.

**Flaschenform (User, 10.11.):** Die Proportionen sind aus einem Produktfoto des Buchart58-Shops gemessen (Merlot 0,75 l, schlanke Bordeauxflasche mit Schraubverschluss; Quelle: `Buchart58/storefront/dist/_astro/merlot-sooss__preview_*.webp`), Werte in `components/bottle-stage/COMPONENT.md`. Bekannt sind nur Verhältnisse, keine Millimeter. Farben sind bewusst nicht übernommen: Im Shop ist der Verschluss schwarz, hier folgt er dem Akzent.

**Offen:**

- **Kein Standbild ohne WebGL:** `BottleStage` rendert dann nichts (interne Error Boundary, auch bei einem Etikett, das nicht lädt), `ShaderBackdrop` zeigt nur den CSS-Hintergrund des Elternelements. Für eine echte Shop-Seite bräuchte die Bühne ein Standbild (Frage 7).
- **Nur auf Desktop-Chromium geprüft** (Playwright, 1440 px und 390 px, dazu Reduced Motion). Nicht geprüft: echte Mobilgeräte (Framerate, Akku), Safari, Firefox, Light-Theme-Seiten rund um die fest dunkle Sektion.
- **Konsolenwarnung `THREE.Clock: This module has been deprecated`:** kommt aus `@react-three/fiber` 9.8.2 selbst, nicht aus unserem Code (die Komponente zählt ihre Zeit über `delta`). Verschwindet erst mit einem R3F-Update.
- **Etikett ist ein Platzhalter:** SVG als Data-URL mit Systemschrift, weil ein als Bild geladenes SVG keine Webfonts lädt. Nächster sinnvoller Schritt wäre das Etikett aus `cellar-canvas` als Textur (`canvas.toDataURL()` an `labelSrc`), dieselbe Komponente als 3D-Vorschau im Etiketten-Designer.
- **Theme-Wechsel nur über `<html>` und `<head>`:** Beide Komponenten lesen ihre Farben neu, wenn sich Attribute an `<html>` oder der Inhalt von `<head>` ändern (dort schreibt der `AccentSwitcher` beim Überblenden). Ein Token, das an anderer Stelle oder über `@media (prefers-color-scheme)` wechselt, wird erst bei einer Prop-Änderung übernommen.
- **Offene Befunde aus dem Code-Review vom 10.11.** (per Lesen gefunden, keiner im Browser nachgestellt; behoben sind: nicht klickbare Hero-Links, Absturz ohne WebGL, veralteter Akzent nach `AccentSwitcher`, Canvas fängt Klicks, durchscheinende Farben in `cssColorToRgb`, veralteter IntersectionObserver-Eintrag):
  - `ShaderBackdrop` behandelt keinen Kontextverlust (`webglcontextlost`): Nach einem GPU-Reset bleibt die Fläche leer, und ein späterer Effekt-Lauf auf dem verlorenen Kontext wirft. Auch ein Shader, der nicht kompiliert, wirft aus dem Effekt. Außerdem gibt die Komponente ihren Kontext beim Unmount nicht frei (Chrome erlaubt 16); dafür müsste das Canvas wie bei `light-rays` im Effekt entstehen.
  - Hero: Die ausgeblendeten Intro-Links bleiben per Tastatur fokussierbar (Shift+Tab von unten landet auf einem unsichtbaren Link). Abhilfe: `inert` am ausgeblendeten Block.
  - Hero auf kleinen Telefonen (375 × 667): Buttons und Eckdaten überlappen vermutlich die Flasche, geprüft ist nur 390 × 844. `h-screen` sollte auf Mobil `h-svh` sein.
  - Reduced Motion zur Laufzeit umschalten: Die Flasche friert in ihrer letzten Pose ein, und der Hero liest die Einstellung über motion nur beim Mount.
  - Eine Änderung von `speed`, `scale` oder `grain` baut das Shader-Programm neu und setzt die Zeit auf 0 (sichtbarer Sprung).
  - Benennung: `capsuleColor`, `capsuleProfile` usw. meinen inzwischen den Schraubverschluss. Die Kommentare in `HeroBottle3D.tsx` sind deutsch wie in den anderen Heroes, die globale Regel verlangt Englisch.
- **Komponentenzahl in der Doku veraltet:** siehe Frage 8 oben.
- **Messskript nicht aufbewahrt:** Die Silhouette wurde mit einem Wegwerf-Skript vermessen (PNG zeilenweise lesen, Breite je Zeile über den Alphakanal, Etikett über die Farbe). Es lag im Scratchpad der Session und ist weg. Für eine zweite Flaschenform (z. B. die Magnum) müsste es neu entstehen, Aufwand ca. 15 Minuten; das Vorgehen und die Ergebniswerte stehen in `components/bottle-stage/COMPONENT.md`.
- **Größenschätzung lag daneben:** Angekündigt waren 150 bis 200 KB gzip für three, gemessen sind 246 KB. Künftige Schätzungen für neue Libs vor der Zusage mit einem Probe-Build belegen.

## 14. Etiketten-Designer: Umbau auf Basics (2026-11-10)

**Ziel (User, 10.11.):** Kunden laden ihr meist fertig gestaltetes Etikett hoch, passen nur Kleinigkeiten an, blenden Weindaten ein und sehen das Ergebnis auf einer drehbaren Flasche.

**Entscheidungen (User, 10.11.):**

- **Umfang „Basics plus Formen und Vorlagen“:** Es bleiben Bild hochladen (füllt das Etikett), Zuschneiden und Ersetzen, Text (Schrift, Größe, Farbe, fett/kursiv, Ausrichtung), Rechteck, Kreis und Linie, Hintergrund als Farbe oder Bild, Vorlagen, Weindaten-Overlays, eine kompakte Ebenenliste, Rückgängig, Zoom, Speichern, PNG und PDF. Raus fliegen Emoji-Picker, Unterschrift, Ornamente, Lineal, das Hand-Werkzeug als Button, Gruppieren, Verlaufs-Hintergrund, die geführte Tour und die mm-Eingabe als eigener Tab (wird ein einklappbarer Abschnitt).
- **Overlays sind gedruckte Bausteine mit Schalter** (Weinname, Jahrgang, Region, Erzeuger, Pflichtangaben-Block, QR-Code): eingeschaltet liegen sie fertig formatiert an einer sinnvollen Stelle, lassen sich verschieben und werden mitgedruckt.
- **Flaschenansicht:** ja, als Umschalter „Etikett | Flasche“ über der Arbeitsfläche. `BottleStage` trägt das aktuelle Etikett und lässt sich mit der Maus drehen (war Frage 7).
- **Commits:** ein Commit je logischem Schritt direkt auf `main`, jeweils nach Lint, Typecheck und Tests, ohne Push.

**Annahmen (nicht bestätigt):**

- Desktop und Tablet zuerst, am Handy nur ein Notbetrieb.
- Google Fonts bleiben die Schriftquelle. Selbst gehostete Schriften (12.6) sind ein eigener Schritt.
- Flaschenhöhe ca. 300 mm für die Umrechnung der Etikettmaße auf die 3D-Flasche. Gemessen sind nur Verhältnisse (Punkt 13).
- Buchart58 behält seine Kopie, der Umbau kommt dort nicht von selbst an.

**Befunde aus dem Browser-Test vom 10.11.** (Chromium, 1440 × 900 und 1024 × 768, `/designer`). Sie werden mit dem Umbau behoben und dann hier gelöscht, der Fortschritt steht in `components/cellar-canvas/STATUS.md` #32:

- **Layout:** Tab „Extras“ ist bei 1440 px nicht erreichbar (#10). Die Kontext-Leiste läuft bei Textauswahl über, bei 1024 px liegen Zoom und „Anpassen“ außerhalb des Fensters. Die Werkzeugleiste endet auf halber Höhe, „Ebenen“ steht doppelt.
- **Weindaten:** Felder landen gestapelt an derselben Stelle, als Rohwert („750“, „12.5%“). Der Validator meldet danach „EU-konform“.
- **Upload:** Der Zuschnitt ist Pflicht und schneidet mit seinem Standardrahmen von 95 % ohne Zutun 5 % ab. Das Bild landet als 40-mm-Kasten in der Ecke, Einrasten gibt es nur zur Etikettmitte.
- **Einpassen:** Der 40-mm-Arbeitsrand zählt mit, das Etikett belegt ca. 300 von 1030 px Breite.
- **Texte:** „Bleed“, „Snapping“, „Rot“, „LS/LH/SW/OP“, „Cmd+…“ auf jeder Plattform. Validator nur deutsch, Ebenennamen nur englisch, Text-Ebenen heißen dauerhaft „Neuer Text“.
- **Handy (390 px):** Die Arbeitsfläche ist nicht sichtbar.
