# -*- coding: utf-8 -*-
import os, html
from data import SITES
from build import CSS, dots, esc

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)),"..")

LEAD = {
 "marke":("Markenauftritte","Die Website erzählt zuerst Herkunft, Familie und Lage. Der Shop ist eingebettet, aber nicht das Zentrum. Das ist das Modell für ein Premium-Weingut."),
 "shop":("Shop-getriebene Auftritte","Im Kern Onlineshops mit Weingut-Anstrich. Funktional oft solide, gestalterisch austauschbar. Hier lohnt sich die Mechanik, nicht die Optik."),
 "erlebnis":("Erlebnis- und Buchungsseiten","Beantworten nur eine Frage: Wie verkauft man Führungen und Verkostungen? Als Bauplan für einen einzelnen Seitenbereich brauchbar."),
}

CATSHORT = {"marke":"Marke","shop":"Shop","erlebnis":"Erlebnis"}

rows = []
for s in sorted(SITES, key=lambda x: -x["score"]):
    lead = s["palette"][0][0]
    strip = "".join(f'<i style="background:{h}"></i>' for h, _ in s["palette"][:5])
    rows.append(f"""<tr>
<td><a href="sites/{s['slug']}.html" style="text-decoration:none"><b style="font-family:var(--serif);font-size:16px">{esc(s['name'])}</b></a><br><span style="font-size:12px;color:var(--fg3)">{esc(s['platform'])}</span></td>
<td><span class="tag {s['catKey']}">{esc(CATSHORT[s['catKey']])}</span></td>
<td style="font-size:13px;color:var(--fg2)">{esc(s['fonts'])}</td>
<td><span class="card"><span class="strip" style="width:110px;margin:0">{strip}</span></span></td>
<td>{dots(s['score'])}</td>
</tr>""")

cards = {}
for k in ("marke", "shop", "erlebnis"):
    inner = []
    for s in sorted([x for x in SITES if x["catKey"] == k], key=lambda x: -x["score"]):
        strip = "".join(f'<i style="background:{h}"></i>' for h, _ in s["palette"][:5])
        inner.append(f"""<a class="card" href="sites/{s['slug']}.html">
<span class="eyebrow">{dots(s['score'])}</span>
<div class="nm">{esc(s['name'])}</div>
<div class="cl">{esc(s['claim'])}</div>
<div class="strip">{strip}</div></a>""")
    cards[k] = f'<h2>{LEAD[k][0]}</h2><p class="lead" style="margin-bottom:22px">{esc(LEAD[k][1])}</p><div class="cards">' + "".join(inner) + "</div>"

TOKENS = """<b>/* Farbe */</b>
--ink            #0F1412   <b>Tiefdunkel mit Grünstich — zweiter Markenraum, Hero, Footer</b>
--ink-soft       #1A211E   <b>Abgesetzte dunkle Fläche</b>
--paper          #F2EEE6   <b>Kalk / Leinen — Grundfläche statt Weiß</b>
--paper-soft     #E7E1D5   <b>Zweite helle Fläche, Karten</b>
--stone          #8C8578   <b>Sekundärtext, Metadaten, Linien</b>
--accent         #9C6B3C   <b>Gedecktes Kupfer — NUR Linien, Kicker, Hover</b>
--line           #D6CFC1   <b>Trennlinien auf hell</b>
--line-dark      #2A322E   <b>Trennlinien auf dunkel</b>

<b>/* Schrift */</b>
--display   Canela · Reckless Neue · GT Sectra   <b>(frei: Newsreader, Source Serif 4)</b>
--ui        Söhne · Suisse Int'l · GT America    <b>(frei: Inter Tight, Instrument Sans)</b>

<b>/* Typo-Skala */</b>
display-xl   72 / 1.05  ls -0.02em   display   <b>Hero-Zeile</b>
h1           56 / 1.10  ls -0.015em  display
h2           40 / 1.15  ls -0.01em   display
h3           28 / 1.25  ls  0        display
kicker       12 / 1.00  ls  0.22em   ui  UPPERCASE
body-l       19 / 1.65  ls  0        ui        <b>Einleitungen</b>
body         17 / 1.70  ls  0        ui        <b>Fließtext — nie unter 16</b>
small        14 / 1.60  ls  0.01em   ui        <b>Datenblatt, Metadaten</b>

<b>/* Raum */</b>
--space-base     8px
--section-y      160px Desktop · 96px Tablet · 72px Mobil
--container      1240px
--measure        68ch   <b>max. Textbreite (ca. 720px)</b>

<b>/* Form */</b>
--radius         2px    <b>fast eckig — keine Pills, keine 60px-Radien</b>
--border         1px solid var(--line)
--shadow         none   <b>keine Schatten, Tiefe kommt aus Fläche und Raum</b>

<b>/* Buttons */</b>
primär     Fläche --ink, Text --paper, 16/32px, 13px ls 0.12em UPPERCASE, r2
sekundär   1px Linie --ink, transparent, gleiche Maße
tertiär    Textlink mit 1px Unterstrich, im Hover --accent

<b>/* Bewegung */</b>
reveal     opacity 0→1 + translateY 8px, 500ms, cubic-bezier(.16,1,.3,1)
hover      140ms — kein Parallax, kein Scroll-Jacking, kein Auto-Karussell"""

