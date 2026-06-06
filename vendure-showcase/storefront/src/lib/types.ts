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

export interface FacetValueRef {
  id: string;
  name: string;
  code: string;
  facet: {
    id: string;
    code: string;
    name: string;
  };
}

export interface Facet {
  id: string;
  code: string;
  name: string;
  values: Array<{ id: string; code: string; name: string }>;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  featuredAsset: Asset | null;
  customFields: WineCustomFields;
  facetValues: FacetValueRef[];
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
  active?: boolean;
  orderPlacedAt?: string | null;
  lines: OrderLine[];
}

export interface Customer {
  id: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  orders?: {
    items: Order[];
    totalItems: number;
  };
}

export interface CurrentUser {
  id: string;
  identifier: string;
}

export interface ErrorResult {
  errorCode: string;
  message: string;
}

// Vendure error result __typenames all end in "Error" (InvalidCredentialsError,
// NotVerifiedError, EmailAddressConflictError, …). The template-literal discriminant
// lets TypeScript narrow the non-success branch to ErrorResult (→ `.message` is available).
export type LoginResult =
  | ({ __typename: 'CurrentUser' } & CurrentUser)
  | ({ __typename: `${string}Error` } & ErrorResult);
export type RegisterResult =
  | { __typename: 'Success'; success: boolean }
  | ({ __typename: `${string}Error` } & ErrorResult);

export interface RegisterCustomerInput {
  emailAddress: string;
  firstName: string;
  lastName: string;
  password?: string;
  phoneNumber?: string;
}

export interface UpdateCustomerInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface Country {
  id: string;
  code: string;
  name: string;
}

export interface Address {
  id: string;
  fullName?: string | null;
  company?: string | null;
  streetLine1: string;
  streetLine2?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country: { code: string; name: string };
  phoneNumber?: string | null;
  defaultShippingAddress?: boolean | null;
  defaultBillingAddress?: boolean | null;
}

export interface CreateAddressInput {
  fullName?: string;
  company?: string;
  streetLine1: string;
  streetLine2?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  countryCode: string;
  phoneNumber?: string;
  defaultShippingAddress?: boolean;
  defaultBillingAddress?: boolean;
}

export interface UpdateAddressInput extends Partial<CreateAddressInput> {
  id: string;
}

export type UpdatePasswordResult =
  | { __typename: 'Success'; success: boolean }
  | ({ __typename: `${string}Error` } & ErrorResult);

