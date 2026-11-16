import type { GlobalMessages } from './en'

/** Global German strings — must match every key in en.ts (enforced by type). */
export const de: GlobalMessages = {
  // Common actions
  'action.close':    'Schließen',
  'action.cancel':   'Abbrechen',
  'action.confirm':  'Bestätigen',
  'action.apply':    'Anwenden',
  'action.delete':   'Löschen',
  'action.rename':   'Umbenennen',
  'action.save':     'Speichern',
  'action.reset':    'Zurücksetzen',
  'action.search':   'Suchen',

  // Common states
  'state.loading':   'Lädt…',
  'state.error':     'Ein Fehler ist aufgetreten.',
  'state.empty':     'Keine Ergebnisse.',
  'state.optional':  'optional',

  // Accessibility
  'a11y.closeDialog':      'Dialog schließen',
  'a11y.dragHandle':       'Zum Sortieren ziehen',
  'a11y.toggleVisibility': 'Sichtbarkeit umschalten',
  'a11y.toggleLock':       'Sperre umschalten',

  // Search overlay
  'search.placeholder':   'Suchen…',
  'search.noResults':     'Keine Ergebnisse gefunden.',
  'search.emptyState':    'Tippe etwas ein, um die Suche zu starten…',
  'search.navigate':      'navigieren',
  'search.select':        'auswählen',
  'search.shortcutLabel': 'Suche öffnen',
  'search.closeLabel':    'Suche schließen',

  // Layer panel
  'layers.deleteLayer':   'Ebene löschen',
  'layers.renameLayer':   'Ebene umbenennen',
  'layers.dragHandle':    'Zum Sortieren ziehen',
  'layers.visibility':    'Sichtbarkeit umschalten',
  'layers.lock':          'Sperre umschalten',

  // Image cropper
  'cropper.title':        'Bild zuschneiden',
  'cropper.apply':        'Zuschnitt anwenden',
  'cropper.cancel':       'Abbrechen',
  'cropper.zoomIn':       'Vergrößern',
  'cropper.zoomOut':      'Verkleinern',
  'cropper.zoom':         'Zoom',
  'cropper.resetRotation':'Rotation zurücksetzen',
  'cropper.flipH':        'Horizontal spiegeln',
  'cropper.flipV':        'Vertikal spiegeln',
  'cropper.noImage':      'Kein Bild ausgewählt.',

  // Validator badge
  'validator.compliant':  'EU-Konform',
  'validator.warnings':   '{count} Warnung{count, plural, one{} other{en}}',
  'validator.errors':     '{count} Fehler',
  'validator.close':      'Schließen',

  // Back to top
  'backToTop.label':      'Nach oben scrollen',
  'backToTop.shortcut':   'Nach oben',

  // Shortcuts overview
  'shortcuts.title':      'Tastenkürzel',
  'shortcuts.subtitle':   'Alle aktiven Tastenkürzel auf dieser Seite',
  'shortcuts.openHint':   'zum Öffnen',

  // Showcase Categories
  'nav.buchart58': 'Buchart58',
  'nav.cards': 'Effekte',
  'nav.text': 'Text & Motion',
  'nav.inputs': 'Formulare & Feedback',
  'nav.navigation': 'Navigation & Layout',
  'nav.shop': 'Shop',
  'nav.tools': 'Werkzeuge',
  'nav.designer': 'Designer',
  'nav.data': 'Daten',
  'nav.labor': 'Labor',

  'desc.buchart58': 'Genau die Komponenten, die der Buchart58-Shop einsetzt.',
  'desc.cards': 'Glow-Effekte, magnetische Interaktionen, 3D-Hover, Licht- und Bildeffekte sowie animierte Icons.',
  'desc.text': 'Textanimationen, Highlights, Papier-Elemente und scroll-reaktive Bewegungen.',
  'desc.inputs': 'Formular-Steuerungen, Such-Interaktionen und Datei-Uploads, dazu Toasts, Zähler, Countdown und Konfetti.',
  'desc.navigation': 'Navbar, Banner, Breadcrumbs, Scroll-Fortschritt, Theme-Steuerung, Footer und View Transitions.',
  'desc.shop': 'E-Commerce-spezifische Komponenten für den Wein-Onlineshop.',
  'desc.designer': 'Bausteine für den Wein-Etiketten-Designer: Color Picker, Text Toolbar und mehr.',
  'desc.data': 'Leistungsstarke Tabellen mit TanStack Table Integration, Sortierung und Pagination.',
  'desc.labor': 'Verspielte Effekte, bewusst nicht für den Shop gedacht.',
  } as const
