export function AdminInfoPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="text-center py-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Vendure Admin</h1>
        <p className="text-xl text-muted-foreground">
          Verwalte deine Produkte, Bestellungen und Kunden.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 border rounded-2xl bg-card space-y-4">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-muted-foreground">
            Das Vendure Admin Panel ist unter <code className="text-accent">/admin</code> erreichbar.
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>URL:</strong> <a href="http://localhost:3000/admin" target="_blank" className="text-accent hover:underline">http://localhost:3000/admin</a></p>
            <p><strong>Benutzer:</strong> superadmin</p>
            <p><strong>Passwort:</strong> superadmin</p>
          </div>
          <a
            href="http://localhost:3000/admin"
            target="_blank"
            className="inline-block w-full py-3 bg-foreground text-background text-center font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Zum Admin Panel
          </a>
        </div>

        <div className="p-8 border rounded-2xl bg-card space-y-4">
          <h2 className="text-xl font-bold">API Endpunkte</h2>
          <p className="text-muted-foreground">
            Nutze die GraphQL APIs für eigene Integrationen.
          </p>
          <ul className="space-y-3 text-sm">
            <li>
              <div className="font-semibold text-foreground">Shop API</div>
              <a href="http://localhost:3000/shop-api" target="_blank" className="text-muted-foreground hover:text-accent truncate block">
                http://localhost:3000/shop-api
              </a>
            </li>
            <li>
              <div className="font-semibold text-foreground">Admin API</div>
              <a href="http://localhost:3000/admin-api" target="_blank" className="text-muted-foreground hover:text-accent truncate block">
                http://localhost:3000/admin-api
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="p-8 border rounded-2xl bg-muted/50 space-y-4">
        <h2 className="text-xl font-bold">Exportierbarkeit</h2>
        <p className="text-sm leading-relaxed">
          Die Wein-spezifische Logik wurde in das <code className="text-accent">WineShowcasePlugin</code> ausgelagert. 
          Dieses Plugin kann einfach in andere Vendure-Projekte kopiert und dort in der <code className="text-accent">vendure-config.ts</code> registriert werden.
        </p>
        <p className="text-sm">
          Pfad zum Plugin: <code className="text-accent">server/src/plugins/wine-showcase.plugin.ts</code>
        </p>
      </div>
    </div>
  )
}
