import {
  Allow,
  Ctx,
  Logger,
  PermissionDefinition,
  PluginCommonModule,
  RequestContext,
  VendurePlugin,
} from '@vendure/core';
import { Injectable } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { gql } from 'graphql-tag';

const loggerCtx = 'StorefrontDeployPlugin';

/**
 * Coalesce schnelle Doppel-Klicks zu genau einem Deploy. Ein Netlify-Build
 * baut die komplette statische Storefront neu (~2 Min) — versehentliche
 * Doppel-Builds sind teuer und unnötig.
 */
const REBUILD_COOLDOWN_MS = 30_000;

/**
 * Dedizierte Permission, damit nicht jeder Admin einen Production-Deploy
 * auslösen kann. Erscheint nach Registrierung im Rollen-Editor des Dashboards.
 * SuperAdmin besitzt sie automatisch (Wildcard).
 */
export const triggerStorefrontRebuildPermission = new PermissionDefinition({
  name: 'TriggerStorefrontRebuild',
  description: 'Allows the user to trigger a storefront rebuild (Netlify deploy)',
});

interface StorefrontRebuildResult {
  success: boolean;
  message: string;
}

/**
 * Hält den Build-Hook-POST + Cooldown-State serverseitig. Die Hook-URL ist ein
 * unauthentifizierter Endpunkt und darf NIE ins Client-Bundle — deshalb lebt sie
 * als Env-Var hier, nicht im Dashboard. (Service-Form macht die Logik später auch
 * von einem EventBus-Subscriber wiederverwendbar, falls Auto-Trigger dazukommt.)
 */
@Injectable()
export class StorefrontDeployService {
  private lastTriggeredAt = 0;

  async triggerRebuild(ctx: RequestContext): Promise<StorefrontRebuildResult> {
    const url = process.env.NETLIFY_BUILD_HOOK_URL;
    if (!url) {
      Logger.warn('NETLIFY_BUILD_HOOK_URL nicht gesetzt — Rebuild übersprungen.', loggerCtx);
      return {
        success: false,
        message: 'Kein Build-Hook konfiguriert (NETLIFY_BUILD_HOOK_URL fehlt).',
      };
    }

    const now = Date.now();
    const sinceLast = now - this.lastTriggeredAt;
    if (sinceLast < REBUILD_COOLDOWN_MS) {
      const wait = Math.ceil((REBUILD_COOLDOWN_MS - sinceLast) / 1000);
      return {
        success: false,
        message: `Build läuft bereits — bitte ${wait}s warten.`,
      };
    }

    try {
      const response = await fetch(url, { method: 'POST' });
      if (!response.ok) {
        Logger.error(`Build-Hook antwortete mit Status ${response.status}.`, loggerCtx);
        return { success: false, message: `Netlify antwortete mit Status ${response.status}.` };
      }
      this.lastTriggeredAt = now;
      Logger.info(`Storefront-Rebuild ausgelöst von User ${ctx.activeUserId ?? 'unbekannt'}.`, loggerCtx);
      return {
        success: true,
        message: 'Build angestoßen — Netlify veröffentlicht in ~2 Minuten.',
      };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      Logger.error(`Build-Hook nicht erreichbar: ${message}`, loggerCtx);
      return { success: false, message: `Build-Hook nicht erreichbar: ${message}` };
    }
  }
}

@Resolver()
export class StorefrontDeployResolver {
  constructor(private readonly deployService: StorefrontDeployService) {}

  @Mutation()
  @Allow(triggerStorefrontRebuildPermission.Permission)
  async triggerStorefrontRebuild(@Ctx() ctx: RequestContext): Promise<StorefrontRebuildResult> {
    return this.deployService.triggerRebuild(ctx);
  }
}

/**
 * STOREFRONT-DEPLOY-PLUGIN
 * Stellt eine Admin-API-Mutation `triggerStorefrontRebuild` bereit, die den
 * Netlify-Build-Hook anstößt. Das Dashboard ergänzt dazu einen
 * „Veröffentlichen"-Button (siehe ./dashboard/index.tsx).
 */
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [StorefrontDeployService],
  adminApiExtensions: {
    schema: gql`
      type StorefrontRebuildResult {
        success: Boolean!
        message: String!
      }
      extend type Mutation {
        """
        Stößt einen Rebuild + Deploy der statischen Storefront an (Netlify Build Hook).
        """
        triggerStorefrontRebuild: StorefrontRebuildResult!
      }
    `,
    resolvers: [StorefrontDeployResolver],
  },
  configuration: (config) => {
    // Idempotent: bootstrap(config) + bootstrapWorker(config) rufen `configuration`
    // zweimal im selben Prozess — ohne Guard wäre die Permission doppelt registriert.
    const exists = config.authOptions.customPermissions.some(
      (p) => p.Permission === triggerStorefrontRebuildPermission.Permission,
    );
    if (!exists) {
      config.authOptions.customPermissions.push(triggerStorefrontRebuildPermission);
    }
    return config;
  },
  dashboard: './dashboard/index.tsx',
})
export class StorefrontDeployPlugin {}
