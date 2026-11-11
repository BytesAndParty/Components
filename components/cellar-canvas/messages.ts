import type { ComponentMessages } from '../i18n'

/**
 * User-facing strings of CellarCanvas and its subcomponents.
 *
 * Placeholders are filled with `interpolate` from `../i18n`:
 * - `{label}` / `{keys}` in `shortcutHint`: a button name plus its shortcut as
 *   the current platform writes it (`formatForDisplay` from
 *   `@tanstack/react-hotkeys`: "⌘ Z" on a Mac, "Ctrl+Z" elsewhere).
 * - `{w}` / `{h}` in `labelDimensions`, `{percent}` in `zoomLevel`,
 *   `{name}` in `toolInsertTitle`.
 *
 * The `hotkey…Label` strings double as the names of the matching buttons
 * (undo, redo, duplicate, delete, zoom in / out).
 */
export type CellarCanvasMessages = {
  // Header
  headerToolbarLabel:     string
  labelDimensions:        string
  shortcutHint:           string
  panelToggle:            string
  fullscreenEnter:        string
  fullscreenExit:         string

  // Save button
  saveIdle:               string
  saveSaved:              string
  saveSaving:             string
  saveRetry:              string
  saveTitleDirty:         string
  saveTitleClean:         string

  // Export
  exportPngLabel:         string
  exportPngTitle:         string
  exportPdfLabel:         string
  exportPdfTitle:         string
  exportFilename:         string

  // Notices above the canvas
  draftSaveFailed:        string
  imageInsertFailed:      string
  qrInsertFailed:         string
  exportFailed:           string
  dismissHint:            string

  // Insert bar (left)
  mainToolbarLabel:       string
  toolImage:              string
  toolImageTitle:         string
  toolText:               string
  /** Content of a freshly inserted text box. */
  defaultText:            string
  toolRect:               string
  toolCircle:             string
  toolLine:               string
  toolInsertTitle:        string

  // Bar for the selected element (top)
  contextToolbarLabel:    string
  contextEmpty:           string
  toolCrop:               string
  toolReplace:            string
  contextFill:            string
  contextStroke:          string
  contextStrokeWidth:     string
  contextCornerRadius:    string
  contextCenterH:         string
  contextCenterV:         string

  // Canvas
  canvasLabel:            string
  zoomFit:                string
  zoomFitTitle:           string
  zoomLevel:              string

  // Right panel
  panelLabel:             string
  sectionWineData:        string
  sectionBackground:      string
  sectionTemplates:       string
  sectionLayers:          string
  sectionGeometry:        string

  // Templates
  templateClassicName:    string
  templateModernName:     string
  templateMinimalName:    string
  templateRusticName:     string
  templateBoldName:       string
  templatesHint:          string
  templatesConfirm:       string

  // Position & size
  propsWidth:             string
  propsHeight:            string
  propsRotation:          string
  propsOpacity:           string
  propsEmpty:             string

  // Background
  bgModeLabel:            string
  bgModeColor:            string
  bgModeImage:            string
  bgFill:                 string
  bgFillTitle:            string
  bgImageReplace:         string

  // Wine data
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
}

