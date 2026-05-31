import { createContext, useContext } from 'react'

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger'
export type Placement = 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'

export interface ToastData {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

export interface ToastContextValue {
  toasts: ToastData[]
  add: (t: Omit<ToastData, 'id'>) => string
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

// Convenience function — requires ToastProvider to be mounted.
// The Provider wires this up in a mount effect.
export const toastBridge: { add: ToastContextValue['add'] | null } = { add: null }

export function toast(opts: Omit<ToastData, 'id'>) {
  if (!toastBridge.add) throw new Error('toast() called before <ToastProvider> mounted')
  return toastBridge.add(opts)
}
