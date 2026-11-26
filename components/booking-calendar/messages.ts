import type { ComponentMessages, PluralForms } from '../i18n';

export type BookingCalendarMessages = {
  /** Überschrift der Kalenderspalte. */
  pickDate: string;
  /** Hinweis, bevor ein Tag gewählt wurde. */
  pickDateHint: string;
  /** Überschrift der Uhrzeit-/Detailspalte. */
  pickTime: string;
  /** Label über dem Gäste-Stepper. */
  guests: string;
  /** Short "seats left" label; `{count}` is interpolated. A string, or one form per plural category (see `pluralize`). */
  seatsLeft: string | PluralForms;
  /** Primärer Absende-Button. */
  submit: string;
  /** Button-Text während des Sendens. */
  submitting: string;
  /** Titel im Erfolgs-Panel. */
  successTitle: string;
  /** Fließtext im Erfolgs-Panel. */
  successBody: string;
  /** Button, der das Formular für eine weitere Anfrage zurücksetzt. */
  newRequest: string;
  /** Leerzustand, wenn keine Slots übergeben wurden. */
  noSlots: string;
};

export const MESSAGES = {
  de: {
    pickDate: 'Termin wählen',
    pickDateHint: 'Wählen Sie einen hervorgehobenen Tag mit freien Terminen.',
    pickTime: 'Uhrzeit & Gäste',
    guests: 'Gäste',
    seatsLeft: 'noch {count} frei',
    submit: 'Anfrage senden',
    submitting: 'Wird gesendet …',
    successTitle: 'Anfrage gesendet',
    successBody: 'Wir bestätigen Ihren Termin in Kürze per E-Mail.',
    newRequest: 'Weitere Anfrage',
    noSlots: 'Derzeit sind keine Termine verfügbar — bitte kontaktieren Sie uns direkt.',
  },
  en: {
    pickDate: 'Choose a date',
    pickDateHint: 'Pick a highlighted day with open appointments.',
    pickTime: 'Time & guests',
    guests: 'Guests',
    seatsLeft: '{count} left',
    submit: 'Send request',
    submitting: 'Sending …',
    successTitle: 'Request sent',
    successBody: 'We will confirm your appointment shortly by e-mail.',
    newRequest: 'Another request',
    noSlots: 'No appointments available right now — please contact us directly.',
  },
  // Machine draft like all pl texts, to be proofread by a Polish speaker (components/i18n/COMPONENT.md).
  pl: {
    pickDate: 'Wybierz termin',
    pickDateHint: 'Prosimy wybrać jeden z wyróżnionych dni z wolnymi terminami.',
    pickTime: 'Godzina i goście',
    guests: 'Goście',
    // Polish needs three forms for whole numbers: 1 miejsce, 2–4/22–24 miejsca, 0/5–21/25 miejsc.
    seatsLeft: {
      one: 'zostało {count} miejsce',
      few: 'zostały {count} miejsca',
      many: 'zostało {count} miejsc',
      other: 'zostało {count} miejsca',
    },
    submit: 'Wyślij zapytanie',
    submitting: 'Wysyłanie …',
    successTitle: 'Zapytanie wysłane',
    successBody: 'Wkrótce potwierdzimy Państwa termin e-mailem.',
    newRequest: 'Kolejne zapytanie',
    noSlots: 'Obecnie nie ma wolnych terminów — zapraszamy do bezpośredniego kontaktu.',
  },
} as const satisfies ComponentMessages<BookingCalendarMessages>;
