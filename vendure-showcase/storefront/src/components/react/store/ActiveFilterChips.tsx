import type { Facet } from '@/lib/types';
import { useStoreFilters } from '@/lib/store-filters';
import { useT, format } from '@/lib/i18n';

interface Props {
  facets: Facet[];
}

/**
 * Compact chip-strip showing the currently active filter values.
 * Clicking a chip removes that single value; "Zurücksetzen" clears all.
 * Hidden entirely when no filters are active.
 */
export function ActiveFilterChips({ facets }: Props) {
  const { state, removeValue, clearAll, activeCount } = useStoreFilters();
  const t = useT();

  if (activeCount === 0) return null;

  // Look up display names for each (facetCode, valueCode) pair
  const chips: Array<{ facetCode: string; valueCode: string; label: string }> = [];
  for (const [facetCode, valueCodes] of state.selected) {
    const facet = facets.find(f => f.code === facetCode);
    for (const valueCode of valueCodes) {
      const value = facet?.values.find(v => v.code === valueCode);
      chips.push({
        facetCode,
        valueCode,
        label: value?.name ?? valueCode,
      });
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      {chips.map(chip => (
        <button
          key={`${chip.facetCode}:${chip.valueCode}`}
          type="button"
          onClick={() => removeValue(chip.facetCode, chip.valueCode)}
          className="bg-muted text-foreground border-border hover:border-accent hover:text-accent inline-flex items-center gap-1.5 rounded-full border py-1 pr-2 pl-3 text-sm transition-colors"
          aria-label={format(t.filterChipRemove, { name: chip.label })}
        >
          <span>{chip.label}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M3 3l8 8M11 3l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={clearAll}
          className="text-muted-foreground hover:text-foreground ml-2 text-sm underline-offset-4 transition-colors hover:underline"
        >
          {t.filterReset}
        </button>
      )}
    </div>
  );
}
