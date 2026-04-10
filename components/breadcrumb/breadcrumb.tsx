import { ChevronRight, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

export function Breadcrumb({
  style,
  ...props
}: React.ComponentProps<'nav'>): React.ReactElement {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" style={style} {...props} />;
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
  return (
    <a
      className="breadcrumb-link"
      style={{
        color: 'inherit',
        textDecoration: 'none',
        transition: 'color 0.2s',
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
        More
      </span>
    </span>
  );
}
