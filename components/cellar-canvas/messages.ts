import type { ComponentMessages } from '../i18n'

/**
 * Surface of user-facing strings used across CellarCanvas and its
 * subcomponents. Symbolic single-letter labels (X / Y / W / H / SW) stay
 * hardcoded in the components — they're not language-specific.
 *
 * Interpolation: `labelDimensions` and `layersCount` use `{w}`/`{h}` and
 * `{count}` placeholders, replaced via the `interpolate` helper from
 * `../i18n`.
 */
export type CellarCanvasMessages = {
  // Header
  brand:                  string
  labelDimensions:        string // "{w}x{h}mm"
  undoTitle:              string
  redoTitle:              string
  fitToScreen:            string
  previewEnter:           string
  previewExit:            string
  fullscreenEnter:        string
  fullscreenExit:         string
  snappingTitleEnabled:   string
  snappingTitleDisabled:  string

  // Save button
  saveIdle:               string
  saveSaved:              string
  saveSaving:             string
  saveRetry:              string
  saveTitleDirty:         string
  saveTitleClean:         string

  // Main toolbar tools (label + shortcut hint)
  toolSelect:             string
  toolPan:                string
  toolText:               string
  toolImage:              string
  toolRect:               string
  toolCircle:             string
  toolLine:               string
  toolDelete:             string
  toolCrop:               string
  toolReplace:            string

  // Context toolbar
  contextEmpty:           string
  contextFill:            string
  contextStroke:          string

  // Right panel — tabs
  tabProperties:          string
  tabWineData:            string
  tabBackground:          string
  tabExtras:              string

  // Properties panel
  propsGeometry:          string
  propsAppearance:        string
  propsOpacity:           string
  propsEmpty:             string

  // Background panel
  bgHeading:              string
  bgFill:                 string
  bgFillTitle:            string

  // Wine fields panel
  wineFieldName:          string
  wineFieldVintage:       string
  wineFieldAlcohol:       string
  wineFieldVolume:        string
  wineFieldRegion:        string
  wineFieldProducer:      string
  wineFieldNotSet:        string
  wineFieldQrTitle:       string
  wineFieldQrHint:        string

  // Layers section
  layersHeading:          string
  layersCount:            string // "{count} total"

  // Hotkeys (registered with the global ShortcutOverview)
  hotkeyUndoLabel:        string
  hotkeyUndoDescription:  string
  hotkeyRedoLabel:        string
  hotkeyRedoDescription:  string
  hotkeyDeleteLabel:      string
  hotkeyDeleteDescription: string
  hotkeySnappingLabel:    string
  hotkeySnappingDescription: string
  hotkeyCategory:         string

  // Onboarding Tour
  tourSkip:               string
  tourBack:               string
  tourNext:               string
  tourDone:               string
  tourStartButton:        string
  tourStartTitle:         string
  tourWelcomeTitle:       string
  tourWelcomeBody:        string
  tourCanvasTitle:        string
  tourCanvasBody:         string
  tourWineFieldsTitle:    string
  tourWineFieldsBody:     string
  tourLayersTitle:        string
  tourLayersBody:         string
  tourSaveTitle:          string
  tourSaveBody:           string

  // Emoji extras panel
  emojiHeading:           string
  emojiHint:              string
}

