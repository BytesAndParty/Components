import type { ComponentMessages } from '../i18n';

export type BookingCalendarMessages = {
  /** Überschrift der Kalenderspalte. */
  pickDate: string;
  /** Hinweis, bevor ein Tag gewählt wurde. */
  pickDateHint: string;
  /** Überschrift der Uhrzeit-/Detailspalte. */
  pickTime: string;
  /** Label über dem Gäste-Stepper. */
  guests: string;
  /** Kurzlabel „Plätze frei" — `{count}` wird interpoliert. */
  seatsLeft: string;
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
} as const satisfies ComponentMessages<BookingCalendarMessages>;
