import type { AnyFieldApi } from '@tanstack/react-form';
import { fieldErrorText } from '@/lib/auth-schemas';

export const inputClass =
  'w-full bg-background border border-border focus:border-accent rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/60 focus:ring-offset-2 transition-all';

/**
 * Beschriftetes Eingabefeld für eine TanStack-Form-Field — kapselt Label,
 * aria-invalid/aria-describedby und die lokalisierte Fehleranzeige an einer Stelle.
 */
export function LabeledInput({
  field,
  label,
  type = 'text',
  autoComplete,
}: {
  field: AnyFieldApi;
  label: string;
  type?: string;
  autoComplete?: string;
}) {
  const hasError = field.state.meta.errors.length > 0;
  return (
    <div className="space-y-1">
      <label htmlFor={field.name} className="text-sm font-medium block">
        {label}
      </label>
      <input
        id={field.name}
        name={field.name}
        type={type}
        autoComplete={autoComplete}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={inputClass}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${field.name}-error` : undefined}
      />
      {hasError && (
        <p id={`${field.name}-error`} className="text-destructive text-xs font-medium mt-1">
          {fieldErrorText(field.state.meta.errors)}
        </p>
      )}
    </div>
  );
}
