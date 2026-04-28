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

const isPostgres = process.env.DB_TYPE === 'postgres';

const corsOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:4321')
  .split(',')
  .map((o) => o.trim());

export const config: VendureConfig = {
  apiOptions: {
    port: parseInt(process.env.PORT ?? '3000'),
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    cors: {
      origin: corsOrigins,
      credentials: true,
    },
  },
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    cookieOptions: {
      secret: process.env.COOKIE_SECRET ?? 'wine-showcase-dev-secret',
    },
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME ?? 'superadmin',
      password: process.env.SUPERADMIN_PASSWORD ?? 'superadmin',
    },
  },
  dbConnectionOptions: isPostgres
    ? {
        type: 'postgres',
        host: process.env.DB_HOST ?? 'localhost',
        port: parseInt(process.env.DB_PORT ?? '5432'),
        database: process.env.DB_NAME ?? 'wine_server',
        username: process.env.DB_USER ?? 'vendure',
        password: process.env.DB_PASSWORD ?? 'vendure_pw',
        synchronize: process.env.NODE_ENV !== 'production',
        logging: false,
      }
    : {
        type: 'better-sqlite3',
        synchronize: true,
        database: path.join(__dirname, '..', 'data', 'vendure.sqlite'),
        logging: false,
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
      port: parseInt(process.env.ADMIN_PORT ?? '3002'),
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
