# -*- coding: utf-8 -*-
import os, html, json
from data import SITES

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)),"..")
os.makedirs(os.path.join(OUT, "sites"), exist_ok=True)

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#12110f; --bg2:#191714; --line:#2e2a25; --line2:#403a33;
  --fg:#eae4da; --fg2:#a29a8e; --fg3:#6f675c;
  --acc:#c9a227; --ok:#7d9174; --bad:#b4553f;
  --mono:ui-monospace,"SF Mono",Menlo,monospace;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
  --serif:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:15px;line-height:1.65;-webkit-font-smoothing:antialiased}
.wrap{max-width:1080px;margin:0 auto;padding:0 32px}
a{color:inherit}
header.top{border-bottom:1px solid var(--line);padding:56px 0 40px;margin-bottom:48px}
.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--fg3)}
h1{font-family:var(--serif);font-size:44px;line-height:1.12;font-weight:400;margin:14px 0 10px;letter-spacing:-.01em}
h2{font-family:var(--serif);font-size:26px;font-weight:400;margin:0 0 18px;letter-spacing:-.005em}
h3{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--fg3);margin:0 0 14px;font-weight:500}
p{margin:0 0 14px;color:var(--fg)}
p.lead{font-size:17px;line-height:1.6;color:var(--fg2)}
section{margin:0 0 52px}
.rule{height:1px;background:var(--line);margin:52px 0}
.meta{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0 0}
.tag{font-family:var(--mono);font-size:11px;letter-spacing:.06em;padding:5px 10px;border:1px solid var(--line2);border-radius:2px;color:var(--fg2);white-space:nowrap;display:inline-block}
.tag.marke{border-color:#4a5f45;color:#a8c39f}
.tag.shop{border-color:#5b4a3a;color:#d0ab86}
.tag.erlebnis{border-color:#3f4f5e;color:#9dbcd4}
.score{font-family:var(--mono);font-size:13px;letter-spacing:.22em;color:var(--acc)}
.score .off{color:var(--line2)}
.sw{display:flex;flex-wrap:wrap;gap:0;border:1px solid var(--line);border-radius:3px;overflow:hidden}
.sw div{flex:1 1 96px;min-width:96px}
.sw .chip{height:72px;display:block}
.sw .lbl{padding:8px 10px 10px;background:var(--bg2);border-top:1px solid var(--line)}
.sw code{font-family:var(--mono);font-size:11px;color:var(--fg);display:block;text-transform:uppercase}
.sw span{font-size:11px;color:var(--fg3);display:block;margin-top:2px;line-height:1.35}
table{width:100%;border-collapse:collapse;font-size:14px}
th,td{text-align:left;padding:11px 12px;border-bottom:1px solid var(--line);vertical-align:top}
th{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3);font-weight:500}
td.k{color:var(--fg2);white-space:nowrap;width:190px}
td .spec{font-family:var(--mono);font-size:12px;color:var(--fg)}
td .smp{color:var(--fg3);font-size:13px}
ul{list-style:none;margin:0}
li{padding:9px 0 9px 24px;border-bottom:1px solid var(--line);position:relative;color:var(--fg2)}
li:last-child{border-bottom:0}
li:before{position:absolute;left:0;top:9px;font-family:var(--mono);font-size:12px}
ul.take li:before{content:"+";color:var(--ok)}
ul.avoid li:before{content:"\\2212";color:var(--bad)}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:36px}
figure{margin:0 0 26px}
figure img{width:100%;display:block;border:1px solid var(--line);border-radius:3px}
figcaption{font-size:12px;color:var(--fg3);margin-top:8px;line-height:1.5}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:3px;overflow:hidden}
.card{background:var(--bg2);padding:22px;text-decoration:none;display:block;transition:background .15s}
.card:hover{background:#211e1a}
.card .nm{font-family:var(--serif);font-size:20px;margin:8px 0 4px}
.card .cl{font-size:13px;color:var(--fg2);line-height:1.5;margin:8px 0 14px}
.card .strip{display:flex;height:20px;border-radius:2px;overflow:hidden;margin-top:12px}
.card .strip i{flex:1}
nav.back{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3);padding:24px 0;display:block;text-decoration:none}
nav.back:hover{color:var(--fg)}
footer{border-top:1px solid var(--line);margin-top:64px;padding:28px 0 60px;font-size:12px;color:var(--fg3)}
.callout{border-left:2px solid var(--acc);padding:2px 0 2px 20px;margin:0 0 20px}
.callout p{color:var(--fg2)}
.tok{font-family:var(--mono);font-size:12.5px;background:var(--bg2);border:1px solid var(--line);border-radius:3px;padding:20px 22px;overflow-x:auto;line-height:1.8;color:var(--fg2);white-space:pre}
.tok b{color:var(--fg);font-weight:400}
@media(max-width:760px){.cols{grid-template-columns:1fr;gap:24px}h1{font-size:32px}.wrap{padding:0 20px}}
"""

def esc(s): return html.escape(str(s))

def dots(n, m=5):
    return '<span class="score">' + '●'*n + '<span class="off">' + '●'*(m-n) + '</span></span>'

def swatches(pal):
    out = ['<div class="sw">']
    for hexv, role in pal:
        out.append(f'<div><span class="chip" style="background:{hexv}"></span><span class="lbl"><code>{esc(hexv)}</code><span>{esc(role)}</span></span></div>')
    out.append('</div>')
    return "".join(out)

def page(site):
    s = site
    shots = "".join(
        f'<figure><img src="../shots/{f}" alt="{esc(c)}"><figcaption>{esc(c)}</figcaption></figure>'
        for f, c in s["shots"])
    typerows = "".join(
        f'<tr><td class="k">{esc(r)}</td><td><span class="spec">{esc(sp)}</span><br><span class="smp">{esc(sm)}</span></td></tr>'
        for r, sp, sm in s["type"])
    take = "".join(f"<li>{esc(t)}</li>" for t in s["take"])
    avoid = "".join(f"<li>{esc(t)}</li>" for t in s["avoid"])
    return f"""<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(s['name'])} — Design-Analyse</title><style>{CSS}</style></head><body>
