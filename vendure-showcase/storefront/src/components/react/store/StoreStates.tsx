import { CloudOff, Filter, Grape, Loader2 } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { EmptyState } from '../EmptyState';

export function StoreLoading() {
  const t = useT();
  return (
    <EmptyState
      icon={<Loader2 size={28} className="animate-spin" aria-hidden="true" />}
      title={t.storeLoading}
    />
  );
}

export function StoreError() {
  const t = useT();
  return (
    <EmptyState
      icon={<CloudOff size={28} aria-hidden="true" />}
      title={t.storeErrorTitle}
      body={t.storeErrorBody}
      cmd={t.storeErrorCmd}
    />
  );
}

export function StoreEmpty({ hasFilters, onReset }: { hasFilters: boolean; onReset: () => void }) {
  const t = useT();
  return (
    <EmptyState
      icon={<Grape size={28} aria-hidden="true" />}
      title={t.storeNoResultsTitle}
      body={t.storeNoResultsBody}
      action={
        hasFilters ? (
          <button
            type="button"
            onClick={onReset}
            className="bg-foreground text-background hover:bg-accent hover:text-primary-foreground inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            <Filter size={16} aria-hidden="true" />
            {t.storeNoResultsReset}
          </button>
        ) : null
      }
    />
  );
}
