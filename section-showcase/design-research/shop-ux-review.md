# Review: Webdesign-Forschung gegen die Buchart58-Idee

Erstellt am 2026-11-12 von einem Recherche-Subagenten, danach nachgeprüft:

- **Nachgeprüft:** die Aussagen über eigene Dateien (Buch·Art-Variante in allen 15 Sections, `StoreBuchArt.tsx:197`, `EventsBuchArt.tsx:171`, `TestimonialsBuchArt.tsx`, `vendure-showcase/docs/altersverifikation.md`, Texte in `HeroV6.tsx`, keine Altersabfrage in beiden Storefronts) und die Baymard-Abbruchgründe (Stand 28.10.2026).
- **Nicht geprüft:** Rechtsfragen (Jugendschutz, E-Label, BaFG, Widerrufsbutton). Sie stammen zum Teil nur aus Suchtreffern und ersetzen keine Auskunft von WKO oder Jurist.

**Korrektur (2026-11-12):** Der Auftrag an den Reviewer nannte „bodenständiger Ton, nicht französisches Maison“ als belegte Markeneigenschaft. Das stimmt nicht. Es war die Einschätzung einer früheren Session aus der Recherche von buchart58.at, keine Entscheidung. Das Design-System von Buchart58 (`Buchart58/.claude/skills/buchart58-design-system/SKILL.md`) nennt „Maison Editorial“ ausdrücklich als Leitmotiv, und der Hero der Buchart58-Storefront ist bereits so gebaut. Belegt falsch sind nur die Texte in `HeroV6` (Wachau, „Maison seit 1958“, Donau, „Domaine Buchart“), siehe `KNOWN-ISSUES.md` #3. Die Stellen unten, die den Gestaltungsstil selbst als markenfremd werten, sind entsprechend markiert.

Grundlage ist die frühere Analyse von 13 Weingut-Websites in [README.md](README.md). Offene Fragen daraus: `KNOWN-ISSUES.md` Nr. 14 bis 16.

Belegt heißt: aus Datei, Screenshot oder abgerufener Quelle. **Einschätzung** ist die Bewertung des Reviewers. Quellen [n] stehen unten.

## 1. Kurzfazit

1. Die Substanz stimmt: Alle 15 Section-Typen haben eine Buch·Art-Variante mit echten Fakten und echtem Farbcode. Der Hero „Buch·Art“ zeigt die Flaschen und einen klaren CTA zum Shop.
2. Das Konzept „Familie wählt aus 110 Varianten“ und der Favorit „Maison Editorial“ (`HeroV6`) laufen gegen die eigene Marke. `HeroV6` trägt „Wachau … Maison seit 1958“ und zeigt keinen Wein. Die Flaschenbühne ist markenfremd und laut Entscheidung vom 10.11. nur eine Demo.
3. Die größten Conversion-Hebel der Forschung (Gesamtkosten sichtbar, Gastcheckout, Produktseite, Ladezeit) und die Pflichtbausteine (Altersabfrage, E-Label, Widerrufsbutton, Barrierefreiheit) liegen außerhalb der 15 Section-Typen oder fehlen.
4. Empfehlung: nicht auf 110 öffnen, sondern kuratieren (Buch·Art-Satz plus höchstens 2 Alternativen je Section). Cinematisch nur als begrenzter Akzent mit Standbild-Fallback.
5. Lücke: Zur Conversion von 3D-Heroes oder Easter Eggs gab es keine belastbare Studie. Dort stützt sich der Bericht auf indirekte Belege.

## 2. Was gutes Shop-Design für unseren Fall ausmacht