export const MESSAGES = {
  de: {
    headerToolbarLabel:      'Editor-Aktionen',
    labelDimensions:         'Etikett {w} × {h} mm',
    shortcutHint:            '{label} ({keys})',
    panelToggle:             'Einstellungen',
    fullscreenEnter:         'Vollbild',
    fullscreenExit:          'Vollbild beenden',

    saveIdle:                'Speichern',
    saveSaved:               'Gespeichert',
    saveSaving:              'Speichern …',
    saveRetry:               'Erneut versuchen',
    saveTitleDirty:          'Änderungen speichern',
    saveTitleClean:          'Alle Änderungen gespeichert',

    exportPngLabel:          'PNG',
    exportPngTitle:          'Als Bild (PNG) in Druckauflösung speichern',
    exportPdfLabel:          'PDF',
    exportPdfTitle:          'Als PDF für den Druck speichern',
    exportFilename:          'weinetikett',

    draftSaveFailed:         'Der Entwurf ist zu groß für den Zwischenspeicher des Browsers. Beim Neuladen gehen Änderungen verloren.',
    imageInsertFailed:       'Das Bild konnte nicht geladen werden. Die Datei ist beschädigt oder das Format wird nicht unterstützt.',
    qrInsertFailed:          'Der QR-Code konnte nicht erzeugt werden. Bitte die Adresse der Nährwertangaben prüfen.',
    exportFailed:            'Der Export ist fehlgeschlagen. Bitte noch einmal versuchen.',
    dismissHint:             'Hinweis schließen',

    mainToolbarLabel:        'Einfügen',
    toolImage:               'Bild',
    toolImageTitle:          'Bild oder fertiges Etikett hochladen',
    toolText:                'Text',
    defaultText:             'Neuer Text',
    toolRect:                'Rechteck',
    toolCircle:              'Kreis',
    toolLine:                'Linie',
    toolInsertTitle:         '{name} einfügen',

    contextToolbarLabel:     'Ausgewähltes Element',
    contextEmpty:            'Klicke ein Element auf dem Etikett an, um es zu bearbeiten.',
    toolCrop:                'Zuschneiden',
    toolReplace:             'Ersetzen',
    contextFill:             'Füllung',
    contextStroke:           'Rand',
    contextStrokeWidth:      'Stärke',
    contextCornerRadius:     'Ecken',
    contextCenterH:          'Waagrecht auf dem Etikett zentrieren',
    contextCenterV:          'Senkrecht auf dem Etikett zentrieren',

    canvasLabel:             'Etikett-Arbeitsfläche. Die Elemente darauf stehen in der Ebenenliste.',
    zoomFit:                 'Einpassen',
    zoomFitTitle:            'Ganzes Etikett zeigen',
    zoomLevel:               'Zoom {percent} %',

    panelLabel:              'Einstellungen des Etiketts',
    sectionWineData:         'Weindaten',
    sectionBackground:       'Hintergrund',
    sectionTemplates:        'Vorlagen',
    sectionLayers:           'Ebenen',
    sectionGeometry:         'Position & Größe',

    templateClassicName:     'Klassisch',
    templateModernName:      'Modern',
    templateMinimalName:     'Minimal',
    templateRusticName:      'Rustikal',
    templateBoldName:        'Kräftig',
    templatesHint:           'Eine Vorlage ersetzt den Inhalt des Etiketts. Die Weindaten werden eingesetzt.',
    templatesConfirm:        'Inhalt ersetzen?',

    propsWidth:              'B',
    propsHeight:             'H',
    propsRotation:           'Drehung',
    propsOpacity:            'Deckkraft',
    propsEmpty:              'Wähle ein Element aus, um Position und Größe zu sehen.',

    bgModeLabel:             'Art des Hintergrunds',
    bgModeColor:             'Farbe',
    bgModeImage:             'Bild',
    bgFill:                  'Papierfarbe',
    bgFillTitle:             'Papierfarbe wählen',
    bgImageReplace:          'Anderes Bild wählen',

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

    hotkeyUndoLabel:         'Rückgängig',
    hotkeyUndoDescription:   'Letzte Änderung rückgängig machen',
    hotkeyRedoLabel:         'Wiederholen',
    hotkeyRedoDescription:   'Rückgängig gemachte Änderung wiederherstellen',
    hotkeyDeleteLabel:       'Löschen',
    hotkeyDeleteDescription: 'Ausgewähltes Element entfernen',
    hotkeySelectAllLabel:    'Alles auswählen',
    hotkeySelectAllDescription: 'Alle sichtbaren, nicht gesperrten Elemente auswählen',
    hotkeyDeselectLabel:     'Auswahl aufheben',
    hotkeyDeselectDescription: 'Auswahl aufheben, ohne Auswahl den Vollbildmodus verlassen',
    hotkeyDuplicateLabel:    'Duplizieren',
    hotkeyDuplicateDescription: 'Ausgewählte Elemente versetzt kopieren',
    hotkeyPanLabel:          'Ansicht verschieben (halten)',
    hotkeyPanDescription:    'Leertaste gedrückt halten und ziehen',
    hotkeyZoomInLabel:       'Vergrößern',
    hotkeyZoomInDescription: 'Ansicht vergrößern',
    hotkeyZoomOutLabel:      'Verkleinern',
    hotkeyZoomOutDescription: 'Ansicht verkleinern',
  },
  en: {
    headerToolbarLabel:      'Editor actions',
    labelDimensions:         'Label {w} × {h} mm',
    shortcutHint:            '{label} ({keys})',
    panelToggle:             'Settings',
    fullscreenEnter:         'Fullscreen',
    fullscreenExit:          'Exit fullscreen',

    saveIdle:                'Save',
    saveSaved:               'Saved',
    saveSaving:              'Saving…',
    saveRetry:               'Retry',
    saveTitleDirty:          'Save changes',
    saveTitleClean:          'All changes saved',

    exportPngLabel:          'PNG',
    exportPngTitle:          'Save as an image (PNG) in print resolution',
    exportPdfLabel:          'PDF',
    exportPdfTitle:          'Save as a PDF for printing',
    exportFilename:          'wine-label',

    draftSaveFailed:         'The draft is too large for the browser storage. Changes will be lost on reload.',
    imageInsertFailed:       'The image could not be loaded. The file is damaged or the format is not supported.',
    qrInsertFailed:          'The QR code could not be generated. Please check the nutrition info address.',
    exportFailed:            'The export failed. Please try again.',
    dismissHint:             'Dismiss',

    mainToolbarLabel:        'Insert',
    toolImage:               'Image',
    toolImageTitle:          'Upload an image or your finished label',
    toolText:                'Text',
    defaultText:             'New text',
    toolRect:                'Rectangle',
    toolCircle:              'Circle',
    toolLine:                'Line',
    toolInsertTitle:         'Insert {name}',

    contextToolbarLabel:     'Selected element',
    contextEmpty:            'Click an element on the label to edit it.',
    toolCrop:                'Crop',
    toolReplace:             'Replace',
    contextFill:             'Fill',
    contextStroke:           'Border',
    contextStrokeWidth:      'Width',
    contextCornerRadius:     'Corners',
    contextCenterH:          'Centre horizontally on the label',
    contextCenterV:          'Centre vertically on the label',

    canvasLabel:             'Label canvas. The elements on it are listed in the layer list.',
    zoomFit:                 'Fit',
    zoomFitTitle:            'Show the whole label',
    zoomLevel:               'Zoom {percent} %',

    panelLabel:              'Label settings',
    sectionWineData:         'Wine data',
    sectionBackground:       'Background',
    sectionTemplates:        'Templates',
    sectionLayers:           'Layers',
    sectionGeometry:         'Position & size',

    templateClassicName:     'Classic',
    templateModernName:      'Modern',
    templateMinimalName:     'Minimal',
    templateRusticName:      'Rustic',
    templateBoldName:        'Bold',
    templatesHint:           'A template replaces the content of the label. The wine data is filled in.',
    templatesConfirm:        'Replace content?',

    propsWidth:              'W',
    propsHeight:             'H',
    propsRotation:           'Rotation',
    propsOpacity:            'Opacity',
    propsEmpty:              'Select an element to see its position and size.',

    bgModeLabel:             'Background type',
    bgModeColor:             'Colour',
    bgModeImage:             'Image',
    bgFill:                  'Paper colour',
    bgFillTitle:             'Choose the paper colour',
    bgImageReplace:          'Choose another image',

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

    hotkeyUndoLabel:         'Undo',
    hotkeyUndoDescription:   'Reverse the last change',
    hotkeyRedoLabel:         'Redo',
    hotkeyRedoDescription:   'Reapply a reversed change',
    hotkeyDeleteLabel:       'Delete',
    hotkeyDeleteDescription: 'Remove the selected element',
    hotkeySelectAllLabel:    'Select all',
    hotkeySelectAllDescription: 'Select all visible, unlocked elements',
    hotkeyDeselectLabel:     'Deselect',
    hotkeyDeselectDescription: 'Clear the selection; with nothing selected, leave fullscreen',
    hotkeyDuplicateLabel:    'Duplicate',
    hotkeyDuplicateDescription: 'Copy the selected elements with a small offset',
    hotkeyPanLabel:          'Pan (hold)',
    hotkeyPanDescription:    'Hold Space and drag',
    hotkeyZoomInLabel:       'Zoom in',
    hotkeyZoomInDescription: 'Magnify the view',
    hotkeyZoomOutLabel:      'Zoom out',
    hotkeyZoomOutDescription: 'Shrink the view',
  },
} as const satisfies ComponentMessages<CellarCanvasMessages>
