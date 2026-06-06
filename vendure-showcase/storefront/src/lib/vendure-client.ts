import { GraphQLClient, type Variables } from 'graphql-request';

const SHOP_API_URL = 'http://localhost:3000/shop-api';

/**
 * Ein einziger Fetcher für Shop-API-Requests — Build-Time (Node, SSG) und
 * Browser (Cart-Islands) gleichermaßen. Kein eigener Cache: das Caching macht
 * ausschließlich TanStack Query in den Hooks (cart-context, store-filters).
 *
 * `credentials: 'include'` trägt die anonyme Vendure-Session-Cookie mit, damit
 * der ActiveOrder-Warenkorb über Requests hinweg erhalten bleibt.
 */
const client = new GraphQLClient(SHOP_API_URL, { credentials: 'include' });

export async function shopApiRequest<T>(
  query: string,
  variables: Variables = {},
): Promise<T> {
  return client.request<T>(query, variables);
}
