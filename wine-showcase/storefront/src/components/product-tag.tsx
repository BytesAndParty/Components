import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../lib/utils';

// ─── Enum ────────────────────────────────────────────────────────────────────

export type ProductTagVariant =
  | 'new'         // NEU
  | 'sale'        // SALE / −20%
  | 'low-stock'   // Bald weg
  | 'bestseller'  // Bestseller
  | 'limited'     // Limitiert
  | 'organic'     // Bio
  | 'vegan'       // Vegan
  | 'award';      // Prämiert

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ProductTagProps {
  variant: ProductTagVariant;
  /** Nur für 'sale': Rabattprozent, z.B. 20 → "−20%" */
  discount?: number;
  /** Optionaler Label-Override */
  label?: string;
  className?: string;
}

export interface ProductTagGroupProps {
  children: ReactNode;
  className?: string;
}

// ─── Variant-Konfiguration ───────────────────────────────────────────────────

interface VariantConfig {
  bg: string;
  glow: string;
  defaultLabel: string;
  shimmer: boolean;
  dot: boolean;
}

const variantConfig: Record<ProductTagVariant, VariantConfig> = {
  new:        { bg: '#16a34a', glow: 'rgba(22,163,74,0.55)',   defaultLabel: 'NEU',        shimmer: true,  dot: false },
  sale:       { bg: '#e11d48', glow: 'rgba(225,29,72,0.55)',   defaultLabel: 'SALE',       shimmer: true,  dot: false },
  'low-stock':{ bg: '#b45309', glow: 'rgba(180,83,9,0.55)',    defaultLabel: 'Bald weg',   shimmer: false, dot: true  },
  bestseller: { bg: '#7c3aed', glow: 'rgba(124,58,237,0.55)',  defaultLabel: 'Bestseller', shimmer: true,  dot: false },
  limited:    { bg: '#ea580c', glow: 'rgba(234,88,12,0.55)',   defaultLabel: 'Limitiert',  shimmer: false, dot: false },
  organic:    { bg: '#0d9488', glow: 'rgba(13,148,136,0.55)',  defaultLabel: 'Bio',        shimmer: false, dot: false },
  vegan:      { bg: '#65a30d', glow: 'rgba(101,163,13,0.55)',  defaultLabel: 'Vegan',      shimmer: false, dot: false },
  award:      { bg: '#ca8a04', glow: 'rgba(202,138,4,0.55)',   defaultLabel: 'Prämiert',   shimmer: true,  dot: false },
};

// ─── Komponenten ──────────────────────────────────────────────────────────────

export function ProductTag({ variant, discount, label, className }: ProductTagProps) {
  const { bg, glow, defaultLabel, shimmer, dot } = variantConfig[variant];

  const displayLabel =
    label ?? (variant === 'sale' && discount != null ? `−${discount}%` : defaultLabel);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] text-white text-[11px] font-bold tracking-[0.06em] uppercase px-2 py-[3px] rounded-full leading-none select-none whitespace-nowrap relative overflow-hidden transition-[transform,filter] duration-200 hover:scale-[1.07] animate-[ptag-entrance_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both]',
        'group',
        className
      )}
      style={{
        background: bg,
        '--ptag-glow': glow,
      } as CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.filter = `drop-shadow(0 0 6px ${glow})`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = 'none';
      }}
    >
      {shimmer && (
        <span
          className="absolute top-0 bottom-0 w-[40%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -skew-x-[15deg] pointer-events-none -left-[60%] group-hover:animate-[ptag-shimmer_0.5s_ease_forwards]"
          aria-hidden="true"
        />
      )}
      {dot && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full bg-current shrink-0 animate-[ptag-dot-pulse_1.4s_ease-in-out_infinite]"
          aria-hidden="true"
        />
      )}
      {displayLabel}
    </span>
  );
}

/** Flex-Container für mehrere Tags nebeneinander */
export function ProductTagGroup({ children, className }: ProductTagGroupProps) {
  return (
    <div
      className={cn('flex flex-wrap gap-1.5 items-center', className)}
    >
      {children}
    </div>
  );
}
