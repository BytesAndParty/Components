import { GlowCard } from '@/components/glow-card'
import { MagneticButton } from '@/components/magnetic-button'

export function AdminInfoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Vendure.js — Admin & Übersicht</h1>
      <p className="text-muted-foreground mb-8">
        Alles was du über die Vendure.js Integration wissen musst.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Admin UI */}
        <GlowCard glowColor="var(--accent)">
          <div style={{ padding: '24px' }}>
            <h2 className="text-lg font-semibold text-foreground mb-2">🖥️ Admin UI</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Vendure liefert eine vollständige Admin-Oberfläche (React + Shadcn-basiert).
              Hier verwaltest du Produkte, Bestellungen, Kunden und Einstellungen.
            </p>
            <div
              style={{
                background: 'var(--muted)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px',
              }}
            >
              <p className="text-xs text-muted-foreground mb-1">URL:</p>
              <code className="text-sm text-accent">http://localhost:3002/admin</code>
              <p className="text-xs text-muted-foreground mt-2 mb-1">Login:</p>
              <code className="text-sm text-foreground">superadmin / superadmin</code>
            </div>
            <a href="http://localhost:3002/admin" target="_blank" rel="noreferrer">
              <MagneticButton variant="primary">
                Admin UI öffnen ↗
              </MagneticButton>
            </a>
          </div>
        </GlowCard>

        {/* GraphQL Playground */}
        <GlowCard glowColor="var(--accent)">
          <div style={{ padding: '24px' }}>
            <h2 className="text-lg font-semibold text-foreground mb-2">🔗 GraphQL APIs</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Vendure exponiert zwei GraphQL-APIs: Shop API (öffentlich) und Admin API (authentifiziert).
            </p>
            <div
              style={{
                background: 'var(--muted)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px',
              }}
            >
              <p className="text-xs text-muted-foreground mb-1">Shop API:</p>
              <code className="text-sm text-accent">http://localhost:3000/shop-api</code>
              <p className="text-xs text-muted-foreground mt-2 mb-1">Admin API:</p>
              <code className="text-sm text-accent">http://localhost:3000/admin-api</code>
            </div>
            <p className="text-xs text-muted-foreground">
              Tipp: Öffne die URLs im Browser für den eingebauten GraphQL Playground.
            </p>
          </div>
        </GlowCard>

        {/* Custom Fields */}
        <GlowCard glowColor="var(--accent)">
          <div style={{ padding: '24px' }}>
            <h2 className="text-lg font-semibold text-foreground mb-2">🍇 Custom Fields</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Vendure erlaubt Custom Fields auf allen Core-Entities.
              Wir haben 10 weinspezifische Felder auf <code className="text-accent">Product</code> definiert:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['jahrgang', 'rebsorte', 'region', 'alkoholgehalt', 'geschmacksprofil',
                'restzucker', 'saeure', 'serviertemperatur', 'speiseempfehlung', 'auszeichnungen'].map(f => (
                <span
                  key={f}
                  style={{
                    background: 'color-mix(in oklch, var(--accent) 15%, transparent)',
                    color: 'var(--accent)',
                    padding: '2px 10px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </GlowCard>

        {/* Plugins */}
        <GlowCard glowColor="var(--accent)">
          <div style={{ padding: '24px' }}>
            <h2 className="text-lg font-semibold text-foreground mb-2">🔌 Plugin-Architektur</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Vendure basiert auf NestJS. Jedes Feature kann als Plugin implementiert werden:
            </p>
            <ul className="text-sm text-muted-foreground" style={{ paddingLeft: '16px', listStyle: 'disc', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong className="text-foreground">Label Designer Plugin</strong> — Canvas-Editor für Etiketten</li>
              <li><strong className="text-foreground">Rebstock-Abo Plugin</strong> — Stripe Billing für Abos</li>
              <li><strong className="text-foreground">Event Booking Plugin</strong> — Kalender + Buchungssystem</li>
              <li><strong className="text-foreground">Asset Server Plugin</strong> — Produktbilder (eingebaut)</li>
              <li><strong className="text-foreground">Admin UI Plugin</strong> — Admin-Oberfläche (eingebaut)</li>
            </ul>
          </div>
        </GlowCard>

        {/* Was kommt fertig? */}
        <GlowCard glowColor="var(--accent)">
          <div style={{ padding: '24px' }}>
            <h2 className="text-lg font-semibold text-foreground mb-2">✅ Vendure Core Features</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Diese Features sind sofort verfügbar — kein Plugin nötig:
            </p>
            <ul className="text-sm text-muted-foreground" style={{ paddingLeft: '16px', listStyle: 'disc', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <li>Produktkatalog mit Varianten</li>
              <li>Warenkorb (ActiveOrder API)</li>
              <li>Checkout-Flow (konfigurierbar)</li>
              <li>Bestellungen + Statusverwaltung</li>
              <li>Kundenverwaltung + Auth</li>
              <li>Rabatte, Gutscheine, Promotions</li>
              <li>Versandmethoden + Berechnung</li>
              <li>Admin UI (erweiterbar)</li>
              <li>Stripe Payment Plugin</li>
              <li>Asset Management (Bilder)</li>
            </ul>
          </div>
        </GlowCard>

        {/* Tech Stack */}
        <GlowCard glowColor="var(--accent)">
          <div style={{ padding: '24px' }}>
            <h2 className="text-lg font-semibold text-foreground mb-2">⚙️ Tech Stack</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Diese Wine Showcase verwendet:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { label: 'Backend', value: 'Vendure.js 3 (NestJS + TypeScript)' },
                { label: 'DB', value: 'SQLite (Dev) → PostgreSQL (Prod)' },
                { label: 'Frontend', value: 'React 19 + Vite 6 + Tailwind CSS 4' },
                { label: 'GraphQL Client', value: 'urql' },
                { label: 'UI Components', value: '10 aus der Components Library' },
                { label: 'Package Manager', value: 'Bun' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm text-foreground font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Quick Commands */}
      <div
        className="mt-8"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">📋 Befehle</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Server (Vendure)</h3>
            <pre
              className="text-xs text-muted-foreground"
              style={{
                background: 'var(--muted)',
                padding: '12px',
                borderRadius: '8px',
                overflow: 'auto',
              }}
            >
{`cd wine-showcase/server
bun install
bun run dev       # Server starten
bun run seed      # Testdaten anlegen`}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Storefront (React)</h3>
            <pre
              className="text-xs text-muted-foreground"
              style={{
                background: 'var(--muted)',
                padding: '12px',
                borderRadius: '8px',
                overflow: 'auto',
              }}
            >
{`cd wine-showcase/storefront
bun install
bun run dev       # Storefront starten`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
