import { useState, useEffect, useRef } from 'react';
import { Dialog } from '@ark-ui/react/dialog';
import { Combobox } from '@ark-ui/react/combobox';
import { createListCollection } from '@ark-ui/react/collection';
import { Portal } from '@ark-ui/react/portal';
import { useQuery } from '@tanstack/react-query';
import { useDesignEngineHotkey } from '../hotkeys/hotkeys-context';
import { cn } from '../lib/utils';
import { useOverlayContainer } from '../lib/overlay-container';
import { useComponentMessages } from '../i18n';
import { MESSAGES, type SearchOverlayMessages } from './messages';

export interface SearchResult {
  id: string;
  title: string;
  category: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface SearchOverlayProps {
  /**
   * Search function that returns a promise of results.
   */
  fetchResults?: (query: string) => Promise<SearchResult[]>;
  /** Initial/static results for the "empty" state or suggestions */
  initialSuggestions?: SearchResult[];
  /**
   * Called when a result is chosen (click or Enter). Use it for client-side routing.
   * Without it, the overlay navigates to `result.href`.
   */
  onSelect?: (result: SearchResult) => void;
  messages?: Partial<SearchOverlayMessages>;
  className?: string;
}

const STYLE_ID = '__search-overlay-styles__';

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  // The panel's overshooting ease stands in for the former spring.
  el.textContent = `
    @keyframes search-overlay-backdrop-in { from { opacity: 0; } }
    @keyframes search-overlay-backdrop-out { to { opacity: 0; } }
    @keyframes search-overlay-panel-in {
      from { opacity: 0; transform: translateY(-20px) scale(0.95); }
    }
    @keyframes search-overlay-panel-out {
      to { opacity: 0; transform: translateY(-20px) scale(0.95); }
    }
    .search-overlay-backdrop[data-state="open"] { animation: search-overlay-backdrop-in 0.2s ease-out; }
    .search-overlay-backdrop[data-state="closed"] { animation: search-overlay-backdrop-out 0.15s ease-in forwards; }
    .search-overlay-panel[data-state="open"] { animation: search-overlay-panel-in 0.3s cubic-bezier(0.32, 1.25, 0.6, 1); }
    .search-overlay-panel[data-state="closed"] { animation: search-overlay-panel-out 0.15s ease-in forwards; }
    @media (prefers-reduced-motion: reduce) {
      .search-overlay-backdrop, .search-overlay-panel { animation: none !important; }
    }
  `;
  document.head.appendChild(el);
}