HTML = f"""<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Weingut-Websites — Design-Analyse &amp; Richtungsempfehlung</title><style>{CSS}
.cards .card .eyebrow{{display:block}}
td .card{{background:none;padding:0}}
table td:first-child{{width:25%}} table td:nth-child(2){{width:110px}} table td:nth-child(4){{width:130px}} table td:last-child{{width:120px}}
</style></head><body>
<header class="top"><div class="wrap">
<span class="eyebrow">Referenzanalyse · 13 Websites · 16.08.2026</span>
<h1>Weingut-Websites im Vergleich</h1>
<p class="lead">Analyse der von Michael Hudritsch (LAGOTA) übermittelten Referenzliste — als Grundlage für die Gestaltungsrichtung der neuen Premium-Weinwebsite. Jede Seite wurde im Browser aufgerufen; Farben, Schriftgrößen, Zeilenhöhen, Abstände und Radien stammen aus den ausgelesenen <em>computed styles</em>, nicht aus Schätzungen.</p>
</div></header>
<div class="wrap">

<section>
<h2>Das Wichtigste zuerst</h2>
<div class="callout"><p>Die Liste mischt drei völlig verschiedene Modelle. Bevor über Farben und Schriften entschieden wird, muss die Frage beantwortet sein: <b>Erzählt die Seite zuerst eine Marke, oder verkauft sie zuerst Flaschen?</b> Ein Shop, der wie ein Shop aussieht, zerstört das Preisgefühl schneller als jede falsche Schriftwahl.</p></div>
<p>Von dreizehn Seiten erreichen nur drei ein Niveau, das man im Premiumsegment als Vorbild nehmen kann: <b>Mazzei</b> (internationaler Maßstab), <b>Krispel</b> (gestalterisch stärkster österreichischer Auftritt) und <b>Sattlerhof</b> (Gastgeber-Modell mit Weingut, Restaurant und Hotel). <b>Polz</b> und <b>Scharl</b> folgen dicht dahinter. Die übrigen sind Shop-Systeme, deren Mechanik man studieren, deren Optik man aber nicht übernehmen sollte.</p>
<p>Sieben der dreizehn Seiten begrüßen den Besucher mit einem Rabatt — Newsletter minus zehn Prozent, fünf Prozent ab Erstbestellung, „5+1 gratis“. Genau das ist der Punkt, an dem ein Auftritt aufhört, premium zu sein.</p>
</section>

<div class="rule"></div>

<section><h2>Alle Seiten im Überblick</h2>
<table><thead><tr><th>Seite</th><th>Kategorie</th><th>Schriften</th><th>Palette</th><th>Premium&#8209;Eignung</th></tr></thead>
<tbody>{"".join(rows)}</tbody></table>
<p style="font-size:12px;color:var(--fg3);margin-top:14px">Premium-Eignung bewertet, wie brauchbar der Auftritt als Vorbild für ein Weingut im gehobenen Segment ist — nicht, wie gut die Seite ihre eigene Aufgabe erfüllt.</p>
</section>

<div class="rule"></div>

<section>{cards['marke']}</section>
<section>{cards['shop']}</section>
<section>{cards['erlebnis']}</section>

<div class="rule"></div>

<section>
<h2>Empfohlene Richtung</h2>
<p class="lead">Mazzei als Referenz für Haltung, Bildsprache und Farbraum. Krispel als Referenz für Struktur und typografischen Mut. Sattlerhof als Referenz für den österreichischen Gastgeber-Ton. Von den Shop-Seiten ausschließlich die Mechanik übernehmen.</p>

<h3>Konkret heißt das</h3>
<p><b>Zwei Markenräume statt einer Farbe.</b> Eine kalkweiße bis leinenfarbene Grundfläche für alles Erzählende und Verkaufende, ein tiefdunkler Raum mit Grünstich für Hero, Lagen und Footer. Mazzei macht das durchgehend dunkel, Krispel durchgehend warm — die Kombination aus beidem gibt Rhythmus, ohne bunt zu werden. Bordeauxrot mit Gold bleibt außen vor; das ist das sicherste Erkennungszeichen für „will teuer wirken“.</p>
<p><b>Eine Display-Serif und eine Grotesk, mehr nicht.</b> Alle fünf gut bewerteten Seiten arbeiten genau so: Polz mit Libre Bodoni und Montserrat, Mazzei mit Utopia und Montserrat, Scharl mit DM Serif Display und PT Sans. Die Serif trägt ausschließlich Headlines und Zitate, die Grotesk alles Funktionale.</p>
<p><b>Wenige, große, gleich belichtete Bilder.</b> Sattlerhof kommt auf der gesamten Startseite mit einer Handvoll Motiven aus, Mazzei hält über die ganze Seite dieselbe kühle Lichtstimmung. Bei Pfeifer und Eder liegen dagegen freigestellte Flaschen, Rosetten und Ornamente übereinander. Menschen, Hände und Details statt Drohnenpanorama.</p>
<p><b>Der Shop wird Teil der Marke, nicht ein angehängter Bereich.</b> Mazzei nennt ihn Wine Shop, Wine Club, Wine Tour, Wine Concierge — Kommerz als Zugehörigkeit. Die Produktseite gehört aufgebaut wie ein Datenblatt mit Erzählung: Ried und Jahrgang oben, Beschreibung, technische Werte, ruhig gesetzter Preis. Keine Streichpreise, keine Sterne, keine Rosetten.</p>
<p><b>Verkostungen bekommen einen eigenen Hauptnavigationspunkt.</b> Die Karte von Colterenzio ist der beste Bauplan der Liste: Bild, Titel, Beschreibung, Dauer mit Uhr-Icon, Preis pro Person, genau ein Button. Den Ton dazu liefert Weingut Michael: Kicker, Headline mit Ortsbezug, ein Satz der konkret sagt was enthalten ist, ein Button.</p>
</section>

<div class="rule"></div>

<section>
<h2>Pflichtbaustein: Altersabfrage</h2>
<div class="callout"><p><b>Wir brauchen auf unserer Seite ebenfalls eine Altersfreigabe.</b> Das ist keine gestalterische Option, sondern eine Voraussetzung — und muss deshalb von Anfang an als Bestandteil des Designs mitgeplant werden, nicht später als Plugin daraufgesetzt.</p></div>
<p>In der Referenzliste haben genau zwei Seiten eine echte Altersabfrage: <b>Polz</b> zeigt beim ersten Besuch ein Overlay mit „Bist du 18 Jahre oder älter“ und zwei Buttons, <b>Mazzei</b> arbeitet mit einem vorgeschalteten Age-Checker. Alle übrigen verzichten darauf. Sehenswert ist beides vor allem als Warnung: Bei Polz stapeln sich Altersabfrage, Cookie-Banner und Treueprogramm-Badge übereinander, sodass der Besucher drei Overlays wegklicken muss, bevor er den ersten Wein sieht. Bei Mazzei verzögert der Age-Checker das Rendern der Seite spürbar.</p>
<h3>Wie wir es lösen sollten</h3>
<p><b>Genau ein Overlay auf einmal, in klarer Reihenfolge.</b> Erst die Altersabfrage, danach — und erst nach der Entscheidung — der Cookie-Hinweis. Niemals beides gleichzeitig, und kein Newsletter- oder Rabatt-Layer im selben Ablauf.</p>
<p><b>Als gestaltetes Markenelement, nicht als Plugin-Dialog.</b> Der dunkle Markenraum als Fläche, die Wortmarke, eine einzige Frage, zwei gleichrangige Buttons im Stil der Seite (1 px Linie, 2 px Radius, gesperrte Versalien). Das ist für viele Besucher der allererste Eindruck der Marke — bei Polz ist es ein neutraler grauer Kasten, und genau diese Chance wird dort verschenkt.</p>
<p><b>Schlicht Ja/Nein statt Geburtsdatum-Formular.</b> Drei Dropdowns für Tag, Monat und Jahr sind eine Hürde ohne zusätzlichen Nutzen. Die Entscheidung lange speichern (Cookie oder localStorage, mehrere Monate), damit Stammkunden sie nicht bei jedem Besuch erneut treffen müssen.</p>
<p><b>„Nein“ darf keine Sackgasse sein.</b> Statt einer leeren Fehlerseite eine freundlich formulierte Hinweisseite — gerne mit Verweis auf die alkoholfreien Produkte, Führungen oder den Kontakt zum Betrieb.</p>
<p><b>Technisch nicht render-blockierend und barrierefrei.</b> Der Seiteninhalt bleibt im DOM, damit Suchmaschinen und Vorschaubilder in sozialen Netzwerken funktionieren. Fokus wird im Dialog gehalten, mit sichtbarem Fokusring; ESC oder ein Klick daneben dürfen nicht als Bestätigung gewertet werden. Auf dem Handy muss der Dialog ohne Scrollen bedienbar sein.</p>
<p style="font-size:13px;color:var(--fg3)">Die rechtliche Ausgestaltung — Altersgrenze, Formulierung, Protokollierung — gehört mit Michi und im Zweifel mit rechtlicher Beratung abgestimmt. Die Punkte hier beschreiben ausschließlich die gestalterische und technische Umsetzung.</p>
</section>

<div class="rule"></div>

<section><h2>Design-Tokens — Vorschlag</h2>
<p class="lead" style="margin-bottom:20px">Startwerte für die Umsetzung, abgeleitet aus den fünf am besten bewerteten Referenzen. Gedacht als Diskussionsgrundlage mit LAGOTA, nicht als fertiges System.</p>
<div class="tok">{TOKENS}</div>
</section>

<div class="rule"></div>

<section class="cols">
<div><h3>Was wir übernehmen</h3><ul class="take">
<li>Zwei Markenräume: Kalk/Leinen hell, Tiefdunkel mit Grünstich</li>
<li>Genau eine Display-Serif und eine Grotesk</li>
<li>Sandfarbene oder cremefarbene Grundfläche statt reinem Weiß (Polz, Sattlerhof, Krispel)</li>
<li>Navigation nach Bereichen statt nach Produktkategorien (Krispel)</li>
<li>Eigene Illustration für Lagen und Rieden statt Foto oder Tabelle (Polz, Mazzei)</li>
<li>Erlebniskarte mit Bild, Dauer, Preis pro Person und einem Button (Colterenzio)</li>
<li>Kicker plus Headline mit Ortsbezug plus konkreter Inhaltssatz (Weingut Michael)</li>
<li>Ganzseitige Serif-Zitate als Rhythmuswechsel (Scharl)</li>
<li>Auszeichnungen als ruhige Monochrom-Reihe im Footer (Sattlerhof)</li>
<li>Mengen-Stepper direkt in der Produktkachel für 6er- und 12er-Gebinde (Pfeifer, Aumann)</li>
<li>Öffnungszeiten und Telefon dauerhaft erreichbar (Pfeifer, Scharl)</li>
<li><b>Altersabfrage als gestaltetes Markenelement</b> — genau ein Overlay, Ja/Nein, Entscheidung lange gespeichert (Pflichtbaustein, siehe eigener Abschnitt)</li>
</ul></div>
<div><h3>Was auf keinen Fall</h3><ul class="avoid">
<li>Newsletter-Popup mit Rabatt vor dem ersten Scroll (Wachau, Dam)</li>
<li>Streichpreise, „gratis“-Rosetten, Prozent-Störer (Aumann, Pfeifer)</li>
<li>Bordeauxrot mit Gold als Markenfarben</li>
<li>Trauben-, Blatt- und Weinglas-Ornamente als Hintergrund (Pfeifer)</li>
<li>Punkterosetten und Medaillen auf der Produktkachel (Eder)</li>
<li>Instagram-Kachelwand vor dem Footer (Wachau)</li>
<li>Ladeanimation oder Consent-Wall, die den Einstieg blockiert (Wachau, Sattlerhof)</li>
<li>Drei gestapelte Overlays: Alter, Cookies, Treueprogramm (Polz) — die Altersabfrage brauchen wir, aber allein und zuerst</li>
<li>Altersabfrage als neutraler Plugin-Kasten oder mit Geburtsdatum-Formular</li>
<li>Fließtext unter 16 px (Sattlerhof 12 px, Scharl 14 px)</li>
<li>Vollrunde Pill-Buttons mit 60–800 px Radius (Polz, Eder)</li>
<li>Sichtbare Baukasten-Struktur (Dam, Michael)</li>
<li>Scroll-Jacking und Auto-Karussells</li>
</ul></div>
</section>

<div class="rule"></div>

<section><h2>Antwortvorschlag an Michi</h2>
<div class="callout"><p style="font-family:var(--serif);font-size:16px;line-height:1.7">Hallo Michi,<br><br>
danke für die Liste — wir haben alle Seiten durchgesehen. Kurz unsere Richtung:<br><br>
<b>Gefällt uns:</b> Mazzei ist für uns der Maßstab — dunkler Markenraum, eine Display-Serif für alle Headlines, kinematografische Bildsprache, und der Shop ist sprachlich Teil der Marke (Wine Club, Wine Tour) statt ein angehängter Bereich. Aus Österreich überzeugt uns Krispel am meisten: Navigation nach Bereichen statt nach Produktkategorien, kursive Serif über großer Grotesk, konsequent eigene Bildwelt. Sattlerhof zeigt gut, wie man Weingut, Kulinarik und Gastlichkeit gleichwertig behandelt. Bei Polz gefällt uns die illustrierte Lagenpyramide und die sandfarbene Grundfläche, bei Scharl die editoriale Struktur mit den ganzseitigen Zitaten.<br><br>
<b>Kommt für uns nicht in Frage:</b> alles Rabattgetriebene — Newsletter-Popups mit Prozenten, Streichpreise, „gratis“-Rosetten, Aktionsstörer. Ebenso Bordeauxrot mit Gold, Trauben- und Blattornamente, Punkterosetten auf den Produktkacheln, Instagram-Kachelwände vor dem Footer und alles, was sichtbar nach Baukasten aussieht. Auch Ladeanimationen oder Cookie-Wände, die den Einstieg blockieren, möchten wir vermeiden.<br><br>
<b>Bitte gleich mitplanen:</b> Wir brauchen auf unserer Seite eine Altersabfrage. Uns ist wichtig, dass sie gestaltet ist und nicht als neutraler Plugin-Kasten daherkommt — eine Frage, zwei Buttons im Stil der Seite, Entscheidung länger gespeichert. Und sie soll allein und zuerst kommen: erst Alter, danach der Cookie-Hinweis, nicht beides gleichzeitig wie bei Polz.<br><br>
<b>Für Führungen und Verkostungen</b> ist Colterenzio strukturell die beste Vorlage (Karte mit Bild, Dauer, Preis pro Person, ein Button) — allerdings in wärmerer Anmutung. Den Tonfall dafür finden wir bei Weingut Michael gut getroffen.<br><br>
Eine erste Tokenliste mit Farbraum, Schriftpaarung und Skala haben wir schon zusammengestellt und schicken sie dir gerne als Diskussionsgrundlage.<br><br>
Liebe Grüße</p></div>
</section>

<footer>13 Seiten analysiert am 16.08.2026. Alle Farb-, Schrift- und Abstandswerte wurden im Browser aus den computed styles der jeweiligen Seite ausgelesen. Screenshots dienen der internen Gestaltungsdiskussion; Rechte an den abgebildeten Inhalten liegen bei den jeweiligen Betrieben.</footer>
</div></body></html>"""

open(os.path.join(OUT, "index.html"), "w").write(HTML)
print("index written")
