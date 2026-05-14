import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { UnitKey } from '@/data/types';

const KEY = 'nb_unit';

interface UnitCtx {
  unit: UnitKey | null;
  setUnit: (u: UnitKey) => void;
  clear: () => void;
}
const Ctx = createContext<UnitCtx | null>(null);

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnitState] = useState<UnitKey | null>(null);
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null;
    if (stored === 'brazlandia' || stored === 'vicentePires') setUnitState(stored);
  }, []);
  const setUnit = useCallback((u: UnitKey) => {
    localStorage.setItem(KEY, u);
    setUnitState(u);
  }, []);
  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
    setUnitState(null);
  }, []);
  return <Ctx.Provider value={{ unit, setUnit, clear }}>{children}</Ctx.Provider>;
}

export function useUnit() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useUnit must be used within UnitProvider');
  return ctx;
}