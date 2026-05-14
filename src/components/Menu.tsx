import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { products } from '@/data/data';
import type { CartItem, Product } from '@/data/types';
import { ProductCard } from './ProductCard';
import { ProductCustomizer } from './ProductCustomizer';
import { useCart } from '@/hooks/useCart';

const CATEGORIES = [
  { key: 'burger', label: 'Hambúrgueres', emoji: '🍔' },
  { key: 'side', label: 'Acompanhamentos', emoji: '🍟' },
  { key: 'drink', label: 'Bebidas', emoji: '🥤' },
] as const;

export function Menu() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]['key']>('burger');
  const [customizing, setCustomizing] = useState<Product | null>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const { add } = useCart();

  const list = useMemo(() => products.filter((p) => p.type === active), [active]);

  const openProduct = (p: Product, rect: DOMRect) => {
    setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setCustomizing(p);
  };

  const onConfirm = (item: CartItem, o: { x: number; y: number }, image: string) => {
    add(item, o, image);
  };

  return (
    <div className="max-w-2xl mx-auto pb-32">
      {/* Hero */}
      <section className="px-4 pt-5 pb-3">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden relative"
        >
          <div className="ember-gradient p-5 relative">
            <div className="relative z-10">
              <p className="text-[11px] uppercase tracking-widest text-primary-foreground/80 font-bold">
                Hamburgueria artesanal · No carvão
              </p>
              <h1 className="font-display text-4xl text-primary-foreground mt-1 leading-none">
                NA BRASA<br/>NO PONTO CERTO 🔥
              </h1>
              <p className="text-sm text-primary-foreground/90 mt-2 max-w-[80%]">
                Blends artesanais selados, pão brioche e o sabor inconfundível do carvão.
              </p>
            </div>
            <div className="absolute -right-6 -bottom-6 text-[120px] opacity-20 leading-none">🍔</div>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <div className="sticky top-[60px] z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={`shrink-0 px-4 py-2 rounded-full font-bold text-sm transition-all border ${
                active === c.key
                  ? 'ember-gradient text-primary-foreground border-transparent glow-ember'
                  : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              <span className="mr-1.5">{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <section className="px-4 pt-4 space-y-3">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={(r) => openProduct(p, r)} />
        ))}
      </section>

      <ProductCustomizer
        product={customizing}
        origin={origin}
        onClose={() => setCustomizing(null)}
        onConfirm={onConfirm}
      />
    </div>
  );
}