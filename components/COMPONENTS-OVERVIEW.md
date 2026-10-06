# AtelierUI Components Overview

Diese Übersicht dient als Schnellreferenz für den Aufbau von Premium-Storefronts und Landingpages. Alle Komponenten sind für React 19 / React Compiler optimiert. Details (Props, Usage, Dependencies) stehen in der `COMPONENT.md` des jeweiligen Ordners.

---

## 1. Core & Design Engine (Cellar Canvas)
*Komplexe Logik für individuelle Produktgestaltung.*

- **cellar-canvas:** Der zentrale Weinlabel-Designer.
- **alignment-bar:** Steuerung für Objekt-Ausrichtung.
- **color-picker / color-swatch:** Hochwertiger Farbwähler und sein kompakter Popover-Trigger (Ark UI).
- **image-cropper-modal:** Bildbearbeitung mit Ark UI, Ausgabe in Druckauflösung.
- **layer-panel:** Ebenen-Management mit Drag-Reorder (dnd-kit).
- **stack-order-controls:** Z-Reihenfolge (nach vorne / hinten).
- **text-tool-options:** Typografie-Einstellungen.
- **validator-badge:** EU-Konformitäts-Check (E-Label).

## 2. Visual & Premium Effects (The "Microinteractions")
*Für das "Look & Feel" einer High-End Marke.*

- **ambient-image / backlight:** Sanfte Leuchteffekte für Produktbilder.
- **aurora-text / shiny-text / sparkles-text:** Edle Text-Animationen.
- **blur-fade / reveal-image / view-transition:** Flüssige Übergänge beim Scrollen oder Navigieren.
- **click-spark / splash-cursor / confetti:** Interaktives Feedback auf User-Aktionen.
- **wave-text / numeral-reveal:** Versteckte Klick-Eastereggs — Textwelle bzw. römische Ziffer, die kurz ihren arabischen Wert zeigt. Bewusst ohne Cursor-Wechsel.
- **cursor-glow / glow-card / hover-3d-card:** Subtile Licht- und Tiefeneffekte, die dem Pointer folgen.
- **magnetic-button / jelly-button:** Physisch wirkende Buttons.
- **morphing-text / text-rotate / text-scramble:** Dynamische Typografie.
- **particles / light-rays:** Atmosphärische Hintergrundeffekte.
- **pixel-image / bounce-cards / lens:** Bild-Reveal, auseinanderfedernde Bildkarten, Lupe.
- **animated-icons / animated-weather-icons:** Lottie- und CSS-animierte Icons.

## 3. E-Commerce & Conversion
*Direkter Fokus auf Verkauf und Warenkorb.*

- **add-to-cart-button:** Animierter Button mit State-Feedback.
- **cart-icon / floating-cart:** Minimalistische Warenkorb-Anzeige.
- **heart-like:** Merken / Favorit mit Feier-Animation.
- **pricing-interaction:** Interaktive Preisdarstellung.
- **product-tag / banner / sticky-banner:** Highlights und Ankündigungen.
- **rating:** Edle Sterne-Bewertung.
- **booking-calendar:** Termin-Picker für Verkostung, Wanderung, Kellerführung (Ark UI DatePicker).

## 4. Navigation & Layout
*Struktur für die Premium-Landingpage.*

- **navbar:** Adaptive Navigation (Glassmorphism).
- **dock:** macOS-style Navigation für moderne Interfaces.
- **breadcrumb / back-to-top:** Orientierung und Komfort.
- **scroll-progress / scroll-rotate:** Visuelles Feedback beim Explorieren.
- **carousel / images-slider / velocity-scroll:** Galerien, Hero-Slider, Marquee.
- **shape-card:** Nicht-rechteckige Karten über `corner-shape`.
- **file-tree:** Aufklappbarer Baum (`role="tree"`).
- **footer-section:** Hochwertiger Abschluss der Seite.

## 5. Forms & Inputs
*Minimalistische und intelligente Dateneingabe.*

- **form-input / field-hint:** Eingabefeld mit externer Validierung und Info-Hinweis.
- **gooey-input / animated-search / search-morph:** Organische Such- und Eingabefelder.
- **search-overlay:** Spotlight-Suche mit `Mod+K` und TanStack Query.
- **autocomplete-cell:** Eingabe mit gefilterten Vorschlägen.
- **slider / switch / checkbox:** Eigene, tastaturbedienbare Basis-Controls (ohne Fremd-Lib).
- **number-input / number-ticker:** Präzise Werteeingabe und animierte Zahlen.
- **password-setup / password-confirmation:** Sicherer Onboarding-Flow.
- **use-image-upload:** Hook + Drop-Zone für Bild-Uploads.

## 6. Editorial & Daten
*Inhalt in Szene setzen.*

- **pull-quote:** Editoriales Zitat für Stimmen und Markenbriefe.
- **paper-note:** Scrapbook-Notiz aus Papier (rundum gerissen oder vom Block) mit Klebestreifen und Pfeil, für persönliche Zwischentöne wie Einladungen und Termine.
- **polaroid-frame:** Foto im Polaroid-Rahmen mit handschriftlicher Caption und optionalem Washi-Tape, für persönliche Momente in Event- und Story-Sections.
- **process-steps:** Statische Erklär-Kette in drei Darstellungen (Papier-Kreise, Wanderpfad, Hairline-Ledger), z. B. vom Rebstock bis ins Glas. Kein Wizard, dafür gibt es stepper.
- **marker-callout:** Ein Satz auf handgemachter Fläche (Pinselstrich, Aquarell oder Kreppband-Zeilen) für die Zeile, die hängen bleiben soll. Textmarker im Fließtext: highlighter mit `action="marker"`.
- **paragraph / highlighter:** Kürzbarer Fließtext mit Wort-Reveal, Text-Markierung beim Scrollen (Fläche, Unterstrich oder handgezeichneter Textmarker).
- **timeline:** Storytelling für Marken-Historie.
- **data-table:** TanStack-Table mit Sortierung, Pagination, Auswahl und Spaltenbreiten.

## 7. Feedback & System
*Der letzte Schliff.*

- **toast / tooltip:** Subtile Informationen.
- **stepper:** Horizontaler und vertikaler Mehrschritt-Wizard.
- **circular-progress / bounce-loader:** Lade- und Fortschrittszustände.
- **countdown:** Dringlichkeit für limitierte Angebote.
- **hotkeys:** Tastatursteuerung für Power-User (Registry + `?`-Übersicht).
- **atelier / i18n:** Zentraler Theme-, Akzent- und Sprach-State.
- **language-switcher / accent-switcher / animated-theme-toggler:** Globalisierung und Personalisierung.

---
*Stand: 2026-10-06 — 95 Komponenten, jede mit eigener `COMPONENT.md`.*
