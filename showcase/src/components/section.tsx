import { useState } from 'react'

export function Section({ title, description, children, canReload = false }: {
  title: string
  description?: string
  children: React.ReactNode
  canReload?: boolean
}) {
  const [reloads, setReloads] = useState(0)

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        {canReload && (
          <button
            onClick={() => setReloads(r => r + 1)}
            className="p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
            title="Animation neu starten"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          </button>
        )}
      </div>
      {description && (
        <p className="text-muted-foreground text-sm mb-6">{description}</p>
      )}
      <div key={reloads}>
        {children}
      </div>
    </section>
  )
}
