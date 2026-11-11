/**
 * Shared look of the editor's small buttons (header, context bar, zoom bar):
 * 36 px, 44 px for coarse pointers, a visible focus ring and a slight press.
 */
export const barButtonCls =
  'text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-accent/60 inline-flex h-9 min-w-9 shrink-0 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium transition-[color,background-color,transform] focus-visible:ring-2 focus-visible:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-40 pointer-coarse:min-h-11 pointer-coarse:min-w-11'

/** Thin vertical rule between button groups. */
export const barDividerCls = 'bg-border mx-1 h-5 w-px shrink-0'
