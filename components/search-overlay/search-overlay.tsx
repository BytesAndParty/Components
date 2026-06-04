import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { useDesignEngineHotkey } from '../hotkeys/hotkeys-context';
import { cn } from '../lib/utils';
import { useComponentMessages } from '../i18n';
import { MESSAGES, type SearchOverlayMessages } from './messages';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
}

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
  const m = useComponentMessages(MESSAGES, messages);

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
    e.preventDefault();
    close();
  }, {
    label: m.closeLabel,
    description: m.closeDescription,
    category: 'Actions',
  }, { enabled: isOpen });

  // TanStack Query Integration for Search
  const { data: results = [], isLoading } = useQuery({
    queryKey: ['search', query, fetchResults],
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
          className={cn("fixed inset-0 z-999 flex items-start justify-center pt-[15vh] px-4", className)}
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
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-(--border,#2a2a2e) bg-(--card,#141416) shadow-2xl"
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
                className="w-full border-none bg-transparent text-lg text-(--foreground,#e4e4e7) outline-none placeholder:text-(--muted-foreground,#71717a)"
              />
              <div className="ml-2 flex items-center gap-1 rounded border border-(--border,#2a2a2e) bg-(--background,#0a0a0b) px-1.5 py-0.5 text-[10px] font-medium text-(--muted-foreground,#71717a)" aria-hidden="true">
                ESC
              </div>
            </div>

            <div
              id="search-results"
              role="listbox"
              className="custom-scrollbar max-h-[60vh] overflow-y-auto p-2"
            >
              {query.length === 0 && initialSuggestions.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-(--muted-foreground,#71717a)">{m.emptyState}</p>
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
                          ? "bg-(--accent,#6366f1) text-white shadow-lg shadow-accent/20"
                          : "hover:bg-(--border,#2a2a2e) text-(--foreground,#e4e4e7)"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center mr-4 shrink-0",
                        index === selectedIndex ? "bg-white/20" : "bg-(--background,#0a0a0b)"
                      )} aria-hidden="true">
                        {result.icon || (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v20M2 12h20" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="truncate font-semibold">{result.title}</span>
                          <span className={cn(
                            "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded",
                            index === selectedIndex ? "bg-white/20 text-white" : "bg-(--border,#2a2a2e) text-(--muted-foreground,#71717a)"
                          )}>
                            {result.category}
                          </span>
                        </div>
                        {result.description && (
                          <p className={cn(
                            "text-sm line-clamp-1",
                            index === selectedIndex ? "text-white/80" : "text-(--muted-foreground,#71717a)"
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
                  <p className="text-(--muted-foreground,#71717a)">{m.noResults}</p>
                </div>
              )}
            </div>

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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
