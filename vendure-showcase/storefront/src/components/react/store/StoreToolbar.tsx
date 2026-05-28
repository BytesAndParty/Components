import { useStoreFilters, type SortKey } from '@/lib/store-filters';
import { useT, format } from '@/lib/i18n';
import { FilterDrawer } from './FilterDrawer';
import type { Facet } from '@/lib/types';

interface Props {
  facets: Facet[];
  totalCount: number;
  filteredCount: number;
}

export function StoreToolbar({ facets, totalCount, filteredCount }: Props) {
  const { state, setSort } = useStoreFilters();
  const t = useT();
  const showFilteredCount = filteredCount !== totalCount;

  const sortOptions: ReadonlyArray<{ key: SortKey; label: string }> = [
    { key: 'name-asc', label: t.sortNameAsc },
    { key: 'name-desc', label: t.sortNameDesc },
    { key: 'price-asc', label: t.sortPriceAsc },
    { key: 'price-desc', label: t.sortPriceDesc },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      <p className="text-muted-foreground text-sm tabular-nums">
        {showFilteredCount
          ? format(t.countFiltered, { filtered: filteredCount, total: totalCount })
          : format(t.countTotal, { count: totalCount })}
      </p>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t.sortLabel}:</span>
          <select
            value={state.sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-10 px-3 pr-8 rounded-lg border border-border bg-card text-foreground text-sm hover:border-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {sortOptions.map((opt) => (
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
