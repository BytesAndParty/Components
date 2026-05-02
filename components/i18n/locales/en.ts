/** Global English strings shared across all components. */
export const en = {
  // Common actions
  'action.close':    'Close',
  'action.cancel':   'Cancel',
  'action.confirm':  'Confirm',
  'action.apply':    'Apply',
  'action.delete':   'Delete',
  'action.rename':   'Rename',
  'action.save':     'Save',
  'action.reset':    'Reset',
  'action.search':   'Search',

  // Common states
  'state.loading':   'Loading…',
  'state.error':     'An error occurred.',
  'state.empty':     'No results.',
  'state.optional':  'optional',

  // Accessibility
  'a11y.closeDialog':      'Close dialog',
  'a11y.dragHandle':       'Drag to reorder',
  'a11y.toggleVisibility': 'Toggle visibility',
  'a11y.toggleLock':       'Toggle lock',

  // Search overlay
  'search.placeholder':   'Search…',
  'search.noResults':     'No results found.',
  'search.emptyState':    'Start typing to search…',
  'search.navigate':      'navigate',
  'search.select':        'select',
  'search.shortcutLabel': 'Open search',
  'search.closeLabel':    'Close search',

  // Layer panel
  'layers.deleteLayer':   'Delete layer',
  'layers.renameLayer':   'Rename layer',
  'layers.dragHandle':    'Drag to reorder',
  'layers.visibility':    'Toggle visibility',
  'layers.lock':          'Toggle lock',

  // Image cropper
  'cropper.title':        'Crop Image',
  'cropper.apply':        'Apply Crop',
  'cropper.cancel':       'Cancel',
  'cropper.zoomIn':       'Zoom in',
  'cropper.zoomOut':      'Zoom out',
  'cropper.zoom':         'Zoom',
  'cropper.resetRotation':'Reset rotation',
  'cropper.flipH':        'Flip horizontal',
  'cropper.flipV':        'Flip vertical',
  'cropper.noImage':      'No image selected.',

  // Validator badge
  'validator.compliant':  'EU Compliant',
  'validator.warnings':   '{count} warning{count, plural, one{} other{s}}',
  'validator.errors':     '{count} error{count, plural, one{} other{s}}',
  'validator.close':      'Close',

  // Back to top
  'backToTop.label':      'Scroll to top',
  'backToTop.shortcut':   'Scroll to top',

  // Shortcuts overview
  'shortcuts.title':      'Shortcut Overview',
  'shortcuts.subtitle':   'All active shortcuts on this page',
  'shortcuts.openHint':   'to open',
  'shortcuts.holdHint':   'Hold',
} as const

export type GlobalMessages = typeof en
