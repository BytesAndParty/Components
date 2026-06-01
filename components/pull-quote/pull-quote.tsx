import type { CSSProperties, ReactNode } from 'react'
import { cn } from '../lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────────

export type PullQuoteVariant = 'editorial' | 'plate' | 'cellar'
export type PullQuoteAlign = 'left' | 'center' | 'right'
export type PullQuoteSize = 'sm' | 'md' | 'lg'

export interface PullQuoteProps {
  /** The quote text. Quotation marks are added by the component. */
  children: ReactNode
  /** Speaker / author name (small caps under quote). */
  attribution?: ReactNode
  /** Role / context line below the attribution. */
  byline?: ReactNode
  /**
   * Visual treatment.
   * - `editorial` (default): cream-bg friendly, hairline divider above attribution.
   * - `plate`: framed by a thin border, padded — looks like a printed plate.
   * - `cellar`: dark-ground variant, ideal on `bg-zinc-950` / dark hero overlays.
   */
  variant?: PullQuoteVariant
  /** Text alignment + content alignment. Default `left`. */
  align?: PullQuoteAlign
  /** Size of the serif headline. Default `md`. */
  size?: PullQuoteSize
  /** Show the large decorative opening quotation mark. Default `true`. */
  showMark?: boolean
  className?: string
  style?: CSSProperties
}

// ─── Tokens ─────────────────────────────────────────────────────────────────

const sizeText: Record<PullQuoteSize, string> = {
  sm: 'text-2xl sm:text-3xl',
  md: 'text-3xl sm:text-4xl lg:text-5xl',
  lg: 'text-4xl sm:text-5xl lg:text-6xl',
}

const sizeMark: Record<PullQuoteSize, string> = {
  sm: 'text-[5rem]',
  md: 'text-[6rem] lg:text-[7rem]',
  lg: 'text-[8rem] lg:text-[10rem]',
}

const alignFlex: Record<PullQuoteAlign, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
}

const alignAttrib: Record<PullQuoteAlign, string> = {
  left: 'items-start',
  center: 'items-center',
  right: 'items-end',
}

// ─── Variant styling (semantic tokens, no hex) ──────────────────────────────

interface VariantTokens {
  wrapper: string
  mark: string
  body: string
  rule: string
  name: string
  role: string
}

function getVariantTokens(variant: PullQuoteVariant): VariantTokens {
  switch (variant) {
    case 'plate':
      return {
        wrapper: 'border border-border bg-card p-10 sm:p-14',
        mark: 'text-muted-foreground/30',
        body: 'text-foreground',
        rule: 'bg-border',
        name: 'text-foreground',
        role: 'text-muted-foreground',
      }
    case 'cellar':
      return {
        wrapper: '',
        mark: 'text-foreground/15',
        body: 'text-foreground/90',
        rule: 'bg-foreground/20',
        name: 'text-foreground/80',
        role: 'text-muted-foreground',
      }
    case 'editorial':
    default:
      return {
        wrapper: '',
        mark: 'text-muted-foreground/25',
        body: 'text-foreground',
        rule: 'bg-border',
        name: 'text-foreground',
        role: 'text-muted-foreground',
      }
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

export function PullQuote({
  children,
  attribution,
  byline,
  variant = 'editorial',
  align = 'left',
  size = 'md',
  showMark = true,
  className,
  style,
}: PullQuoteProps) {
  const tokens = getVariantTokens(variant)

  return (
    <figure
      className={cn(
        'flex flex-col gap-8',
        alignFlex[align],
        tokens.wrapper,
        className
      )}
      style={style}
    >
      {showMark && (
        <span
          aria-hidden="true"
          className={cn(
            'font-display block h-8 leading-0 font-light select-none',
            sizeMark[size],
            tokens.mark
          )}
        >
          &ldquo;
        </span>
      )}

      <blockquote
        className={cn(
          'font-display max-w-3xl leading-tight font-light tracking-tight',
          sizeText[size],
          tokens.body
        )}
      >
        {children}
      </blockquote>

      {(attribution || byline) && (
        <figcaption
          className={cn('flex flex-col gap-2', alignAttrib[align])}
        >
          <span
            aria-hidden="true"
            className={cn('h-px w-10', tokens.rule)}
          />
          {attribution && (
            <span
              className={cn(
                'text-[11px] font-bold tracking-[0.3em] uppercase',
                tokens.name
              )}
            >
              {attribution}
            </span>
          )}
          {byline && (
            <span
              className={cn(
                'text-[10px] font-medium tracking-[0.2em] uppercase',
                tokens.role
              )}
            >
              {byline}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  )
}
