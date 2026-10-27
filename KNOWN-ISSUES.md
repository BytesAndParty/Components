# Bekannte Probleme

Stand: 2026-10-27. Alle Punkte bestanden schon vor den Dependency-Updates vom 25.–27.10. und sind bewusst noch nicht behoben. Erledigtes hier löschen, nicht abhaken; die Geschichte steht im git log.

| # | Problem | Wo | Schwere | Aufwand |
|---|---|---|---|---|
| 1 | Hydration-Mismatch durch `localStorage` im ersten Render | `components/atelier/provider.tsx` (+ Kopie in Buchart58) | mittel | 1–2 h |
| 2 | Mobile-Suite: 18 Fehlschläge (Schrift < 9 px, Tap-Ziel < 44 px) | `section-showcase` | niedrig | 1 h |
| 3 | Falsche Herkunft „Wachau · seit 1958" in Showcase-Sections | `section-showcase` | niedrig | 0,5 h |
| 4 | Vendure-Showcase-Server ohne Scheduler | `vendure-showcase/server` | mittel | 0,5 h |
| 5 | Login-CSRF möglich (`csrfPrevention` aus) | beide Vendure-Server | mittel | 1 h |
| 6 | `pg`-Deprecation-Warnung im Worker | Buchart58-Server | niedrig | offen |
| 7 | fallow: 12 Befunde, davon 3 Fehlalarme | Repo-weit | niedrig | 0,5 h |
| 8 | VPS-Stacks starten nach Reboot nicht von selbst | VPS (beide Stacks) | hoch | 1 h |

---

## 1. Hydration-Mismatch im `AtelierProvider`

**Symptom.** Beim Laden der Storefront meldet React dreimal einen Hydration-Mismatch, sichtbar in der Konsole und im WebServer-Log der Vendure-E2E-Suite. Betroffen ist `aria-selected` in `vendure-showcase/storefront/src/components/react/AccentPicker.tsx`: Der Server rendert den Standard-Akzent als ausgewählt, der Client den gespeicherten. Die Tests bestehen trotzdem; visuell fällt es nicht auf, weil `AtelierInitScript` die DOM-Attribute (`data-theme`, `data-accent`) schon vor dem ersten Paint setzt.

**Ursache.** `components/atelier/provider.tsx`, Zeilen 66–74: Theme, Akzent und Locale werden im Lazy-Initializer von `useState` aus `localStorage` gelesen (`readStorage(...)`). Auf dem Server gibt es kein `localStorage` → Fallback auf `defaultTheme`/`defaultAccent`/`defaultLocale`. Im ersten Client-Render (= Hydration) liest der Initializer aber den gespeicherten Wert. Server- und Client-Markup weichen ab, sobald der Nutzer etwas anderes als den Default gespeichert hat.

**Reproduktion.** Storefront öffnen, Akzent ändern (wird in `localStorage` gespeichert), Seite neu laden → Konsole zeigt den Mismatch. Automatisiert: `bun run test:e2e:vendure` (der Test setzt `atelier-accent` per `addInitScript` und provoziert genau das).

**Auswirkung.** React verwirft bei einem Mismatch den Server-Teilbaum und rendert ihn neu: unnötige Arbeit, im Worst Case kurzes Flackern in Komponenten, die vom Akzent/Theme abhängen. Fehler in der Konsole verdecken echte Probleme.

**Lösung (Vorschlag).** Den gespeicherten Wert nicht im Initializer lesen, sondern über `useSyncExternalStore` mit `getServerSnapshot`, der die Defaults liefert. React rendert dann bei der Hydration bewusst den Server-Wert und schaltet direkt danach ohne Mismatch auf den gespeicherten um. Alternative mit weniger Umbau: Initializer auf die Defaults setzen und den gespeicherten Wert in einem `useEffect` nach dem Mount übernehmen (kostet einen zusätzlichen Render, die DOM-Attribute stimmen dank Init-Script trotzdem sofort). Kein `suppressHydrationWarning` – das versteckt nur das Symptom.

**Mit beheben.** Buchart58 hat dieselbe Stelle in seiner Kopie: `Buchart58/storefront/src/atelier/atelier/provider.tsx` (Zeile 70). Nach dem Fix hier dort nachziehen (Buchart58 kopiert Komponenten, Änderungen kommen nicht von selbst an).

**Prüfen.** `bun run test:e2e:vendure` ohne Hydration-Meldungen im `[WebServer]`-Log; Storefront mit geändertem Akzent neu laden, Konsole sauber.

## 2. Mobile-Suite: 18 Fehlschläge

**Symptom.** `bun run test:mobile` (`e2e/mobile/touch-targets.test.ts`) scheitert mit 18 von 216 Tests – auf allen 6 Geräteprofilen dieselben drei Prüfungen:

| Route | Prüfung | Befund |
|---|---|---|
| `/footer` | CTAs ≥ 44 px (`MIN_TAP`) | Link „Impressum" ist 36 px hoch |
| `/footer` | Text ≥ 9 px (`MIN_FONT`) | 8 px „Weingut" |
| `/hero` | Text ≥ 9 px | 8 px „Wachau · Österreich" |

**Ursache.** Einzelne Labels nutzen `text-[8px]` (Fundstellen u. a. `section-showcase/src/sections/buchart-kit.tsx`, `hero/HeroGastgeber.tsx`, `etiketten/EtikettenBuchArt.tsx`), und der „Impressum"-Link in einer Footer-Variante hat kein `min-h-11` (anders als z. B. `footer/FooterCinematic.tsx:100`, der es richtig macht; Kandidaten: `footer/FooterBuchArt.tsx`, `footer/FooterV4.tsx`). Welche Variante `/footer` rendert, steht in der Route bzw. im Composition-State des Section-Showcase.

