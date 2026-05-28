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
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="text-center py-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">{t.adminTitle}</h1>
        <p className="text-xl text-muted-foreground">{t.adminSubtitle}</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="p-6 border border-border rounded-2xl bg-card space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold">{t.adminPanelTitle}</h2>
            <Terminal size={18} className="text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
          </div>
          <p className="text-sm text-muted-foreground">{t.adminPanelBody}</p>
          <dl className="space-y-2 text-sm">
            <div className="flex gap-3">
              <dt className="font-semibold w-24 shrink-0">{t.adminPanelUrl}</dt>
              <dd>
                <a href={ADMIN_URL} target="_blank" rel="noreferrer" className="text-accent hover:underline break-all">
                  {ADMIN_URL}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="font-semibold w-24 shrink-0">{t.adminPanelUser}</dt>
              <dd className="font-mono">superadmin</dd>
            </div>
            <div className="flex gap-3">
              <dt className="font-semibold w-24 shrink-0">{t.adminPanelPassword}</dt>
              <dd className="font-mono">superadmin</dd>
            </div>
          </dl>
          <a
            href={ADMIN_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-foreground text-background font-bold text-sm hover:bg-accent hover:text-primary-foreground transition-colors"
          >
            {t.adminPanelCta}
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </section>

        <section className="p-6 border border-border rounded-2xl bg-card space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold">{t.adminApiTitle}</h2>
            <Plug size={18} className="text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
          </div>
          <p className="text-sm text-muted-foreground">{t.adminApiBody}</p>
          <ul className="space-y-3 text-sm">
            <li>
              <div className="font-semibold text-foreground">{t.adminApiShop}</div>
              <a
                href={SHOP_API_URL}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-accent break-all text-xs font-mono"
              >
                {SHOP_API_URL}
              </a>
            </li>
            <li>
              <div className="font-semibold text-foreground">{t.adminApiAdmin}</div>
              <a
                href={ADMIN_API_URL}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-accent break-all text-xs font-mono"
              >
                {ADMIN_API_URL}
              </a>
            </li>
          </ul>
        </section>
      </div>

      <section className="p-6 border border-border rounded-2xl bg-muted/40 space-y-3">
        <h2 className="text-lg font-bold">{t.adminPluginTitle}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{t.adminPluginBody}</p>
        <p className="text-sm flex flex-wrap items-baseline gap-2">
          <span className="text-muted-foreground">{t.adminPluginPathLabel}:</span>
          <code className="font-mono text-accent">{PLUGIN_PATH}</code>
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
