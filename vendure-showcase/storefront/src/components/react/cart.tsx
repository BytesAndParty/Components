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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background font-semibold text-sm hover:bg-accent hover:text-primary-foreground transition-colors"
          >
            {t.cartEmptyCta}
          </a>
        }
      />
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">{t.cartTitle}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {lines.map((line) => (
            <div
              key={line.id}
              className="flex items-center gap-6 p-4 bg-card border border-border rounded-xl"
            >
              <div
                className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-3xl shrink-0"
                aria-hidden="true"
              >
                🍷
              </div>

              <div className="flex-1 min-w-0">
                <a
                  href={wineHref(line.productVariant.product.slug)}
                  className="font-bold hover:text-accent transition-colors truncate block"
                >
                  {line.productVariant.name}
                </a>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(line.productVariant.priceWithTax)} {t.cartPerBottle}
                </p>
              </div>

              <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-muted/50">
                <button
                  type="button"
                  onClick={() =>
                    line.quantity <= 1
                      ? removeLine(line.id)
                      : adjustLine({ lineId: line.id, quantity: line.quantity - 1 })
                  }
                  className="w-8 h-8 grid place-items-center hover:bg-background rounded transition-colors"
                  aria-label={t.cartLineDecrement}
                >
                  <Minus size={14} aria-hidden="true" />
                </button>
                <span className="w-6 text-center font-medium tabular-nums text-sm">
                  {line.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => adjustLine({ lineId: line.id, quantity: line.quantity + 1 })}
                  className="w-8 h-8 grid place-items-center hover:bg-background rounded transition-colors"
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
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                aria-label={t.cartLineRemove}
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <aside className="bg-card border border-border rounded-2xl p-6 h-fit space-y-6 sticky top-24">
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
            <div className="pt-3 border-t border-border flex justify-between font-bold text-lg">
              <span>{t.cartTotal}</span>
              <span className="tabular-nums">{formatPrice(totalPrice + SHIPPING_COST)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert(t.cartCheckoutDemo)}
            className="w-full py-4 rounded-xl bg-foreground text-background font-bold hover:bg-accent hover:text-primary-foreground transition-colors"
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
