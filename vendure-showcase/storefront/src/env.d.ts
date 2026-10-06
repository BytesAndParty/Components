/// <reference types="astro/client" />

// Alle optional: ohne Env läuft die Storefront gegen den lokalen Vendure-Server.
interface ImportMetaEnv {
  /** Shop-API für den Build (SSG, Node), absolut. Nur serverseitig. */
  readonly VENDURE_SHOP_API_URL?: string;
  /** Shop-API im Browser. Relativ (`/shop-api`) = same-origin über den Netlify-Proxy. */
  readonly PUBLIC_SHOP_API_URL?: string;
  /** Öffentliche Basis-URL des Vendure-Servers (ohne Slash am Ende) für Dashboard- und API-Links. */
  readonly PUBLIC_VENDURE_URL?: string;
  /** Demo-Zugang fürs Dashboard (eingeschränkte Rolle), bewusst öffentlich auf /admin-info.
   *  Kommt aus der Netlify-Env, nicht aus dem Repo — so bleibt er aus der Git-Historie. */
  readonly PUBLIC_DEMO_ADMIN_USER?: string;
  readonly PUBLIC_DEMO_ADMIN_PASSWORD?: string;
}
