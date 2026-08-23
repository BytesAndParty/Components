import { useState } from 'react';
import { DatePicker, parseDate } from '@ark-ui/react/date-picker';
import { Calendar, Clock, Users, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useI18n, useComponentMessages, interpolate } from '../i18n';
import { NumberInput } from '../number-input/number-input';
import { MESSAGES, type BookingCalendarMessages } from './messages';

/**
 * Datengetriebener Termin-Picker auf Ark UI `DatePicker` (headless Monatsraster,
 * a11y/Keyboard gratis). Tage ohne freie Slots sind deaktiviert; nach Datumswahl
 * erscheinen die Uhrzeit-Chips, dann Gäste-Stepper + Absenden. Wiederverwendbar
 * für Verkostung/Wanderung/Kellerführung — die Slots kommen als Prop rein.
 * „Fancy Minimal": semantische Tokens, adaptive Feedback-States, keine Hex.
 */

export interface BookingSlot {
  id: string;
  /** ISO-Datum `YYYY-MM-DD`. */
  date: string;
  /** Uhrzeit `HH:mm`. */
  time: string;
  /** Freie Plätze. */
  capacity: number;
  /** Preis pro Person in Euro (optional). */
  price?: number;
}

export interface BookingCalendarProps {
  slots: BookingSlot[];
  onSubmit?: (booking: { slotId: string; guests: number }) => void | Promise<void>;
  messages?: Partial<BookingCalendarMessages>;
  className?: string;
}

type Status = 'idle' | 'submitting' | 'done';

