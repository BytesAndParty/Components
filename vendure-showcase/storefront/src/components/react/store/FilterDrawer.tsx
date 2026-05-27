import { useState } from 'react';
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { Filter, X } from 'lucide-react';
import { Checkbox } from '@components/checkbox/checkbox';
import { useStoreFilters } from '@/lib/store-filters';
import type { Facet } from '@/lib/types';

interface Props {
  facets: Facet[];
}

/**
 * Slide-in panel from the right with checkbox groups per facet.
 *
 * The drawer trigger is rendered standalone so it can sit in StoreToolbar
 * alongside the sort dropdown; the dialog body is portalled to <body>.
 */
export function FilterDrawer({ facets }: Props) {
  const [open, setOpen] = useState(false);
  const { activeCount, clearAll } = useStoreFilters();

  return (
    <Dialog.Root open={open} onOpenChange={(d) => setOpen(d.open)}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border border-border bg-card text-foreground hover:border-accent hover:text-accent transition-colors text-sm font-medium"
        >
          <Filter size={16} aria-hidden="true" />
          <span>Filtern</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-accent text-primary-foreground text-xs font-bold tabular-nums">
              {activeCount}
            </span>
          )}
        </button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Positioner className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          <Dialog.Content className="pointer-events-auto w-full max-w-md h-full bg-background border-l border-border shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right">
            <header className="flex items-center justify-between px-6 h-16 border-b border-border shrink-0">
              <Dialog.Title className="text-lg font-bold">Filter</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <button
                  type="button"
                  className="w-9 h-9 grid place-items-center rounded-lg hover:bg-muted transition-colors"
                  aria-label="Schließen"
                >
                  <X size={18} />
                </button>
              </Dialog.CloseTrigger>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">
              {facets.length === 0 ? (
                <p className="text-muted-foreground text-sm">Keine Filter verfügbar.</p>
              ) : (
                facets.map((facet) => <FacetGroup key={facet.id} facet={facet} />)
              )}
            </div>

            <footer className="flex items-center justify-between gap-3 px-6 h-16 border-t border-border shrink-0">
              <button
                type="button"
                onClick={clearAll}
                disabled={activeCount === 0}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline disabled:opacity-50 disabled:no-underline disabled:hover:text-muted-foreground"
              >
                Zurücksetzen
              </button>
              <Dialog.CloseTrigger asChild>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-lg bg-foreground text-background font-semibold text-sm hover:bg-accent hover:text-primary-foreground transition-colors"
                >
                  Schließen
                </button>
              </Dialog.CloseTrigger>
            </footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

function FacetGroup({ facet }: { facet: Facet }) {
  const { isSelected, toggleValue } = useStoreFilters();

  return (
    <fieldset className="space-y-2.5">
      <legend className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">
        {facet.name}
      </legend>
      <ul className="space-y-2">
        {facet.values.map((value) => (
          <li key={value.id}>
            <Checkbox
              checked={isSelected(facet.code, value.code)}
              onChange={() => toggleValue(facet.code, value.code)}
              label={value.name}
            />
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
