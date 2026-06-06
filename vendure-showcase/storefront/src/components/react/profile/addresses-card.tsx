import { useState } from 'react';
import { useAddresses, useDeleteAddress } from '@/lib/use-auth';
import { useT } from '@/lib/i18n';
import type { Address } from '@/lib/types';
import { Loader2, MapPin, Plus, Pencil, Trash2 } from 'lucide-react';
import { AddressForm } from './address-form';
import { FormAlert } from '../auth/form-alert';

type Mode = { kind: 'list' } | { kind: 'add' } | { kind: 'edit'; address: Address };

function AddressRow({
  address,
  onEdit,
  onDelete,
  deleting,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const t = useT();
  return (
    <div className="border border-border rounded-xl p-4 flex justify-between gap-4">
      <div className="text-sm space-y-0.5 min-w-0">
        {address.fullName && <p className="font-semibold">{address.fullName}</p>}
        <p>{address.streetLine1}</p>
        {address.streetLine2 && <p>{address.streetLine2}</p>}
        <p className="text-muted-foreground">
          {[address.postalCode, address.city].filter(Boolean).join(' ')}
          {address.city && address.country?.name ? ', ' : ''}
          {address.country?.name}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {address.defaultShippingAddress && (
            <span className="bg-accent/10 text-accent text-[11px] font-bold px-2 py-0.5 rounded-full">
              {t.addressDefaultShippingBadge}
            </span>
          )}
          {address.defaultBillingAddress && (
            <span className="bg-accent/10 text-accent text-[11px] font-bold px-2 py-0.5 rounded-full">
              {t.addressDefaultBillingBadge}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        <button
          type="button"
          onClick={onEdit}
          aria-label={t.profileEdit}
          className="text-muted-foreground hover:text-accent transition-colors cursor-pointer"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          aria-label={t.addressDelete}
          className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer disabled:opacity-50"
        >
          {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      </div>
    </div>
  );
}

export function AddressesCard() {
  const t = useT();
  const { data: addresses, isLoading } = useAddresses();
  const { mutateAsync: deleteAddress, isPending: isDeleting, variables: deletingId } =
    useDeleteAddress();
  const [mode, setMode] = useState<Mode>({ kind: 'list' });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.addressDeleteConfirm)) return;
    setErrorMsg(null);
    try {
      await deleteAddress(id);
    } catch {
      setErrorMsg(t.addressDeleteError);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 text-accent rounded-full p-2.5">
            <MapPin size={20} />
          </div>
          <div>
            <h2 className="font-bold text-lg">{t.profileAddressesTitle}</h2>
            <p className="text-muted-foreground text-xs">{t.profileAddressesSubtitle}</p>
          </div>
        </div>
        {mode.kind === 'list' && (
          <button
            type="button"
            onClick={() => setMode({ kind: 'add' })}
            className="text-muted-foreground hover:text-accent flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            <Plus size={14} />
            {t.profileAddAddress}
          </button>
        )}
      </div>

      {errorMsg && <FormAlert kind="error">{errorMsg}</FormAlert>}

      <div className="border-t border-border pt-4">
        {mode.kind === 'add' ? (
          <AddressForm onDone={() => setMode({ kind: 'list' })} />
        ) : mode.kind === 'edit' ? (
          <AddressForm address={mode.address} onDone={() => setMode({ kind: 'list' })} />
        ) : isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin text-accent" size={24} />
          </div>
        ) : !addresses || addresses.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-6">{t.profileNoAddresses}</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <AddressRow
                key={address.id}
                address={address}
                onEdit={() => setMode({ kind: 'edit', address })}
                onDelete={() => handleDelete(address.id)}
                deleting={isDeleting && deletingId === address.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
