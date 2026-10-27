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
  headerToolbarLabel:     string
  mainToolbarLabel:       string
  contextToolbarLabel:    string
  canvasLabel:            string
  labelDimensions:        string // "{w}x{h}mm"
  undoTitle:              string
  redoTitle:              string
  fitToScreen:            string
  previewEnter:           string
  previewExit:            string
  rulersShow:             string
  rulersHide:             string
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
  draftSaveFailed:        string
  imageInsertFailed:      string
  qrInsertFailed:         string
  dismissHint:            string

  // Main toolbar tools (label + shortcut hint)
  toolSelect:             string
  toolPan:                string
  toolText:               string
  /** Content of a freshly inserted text box. */
  defaultText:            string
  toolImage:              string
  toolRect:               string
  toolCircle:             string
  toolLine:               string
  toolDelete:             string
  toolDuplicate:          string
  toolCrop:               string
  toolReplace:            string

  // Context toolbar
  contextEmpty:           string
  contextFill:            string
  contextStroke:          string
  contextCornerRadius:    string
  contextGroup:           string
  contextUngroup:         string

  // Right panel — tabs
  tabProperties:          string
  tabWineData:            string
  tabBackground:          string
  tabExtras:              string
  tabTemplates:           string

  // Templates panel
  templateClassicName:    string
  templateModernName:     string
  templateMinimalName:    string
  templateRusticName:     string
  templateBoldName:       string
  templatesHint:          string
  templatesConfirmReplace: string

  // Properties panel
  propsGeometry:          string
  propsAppearance:        string
  propsOpacity:           string
  propsEmpty:             string

  // Background panel
  bgHeading:              string
  bgFill:                 string
  bgFillTitle:            string
  bgModeLabel:            string
  bgModeColor:            string
  bgModeGradient:         string
  bgModeImage:            string
  bgGradientFrom:         string
  bgGradientTo:           string
  bgGradientAngle:        string
  bgImageReplace:         string

  // Wine fields panel
  wineFieldName:          string
  wineFieldVintage:       string
  wineFieldAlcohol:       string
  wineFieldVolume:        string
  wineFieldRegion:        string
  wineFieldProducer:      string
  wineFieldAllergen:      string
  wineFieldCountry:       string
  wineFieldNotSet:        string
  wineFieldQrTitle:       string
  wineFieldQrHint:        string
  wineFieldQrMissingUrl:  string

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
  hotkeySelectAllLabel:   string
  hotkeySelectAllDescription: string
  hotkeyDeselectLabel:    string
  hotkeyDeselectDescription: string
  hotkeyDuplicateLabel:   string
  hotkeyDuplicateDescription: string
  hotkeyGroupLabel:       string
  hotkeyGroupDescription: string
  hotkeyUngroupLabel:     string
  hotkeyUngroupDescription: string
  hotkeyPanLabel:         string
  hotkeyPanDescription:   string
  hotkeyRulersLabel:      string
  hotkeyRulersDescription: string
  hotkeyZoomInLabel:      string
  hotkeyZoomInDescription: string
  hotkeyZoomOutLabel:     string
  hotkeyZoomOutDescription: string
  zoomInTitle:            string
  zoomOutTitle:           string
  hotkeyCategory:         string

  // Onboarding Tour
  tourSkip:               string
  tourBack:               string
  tourNext:               string
  tourDone:               string
  tourProgress:           string
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
  signatureHeading:       string
  signatureHint:          string
  signatureClear:         string
  signatureInsert:        string
  signatureLayerName:     string
  ornamentsHeading:       string
  ornamentDivider:        string
  ornamentLeaf:           string
  ornamentGrapes:         string
  ornamentFlourish:       string

  // Export
  exportLabel:            string
  exportTitle:            string
  exportPngLabel:         string
  exportPngTitle:         string
  exportFilename:         string
}

