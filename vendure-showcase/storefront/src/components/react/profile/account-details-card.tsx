import { useForm } from '@tanstack/react-form';
import { useUpdateCustomer } from '@/lib/use-auth';
import { useT } from '@/lib/i18n';
import { accountSchema } from '@/lib/auth-schemas';
import type { Customer } from '@/lib/types';
import { useState } from 'react';
import { Loader2, Pencil, User } from 'lucide-react';
import { LabeledInput } from '../auth/labeled-input';
import { FormAlert } from '../auth/form-alert';

export function AccountDetailsCard({ customer }: { customer: Customer }) {
  const t = useT();
  const { mutateAsync: updateCustomer, isPending } = useUpdateCustomer();
  const [editing, setEditing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      phoneNumber: customer.phoneNumber ?? '',
    },
    validators: {
      onChange: accountSchema(t),
    },
    onSubmit: async ({ value }) => {
      setStatusMsg(null);
      setErrorMsg(null);
      try {
        await updateCustomer({
          firstName: value.firstName,
          lastName: value.lastName,
          phoneNumber: value.phoneNumber,
        });
        setStatusMsg(t.profileAccountSaved);
        setEditing(false);
      } catch {
        setErrorMsg(t.profileAccountError);
      }
    },
  });

  const startEdit = () => {
    setStatusMsg(null);
    setErrorMsg(null);
    form.reset();
    setEditing(true);
  };

  const cancelEdit = () => {
    form.reset();
    setEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-fit space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 text-accent rounded-full p-2.5">
            <User size={20} />
          </div>
          <div>
            <h2 className="font-bold text-lg">{t.profileAccountDetails}</h2>
            <p className="text-muted-foreground text-xs">{t.profileAccountSubtitle}</p>
          </div>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={startEdit}
            className="text-muted-foreground hover:text-accent flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            <Pencil size={14} />
            {t.profileEdit}
          </button>
        )}
      </div>

      {statusMsg && <FormAlert kind="success">{statusMsg}</FormAlert>}
      {errorMsg && <FormAlert kind="error">{errorMsg}</FormAlert>}

      {editing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="border-t border-border pt-4 space-y-4"
        >
          <form.Field name="firstName">
            {(field) => <LabeledInput field={field} label={t.registerFirstName} autoComplete="given-name" />}
          </form.Field>
          <form.Field name="lastName">
            {(field) => <LabeledInput field={field} label={t.registerLastName} autoComplete="family-name" />}
          </form.Field>
          <form.Field name="phoneNumber">
            {(field) => <LabeledInput field={field} label={t.profilePhone} type="tel" autoComplete="tel" />}
          </form.Field>

          <div className="space-y-1">
            <span className="text-muted-foreground block text-xs">{t.loginEmail}</span>
            <span className="font-medium text-sm">{customer.emailAddress}</span>
            <p className="text-muted-foreground text-xs">{t.profileEmailReadonlyHint}</p>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="bg-foreground text-background hover:bg-accent hover:text-primary-foreground disabled:opacity-50 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {t.profileSave}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={isPending}
              className="bg-muted hover:bg-muted/70 text-foreground border border-border rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {t.profileCancel}
            </button>
          </div>
        </form>
      ) : (
        <div className="border-t border-border pt-4 space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground block text-xs">{t.profileName}</span>
            <span className="font-medium">
              {customer.firstName} {customer.lastName}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">{t.loginEmail}</span>
            <span className="font-medium">{customer.emailAddress}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">{t.profilePhone}</span>
            <span className="font-medium">{customer.phoneNumber || t.profilePhoneEmpty}</span>
          </div>
        </div>
      )}
    </div>
  );
}
