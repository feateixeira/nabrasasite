import { useEffect, useRef } from 'react';
import { useCart } from '@/hooks/useCart';
import { useUnit } from '@/hooks/useUnit';

/** Limpa carrinho e modal ao trocar de unidade (evita itens de cardápios diferentes). */
export function UnitCartSync() {
  const { unit } = useUnit();
  const { clear, close } = useCart();
  const prevUnit = useRef(unit);

  useEffect(() => {
    const prev = prevUnit.current;
    if (prev && unit && prev !== unit) {
      clear();
      close();
    }
    prevUnit.current = unit;
  }, [unit, clear, close]);

  return null;
}
