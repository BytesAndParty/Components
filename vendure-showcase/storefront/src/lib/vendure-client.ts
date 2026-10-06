import { GraphQLClient, type Variables } from 'graphql-request';

const LOCAL_SHOP_API_URL = 'http://localhost:3000/shop-api';

/**
 * Build-Zeit (SSG, Node) fragt Vendure direkt ab: `VENDURE_SHOP_API_URL`.
 * Der Browser nimmt `PUBLIC_SHOP_API_URL`. Im Netlify-Deploy ist das `/shop-api`,
 * also same-origin über den Proxy in netlify.toml. Cross-site würde Safari/Firefox
 * die Session-Cookie des Warenkorbs blockieren. graphql-request braucht eine
 * absolute URL (`new URL(url)`), daher gegen die eigene Origin auflösen.
 * Ohne Env (lokal) gehen beide an den Vendure-Dev-Server.
 */
const SHOP_API_URL = import.meta.env.SSR
  ? import.meta.env.VENDURE_SHOP_API_URL || LOCAL_SHOP_API_URL
  : new URL(import.meta.env.PUBLIC_SHOP_API_URL || LOCAL_SHOP_API_URL, window.location.origin).href;

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
