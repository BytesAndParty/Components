import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { useAdjustLine, useCart, useRemoveLine } from '@/lib/cart-context'
import { wineHref } from '@/lib/utils'
import { useT } from '@/lib/i18n'
import { Providers } from './Providers'
import { EmptyState } from './EmptyState'

function formatPrice(cents: number): string {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

const SHIPPING_COST = 590

function CartInner() {
  const { order, loading, totalPrice } = useCart()
  const { mutate: adjustLine } = useAdjustLine()
  const { mutate: removeLine } = useRemoveLine()
  const t = useT()
  const lines = order?.lines ?? []

  if (loading && !order) {
    return (
      <EmptyState
        icon={<Loader2 size={28} className="animate-spin" aria-hidden="true" />}
        title={t.cartLoading}
      />
    )
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart size={28} aria-hidden="true" />}
        title={t.cartEmptyTitle}
        body={t.cartEmptyBody}
        action={
          <a
            href="/"
            className="bg-foreground text-background hover:bg-accent hover:text-primary-foreground inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            {t.cartEmptyCta}
          </a>
        }
      />
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="text-3xl font-bold">{t.cartTitle}</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {lines.map((line) => (
            <div
              key={line.id}
              className="bg-card border-border flex items-center gap-6 rounded-xl border p-4"
            >
              <div
                className="bg-muted flex h-16 w-16 shrink-0 items-center justify-center rounded-lg text-3xl"
                aria-hidden="true"
              >
                🍷
              </div>

              <div className="min-w-0 flex-1">
                <a
                  href={wineHref(line.productVariant.product.slug)}
                  className="hover:text-accent block truncate font-bold transition-colors"
                >
                  {line.productVariant.name}
                </a>
                <p className="text-muted-foreground text-sm">
                  {formatPrice(line.productVariant.priceWithTax)} {t.cartPerBottle}
                </p>
              </div>

              <div className="border-border bg-muted/50 flex items-center gap-1 rounded-lg border p-1">
                <button
                  type="button"
                  onClick={() =>
                    line.quantity <= 1
                      ? removeLine(line.id)
                      : adjustLine({ lineId: line.id, quantity: line.quantity - 1 })
                  }
                  className="hover:bg-background grid h-8 w-8 place-items-center rounded transition-colors"
                  aria-label={t.cartLineDecrement}
                >
                  <Minus size={14} aria-hidden="true" />
                </button>
                <span className="w-6 text-center text-sm font-medium tabular-nums">
                  {line.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => adjustLine({ lineId: line.id, quantity: line.quantity + 1 })}
                  className="hover:bg-background grid h-8 w-8 place-items-center rounded transition-colors"
                  aria-label={t.cartLineIncrement}
                >
                  <Plus size={14} aria-hidden="true" />
                </button>
              </div>

              <div className="w-24 text-right font-bold tabular-nums">
                {formatPrice(line.linePriceWithTax)}
              </div>

              <button
                type="button"
                onClick={() => removeLine(line.id)}
                className="text-muted-foreground hover:text-destructive p-2 transition-colors"
                aria-label={t.cartLineRemove}
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <aside className="bg-card border-border sticky top-24 h-fit space-y-6 rounded-2xl border p-6">
          <h2 className="text-xl font-bold">{t.cartSummaryTitle}</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.cartSubtotal}</span>
              <span className="tabular-nums">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.cartShipping}</span>
              <span className="tabular-nums">{t.cartShippingValue}</span>
            </div>
            <div className="border-border flex justify-between border-t pt-3 text-lg font-bold">
              <span>{t.cartTotal}</span>
              <span className="tabular-nums">{formatPrice(totalPrice + SHIPPING_COST)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert(t.cartCheckoutDemo)}
            className="bg-foreground text-background hover:bg-accent hover:text-primary-foreground w-full rounded-xl py-4 font-bold transition-colors"
          >
            {t.cartCheckout}
          </button>
        </aside>
      </div>
    </div>
  )
}

export function CartPage() {
  return (
    <Providers>
      <CartInner />
    </Providers>
  )
}