1. **Gesamtkosten früh zeigen.** 40 % der Abbrüche nennen zu hohe Zusatzkosten, 12 % sehen die Gesamtsumme nicht vorab [5]. 67 % der Shops zeigen keine Gesamtsumme am Kaufbereich [6]. *Für uns:* Die DPD-Staffel (AT 6er 10 €, 12er frei; DE 17/12 €) steht nur unten in `StoreBuchArt.tsx:197`. Sie gehört an jeden Preis und CTA.
2. **Gastcheckout.** 18 % brechen bei Kontopflicht ab [5]. *Für uns:* Customer-Auth ist Launch-Scope [D2]; sie darf den Kauf nicht erzwingen.
3. **Vertrauen und Fehlerfreiheit.** 19 % misstrauen der Zahlung, 17 % brechen bei Fehlern ab [5]. *Für uns:* Die echten Google-Rezensionen (5,0 aus 66, `TestimonialsBuchArt.tsx`) sind ein Vorteil.
4. **Produktseite.** Nur 38 % der mobilen Shops sind „decent“ oder besser. 37 % zeigen keine Größenbezüge, 78 % keine Geschenkoption [6]. *Für uns:* Magnum, 0,75 l und Geschenk (Rebstock-Urkunde) sichtbar machen.
5. **Ladezeit.** Gut sind LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 am 75. Perzentil, getrennt nach Mobil und Desktop [7]. 0,1 s schneller bringt +8,4 % Retail-Conversion (Daten Ende 2019, alt) [8]. 79 % von 5.580 US-Westküsten-Weingütern liegen unter dem Benchmark [17]. *Für uns:* Tempo ist ein Wettbewerbsvorteil, kein Nebenthema.
6. **Der obere Bereich entscheidet.** 57 % der Blickzeit liegen über der Falz, 74 % in den ersten zwei Bildschirmen (2018) [2]. *Für uns:* Der erste Screen muss Wein, Ort und Hauptaktion zeigen.
7. **Scroll nicht kapern.** Scrolljacking nur unterhalb der Falz, nicht mobil, Schlüsseltext heraushalten. Mobil sind die Probleme schlimmer [1].
8. **Bewegung steuerbar.** Auto-startende Bewegung über 5 s neben anderem Inhalt braucht Pause/Stopp (WCAG 2.2.2, Level A) [10]. Parallax gilt als meist nicht essenziell (2.3.3) [9].
9. **Microinteractions mit Zweck.** Kurz, nicht „fluffy“, passend zum Markenton (2018) [3].
10. **Konsistenz und Reduktion.** Heuristiken #4 und #8 [4].
11. **Pflichttexte.** Wein ab 16, Spirituosen ab 18 [14]. E-Label: Brennwert und Sulfit stehen auf dem Etikett, Zutaten und Nährwerte per QR. Im Shop müssen sie vor dem Kauf sichtbar sein (Sekundärquelle) [13].
12. **Barrierefreiheit.** BaFG gilt seit 28.06.2025. Die Kleinstunternehmen-Ausnahme (< 10 Beschäftigte, ≤ 2 Mio. €) nennt die WKO für Dienstleistungen. Ob sie für einen Webshop mit Waren greift, klärt die WKO-Seite nicht, und die Grenze gilt für das Unternehmen, nicht den Shop. Das BGStG kann trotzdem greifen. Maßstab ist EN 301 549 (WCAG 2.1), empfohlen wird 2.2 [11]. *Für uns:* Die Mitarbeiterzahl ist nicht belegt. Rechtlich klären, WCAG AA ohnehin anstreben.
13. **Widerruf und Abo.** Der Widerrufsbutton (§ 13a FAGG) hat laut WKO widersprüchliche Stichtage (1.10.2026 oder 19.6.) [15]. Das betrifft Shop, Events und Rebstockmiete.
14. **Wiederkehr.** Über 80 % der Erstkäufer bestellen binnen eines Jahres nicht erneut (US/Kanada, Stichprobe unbekannt, Okt. 2026) [16]. *Für uns:* Abo, Dashboard und Etikett sind Rückkehrgründe, nicht Zusatz.

## 3. Stärken unserer Idee

