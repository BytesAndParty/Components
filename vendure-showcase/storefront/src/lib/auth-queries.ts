export const LOGIN = `
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password, rememberMe: true) {
      __typename
      ... on CurrentUser {
        id
        identifier
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const LOGOUT = `
  mutation Logout {
    logout {
      success
    }
  }
`;

export const REGISTER = `
  mutation Register($input: RegisterCustomerInput!) {
    registerCustomerAccount(input: $input) {
      __typename
      ... on Success {
        success
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

const ADDRESS_FIELDS = `
  id
  fullName
  company
  streetLine1
  streetLine2
  city
  province
  postalCode
  country {
    code
    name
  }
  phoneNumber
  defaultShippingAddress
  defaultBillingAddress
`;

export const GET_ADDRESSES = `
  query GetActiveCustomerAddresses {
    activeCustomer {
      id
      addresses {
        ${ADDRESS_FIELDS}
      }
    }
  }
`;

export const GET_AVAILABLE_COUNTRIES = `
  query GetAvailableCountries {
    availableCountries {
      id
      code
      name
    }
  }
`;

export const CREATE_ADDRESS = `
  mutation CreateCustomerAddress($input: CreateAddressInput!) {
    createCustomerAddress(input: $input) {
      ${ADDRESS_FIELDS}
    }
  }
`;

export const UPDATE_ADDRESS = `
  mutation UpdateCustomerAddress($input: UpdateAddressInput!) {
    updateCustomerAddress(input: $input) {
      ${ADDRESS_FIELDS}
    }
  }
`;

export const DELETE_ADDRESS = `
  mutation DeleteCustomerAddress($id: ID!) {
    deleteCustomerAddress(id: $id) {
      success
    }
  }
`;

export const UPDATE_CUSTOMER = `
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      id
      firstName
      lastName
      phoneNumber
      emailAddress
    }
  }
`;

export const UPDATE_PASSWORD = `
  mutation UpdateCustomerPassword($currentPassword: String!, $newPassword: String!) {
    updateCustomerPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      __typename
      ... on Success {
        success
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const GET_ACTIVE_CUSTOMER = `
  query GetActiveCustomer {
    activeCustomer {
      id
      emailAddress
      firstName
      lastName
      orders(options: { filter: { state: { notEq: "Draft" } }, sort: { orderPlacedAt: DESC } }) {
        items {
          id
          code
          state
          active
          orderPlacedAt
          totalWithTax
          lines {
            id
            quantity
            linePriceWithTax
            productVariant {
              id
              name
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
        totalItems
      }
    }
  }
`;
