import { ExternalLink, Plug, Terminal } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { Providers } from './Providers';

const ADMIN_URL = 'http://localhost:3000/admin';
const SHOP_API_URL = 'http://localhost:3000/shop-api';
const ADMIN_API_URL = 'http://localhost:3000/admin-api';
const PLUGIN_PATH = 'server/src/plugins/wine-showcase.plugin.ts';

function AdminInfoInner() {
  const t = useT();

  return (
    <div className="mx-auto max-w-4xl space-y-12">
      <section className="py-10 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight">{t.adminTitle}</h1>
        <p className="text-muted-foreground text-xl">{t.adminSubtitle}</p>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="border-border bg-card space-y-4 rounded-2xl border p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold">{t.adminPanelTitle}</h2>
            <Terminal size={18} className="text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
          </div>
          <p className="text-muted-foreground text-sm">{t.adminPanelBody}</p>
          <dl className="space-y-2 text-sm">
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 font-semibold">{t.adminPanelUrl}</dt>
              <dd>
                <a href={ADMIN_URL} target="_blank" rel="noreferrer" className="text-accent break-all hover:underline">
                  {ADMIN_URL}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 font-semibold">{t.adminPanelUser}</dt>
              <dd className="font-mono">superadmin</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 font-semibold">{t.adminPanelPassword}</dt>
              <dd className="font-mono">superadmin</dd>
            </div>
          </dl>
          <a
            href={ADMIN_URL}
            target="_blank"
            rel="noreferrer"
            className="bg-foreground text-background hover:bg-accent hover:text-primary-foreground inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-colors"
          >
            {t.adminPanelCta}
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </section>

        <section className="border-border bg-card space-y-4 rounded-2xl border p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold">{t.adminApiTitle}</h2>
            <Plug size={18} className="text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
          </div>
          <p className="text-muted-foreground text-sm">{t.adminApiBody}</p>
          <ul className="space-y-3 text-sm">
            <li>
              <div className="text-foreground font-semibold">{t.adminApiShop}</div>
              <a
                href={SHOP_API_URL}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-accent font-mono text-xs break-all"
              >
                {SHOP_API_URL}
              </a>
            </li>
            <li>
              <div className="text-foreground font-semibold">{t.adminApiAdmin}</div>
              <a
                href={ADMIN_API_URL}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-accent font-mono text-xs break-all"
              >
                {ADMIN_API_URL}
              </a>
            </li>
          </ul>
        </section>
      </div>

      <section className="border-border bg-muted/40 space-y-3 rounded-2xl border p-6">
        <h2 className="text-lg font-bold">{t.adminPluginTitle}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{t.adminPluginBody}</p>
        <p className="flex flex-wrap items-baseline gap-2 text-sm">
          <span className="text-muted-foreground">{t.adminPluginPathLabel}:</span>
          <code className="text-accent font-mono">{PLUGIN_PATH}</code>
        </p>
      </section>
    </div>
  );
}

export function AdminInfoPage() {
  return (
    <Providers>
      <AdminInfoInner />
    </Providers>
  );
}
