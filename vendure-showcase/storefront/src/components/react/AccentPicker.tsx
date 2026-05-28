import { Popover } from '@ark-ui/react/popover';
import { Portal } from '@ark-ui/react/portal';
import { Check } from 'lucide-react';
import { useAtelier } from '@components/atelier';
import { useT } from '@/lib/i18n';

interface AccentOption {
  key: string;
  /** Display swatch colour — kept in sync with the matching CSS rule in styles.css. */
  swatch: string;
  label: { de: string; en: string };
}

const ACCENTS: ReadonlyArray<AccentOption> = [
  { key: 'bordeaux',  swatch: 'oklch(0.45 0.16 25)',  label: { de: 'Bordeaux',  en: 'Bordeaux'  } },
  { key: 'gold',      swatch: 'oklch(0.72 0.13 75)',  label: { de: 'Gold',      en: 'Gold'      } },
  { key: 'forest',    swatch: 'oklch(0.50 0.10 145)', label: { de: 'Wald',      en: 'Forest'    } },
  { key: 'aubergine', swatch: 'oklch(0.45 0.13 320)', label: { de: 'Aubergine', en: 'Aubergine' } },
  { key: 'indigo',    swatch: 'oklch(0.55 0.18 270)', label: { de: 'Indigo',    en: 'Indigo'    } },
];

export function AccentPicker() {
  const { accent, setAccent, locale } = useAtelier();
  const t = useT();

  return (
    <Popover.Root positioning={{ placement: 'bottom-end' }}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
          aria-label={t.accentToggle}
          title={t.accentToggle}
        >
          <span
            className="w-5 h-5 rounded-full border border-border/60"
            style={{ background: 'var(--accent)' }}
            aria-hidden="true"
          />
        </button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner style={{ zIndex: 50 }}>
          <Popover.Content className="bg-card border border-border rounded-xl shadow-xl p-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <ul className="flex flex-col gap-0.5 min-w-44" role="listbox" aria-label={t.accentToggle}>
              {ACCENTS.map((opt) => {
                const isActive = opt.key === accent;
                return (
                  <li key={opt.key}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => setAccent(opt.key)}
                      className="w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-border/60 shrink-0"
                        style={{ background: opt.swatch }}
                        aria-hidden="true"
                      />
                      <span className="flex-1 text-left">
                        {opt.label[locale as 'de' | 'en'] ?? opt.label.en}
                      </span>
                      {isActive && <Check size={14} aria-hidden="true" className="text-accent" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
