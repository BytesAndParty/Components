import { useEffect } from 'react';
import { useActiveCustomer, useLogout } from '@/lib/use-auth';
import { useT, format } from '@/lib/i18n';
import { Providers } from '../Providers';
import { Loader2, LogOut, Package, Calendar } from 'lucide-react';
import { wineHref } from '@/lib/utils';
import { AccountDetailsCard } from './account-details-card';
import { ChangePasswordCard } from './change-password-card';
import { AddressesCard } from './addresses-card';

function formatPrice(cents: number): string {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-AT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ProfileDashboardInner() {
  const t = useT();
  const { data: customer, isLoading } = useActiveCustomer();
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();

  useEffect(() => {
    if (!isLoading && !customer) {
      window.location.href = '/login';
    }
  }, [customer, isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-accent" size={36} />
        <p className="text-muted-foreground text-sm">Lade Profil...</p>
      </div>
    );
  }

  if (!customer) return null;

  const orders = customer.orders?.items ?? [];

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      {/* Header-Sektion */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.profileTitle}</h1>
          <p className="text-muted-foreground mt-1">
            {format(t.profileSubtitle, { name: `${customer.firstName} ${customer.lastName}` })}
          </p>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="bg-muted hover:bg-destructive/10 hover:text-destructive text-foreground flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all border border-border cursor-pointer disabled:opacity-50"
        >
          {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
          {t.profileLogout}
        </button>
      </div>

      {/* Profil details grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Konto-Verwaltung */}
        <div className="space-y-8">
          <AccountDetailsCard customer={customer} />
          <ChangePasswordCard />
        </div>

        {/* Bestellhistorie */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Package size={22} className="text-accent" />
            {t.profileOrderHistory}
          </h2>

          {orders.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
              {t.profileNoOrders}
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card border border-border hover:border-accent/40 rounded-2xl p-6 transition-all space-y-4 group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base tabular-nums">
                        {format(t.profileOrderCode, { code: order.code })}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        order.state === 'Placed'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : order.state === 'PaymentSettled'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {format(t.profileOrderState, { state: order.state })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={14} />
                      {order.orderPlacedAt && formatDate(order.orderPlacedAt)}
                    </div>
                  </div>

                  {/* Order Lines */}
                  <div className="divide-y divide-border/60">
                    {order.lines.map((line) => (
                      <div key={line.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-lg shrink-0">🍷</span>
                          <div className="min-w-0">
                            <a
                              href={wineHref(line.productVariant.product.slug)}
                              className="font-semibold text-sm hover:text-accent truncate block"
                            >
                              {line.productVariant.name}
                            </a>
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {line.quantity}x {formatPrice(line.productVariant.priceWithTax)}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-bold tabular-nums">
                          {formatPrice(line.linePriceWithTax)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border/60 pt-3 flex justify-between items-center text-sm font-bold">
                    <span className="text-muted-foreground font-normal">Summe</span>
                    <span className="text-base tabular-nums text-accent">
                      {formatPrice(order.totalWithTax)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Adressverwaltung */}
      <AddressesCard />
    </div>
  );
}

export function ProfileDashboard() {
  return (
    <Providers>
      <ProfileDashboardInner />
    </Providers>
  );
}
