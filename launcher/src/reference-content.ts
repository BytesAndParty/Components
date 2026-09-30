// Inhalte der Aufbau-Referenz. Getrennt vom Markup, damit Stand, Links und
// Begründungen gepflegt werden können, ohne ReferencePage.tsx anzufassen.
// Zwei Lesergruppen: Haupttexte für das Weingut (ohne Fachbegriffe), `tech`
// für die Devs (wird auf der Seite aufklappbar gezeigt).
// Quelle der Fakten: BuchArt58-Repo, GO-LIVE.md + vault/Decisions/hosting-deployment.md.

const DEV = import.meta.env.DEV

export const COMPONENTS_HREF = DEV ? 'http://localhost:5171' : '/components/'
export const SECTIONS_BASE = DEV ? 'http://localhost:5174/' : '/sections/'

export const LAST_UPDATED = '30. September 2026'

export interface ReferenceLink {
  label: string
  href: string
  description: string
  external?: boolean
}

export const LINK_GROUPS: { title: string; links: ReferenceLink[] }[] = [
  {
    title: 'Showcases',
    links: [
      {
        label: 'Component-Showcase',
        href: COMPONENTS_HREF,
        description: 'Die einzelnen Bausteine: Buttons, Eingabefelder, Karten, Warenkorb und mehr.',
      },
      {
        label: 'Section-Showcase (Editor)',
        href: SECTIONS_BASE,
        description: 'Alle Seitenabschnitte in ihren Varianten. Hier wird per Herz ausgewählt.',
      },
      {
        label: 'Section-Showcase (Vorschau)',
        href: `${SECTIONS_BASE}preview`,
        description: 'Die zuletzt ausgewählten Abschnitte als zusammenhängende Seite.',
      },
    ],
  },
  {
    title: 'Umgebungen',
    links: [
      {
        label: 'Staging-Shop',
        href: 'https://weingutbuchart58-staging.netlify.app',
        description: 'Der neue Shop mit Testdaten. Zeigt immer den neuesten Stand und kann deshalb zwischendurch haken.',
        external: true,
      },
      {
        label: 'Alte Seite buchart58.at',
        href: 'https://www.buchart58.at',
        description: 'Die heutige Seite mit Shop. Läuft bis zur Umstellung unverändert weiter, zum Vergleichen.',
        external: true,
      },
    ],
  },
  {
    title: 'Für Devs',
    links: [
      {
        label: 'GitHub: BuchArt58',
        href: 'https://github.com/BytesAndParty/BuchArt58',
        description: 'Das Produkt: Shop, Backend und die Doku im Vault. Privat, nur mit Zugang.',
        external: true,
      },
      {
        label: 'GitHub: Components',
        href: 'https://github.com/BytesAndParty/Components',
        description: 'Diese Seite, die Showcases und die Bibliothek AtelierUI. Öffentlich.',
        external: true,
      },
      {
        label: 'Projekt-Board',
        href: 'https://github.com/users/BytesAndParty/projects/2',
        description: 'Offene Aufgaben von Robert und Felix. Nur mit Zugang.',
        external: true,
      },
    ],
  },
]

export const STATUS: string[] = [
  'Die echte Seite ist weiterhin buchart58.at. Sie nimmt Bestellungen an, bis der neue Shop alles kann, was sie heute kann.',
  'Der neue Shop läuft auf Staging mit Testdaten. Kasse und Kundenkonto fehlen noch.',
  'Die Live-Umgebung für den neuen Shop ist angelegt. Sie geht in Betrieb, sobald ihr Backend steht.',
]

