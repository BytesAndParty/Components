import { useForm } from '@tanstack/react-form';
import { useRegister, useLogin } from '@/lib/use-auth';
import { useT } from '@/lib/i18n';
import { registerSchema, fieldErrorText } from '@/lib/auth-schemas';
import { Providers } from '../Providers';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

function RegisterFormInner() {
  const t = useT();
  const { mutateAsync: register, isPending: isRegistering } = useRegister();
  const { mutateAsync: login, isPending: isLoggingIn } = useLogin();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: registerSchema(t),
    },
    onSubmit: async ({ value }) => {
      setErrorMsg(null);
      setSuccessMsg(null);

      try {
        const result = await register({
          emailAddress: value.email,
          firstName: value.firstName,
          lastName: value.lastName,
          password: value.password,
        });

        if (result.__typename === 'Success') {
          setSuccessMsg(t.registerSuccess);
          
          // Auto-login after successful registration
          try {
            await login({ username: value.email, password: value.password });
            setTimeout(() => {
              window.location.href = '/profile';
            }, 1000);
          } catch {
            // If auto-login fails, send to login page
            setTimeout(() => {
              window.location.href = '/login';
            }, 1000);
          }
        } else {
          setErrorMsg(result.message || t.registerError);
        }
      } catch {
        setErrorMsg(t.registerError);
      }
    },
  });

  const loading = isRegistering || isLoggingIn;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t.registerTitle}</h1>
        <p className="text-muted-foreground text-sm">{t.registerSubtitle}</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-6">
        {errorMsg && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 text-sm rounded-lg p-4 font-medium" role="alert">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-sm rounded-lg p-4 font-medium" role="alert">
            {successMsg}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="firstName">
              {(field) => (
                <div className="space-y-1">
                  <label htmlFor={field.name} className="text-sm font-medium block">
                    {t.registerFirstName}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full bg-background border border-border focus:border-ring rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
                    aria-invalid={field.state.meta.errors.length > 0}
                    aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                    required
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p id={`${field.name}-error`} className="text-destructive text-xs font-medium mt-1">
                      {fieldErrorText(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="lastName">
              {(field) => (
                <div className="space-y-1">
                  <label htmlFor={field.name} className="text-sm font-medium block">
                    {t.registerLastName}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full bg-background border border-border focus:border-ring rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
                    aria-invalid={field.state.meta.errors.length > 0}
                    aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                    required
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p id={`${field.name}-error`} className="text-destructive text-xs font-medium mt-1">
                      {fieldErrorText(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="email">
            {(field) => (
              <div className="space-y-1">
                <label htmlFor={field.name} className="text-sm font-medium block">
                  {t.loginEmail}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full bg-background border border-border focus:border-ring rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
                  aria-invalid={field.state.meta.errors.length > 0}
                  aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                  required
                />
                {field.state.meta.errors.length > 0 && (
                  <p id={`${field.name}-error`} className="text-destructive text-xs font-medium mt-1">
                    {fieldErrorText(field.state.meta.errors)}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <div className="space-y-1">
                <label htmlFor={field.name} className="text-sm font-medium block">
                  {t.loginPassword}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full bg-background border border-border focus:border-ring rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
                  aria-invalid={field.state.meta.errors.length > 0}
                  aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                  required
                />
                {field.state.meta.errors.length > 0 && (
                  <p id={`${field.name}-error`} className="text-destructive text-xs font-medium mt-1">
                    {fieldErrorText(field.state.meta.errors)}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="confirmPassword">
            {(field) => (
              <div className="space-y-1">
                <label htmlFor={field.name} className="text-sm font-medium block">
                  {t.registerConfirmPassword}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full bg-background border border-border focus:border-ring rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
                  aria-invalid={field.state.meta.errors.length > 0}
                  aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                  required
                />
                {field.state.meta.errors.length > 0 && (
                  <p id={`${field.name}-error`} className="text-destructive text-xs font-medium mt-1">
                    {fieldErrorText(field.state.meta.errors)}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background hover:bg-accent hover:text-primary-foreground disabled:opacity-50 disabled:hover:bg-foreground disabled:hover:text-background flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-colors cursor-pointer"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {t.registerSubmit}
          </button>
        </form>

        <div className="border-t border-border pt-4 text-center text-sm text-muted-foreground">
          {t.registerLoginPrompt}{' '}
          <a href="/login" className="text-foreground hover:text-accent font-semibold transition-colors">
            {t.registerLoginLink}
          </a>
        </div>
      </div>
    </div>
  );
}

export function RegisterForm() {
  return (
    <Providers>
      <RegisterFormInner />
    </Providers>
  );
}
