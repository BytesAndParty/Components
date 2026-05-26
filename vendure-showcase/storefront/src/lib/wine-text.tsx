import type { ReactNode } from 'react'

interface WineTextProps {
  children: string | null | undefined
  fallback?: ReactNode
}

/**
 * Central render seam for Vendure-supplied text fields (geschmacksprofil,
 * speiseempfehlung, description, …). Today React's auto-escape is the only
 * protection, which is sufficient because the Vendure admin UI does not allow
 * rich-text input for our custom fields.
 *
 * If rich-text/Markdown is ever enabled in the admin UI, swap the plaintext
 * branch below for DOMPurify-sanitized HTML — every consumer benefits at once.
 * See vendure-showcase/SECURITY.md → "XSS-Sanitization für Custom-Field-Beschreibungen".
 */
export function WineText({ children, fallback = null }: WineTextProps) {
  const text = children?.trim()
  return <>{text ? text : fallback}</>
}
