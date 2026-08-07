import { useState } from 'react'
import { Section } from '../components/section'
import { Stepper, Step } from '@components/stepper/stepper'
import { VerticalStepper, VerticalStep, StepList, StepListItem } from '@components/stepper/stepper-vertical'
import { CartIcon } from '@components/cart-icon/cart-icon'
import { AddToCartButton } from '@components/add-to-cart-button/add-to-cart-button'
import { ProductTag, ProductTagGroup, type ProductTagVariant } from '@components/product-tag/product-tag'
import { BookingCalendar, type BookingSlot } from '@components/booking-calendar/booking-calendar'
import { useToast } from '@components/toast/toast-context'
import { useCart } from '../cart-context'

export function ShopPage() {
  const [selectedLabel, setSelectedLabel] = useState('')
  const [selectedBottle, setSelectedBottle] = useState('')
  const [demoCount, setDemoCount] = useState(0)
  const { add } = useToast()
  const cart = useCart()

  const labels = [
    { id: 'classic', name: 'Klassisch', description: 'Elegantes Weinrot mit Goldschrift' },
    { id: 'modern', name: 'Modern', description: 'Minimalistisch, schwarz-weiß' },
    { id: 'personal', name: 'Personalisiert', description: 'Eigener Text & Bild-Upload' },
  ]

  const bottles = [
    { id: 'barolo', name: 'Barolo Riserva 2018', price: '€ 42,00' },
    { id: 'amarone', name: 'Amarone Classico 2019', price: '€ 38,00' },
    { id: 'brunello', name: 'Brunello DOCG 2017', price: '€ 55,00' },
  ]

  const tagVariants: ProductTagVariant[] = ['new', 'sale', 'low-stock', 'bestseller', 'limited', 'organic', 'vegan', 'award']

  // Dummy-Slots relativ zu heute, damit der Kalender im aktuellen Monat Termine zeigt.
  const isoDay = (offset: number) => {
    const d = new Date()
    d.setDate(d.getDate() + offset)
    return d.toISOString().slice(0, 10)
  }
  const bookingSlots: BookingSlot[] = [
    { id: 'b1', date: isoDay(3), time: '15:00', capacity: 6, price: 45 },
    { id: 'b2', date: isoDay(3), time: '17:30', capacity: 4, price: 45 },
    { id: 'b3', date: isoDay(10), time: '16:00', capacity: 8, price: 45 },
    { id: 'b4', date: isoDay(17), time: '11:00', capacity: 12, price: 35 },
  ]

  return (
    <>
      <Section title="Booking Calendar" description="Datengetriebener Termin-Picker auf Ark UI DatePicker: buchbare Tage aktiv, Rest deaktiviert → Uhrzeit-Chips → Gäste → Absenden. Slots als Prop, onSubmit app-seitig (hier Dummy). i18n DE/EN, semantische Tokens.">
        <div className="mx-auto max-w-2xl">
          <BookingCalendar
            slots={bookingSlots}
            onSubmit={({ slotId, guests }) => {
              add({ title: 'Anfrage gesendet', description: `Slot ${slotId} · ${guests} Gäste`, variant: 'success' })
            }}
          />
        </div>
      </Section>

      <Section title="Product Tag" description="Pill-Badges für Produktkarten: Entrance-Pop, Shimmer-Sweep beim Hover, Puls-Dot bei knappem Bestand. 8 Varianten, i18n-Labels, reduced-motion-safe.">
        <div className="border-border bg-card flex flex-col gap-6 rounded-xl border p-8 shadow-sm">
          <ProductTagGroup>
            {tagVariants.map((v) => (
              <ProductTag key={v} variant={v} />
            ))}
          </ProductTagGroup>
          <div className="border-border flex flex-wrap items-center gap-4 border-t pt-5">
            <span className="text-muted-foreground text-xs">Sale mit Rabatt-Override:</span>
            <ProductTag variant="sale" discount={20} />
            <ProductTag variant="sale" discount={33} />
            <span className="text-muted-foreground ml-4 text-xs">Custom Label:</span>
            <ProductTag variant="award" label="Falstaff 95" />
          </div>
          <div className="border-border text-muted-foreground flex justify-between border-t pt-3 text-[0.7rem]">
            <span>ProductTag · injected keyframes · prefers-reduced-motion aware</span>
            <span>No dependencies</span>
          </div>
        </div>
      </Section>

      <Section title="Add to Cart Button" description="Animated button with cart roll-through, fill, and checkmark. Inspired by Aaron Iker.">
        <div className="border-border bg-card rounded-xl border p-8 shadow-sm">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            {bottles.map((bottle) => (
              <div
                key={bottle.id}
                className="border-border flex flex-col items-center gap-2 rounded-xl border p-4"
              >
                <span className="text-foreground text-sm font-medium">{bottle.name}</span>
                <span className="text-muted-foreground text-xs">{bottle.price}</span>
                <AddToCartButton onClick={() => cart.add({ id: bottle.id, label: bottle.name })}>
                  Add to cart
                </AddToCartButton>
              </div>
            ))}
          </div>
          <div className="border-border text-muted-foreground mt-6 flex justify-between border-t px-2 pt-3 text-[0.7rem]">
            <span>AddToCartButton · CSS keyframes · ~3.7s cycle</span>
            <span>No dependencies</span>
          </div>
        </div>
      </Section>

      <Section title="Cart Icon" description="Shopping cart icon with animated badge bounce and flying-box effect on count change.">
        <div className="border-border bg-card rounded-xl border p-8 shadow-sm">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-8">
              <CartIcon count={demoCount} size={32} />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDemoCount(c => Math.max(0, c - 1))}
                  className="border-border text-foreground flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border bg-transparent font-sans text-lg"
                >
                  −
                </button>
                <span className="text-foreground min-w-[24px] text-center text-sm tabular-nums">
                  {demoCount}
                </span>
                <button
                  type="button"
                  onClick={() => setDemoCount(c => c + 1)}
                  className="border-border text-foreground flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border bg-transparent font-sans text-lg"
                >
                  +
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setDemoCount(0); cart.reset() }}
              className="text-muted-foreground hover:text-foreground cursor-pointer border-none bg-transparent font-sans text-xs transition-colors"
            >
              Reset
            </button>
          </div>
          <div className="border-border text-muted-foreground mt-6 flex justify-between border-t px-2 pt-3 text-[0.7rem]">
            <span>CartIcon · Badge bounce + box arc animation</span>
            <span>No dependencies</span>
          </div>
        </div>
      </Section>

      <Section title="Stepper" description="Multi-step flow for the wine label personalization order process.">
        <div className="border-border bg-card mx-auto max-w-xl rounded-xl border p-8 shadow-sm">
          <Stepper
            initialStep={1}
            onStepChange={(step) => console.log('Step:', step)}
            onFinalStepCompleted={() =>
              add({
                title: 'Bestellung abgeschlossen',
                description: 'Dein personalisiertes Etikett wird vorbereitet!',
                variant: 'success',
              })
            }
          >
            <Step title="Etikett">
              <div className="pb-2">
                <h3 className="text-foreground mb-2 text-lg font-semibold">Etikett auswählen</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Wähle ein Design für dein personalisiertes Weinetikett.
                </p>
                <div className="flex flex-col gap-2">
                  {labels.map((label) => (
                    <button
                      key={label.id}
                      type="button"
                      onClick={() => setSelectedLabel(label.id)}
                      className={`
                        cursor-pointer rounded-lg border-2 p-3 px-4 text-left font-sans transition-all duration-200
                        ${selectedLabel === label.id ? 'border-accent bg-accent/5' : 'border-border bg-transparent'}
                      `}
                    >
                      <div className="text-foreground text-sm font-medium">{label.name}</div>
                      <div className="text-muted-foreground mt-0.5 text-xs">{label.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </Step>

            <Step title="Flasche">
              <div className="pb-2">
                <h3 className="text-foreground mb-2 text-lg font-semibold">Flasche zuordnen</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Wähle die Flasche, auf die das Etikett aufgebracht werden soll.
                </p>
                <div className="flex flex-col gap-2">
                  {bottles.map((bottle) => (
                    <button
                      key={bottle.id}
                      type="button"
                      onClick={() => setSelectedBottle(bottle.id)}
                      className={`
                        flex cursor-pointer items-center justify-between rounded-lg border-2 p-3 px-4 text-left font-sans transition-all duration-200
                        ${selectedBottle === bottle.id ? 'border-accent bg-accent/5' : 'border-border bg-transparent'}
                      `}
                    >
                      <div>
                        <div className="text-foreground text-sm font-medium">{bottle.name}</div>
                      </div>
                      <div className="text-muted-foreground text-sm">{bottle.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            </Step>

            <Step title="Bestätigung">
              <div className="pb-2">
                <h3 className="text-foreground mb-2 text-lg font-semibold">Zusammenfassung</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Prüfe deine Auswahl und schließe die Bestellung ab.
                </p>
                <div className="border-border overflow-hidden rounded-lg border">
                  <div className="border-border flex justify-between border-b p-4 text-sm">
                    <span className="text-muted-foreground">Etikett</span>
                    <span className="text-foreground font-medium">
                      {labels.find(l => l.id === selectedLabel)?.name || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between p-4 text-sm">
                    <span className="text-muted-foreground">Flasche</span>
                    <span className="text-foreground font-medium">
                      {bottles.find(b => b.id === selectedBottle)?.name || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </Step>
          </Stepper>
        </div>
      </Section>

      <Section title="Vertical Stepper" description="Vertikale Variante – alle Schritte sichtbar, aktiver Schritt expandiert. Connector-Linie füllt sich bei Fortschritt.">
        <div className="mx-auto max-w-md">
          <VerticalStepper
            initialStep={1}
            onStepChange={(step) => console.log('Vertical Step:', step)}
            onFinalStepCompleted={() =>
              add({
                title: 'Bestellung abgeschlossen',
                description: 'Dein personalisiertes Etikett wird vorbereitet!',
                variant: 'success',
              })
            }
          >
            <VerticalStep title="Installiere eine unserer produktionsreifen Libraries, um dein nächstes Projekt zu starten.">
              <StepList>
                <StepListItem>Material UI</StepListItem>
                <StepListItem>MUI Base</StepListItem>
                <StepListItem>Joy UI</StepListItem>
              </StepList>
            </VerticalStep>

            <VerticalStep title="Konfiguriere dein Theme und passe die Akzentfarben an.">
              <StepList>
                <StepListItem>Dark Mode aktivieren</StepListItem>
                <StepListItem>Akzentfarbe wählen</StepListItem>
                <StepListItem>Typografie festlegen</StepListItem>
              </StepList>
            </VerticalStep>

            <VerticalStep title="Veröffentliche dein Projekt und teile es mit der Welt.">
              <StepList>
                <StepListItem>Build erstellen</StepListItem>
                <StepListItem>Deployment konfigurieren</StepListItem>
                <StepListItem>Domain verknüpfen</StepListItem>
              </StepList>
            </VerticalStep>
          </VerticalStepper>
        </div>
      </Section>
    </>
  )
}
