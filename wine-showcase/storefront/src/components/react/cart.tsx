import { useCart } from '@/lib/cart-context'

function formatPrice(cents: number): string {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

export function CartPage() {
  const { order, loading, adjustLine, removeLine, totalPrice } = useCart()
  const lines = order?.lines ?? []

  if (loading && !order) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Warenkorb wird geladen...</p>
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <div className="py-20 text-center space-y-6">
        <div className="text-6xl">🛒</div>
        <h2 className="text-2xl font-bold">Warenkorb ist leer</h2>
        <p className="text-muted-foreground">Füge Weine aus unserem Sortiment hinzu.</p>
        <a
          href="/"
          className="inline-block py-3 px-8 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity"
        >
          Weine entdecken
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Warenkorb</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {lines.map((line) => (
            <div
              key={line.id}
              className="flex items-center gap-6 p-4 bg-card border rounded-xl"
            >
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-3xl shrink-0">
                🍷
              </div>

              <div className="flex-1 min-w-0">
                <a
                  href={`/wine/${line.productVariant.product.slug}`}
                  className="font-bold hover:text-accent transition-colors truncate block"
                >
                  {line.productVariant.name}
                </a>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(line.productVariant.priceWithTax)} / Flasche
                </p>
              </div>

              <div className="flex items-center gap-3 border rounded-lg p-1 bg-muted/50">
                <button
                  onClick={() => line.quantity <= 1 ? removeLine(line.id) : adjustLine(line.id, line.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-background rounded transition-colors"
                >
                  −
                </button>
                <span className="w-6 text-center font-medium tabular-nums text-sm">
                  {line.quantity}
                </span>
                <button
                  onClick={() => adjustLine(line.id, line.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-background rounded transition-colors"
                >
                  +
                </button>
              </div>

              <div className="w-24 text-right font-bold">
                {formatPrice(line.linePriceWithTax)}
              </div>

              <button
                onClick={() => removeLine(line.id)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="bg-card border rounded-2xl p-6 h-fit space-y-6 sticky top-24">
          <h2 className="text-xl font-bold">Zusammenfassung</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Zwischensumme</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Versand</span>
              <span>€ 5,90</span>
            </div>
            <div className="pt-3 border-t flex justify-between font-bold text-lg">
              <span>Gesamt</span>
              <span>{formatPrice(totalPrice + 590)}</span>
            </div>
          </div>

          <button
            onClick={() => alert('Demo Checkout: Bestellung wurde simuliert.')}
            className="w-full py-4 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Zur Kasse
          </button>
        </div>
      </div>
    </div>
  )
}