export const WORKFLOW: { title: string; text: string }[] = [
  {
    title: 'Ausprobieren',
    text: 'Jeder Baustein entsteht zuerst in den Showcases und wird dort hell und dunkel, am Handy und mit der Tastatur geprüft.',
  },
  {
    title: 'Übernehmen',
    text: 'Was passt, wird in den Shop übernommen und mit den echten Weindaten verbunden.',
  },
  {
    title: 'Prüfen',
    text: 'Jede Änderung landet automatisch auf Staging. Dort lässt sich alles gefahrlos anschauen.',
  },
  {
    title: 'Freigeben',
    text: 'Live geht nur, was Weingut und Devs gemeinsam freigegeben haben.',
  },
]

export interface Guide {
  title: string
  items: string[]
  ordered: boolean
  note?: string
  shortcuts?: { keys: string[]; action: string }[]
}

export const GUIDES: Guide[] = [
  {
    title: 'Eine Seite zusammenstellen',
    ordered: true,
    items: [
      'Im Section-Editor einen Abschnitt öffnen, z. B. Hero.',
      'Mit ← und → durch die Varianten blättern.',
      'Die passende Variante mit dem Herz markieren. Pro Abschnitt zählt eine; ein Herz auf einer anderen ersetzt die bisherige.',
      'Unter „Deine Seite“ (Herz mit Zahl) die Reihenfolge per Ziehen ändern, dann „Vorschau“.',
      'In der Vorschau „Link kopieren“. Der Link enthält die ganze Auswahl und lässt sich verschicken.',
    ],
    note: 'Die Herzen merkt sich nur der eigene Browser. Zum Teilen immer den Link aus der Vorschau nehmen.',
    shortcuts: [
      { keys: ['←', '→'], action: 'Variante wechseln' },
      { keys: ['↑', '↓'], action: 'Abschnitt wechseln' },
      { keys: ['M'], action: 'Alle Varianten untereinander oder einzeln' },
      { keys: ['H'], action: 'Steuerleiste aus- und einblenden' },
    ],
  },
  {
    title: 'Bausteine ansehen',
    ordered: false,
    items: [
      'Im Component-Showcase über die Navigation ein Thema wählen: Karten, Eingaben, Shop, Übergänge und mehr.',
      'In der Kopfleiste Sprache, hell/dunkel und Akzentfarbe umschalten. Jeder Baustein muss in allen Kombinationen gut aussehen.',
      'Mit der Tab-Taste durchgehen. Alles muss auch ohne Maus bedienbar sein.',
    ],
  },
  {
    title: 'Den neuen Shop testen',
    ordered: false,
    items: [
      'Schon da: Startseite, Sortiment, Weinseiten, Erlebnisse, Rebstockmiete, Kontakt, Deutsch und Englisch.',
      'Fehlt noch: Kasse und Bezahlung, Kundenkonto, echte Termine für die Erlebnisse.',
      'Weine, Preise, Fotos und Texte sind Testdaten oder Platzhalter.',
    ],
    note: 'Bestellen ist auf Staging nicht möglich. Es geht nichts an echte Kund:innen.',
  },
]

export interface Decision {
  title: string
  why: string
  tech: string[]
}