- **Geschlossener Buch·Art-Satz.** In allen 15 `manifest.ts` gibt es eine Variante `buchart` (Sooss, Hauptstraße 58, Original-Texte, Etiketten-Farbcode). Das ist Markenkonsistenz und Vertrauen.
- **Hero „Buch·Art“.** Der Screenshot `hero-d-buchart.png` zeigt Produkt als Hero, ein Rot-Gold-Creme-Farbsystem und einen primären Button ohne Rabatt-Lärm. Das deckt sich mit dem Befund [D3], dass 7 von 13 Referenzseiten mit einem Rabatt begrüßen.
- **Offener Umgang mit Schwächen.** KNOWN-ISSUES #3, #12 und #13 benennen die Lücken bereits.
- **Bewegung mit Sicherheitsnetz.** Der Quellcode von `shader-backdrop` pausiert off-screen und unter Reduced Motion. `HeroBottle3D` hat einen Reduced-Motion-Pfad und lädt three per `lazy()`.
- **Nativer Scroll.** Die Bühne nutzt `useScroll`/`useTransform` auf einem sticky 220vh-Abschnitt. **Einschätzung:** Sie ändert Tempo und Richtung nicht und ist damit milder als das Scrolljacking, das NN/g testet [1].

## 4. Schwächen und Risiken

**Hoch**

