import {
  api,
  Button,
  defineDashboardExtension,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  toast,
  useMutation,
  useQueryClient,
} from '@vendure/dashboard';
import { graphql } from '@/gql';
import { UploadCloudIcon } from 'lucide-react';
import { useState } from 'react';
import { findIncomplete, type IncompleteProduct } from './readiness';

/**
 * Muss exakt dem `name` der PermissionDefinition im Server-Plugin entsprechen.
 * Bewusst als String-Literal (kein Import aus dem Server-Code), damit kein
 * `@vendure/core` ins Browser-Bundle des Dashboards gezogen wird.
 */
const REBUILD_PERMISSION = 'TriggerStorefrontRebuild';

const triggerStorefrontRebuild = graphql(`
  mutation TriggerStorefrontRebuild {
    triggerStorefrontRebuild {
      success
      message
    }
  }
`);

// Only enabled products matter: drafts are not in the shop, so they cannot be incomplete there.
const publishCheckProducts = graphql(`
  query PublishCheckProducts {
    products(options: { filter: { enabled: { eq: true } }, take: 1000 }) {
      items {
        id
        name
        description
        customFields {
          rebsorte
          region
          alkoholgehalt
        }
        variants {
          price
        }
      }
    }
  }
`);

const draftProduct = graphql(`
  mutation DraftProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      enabled
    }
  }
`);

function PublishButton() {
  const queryClient = useQueryClient();
  const [incomplete, setIncomplete] = useState<IncompleteProduct[] | null>(null);

  const rebuild = useMutation({
    mutationFn: () => api.mutate(triggerStorefrontRebuild, {}),
    onSuccess: (result) => {
      const r = result.triggerStorefrontRebuild;
      // success=false ist ein erwartetes Ergebnis (Cooldown / kein Hook
      // konfiguriert), kein Transport-Fehler — daher kein toast.error.
      if (r.success) {
        toast.success(r.message);
      } else {
        toast.error(r.message);
      }
    },
    onError: (error) => {
      toast.error('Veröffentlichen fehlgeschlagen', {
        description: error instanceof Error ? error.message : undefined,
      });
    },
  });

  // Check first: only a clean shop goes straight to the build, otherwise the dialog decides.
  const check = useMutation({
    mutationFn: async () => findIncomplete((await api.query(publishCheckProducts, {})).products.items),
    onSuccess: (list) => {
      if (list.length === 0) {
        rebuild.mutate();
      } else {
        setIncomplete(list);
      }
    },
    onError: (error) => {
      toast.error('Prüfung fehlgeschlagen', {
        description: error instanceof Error ? error.message : undefined,
      });
    },
  });

  // Drafts leave the shop API as well, so the wines are gone from the live list too,
  // not just from the static build. One at a time: SQLite has a single writer.
  const draftAndPublish = useMutation({
    mutationFn: async (list: IncompleteProduct[]) => {
      for (const p of list) {
        await api.mutate(draftProduct, { input: { id: p.id, enabled: false } });
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries();
      setIncomplete(null);
      rebuild.mutate();
    },
    onError: (error) => {
      toast.error('Weine konnten nicht auf Entwurf gesetzt werden', {
        description: error instanceof Error ? error.message : undefined,
      });
    },
  });

  const busy = check.isPending || rebuild.isPending;

  return (
    <>
      <Button variant="outline" onClick={() => check.mutate()} disabled={busy}>
        <UploadCloudIcon className={`mr-2 h-4 w-4 ${busy ? 'animate-pulse' : ''}`} />
        {busy ? 'Veröffentliche…' : 'Veröffentlichen'}
      </Button>

      <Dialog open={incomplete !== null} onOpenChange={(open) => !open && setIncomplete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {incomplete?.length === 1
                ? '1 aktiver Wein ist unvollständig'
                : `${incomplete?.length ?? 0} aktive Weine sind unvollständig`}
            </DialogTitle>
            <DialogDescription>
              Ohne diese Angaben wirkt die Weinseite im Shop lückenhaft. „Auf Entwurf setzen“ nimmt
              die Weine aus dem Shop, bis sie vollständig sind und wieder aktiviert werden.
              „Trotzdem veröffentlichen“ geschieht auf eigene Gefahr.
            </DialogDescription>
          </DialogHeader>

          <ul className="max-h-64 space-y-2 overflow-y-auto text-sm">
            {incomplete?.map((p) => (
              <li key={p.id}>
                <a
                  className="font-medium underline"
                  href={`/dashboard/products/${p.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {p.name}
                </a>
                <span className="text-muted-foreground"> · fehlt: {p.missing.join(', ')}</span>
              </li>
            ))}
          </ul>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIncomplete(null)}>
              Abbrechen
            </Button>
            <Button
              variant="outline"
              disabled={draftAndPublish.isPending}
              onClick={() => {
                setIncomplete(null);
                rebuild.mutate();
              }}
            >
              Trotzdem veröffentlichen
            </Button>
            <Button
              disabled={draftAndPublish.isPending}
              onClick={() => incomplete && draftAndPublish.mutate(incomplete)}
            >
              {draftAndPublish.isPending ? 'Setze auf Entwurf…' : 'Auf Entwurf setzen und veröffentlichen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

defineDashboardExtension({
  actionBarItems: [
    {
      // Catalog-Übersicht: hier landet man nach Produkt-/Bestandspflege.
      pageId: 'product-list',
      requiresPermission: REBUILD_PERMISSION,
      component: PublishButton,
    },
  ],
});
