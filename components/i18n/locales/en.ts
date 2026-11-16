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

  // Showcase Categories
  'nav.buchart58': 'Buchart58',
  'nav.cards': 'Effects',
  'nav.text': 'Text & Motion',
  'nav.inputs': 'Forms & Feedback',
  'nav.navigation': 'Navigation & Layout',
  'nav.shop': 'Shop',
  'nav.tools': 'Tools',
  'nav.designer': 'Designer',
  'nav.data': 'Data',
  'nav.labor': 'Lab',

  'desc.buchart58': 'Exactly the components the Buchart58 shop uses.',
  'desc.cards': 'Glow effects, magnetic interactions, 3D hover, light and image effects, and animated icons.',
  'desc.text': 'Text animations, highlights, paper elements, and scroll-reactive motion.',
  'desc.inputs': 'Form controls, search interactions, and file uploads, plus toasts, counters, countdown, and confetti.',
  'desc.navigation': 'Navbar, banner, breadcrumbs, scroll progress, theme controls, footer, and view transitions.',
  'desc.shop': 'E-commerce specific components for the wine online shop.',
  'desc.designer': 'Building blocks for the Wine Label Designer: Color Picker, Text Toolbar and more.',
  'desc.data': 'Powerful tables with TanStack Table integration, sorting, and pagination.',
  'desc.labor': 'Playful effects, deliberately not meant for the shop.',
} as const

export type GlobalMessages = { readonly [K in keyof typeof en]: string }