export const DECISIONS: Decision[] = [
  {
    title: 'Erst im Labor, dann im Shop',
    why: 'Bausteine und Seitenabschnitte entstehen hier und werden erst übernommen, wenn sie ausgereift sind. So bleibt der eigentliche Shop schlank, und Experimente machen dort nichts kaputt.',
    tech: [
      'Zwei Repos: Components (AtelierUI, Showcases, Etiketten-Prototyp, Vendure-Evaluierung) und BuchArt58 (Produkt).',
      'Komponenten werden kopiert, nicht als Paket eingebunden. Deshalb ist der Stack in beiden gleich: React 19 + Compiler, Tailwind 4, Ark UI, motion/react, TanStack Query.',
    ],
  },
  {
    title: 'Echte Bausteine statt Entwürfe',
    why: 'Was in den Showcases zu sehen ist, läuft später genau so im Shop, samt hell/dunkel, Handy und Tastatur. Entschieden wird am echten Ergebnis, nicht an einem Bild davon.',
    tech: [
      'Jeder Baustein hat im Showcase eine Demo mit realistischen Daten plus Randfälle: leer, lädt, Fehler, deaktiviert (COMPONENT-GUIDELINES §10).',
    ],
  },
  {
    title: 'Abschnitte in Varianten',
    why: 'Jeden Seitenabschnitt gibt es in mehreren Varianten. So lässt sich der Aufbau der Seite gemeinsam aussuchen, bevor er fest gebaut wird: per Herz und Link statt per Beschreibung.',
    tech: [
      'Die Auswahl steckt im Link: ?s=hero:v6,features:v5,… Die Reihenfolge im Parameter ist die Reihenfolge auf der Seite.',
      'Ausgangspunkt ist die kanonische Komposition aus STYLE-GUIDE.md §1.',
    ],
  },
  {
    title: 'Shop-Technik mit fertigem Kern',
    why: 'Warenkorb, Kasse, Bestellungen, Kundenkonten und eine Verwaltung bringt das Shop-System fertig mit. Selbst gebaut wird nur, was das Weingut besonders macht: Erlebnisse, Rebstock-Abo, Wein-Angaben. Die Weinseiten werden vorab fertig erzeugt. Sie laden schnell, werden gut gefunden und bleiben erreichbar, auch wenn das Backend einmal ausfällt.',
    tech: [
      'Backend: Vendure 3.7 (NestJS, GraphQL) mit eigenen Plugins. Zahlung über Nexi XPay Global (in Arbeit).',
      'Storefront: Astro 7, statisch für Katalog und Produktseiten, serverseitig für Konto und Events, React-19-Islands für Warenkorb und Filter.',
    ],
  },
  {
    title: 'Eigener Server in der EU',
    why: 'Das Backend zieht auf einen eigenen Server bei Contabo, Staging läuft dort seit Ende September. Vorher hing es an einem Cloud-Datenbankdienst, der wegen eines Kontingents ausfiel. Ein eigener Server hat dieses Risiko nicht, kostet einen festen Monatspreis und hält die Daten in der EU.',
    tech: [
      'Contabo Cloud VPS 4, Ubuntu 24.04. Caddy (TLS) vor Podman rootless: Vendure, Worker, Postgres 18, Redis.',
      'Storefront statisch auf Netlify. Löst Fly.io + Neon ab (Neon-Ausfall im August durch die Transfer-Quota).',
    ],
  },
  {
    title: 'Staging und Live getrennt',
    why: 'Staging baut sich bei jeder Änderung neu und darf auch mal haken. Live bekommt nur, was bewusst freigegeben ist. Beide haben eigene Daten, Tests treffen nie echte Kund:innen.',
    tech: [
      'Zwei Netlify-Sites aus demselben Repo: weingutbuchart58-staging baut bei jedem Push auf main; weingutbuchart58 (Live) hat gestoppte Builds, bis der Prod-Stack unter api.buchart58.at steht, danach wird manuell befördert.',
      'Staging und Prod bekommen getrennte Stacks mit eigener Datenbank auf demselben Server. Staging läuft, Prod folgt.',
    ],
  },
  {
    title: 'Die alte Seite läuft weiter',
    why: 'buchart58.at bleibt, bis der neue Shop alles kann, was sie heute kann: Versand nach Karton, Lieferung nach Deutschland, die gewohnten Zahlarten. Die neue Seite wächst daneben, zuerst als geschlossene Beta. Umgestellt wird in einer ruhigen Zeit, nicht im Weihnachtsgeschäft. Die Adressen hinter den QR-Codes auf den Flaschen bleiben dabei gleich.',
    tech: [
      'Phasen: Fundament → Beta Website → Beta Shop → Umstellung → Konto + Events → Rebstock-Abo, jede mit eigenem Test-Gate (GO-LIVE.md).',
      'E-Label-Seiten unter identischem Pfad /naehrwerte/<code>/, 301-Redirects für alle alten Shop-URLs.',
    ],
  },
]