<div class="wrap"><a class="back" href="../index.html">&larr; Übersicht</a></div>
<header class="top"><div class="wrap">
<span class="eyebrow">Design-Analyse · Referenz {esc(s['cat'])}</span>
<h1>{esc(s['name'])}</h1>
<p class="lead">{esc(s['claim'])}</p>
<div class="meta"><span class="tag {s['catKey']}">{esc(s['cat'])}</span><span class="tag">{esc(s['platform'])}</span><span class="tag">Premium-Eignung {dots(s['score'])}</span></div>
<div class="meta"><a class="tag" href="{esc(s['url'])}" target="_blank" rel="noopener">{esc(s['url'])}</a></div>
</div></header>
<div class="wrap">

<section><h3>Einschätzung</h3><p>{esc(s['verdict'])}</p></section>

<section><h3>Farbpalette</h3>{swatches(s['palette'])}</section>

<section><h3>Typografie</h3>
<p class="lead" style="margin-bottom:16px">{esc(s['fonts'])}</p>
<table><thead><tr><th>Rolle</th><th>Spezifikation &amp; Beispiel</th></tr></thead><tbody>{typerows}</tbody></table></section>

<section class="cols">
<div><h3>Layout &amp; Raster</h3><p>{esc(s['layout'])}</p></div>
<div><h3>Bildsprache</h3><p>{esc(s['imagery'])}</p></div>
</section>

<section class="cols">
<div><h3>Shop / Buchung</h3><p>{esc(s['commerce'])}</p></div>
<div><h3>Bewegung</h3><p>{esc(s['motion'])}</p></div>
</section>

<div class="rule"></div>

<section class="cols">
<div><h3>Übernehmen</h3><ul class="take">{take}</ul></div>
<div><h3>Vermeiden</h3><ul class="avoid">{avoid}</ul></div>
</section>

<div class="rule"></div>

<section><h3>Screenshots</h3>{shots}</section>

<footer>Erhoben am 16.08.2026 über Chrome — Farben, Schriftgrößen, Abstände und Radien wurden aus den <em>computed styles</em> der Seite ausgelesen, nicht geschätzt.</footer>
</div></body></html>"""

def md(site):
    s = site
    L = []
    L.append(f"# {s['name']}\n")
    L.append(f"**{s['claim']}**\n")
    L.append(f"- URL: {s['url']}")
    L.append(f"- Kategorie: {s['cat']}")
    L.append(f"- Plattform: {s['platform']}")
    L.append(f"- Premium-Eignung: {s['score']}/5\n")
    L.append("## Einschätzung\n")
    L.append(s['verdict'] + "\n")
    L.append("## Farbpalette\n")
    L.append("| Hex | Rolle |")
    L.append("|---|---|")
    for h_, r in s['palette']:
        L.append(f"| `{h_}` | {r} |")
    L.append("")
    L.append("## Typografie\n")
    L.append(f"Schriften: {s['fonts']}\n")
    L.append("| Rolle | Spezifikation | Beispiel |")
    L.append("|---|---|---|")
    for r, sp, sm in s['type']:
        L.append(f"| {r} | `{sp}` | {sm} |")
    L.append("")
    L.append("## Layout & Raster\n")
    L.append(s['layout'] + "\n")
    L.append("## Bildsprache\n")
    L.append(s['imagery'] + "\n")
    L.append("## Shop / Buchung\n")
    L.append(s['commerce'] + "\n")
    L.append("## Bewegung\n")
    L.append(s['motion'] + "\n")
    L.append("## Übernehmen\n")
    for t in s['take']:
        L.append(f"- {t}")
    L.append("")
    L.append("## Vermeiden\n")
    for t in s['avoid']:
        L.append(f"- {t}")
    L.append("")
    L.append("## Screenshots\n")
    for f, c in s['shots']:
        L.append(f"![{c}](../shots/{f})\n\n*{c}*\n")
    return "\n".join(L)

for s in SITES:
    open(os.path.join(OUT, "sites", s["slug"] + ".html"), "w").write(page(s))
    open(os.path.join(OUT, "sites", s["slug"] + ".md"), "w").write(md(s))

print("sites written:", len(SITES))
