import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { useDesignEngineHotkey } from '../hotkeys/hotkeys-provider';
import { cn } from '../lib/utils';
import { useComponentMessages } from '../i18n';
import type { ComponentMessages } from '../i18n';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
}

export type SearchOverlayMessages = {
  placeholder: string;
  noResults: string;
  emptyState: string;
  navigationHelp: string;
  selectionHelp: string;
  shortcutLabel: string;
  closeLabel: string;
  ariaLabel: string;
  searchDescription: string;
  closeDescription: string;
};

const SEARCH_OVERLAY_MESSAGES = {
  de: {
    placeholder: 'Suche nach Produkten oder Seiten…',
    noResults: 'Keine Ergebnisse gefunden.',
    emptyState: 'Tippe etwas ein, um die Suche zu starten…',
    navigationHelp: 'navigieren',
    selectionHelp: 'auswählen',
    shortcutLabel: 'Suche öffnen',
    closeLabel: 'Suche schließen',
    ariaLabel: 'Spotlight Suche',
    searchDescription: 'Öffnet die globale Spotlight-Suche',
    closeDescription: 'Schließt das aktuelle Overlay',
  },
  en: {
    placeholder: 'Search for products or pages…',
    noResults: 'No results found.',
    emptyState: 'Start typing to search…',
    navigationHelp: 'navigate',
    selectionHelp: 'select',
    shortcutLabel: 'Open search',
    closeLabel: 'Close search',
    ariaLabel: 'Spotlight Search',
    searchDescription: 'Opens the global spotlight search',
    closeDescription: 'Closes the current overlay',
  },
} as const satisfies ComponentMessages<SearchOverlayMessages>;

interface SearchOverlayProps {
  /**
   * Search function that returns a promise of results.
   */
  fetchResults?: (query: string) => Promise<SearchResult[]>;
  /** Initial/static results for the "empty" state or suggestions */
  initialSuggestions?: SearchResult[];
  messages?: Partial<SearchOverlayMessages>;
  className?: string;
}

export function SearchOverlay({
  fetchResults,
  initialSuggestions = [],
  messages,
  className
}: SearchOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const m = useComponentMessages(SEARCH_OVERLAY_MESSAGES, messages);

  // Open/Close logic
  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }

  // TanStack Hotkeys Integration via Design Engine Registry
  useDesignEngineHotkey('Mod+K', (e: KeyboardEvent | React.KeyboardEvent) => {
    e.preventDefault();
    open();
  }, {
    label: m.shortcutLabel,
    description: m.searchDescription,
    category: 'Global'
  });

  useDesignEngineHotkey('Escape', (e: KeyboardEvent | React.KeyboardEvent) => {
    if (isOpen) {
      e.preventDefault();
      close();
    }
  }, {
    label: m.closeLabel,
    description: m.closeDescription,
    category: 'Actions'
  });

  // TanStack Query Integration for Search
  const { data: results = [], isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => fetchResults ? fetchResults(query) : Promise.resolve([]),
    enabled: query.length > 0,
    staleTime: 1000 * 60, // 1 minute cache
  });

  const displayResults = query.length > 0 ? results : initialSuggestions;

  // Focus and Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev: number) => (prev + 1) % Math.max(1, displayResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev: number) => (prev - 1 + displayResults.length) % Math.max(1, displayResults.length));
    } else if (e.key === 'Enter') {
      if (displayResults[selectedIndex]) {
        console.log('Navigating to:', displayResults[selectedIndex].href);
        close();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={cn("fixed inset-0 z-[999] flex items-start justify-center pt-[15vh] px-4", className)}
          role="dialog"
          aria-modal="true"
          aria-label={m.ariaLabel}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Search Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[var(--card,#141416)] border border-[var(--border,#2a2a2e)] rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center px-4 py-4 border-b border-[var(--border,#2a2a2e)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={cn("mr-3", isLoading ? "animate-pulse text-[var(--accent)]" : "text-[var(--muted-foreground,#71717a)]")}
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={displayResults.length > 0}
                aria-controls="search-results"
                aria-autocomplete="list"
                placeholder={m.placeholder}
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none text-lg text-[var(--foreground,#e4e4e7)] placeholder:text-[var(--muted-foreground,#71717a)]"
              />
              <div className="flex items-center gap-1 ml-2 px-1.5 py-0.5 border border-[var(--border,#2a2a2e)] rounded bg-[var(--background,#0a0a0b)] text-[10px] text-[var(--muted-foreground,#71717a)] font-medium" aria-hidden="true">
                ESC
              </div>
            </div>

            <div
              id="search-results"
              role="listbox"
              className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2"
            >
              {query.length === 0 && initialSuggestions.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-[var(--muted-foreground,#71717a)] text-sm">{m.emptyState}</p>
                </div>
              ) : displayResults.length > 0 ? (
                <div className="space-y-1">
                  {displayResults.map((result: SearchResult, index: number) => (
                    <button
                      key={result.id}
                      id={`result-item-${index}`}
                      role="option"
                      aria-selected={index === selectedIndex}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => {
                        console.log('Selected:', result);
                        close();
                      }}
                      className={cn(
                        "w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-left outline-none",
                        index === selectedIndex
                          ? "bg-[var(--accent,#6366f1)] text-white shadow-lg shadow-[var(--accent)]/20"
                          : "hover:bg-[var(--border,#2a2a2e)] text-[var(--foreground,#e4e4e7)]"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center mr-4 shrink-0",
                        index === selectedIndex ? "bg-white/20" : "bg-[var(--background,#0a0a0b)]"
                      )} aria-hidden="true">
                        {result.icon || (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v20M2 12h20" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold truncate">{result.title}</span>
                          <span className={cn(
                            "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded",
                            index === selectedIndex ? "bg-white/20 text-white" : "bg-[var(--border,#2a2a2e)] text-[var(--muted-foreground,#71717a)]"
                          )}>
                            {result.category}
                          </span>
                        </div>
                        {result.description && (
                          <p className={cn(
                            "text-sm line-clamp-1",
                            index === selectedIndex ? "text-white/80" : "text-[var(--muted-foreground,#71717a)]"
                          )}>
                            {result.description}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-12 text-center">
                  <p className="text-[var(--muted-foreground,#71717a)]">{m.noResults}</p>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-[var(--border,#2a2a2e)] bg-[var(--background,#0a0a0b)]/50 flex items-center justify-between text-[11px] text-[var(--muted-foreground,#71717a)]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 border border-[var(--border,#2a2a2e)] rounded bg-[var(--card,#141416)] text-[9px]" aria-hidden="true">ENTER</kbd>
                  {m.selectionHelp}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 border border-[var(--border,#2a2a2e)] rounded bg-[var(--card,#141416)] text-[9px]" aria-hidden="true">↑↓</kbd>
                  {m.navigationHelp}
                </span>
              </div>
              <div className="opacity-50">
                Design Engine v2.0
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
