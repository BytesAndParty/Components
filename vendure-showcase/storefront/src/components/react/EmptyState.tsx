/**
 * Storefront-wide "nothing here / something went wrong" panel.
 *
 * Same shape across loading, server-down, empty-cart, no-results,
 * not-found: rounded icon halo, title, body, optional command hint
 * for dev troubleshooting, optional action.
 */
import type { ReactNode } from 'react';

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  body?: string;
  /** Monospace command hint (e.g. how to start the server). */
  cmd?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, body, cmd, action }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-20 text-center">
      <div className="bg-muted text-muted-foreground mb-6 grid h-16 w-16 place-items-center rounded-full">
        {icon}
      </div>
      <h2 className="mb-3 text-2xl font-bold">{title}</h2>
      {body && <p className="text-muted-foreground mb-6 leading-relaxed">{body}</p>}
      {cmd && (
        <pre className="bg-muted mb-6 w-full overflow-x-auto rounded-lg px-4 py-3 text-left font-mono text-sm">
          {cmd}
        </pre>
      )}
      {action}
    </div>
  );
}
