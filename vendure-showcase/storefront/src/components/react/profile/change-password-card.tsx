import { useForm } from '@tanstack/react-form';
import { useUpdatePassword } from '@/lib/use-auth';
import { useT } from '@/lib/i18n';
import { passwordChangeSchema } from '@/lib/auth-schemas';
import { useState } from 'react';
import { Loader2, KeyRound } from 'lucide-react';
import { LabeledInput } from '../auth/labeled-input';
import { FormAlert } from '../auth/form-alert';

export function ChangePasswordCard() {
  const t = useT();
  const { mutateAsync: updatePassword, isPending } = useUpdatePassword();
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validators: {
      onChange: passwordChangeSchema(t),
    },
    onSubmit: async ({ value }) => {
      setStatusMsg(null);
      setErrorMsg(null);
      try {
        const result = await updatePassword({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        });
        if (result.__typename === 'Success') {
          setStatusMsg(t.profilePasswordChanged);
          form.reset();
        } else {
          setErrorMsg(result.message || t.profilePasswordError);
        }
      } catch {
        setErrorMsg(t.profilePasswordError);
      }
    },
  });

  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-fit space-y-4">
      <div className="flex items-center gap-3">
        <div className="bg-accent/10 text-accent rounded-full p-2.5">
          <KeyRound size={20} />
        </div>
        <div>
          <h2 className="font-bold text-lg">{t.profilePasswordTitle}</h2>
          <p className="text-muted-foreground text-xs">{t.profilePasswordSubtitle}</p>
        </div>
      </div>

      {statusMsg && <FormAlert kind="success">{statusMsg}</FormAlert>}
      {errorMsg && <FormAlert kind="error">{errorMsg}</FormAlert>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="border-t border-border pt-4 space-y-4"
      >
        <form.Field name="currentPassword">
          {(field) => (
            <LabeledInput
              field={field}
              label={t.profileCurrentPassword}
              type="password"
              autoComplete="current-password"
            />
          )}
        </form.Field>
        <form.Field name="newPassword">
          {(field) => (
            <LabeledInput
              field={field}
              label={t.profileNewPassword}
              type="password"
              autoComplete="new-password"
            />
          )}
        </form.Field>
        <form.Field name="confirmNewPassword">
          {(field) => (
            <LabeledInput
              field={field}
              label={t.profileConfirmNewPassword}
              type="password"
              autoComplete="new-password"
            />
          )}
        </form.Field>

        <button
          type="submit"
          disabled={isPending}
          className="bg-foreground text-background hover:bg-accent hover:text-primary-foreground disabled:opacity-50 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {t.profileChangePassword}
        </button>
      </form>
    </div>
  );
}
