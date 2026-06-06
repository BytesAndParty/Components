// fallow-ignore-file security-sink — local dev seed: fetch() only ever targets the
// hardcoded localhost ADMIN_URL constant, never an attacker-controlled URL.

/**
 * SEED-SKRIPT
 * Befüllt eine leere (oder bestehende) Vendure-Datenbank über die Admin-API mit Demodaten.
 * Idempotent: existierende Datensätze werden übersprungen.
 *
 * Anlegt: Country/Zone/Tax/Channel/Shipping, Facets, Products + Variants
 *         + Facet-Zuweisungen, Collections mit Auto-Filter, Customer Groups,
 *         Customers, Promotions.
 */

const ADMIN_URL = 'http://localhost:3000/admin-api';

type GqlResponse<T = any> = { data?: T; errors?: Array<{ message: string }> };

async function seed() {
  // ─── 1. Login ──────────────────────────────────────────────────────────────
  const authRes = await fetch(ADMIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation {
          login(username: "superadmin", password: "superadmin") {
            ... on CurrentUser { id }
          }
        }
      `,
    }),
  });
  const vendureToken = authRes.headers.get('vendure-auth-token') ?? '';
  if (!vendureToken) throw new Error('Login fehlgeschlagen — kein vendure-auth-token erhalten.');

  async function adminGql<T = any>(query: string, variables?: Record<string, unknown>): Promise<GqlResponse<T>> {
    const res = await fetch(ADMIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${vendureToken}`,
      },
      body: JSON.stringify({ query, variables }),
    });
    return res.json() as Promise<GqlResponse<T>>;
  }

  // ─── 2. Bootstrap: Country, Zone, TaxCategory, TaxRate, Channel, Shipping ──
  let countryId: string;
  {
    const r = await adminGql(`query { countries { items { id code } } }`);
    const at = r.data?.countries?.items?.find((c: any) => c.code === 'AT');
    if (at) {
      countryId = at.id;
      console.log('  ⏭️  Country AT existiert');
    } else {
      const c = await adminGql(`
        mutation { createCountry(input: {
          code: "AT", translations: [{ languageCode: en, name: "Austria" }], enabled: true
        }) { id } }
      `);
      countryId = c.data!.createCountry.id;
      console.log('✅ Country AT angelegt');
    }
  }

  let zoneId: string;
  {
    const r = await adminGql(`query { zones { items { id name } } }`);
    const eu = r.data?.zones?.items?.find((z: any) => z.name === 'Europe');
    if (eu) {
      zoneId = eu.id;
      console.log('  ⏭️  Zone Europe existiert');
    } else {
      const z = await adminGql(`
        mutation { createZone(input: { name: "Europe", memberIds: ["${countryId}"] }) { id } }
      `);
      zoneId = z.data!.createZone.id;
      console.log('✅ Zone Europe angelegt');
    }
  }

  let taxCategoryId: string;
  {
    const r = await adminGql(`query { taxCategories { items { id } } }`);
    if (r.data?.taxCategories?.items?.length) {
      taxCategoryId = r.data.taxCategories.items[0].id;
      console.log('  ⏭️  TaxCategory existiert');
    } else {
      const t = await adminGql(`mutation { createTaxCategory(input: { name: "Standard" }) { id } }`);
      taxCategoryId = t.data!.createTaxCategory.id;
      console.log('✅ TaxCategory angelegt');
    }
  }

  {
    const r = await adminGql(`query { taxRates { items { id } } }`);
    if (!r.data?.taxRates?.items?.length) {
      await adminGql(
        `mutation CreateTaxRate($input: CreateTaxRateInput!) { createTaxRate(input: $input) { id } }`,
        {
          input: { name: 'Standard 20%', categoryId: taxCategoryId, zoneId, value: 20, enabled: true },
        },
      );
      console.log('✅ TaxRate 20% angelegt');
    } else {
      console.log('  ⏭️  TaxRate existiert');
    }
  }

  {
    const r = await adminGql(`query { channels { items { id } } }`);
    const ch = r.data?.channels?.items?.[0];
    if (ch) {
      await adminGql(
        `mutation UpdateChannel($input: UpdateChannelInput!) {
          updateChannel(input: $input) { ... on Channel { id } }
        }`,
        { input: { id: ch.id, defaultTaxZoneId: zoneId, defaultShippingZoneId: zoneId } },
      );
      console.log('✅ Channel default zones gesetzt');
    }
  }

  {
    const r = await adminGql(`query { shippingMethods { items { id } } }`);
    if (!r.data?.shippingMethods?.items?.length) {
      const sm = await adminGql(`
        mutation { createShippingMethod(input: {
          code: "standard-versand"
          translations: [{ languageCode: en, name: "Standardversand", description: "3-5 Werktage" }]
          fulfillmentHandler: "manual-fulfillment"
          checker: { code: "default-shipping-eligibility-checker", arguments: [{ name: "orderMinimum", value: "0" }] }
          calculator: { code: "default-shipping-calculator", arguments: [{ name: "rate", value: "590" }, { name: "includesTax", value: "auto" }] }
        }) { id } }
      `);
      if (sm.errors) console.log('⚠️  ShippingMethod:', JSON.stringify(sm.errors));
      else console.log('✅ Shipping Method angelegt');
    } else {
      console.log('  ⏭️  Shipping Method existiert');
    }
  }

  // ─── 3. Facets + FacetValues ───────────────────────────────────────────────
  // Facets sind die Filter-Dimensionen. Wir bauen drei:
  // "Farbe" (Rot/Weiß/Rosé), "Region" (Wachau, Burgenland, ...), "Auszeichnung" (Falstaff Gold).
  type FacetSpec = { code: string; name: string; values: Array<{ code: string; name: string }> };
  const facetSpecs: FacetSpec[] = [
    {
      code: 'farbe',
      name: 'Farbe',
      values: [
        { code: 'rotwein', name: 'Rotwein' },
        { code: 'weisswein', name: 'Weißwein' },
        { code: 'rose', name: 'Rosé' },
      ],
    },
    {
      code: 'region',
      name: 'Region',
      values: [
        { code: 'wachau', name: 'Wachau' },
        { code: 'burgenland', name: 'Burgenland' },
        { code: 'steiermark', name: 'Steiermark' },
        { code: 'suedsteiermark', name: 'Südsteiermark' },
        { code: 'neusiedlersee', name: 'Neusiedlersee' },
        { code: 'leithaberg', name: 'Leithaberg' },
      ],
    },
    {
      code: 'auszeichnung',
      name: 'Auszeichnung',
      values: [
        { code: 'falstaff-90plus', name: 'Falstaff 90+' },
        { code: 'falstaff-gold', name: 'Falstaff Gold (95+)' },
      ],
    },
  ];

  // Map: "facetCode:valueCode" → facetValueId
  const facetValueIds = new Map<string, string>();

  for (const spec of facetSpecs) {
    const existing = await adminGql(`
      query { facets(options: { filter: { code: { eq: "${spec.code}" } } }) {
        items { id code values { id code } }
      } }
    `);
    let facetId: string;
    let existingValueCodes: Set<string>;
    if (existing.data?.facets?.items?.length) {
      const f = existing.data.facets.items[0];
      facetId = f.id;
      existingValueCodes = new Set(f.values.map((v: any) => v.code));
      for (const v of f.values) facetValueIds.set(`${spec.code}:${v.code}`, v.id);
      console.log(`  ⏭️  Facet "${spec.name}" existiert`);
    } else {
      const created = await adminGql(
        `mutation CreateFacet($input: CreateFacetInput!) {
          createFacet(input: $input) { id values { id code } }
        }`,
        {
          input: {
            code: spec.code,
            isPrivate: false,
            translations: [{ languageCode: 'en', name: spec.name }],
            values: spec.values.map(v => ({
              code: v.code,
              translations: [{ languageCode: 'en', name: v.name }],
            })),
          },
        },
      );
      facetId = created.data!.createFacet.id;
      existingValueCodes = new Set(created.data!.createFacet.values.map((v: any) => v.code));
      for (const v of created.data!.createFacet.values) {
        facetValueIds.set(`${spec.code}:${v.code}`, v.id);
      }
      console.log(`✅ Facet "${spec.name}" + ${spec.values.length} Values angelegt`);
    }

    // Fehlende Values nachziehen
    const missing = spec.values.filter(v => !existingValueCodes.has(v.code));
    if (missing.length) {
      const created = await adminGql(
        `mutation CreateFacetValues($input: [CreateFacetValueInput!]!) {
          createFacetValues(input: $input) { id code }
        }`,
        {
          input: missing.map(v => ({
            facetId,
            code: v.code,
            translations: [{ languageCode: 'en', name: v.name }],
          })),
        },
      );
      for (const v of created.data!.createFacetValues) {
        facetValueIds.set(`${spec.code}:${v.code}`, v.id);
      }
      console.log(`  ➕ ${missing.length} fehlende Values für "${spec.name}" angelegt`);
    }
  }

  const fv = (key: string) => {
    const id = facetValueIds.get(key);
    if (!id) throw new Error(`FacetValue "${key}" wurde nicht angelegt.`);
    return id;
  };

  // ─── 4. Products + Variants + Facet-Zuweisungen ────────────────────────────
  type WineSpec = {
    name: string;
    slug: string;
    description: string;
    price: number;
    facetValueKeys: string[];
    customFields: Record<string, any>;
  };

  const wines: WineSpec[] = [
    {
      name: 'Grüner Veltliner Smaragd 2023',
      slug: 'gruener-veltliner-smaragd-2023',
      description: 'Unser Flaggschiff aus der Wachau. Mineralisch, komplex, mit Noten von weißem Pfeffer und grünem Apfel. Langes Reifepotenzial.',
      price: 2490,
      facetValueKeys: ['farbe:weisswein', 'region:wachau', 'auszeichnung:falstaff-90plus'],
      customFields: {
        jahrgang: 2023, rebsorte: 'Grüner Veltliner', region: 'Wachau',
        alkoholgehalt: 13.5, geschmacksprofil: 'mineralisch, würzig, Steinobst',
        restzucker: 2.1, saeure: 6.8, serviertemperatur: '10–12 °C',
        speiseempfehlung: 'Wiener Schnitzel, Spargel, Forelle Müllerin, gereifter Käse',
        auszeichnungen: 'Falstaff 93 Punkte, Vinaria Gold',
      },
    },
    {
      name: 'Blaufränkisch Reserve 2021',
      slug: 'blaufraenkisch-reserve-2021',
      description: 'Tiefgründiger Rotwein vom Leithaberg. 18 Monate im Barrique gereift. Dunkle Beeren, Schokolade und feine Tannine.',
      price: 3290,
      facetValueKeys: ['farbe:rotwein', 'region:burgenland', 'region:leithaberg', 'auszeichnung:falstaff-90plus'],
      customFields: {
        jahrgang: 2021, rebsorte: 'Blaufränkisch', region: 'Burgenland, Leithaberg',
        alkoholgehalt: 14.0, geschmacksprofil: 'Brombeere, Schokolade, Vanille, samtig',
        restzucker: 1.5, saeure: 5.4, serviertemperatur: '16–18 °C',
        speiseempfehlung: 'Rinderbraten, Wildragout, Hartkäse, dunkle Schokolade',
        auszeichnungen: 'Falstaff 92 Punkte',
      },
    },
    {
      name: 'Riesling Federspiel 2023',
      slug: 'riesling-federspiel-2023',
      description: 'Eleganter Riesling mit lebhafter Säure. Aromen von Zitrus, Pfirsich und einem Hauch von Feuerstein. Perfekter Terrassenwein.',
      price: 1890,
      facetValueKeys: ['farbe:weisswein', 'region:wachau'],
      customFields: {
        jahrgang: 2023, rebsorte: 'Riesling', region: 'Wachau',
        alkoholgehalt: 12.5, geschmacksprofil: 'Zitrus, Pfirsich, mineralisch, elegant',
        restzucker: 4.2, saeure: 7.1, serviertemperatur: '8–10 °C',
        speiseempfehlung: 'Meeresfrüchte, asiatische Küche, Ziegenkäse',
        auszeichnungen: '',
      },
    },
    {
      name: 'Zweigelt Classic 2022',
      slug: 'zweigelt-classic-2022',
      description: 'Unkomplizierter, fruchtbetonter Rotwein. Kirscharomen, weiche Tannine und ein samtiges Finish. Der perfekte Allrounder.',
      price: 1290,
      facetValueKeys: ['farbe:rotwein', 'region:burgenland'],
      customFields: {
        jahrgang: 2022, rebsorte: 'Zweigelt', region: 'Burgenland',
        alkoholgehalt: 13.0, geschmacksprofil: 'Kirsche, Pflaume, weich, fruchtig',
        restzucker: 2.0, saeure: 5.0, serviertemperatur: '14–16 °C',
        speiseempfehlung: 'Pizza, Pasta, Grillgerichte, Tapas',
        auszeichnungen: '',
      },
    },
    {
      name: 'Rosé vom Zweigelt 2023',
      slug: 'rose-zweigelt-2023',
      description: 'Frischer Rosé in zartem Lachston. Erdbeere und Wassermelone in der Nase, am Gaumen belebend und trocken.',
      price: 1190,
      facetValueKeys: ['farbe:rose', 'region:burgenland'],
      customFields: {
        jahrgang: 2023, rebsorte: 'Zweigelt (Rosé)', region: 'Burgenland',
        alkoholgehalt: 12.0, geschmacksprofil: 'Erdbeere, Wassermelone, frisch, trocken',
        restzucker: 3.5, saeure: 6.2, serviertemperatur: '6–8 °C',
        speiseempfehlung: 'Salate, Grillhuhn, leichte Vorspeisen',
        auszeichnungen: '',
      },
    },
    {
      name: 'Sauvignon Blanc Ried Steinberg 2022',
      slug: 'sauvignon-blanc-steinberg-2022',
      description: 'Lagencharakter pur. Stachelbeere, Holunder und tropische Früchte. Kräftig am Gaumen mit langem Abgang.',
      price: 2190,
      facetValueKeys: ['farbe:weisswein', 'region:suedsteiermark', 'auszeichnung:falstaff-90plus'],
      customFields: {
        jahrgang: 2022, rebsorte: 'Sauvignon Blanc', region: 'Südsteiermark',
        alkoholgehalt: 13.0, geschmacksprofil: 'Stachelbeere, Holunder, tropisch, kräftig',
        restzucker: 2.8, saeure: 6.5, serviertemperatur: '8–10 °C',
        speiseempfehlung: 'Fisch, Spargel, thailändische Küche, Ziegenkäse',
        auszeichnungen: 'Falstaff 91 Punkte',
      },
    },
    {
      name: 'Cuvée Pannobile 2020',
      slug: 'cuvee-pannobile-2020',
      description: 'Komplexe Cuvée aus Zweigelt, Blaufränkisch und St. Laurent. 24 Monate im großen Holzfass. Würze, Tiefe, Eleganz.',
      price: 4590,
      facetValueKeys: ['farbe:rotwein', 'region:burgenland', 'region:neusiedlersee', 'auszeichnung:falstaff-gold'],
      customFields: {
        jahrgang: 2020, rebsorte: 'Zweigelt, Blaufränkisch, St. Laurent', region: 'Burgenland, Neusiedlersee',
        alkoholgehalt: 14.5, geschmacksprofil: 'komplex, Gewürze, dunkle Frucht, Tabak',
        restzucker: 1.2, saeure: 5.2, serviertemperatur: '16–18 °C',
        speiseempfehlung: 'Geschmortes Lamm, Rehrücken, Trüffel, gereifter Bergkäse',
        auszeichnungen: 'Falstaff 95 Punkte, Robert Parker 93',
      },
    },
    {
      name: 'Gelber Muskateller 2023',
      slug: 'gelber-muskateller-2023',
      description: 'Aromatisches Erlebnis. Holunderblüte, Muskat und Litschi dominieren. Leicht und erfrischend — ideal als Aperitif.',
      price: 1490,
      facetValueKeys: ['farbe:weisswein', 'region:steiermark'],
      customFields: {
        jahrgang: 2023, rebsorte: 'Gelber Muskateller', region: 'Steiermark',
        alkoholgehalt: 11.5, geschmacksprofil: 'Holunderblüte, Muskat, Litschi, aromatisch',
        restzucker: 5.0, saeure: 6.0, serviertemperatur: '6–8 °C',
        speiseempfehlung: 'Aperitif, Obstsalat, asiatische Vorspeisen',
        auszeichnungen: '',
      },
    },
  ];

  for (const wine of wines) {
    const existing = await adminGql(`
      query { products(options: { filter: { slug: { eq: "${wine.slug}" } } }) {
        items { id slug variants { id } facetValues { id } }
      } }
    `);
    const existingProduct = existing.data?.products?.items?.[0];
    let productId = existingProduct?.id as string | undefined;

    if (productId) {
      // Facets an bestehendem Product nachpflegen (idempotent)
      const haveIds = new Set<string>(existingProduct.facetValues.map((v: any) => v.id));
      const wantIds = wine.facetValueKeys.map(fv);
      const missingIds = wantIds.filter(id => !haveIds.has(id));
      if (missingIds.length) {
        const mergedIds = Array.from(new Set([...haveIds, ...wantIds]));
        await adminGql(
          `mutation UpdateProduct($input: UpdateProductInput!) {
            updateProduct(input: $input) { id }
          }`,
          { input: { id: productId, facetValueIds: mergedIds } },
        );
        // Auch an der Variante hängen wir die gleichen Facets dran (für Search-Index)
        for (const variant of existingProduct.variants ?? []) {
          await adminGql(
            `mutation UpdateProductVariants($input: [UpdateProductVariantInput!]!) {
              updateProductVariants(input: $input) { id }
            }`,
            { input: [{ id: variant.id, facetValueIds: mergedIds }] },
          );
        }
        console.log(`  🔄 ${wine.name} — ${missingIds.length} Facet-Values nachgezogen`);
      } else {
        console.log(`  ⏭️  ${wine.name} existiert`);
      }
    } else {
      const created = await adminGql(
        `mutation CreateProduct($input: CreateProductInput!) {
          createProduct(input: $input) { id }
        }`,
        {
          input: {
            enabled: true,
            translations: [{
              languageCode: 'en',
              name: wine.name,
              slug: wine.slug,
              description: wine.description,
            }],
            customFields: wine.customFields,
            facetValueIds: wine.facetValueKeys.map(fv),
          },
        },
      );
      productId = created.data?.createProduct?.id;
      if (!productId) {
        console.error(`❌ ${wine.name}:`, JSON.stringify(created));
        continue;
      }

      const variantRes = await adminGql(
        `mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
          createProductVariants(input: $input) { id }
        }`,
        {
          input: [{
            productId,
            sku: wine.slug,
            taxCategoryId,
            translations: [{ languageCode: 'en', name: wine.name }],
            prices: [{ currencyCode: 'USD', price: wine.price }],
            stockOnHand: 100,
            trackInventory: 'INHERIT',
            facetValueIds: wine.facetValueKeys.map(fv),
          }],
        },
      );
      const variantId = variantRes.data?.createProductVariants?.[0]?.id;
      // Vendure v3 quirk: `prices` im Create wird teilweise ignoriert — Update als Workaround.
      if (variantId) {
        await adminGql(
          `mutation UpdateProductVariants($input: [UpdateProductVariantInput!]!) {
            updateProductVariants(input: $input) { id }
          }`,
          { input: [{ id: variantId, prices: [{ currencyCode: 'USD', price: wine.price }] }] },
        );
      }
      console.log(`✅ ${wine.name}`);
    }
  }

  // ─── 5. Collections mit Auto-Filter (facetValueFilter) ─────────────────────
  type CollectionSpec = { slug: string; name: string; facetValueKeys: string[] };
  const collectionSpecs: CollectionSpec[] = [
    { slug: 'rotweine', name: 'Rotweine', facetValueKeys: ['farbe:rotwein'] },
    { slug: 'weissweine', name: 'Weißweine', facetValueKeys: ['farbe:weisswein'] },
    { slug: 'rosé', name: 'Rosé', facetValueKeys: ['farbe:rose'] },
    { slug: 'wachau', name: 'Aus der Wachau', facetValueKeys: ['region:wachau'] },
    { slug: 'burgenland', name: 'Aus dem Burgenland', facetValueKeys: ['region:burgenland'] },
    { slug: 'praemiert', name: 'Prämierte Weine', facetValueKeys: ['auszeichnung:falstaff-90plus'] },
  ];

  for (const c of collectionSpecs) {
    const existing = await adminGql(`
      query { collections(options: { filter: { slug: { eq: "${c.slug}" } } }) {
        items { id slug }
      } }
    `);
    if (existing.data?.collections?.items?.length) {
      console.log(`  ⏭️  Collection "${c.name}" existiert`);
      continue;
    }
    const res = await adminGql(
      `mutation CreateCollection($input: CreateCollectionInput!) {
        createCollection(input: $input) { id }
      }`,
      {
        input: {
          isPrivate: false,
          translations: [{ languageCode: 'en', name: c.name, slug: c.slug, description: '' }],
          filters: [{
            code: 'facet-value-filter',
            arguments: [
              { name: 'facetValueIds', value: JSON.stringify(c.facetValueKeys.map(fv)) },
              { name: 'containsAny', value: 'true' },
            ],
          }],
        },
      },
    );
    if (res.errors) console.log(`⚠️  Collection "${c.name}":`, JSON.stringify(res.errors));
    else console.log(`✅ Collection "${c.name}"`);
  }

  // ─── 6. Customer Groups ────────────────────────────────────────────────────
  const groupSpecs = [
    { name: 'VIP-Kunden' },
    { name: 'Gastronomie' },
  ];
  const groupIds = new Map<string, string>();
  for (const g of groupSpecs) {
    const existing = await adminGql(`
      query { customerGroups(options: { filter: { name: { eq: "${g.name}" } } }) {
        items { id name }
      } }
    `);
    if (existing.data?.customerGroups?.items?.length) {
      groupIds.set(g.name, existing.data.customerGroups.items[0].id);
      console.log(`  ⏭️  Customer Group "${g.name}" existiert`);
    } else {
      const r = await adminGql(
        `mutation CreateCustomerGroup($input: CreateCustomerGroupInput!) {
          createCustomerGroup(input: $input) { id }
        }`,
        { input: { name: g.name, customerIds: [] } },
      );
      const id = r.data?.createCustomerGroup?.id;
      if (id) {
        groupIds.set(g.name, id);
        console.log(`✅ Customer Group "${g.name}"`);
      }
    }
  }

  // ─── 7. Customers ──────────────────────────────────────────────────────────
  type CustomerSpec = {
    email: string; firstName: string; lastName: string;
    phone?: string; group?: 'VIP-Kunden' | 'Gastronomie';
  };
  const customers: CustomerSpec[] = [
    { email: 'anna.huber@example.com', firstName: 'Anna', lastName: 'Huber' },
    { email: 'lukas.bauer@example.com', firstName: 'Lukas', lastName: 'Bauer', phone: '+43 660 1234567' },
    { email: 'maria.gruber@example.com', firstName: 'Maria', lastName: 'Gruber', group: 'VIP-Kunden' },
    { email: 'thomas.mayr@example.com', firstName: 'Thomas', lastName: 'Mayr', group: 'VIP-Kunden' },
    { email: 'kontakt@gasthaus-zur-post.at', firstName: 'Franz', lastName: 'Wirt', group: 'Gastronomie' },
    { email: 'einkauf@weinbar-wien.at', firstName: 'Sophie', lastName: 'Brandner', group: 'Gastronomie' },
  ];

  for (const c of customers) {
    const existing = await adminGql(`
      query { customers(options: { filter: { emailAddress: { eq: "${c.email}" } } }) {
        items { id emailAddress }
      } }
    `);
    let customerId = existing.data?.customers?.items?.[0]?.id as string | undefined;
    if (customerId) {
      console.log(`  ⏭️  Customer ${c.email} existiert`);
    } else {
      const r = await adminGql(
        `mutation CreateCustomer($input: CreateCustomerInput!) {
          createCustomer(input: $input) { ... on Customer { id } ... on ErrorResult { message } }
        }`,
        {
          input: {
            emailAddress: c.email,
            firstName: c.firstName,
            lastName: c.lastName,
            phoneNumber: c.phone,
          },
        },
      );
      customerId = r.data?.createCustomer?.id;
      if (!customerId) {
        console.log(`⚠️  Customer ${c.email}:`, JSON.stringify(r));
        continue;
      }
      console.log(`✅ Customer ${c.email}`);
    }

    // In Gruppe einsortieren
    if (c.group && customerId) {
      const groupId = groupIds.get(c.group);
      if (groupId) {
        await adminGql(
          `mutation AddCustomersToGroup($groupId: ID!, $customerIds: [ID!]!) {
            addCustomersToGroup(customerGroupId: $groupId, customerIds: $customerIds) { id }
          }`,
          { groupId, customerIds: [customerId] },
        );
      }
    }
  }

  // ─── 8. Promotions ─────────────────────────────────────────────────────────
  const vipGroupId = groupIds.get('VIP-Kunden');

  type PromoSpec = {
    name: string;
    couponCode?: string;
    conditions: Array<{ code: string; arguments: Array<{ name: string; value: string }> }>;
    actions: Array<{ code: string; arguments: Array<{ name: string; value: string }> }>;
  };
  const promos: PromoSpec[] = [
    {
      name: 'Willkommens-Rabatt 10%',
      couponCode: 'WILLKOMMEN10',
      conditions: [],
      actions: [{ code: 'order_percentage_discount', arguments: [{ name: 'discount', value: '10' }] }],
    },
    {
      name: 'Gratis Versand ab €50',
      conditions: [{
        code: 'minimum_order_amount',
        arguments: [
          { name: 'amount', value: '5000' },
          { name: 'taxInclusive', value: 'true' },
        ],
      }],
      actions: [{ code: 'free_shipping', arguments: [] }],
    },
    ...(vipGroupId
      ? [{
          name: 'VIP-Rabatt 15%',
          conditions: [{
            code: 'customer_group',
            arguments: [{ name: 'customerGroupId', value: vipGroupId }],
          }],
          actions: [{ code: 'order_percentage_discount', arguments: [{ name: 'discount', value: '15' }] }],
        } as PromoSpec]
      : []),
  ];

  for (const p of promos) {
    const existing = await adminGql(`
      query { promotions(options: { filter: { name: { eq: "${p.name}" } } }) {
        items { id name }
      } }
    `);
    if (existing.data?.promotions?.items?.length) {
      console.log(`  ⏭️  Promotion "${p.name}" existiert`);
      continue;
    }
    const r = await adminGql(
      `mutation CreatePromotion($input: CreatePromotionInput!) {
        createPromotion(input: $input) { ... on Promotion { id } ... on ErrorResult { message } }
      }`,
      {
        input: {
          enabled: true,
          couponCode: p.couponCode,
          translations: [{ languageCode: 'en', name: p.name, description: p.name }],
          conditions: p.conditions,
          actions: p.actions,
        },
      },
    );
    if (r.errors || r.data?.createPromotion?.message) {
      console.log(`⚠️  Promotion "${p.name}":`, JSON.stringify(r.errors ?? r.data));
    } else {
      console.log(`✅ Promotion "${p.name}"${p.couponCode ? ` (Code: ${p.couponCode})` : ''}`);
    }
  }

  // ─── Fertig ────────────────────────────────────────────────────────────────
  console.log('\n🍷 Seed abgeschlossen!');
  console.log('   Admin UI: http://localhost:3002/admin');
  console.log('   Login: superadmin / superadmin');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
