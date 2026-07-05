/** Gemeinsame Daten für die drei Wein-Card-Designs des Storefronts. */
export interface WineCardData {
  name: string
  vintage: number
  /** Region oder Einzellage, z. B. "Wachau · Österreich" */
  lage: string
  /** Optionale poetische Zweitzeile, z. B. "Urgestein" */
  edition?: string
  /** Formatierter Preis, z. B. "89,00 €" */
  price: string
  description: string
  imageSrc: string
  imageAlt: string
}
