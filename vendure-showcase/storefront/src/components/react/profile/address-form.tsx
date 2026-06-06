import { useForm } from '@tanstack/react-form';
import { useCreateAddress, useUpdateAddress, useAvailableCountries } from '@/lib/use-auth';
import { useT } from '@/lib/i18n';
import { addressSchema, fieldErrorText } from '@/lib/auth-schemas';
import type { Address } from '@/lib/types';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { LabeledInput, inputClass } from '../auth/labeled-input';
import { FormAlert } from '../auth/form-alert';

export function AddressForm({ address, onDone }: { address?: Address; onDone: () => void }) {
  const t = useT();
  const { data: countries } = useAvailableCountries();
  const { mutateAsync: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutateAsync: updateAddress, isPending: isUpdating } = useUpdateAddress();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isPending = isCreating || isUpdating;

  const form = useForm({
    defaultValues: {
      fullName: address?.fullName ?? '',
      streetLine1: address?.streetLine1 ?? '',
      streetLine2: address?.streetLine2 ?? '',
      postalCode: address?.postalCode ?? '',
      city: address?.city ?? '',
      countryCode: address?.country.code ?? 'AT',
      defaultShippingAddress: address?.defaultShippingAddress ?? false,
      defaultBillingAddress: address?.defaultBillingAddress ?? false,
    },
    validators: {
      onChange: addressSchema(t),
    },
    onSubmit: async ({ value }) => {
      setErrorMsg(null);
      try {
        if (address) {
          await updateAddress({ id: address.id, ...value });
        } else {
          await createAddress(value);
        }
        onDone();
      } catch {
        setErrorMsg(t.addressError);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {errorMsg && <FormAlert kind="error">{errorMsg}</FormAlert>}

      <form.Field name="fullName">
        {(field) => <LabeledInput field={field} label={t.addressFullName} autoComplete="name" />}
      </form.Field>
      <form.Field name="streetLine1">
        {(field) => (
          <LabeledInput field={field} label={t.addressStreet1} autoComplete="address-line1" />
        )}
      </form.Field>
      <form.Field name="streetLine2">
        {(field) => (
          <LabeledInput field={field} label={t.addressStreet2} autoComplete="address-line2" />
        )}
      </form.Field>

      <div className="grid grid-cols-3 gap-4">
        <form.Field name="postalCode">
          {(field) => (
            <LabeledInput field={field} label={t.addressPostalCode} autoComplete="postal-code" />
          )}
        </form.Field>
        <div className="col-span-2">
          <form.Field name="city">
            {(field) => (
              <LabeledInput field={field} label={t.addressCity} autoComplete="address-level2" />
            )}
          </form.Field>
        </div>
      </div>

      <form.Field name="countryCode">
        {(field) => {
          const hasError = field.state.meta.errors.length > 0;
          return (
            <div className="space-y-1">
              <label htmlFor={field.name} className="text-sm font-medium block">
                {t.addressCountry}
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={inputClass}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${field.name}-error` : undefined}
              >
                <option value="">{t.addressCountrySelect}</option>
                {countries?.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              {hasError && (
                <p id={`${field.name}-error`} className="text-destructive text-xs font-medium mt-1">
                  {fieldErrorText(field.state.meta.errors)}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      <div className="space-y-2">
        <form.Field name="defaultShippingAddress">
          {(field) => (
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="accent-accent size-4"
              />
              {t.addressDefaultShipping}
            </label>
          )}
        </form.Field>
        <form.Field name="defaultBillingAddress">
          {(field) => (
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="accent-accent size-4"
              />
              {t.addressDefaultBilling}
            </label>
          )}
        </form.Field>
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
          onClick={onDone}
          disabled={isPending}
          className="bg-muted hover:bg-muted/70 text-foreground border border-border rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
        >
          {t.profileCancel}
        </button>
      </div>
    </form>
  );
}
