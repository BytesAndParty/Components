export function Section({ title, description, children }: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-16">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {description && (
        <p className="text-muted-foreground text-sm mb-6">{description}</p>
      )}
      {children}
    </section>
  )
}
