import type { CSSProperties, ReactNode } from 'react';
import { useComponentMessages } from '../i18n';
import { MESSAGES, type ProductTagMessages } from './messages';

const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

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
  /** i18n overrides for variant labels. */
  messages?: Partial<ProductTagMessages>;
  className?: string;
}

export interface ProductTagGroupProps {
  children: ReactNode;
  className?: string;
}

// ─── CSS (einmalig injiziert) ─────────────────────────────────────────────────

const tagCss = `
@keyframes ptag-entrance {
  0%   { transform: scale(0.5) rotate(-6deg); opacity: 0; }
  65%  { transform: scale(1.06) rotate(1.5deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
@keyframes ptag-shimmer {
  0%   { left: -60%; }
  100% { left: 160%; }
}
@keyframes ptag-dot-pulse {
  0%, 100% { transform: scale(1);   opacity: 1; }
  50%       { transform: scale(1.7); opacity: 0.35; }
}
.product-tag {
  animation: ptag-entrance 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  transition: transform 0.2s ease, filter 0.2s ease;
}
.product-tag:hover {
  transform: scale(1.07);
  filter: drop-shadow(0 0 6px var(--ptag-glow, transparent));
}
.product-tag-shimmer {
  position: absolute;
  top: 0; bottom: 0;
  width: 40%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transform: skewX(-15deg);
  pointer-events: none;
  left: -60%;
}
.product-tag:hover .product-tag-shimmer {
  animation: ptag-shimmer 0.5s ease forwards;
}
.product-tag-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: ptag-dot-pulse 1.4s ease-in-out infinite;
  flex-shrink: 0;
}
@media (prefers-reduced-motion: reduce) {
  .product-tag               { animation: none; opacity: 1; }
  .product-tag:hover         { transform: none; filter: none; }
  .product-tag:hover .product-tag-shimmer { animation: none; }
  .product-tag-dot           { animation: none; }
}
`;

let cssInjected = false;
function injectCssOnce() {
  if (cssInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = tagCss;
  document.head.appendChild(style);
  cssInjected = true;
}

// ─── Variant-Konfiguration ───────────────────────────────────────────────────

interface VariantConfig {
  bg: string;
  glow: string;
  shimmer: boolean;
  dot: boolean;
  /** Key into ProductTagMessages for the default label. */
  messageKey: keyof ProductTagMessages;
}

const variantConfig: Record<ProductTagVariant, VariantConfig> = {
  new:        { bg: '#16a34a', glow: 'rgba(22,163,74,0.55)',  shimmer: true,  dot: false, messageKey: 'new'        },
  sale:       { bg: '#e11d48', glow: 'rgba(225,29,72,0.55)',  shimmer: true,  dot: false, messageKey: 'sale'       },
  'low-stock':{ bg: '#b45309', glow: 'rgba(180,83,9,0.55)',   shimmer: false, dot: true,  messageKey: 'lowStock'   },
  bestseller: { bg: '#7c3aed', glow: 'rgba(124,58,237,0.55)', shimmer: true,  dot: false, messageKey: 'bestseller' },
  limited:    { bg: '#ea580c', glow: 'rgba(234,88,12,0.55)',  shimmer: false, dot: false, messageKey: 'limited'    },
  organic:    { bg: '#0d9488', glow: 'rgba(13,148,136,0.55)', shimmer: false, dot: false, messageKey: 'organic'    },
  vegan:      { bg: '#65a30d', glow: 'rgba(101,163,13,0.55)', shimmer: false, dot: false, messageKey: 'vegan'      },
  award:      { bg: '#ca8a04', glow: 'rgba(202,138,4,0.55)',  shimmer: true,  dot: false, messageKey: 'award'      },
};

// ─── Komponenten ──────────────────────────────────────────────────────────────

export function ProductTag({ variant, discount, label, messages, className }: ProductTagProps) {
  injectCssOnce();
  const m = useComponentMessages(MESSAGES, messages);
  const { bg, glow, shimmer, dot, messageKey } = variantConfig[variant];

  const displayLabel =
    label ?? (variant === 'sale' && discount != null ? `−${discount}%` : m[messageKey]);

  return (
    <span
      className={cn('product-tag', className)}
      style={{
        '--ptag-glow': glow,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        background: bg,
        color: '#fff',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '3px 8px',
        borderRadius: '999px',
        lineHeight: 1,
        userSelect: 'none',
        whiteSpace: 'nowrap',
        position: 'relative',
        overflow: 'hidden',
      } as CSSProperties}
    >
      {shimmer && <span className="product-tag-shimmer" aria-hidden="true" />}
      {dot && <span className="product-tag-dot" aria-hidden="true" />}
      {displayLabel}
    </span>
  );
}

/** Flex-Container für mehrere Tags nebeneinander */
export function ProductTagGroup({ children, className }: ProductTagGroupProps) {
  return (
    <div
      className={cn(className)}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}
    >
      {children}
    </div>
  );
}
