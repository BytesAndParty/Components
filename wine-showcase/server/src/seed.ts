/**
 * Seed-Skript: Legt Produkte mit Wein-Custom-Fields über die Admin API an.
 * Setzt voraus, dass der Vendure Server bereits läuft (bun run dev).
 */

const ADMIN_URL = 'http://localhost:3000/admin-api';

async function seed() {
  // 1. Authenticate as superadmin
  const authRes = await fetch(ADMIN_URL, {
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
  const authData = await authRes.json() as Record<string, unknown>;

  // Vendure v3: Auth-Token aus verschiedenen Header-Varianten extrahieren
  const setCookie = authRes.headers.get('set-cookie') ?? '';
  const vendureToken = authRes.headers.get('vendure-auth-token') ?? '';

  // Debug: alle relevanten Header ausgeben
  console.log('Auth result:', JSON.stringify(authData));
  console.log('Set-Cookie:', setCookie ? 'present' : 'none');
  console.log('vendure-auth-token:', vendureToken || 'none');

  // Helper: Admin GQL request with auth
  async function adminGql(query: string, variables?: Record<string, unknown>) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (setCookie) headers['Cookie'] = setCookie;
    if (vendureToken) headers['vendure-auth-token'] = vendureToken;
    // Vendure Bearer token auth (v3 default)
    if (vendureToken) headers['Authorization'] = `Bearer ${vendureToken}`;

    const res = await fetch(ADMIN_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });
    return res.json() as Promise<any>;
  }

  // ─── 2. Bootstrap: Country, Zone, TaxCategory, TaxRate, Channel ────────────

  // 2a. Create Country (Austria)
  let countryResult = await adminGql(`query { countries { items { id code } } }`);
  let countryId: string;
  if (!countryResult.data?.countries?.items?.length) {
    const createCountry = await adminGql(`
      mutation {
        createCountry(input: { code: "AT", translations: [{ languageCode: en, name: "Austria" }], enabled: true }) { id code }
      }
    `);
    countryId = createCountry.data?.createCountry?.id;
    console.log('✅ Country AT angelegt');
  } else {
    countryId = countryResult.data.countries.items[0].id;
    console.log('  ⏭️  Country existiert bereits');
  }

  // 2b. Create Zone
  let zoneResult = await adminGql(`query { zones { items { id name } } }`);
  let zoneId: string;
  if (!zoneResult.data?.zones?.items?.length) {
    const createZone = await adminGql(`
      mutation {
        createZone(input: { name: "Europe", memberIds: ["${countryId}"] }) { id name }
      }
    `);
    zoneId = createZone.data?.createZone?.id;
    console.log('✅ Zone "Europe" angelegt');
  } else {
    zoneId = zoneResult.data.zones.items[0].id;
    console.log('  ⏭️  Zone existiert bereits');
  }

  // 2c. Create TaxCategory
  const taxCatResult = await adminGql(`query { taxCategories { items { id } } }`);
  let taxCategoryId: string;
  if (!taxCatResult.data?.taxCategories?.items?.length) {
    const createTax = await adminGql(`
      mutation { createTaxCategory(input: { name: "Standard" }) { id } }
    `);
    taxCategoryId = createTax.data?.createTaxCategory?.id;
    console.log('✅ TaxCategory angelegt');
  } else {
    taxCategoryId = taxCatResult.data.taxCategories.items[0].id;
    console.log('  ⏭️  TaxCategory existiert bereits');
  }

  // 2d. Create TaxRate
  const taxRateResult = await adminGql(`query { taxRates { items { id } } }`);
  if (!taxRateResult.data?.taxRates?.items?.length) {
    await adminGql(`
      mutation CreateTaxRate($input: CreateTaxRateInput!) {
        createTaxRate(input: $input) { id }
      }
    `, {
      input: {
        name: 'Standard 20%',
        categoryId: taxCategoryId,
        zoneId: zoneId,
        value: 20,
        enabled: true,
      },
    });
    console.log('✅ TaxRate 20% angelegt');
  } else {
    console.log('  ⏭️  TaxRate existiert bereits');
  }

  // 2e. Update default Channel with the zone as defaultTaxZone and defaultShippingZone
  const channelResult = await adminGql(`query { channels { items { id code } } }`);
  const defaultChannel = channelResult.data?.channels?.items?.[0];
  if (defaultChannel) {
    const updateResult = await adminGql(`
      mutation UpdateChannel($input: UpdateChannelInput!) {
        updateChannel(input: $input) {
          ... on Channel { id code }
          ... on LanguageNotAvailableError { message }
        }
      }
    `, {
      input: {
        id: defaultChannel.id,
        defaultTaxZoneId: zoneId,
        defaultShippingZoneId: zoneId,
      },
    });
    console.log('✅ Channel default zones gesetzt');
  }

  // 3. Create a ShippingMethod if none exist
  const shippingResult = await adminGql(`
    query { shippingMethods { items { id } } }
  `);
  if (!shippingResult.data?.shippingMethods?.items?.length) {
    const smResult = await adminGql(`
      mutation {
        createShippingMethod(input: {
          code: "standard-versand"
          translations: [{ languageCode: en, name: "Standardversand", description: "3-5 Werktage" }]
          fulfillmentHandler: "manual-fulfillment"
          checker: { code: "default-shipping-eligibility-checker", arguments: [{ name: "orderMinimum", value: "0" }] }
          calculator: { code: "default-shipping-calculator", arguments: [{ name: "rate", value: "590" }, { name: "includesTax", value: "auto" }] }
        }) { id }
      }
    `);
    if (smResult.errors) {
      console.log('⚠️  ShippingMethod:', JSON.stringify(smResult.errors));
    } else {
      console.log('✅ Shipping Method angelegt');
    }
  } else {
    console.log('  ⏭️  Shipping Method existiert bereits');
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
      query {
        products(options: { filter: { slug: { eq: "${wine.slug}" } } }) {
          items { id slug }
        }
      }
    `);

    if (existing.data?.products?.items?.length > 0) {
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
        enabled: true,
        translations: [{
          languageCode: 'en',
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
    const variantResult = await adminGql(`
      mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
        createProductVariants(input: $input) {
          id sku priceWithTax
        }
      }
    `, {
      input: [{
        productId,
        sku: wine.slug,
        taxCategoryId,
        translations: [{
          languageCode: 'en',
          name: wine.name,
        }],
        prices: [{ currencyCode: 'USD', price: wine.price }],
        stockOnHand: 100,
        trackInventory: 'INHERIT',
      }],
    });

    if (variantResult.errors) {
      console.error(`  ❌ Variant Fehler bei ${wine.name}:`, JSON.stringify(variantResult.errors));
    } else {
      const v = variantResult.data?.createProductVariants?.[0];
      // Vendure v3 bug: prices array in createProductVariants doesn't set the price.
      // Workaround: update the variant price after creation.
      if (v?.id) {
        const updatePrice = await adminGql(`
          mutation UpdateProductVariants($input: [UpdateProductVariantInput!]!) {
            updateProductVariants(input: $input) { id priceWithTax }
          }
        `, {
          input: [{ id: v.id, prices: [{ currencyCode: 'USD', price: wine.price }] }],
        });
        const updated = updatePrice.data?.updateProductVariants?.[0];
        console.log(`  ✅ ${wine.name} — Variant ID ${v.id}, Preis: ${updated?.priceWithTax ?? '?'}`);
      }
    }
  }

  console.log('\n🍷 Seed abgeschlossen!');
  console.log('   Admin UI: http://localhost:3000/admin');
  console.log('   Login: superadmin / superadmin');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
