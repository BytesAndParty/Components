/**
 * Minimum a wine needs before it goes live. Not every wine has every field (e.g. no
 * vintage on a non-vintage wine), so this list is deliberately short. To require more,
 * add a line to RULES.
 */

export interface ReadinessProduct {
  id: string;
  name: string;
  description: string;
  customFields?: {
    rebsorte?: string | null;
    region?: string | null;
    alkoholgehalt?: number | null;
  } | null;
  variants: Array<{ price: number }>;
}

export interface IncompleteProduct {
  id: string;
  name: string;
  missing: string[];
}

interface Rule {
  /** Shown in the dialog, e.g. "Rebsorte". */
  label: string;
  isMissing: (product: ReadinessProduct) => boolean;
}

/** The product description is rich text, so an "empty" one is often `<p></p>`. */
function isBlank(html: string | null | undefined): boolean {
  return !html || html.replace(/<[^>]*>|&nbsp;/g, '').trim() === '';
}

const RULES: Rule[] = [
  { label: 'Preis', isMissing: (p) => !p.variants.some((v) => v.price > 0) },
  { label: 'Beschreibung', isMissing: (p) => isBlank(p.description) },
  { label: 'Rebsorte', isMissing: (p) => isBlank(p.customFields?.rebsorte) },
  { label: 'Region', isMissing: (p) => isBlank(p.customFields?.region) },
  { label: 'Alkoholgehalt', isMissing: (p) => !((p.customFields?.alkoholgehalt ?? 0) > 0) },
];

export function findIncomplete(products: ReadinessProduct[]): IncompleteProduct[] {
  return products.flatMap((p) => {
    const missing = RULES.filter((r) => r.isMissing(p)).map((r) => r.label);
    return missing.length > 0 ? [{ id: p.id, name: p.name, missing }] : [];
  });
}
