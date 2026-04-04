import { forwardRef } from 'react'

export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      style={{
        borderRadius: '0.75rem',
        border: '1px solid var(--border)',
        background: 'var(--card)',
        padding: '1.5rem',
        ...style,
      }}
      {...props}
    />
  )
)
Card.displayName = 'Card'
