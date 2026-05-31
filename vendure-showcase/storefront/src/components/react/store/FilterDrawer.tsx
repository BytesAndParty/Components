import { useState } from 'react';
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { Filter, X } from 'lucide-react';
import { Checkbox } from '@components/checkbox/checkbox';
import { useStoreFilters } from '@/lib/store-filters';
import { useT } from '@/lib/i18n';
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
  const t = useT();

  return (
    <Dialog.Root open={open} onOpenChange={(d) => setOpen(d.open)}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="border-border bg-card text-foreground hover:border-accent hover:text-accent inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors"
        >
          <Filter size={16} aria-hidden="true" />
          <span>{t.filterButton}</span>
          {activeCount > 0 && (
            <span className="bg-accent text-primary-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold tabular-nums">
              {activeCount}
            </span>
          )}
        </button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <Dialog.Positioner className="pointer-events-none fixed inset-0 z-50 flex justify-end">
          <Dialog.Content className="bg-background border-border data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right pointer-events-auto flex h-full w-full max-w-md flex-col border-l shadow-2xl">
            <header className="border-border flex h-16 shrink-0 items-center justify-between border-b px-6">
              <Dialog.Title className="text-lg font-bold">{t.filterTitle}</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <button
                  type="button"
                  className="hover:bg-muted grid h-9 w-9 place-items-center rounded-lg transition-colors"
                  aria-label={t.filterClose}
                >
                  <X size={18} />
                </button>
              </Dialog.CloseTrigger>
            </header>

            <div className="flex-1 space-y-7 overflow-y-auto px-6 py-5">
              {facets.length === 0 ? (
                <p className="text-muted-foreground text-sm">{t.filterEmpty}</p>
              ) : (
                facets.map((facet) => <FacetGroup key={facet.id} facet={facet} />)
              )}
            </div>

            <footer className="border-border flex h-16 shrink-0 items-center justify-between gap-3 border-t px-6">
              <button
                type="button"
                onClick={clearAll}
                disabled={activeCount === 0}
                className="text-muted-foreground hover:text-foreground disabled:hover:text-muted-foreground text-sm underline-offset-4 transition-colors hover:underline disabled:no-underline disabled:opacity-50"
              >
                {t.filterReset}
              </button>
              <Dialog.CloseTrigger asChild>
                <button
                  type="button"
                  className="bg-foreground text-background hover:bg-accent hover:text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
                >
                  {t.filterClose}
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
      <legend className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
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
