import { ChevronRight, MoreHorizontal } from 'lucide-react';
import * as React from 'react';
import { useEffect, createContext, useContext } from 'react';
import { useComponentMessages } from '../i18n';
import type { ComponentMessages } from '../i18n';

const STYLE_ID = 'breadcrumb-styles';

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .bc-link {
      position: relative;
      transition: color 0.18s ease;
    }
    .bc-link::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -1px;
      width: 0;
      height: 1px;
      background: var(--accent, oklch(0.7 0.15 250));
      transition: width 0.22s ease;
    }
    .bc-link:hover {
      color: var(--foreground, #e4e4e7);
    }
    .bc-link:hover::after {
      width: 100%;
    }
  `;
  document.head.appendChild(style);
}

// ─── Context ────────────────────────────────────────────────────────────────────

interface BreadcrumbContextValue {
  messages: BreadcrumbMessages;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

function useBreadcrumb() {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) throw new Error('useBreadcrumb must be used within <Breadcrumb>');
  return ctx;
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export type BreadcrumbMessages = {
  ariaLabel: string;
  more: string;
};

const BREADCRUMB_MESSAGES = {
  de: {
    ariaLabel: 'Brotkrumen-Navigation',
    more: 'Mehr',
  },
  en: {
    ariaLabel: 'Breadcrumb navigation',
    more: 'More',
  },
} as const satisfies ComponentMessages<BreadcrumbMessages>;

export interface BreadcrumbProps extends React.ComponentProps<'nav'> {
  messages?: Partial<BreadcrumbMessages>;
}

export function Breadcrumb({
  style,
  messages,
  ...props
}: BreadcrumbProps): React.ReactElement {
  const m = useComponentMessages(BREADCRUMB_MESSAGES, messages);

  return (
    <BreadcrumbContext.Provider value={{ messages: m }}>
      <nav aria-label={m.ariaLabel} data-slot="breadcrumb" style={style} {...props} />
    </BreadcrumbContext.Provider>
  );
}

export function BreadcrumbList({
  style,
  ...props
}: React.ComponentProps<'ol'>): React.ReactElement {
  return (
    <ol
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        color: 'var(--muted-foreground, #71717a)',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        ...style,
      }}
      data-slot="breadcrumb-list"
      {...props}
    />
  );
}

export function BreadcrumbItem({
  style,
  ...props
}: React.ComponentProps<'li'>): React.ReactElement {
  return (
    <li
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        ...style,
      }}
      data-slot="breadcrumb-item"
      {...props}
    />
  );
}

export function BreadcrumbLink({
  style,
  ...props
}: React.ComponentProps<'a'>): React.ReactElement {
  useEffect(() => { injectStyles(); }, []);

  return (
    <a
      className="bc-link"
      style={{
        color: 'inherit',
        textDecoration: 'none',
        cursor: 'pointer',
        ...style,
      }}
      data-slot="breadcrumb-link"
      {...props}
    />
  );
}

export function BreadcrumbPage({
  style,
  ...props
}: React.ComponentProps<'span'>): React.ReactElement {
  return (
    <span
      aria-current="page"
      style={{
        fontWeight: 500,
        color: 'var(--foreground, #e4e4e7)',
        ...style,
      }}
      data-slot="breadcrumb-page"
      {...props}
    />
  );
}

export function BreadcrumbSeparator({
  children,
  style,
  ...props
}: React.ComponentProps<'li'>): React.ReactElement {
  return (
    <li
      aria-hidden="true"
      role="presentation"
      style={{
        opacity: 0.5,
        display: 'inline-flex',
        alignItems: 'center',
        ...style,
      }}
      data-slot="breadcrumb-separator"
      {...props}
    >
      {children ?? <ChevronRight style={{ width: '1rem', height: '1rem' }} />}
    </li>
  );
}

export function BreadcrumbEllipsis({
  style,
  ...props
}: React.ComponentProps<'span'>): React.ReactElement {
  const { messages: m } = useBreadcrumb();

  return (
    <span
      aria-hidden="true"
      role="presentation"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        ...style,
      }}
      data-slot="breadcrumb-ellipsis"
      {...props}
    >
      <MoreHorizontal style={{ width: '1rem', height: '1rem' }} />
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {m.more}
      </span>
    </span>
  );
}
