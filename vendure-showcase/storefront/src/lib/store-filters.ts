/**
 * Store-Filter-State + Daten.
 *
 * URL ist die Single Source of Truth:
 *   ?farbe=rotwein,weisswein&region=wachau&sort=price-asc
 *
 * Filter-Semantik:
 *   - innerhalb einer Facet-Dimension verknüpft mit OR (`farbe=rot,weiss` = rot ODER weiß)
 *   - zwischen Dimensionen verknüpft mit AND (`farbe=rot & region=wachau` = beides)
 *
 * Wir filtern client-seitig — bei 8–50 Weinen ist das billiger als ein zweiter
 * Round-Trip pro Filter-Toggle. Ab ~hunderten Produkten auf Vendure `search`
 * mit `facetValueFilters` umsteigen.
 */
// eslint-disable-next-line no-restricted-imports -- useCallback needed for stable store subscribe identity (useSyncExternalStore contract).
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { useQuery } from '@tanstack/react-query';
import { vendureClient } from './vendure-client';
import { GET_FACETS, GET_PRODUCT, GET_PRODUCTS } from './queries';
import type { Facet, Product } from './types';

// ── URL state ────────────────────────────────────────────────────────────────

export type SortKey = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';
export const DEFAULT_SORT: SortKey = 'name-asc';

const SORT_KEYS: ReadonlySet<SortKey> = new Set(['name-asc', 'name-desc', 'price-asc', 'price-desc']);
const SORT_KEY_PARAM = 'sort';

export interface StoreFilterState {
  /** facetCode → Set of selected facetValueCodes */
  selected: Map<string, Set<string>>;
  sort: SortKey;
}

function emptyState(): StoreFilterState {
  return { selected: new Map(), sort: DEFAULT_SORT };
}

function parseSearch(search: string): StoreFilterState {
  if (!search) return emptyState();
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const selected = new Map<string, Set<string>>();
  let sort: SortKey = DEFAULT_SORT;

  for (const [key, value] of params) {
    if (key === SORT_KEY_PARAM) {
      if (SORT_KEYS.has(value as SortKey)) sort = value as SortKey;
      continue;
    }
    const codes = value.split(',').map(s => s.trim()).filter(Boolean);
    if (codes.length) selected.set(key, new Set(codes));
  }
  return { selected, sort };
}

function serializeState(state: StoreFilterState): string {
  const params = new URLSearchParams();
  for (const [facetCode, valueCodes] of state.selected) {
    if (!valueCodes.size) continue;
    params.set(facetCode, [...valueCodes].join(','));
  }
  if (state.sort !== DEFAULT_SORT) params.set(SORT_KEY_PARAM, state.sort);
  const s = params.toString();
  return s ? `?${s}` : '';
}

// ── External store: window.location ──────────────────────────────────────────
//
// useSyncExternalStore is the idiomatic React 19 way to subscribe to an
// external mutable source. We treat window.location.search as that source:
// pushState/replaceState don't fire popstate, so we dispatch a custom event
// when we write, and listen to both popstate (back/forward) and our event.

const STORE_FILTER_EVENT = 'store-filter-change';

function subscribe(onChange: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('popstate', onChange);
  window.addEventListener(STORE_FILTER_EVENT, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(STORE_FILTER_EVENT, onChange);
  };
}

function getSnapshot(): string {
  if (typeof window === 'undefined') return '';
  return window.location.search;
}

function getServerSnapshot(): string {
  return '';
}

