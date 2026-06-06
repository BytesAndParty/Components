import { z } from 'zod';
import { format } from './i18n';
import type { StorefrontMessages } from './i18n';

/**
 * Geteilte Zod-Schemas für alle Auth-/Account-Formulare.
 *
 * Standard-Schema-kompatibel → werden direkt als TanStack-Form-Validators
 * übergeben (Form-Level `onChange`/`onSubmit`). Die Schemas sind Factories, die
 * das aktive i18n-Bag (`useT()`) entgegennehmen, damit Fehlermeldungen lokalisiert
 * sind. Cross-field-Regeln (Passwort-Bestätigung) leben hier zentral, nicht in den
 * Komponenten.
 */

export const PASSWORD_MIN_LENGTH = 4;

const email = (t: StorefrontMessages) =>
  z.string().trim().min(1, t.valRequired).pipe(z.email(t.valEmail));

const password = (t: StorefrontMessages) =>
  z
    .string()
    .min(1, t.valRequired)
    .min(PASSWORD_MIN_LENGTH, format(t.valPasswordMin, { min: PASSWORD_MIN_LENGTH }));

const requiredText = (t: StorefrontMessages) => z.string().trim().min(1, t.valRequired);

export function loginSchema(t: StorefrontMessages) {
  return z.object({
    email: email(t),
    password: password(t),
  });
}

export function registerSchema(t: StorefrontMessages) {
  return z
    .object({
      firstName: requiredText(t),
      lastName: requiredText(t),
      email: email(t),
      password: password(t),
      confirmPassword: z.string().min(1, t.valRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t.valPasswordMatch,
      path: ['confirmPassword'],
    });
}

export function accountSchema(t: StorefrontMessages) {
  // phoneNumber bleibt non-optional (leerer String erlaubt), damit der Standard-Schema-
  // Input-Typ exakt zum TanStack-Form-Default `{ phoneNumber: '' }` passt.
  return z.object({
    firstName: requiredText(t),
    lastName: requiredText(t),
    phoneNumber: z.string().trim(),
  });
}

export function passwordChangeSchema(t: StorefrontMessages) {
  return z
    .object({
      currentPassword: z.string().min(1, t.valRequired),
      newPassword: password(t),
      confirmNewPassword: z.string().min(1, t.valRequired),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t.valPasswordMatch,
      path: ['confirmNewPassword'],
    });
}

export function addressSchema(t: StorefrontMessages) {
  // Alle Felder non-optional (leerer String/false als Default), damit der
  // Standard-Schema-Input exakt zu den TanStack-Form-Defaults passt.
  return z.object({
    fullName: z.string().trim(),
    streetLine1: requiredText(t),
    streetLine2: z.string().trim(),
    postalCode: z.string().trim(),
    city: z.string().trim(),
    countryCode: z.string().min(1, t.valRequired),
    defaultShippingAddress: z.boolean(),
    defaultBillingAddress: z.boolean(),
  });
}

export type LoginValues = z.infer<ReturnType<typeof loginSchema>>;
export type RegisterValues = z.infer<ReturnType<typeof registerSchema>>;
export type AccountValues = z.infer<ReturnType<typeof accountSchema>>;
export type PasswordChangeValues = z.infer<ReturnType<typeof passwordChangeSchema>>;
export type AddressValues = z.infer<ReturnType<typeof addressSchema>>;

/**
 * TanStack Form liefert bei Standard-Schema-Validators Issue-Objekte (`{ message }`)
 * statt roher Strings. Dieser Helper normalisiert beide Formen zu einem Anzeige-String.
 */
export function fieldErrorText(errors: unknown[]): string {
  return errors
    .map((e) => (typeof e === 'string' ? e : (e as { message?: string } | undefined)?.message))
    .filter(Boolean)
    .join(', ');
}
