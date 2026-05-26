/**
 * DER EINSTIEGSPUNKT FÜR DAS BACKEND
 * Startet API-Server + Worker im selben Prozess (dev-friendly).
 * In Production sollten Worker und Server getrennt laufen.
 */
import { bootstrap, bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config.js';

bootstrap(config)
  .then(() => bootstrapWorker(config))
  .then((worker) => worker.startJobQueue())
  .then(() => {
    console.log('🍷 Vendure Wine Server + Worker gestartet');
    console.log('   Shop API:  http://localhost:3000/shop-api');
    console.log('   Admin API: http://localhost:3000/admin-api');
    console.log('   Admin UI:  http://localhost:3000/admin');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
