import { LanguageCode, PluginCommonModule, VendurePlugin } from '@vendure/core';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { gql } from 'graphql-tag';

/**
 * Ein Resolver ist dafür zuständig, GraphQL-Anfragen zu beantworten.
 * Hier definieren wir eine einfache Logik, um einen Wein zu "bewerten" (Upvote).
 */
@Resolver()
export class WineReviewResolver {
  @Mutation()
  upvoteWine(@Args() args: { productId: string }) {
    console.log(`👍 Wein mit ID ${args.productId} hat ein Upvote erhalten!`);
    // In einer echten App würden wir hier die Datenbank (TypeORM) nutzen.
    return true;
  }
}

/**
 * DAS WINE-SHOWCASE PLUGIN
 * Ein Plugin ist die modulare Einheit in Vendure. Hier bündeln wir:
 * 1. Custom Fields (Datenbank-Erweiterungen)
 * 2. API-Erweiterungen (neue Mutationen/Queries)
 */
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [WineReviewResolver], // Hier registrieren wir unseren Resolver
  configuration: (config) => {
    /**
     * CUSTOM FIELDS: Erlauben es, neue Spalten zu bestehenden Tabellen
     * (wie Product) hinzuzufügen, ohne das Core-Schema zu ändern.
     *
     * Idempotent: bootstrap(config) + bootstrapWorker(config) im selben Process
     * ruft `configuration` zweimal — ohne den Guard würden Fields doppelt registriert.
     */
    const existing = new Set(config.customFields.Product.map((f) => f.name));
    if (existing.has('jahrgang')) return config;
    config.customFields.Product.push(
      {
        name: 'jahrgang',
        type: 'int',
        label: [{ languageCode: LanguageCode.de, value: 'Jahrgang' }],
        public: true, // Wichtig: public: true macht das Feld in der Shop-API sichtbar
      },
      {
        name: 'rebsorte',
        type: 'string',
        label: [{ languageCode: LanguageCode.de, value: 'Rebsorte' }],
        public: true,
      },
      {
        name: 'region',
        type: 'string',
        label: [{ languageCode: LanguageCode.de, value: 'Region' }],
        public: true,
      },
      {
        name: 'alkoholgehalt',
        type: 'float',
        label: [{ languageCode: LanguageCode.de, value: 'Alkoholgehalt (% vol.)' }],
        public: true,
      },
      {
        name: 'geschmacksprofil',
        type: 'string',
        label: [{ languageCode: LanguageCode.de, value: 'Geschmacksprofil' }],
        public: true,
      },
      {
        name: 'restzucker',
        type: 'float',
        label: [{ languageCode: LanguageCode.de, value: 'Restzucker (g/l)' }],
        public: true,
      },
      {
        name: 'saeure',
        type: 'float',
        label: [{ languageCode: LanguageCode.de, value: 'Säure (g/l)' }],
        public: true,
      },
      {
        name: 'serviertemperatur',
        type: 'string',
        label: [{ languageCode: LanguageCode.de, value: 'Serviertemperatur' }],
        public: true,
      },
      {
        name: 'speiseempfehlung',
        type: 'text',
        label: [{ languageCode: LanguageCode.de, value: 'Speiseempfehlung' }],
        public: true,
      },
      {
        name: 'auszeichnungen',
        type: 'string',
        label: [{ languageCode: LanguageCode.de, value: 'Auszeichnungen' }],
        public: true,
      },
    );
    return config;
  },
  /**
   * SHOP API ERWEITERUNG:
   * Hier definieren wir das neue GraphQL-Schema für den Shop.
   */
  shopApiExtensions: {
    schema: gql`
      extend type Mutation {
        upvoteWine(productId: ID!): Boolean!
      }
    `,
    resolvers: [WineReviewResolver],
  },
})
export class WineShowcasePlugin {}
