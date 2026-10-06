import type { ComponentMessages } from '../i18n';

export type CarouselMessages = {
  region: string;
  previous: string;
  next: string;
  /** Platzhalter `{n}` = 1-basierte Nummer der Folie. */
  goTo: string;
};

export const MESSAGES = {
  de: {
    region: 'Karussell',
    previous: 'Vorherige Folie',
    next: 'Nächste Folie',
    goTo: 'Zu Folie {n}',
  },
  en: {
    region: 'Carousel',
    previous: 'Previous slide',
    next: 'Next slide',
    goTo: 'Go to slide {n}',
  },
} as const satisfies ComponentMessages<CarouselMessages>;
