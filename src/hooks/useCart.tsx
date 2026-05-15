import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CartItem } from '@/data/types';

interface FlyEvent {
  id: string;
  image: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
}

interface CartCtx {
  items: CartItem[];
  add: (item: CartItem, from?: { x: number; y: number }, image?: string) => void;
  remove: (uid: string) => void;
  setQty: (uid: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  flyEvents: FlyEvent[];
  consumeFly: (id: string) => void;
  cartIconRef: React.MutableRefObject<HTMLButtonElement | null>;
  setCartIconRef: (el: HTMLButtonElement | null) => void;
  bumpKey: number;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [flyEvents, setFly] = useState<FlyEvent[]>([]);
  const [bumpKey, setBumpKey] = useState(0);
  const iconRef = useMemo(() => ({ current: null as HTMLButtonElement | null }), []);

  const add = useCallback((item: CartItem, from?: { x: number; y: number }, image?: string) => {
    setItems((prev) => [...prev, item]);
    if (from) {
      const r = iconRef.current?.getBoundingClientRect();
      if (r) {
        const to = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        const id = Math.random().toString(36).slice(2);
        setFly((p) => [...p, { id, image: image ?? item.image, from, to }]);
      }
    }
    setBumpKey((k) => k + 1);
  }, [iconRef]);

  const remove = useCallback((uid: string) => {
    setItems((prev) => prev.filter((i) => i.uid !== uid));
  }, []);

  const setQty = useCallback((uid: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.uid === uid ? { ...i, quantity: Math.max(1, qty) } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    [items],
  );
  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

  const consumeFly = useCallback((id: string) => {
    setFly((p) => p.filter((e) => e.id !== id));
  }, []);

  const setCartIconRef = useCallback(
    (el: HTMLButtonElement | null) => {
      iconRef.current = el;
    },
    [iconRef],
  );

  return (
    <Ctx.Provider
      value={{
        items,
        add,
        remove,
        setQty,
        clear,
        subtotal,
        count,
        isOpen,
        open: () => setOpen(true),
        close: () => setOpen(false),
        flyEvents,
        consumeFly,
        cartIconRef: iconRef,
        setCartIconRef,
        bumpKey,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}