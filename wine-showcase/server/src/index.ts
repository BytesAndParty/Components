import { bootstrap } from '@vendure/core';
import { config } from './vendure-config.js';

bootstrap(config)
  .then(() => {
    console.log('🍷 Vendure Wine Server gestartet');
    console.log('   Shop API:  http://localhost:3000/shop-api');
    console.log('   Admin API: http://localhost:3000/admin-api');
    console.log('   Admin UI:  http://localhost:3002/admin');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