export function SearchOverlay({
  fetchResults,
  initialSuggestions = [],
  onSelect,
  messages,
  className
}: SearchOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  // Tracks the list highlight so Enter can fall back to the first result when it was cleared.
  const highlightedId = useRef<string | null>(null);
  const overlayContainer = useOverlayContainer();
  const m = useComponentMessages(MESSAGES, messages);

  useEffect(() => { injectStyles(); }, []);

  function close() {
    setIsOpen(false);
    setQuery('');
  }

  function select(result: SearchResult) {
    close();
    if (onSelect) onSelect(result);
    else window.location.assign(result.href);
  }

  // TanStack Hotkeys Integration via Design Engine Registry.
  // Escape is handled by the dialog itself.
  useDesignEngineHotkey('Mod+K', (e: KeyboardEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setIsOpen(true);
  }, {
    label: m.shortcutLabel,
    description: m.searchDescription,
    category: 'Global'
  });

  // TanStack Query Integration for Search
  const { data: results = [], isLoading } = useQuery({
    queryKey: ['search', query, fetchResults],
    queryFn: () => fetchResults ? fetchResults(query) : Promise.resolve([]),
    enabled: query.length > 0,
    staleTime: 1000 * 60, // 1 minute cache
  });

  const displayResults = query.length > 0 ? results : initialSuggestions;

  // Results come from fetchResults, so the combobox does no filtering itself.
  const collection = createListCollection<SearchResult>({
    items: displayResults,
    itemToValue: (result) => result.id,
    itemToString: (result) => result.title,
  });

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => { if (!details.open) close(); }}
      initialFocusEl={() => inputRef.current}
      aria-label={m.ariaLabel}
      lazyMount
      unmountOnExit
    >
      <Portal container={overlayContainer}>
        <Dialog.Backdrop className="search-overlay-backdrop fixed inset-0 z-999 bg-black/40 backdrop-blur-md" />
        <Dialog.Positioner className={cn("fixed inset-0 z-999 flex items-start justify-center pt-[15vh] px-4", className)}>
          {/* Search Palette */}
          <Dialog.Content className="search-overlay-panel relative w-full max-w-2xl overflow-hidden rounded-2xl border border-(--border,#2a2a2e) bg-(--card,#141416) shadow-2xl outline-none">
            {/* Always open, rendered inline. disableLayer: Escape and outside
                clicks belong to the dialog, not to the list. */}
            <Combobox.Root
              collection={collection}
              open
              inputValue={query}
              onInputValueChange={(details) => setQuery(details.inputValue)}
              value={[]}
              onValueChange={(details) => {
                const result = details.items[0];
                if (result) select(result);
              }}
              allowCustomValue
              selectionBehavior="preserve"
              inputBehavior="autohighlight"
              defaultHighlightedValue={displayResults[0]?.id ?? null}
              onHighlightChange={(details) => { highlightedId.current = details.highlightedValue; }}
              disableLayer
            >
              <div className="flex items-center border-b border-(--border,#2a2a2e) px-4 py-4">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={cn("mr-3", isLoading ? "animate-pulse text-accent" : "text-(--muted-foreground,#71717a)")}
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <Combobox.Input
                  ref={inputRef}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && highlightedId.current === null && displayResults[0]) {
                      e.preventDefault();
                      select(displayResults[0]);
                    }
                  }}
                  placeholder={m.placeholder}
                  className="w-full border-none bg-transparent text-lg text-(--foreground,#e4e4e7) outline-none placeholder:text-(--muted-foreground,#71717a)"
                />
                <div className="ml-2 flex items-center gap-1 rounded border border-(--border,#2a2a2e) bg-(--background,#0a0a0b) px-1.5 py-0.5 text-[10px] font-medium text-(--muted-foreground,#71717a)" aria-hidden="true">
                  ESC
                </div>
              </div>

              <Combobox.Content className="custom-scrollbar max-h-[60vh] overflow-y-auto p-2">
                {query.length === 0 && initialSuggestions.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-(--muted-foreground,#71717a)">{m.emptyState}</p>
                  </div>
                ) : displayResults.length > 0 ? (
                  <div className="space-y-1">
                    {displayResults.map((result: SearchResult) => (
                      <Combobox.Item
                        key={result.id}
                        item={result}
                        className="group/option flex w-full items-center rounded-xl px-4 py-3 text-left text-(--foreground,#e4e4e7) outline-none transition-all duration-200 data-highlighted:bg-(--accent,#6366f1) data-highlighted:text-white data-highlighted:shadow-lg data-highlighted:shadow-accent/20"
                      >
                        <div className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--background,#0a0a0b) group-data-highlighted/option:bg-white/20" aria-hidden="true">
                          {result.icon || (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2v20M2 12h20" />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="truncate font-semibold">{result.title}</span>
                            <span className="rounded bg-(--border,#2a2a2e) px-1.5 py-0.5 text-[10px] tracking-wider text-(--muted-foreground,#71717a) uppercase group-data-highlighted/option:bg-white/20 group-data-highlighted/option:text-white">
                              {result.category}
                            </span>
                          </div>
                          {result.description && (
                            <p className="line-clamp-1 text-sm text-(--muted-foreground,#71717a) group-data-highlighted/option:text-white/80">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </Combobox.Item>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-12 text-center">
                    <p className="text-(--muted-foreground,#71717a)">{m.noResults}</p>
                  </div>
                )}
              </Combobox.Content>
            </Combobox.Root>

            <div className="flex items-center justify-between border-t border-(--border,#2a2a2e) bg-(--background,#0a0a0b)/50 px-4 py-3 text-[11px] text-(--muted-foreground,#71717a)">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-(--border,#2a2a2e) bg-(--card,#141416) px-1 py-0.5 text-[9px]" aria-hidden="true">ENTER</kbd>
                  {m.selectionHelp}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-(--border,#2a2a2e) bg-(--card,#141416) px-1 py-0.5 text-[9px]" aria-hidden="true">↑↓</kbd>
                  {m.navigationHelp}
                </span>
              </div>
              <div className="opacity-50">
                Design Engine v2.0
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
