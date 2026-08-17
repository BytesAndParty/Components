# Weingut-Websites — Design-Analyse

Analyse der von Michael Hudritsch (LAGOTA) übermittelten Referenzliste, als Grundlage für die
Gestaltungsrichtung der neuen Premium-Weinwebsite.

**Erhoben am 16.08.2026.** Jede Seite wurde im Browser aufgerufen. Farben, Schriftgrößen,
Zeilenhöhen, Laufweiten, Abstände, Radien und Container-Breiten stammen aus den ausgelesenen
*computed styles* der jeweiligen Seite — nicht aus Schätzungen. Die Screenshots wurden bei
1485 × 812 px aufgenommen.

## Einstieg

Im Browser öffnen: **`index.html`**

Dort: Kurzfazit, Vergleichstabelle aller 13 Seiten, Gruppierung nach Modell
(Marke / Shop / Erlebnis), empfohlene Richtung, ein Vorschlag für die Design-Tokens
und ein fertiger Antworttext an Michi.

## Struktur

```
index.html              Übersicht, Vergleich, Empfehlung, Token-Vorschlag
sites/<slug>.html       Design-Analyse je Seite (gerenderte Paletten, Typo-Tabellen, Screenshots)
sites/<slug>.md         Dieselbe Analyse als Markdown zum Weiterverarbeiten
shots/                  Screenshots (JPEG)
_src/                   Datensatz und Generator-Skripte
```

## Die 13 Seiten

| Seite | Modell | Premium-Eignung |
|---|---|---|
| Mazzei (Toskana) | Marke premium | 5/5 |
| Genussgut Krispel | Marke / Genussgut | 5/5 |
| Weingut Polz | Marke + Shop | 4/5 |
| Sattlerhof | Marke / Gastgeber | 4/5 |
| Weinhof Scharl | Marke / Editorial | 4/5 |
| Colterenzio (Führung & Verkostung) | Erlebnis / Buchung | 4/5 |
| Domäne Wachau | Marke + Shop | 3/5 |
| Leo Aumann | Shop | 3/5 |
| Weingut Eder | Shop / Marke | 3/5 |
| Weingut Michael (Verkostung) | Erlebnis / Buchung | 3/5 |
| Weingut Pfeifer | Shop | 2/5 |
| Weingut Artner | Shop / klein | 2/5 |
| Weingut & Vinothek Dam | Shop | 2/5 |

Die Bewertung sagt, wie brauchbar ein Auftritt als Vorbild für ein Weingut im gehobenen
Segment ist — nicht, wie gut die Seite ihre eigene Aufgabe erfüllt.

## Ranking: gestalterische Qualität

Zweite, unabhängige Achse. Hier wird **nur die Gestaltung an sich** bewertet — ohne Bezug auf
unser Vorhaben, ohne Premium-Brille, ohne die Frage, ob sich etwas übernehmen lässt. Ein Auftritt
darf hier gut abschneiden, obwohl er als Referenz unbrauchbar ist, und umgekehrt.

Sechs Kriterien, je 0–5, Summe max. 30:

| Kriterium | Was zählt |
|---|---|
| **Idee** | Eigene gestalterische Haltung statt Theme-Default. Erkennt man die Seite ohne Logo? |
| **Typo** | Schriftwahl und -paarung, Skala, Satzdetail (Zeilenhöhe, Laufweite, Umbruch, Lesbarkeit). |
| **Farbe** | Disziplin und Rollenklarheit der Palette, nicht Geschmack. |
| **Raum** | Raster, Weißraum, vertikaler Rhythmus, Bildschnitt, Balance. |
| **Bild** | Qualität *und* Konsistenz von Fotografie und Illustration. |
| **Reife** | Trägt die Gestaltung über die ganze Seite? Bestraft selbstgemachten Lärm (Rosetten, Störer, Loyalty-Pills, Aktions-Popups) **und** unfertige Leerflächen bzw. sichtbare Baukastenbrüche. |

Cookie- und Consent-Layer fließen **nicht** ein — die sind Plugin, nicht Entwurf. Rabatt-Störer,
Treueprogramm-Badges und Aktionsmodale dagegen schon: das sind Gestaltungsentscheidungen.

