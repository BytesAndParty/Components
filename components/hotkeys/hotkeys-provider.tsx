import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useHotkey, HotkeyOptions } from '@tanstack/react-hotkeys';

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

/**
 * Enhanced hook that wraps TanStack useHotkey and registers metadata for the Overview UI.
 */
export function useDesignEngineHotkey(
  key: string,
  callback: (event: KeyboardEvent) => void,
  metadata: Omit<HotkeyMetadata, 'key'>,
  options?: HotkeyOptions
) {
  const { register, unregister } = useHotkeysRegistry();
  const id = React.useId();

  // 1. Register with TanStack Hotkeys
  useHotkey(key, callback, options);

  // 2. Register metadata for the Overview UI
  React.useEffect(() => {
    register(id, { key, ...metadata });
    return () => unregister(id);
  }, [id, key, metadata.label, metadata.description, metadata.category, register, unregister]);
}

interface HotkeysProviderProps {
  children: ReactNode;
}

export function HotkeysProvider({ children }: HotkeysProviderProps) {
  const [registry, setRegistry] = useState<Map<string, HotkeyMetadata>>(new Map());

  const register = useCallback((id: string, metadata: HotkeyMetadata) => {
    setRegistry((prev) => {
      const next = new Map(prev);
      next.set(id, metadata);
      return next;
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setRegistry((prev) => {
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
