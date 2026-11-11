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
  fullscreenEnter:        string
  fullscreenExit:         string

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

  // Right panel — tabs
  tabProperties:          string
  tabWineData:            string
  tabBackground:          string
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
  bgModeImage:            string
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
  hotkeySelectAllLabel:   string
  hotkeySelectAllDescription: string
  hotkeyDeselectLabel:    string
  hotkeyDeselectDescription: string
  hotkeyDuplicateLabel:   string
  hotkeyDuplicateDescription: string
  hotkeyPanLabel:         string
  hotkeyPanDescription:   string
  hotkeyZoomInLabel:      string
  hotkeyZoomInDescription: string
  hotkeyZoomOutLabel:     string
  hotkeyZoomOutDescription: string
  zoomInTitle:            string
  zoomOutTitle:           string

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
    fullscreenEnter:         'Vollbild',
    fullscreenExit:          'Vollbild beenden',

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

    tabProperties:           'Eigenschaften',
    tabWineData:             'Weindaten',
    tabBackground:           'Hintergrund',
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
    bgModeImage:             'Bild',
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
    hotkeySelectAllLabel:    'Alles auswählen',
    hotkeySelectAllDescription: 'Alle sichtbaren, nicht gesperrten Objekte auswählen',
    hotkeyDeselectLabel:     'Auswahl aufheben',
    hotkeyDeselectDescription: 'Auswahl aufheben, ohne Auswahl den Vollbildmodus verlassen',
    hotkeyDuplicateLabel:    'Duplizieren',
    hotkeyDuplicateDescription: 'Ausgewählte Objekte versetzt kopieren',
    hotkeyPanLabel:          'Ansicht verschieben (halten)',
    hotkeyPanDescription:    'Leertaste gedrückt halten und ziehen, beim Loslassen kehrt das vorige Werkzeug zurück',
    hotkeyZoomInLabel:       'Hineinzoomen',
    hotkeyZoomInDescription: 'Ansicht vergrößern (Canvas-Mitte)',
    hotkeyZoomOutLabel:      'Herauszoomen',
    hotkeyZoomOutDescription: 'Ansicht verkleinern (Canvas-Mitte)',
    zoomInTitle:             'Hineinzoomen (=)',
    zoomOutTitle:            'Herauszoomen (−)',

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
    fullscreenEnter:         'Enter Fullscreen',
    fullscreenExit:          'Exit Fullscreen',

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

    tabProperties:           'Properties',
    tabWineData:             'Wine Data',
    tabBackground:           'Background',
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
    bgModeImage:             'Image',
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
    hotkeySelectAllLabel:    'Select all',
    hotkeySelectAllDescription: 'Select all visible, unlocked objects',
    hotkeyDeselectLabel:     'Deselect',
    hotkeyDeselectDescription: 'Clear the selection; with nothing selected, leave fullscreen',
    hotkeyDuplicateLabel:    'Duplicate',
    hotkeyDuplicateDescription: 'Copy the selected objects with a small offset',
    hotkeyPanLabel:          'Pan (hold)',
    hotkeyPanDescription:    'Hold Space and drag; releasing it returns to the previous tool',
    hotkeyZoomInLabel:       'Zoom in',
    hotkeyZoomInDescription: 'Magnify the view (canvas centre)',
    hotkeyZoomOutLabel:      'Zoom out',
    hotkeyZoomOutDescription: 'Shrink the view (canvas centre)',
    zoomInTitle:             'Zoom in (=)',
    zoomOutTitle:            'Zoom out (−)',

    exportLabel:             'PDF',
    exportTitle:             'Export as PDF (trim size)',
    exportPngLabel:          'PNG',
    exportPngTitle:          'Export as PNG (print resolution)',
    exportFilename:          'wine-label',
  },
} as const satisfies ComponentMessages<CellarCanvasMessages>

