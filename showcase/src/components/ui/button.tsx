import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const variantStyles: Record<string, React.CSSProperties> = {
  default: { background: 'var(--accent)', color: '#fff' },
  ghost: { background: 'transparent', color: 'inherit' },
  outline: { background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' },
}

const sizeStyles: Record<string, React.CSSProperties> = {
  default: { height: '2.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem' },
  sm: { height: '2.25rem', padding: '0.5rem 0.75rem', fontSize: '0.8125rem' },
  lg: { height: '2.75rem', padding: '0.5rem 2rem', fontSize: '0.875rem' },
  icon: { height: '2.25rem', width: '2.25rem', padding: 0 },
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={['showcase-btn', `showcase-btn--${variant}`, className].filter(Boolean).join(' ')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          borderRadius: '0.375rem',
          fontWeight: 500,
          cursor: 'pointer',
          border: 'none',
          transition: 'background 0.15s, opacity 0.15s',
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...style,
        }}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