function writeSearch(search: string) {
  const url = new URL(window.location.href);
  url.search = search;
  window.history.replaceState(null, '', url.toString());
  window.dispatchEvent(new Event(STORE_FILTER_EVENT));
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export interface UseStoreFiltersReturn {
  state: StoreFilterState;
  toggleValue: (facetCode: string, valueCode: string) => void;
  removeValue: (facetCode: string, valueCode: string) => void;
  clearFacet: (facetCode: string) => void;
  clearAll: () => void;
  setSort: (sort: SortKey) => void;
  isSelected: (facetCode: string, valueCode: string) => boolean;
  activeCount: number;
}

export function useStoreFilters(): UseStoreFiltersReturn {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const state = parseSearch(search);

  const update = useCallback((mutate: (next: StoreFilterState) => void) => {
    const next: StoreFilterState = {
      selected: new Map(parseSearch(window.location.search).selected),
      sort: parseSearch(window.location.search).sort,
    };
    mutate(next);
    writeSearch(serializeState(next));
  }, []);

  const toggleValue = useCallback((facetCode: string, valueCode: string) => {
    update(next => {
      const cur = next.selected.get(facetCode) ?? new Set<string>();
      if (cur.has(valueCode)) cur.delete(valueCode);
      else cur.add(valueCode);
      if (cur.size === 0) next.selected.delete(facetCode);
      else next.selected.set(facetCode, cur);
    });
  }, [update]);

  const removeValue = useCallback((facetCode: string, valueCode: string) => {
    update(next => {
      const cur = next.selected.get(facetCode);
      if (!cur) return;
      cur.delete(valueCode);
      if (cur.size === 0) next.selected.delete(facetCode);
    });
  }, [update]);

  const clearFacet = useCallback((facetCode: string) => {
    update(next => { next.selected.delete(facetCode); });
  }, [update]);

  const clearAll = useCallback(() => {
    update(next => { next.selected.clear(); next.sort = DEFAULT_SORT; });
  }, [update]);

  const setSort = useCallback((sort: SortKey) => {
    update(next => { next.sort = sort; });
  }, [update]);

  const isSelected = useCallback((facetCode: string, valueCode: string) => {
    return state.selected.get(facetCode)?.has(valueCode) ?? false;
  }, [state.selected]);

  let activeCount = 0;
  for (const values of state.selected.values()) activeCount += values.size;

  return { state, toggleValue, removeValue, clearFacet, clearAll, setSort, isSelected, activeCount };
}

// ── Data hooks ───────────────────────────────────────────────────────────────

export function useFacets(initial?: Facet[]) {
  return useQuery({
    queryKey: ['facets'],
    queryFn: async () => {
      const result = await vendureClient.query(GET_FACETS, {}).toPromise();
      if (result.error) throw new Error(result.error.message);
      return (result.data?.facets?.items ?? []) as Facet[];
    },
    initialData: initial,
    staleTime: 5 * 60 * 1000, // facets ändern sich selten
  });
}

export function useProducts(initial?: Product[]) {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const result = await vendureClient.query(GET_PRODUCTS, {}).toPromise();
      if (result.error) throw new Error(result.error.message);
      return (result.data?.products?.items ?? []) as Product[];
    },
    initialData: initial,
    staleTime: 60 * 1000,
  });
}

export function useProduct(slug: string, initial?: Product | null) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const result = await vendureClient.query(GET_PRODUCT, { slug }).toPromise();
      if (result.error) throw new Error(result.error.message);
      return (result.data?.product ?? null) as Product | null;
    },
    initialData: initial ?? undefined,
    staleTime: 60 * 1000,
    enabled: Boolean(slug),
  });
}

// ── Filter + Sort ────────────────────────────────────────────────────────────

export function applyFilters(products: Product[], state: StoreFilterState): Product[] {
  let result = products;

  if (state.selected.size) {
    result = result.filter(p => {
      // AND across facet dimensions
      for (const [facetCode, valueCodes] of state.selected) {
        const productCodesInFacet = new Set(
          p.facetValues.filter(fv => fv.facet.code === facetCode).map(fv => fv.code),
        );
        // OR within dimension — at least one selected value must match
        let anyMatch = false;
        for (const code of valueCodes) {
          if (productCodesInFacet.has(code)) { anyMatch = true; break; }
        }
        if (!anyMatch) return false;
      }
      return true;
    });
  }

  const sorted = [...result];
  switch (state.sort) {
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'de'));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name, 'de'));
      break;
    case 'price-asc':
      sorted.sort((a, b) => firstVariantPrice(a) - firstVariantPrice(b));
      break;
    case 'price-desc':
      sorted.sort((a, b) => firstVariantPrice(b) - firstVariantPrice(a));
      break;
  }
  return sorted;
}

function firstVariantPrice(p: Product): number {
  return p.variants[0]?.priceWithTax ?? 0;
}

// ── Helper: hydrate initial URL on mount ─────────────────────────────────────
//
// useSyncExternalStore returns getServerSnapshot()='' during SSR, then re-
// reads from window after mount. That triggers one extra render. This is
// intentional — the alternative (reading window directly in render) breaks
// hydration. Components that don't want the empty flash can read URL inside
// useEffect themselves or accept the 1-frame mismatch.

export function useHydrateOnMount() {
  useEffect(() => {
    window.dispatchEvent(new Event(STORE_FILTER_EVENT));
  }, []);
}