| # | Seite | Idee | Typo | Farbe | Raum | Bild | Reife | Σ | Kern |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|
| 1 | Mazzei | 5 | 5 | 5 | 5 | 5 | 4 | **29** | Ein einziger Markenraum, konsequent durchgehalten. Utopia/Montserrat sauber getrennt, ein roter Akzent, kinematografische Bildstimmung ohne Bruch, eigene Kartenillustration. Abzug nur für Chat-Bubble und Club-Pill über dem Content. |
| 2 | Krispel | 5 | 5 | 4 | 5 | 4 | 4 | **27** | Der mutigste typografische Auftritt der Liste: kursive Serif als Kicker über großer Zeile, konsequente Kleinschreibung, Wortmarke als Hintergrundebene. Palette durch Orangerot neben Aprikose leicht verwässert, Einstiegskacheln ton-in-ton grenzwertig kontrastarm. |
| 3 | Weinhof Scharl | 5 | 4 | 4 | 4 | 5 | 5 | **27** | Reines Schwarzweiß, Magazinrhythmus aus schmaler Textspalte, versetztem Raster und ganzseitigen Serif-Zitaten. Null selbstgemachter Lärm. Gezeichnete Bildmarke und Flaschen-Reiter sind eigenständig. 14 px Fließtext und die leere rechte Hero-Hälfte kosten Punkte. |
| 4 | Sattlerhof | 4 | 3 | 5 | 5 | 5 | 4 | **26** | Der ruhigste Auftritt: Creme, genau ein Ziegelrot, mittige Wortmarke, handgezeichnete Stempel. Großzügige Bildsetzung, sehr saubere Footer-Architektur. Typo zieht runter — drei Schriftfamilien und 12 px Fließtext. |
| 5 | Weingut Polz | 4 | 4 | 4 | 4 | 4 | 2 | **22** | Sand/Tiefseeblau/Oliv ist eine erwachsene Palette, die aquarellierte Lagenpyramide echte Handarbeit. Die Reife bricht ein: Rabattleiste über dem Header, dauerhaftes Loyalty-Badge, Bodoni-Versalzeile ohne Scrim über dem Weingartenfoto. |
| 6 | Weingut Eder | 4 | 4 | 4 | 3 | 4 | 2 | **21** | Der Split-Hero (randloses Flaschenbild links, fette Kleinschreib-Serif rechts) ist stark, die illustrierte Etikettenserie ein echtes System. Das Produktraster zerlegt es wieder: Rahmen, Punkterosetten, Goldmedaille und Schnörkel-Trenner unter jedem Namen. |
| 7 | Domäne Wachau | 3 | 4 | 3 | 3 | 3 | 2 | **18** | Eine einzige Schriftfamilie über eine sehr große Seite durchzuhalten ist Disziplin, der schwarze Intro-Screen und das Rieden-Karussell (Jahrgang, Ried als Hochstellung) sind gut gesetzt. Danach WordPress-Sektionsfolge, Instagram-Kachelwand, und das fixe Logo scrollt über den Text. |
| 8 | Colterenzio | 2 | 3 | 2 | 4 | 3 | 4 | **18** | Fehlerfrei, aber ohne Gesicht: Weiß, Helvetica mit 6 px Laufweite, keine Markenfarbe. Das Kartenraster ist das sauberste der Liste, die feste Seitenleiste eine gute Idee — mehr Ordnung als Gestaltung. |
| 9 | Leo Aumann | 3 | 4 | 3 | 3 | 3 | 1 | **17** | Prata über Vollbild-Fassade und die dünn umrandete Kachel sind gute Entscheidungen. Streichpreise, „5+1 gratis“-Rosette und Aktions-Popup über dem Raster ziehen den Auftritt komplett in Richtung Prospekt. |
| 10 | Weingut Michael | 2 | 3 | 3 | 3 | 3 | 2 | **16** | Der Verkostungs-Hero ist als Einzelkomposition richtig gebaut: Gold-Kicker, Serif-Zeile mit Ortsbezug, ein Button, Abendlichtpanorama. Dahinter Wix-Standard, Gold als einziger Anker, Login-Avatar überlappt den Menüpunkt. |
| 11 | Vinothek Dam | 3 | 2 | 3 | 3 | 2 | 2 | **15** | Die Etikettenserie mit römischen Ziffern und der runde Stempel sind das beste Gestaltungsmaterial der Seite — nur passiert damit auf der Website nichts. Playfair plus Wix-Systemschriften, wenig eigenes Bildmaterial, handgeschriebener Störer im Header. |
| 12 | Weingut Pfeifer | 2 | 3 | 3 | 3 | 2 | 1 | **14** | Sandfläche und Abril Display wären eine Basis, aber alles darüber ist Verkaufssignal: Aktionsrosetten, Jahrgangsfahnen, Gratisversand-Störer, Blattornamente als Wasserzeichen, 10.500 px ohne Zwischennavigation. |
| 13 | Weingut Artner | 2 | 2 | 3 | 1 | 3 | 1 | **12** | Hellblaue Grundfläche und umgekehrte Schriftlogik sind ein Ansatz, das Schwarzweiß-Familienporträt trägt. Es bleibt aber ein Entwurf: ganze Bildschirmhöhen leere Fläche ohne Absicht, Serif-Fließtext auf 28 px, Shop als aufgeklebter Badge. |

