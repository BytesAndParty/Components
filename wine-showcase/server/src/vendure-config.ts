import {
  VendureConfig,
  DefaultSearchPlugin,
  DefaultJobQueuePlugin,
  LanguageCode,
} from '@vendure/core';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config: VendureConfig = {
  apiOptions: {
    port: 3000,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    // CORS für Storefront auf Port 5173 (Vite Dev)
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
    },
  },
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    cookieOptions: {
      secret: 'wine-showcase-dev-secret',
    },
    superadminCredentials: {
      identifier: 'superadmin',
      password: 'superadmin',
    },
  },
  dbConnectionOptions: {
    type: 'better-sqlite3',
    synchronize: true,
    database: path.join(__dirname, '..', 'data', 'vendure.sqlite'),
  },
  plugins: [
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, '..', 'data', 'assets'),
    }),
    DefaultSearchPlugin.init({ bufferUpdates: false }),
    DefaultJobQueuePlugin.init({}),
    AdminUiPlugin.init({
      route: 'admin',
      port: 3002,
    }),
  ],
  customFields: {
    Product: [
      {
        name: 'jahrgang',
        type: 'int',
        label: [{ languageCode: LanguageCode.de, value: 'Jahrgang' }],
        description: [{ languageCode: LanguageCode.de, value: 'Erntejahr des Weins' }],
        nullable: true,
        public: true,
      },
      {
        name: 'rebsorte',
        type: 'string',
        label: [{ languageCode: LanguageCode.de, value: 'Rebsorte' }],
        description: [{ languageCode: LanguageCode.de, value: 'Traubensorte (z.B. Grüner Veltliner)' }],
        nullable: true,
        public: true,
      },
      {
        name: 'region',
        type: 'string',
        label: [{ languageCode: LanguageCode.de, value: 'Region' }],
        description: [{ languageCode: LanguageCode.de, value: 'Anbaugebiet' }],
        nullable: true,
        public: true,
      },
      {
        name: 'alkoholgehalt',
        type: 'float',
        label: [{ languageCode: LanguageCode.de, value: 'Alkoholgehalt (%)' }],
        nullable: true,
        public: true,
      },
      {
        name: 'geschmacksprofil',
        type: 'string',
        label: [{ languageCode: LanguageCode.de, value: 'Geschmacksprofil' }],
        description: [{ languageCode: LanguageCode.de, value: 'z.B. fruchtig, mineralisch, würzig' }],
        nullable: true,
        public: true,
      },
      {
        name: 'restzucker',
        type: 'float',
        label: [{ languageCode: LanguageCode.de, value: 'Restzucker (g/l)' }],
        nullable: true,
        public: true,
      },
      {
        name: 'saeure',
        type: 'float',
        label: [{ languageCode: LanguageCode.de, value: 'Säure (g/l)' }],
        nullable: true,
        public: true,
      },
      {
        name: 'serviertemperatur',
        type: 'string',
        label: [{ languageCode: LanguageCode.de, value: 'Serviertemperatur' }],
        description: [{ languageCode: LanguageCode.de, value: 'z.B. 8–10 °C' }],
        nullable: true,
        public: true,
      },
      {
        name: 'speiseempfehlung',
        type: 'text',
        label: [{ languageCode: LanguageCode.de, value: 'Speiseempfehlung' }],
        nullable: true,
        public: true,
      },
      {
        name: 'auszeichnungen',
        type: 'text',
        label: [{ languageCode: LanguageCode.de, value: 'Auszeichnungen' }],
        nullable: true,
        public: true,
      },
    ],
  },
};
