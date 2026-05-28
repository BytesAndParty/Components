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
    <div className="py-20 px-6 flex flex-col items-center text-center max-w-lg mx-auto">
      <div className="w-16 h-16 mb-6 grid place-items-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      {body && <p className="text-muted-foreground leading-relaxed mb-6">{body}</p>}
      {cmd && (
        <pre className="w-full mb-6 px-4 py-3 rounded-lg bg-muted text-left text-sm font-mono overflow-x-auto">
          {cmd}
        </pre>
      )}
      {action}
    </div>
  );
}
