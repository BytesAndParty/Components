import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AtelierProvider } from '@components/atelier';
import { queryClient } from '@/lib/query-client';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AtelierProvider defaultTheme="dark" defaultAccent="bordeaux" defaultLocale="de">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AtelierProvider>
  );
}