- **Favorit widerspricht der Marke** (gilt nur für die Texte, siehe Korrektur oben). `hero-d-v6.png` zeigt „Wachau · Österreich — Maison seit 1958“, „Donaunebel“ und „Domaine Buchart · Édition MMXXVI“. Belegt sind Sooss, „58“ als Hausnummer und ein bodenständiger Ton [D4 #3]. Im ersten Bild fehlt der Wein, der CTA „Die Weine“ ist ein kleiner Textlink. 8 von 13 Heroes tragen falsche Platzhalter [D4 #12].
- **Auswahl erzeugt Baukastenbrüche.** Die Gestaltungssprachen (Maison, Nocturne, Nachtblau, Genussgut, Schwarzweiß) sind nicht untereinander kombinierbar. Die eigene Analyse straft genau das („Reife: Baukastenbrüche“) [D3], ebenso Heuristik #4 [4]. Prüfkriterien je Variante fehlen noch [D4 #12].
- **Pflicht- und Kernbausteine fehlen.**
  - Im Code gibt es keine Altersabfrage und kein E-Label.
  - Die Events sind nur „Unverbindliche Anfrage, kein Kaufabschluss“ (`EventsBuchArt.tsx:171`), obwohl Säule 2 Buchung mit Platzlimit verlangt [D2].
  - Warenkorb, Checkout und Dashboard kommen in den 15 Typen nicht vor.
  - Die interne Altersdoku nennt das „Wiener Jugendschutzgesetz“ (`vendure-showcase/docs/altersverifikation.md`). Sooss liegt in Niederösterreich; Jugendschutz ist Landesrecht (Jugendinfo NÖ, Bundeskanzleramt: Wein ab 16) [14].
- **Flaschenbühne als echte Option.**
  - *Entscheidungen:* Am 10.11. war sie „Showcase-Demo, nicht für Buchart58“, am 12.11. muss jede Variante „echte Option“ sein [D4 #13, D1].
  - *Marke und Inhalt:* Die Screenshots zeigen Indigo-Akzent, violetten Rauch, ein beim Start abgewandtes Etikett und Text über die Technik („Kein Foto, kein Video“). Das Etikett ist Platzhalter („Atelier · Cuvée Nº 7“).
  - *Technik:* Auf 390 × 844 sitzt die Flasche klein unter den Buttons, 375 × 667 ist ungeprüft. Ohne WebGL bleibt die Bühne leer, geprüft ist nur Desktop-Chromium, der three-Chunk hat 246 KB gzip [D4 #13].

**Mittel**

- **Mobiler erster Screen.** Bei `hero-m-gastgeber.png` belegen Kopfzeile, Buttons und Navigation rund 320 von 844 px, ohne Wein. Bei `hero-m-buchart.png` liegen die Flaschen unter der Falz. Mobil trägt nur Text plus CTA. Der mobile Anteil ist Annahme.
- **Viele Microinteractions.** 17 Section-Dateien importieren `motion/react`, 20 behandeln Reduced Motion (teils über gemeinsame Komponenten). Ob jede Bewegung abgedeckt ist, ist nicht geprüft. Dem Shader fehlt ein sichtbarer Pause-Schalter (WCAG 2.2.2 [10], falls anwendbar).
- **Hero „Buch·Art“ bewirbt „Eigenes Etikett gestalten“.** Der Etiketten-Designer ist nicht im Launch-Scope [D2].
- **Kontrast.** Die vertikale Meta-Zeile und die grauen Kicker bei `HeroV6` wirken im Screenshot schwach (nicht gemessen).
- **Keine Testbasis.** Bei rund 60 Bestellungen im Monat (**Einschätzung**, aus 2/Tag) sind A/B-Tests nicht tragfähig. Entschieden wird nach Geschmack, die Familie ist nicht die Kundschaft.

**Niedrig**

- Easter Eggs: Auffindbarkeit und Pflege. Unkritisch, solange nichts Wichtiges daran hängt.
- Bundle-Größe: **Einschätzung**, offen ob alle 110 Varianten im Produktiv-Bundle landen.

## 5. Ausbaufähig

1. **Kuratieren statt 110.** Je Section Buch·Art plus höchstens 2 Alternativen derselben Sprache. Dazu ein globaler Schalter „schlicht oder cinematisch“ vor der Section-Wahl. Aufwand: klein bis mittel.
2. **`HeroV6` retten.** Echte Fakten (Textersetzung laut #3), Gold `#BE9F55`, Flasche im Bild, echter Button, „Maison“ und „Domaine“ raus. Aufwand: klein.
3. **Prüfliste je Variante.** 375 × 667 und 1440 × 900, Reduced Motion, Fokus, keine Platzhalter (#12). Aufwand: mittel.
4. **Cinematic als Akzent.** Flaschenbühne in Creme und Gold mit echtem Etikett als Textur [D4 #13], Standbild bei WebGL aus, Mobil und Reduced Motion, mobil ohne 220vh-Sticky. Aufwand: mittel bis groß.
5. **Pflichtbausteine.** Altersabfrage als ein Overlay vor den Cookies [D3]. E-Label (QR, Brennwert, Sulfit) auf jeder Produktseite. Versandkosten und Gesamtsumme am Preis, Gastcheckout. Aufwand: mittel.
6. **Rechtsklärung vorab.** Jugendschutz NÖ, BaFG-Status, Widerrufsbutton, E-Label-Auslegung für Jahrgang 2023 (nur deutsche LGL-Aussage [13], österreichische Fassung ungeprüft). Aufwand: klein (WKO oder Jurist).
7. **Events mit Platzanzeige** („noch 4 Plätze“). Das ist ein Plugin, nicht nur eine Section. Aufwand: mittel.
8. **Easter Eggs.** 3 bis 5, markenbezogen (Buch-Signet blättert, Hausnummer 58), außerhalb von Kauf, Altersabfrage und Checkout, mit Hinweis im Footer. Aufwand: klein.
9. **Messen statt raten.** LCP-Budget (mobil ≤ 2,5 s) im CI, Messung mit echten Nutzern, 5 Handy-Tests. Aufwand: klein bis mittel.

## 6. Widersprüche zwischen Forschung und Richtung

- **Viele Microinteractions gegen INP, Vestibular und Zweck.** INP ≤ 200 ms [7], Reduced Motion [9], „nicht fluffy“ [3]. Lösung: ein Signature-Effekt pro Section, sonst nur Hover und Fokus.
- **Scroll-Bühne gegen NN/g.** Nicht mobil, Schlüsseltext heraus, nur unterhalb der Falz [1]. Die 220 vh belegen außerdem genau die Zone mit der meisten Aufmerksamkeit [2].
- **Easter Eggs gegen Auffindbarkeit.** Per Definition werden sie nicht gefunden. Belege für einen Nutzen gab es keine.
- **„Schlicht oder cinematisch“ je Section gegen Konsistenz.** Wer mischt, bricht Heuristik #4 [4].
- **„Produkt als Hero“ gegen die Favoriten.** `HeroV6` zeigt Landschaft und Glas, die Flaschenbühne hat das Etikett beim Start abgewandt.
- ~~**„Bodenständig, nicht Maison“ gegen `HeroV6`.** Der Favorit heißt selbst „Maison Editorial“.~~ Entfällt, siehe Korrektur oben: „Maison Editorial“ ist das Leitmotiv des Buchart58-Design-Systems.
- **Launch-Scope gegen Hero-CTA.** „Eigenes Etikett gestalten“ ohne Designer [D2].
- **Datum gegen Datum.** Demo (10.11.) gegen „jede Variante echte Option“ (12.11.).

## 7. Quellenliste

Interne Belege: [D1] `__Components__/CLAUDE.md` (Ziel), [D2] `Buchart58/vault/BIG-PICTURE.md`, [D3] `section-showcase/design-research/README.md`, [D4] `KNOWN-ISSUES.md` #3, #12, #13. Ferner `section-showcase/src/sections/*/manifest.ts`, `HeroBottle3D.tsx`, `StoreBuchArt.tsx`, `EventsBuchArt.tsx`, `TestimonialsBuchArt.tsx`, `components/shader-backdrop/`, `vendure-showcase/docs/altersverifikation.md` und die Hero-Screenshots vom 2026-11-12 (`.playwright-mcp/`, nicht versioniert).

Webseiten-Auszüge stammen von einem Zusammenfassungsmodell. Mit „Suchtreffer“ markierte Quellen wurden nicht selbst abgerufen, sie stützen sich auf Suchausschnitte.

- [1] NN/g, Scrolljacking 101 (2023): https://www.nngroup.com/articles/scrolljacking-101/
- [2] NN/g, Scrolling and Attention (2018, älter): https://www.nngroup.com/articles/scrolling-and-attention/
- [3] NN/g, Microinteractions (2018, älter): https://www.nngroup.com/articles/microinteractions/
- [4] NN/g, 10 Usability Heuristics (1994, geprüft 2024): https://www.nngroup.com/articles/ten-usability-heuristics/
- [5] Baymard, Cart Abandonment (Stand 28.10.2026, US-Daten): https://baymard.com/lists/cart-abandonment-rate
- [6] Baymard, Product Page Benchmark (aktualisiert 03/2026): https://baymard.com/blog/current-state-ecommerce-product-page-ux
- [7] web.dev, Core Web Vitals: https://web.dev/articles/vitals
- [8] web.dev, Milliseconds Make Millions (Daten 2019, älter): https://web.dev/case-studies/milliseconds-make-millions
- [9] W3C, WCAG 2.2 SC 2.3.3: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- [10] W3C, WCAG 2.2 SC 2.2.2: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- [11] WKO, BaFG im E-Commerce FAQ (Stand 01.02.2026): https://www.wko.at/internetrecht/barrierefreiheitsgesetz-im-e-commerce-faq
- [12] BaFG, ergänzend (Suchtreffer): https://www.sozialministerium.gv.at/Themen/Soziales/Menschen-mit-Behinderungen/Barrierefreiheitsgesetz.html
- [13] E-Label (Suchtreffer): https://www.wko.at/oe/handel/agrarhandel/weinkennzeichnung-kurzanleitung.pdf · https://magazine.wein.plus/entalkoholisierte-weine-richtig-deklarieren-onlineshops-kataloge-und-prospekte · https://www.lgl.bayern.de/lebensmittel/warengruppen/wc_33_weine/doc/wein_infoblatt_zutaten_naehrwerte.pdf (Deutschland)
- [14] Jugendschutz (Suchtreffer; Broschüre Stand 2019, kein Gesetzestext): https://www.bundeskanzleramt.gv.at/agenda/jugend/jugendschutz.html · https://www.jugendinfo-noe.at/wp-content/uploads/2022/06/a5_broschuere_jugendschutz_oesterreich_2019_noe_web.pdf · https://www.it-recht-kanzlei.de/jugendschutz-online-verkauf-alkohol-faq.html (Deutschland)
- [15] Widerrufsbutton (Suchtreffer, Daten widersprüchlich): https://www.wko.at/internetrecht/e-commerce-widerrufsbutton-webshop · https://www.wko.at/ooe/news/widerrufsbutton-ab-juni-verpflichtend
- [16] Commerce7 via Wine Industry Advisor (07.10.2026): https://wineindustryadvisor.com/2026/10/07/more-than-8-in-10-first-time-winery-web-buyers-dont-order-again-within-a-year-new-commerce7-data-shows/
- [17] Vinetur/Transom (19.06.2026, US-Westküste): https://www.vinetur.com/en/20260619102975/most-west-coast-winery-websites-fall-short-on-speed-hurting-online-sales.html