**Gleichstände.** Krispel und Scharl liegen beide bei 27: Krispel gewinnt die typografische Ambition
und eine erfundene Farbwelt, Scharl die Disziplin und die Fehlerfreiheit — Schwarzweiß ist der
sicherere Weg zur Kohärenz, deshalb steht Krispel vorne. Domäne Wachau und Colterenzio liegen beide
bei 18: Wachau hat mehr Handwerk in den einzelnen Bausteinen, Colterenzio mehr Ordnung im Ganzen;
Ambition schlägt hier Makellosigkeit.

**Wo die beiden Bewertungen auseinandergehen.** Scharl (5. → 3.) und Eder (9. → 6.) steigen: beide
sind gestalterisch besser als ihr Nutzwert als Premium-Vorbild. Colterenzio (6. → 8.) und Polz
(3. → 5.) fallen: Colterenzios 4/5 kam aus der Buchungsmechanik, nicht aus der Gestaltung, und Polz
verliert genau das, was es als Shop-Referenz stark macht — die Verkaufslogik im Bild. Mazzei führt
auf beiden Achsen, Artner schließt auf beiden ab.

## Offener Pflichtbaustein: Altersabfrage

Wir brauchen auf der neuen Seite eine Altersfreigabe. In `index.html` gibt es dazu einen
eigenen Abschnitt. Kurzfassung: Nur Polz und Mazzei aus der Referenzliste haben überhaupt
eine — bei Polz stapelt sie sich mit Cookie-Banner und Treueprogramm-Popup, bei Mazzei
verzögert sie das Rendern. Beides sind Fehler, die wir vermeiden sollten.

Unser Ansatz: genau ein Overlay auf einmal (erst Alter, danach Cookies), als gestaltetes
Markenelement im dunklen Markenraum statt als neutraler Plugin-Kasten, schlicht Ja/Nein
statt Geburtsdatum-Formular, Entscheidung mehrere Monate gespeichert, „Nein" führt auf eine
freundliche Hinweisseite, technisch nicht render-blockierend und barrierefrei.

Die rechtliche Ausgestaltung (Altersgrenze, Formulierung, Protokollierung) ist mit Michi
und im Zweifel mit rechtlicher Beratung abzustimmen.

## Kernaussage

Die Liste mischt drei verschiedene Modelle. Vor der Entscheidung über Farben und Schriften
steht die Frage, ob die Seite zuerst eine Marke erzählt oder zuerst Flaschen verkauft.
Sieben der dreizehn Seiten begrüßen den Besucher mit einem Rabatt — genau dort hört ein
Auftritt auf, premium zu sein.

Empfohlene Richtung: Mazzei für Haltung und Bildsprache, Krispel für Struktur und
typografischen Mut, Sattlerhof für den österreichischen Gastgeber-Ton. Von den Shop-Seiten
ausschließlich die Mechanik übernehmen, nicht die Optik.

## Neu generieren

```bash
cd _src && python3 build.py && python3 build_index.py
```

---

Screenshots dienen der internen Gestaltungsdiskussion; die Rechte an den abgebildeten
Inhalten liegen bei den jeweiligen Betrieben.
