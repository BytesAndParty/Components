import { LanguageCode, PluginCommonModule, VendurePlugin } from '@vendure/core';

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: (config) => {
    config.customFields.Product.push(
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
    );
    return config;
  },
})
export class WineShowcasePlugin {}
