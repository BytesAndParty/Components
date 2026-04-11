/** GraphQL Queries für die Vendure Shop API */

export const GET_PRODUCTS = `
  query GetProducts {
    products {
      items {
        id
        name
        slug
        description
        featuredAsset {
          preview
        }
        customFields {
          jahrgang
          rebsorte
          region
          alkoholgehalt
          geschmacksprofil
          restzucker
          saeure
          serviertemperatur
          speiseempfehlung
          auszeichnungen
        }
        variants {
          id
          name
          sku
          priceWithTax
          stockLevel
        }
      }
      totalItems
    }
  }
`;

export const GET_PRODUCT = `
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      description
      featuredAsset {
        preview
      }
      customFields {
        jahrgang
        rebsorte
        region
        alkoholgehalt
        geschmacksprofil
        restzucker
        saeure
        serviertemperatur
        speiseempfehlung
        auszeichnungen
      }
      variants {
        id
        name
        sku
        priceWithTax
        stockLevel
      }
    }
  }
`;

export const GET_ACTIVE_ORDER = `
  query GetActiveOrder {
    activeOrder {
      id
      code
      state
      totalWithTax
      totalQuantity
      lines {
        id
        quantity
        linePriceWithTax
        productVariant {
          id
          name
          sku
          priceWithTax
          product {
            slug
            featuredAsset {
              preview
            }
          }
        }
      }
    }
  }
`;

export const ADD_TO_ORDER = `
  mutation AddToOrder($variantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $variantId, quantity: $quantity) {
      ... on Order {
        id
        totalQuantity
        totalWithTax
        lines {
          id
          quantity
          productVariant {
            id
            name
          }
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const ADJUST_ORDER_LINE = `
  mutation AdjustOrderLine($lineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $lineId, quantity: $quantity) {
      ... on Order {
        id
        totalQuantity
        totalWithTax
        lines {
          id
          quantity
          productVariant {
            id
            name
          }
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const REMOVE_ORDER_LINE = `
  mutation RemoveOrderLine($lineId: ID!) {
    removeOrderLine(orderLineId: $lineId) {
      ... on Order {
        id
        totalQuantity
        totalWithTax
        lines {
          id
          quantity
          productVariant {
            id
            name
          }
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;
