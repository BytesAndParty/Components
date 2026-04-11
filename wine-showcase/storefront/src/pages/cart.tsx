import { Link } from 'react-router'
import { useCart } from '@/lib/cart-context'
import { MagneticButton } from '@/components/magnetic-button'
import { Stepper, Step } from '@/components/stepper'
import { toast } from '@/components/toast'

function formatPrice(cents: number): string {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

export function CartPage() {
  const { order, loading, adjustLine, removeLine, totalPrice } = useCart()
  const lines = order?.lines ?? []

  if (loading && !order) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <p className="text-muted-foreground">Warenkorb wird geladen...</p>
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Warenkorb ist leer</h2>
        <p className="text-muted-foreground mb-6">Füge Weine aus unserem Sortiment hinzu.</p>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <MagneticButton variant="primary">
            Weine entdecken
          </MagneticButton>
        </Link>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
      {/* Cart Items */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-6">Warenkorb</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {lines.map((line) => (
            <div
              key={line.id}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              {/* Product image placeholder */}
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  background: 'var(--muted)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  flexShrink: 0,
                }}
              >
                🍷
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <Link
                  to={`/wine/${line.productVariant.product.slug}`}
                  className="text-sm font-semibold text-foreground"
                  style={{ textDecoration: 'none' }}
                >
                  {line.productVariant.name}
                </Link>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatPrice(line.productVariant.priceWithTax)} / Flasche
                </p>
              </div>

              {/* Quantity controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (line.quantity <= 1) {
                      removeLine(line.id)
                    } else {
                      adjustLine(line.id, line.quantity - 1)
                    }
                  }}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'none',
                    color: 'var(--foreground)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                  }}
                >
                  −
                </button>
                <span
                  className="text-sm text-foreground font-medium tabular-nums"
                  style={{ minWidth: '24px', textAlign: 'center' }}
                >
                  {line.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => adjustLine(line.id, line.quantity + 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'none',
                    color: 'var(--foreground)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                  }}
                >
                  +
                </button>
              </div>

              {/* Line total */}
              <span className="text-sm font-bold text-foreground" style={{ minWidth: '80px', textAlign: 'right' }}>
                {formatPrice(line.linePriceWithTax)}
              </span>

              {/* Remove */}
              <button
                type="button"
                onClick={() => {
                  removeLine(line.id)
                  toast({ title: 'Entfernt', description: line.productVariant.name, variant: 'default' })
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted-foreground)',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px',
                }}
                aria-label="Entfernen"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar: Checkout Stepper */}
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '24px',
          position: 'sticky',
          top: '80px',
        }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-6">Bestellung</h2>

        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="text-sm text-muted-foreground">Zwischensumme</span>
            <span className="text-sm text-foreground">{formatPrice(totalPrice)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="text-sm text-muted-foreground">Versand</span>
            <span className="text-sm text-foreground">€ 5,90</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
            <span className="text-foreground">Gesamt</span>
            <span className="text-foreground">{formatPrice(totalPrice + 590)}</span>
          </div>
        </div>

        <Stepper
          backButtonText="Zurück"
          nextButtonText="Weiter"
          finalButtonText="Jetzt bestellen"
          onFinalStepCompleted={() => {
            toast({
              title: 'Bestellung aufgegeben! 🎉',
              description: `Bestellnummer: ${order?.code ?? 'DEMO'}`,
              variant: 'success',
              duration: 6000,
            })
          }}
        >
          <Step title="Adresse">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Lieferadresse</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Vorname"
                  style={{
                    background: 'var(--muted)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'var(--foreground)',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
                <input
                  type="text"
                  placeholder="Nachname"
                  style={{
                    background: 'var(--muted)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'var(--foreground)',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
                <input
                  type="text"
                  placeholder="Adresse"
                  style={{
                    background: 'var(--muted)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'var(--foreground)',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>
          </Step>
          <Step title="Versand">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Versandmethode</h3>
              <div
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid var(--accent)',
                  background: 'color-mix(in oklch, var(--accent) 5%, transparent)',
                }}
              >
                <div className="text-sm font-medium text-foreground">📦 Standardversand</div>
                <div className="text-xs text-muted-foreground mt-1">3–5 Werktage · € 5,90</div>
              </div>
            </div>
          </Step>
          <Step title="Zahlung">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Zahlungsmethode</h3>
              <p className="text-xs text-muted-foreground">
                Stripe-Integration (Demo-Modus). In der Produktion werden hier SEPA, Klarna und Kreditkarte angeboten.
              </p>
              <div
                className="mt-3"
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid var(--accent)',
                  background: 'color-mix(in oklch, var(--accent) 5%, transparent)',
                }}
              >
                <div className="text-sm font-medium text-foreground">💳 Stripe Test-Modus</div>
                <div className="text-xs text-muted-foreground mt-1">Karte: 4242 4242 4242 4242</div>
              </div>
            </div>
          </Step>
        </Stepper>
      </div>
    </div>
  )
}
