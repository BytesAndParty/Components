/** Vendure Shop API Types (minimal, passend zu unseren Queries) */

export interface WineCustomFields {
  jahrgang: number | null;
  rebsorte: string | null;
  region: string | null;
  alkoholgehalt: number | null;
  geschmacksprofil: string | null;
  restzucker: number | null;
  saeure: number | null;
  serviertemperatur: string | null;
  speiseempfehlung: string | null;
  auszeichnungen: string | null;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceWithTax: number;
  stockLevel: string;
}

export interface Asset {
  preview: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  featuredAsset: Asset | null;
  customFields: WineCustomFields;
  variants: ProductVariant[];
}

export interface OrderLine {
  id: string;
  quantity: number;
  linePriceWithTax: number;
  productVariant: {
    id: string;
    name: string;
    sku: string;
    priceWithTax: number;
    product: {
      slug: string;
      featuredAsset: Asset | null;
    };
  };
}

export interface Order {
  id: string;
  code: string;
  state: string;
  totalWithTax: number;
  totalQuantity: number;
  lines: OrderLine[];
}