**Auswirkung.** Lesbarkeit und Bedienbarkeit auf dem Handy (COMPONENT-GUIDELINES §7: Touch-Ziele mind. 44 × 44 px). Die Suite läuft nicht in der CI, deshalb fällt es dort nicht auf.

**Lösung.** 8-px-Labels auf mindestens 9 px heben (die Test-Untergrenze ist laut Kommentar im Test die Marken-Untergrenze für Eyebrow-Labels), dem „Impressum"-Link `inline-flex min-h-11 items-center` geben wie in `FooterCinematic`. Danach `bun run test:mobile` → 0 Fehlschläge.

## 3. Falsche Herkunftsangaben in Showcase-Sections

**Symptom.** Mehrere Sections zeigen „Wachau · Österreich" bzw. „Wachau · Österreich — Weingut seit 1958": `section-showcase/src/sections/nav/NavV3.tsx:34`, `hero/HeroNachtblau.tsx:81`, `hero/HeroGastgeber.tsx:77`.

**Ursache.** Platzhaltertexte aus der frühen Design-Phase. Fakten laut buchart58.at: Weingut in **Sooss, Thermenregion** (nicht Wachau); „58" ist die **Hausnummer** (Hauptstraße 58), kein Gründungsjahr – das Gründungsjahr ist online nirgends belegt und muss von der Familie kommen.

**Lösung.** „Sooss · Thermenregion" o. Ä.; „seit 1958" streichen, bis das echte Jahr bekannt ist. In Buchart58 sind die Wachauer Riede/Stufe in den Demodaten bereits ersetzt (Commit „Demodaten mit echter Riede…"); dieselben Fakten hier übernehmen.

## 4. Vendure-Showcase-Server ohne Scheduler

**Symptom.** Beim Start: `No scheduler strategy is configured! Scheduled tasks will not be executed.` – Server und Worker.

**Ursache.** `vendure-showcase/server/src/vendure-config.ts` registriert `DefaultSchedulerPlugin` nicht (Buchart58 tut es, `server/src/vendure-config.ts:84`).

**Auswirkung.** Vendures geplante Aufgaben laufen nicht, u. a. das Aufräumen abgelaufener Sessions und alter Job-Datensätze. Die Tabellen wachsen unbegrenzt; abgelaufene Session-Tokens bleiben in der DB liegen (relevant im Zusammenhang mit den Vendure-Advisories zu Tokens in Job-Daten, siehe `live-docs-collection/vendure/vendure-3.8-changes.md`).

**Lösung.** `DefaultSchedulerPlugin.init()` in die Plugin-Liste aufnehmen, wie in Buchart58. Danach beim Start keine Scheduler-Warnung mehr.

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

## 7. fallow: 12 Befunde

`bunx fallow dead-code` meldet:

- **7 ungenutzte Exports** in `section-showcase/src/sections/lineage/lineage-graph.ts` (`incomingOf`, `ancestorsOf`, `descendantsOf`, `pathCount`, `depthOf`) und `lineage-layout.ts` (`DEFAULT_LAYOUT`, `egoIds`). Entweder Graph-API, die bewusst vorgehalten wird (dann per `// fallow-ignore-next-line unused-export` mit Begründung markieren), oder entfernen.
- **2 ungenutzte Typ-Exports:** `HandAction` (`components/highlighter/hand-mark.tsx:10`), `MarkerCalloutColor` (`components/marker-callout/marker-callout.tsx:8`). Laut Triage-Regel (Skill `components-verify`) meist gewollte Deep-Import-API – bewusst lassen oder markieren.
- **Fehlalarme:** `better-sqlite3` und `pg` im Server gelten als ungenutzt, TypeORM lädt die Treiber aber dynamisch. In `.fallowrc.jsonc` unter `ignoreDependencies` aufnehmen. `tailwindcss` im Root wird als ungenutzt gemeldet, weil es nur in den Workspaces importiert wird – prüfen, ob es im Root überhaupt gebraucht wird (ESLint/Tailwind-Tooling), sonst aus den Root-devDependencies entfernen.
- **Config-Hinweise:** Das Entry-Pattern für `vendure-showcase/server/src/index.ts` ist überflüssig; mehrere `ignoreDependencies`-Einträge (`@vendure/*`) verdecken nichts mehr – aufräumen.

## 8. VPS-Stacks starten nach einem Reboot nicht von selbst

**Symptom.** Nach dem VPS-Reboot am 18.10. standen alle Container auf „Created", Showcase und Buchart58-Staging waren eine Woche lang down (Shop-API 502). Zusätzlich waren die Showcase-Container am 27.10. ganz verschwunden (Ursache ungeklärt, kein neuer Reboot).

**Ursache.** Rootless Podman hat keinen Daemon; `restart: unless-stopped` greift nach einem Reboot nicht, solange keine systemd-User-Unit die Stacks startet. Bekannte Grenze, steht in `vendure-showcase/server/README.md` und in Buchart58 `vault/Learnings/podman/podman-auf-dem-vps.md`.

**Auswirkung.** Ausfall bis jemand manuell startet; Netlify-Builds von `artilier-ui` scheitern in der Zeit, weil die Storefront die Weine beim Build vom VPS holt.

**Lösung.** Pro Stack eine systemd-User-Unit (Quadlet oder `podman generate systemd`) plus `loginctl enable-linger deploy`, danach einen Test-Reboot. Muss auf dem VPS eingerichtet werden.
