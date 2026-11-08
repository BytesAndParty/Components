# Bekannte Probleme

Stand: 2026-11-08. Die Punkte 3–8 bestanden schon vor den Dependency-Updates vom 25.–27.10., die Punkte 10–11 stammen aus dem Browser-Test des Etiketten-Designers vom 25.–27.10. (behobene Fehler: `components/cellar-canvas/STATUS.md` #30). Alle sind bewusst noch nicht behoben. Erledigtes hier löschen, nicht abhaken; die Geschichte steht im git log. Die Nummern bleiben nach dem Löschen stabil, Buchart58 verweist auf diese Datei.

| # | Problem | Wo | Schwere | Aufwand |
|---|---|---|---|---|
| 3 | Falsche Herkunft „Wachau · seit 1958“ in weiteren Showcase-Sections | `section-showcase` | niedrig | Entscheidung offen |
| 4 | Vendure-Showcase-Server ohne Scheduler (braucht getrennten Worker) | `vendure-showcase/server` | mittel | ca. 2 h, Schätzung |
| 5 | Login-CSRF möglich (`csrfPrevention` aus) | beide Vendure-Server | mittel | 1 h |
| 6 | `pg`-Deprecation-Warnung im Worker | Buchart58-Server | niedrig | offen |
| 7 | fallow: 10 Befunde (Exports, Typen, eine Dev-Dependency) | Repo-weit | niedrig | Entscheidung offen |
| 8 | VPS-Stacks starten nach Reboot nicht von selbst | VPS (beide Stacks) | hoch | 1 h |
| 10 | Etiketten-Designer: Panel-Tabs und Vorlage „Classic“ brechen das Layout | `components/cellar-canvas/` | mittel | Entscheidung offen |
| 11 | Etiketten-Designer: kleinere Auffälligkeiten aus dem Browser-Test | `components/cellar-canvas/` u. a. | niedrig | je 0,5 h |

---

## 3. Falsche Herkunftsangaben in weiteren Showcase-Sections

**Symptom.** `nav/NavV3.tsx`, `hero/HeroNachtblau.tsx` und `hero/HeroGastgeber.tsx` sind korrigiert („Sooss · Thermenregion", „Hauptstraße 58"). In `HeroNachtblau` und `HeroGastgeber` sind nur die Orts- und Jahreszeilen korrigiert: Rieden (`REGISTER` mit Ried Kreutles, Loibenberg, Steinriegl), Fließtext und Bildtexte reden weiter von der Donau und der Wachau (`HeroNachtblau.tsx:45,57,73,97`, `HeroGastgeber.tsx:151`) und widersprechen damit der neuen Ortszeile. An rund 25 weiteren Stellen unter `section-showcase/src/sections/` stehen noch „Wachau", „Dürnstein", „Unterloiben" oder „seit 1958"/„Anno 1958": `footer/FooterV2` bis `FooterV5`, `footer/FooterCinematic`, `hero/HeroV1`, `HeroV4`, `HeroV6` bis `HeroV8`, `nav/NavV6`, `features/FeaturesV7`, `FeaturesGenussgut` und `FeaturesNachtblau`. Vollständig: `grep -rn "Wachau\|1958" section-showcase/src`.

**Ursache.** Platzhaltertexte aus der frühen Design-Phase, vermutlich für ein fiktives Weingut. Fakten laut buchart58.at: Weingut in **Sooss, Thermenregion** (nicht Wachau); „58" ist die **Hausnummer** (Hauptstraße 58), kein Gründungsjahr – das Gründungsjahr ist online nirgends belegt und muss von der Familie kommen.

**Lösung.** Entscheidung offen: als bewusste Platzhalter lassen oder wie die drei korrigierten Dateien auf die echten Fakten bringen („Sooss · Thermenregion", „Hauptstraße 58", „seit 1958" streichen). In `FeaturesNachtblau` hängen ganze Texte an den Wachau-Lagen, das wäre ein Inhaltsumbau und keine Textersetzung. In Buchart58 sind die Wachauer Riede/Stufe in den Demodaten bereits ersetzt (Commit „Demodaten mit echter Riede…").

## 4. Vendure-Showcase-Server ohne Scheduler

**Symptom.** Beim Start: `No scheduler strategy is configured! Scheduled tasks will not be executed.` – Server und Worker.

**Ursache.** `vendure-showcase/server/src/vendure-config.ts` registriert `DefaultSchedulerPlugin` nicht (Buchart58 tut es, `server/src/vendure-config.ts:84`).

**Auswirkung.** Vendures geplante Aufgaben laufen nicht, u. a. das Aufräumen abgelaufener Sessions und alter Job-Datensätze. Die Tabellen wachsen unbegrenzt; abgelaufene Session-Tokens bleiben in der DB liegen (relevant im Zusammenhang mit den Vendure-Advisories zu Tokens in Job-Daten, siehe `live-docs-collection/vendure/vendure-3.8-changes.md`).

**Lösung.** Das Plugin allein reicht nicht: `DefaultSchedulerPlugin.init()` in die Plugin-Liste aufzunehmen lässt den Start abstürzen (getestet am 2026-11-08 mit Vendure 3.8.1). `src/index.ts` bootstrappt Server und Worker im selben Prozess, Vendures `SchedulerService` legt pro Bootstrap benannte Cron-Jobs an, und `croner` führt diese Namen prozessweit: `Tried to initialize new named job 'clean-sessions', but name already taken`. Auf dem VPS läuft `CMD ["node", "dist/index.js"]`, der Container würde also nach dem Start abstürzen.

Voraussetzung ist die Trennung wie in Buchart58: `index.ts` nur Server, `index-worker.ts` mit `bootstrapWorker`, Scripts `dev:worker` und `start:worker`, ein zweiter Container in `compose.prod.yaml`. Das ist ein Umbau auf dem VPS und kein Ein-Zeiler. Erst danach `DefaultSchedulerPlugin.init()` ergänzen. `synchronize: true` legt die Tabelle des Plugins (`ScheduledTaskRecord`) selbst an. Vor einem Test die lokale `data/vendure.sqlite` sichern. Danach beim Start keine Scheduler-Warnung mehr.

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

Das fallow-Gate bleibt rot (Exit 1, 9 Befunde auf Error-Stufe), solange die Exports und Typen nicht entschieden sind. Die CI führt fallow nicht aus. Die beiden Hinweise „boundaries/rule packs not configured" sind reine Advisories.

## 8. VPS-Stacks starten nach einem Reboot nicht von selbst

**Symptom.** Nach dem VPS-Reboot am 18.10. standen alle Container auf „Created", Showcase und Buchart58-Staging waren eine Woche lang down (Shop-API 502). Zusätzlich waren die Showcase-Container am 27.10. ganz verschwunden (Ursache ungeklärt, kein neuer Reboot).

**Ursache.** Rootless Podman hat keinen Daemon; `restart: unless-stopped` greift nach einem Reboot nicht, solange keine systemd-User-Unit die Stacks startet. Bekannte Grenze, steht in `vendure-showcase/server/README.md` und in Buchart58 `vault/Learnings/podman/podman-auf-dem-vps.md`.

**Auswirkung.** Ausfall bis jemand manuell startet; Netlify-Builds von `artilier-ui` scheitern in der Zeit, weil die Storefront die Weine beim Build vom VPS holt.

**Lösung.** Pro Stack eine systemd-User-Unit (Quadlet oder `podman generate systemd`) plus `loginctl enable-linger deploy`, danach einen Test-Reboot. Muss auf dem VPS eingerichtet werden.

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
