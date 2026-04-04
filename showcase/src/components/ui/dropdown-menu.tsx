import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { forwardRef } from 'react'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

export const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.DropdownMenuContentProps
>(({ className, sideOffset = 4, style, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={className}
      style={{
        zIndex: 50,
        minWidth: '8rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--border)',
        background: 'var(--card)',
        padding: '0.25rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        ...style,
      }}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = 'DropdownMenuContent'

export const DropdownMenuItem = forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.DropdownMenuItemProps
>(({ className, style, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={className}
    style={{
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      borderRadius: '0.25rem',
      padding: '0.375rem 0.5rem',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'background 0.1s',
      ...style,
    }}
    onMouseEnter={(e) => {
      ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
    }}
    onMouseLeave={(e) => {
      ;(e.currentTarget as HTMLElement).style.background = 'transparent'
    }}
    {...props}
  />
))
DropdownMenuItem.displayName = 'DropdownMenuItem'

export const DropdownMenuLabel = forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.DropdownMenuLabelProps
>(({ className, style, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={className}
    style={{
      padding: '0.375rem 0.5rem',
      fontSize: '0.8125rem',
      fontWeight: 600,
      opacity: 0.6,
      ...style,
    }}
    {...props}
  />
))
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

export const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.DropdownMenuSeparatorProps
>(({ className, style, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={className}
    style={{
      height: '1px',
      margin: '0.25rem -0.25rem',
      background: 'rgba(255,255,255,0.08)',
      ...style,
    }}
    {...props}
  />
))
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'