export function BookingCalendar({ slots, onSubmit, messages, className }: BookingCalendarProps) {
  const { locale } = useI18n();
  const m = useComponentMessages(MESSAGES, messages);

  // Kein useMemo: AtelierUI läuft mit React Compiler (Auto-Memoization).
  const slotsByDate = new Map<string, BookingSlot[]>();
  for (const slot of slots) {
    const day = slotsByDate.get(slot.date) ?? [];
    day.push(slot);
    slotsByDate.set(slot.date, day);
  }
  for (const day of slotsByDate.values()) day.sort((a, b) => a.time.localeCompare(b.time));

  const bookableDates = new Set(slotsByDate.keys());
  const firstDate = [...bookableDates].sort()[0];

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [status, setStatus] = useState<Status>('idle');

  const daySlots = selectedDate ? slotsByDate.get(selectedDate) ?? [] : [];
  const selectedSlot = daySlots.find((s) => s.id === selectedSlotId) ?? null;

  const currency = new Intl.NumberFormat(locale === 'de' ? 'de-AT' : 'en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

  if (!slots.length) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground',
          className,
        )}
      >
        {m.noSlots}
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div
        className={cn(
          'flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center',
          className,
        )}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Check size={26} strokeWidth={2.5} />
        </span>
        <h3 className="text-lg font-semibold text-foreground">{m.successTitle}</h3>
        <p className="max-w-xs text-sm text-muted-foreground">{m.successBody}</p>
        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            setSelectedSlotId(null);
          }}
          className="mt-2 text-xs font-bold tracking-wider text-accent-readable uppercase transition-opacity hover:opacity-70"
        >
          {m.newRequest}
        </button>
      </div>
    );
  }

  const submit = async () => {
    if (!selectedSlot) return;
    setStatus('submitting');
    try {
      await onSubmit?.({ slotId: selectedSlot.id, guests });
      setStatus('done');
    } catch {
      setStatus('idle');
    }
  };

  return (
    <div
      className={cn(
        'grid gap-6 rounded-2xl border border-border bg-card p-5 sm:p-6 md:grid-cols-2',
        className,
      )}
    >
      {/* ── Kalender ── */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
          <Calendar size={14} /> {m.pickDate}
        </h3>
        <DatePicker.Root
          inline
          locale={locale === 'de' ? 'de-DE' : 'en-US'}
          selectionMode="single"
          defaultFocusedValue={firstDate ? parseDate(firstDate) : undefined}
          value={selectedDate ? [parseDate(selectedDate)] : []}
          isDateUnavailable={(date) => !bookableDates.has(date.toString())}
          onValueChange={(details) => {
            const next = details.value[0];
            setSelectedDate(next ? next.toString() : null);
            setSelectedSlotId(null);
          }}
        >
          <DatePicker.Content className="w-full">
            <DatePicker.View view="day">
              <DatePicker.Context>
                {(api) => (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <DatePicker.PrevTrigger className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                        <ChevronLeft size={16} />
                      </DatePicker.PrevTrigger>
                      <span className="text-sm font-semibold text-foreground">
                        {api.visibleRangeText.start}
                      </span>
                      <DatePicker.NextTrigger className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                        <ChevronRight size={16} />
                      </DatePicker.NextTrigger>
                    </div>
                    <DatePicker.Table className="w-full border-collapse">
                      <DatePicker.TableHead>
                        <DatePicker.TableRow>
                          {api.weekDays.map((day, i) => (
                            <DatePicker.TableHeader
                              key={i}
                              className="pb-2 text-[10px] font-bold tracking-wide text-muted-foreground/70 uppercase"
                            >
                              {day.narrow}
                            </DatePicker.TableHeader>
                          ))}
                        </DatePicker.TableRow>
                      </DatePicker.TableHead>
                      <DatePicker.TableBody>
                        {api.weeks.map((week, i) => (
                          <DatePicker.TableRow key={i}>
                            {week.map((day, j) => (
                              <DatePicker.TableCell key={j} value={day} className="p-0.5 text-center">
                                <DatePicker.TableCellTrigger
                                  className={cn(
                                    'mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm text-foreground transition-all',
                                    'hover:bg-muted',
                                    'data-[today]:font-bold data-[today]:text-accent',
                                    'data-[selected]:bg-accent data-[selected]:text-accent-foreground data-[selected]:font-semibold data-[selected]:hover:bg-accent',
                                    'data-[unavailable]:pointer-events-none data-[unavailable]:text-muted-foreground/25',
                                    'data-[disabled]:pointer-events-none data-[disabled]:opacity-25',
                                    'data-[outside-range]:text-muted-foreground/30',
                                  )}
                                >
                                  {day.day}
                                </DatePicker.TableCellTrigger>
                              </DatePicker.TableCell>
                            ))}
                          </DatePicker.TableRow>
                        ))}
                      </DatePicker.TableBody>
                    </DatePicker.Table>
                  </div>
                )}
              </DatePicker.Context>
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Root>
      </div>

      {/* ── Uhrzeit + Gäste + Absenden ── */}
      <div className="flex flex-col border-t border-border pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-6">
        <h3 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
          <Clock size={14} /> {m.pickTime}
        </h3>

        {!selectedDate ? (
          <p className="text-sm text-muted-foreground">{m.pickDateHint}</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {daySlots.map((slot) => {
                const active = slot.id === selectedSlotId;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      setSelectedSlotId(slot.id);
                      setGuests((g) => Math.min(Math.max(1, g), slot.capacity));
                    }}
                    className={cn(
                      'flex flex-col items-start gap-0.5 rounded-xl border px-3.5 py-2 text-left transition-all',
                      active
                        ? 'border-accent bg-accent/10 text-foreground'
                        : 'border-border text-muted-foreground hover:border-accent/50 hover:text-foreground',
                    )}
                  >
                    <span className="text-sm font-semibold tabular-nums">{slot.time}</span>
                    <span className="text-[10px] tracking-wide uppercase">
                      {interpolate(m.seatsLeft, { count: slot.capacity })}
                      {slot.price != null && ` · ${currency.format(slot.price)}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedSlot && (
              <div className="mt-auto flex flex-col gap-4 pt-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <Users size={15} /> {m.guests}
                  </span>
                  <NumberInput
                    value={guests}
                    onChange={setGuests}
                    min={1}
                    max={selectedSlot.capacity}
                  />
                </div>
                <button
                  type="button"
                  onClick={submit}
                  disabled={status === 'submitting'}
                  className="min-h-11 w-full rounded-xl bg-accent px-6 py-3 text-xs font-bold tracking-widest text-accent-foreground uppercase transition-all hover:opacity-90 disabled:opacity-60"
                >
                  {status === 'submitting' ? m.submitting : m.submit}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
