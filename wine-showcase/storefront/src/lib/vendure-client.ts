import { Client, cacheExchange, fetchExchange } from 'urql';

export const vendureClient = new Client({
  url: '/shop-api',
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => ({
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }),
});
