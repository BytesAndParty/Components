import { api, Button, defineDashboardExtension, toast, useMutation } from '@vendure/dashboard';
import { graphql } from '@/gql';
import { UploadCloudIcon } from 'lucide-react';

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

defineDashboardExtension({
  actionBarItems: [
    {
      // Catalog-Übersicht: hier landet man nach Produkt-/Bestandspflege.
      pageId: 'product-list',
      requiresPermission: REBUILD_PERMISSION,
      component: () => {
        const mutation = useMutation({
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

        return (
          <Button
            variant="outline"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            <UploadCloudIcon
              className={`mr-2 h-4 w-4 ${mutation.isPending ? 'animate-pulse' : ''}`}
            />
            {mutation.isPending ? 'Veröffentliche…' : 'Veröffentlichen'}
          </Button>
        );
      },
    },
  ],
});
