import { bootstrap, ChannelService, LanguageCode } from '@vendure/core';
import { config } from './vendure-config.js';

/**
 * Seed-Skript: Legt den Default Channel an, erstellt Produkte mit Wein-Custom-Fields.
 * Wird einmalig via `bun run seed` ausgeführt.
 *
 * Vendure seeded den SuperAdmin automatisch beim ersten Start.
 * Die Produkte werden über die Admin API GraphQL angelegt.
 */
async function seed() {
  const app = await bootstrap(config);

  // Vendure Admin API intern ansprechen
  const adminUrl = 'http://localhost:3000/admin-api';

  // 1. Authenticate as superadmin
  const authRes = await fetch(adminUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation {
          login(username: "superadmin", password: "superadmin") {
            ... on CurrentUser { id }
            ... on InvalidCredentialsError { message }
          }
        }
      `,
    }),
  });
  const authData = await authRes.json();
  const authCookie = authRes.headers.get('set-cookie') ?? '';
  console.log('Auth:', JSON.stringify(authData));

  // Helper: Admin GQL request with auth
  async function adminGql(query: string, variables?: Record<string, unknown>) {
    const res = await fetch(adminUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie,
      },
      body: JSON.stringify({ query, variables }),
    });
    return res.json();
  }

  // 2. Create a TaxCategory & TaxRate if none exist
  const taxCatResult = await adminGql(`
    query { taxCategories { items { id } } }
  `);
  let taxCategoryId: string;
  if (!taxCatResult.data?.taxCategories?.items?.length) {
    const createTax = await adminGql(`
      mutation {
        createTaxCategory(input: { name: "Standard" }) { id }
      }
    `);
    taxCategoryId = createTax.data.createTaxCategory.id;

    // Get default zone
    const zones = await adminGql(`query { zones { items { id name } } }`);
    const defaultZone = zones.data?.zones?.items?.[0];
    if (defaultZone) {
      await adminGql(`
        mutation CreateTaxRate($input: CreateTaxRateInput!) {
          createTaxRate(input: $input) { id }
        }
      `, {
        input: {
          name: 'Standard 20%',
          categoryId: taxCategoryId,
          zoneId: defaultZone.id,
          value: 20,
          enabled: true,
        },
      });
    }
  } else {
    taxCategoryId = taxCatResult.data.taxCategories.items[0].id;
  }

  // 3. Create a ShippingMethod if none exist
  const shippingResult = await adminGql(`
    query { shippingMethods { items { id } } }
  `);
  if (!shippingResult.data?.shippingMethods?.items?.length) {
    await adminGql(`
      mutation {
        createShippingMethod(input: {
          code: "standard-versand"
          translations: [{ languageCode: de, name: "Standardversand", description: "3-5 Werktage" }]
          fulfillmentHandler: "manual-fulfillment"
          checker: { code: "default-shipping-eligibility-checker", arguments: [{ name: "orderMinimum", value: "0" }] }
          calculator: { code: "default-shipping-calculator", arguments: [{ name: "rate", value: "590" }, { name: "includesTax", value: "auto" }] }
        }) { id }
      }
    `);
    console.log('✅ Shipping Method angelegt');
  }

  // 4. Create wine products
  const wines = [
    {
      name: 'Grüner Veltliner Smaragd 2023',
      slug: 'gruener-veltliner-smaragd-2023',
      description: 'Unser Flaggschiff aus der Wachau. Mineralisch, komplex, mit Noten von weißem Pfeffer und grünem Apfel. Langes Reifepotenzial.',
      price: 2490,
      customFields: {
        jahrgang: 2023,
        rebsorte: 'Grüner Veltliner',
        region: 'Wachau',
        alkoholgehalt: 13.5,
        geschmacksprofil: 'mineralisch, würzig, Steinobst',
        restzucker: 2.1,
        saeure: 6.8,
        serviertemperatur: '10–12 °C',
        speiseempfehlung: 'Wiener Schnitzel, Spargel, Forelle Müllerin, gereifter Käse',
        auszeichnungen: 'Falstaff 93 Punkte, Vinaria Gold',
      },
    },
    {
      name: 'Blaufränkisch Reserve 2021',
      slug: 'blaufraenkisch-reserve-2021',
      description: 'Tiefgründiger Rotwein vom Leithaberg. 18 Monate im Barrique gereift. Dunkle Beeren, Schokolade und feine Tannine.',
      price: 3290,
      customFields: {
        jahrgang: 2021,
        rebsorte: 'Blaufränkisch',
        region: 'Burgenland, Leithaberg',
        alkoholgehalt: 14.0,
        geschmacksprofil: 'Brombeere, Schokolade, Vanille, samtig',
        restzucker: 1.5,
        saeure: 5.4,
        serviertemperatur: '16–18 °C',
        speiseempfehlung: 'Rinderbraten, Wildragout, Hartkäse, dunkle Schokolade',
        auszeichnungen: 'Falstaff 92 Punkte',
      },
    },
    {
      name: 'Riesling Federspiel 2023',
      slug: 'riesling-federspiel-2023',
      description: 'Eleganter Riesling mit lebhafter Säure. Aromen von Zitrus, Pfirsich und einem Hauch von Feuerstein. Perfekter Terrassenwein.',
      price: 1890,
      customFields: {
        jahrgang: 2023,
        rebsorte: 'Riesling',
        region: 'Wachau',
        alkoholgehalt: 12.5,
        geschmacksprofil: 'Zitrus, Pfirsich, mineralisch, elegant',
        restzucker: 4.2,
        saeure: 7.1,
        serviertemperatur: '8–10 °C',
        speiseempfehlung: 'Meeresfrüchte, asiatische Küche, Ziegenkäse',
        auszeichnungen: '',
      },
    },
    {
      name: 'Zweigelt Classic 2022',
      slug: 'zweigelt-classic-2022',
      description: 'Unkomplizierter, fruchtbetonter Rotwein. Kirscharomen, weiche Tannine und ein samtiges Finish. Der perfekte Allrounder.',
      price: 1290,
      customFields: {
        jahrgang: 2022,
        rebsorte: 'Zweigelt',
        region: 'Burgenland',
        alkoholgehalt: 13.0,
        geschmacksprofil: 'Kirsche, Pflaume, weich, fruchtig',
        restzucker: 2.0,
        saeure: 5.0,
        serviertemperatur: '14–16 °C',
        speiseempfehlung: 'Pizza, Pasta, Grillgerichte, Tapas',
        auszeichnungen: '',
      },
    },
    {
      name: 'Rosé vom Zweigelt 2023',
      slug: 'rose-zweigelt-2023',
      description: 'Frischer Rosé in zartem Lachston. Erdbeere und Wassermelone in der Nase, am Gaumen belebend und trocken.',
      price: 1190,
      customFields: {
        jahrgang: 2023,
        rebsorte: 'Zweigelt (Rosé)',
        region: 'Burgenland',
        alkoholgehalt: 12.0,
        geschmacksprofil: 'Erdbeere, Wassermelone, frisch, trocken',
        restzucker: 3.5,
        saeure: 6.2,
        serviertemperatur: '6–8 °C',
        speiseempfehlung: 'Salate, Grillhuhn, leichte Vorspeisen',
        auszeichnungen: '',
      },
    },
    {
      name: 'Sauvignon Blanc Ried Steinberg 2022',
      slug: 'sauvignon-blanc-steinberg-2022',
      description: 'Lagencharakter pur. Stachelbeere, Holunder und tropische Früchte. Kräftig am Gaumen mit langem Abgang.',
      price: 2190,
      customFields: {
        jahrgang: 2022,
        rebsorte: 'Sauvignon Blanc',
        region: 'Südsteiermark',
        alkoholgehalt: 13.0,
        geschmacksprofil: 'Stachelbeere, Holunder, tropisch, kräftig',
        restzucker: 2.8,
        saeure: 6.5,
        serviertemperatur: '8–10 °C',
        speiseempfehlung: 'Fisch, Spargel, thailändische Küche, Ziegenkäse',
        auszeichnungen: 'Falstaff 91 Punkte',
      },
    },
    {
      name: 'Cuvée Pannobile 2020',
      slug: 'cuvee-pannobile-2020',
      description: 'Komplexe Cuvée aus Zweigelt, Blaufränkisch und St. Laurent. 24 Monate im großen Holzfass. Würze, Tiefe, Eleganz.',
      price: 4590,
      customFields: {
        jahrgang: 2020,
        rebsorte: 'Zweigelt, Blaufränkisch, St. Laurent',
        region: 'Burgenland, Neusiedlersee',
        alkoholgehalt: 14.5,
        geschmacksprofil: 'komplex, Gewürze, dunkle Frucht, Tabak',
        restzucker: 1.2,
        saeure: 5.2,
        serviertemperatur: '16–18 °C',
        speiseempfehlung: 'Geschmortes Lamm, Rehrücken, Trüffel, gereifter Bergkäse',
        auszeichnungen: 'Falstaff 95 Punkte, Robert Parker 93',
      },
    },
    {
      name: 'Gelber Muskateller 2023',
      slug: 'gelber-muskateller-2023',
      description: 'Aromatisches Erlebnis. Holunderblüte, Muskat und Litschi dominieren. Leicht und erfrischend — ideal als Aperitif.',
      price: 1490,
      customFields: {
        jahrgang: 2023,
        rebsorte: 'Gelber Muskateller',
        region: 'Steiermark',
        alkoholgehalt: 11.5,
        geschmacksprofil: 'Holunderblüte, Muskat, Litschi, aromatisch',
        restzucker: 5.0,
        saeure: 6.0,
        serviertemperatur: '6–8 °C',
        speiseempfehlung: 'Aperitif, Obstsalat, asiatische Vorspeisen',
        auszeichnungen: '',
      },
    },
  ];

  for (const wine of wines) {
    // Check if product already exists
    const existing = await adminGql(`
      query($slug: String!) {
        product(slug: $slug) { id }
      }
    `, { slug: wine.slug });

    if (existing.data?.product) {
      console.log(`  ⏭️  ${wine.name} existiert bereits`);
      continue;
    }

    // Create product
    const createResult = await adminGql(`
      mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
          id
          slug
        }
      }
    `, {
      input: {
        translations: [{
          languageCode: 'de',
          name: wine.name,
          slug: wine.slug,
          description: wine.description,
        }],
        customFields: wine.customFields,
      },
    });

    const productId = createResult.data?.createProduct?.id;
    if (!productId) {
      console.error(`❌ Fehler bei ${wine.name}:`, JSON.stringify(createResult));
      continue;
    }

    // Create product variant (single variant per wine)
    await adminGql(`
      mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
        createProductVariants(input: $input) {
          ... on ProductVariant { id sku }
          ... on ErrorResult { message }
        }
      }
    `, {
      input: [{
        productId,
        sku: wine.slug,
        taxCategoryId,
        translations: [{
          languageCode: 'de',
          name: wine.name,
        }],
        price: wine.price,
        stockOnHand: 100,
        trackInventory: false,
      }],
    });

    console.log(`  ✅ ${wine.name} angelegt (€ ${(wine.price / 100).toFixed(2)})`);
  }

  console.log('\n🍷 Seed abgeschlossen!');
  console.log('   Admin UI: http://localhost:3002/admin');
  console.log('   Login: superadmin / superadmin');

  await app.close();
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
