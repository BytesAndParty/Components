import { Client, cacheExchange, fetchExchange } from 'urql';

/**
 * Der URQL-Client wird für die clientseitige Interaktion (z.B. Warenkorb) genutzt.
 * Er läuft im Browser und schickt Anfragen an /shop-api (geproxied durch Astro).
 */
export const vendureClient = new Client({
  url: 'http://localhost:3000/shop-api', 
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => ({
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }),
});

/**
 * shopApiRequest ist eine einfache Helper-Funktion für serverseitige Requests.
 * Sie wird während des Astro-Builds (Node.js) aufgerufen, um Daten statisch
 * in die HTML-Seiten einzubetten.
 */
export async function shopApiRequest<T>(query: string, variables = {}): Promise<T> {
  const res = await fetch('http://localhost:3000/shop-api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data;
}
