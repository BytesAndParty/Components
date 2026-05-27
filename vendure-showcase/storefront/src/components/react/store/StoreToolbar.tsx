import { useStoreFilters, type SortKey } from '@/lib/store-filters';
import { FilterDrawer } from './FilterDrawer';
import type { Facet } from '@/lib/types';

interface Props {
  facets: Facet[];
  totalCount: number;
  filteredCount: number;
}

const SORT_OPTIONS: ReadonlyArray<{ key: SortKey; label: string }> = [
  { key: 'name-asc', label: 'Name A → Z' },
  { key: 'name-desc', label: 'Name Z → A' },
  { key: 'price-asc', label: 'Preis aufsteigend' },
  { key: 'price-desc', label: 'Preis absteigend' },
];

export function StoreToolbar({ facets, totalCount, filteredCount }: Props) {
  const { state, setSort } = useStoreFilters();
  const showFilteredCount = filteredCount !== totalCount;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      <p className="text-muted-foreground text-sm tabular-nums">
        {showFilteredCount ? (
          <>
            <span className="text-foreground font-medium">{filteredCount}</span> von {totalCount} Weinen
          </>
        ) : (
          <>
            <span className="text-foreground font-medium">{totalCount}</span> Weine
          </>
        )}
      </p>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Sortieren:</span>
          <select
            value={state.sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-10 px-3 pr-8 rounded-lg border border-border bg-card text-foreground text-sm hover:border-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <FilterDrawer facets={facets} />
      </div>
    </div>
  );
}