export const MESSAGES = {
  de: {
    brand:                   'Cellar Canvas',
    headerToolbarLabel:      'Editor-Aktionen',
    mainToolbarLabel:        'Werkzeuge',
    contextToolbarLabel:     'Ausgewähltes Objekt',
    canvasLabel:             'Etikett-Arbeitsfläche. Die Objekte darauf stehen in der Ebenenliste.',
    labelDimensions:         'Standard-Etikett ({w}x{h}mm)',
    undoTitle:               'Rückgängig (Cmd+Z)',
    redoTitle:               'Wiederholen (Cmd+Shift+Z)',
    fitToScreen:             'An Fenster anpassen',
    previewEnter:            'Vorschau (Bleed ausblenden)',
    previewExit:             'Vorschau beenden (Bleed anzeigen)',
    rulersShow:              'Lineal einblenden (Shift+R)',
    rulersHide:              'Lineal ausblenden (Shift+R)',
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
    draftSaveFailed:         'Entwurf zu groß für den lokalen Speicher — Änderungen gehen beim Neuladen verloren.',
    imageInsertFailed:       'Bild konnte nicht geladen werden. Die Datei ist beschädigt oder das Format wird nicht unterstützt.',
    qrInsertFailed:          'QR-Code konnte nicht erzeugt werden. Bitte die Nährwert-URL prüfen.',
    dismissHint:             'Hinweis schließen',

    toolSelect:              'Auswählen',
    toolPan:                 'Ansicht verschieben',
    toolText:                'Text',
    defaultText:             'Neuer Text',
    toolImage:               'Bild',
    toolRect:                'Rechteck',
    toolCircle:              'Kreis',
    toolLine:                'Linie',
    toolDelete:              'Auswahl löschen (Entf)',
    toolDuplicate:           'Auswahl duplizieren (Cmd+D)',
    toolCrop:                'Zuschneiden',
    toolReplace:             'Ersetzen',

    contextEmpty:            'Wähle ein Objekt aus, um Optionen zu sehen',
    contextFill:             'Füllung',
    contextStroke:           'Kontur',
    contextCornerRadius:     'Eckenradius',
    contextGroup:            'Gruppieren (Cmd+G)',
    contextUngroup:          'Gruppierung aufheben (Cmd+Shift+G)',

    tabProperties:           'Eigenschaften',
    tabWineData:             'Weindaten',
    tabBackground:           'Hintergrund',
    tabExtras:               'Extras',
    tabTemplates:            'Vorlagen',

    templateClassicName:    'Klassisch',
    templateModernName:     'Modern',
    templateMinimalName:    'Minimal',
    templateRusticName:     'Rustikal',
    templateBoldName:       'Kräftig',
    templatesHint:          'Ersetzt den aktuellen Inhalt der Leinwand mit einem vorgefertigten Layout — Weindaten werden automatisch eingesetzt.',
    templatesConfirmReplace: 'Aktuellen Entwurf durch die Vorlage ersetzen? Diese Aktion lässt sich mit Cmd+Z rückgängig machen.',

    propsGeometry:           'Geometrie',
    propsAppearance:         'Darstellung',
    propsOpacity:            'Deckkraft',
    propsEmpty:              'Wähle ein Objekt auf der Leinwand aus, um Eigenschaften zu bearbeiten.',

    bgHeading:               'Hintergrund',
    bgFill:                  'Füllung',
    bgFillTitle:             'Hintergrundfarbe',
    bgModeLabel:             'Art des Hintergrunds',
    bgModeColor:             'Farbe',
    bgModeGradient:          'Verlauf',
    bgModeImage:             'Bild',
    bgGradientFrom:          'Startfarbe',
    bgGradientTo:            'Endfarbe',
    bgGradientAngle:         'Winkel',
    bgImageReplace:          'Bild ersetzen',

    wineFieldName:           'Weinname',
    wineFieldVintage:        'Jahrgang',
    wineFieldAlcohol:        'Alkohol %',
    wineFieldVolume:         'Volumen (ml)',
    wineFieldRegion:         'Region',
    wineFieldProducer:       'Erzeuger',
    wineFieldAllergen:       'Allergenhinweis',
    wineFieldCountry:        'Herkunftsland',
    wineFieldNotSet:         'Nicht gesetzt',
    wineFieldQrTitle:        'QR-Code hinzufügen',
    wineFieldQrHint:         'EU-Pflichtangabe',
    wineFieldQrMissingUrl:   'Keine Nährwert-URL gesetzt',

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
    hotkeySelectAllLabel:    'Alles auswählen',
    hotkeySelectAllDescription: 'Alle sichtbaren, nicht gesperrten Objekte auswählen',
    hotkeyDeselectLabel:     'Auswahl aufheben',
    hotkeyDeselectDescription: 'Auswahl aufheben, ohne Auswahl den Vollbildmodus verlassen',
    hotkeyDuplicateLabel:    'Duplizieren',
    hotkeyDuplicateDescription: 'Ausgewählte Objekte versetzt kopieren',
    hotkeyGroupLabel:        'Gruppieren',
    hotkeyGroupDescription:  'Ausgewählte Objekte zu einer Gruppe zusammenfassen',
    hotkeyUngroupLabel:      'Gruppierung aufheben',
    hotkeyUngroupDescription: 'Ausgewählte Gruppe in ihre Objekte auflösen',
    hotkeyPanLabel:          'Ansicht verschieben (halten)',
    hotkeyPanDescription:    'Leertaste gedrückt halten und ziehen, beim Loslassen kehrt das vorige Werkzeug zurück',
    hotkeyRulersLabel:       'Lineal umschalten',
    hotkeyRulersDescription: 'mm-Lineal an den Rändern der Arbeitsfläche ein- oder ausblenden',
    hotkeyZoomInLabel:       'Hineinzoomen',
    hotkeyZoomInDescription: 'Ansicht vergrößern (Canvas-Mitte)',
    hotkeyZoomOutLabel:      'Herauszoomen',
    hotkeyZoomOutDescription: 'Ansicht verkleinern (Canvas-Mitte)',
    zoomInTitle:             'Hineinzoomen (=)',
    zoomOutTitle:            'Herauszoomen (−)',
    hotkeyCategory:          'Aktionen',

    tourSkip:                'Überspringen',
    tourBack:                'Zurück',
    tourNext:                'Weiter',
    tourDone:                'Fertig',
    tourProgress:            '{current} von {total}',
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
    signatureHeading:        'Unterschrift',
    signatureHint:           'Mit Maus, Stift oder Finger ins Feld schreiben, dann einfügen.',
    signatureClear:          'Löschen',
    signatureInsert:         'Einfügen',
    signatureLayerName:      'Unterschrift',
    ornamentsHeading:        'Ornamente',
    ornamentDivider:         'Trenner',
    ornamentLeaf:            'Weinblatt',
    ornamentGrapes:          'Traube',
    ornamentFlourish:        'Ranke',

    exportLabel:             'PDF',
    exportTitle:             'Als PDF exportieren (Trim-Größe)',
    exportPngLabel:          'PNG',
    exportPngTitle:          'Als PNG exportieren (Druckauflösung)',
    exportFilename:          'weinetikett',
  },
  en: {
    brand:                   'Cellar Canvas',
    headerToolbarLabel:      'Editor actions',
    mainToolbarLabel:        'Tools',
    contextToolbarLabel:     'Selected object',
    canvasLabel:             'Label canvas. The objects on it are listed in the layer panel.',
    labelDimensions:         'Standard Label ({w}x{h}mm)',
    undoTitle:               'Undo (Cmd+Z)',
    redoTitle:               'Redo (Cmd+Shift+Z)',
    fitToScreen:             'Fit to Screen',
    previewEnter:            'Preview (hide bleed area)',
    previewExit:             'Exit Preview (show bleed)',
    rulersShow:              'Show rulers (Shift+R)',
    rulersHide:              'Hide rulers (Shift+R)',
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
    draftSaveFailed:         'Draft too large for local storage — changes will be lost on reload.',
    imageInsertFailed:       'Could not load the image. The file is damaged or the format is not supported.',
    qrInsertFailed:          'Could not generate the QR code. Please check the nutrition info URL.',
    dismissHint:             'Dismiss',

    toolSelect:              'Select',
    toolPan:                 'Pan',
    toolText:                'Text',
    defaultText:             'New Text',
    toolImage:               'Image',
    toolRect:                'Rect',
    toolCircle:              'Circle',
    toolLine:                'Line',
    toolDelete:              'Delete Selected (Del)',
    toolDuplicate:           'Duplicate Selected (Cmd+D)',
    toolCrop:                'Crop',
    toolReplace:             'Replace',

    contextEmpty:            'Select an object to see options',
    contextFill:             'Fill',
    contextStroke:           'Stroke',
    contextCornerRadius:     'Corner radius',
    contextGroup:            'Group (Cmd+G)',
    contextUngroup:          'Ungroup (Cmd+Shift+G)',

    tabProperties:           'Properties',
    tabWineData:             'Wine Data',
    tabBackground:           'Background',
    tabExtras:               'Extras',
    tabTemplates:            'Templates',

    templateClassicName:    'Classic',
    templateModernName:     'Modern',
    templateMinimalName:    'Minimal',
    templateRusticName:     'Rustic',
    templateBoldName:       'Bold',
    templatesHint:          'Replaces the current canvas content with a pre-built layout — wine data is filled in automatically.',
    templatesConfirmReplace: 'Replace the current draft with this template? This can be undone with Cmd+Z.',

    propsGeometry:           'Geometry',
    propsAppearance:         'Appearance',
    propsOpacity:            'Opacity',
    propsEmpty:              'Select an object on the canvas to edit its properties.',

    bgHeading:               'Canvas Background',
    bgFill:                  'Fill',
    bgFillTitle:             'Canvas background',
    bgModeLabel:             'Background type',
    bgModeColor:             'Color',
    bgModeGradient:          'Gradient',
    bgModeImage:             'Image',
    bgGradientFrom:          'Start color',
    bgGradientTo:            'End color',
    bgGradientAngle:         'Angle',
    bgImageReplace:          'Replace image',

    wineFieldName:           'Wine Name',
    wineFieldVintage:        'Vintage',
    wineFieldAlcohol:        'Alcohol %',
    wineFieldVolume:         'Volume (ml)',
    wineFieldRegion:         'Region',
    wineFieldProducer:       'Producer',
    wineFieldAllergen:       'Allergen Note',
    wineFieldCountry:        'Country of Origin',
    wineFieldNotSet:         'Not set',
    wineFieldQrTitle:        'Add QR Code',
    wineFieldQrHint:         'EU compliance requirement',
    wineFieldQrMissingUrl:   'No nutrition URL set',

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
    hotkeySelectAllLabel:    'Select all',
    hotkeySelectAllDescription: 'Select all visible, unlocked objects',
    hotkeyDeselectLabel:     'Deselect',
    hotkeyDeselectDescription: 'Clear the selection; with nothing selected, leave fullscreen',
    hotkeyDuplicateLabel:    'Duplicate',
    hotkeyDuplicateDescription: 'Copy the selected objects with a small offset',
    hotkeyGroupLabel:        'Group',
    hotkeyGroupDescription:  'Combine the selected objects into one group',
    hotkeyUngroupLabel:      'Ungroup',
    hotkeyUngroupDescription: 'Split the selected group back into its objects',
    hotkeyPanLabel:          'Pan (hold)',
    hotkeyPanDescription:    'Hold Space and drag; releasing it returns to the previous tool',
    hotkeyRulersLabel:       'Toggle rulers',
    hotkeyRulersDescription: 'Show or hide the mm rulers along the canvas edges',
    hotkeyZoomInLabel:       'Zoom in',
    hotkeyZoomInDescription: 'Magnify the view (canvas centre)',
    hotkeyZoomOutLabel:      'Zoom out',
    hotkeyZoomOutDescription: 'Shrink the view (canvas centre)',
    zoomInTitle:             'Zoom in (=)',
    zoomOutTitle:            'Zoom out (−)',
    hotkeyCategory:          'Actions',

    tourSkip:                'Skip',
    tourBack:                'Back',
    tourNext:                'Next',
    tourDone:                'Done',
    tourProgress:            '{current} of {total}',
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
    signatureHeading:        'Signature',
    signatureHint:           'Sign in the box with mouse, pen or finger, then insert it.',
    signatureClear:          'Clear',
    signatureInsert:         'Insert',
    signatureLayerName:      'Signature',
    ornamentsHeading:        'Ornaments',
    ornamentDivider:         'Divider',
    ornamentLeaf:            'Vine leaf',
    ornamentGrapes:          'Grapes',
    ornamentFlourish:        'Flourish',

    exportLabel:             'PDF',
    exportTitle:             'Export as PDF (trim size)',
    exportPngLabel:          'PNG',
    exportPngTitle:          'Export as PNG (print resolution)',
    exportFilename:          'wine-label',
  },
} as const satisfies ComponentMessages<CellarCanvasMessages>

