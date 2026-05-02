import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeldKeys, useHotkey } from '@tanstack/react-hotkeys';
import { useHotkeysRegistry, useDesignEngineHotkey, HotkeyMetadata } from './hotkeys-provider';
import { cn } from '../lib/utils';

interface ShortcutOverviewProps {
  /** Key to hold to show the overview (default: Shift) */
  triggerKey?: string;
  /** Duration to hold in ms before showing (default: 800) */
  holdDuration?: number;
  className?: string;
}

export function ShortcutOverview({
  triggerKey = 'Shift',
  holdDuration = 800,
  className
}: ShortcutOverviewProps) {
  const { registry } = useHotkeysRegistry();
  const heldKeys = useHeldKeys();
  const [isVisible, setIsVisible] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ? key toggles the overview — also registers itself in the shortcut list
  useDesignEngineHotkey(
    '?',
    () => setIsVisible(v => !v),
    { label: 'Shortcuts anzeigen', description: 'Übersicht öffnen / schließen', category: 'Global' }
  );

  // Escape closes when open — not in registry since it's implicit
  useHotkey('Escape', () => setIsVisible(false));

  // Hold-trigger: show after holdDuration, hide on release
  useEffect(() => {
    const isTriggerHeld = heldKeys.includes(triggerKey);

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (isTriggerHeld) {
      holdTimerRef.current = setTimeout(() => setIsVisible(true), holdDuration);
    } else {
      setIsVisible(false);
    }

    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
    };
  }, [heldKeys, triggerKey, holdDuration]);

  const groupedHotkeys = Array.from(registry.values()).reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, HotkeyMetadata[]>);

  const categories = ['Global', 'Navigation', 'Actions', 'Context'] as const;

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Shortcut Übersicht"
          className={cn('fixed inset-0 z-[1000] flex items-center justify-center p-6', className)}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            aria-hidden="true"
            onClick={() => setIsVisible(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-card/95 border border-border rounded-3xl shadow-2xl p-8 overflow-hidden backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Shortcut Overview</h2>
                <p className="text-muted-foreground mt-1">
                  Alle aktiven Tastenkürzel auf dieser Seite
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-muted border border-border rounded-full text-xs text-muted-foreground font-medium">
                  <kbd className="font-bold text-foreground">?</kbd> zum Öffnen
                </span>
                <span className="px-3 py-1.5 bg-muted border border-border rounded-full text-xs text-muted-foreground font-medium">
                  Halte <kbd className="font-bold text-accent">{triggerKey}</kbd>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map(category => {
                const items = groupedHotkeys[category];
                if (!items || items.length === 0) return null;

                return (
                  <div key={category} className="space-y-4">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-accent opacity-80">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {items.map((item, idx) => (
                        <div
                          key={`${item.key}-${idx}`}
                          className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/60 hover:border-border transition-all duration-150"
                        >
                          <div className="min-w-0 pr-4">
                            <div className="text-sm font-semibold text-foreground truncate">{item.label}</div>
                            {item.description && (
                              <div className="text-xs text-muted-foreground mt-0.5 truncate">
                                {item.description}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            {item.key.split('+').map((k, i) => (
                              <kbd
                                key={i}
                                className="min-w-[24px] h-6 px-1.5 flex items-center justify-center bg-muted border border-border rounded-md text-[10px] font-bold text-foreground"
                              >
                                {k === 'Mod' ? '⌘' : k}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Accent glow decoration */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
