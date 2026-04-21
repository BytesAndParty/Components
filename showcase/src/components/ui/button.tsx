import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const variantClasses = {
  default: 'bg-accent text-white hover:opacity-90',
  ghost: 'bg-transparent text-inherit hover:bg-white/10',
  outline: 'bg-transparent border border-border text-foreground hover:bg-white/5',
}

const sizeClasses = {
  default: 'h-10 px-4 py-2 text-sm',
  sm: 'h-9 px-3 text-[0.8125rem]',
  lg: 'h-11 px-8 text-sm',
  icon: 'h-9 w-9 p-0',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-medium cursor-pointer transition-colors disabled:opacity-50 disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        style={style}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