export const MESSAGES = {
  de: {
    brand:                   'Cellar Canvas',
    labelDimensions:         'Standard-Etikett ({w}x{h}mm)',
    undoTitle:               'Rückgängig (Cmd+Z)',
    redoTitle:               'Wiederholen (Cmd+Shift+Z)',
    fitToScreen:             'An Fenster anpassen',
    previewEnter:            'Vorschau (Bleed ausblenden)',
    previewExit:             'Vorschau beenden (Bleed anzeigen)',
    fullscreenEnter:         'Vollbild',
    fullscreenExit:          'Vollbild beenden',
    snappingTitleEnabled:    'Snapping aktiv (S)',
    snappingTitleDisabled:   'Snapping aus (S)',

    saveIdle:                'Speichern',
    saveSaved:               'Gespeichert',
    saveSaving:              'Speichern …',
    saveRetry:               'Erneut versuchen',
    saveTitleDirty:          'Änderungen speichern',
    saveTitleClean:          'Alle Änderungen gespeichert',

    toolSelect:              'Auswählen (V)',
    toolPan:                 'Verschieben (Leertaste)',
    toolText:                'Text (T)',
    toolImage:               'Bild (I)',
    toolRect:                'Rechteck (R)',
    toolCircle:              'Kreis (C)',
    toolLine:                'Linie (L)',
    toolDelete:              'Auswahl löschen (Entf)',
    toolCrop:                'Zuschneiden',
    toolReplace:             'Ersetzen',

    contextEmpty:            'Wähle ein Objekt aus, um Optionen zu sehen',
    contextFill:             'Füllung',
    contextStroke:           'Kontur',

    tabProperties:           'Eigenschaften',
    tabWineData:             'Weindaten',
    tabBackground:           'Hintergrund',
    tabExtras:               'Extras',

    propsGeometry:           'Geometrie',
    propsAppearance:         'Darstellung',
    propsOpacity:            'Deckkraft',
    propsEmpty:              'Wähle ein Objekt auf der Leinwand aus, um Eigenschaften zu bearbeiten.',

    bgHeading:               'Hintergrund',
    bgFill:                  'Füllung',
    bgFillTitle:             'Hintergrundfarbe',

    wineFieldName:           'Weinname',
    wineFieldVintage:        'Jahrgang',
    wineFieldAlcohol:        'Alkohol %',
    wineFieldVolume:         'Volumen (ml)',
    wineFieldRegion:         'Region',
    wineFieldProducer:       'Erzeuger',
    wineFieldNotSet:         'Nicht gesetzt',
    wineFieldQrTitle:        'QR-Code hinzufügen',
    wineFieldQrHint:         'EU-Pflichtangabe',

    layersHeading:           'Ebenen',
    layersCount:             '{count} gesamt',

    hotkeyUndoLabel:         'Rückgängig',
    hotkeyUndoDescription:   'Letzte Änderung rückgängig machen',
    hotkeyRedoLabel:         'Wiederholen',
    hotkeyRedoDescription:   'Rückgängig gemachte Änderung wiederherstellen',
    hotkeyDeleteLabel:       'Löschen',
    hotkeyDeleteDescription: 'Ausgewähltes Objekt entfernen',
    hotkeySnappingLabel:     'Snapping umschalten',
    hotkeySnappingDescription: 'Drag-Snapping zu Kanten und Mittellinien an- oder ausschalten',
    hotkeyCategory:          'Aktionen',

    tourSkip:                'Überspringen',
    tourBack:                'Zurück',
    tourNext:                'Weiter',
    tourDone:                'Fertig',
    tourStartButton:         'Tour starten',
    tourStartTitle:          'Geführte Tour öffnen',
    tourWelcomeTitle:        'Willkommen bei Cellar Canvas',
    tourWelcomeBody:         'Gestalte dein eigenes Weinetikett — Text, Bilder, Formen, alles in deiner Hand. Eine kurze Tour zeigt dir die wichtigsten Werkzeuge.',
    tourCanvasTitle:         'Die Leinwand',
    tourCanvasBody:          'Das Etikett liegt zentral. Drumherum siehst du den Bleed-Bereich — Objekte, die hier reinragen, bleiben sichtbar, sind aber außerhalb des druckbaren Bereichs.',
    tourWineFieldsTitle:     'Weindaten einfügen',
    tourWineFieldsBody:      'Name, Jahrgang, Volumen — vorausgefüllte Felder fügst du per Klick als Textobjekt ein. Der QR-Code ist EU-Pflicht und steht ganz unten.',
    tourLayersTitle:         'Ebenen verwalten',
    tourLayersBody:          'Alle Objekte landen als Ebene rechts unten. Drag-and-Drop ändert die Reihenfolge, das Auge schaltet sie aus, das Schloss sperrt sie.',
    tourSaveTitle:           'Speichern',
    tourSaveBody:            'Änderungen werden automatisch in deinem Browser gesichert. Der Speichern-Button oben schickt sie zusätzlich an dein Konto.',

    emojiHeading:            'Emoji einfügen',
    emojiHint:               'Wähle ein Emoji — es landet als Text-Ebene auf der Leinwand.',
  },
  en: {
    brand:                   'Cellar Canvas',
    labelDimensions:         'Standard Label ({w}x{h}mm)',
    undoTitle:               'Undo (Cmd+Z)',
    redoTitle:               'Redo (Cmd+Shift+Z)',
    fitToScreen:             'Fit to Screen',
    previewEnter:            'Preview (hide bleed area)',
    previewExit:             'Exit Preview (show bleed)',
    fullscreenEnter:         'Enter Fullscreen',
    fullscreenExit:          'Exit Fullscreen',
    snappingTitleEnabled:    'Snapping enabled (S)',
    snappingTitleDisabled:   'Snapping disabled (S)',

    saveIdle:                'Save',
    saveSaved:               'Saved',
    saveSaving:              'Saving…',
    saveRetry:               'Retry',
    saveTitleDirty:          'Save changes',
    saveTitleClean:          'All changes saved',

    toolSelect:              'Select (V)',
    toolPan:                 'Pan (Space)',
    toolText:                'Text (T)',
    toolImage:               'Image (I)',
    toolRect:                'Rect (R)',
    toolCircle:              'Circle (C)',
    toolLine:                'Line (L)',
    toolDelete:              'Delete Selected (Del)',
    toolCrop:                'Crop',
    toolReplace:             'Replace',

    contextEmpty:            'Select an object to see options',
    contextFill:             'Fill',
    contextStroke:           'Stroke',

    tabProperties:           'Properties',
    tabWineData:             'Wine Data',
    tabBackground:           'Background',
    tabExtras:               'Extras',

    propsGeometry:           'Geometry',
    propsAppearance:         'Appearance',
    propsOpacity:            'Opacity',
    propsEmpty:              'Select an object on the canvas to edit its properties.',

    bgHeading:               'Canvas Background',
    bgFill:                  'Fill',
    bgFillTitle:             'Canvas background',

    wineFieldName:           'Wine Name',
    wineFieldVintage:        'Vintage',
    wineFieldAlcohol:        'Alcohol %',
    wineFieldVolume:         'Volume (ml)',
    wineFieldRegion:         'Region',
    wineFieldProducer:       'Producer',
    wineFieldNotSet:         'Not set',
    wineFieldQrTitle:        'Add QR Code',
    wineFieldQrHint:         'EU compliance requirement',

    layersHeading:           'Layers',
    layersCount:             '{count} total',

    hotkeyUndoLabel:         'Undo',
    hotkeyUndoDescription:   'Reverse the last change',
    hotkeyRedoLabel:         'Redo',
    hotkeyRedoDescription:   'Reapply a reversed change',
    hotkeyDeleteLabel:       'Delete',
    hotkeyDeleteDescription: 'Remove selected object',
    hotkeySnappingLabel:     'Toggle snapping',
    hotkeySnappingDescription: 'Turn drag-snapping to edges and center lines on or off',
    hotkeyCategory:          'Actions',

    tourSkip:                'Skip',
    tourBack:                'Back',
    tourNext:                'Next',
    tourDone:                'Done',
    tourStartButton:         'Start tour',
    tourStartTitle:          'Open guided tour',
    tourWelcomeTitle:        'Welcome to Cellar Canvas',
    tourWelcomeBody:         'Design your own wine label — text, images, shapes, all in your hands. A quick tour will show you the most important tools.',
    tourCanvasTitle:         'The canvas',
    tourCanvasBody:          'Your label sits in the center. The surrounding bleed area keeps overflowing objects visible while marking what falls outside the printable area.',
    tourWineFieldsTitle:     'Insert wine data',
    tourWineFieldsBody:      'Name, vintage, volume — pre-filled fields drop onto the canvas as text objects with one click. The QR code at the bottom is EU-mandatory.',
    tourLayersTitle:         'Manage layers',
    tourLayersBody:          'Every object becomes a layer at the bottom right. Drag-and-drop reorders, the eye toggles visibility, the lock prevents accidental edits.',
    tourSaveTitle:           'Save',
    tourSaveBody:            'Your changes are auto-saved in this browser. The Save button at the top also pushes them to your account.',

    emojiHeading:            'Insert emoji',
    emojiHint:               'Pick an emoji — it drops onto the canvas as a text layer.',
  },
} as const satisfies ComponentMessages<CellarCanvasMessages>

