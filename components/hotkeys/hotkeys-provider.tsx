import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useHotkey, HotkeyOptions } from '@tanstack/react-hotkeys';
import { useDeviceCapabilities } from '../lib/use-device-capabilities';

export interface HotkeyMetadata {
  key: string;
  label: string;
  description?: string;
  category: 'Global' | 'Navigation' | 'Actions' | 'Context';
}

interface HotkeysContextValue {
  registry: Map<string, HotkeyMetadata>;
  register: (id: string, metadata: HotkeyMetadata) => void;
  unregister: (id: string) => void;
}

const HotkeysContext = createContext<HotkeysContextValue | null>(null);

export function useHotkeysRegistry() {
  const context = useContext(HotkeysContext);
  if (!context) {
    throw new Error('useHotkeysRegistry must be used within a HotkeysProvider');
  }
  return context;
}

/** Wraps TanStack useHotkey, registers metadata for ShortcutOverview, and auto-disables on touch devices. */
export function useDesignEngineHotkey(
  key: string,
  callback: (event: KeyboardEvent) => void,
  metadata: Omit<HotkeyMetadata, 'key'>,
  options?: HotkeyOptions
) {
  const { register, unregister } = useHotkeysRegistry();
  const { hasFinePointer } = useDeviceCapabilities();
  const id = React.useId();

  useHotkey(key as Parameters<typeof useHotkey>[0], callback, { ...options, enabled: hasFinePointer && (options?.enabled ?? true) });

  React.useEffect(() => {
    if (!hasFinePointer) return;
    register(id, { key, ...metadata });
    return () => unregister(id);
  }, [id, key, metadata.label, metadata.description, metadata.category, register, unregister, hasFinePointer]);
}

export function HotkeysProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<Map<string, HotkeyMetadata>>(new Map());

  const register = useCallback((id: string, metadata: HotkeyMetadata) => {
    setRegistry(prev => {
      const next = new Map(prev);
      next.set(id, metadata);
      return next;
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setRegistry(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return (
    <HotkeysContext.Provider value={{ registry, register, unregister }}>
      {children}
    </HotkeysContext.Provider>
  );
}
