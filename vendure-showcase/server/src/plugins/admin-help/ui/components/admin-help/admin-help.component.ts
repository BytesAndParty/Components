import { Component } from '@angular/core';
import { SharedModule } from '@vendure/admin-ui/core';

@Component({
  selector: 'admin-help',
  standalone: true,
  imports: [SharedModule],
  styles: [
    `
      :host {
        display: block;
      }
      .help-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
        margin-block: 1rem;
      }
      .help-card {
        border: 1px solid var(--color-component-border-200, #e5e7eb);
        border-radius: 8px;
        padding: 1rem 1.25rem;
        background: var(--color-component-bg-100, #fff);
      }
      .help-card h3 {
        margin-top: 0;
        font-size: 1rem;
        font-weight: 600;
      }
      .help-card ul {
        margin: 0;
        padding-inline-start: 1.1rem;
      }
      .help-card li {
        margin-block: 0.25rem;
      }
      details {
        border: 1px solid var(--color-component-border-200, #e5e7eb);
        border-radius: 8px;
        padding: 0.75rem 1rem;
        margin-block: 0.5rem;
        background: var(--color-component-bg-100, #fff);
      }
      details[open] {
        background: var(--color-component-bg-200, #fafafa);
      }
      summary {
        cursor: pointer;
        font-weight: 600;
      }
      details ol,
      details ul {
        margin-block: 0.5rem;
        padding-inline-start: 1.25rem;
      }
      details li {
        margin-block: 0.25rem;
      }
      .lead {
        color: var(--color-text-200, #4b5563);
        max-width: 70ch;
      }
      kbd {
        background: var(--color-component-bg-200, #f3f4f6);
        border: 1px solid var(--color-component-border-200, #e5e7eb);
        border-radius: 4px;
        padding: 0 0.35em;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 0.9em;
      }
    `,
  ],
  template: `
    <vdr-page-block>
      <h1>Anleitung für die Wein-Admin</h1>
      <p class="lead">
        Diese Seite erklärt, wofür die einzelnen Bereiche der Verwaltung da sind und wie du
        die häufigsten Aufgaben erledigst. Wenn du etwas nicht findest oder unsicher bist:
        einfach durchklicken — kaputt machen kannst du nichts, solange du keine Bestellungen
        bearbeitest.
      </p>

      <h2>Die Sidebar im Überblick</h2>
      <div class="help-grid">
        <div class="help-card">
          <h3>Catalog</h3>
          <ul>
            <li><strong>Products</strong> — alle Weine. Hier legst du neue Weine an.</li>
            <li><strong>Facets</strong> — Filter-Tags wie Rebsorte, Region, Jahrgang.</li>
            <li><strong>Collections</strong> — Kategorien wie "Rotwein" oder "Bio".</li>
            <li><strong>Assets</strong> — Bilder und Datenblätter.</li>
          </ul>
        </div>
        <div class="help-card">
          <h3>Sales</h3>
          <ul>
            <li><strong>Orders</strong> — eingegangene Bestellungen, Versand, Rückerstattungen.</li>
          </ul>
        </div>
        <div class="help-card">
          <h3>Customers</h3>
          <ul>
            <li><strong>Customers</strong> — alle registrierten Kunden mit Bestellhistorie.</li>
            <li><strong>Customer groups</strong> — Gruppen für z.&nbsp;B. B2B-Händler.</li>
          </ul>
        </div>
        <div class="help-card">
          <h3>Marketing</h3>
          <ul>
            <li><strong>Promotions</strong> — Rabatte, Gutscheincodes, Sonderaktionen.</li>
          </ul>
        </div>
      </div>

      <h2>Schritt-für-Schritt</h2>

      <details>
        <summary>Einen neuen Wein anlegen</summary>
        <ol>
          <li>Catalog → <em>Products</em> → Button <strong>Create new product</strong>.</li>
          <li>Name, Slug und Beschreibung eintragen.</li>
          <li>Bilder unter <em>Assets</em> hochladen und dem Produkt zuweisen.</li>
          <li>
            Im Reiter <em>Variants</em> mindestens eine Variante anlegen (z.&nbsp;B. 0,75&nbsp;l).
            Pro Variante: SKU, Preis, Lagerbestand.
          </li>
          <li>
            Custom Fields ausfüllen: Jahrgang, Rebsorte, Region, Alkoholgehalt, Geschmacksprofil,
            Restzucker, Säure, Serviertemperatur, Speiseempfehlung, Auszeichnungen.
          </li>
          <li>Facet-Tags zuweisen (Rebsorte, Region etc.), damit der Wein in Filtern auftaucht.</li>
          <li>Speichern. Im Storefront ist der Wein nach kurzer Indexierung sichtbar.</li>
        </ol>
      </details>

      <details>
        <summary>Preis oder Lagerbestand ändern</summary>
        <ol>
          <li>Product öffnen → Reiter <em>Variants</em>.</li>
          <li>Variante anklicken → Preis oder <em>Stock on hand</em> ändern.</li>
          <li>Save.</li>
        </ol>
        <p>
          Hinweis: Die Anzeige im Storefront kann ein paar Sekunden brauchen, bis der Cache
          aktualisiert ist.
        </p>
      </details>

      <details>
        <summary>Eine Bestellung versenden</summary>
        <ol>
          <li>Sales → <em>Orders</em> → Bestellung öffnen.</li>
          <li>
            Status prüfen: muss <strong>PaymentSettled</strong> sein, sonst zuerst Zahlung
            klären.
          </li>
          <li>Button <strong>Fulfill order</strong> → Lieferdienst und Tracking-Nummer eintragen.</li>
          <li>Confirm. Der Kunde bekommt automatisch eine Versandbestätigung.</li>
        </ol>
      </details>

      <details>
        <summary>Eine Rückerstattung ausstellen</summary>
        <ol>
          <li>Orders → betroffene Bestellung öffnen.</li>
          <li>Button <strong>Refund</strong>.</li>
          <li>Positionen wählen oder vollen Betrag, Grund eintragen.</li>
          <li>Confirm.</li>
        </ol>
      </details>

      <details>
        <summary>Einen Rabattcode anlegen</summary>
        <ol>
          <li>Marketing → <em>Promotions</em> → <strong>Create new promotion</strong>.</li>
          <li>Name (intern) und Beschreibung (sichtbar im Checkout).</li>
          <li>
            <em>Conditions</em>: z.&nbsp;B. <em>Customer has coupon code</em> → Code festlegen.
          </li>
          <li><em>Actions</em>: z.&nbsp;B. <em>Discount order by percentage</em> → 10 %.</li>
          <li>Enabled-Schalter aktivieren, Speichern.</li>
        </ol>
      </details>

      <details>
        <summary>Eine neue Sammlung (z.&nbsp;B. "Sommerweine") erstellen</summary>
        <ol>
          <li>Catalog → <em>Collections</em> → <strong>Create new collection</strong>.</li>
          <li>Name, Slug, optional ein Banner-Bild.</li>
          <li>
            <em>Filters</em>: Regel hinzufügen, z.&nbsp;B. <em>Has facet values</em> →
            "Rebsorte: Riesling". Die Mitgliedschaft wird automatisch berechnet.
          </li>
          <li>Speichern.</li>
        </ol>
      </details>

      <h2>Wichtig zu wissen</h2>
      <ul>
        <li>
          Änderungen an Produkten werden <em>nicht</em> sofort live — der Suchindex braucht ein
          paar Sekunden.
        </li>
        <li>
          Lösche niemals Produkte, die schon einmal bestellt wurden. Stattdessen Variante auf
          <em>Stock on hand: 0</em> setzen oder Produkt <em>disablen</em>.
        </li>
        <li>
          Bestellungen kannst du nach dem Versand nicht mehr zurücksetzen — nur via Refund
          rückgängig machen.
        </li>
        <li>
          Bei Problemen mit der Anzeige im Frontend: Browser-Cache leeren (<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>).
        </li>
      </ul>
    </vdr-page-block>
  `,
})
export class AdminHelpComponent {}
