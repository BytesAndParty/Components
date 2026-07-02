// fallow-ignore-file security-sink
// Reason: every path.join uses only __dirname + literal segments (no external
// input); paths are not attacker-controllable.

/**
 * DIE ZENTRALE KONFIGURATION
 * Hier definieren wir, wie der Server läuft: Datenbank, Sicherheit, Plugins und Pfade.
 */
import {
  VendureConfig,
  DefaultSearchPlugin,
  DefaultJobQueuePlugin,
} from '@vendure/core';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import path from 'path';
import { fileURLToPath } from 'url';
import { WineShowcasePlugin } from './plugins/wine-showcase.plugin.js';
import { StorefrontDeployPlugin } from './plugins/storefront-deploy/storefront-deploy.plugin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Wir prüfen, ob wir in der lokalen Entwicklung (SQLite) oder Prod (Postgres) sind
const isPostgres = process.env.DB_TYPE === 'postgres';

export const config: VendureConfig = {
  apiOptions: {
    port: parseInt(process.env.PORT ?? '3000'),
    adminApiPath: 'admin-api', // Endpunkt für die Verwaltung
    shopApiPath: 'shop-api',   // Endpunkt für den Webshop
    cors: {
      origin: true,
      credentials: true,
    },
  },
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    requireVerification: false,
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME ?? 'superadmin',
      password: process.env.SUPERADMIN_PASSWORD ?? 'superadmin',
    },
  },
  paymentOptions: {
    paymentMethodHandlers: [],
  },
  dbConnectionOptions: isPostgres
    ? {
        type: 'postgres',
        host: process.env.DB_HOST ?? 'localhost',
        port: parseInt(process.env.DB_PORT ?? '5432'),
        database: process.env.DB_NAME ?? 'wine_server',
        username: process.env.DB_USER ?? 'vendure',
        password: process.env.DB_PASSWORD ?? 'vendure_pw',
        synchronize: true, // Erstellt Tabellen automatisch aus dem Code (nur für Dev!)
      }
    : {
        type: 'better-sqlite3',
        synchronize: true,
        database: path.join(__dirname, '..', 'data', 'vendure.sqlite'),
      },
  /**
   * PLUGINS: Die modulare Kraft von Vendure.
   * Hier "stecken" wir Features zusammen.
   */
  plugins: [
    // AssetServer kümmert sich um Bilder-Uploads
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, '..', 'data', 'assets'),
    }),
    DefaultSearchPlugin.init({ bufferUpdates: false }),
    DefaultJobQueuePlugin.init({}),
    // React Dashboard
    DashboardPlugin.init({
      route: 'dashboard',
      appDir: path.join(__dirname, '..', 'dist', 'dashboard'),
    }),
    // DEIN CUSTOM PLUGIN
    WineShowcasePlugin,
    // Manueller „Veröffentlichen"-Button im Dashboard → Netlify-Rebuild
    StorefrontDeployPlugin,
  ],
};
