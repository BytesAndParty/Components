import { useState } from 'react'
import { Section } from '../components/section'
import { Stepper, Step } from '@components/stepper/stepper'
import { useToast } from '@components/toast/toast'

export function ShopPage() {
  const [selectedLabel, setSelectedLabel] = useState('')
  const [selectedBottle, setSelectedBottle] = useState('')
  const { add } = useToast()

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

  return (
    <>
      <Section title="Stepper" description="Multi-step flow for the wine label personalization order process.">
        <div className="border border-border rounded-xl bg-card p-8 shadow-sm max-w-xl mx-auto">
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
              <div style={{ paddingBottom: '8px' }}>
                <h3 className="text-lg font-semibold text-foreground mb-2">Etikett auswählen</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Wähle ein Design für dein personalisiertes Weinetikett.
                </p>
                <div className="flex flex-col gap-2">
                  {labels.map((label) => (
                    <button
                      key={label.id}
                      type="button"
                      onClick={() => setSelectedLabel(label.id)}
                      className="text-left"
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: `2px solid ${selectedLabel === label.id ? 'var(--accent)' : 'var(--border)'}`,
                        background: selectedLabel === label.id ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 200ms ease',
                        fontFamily: 'inherit',
                      }}
                    >
                      <div className="text-sm font-medium text-foreground">{label.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{label.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </Step>

            <Step title="Flasche">
              <div style={{ paddingBottom: '8px' }}>
                <h3 className="text-lg font-semibold text-foreground mb-2">Flasche zuordnen</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Wähle die Flasche, auf die das Etikett aufgebracht werden soll.
                </p>
                <div className="flex flex-col gap-2">
                  {bottles.map((bottle) => (
                    <button
                      key={bottle.id}
                      type="button"
                      onClick={() => setSelectedBottle(bottle.id)}
                      className="text-left"
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: `2px solid ${selectedBottle === bottle.id ? 'var(--accent)' : 'var(--border)'}`,
                        background: selectedBottle === bottle.id ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 200ms ease',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontFamily: 'inherit',
                      }}
                    >
                      <div>
                        <div className="text-sm font-medium text-foreground">{bottle.name}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{bottle.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            </Step>

            <Step title="Bestätigung">
              <div style={{ paddingBottom: '8px' }}>
                <h3 className="text-lg font-semibold text-foreground mb-2">Zusammenfassung</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Prüfe deine Auswahl und schließe die Bestellung ab.
                </p>
                <div
                  style={{
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                  }}
                >
                  <div className="p-4 flex justify-between text-sm border-b border-border">
                    <span className="text-muted-foreground">Etikett</span>
                    <span className="text-foreground font-medium">
                      {labels.find(l => l.id === selectedLabel)?.name || '—'}
                    </span>
                  </div>
                  <div className="p-4 flex justify-between text-sm">
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
    </>
  )
}
