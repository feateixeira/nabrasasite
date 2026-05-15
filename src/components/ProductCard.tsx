import { motion } from 'framer-motion';
import { Plus, Crown } from 'lucide-react';
import type { Product } from '@/data/types';
import { formatBRL } from '@/utils/formatters';

const PREMIUM_IDS = new Set(['1', '2', '3', '4', '5']);

interface Props {
  product: Product;
  onAdd: (rect: DOMRect) => void;
}

export function ProductCard({ product, onAdd }: Props) {
  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onAdd(r);
  };
  const unavailable = product.isUnavailable;
  const isPremium = product.type === 'burger' && PREMIUM_IDS.has(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`${
        isPremium ? 'premium-card' : 'charcoal-card border border-border'
      } rounded-2xl flex gap-3 p-3 relative`}
    >
      {isPremium && (
        <div className="absolute -top-2 left-3 z-10 premium-badge text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md flex items-center gap-1 shadow-lg">
          <Crown className="w-3 h-3" strokeWidth={2.5} />
          Premium
        </div>
      )}
      <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-coal">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover ${unavailable ? 'grayscale opacity-60' : ''}`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23222"/></svg>';
          }}
        />
        {isPremium && (
          <div className="absolute inset-0 ring-1 ring-inset ring-primary/40 rounded-xl pointer-events-none" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        {product.specialTags && product.specialTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {product.specialTags.map((t) => (
              <span
                key={t}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md ember-gradient text-primary-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <h3 className={`font-display text-lg leading-tight ${isPremium ? 'ember-text' : 'text-foreground'}`}>
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{product.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-primary font-bold">
            {product.type === 'burger' && 'a partir de '}
            {formatBRL(product.price)}
          </span>
          {unavailable ? (
            <span className="text-[10px] uppercase font-bold text-destructive border border-destructive/40 rounded-md px-2 py-1">
              Indisponível
            </span>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handle}
              className="w-9 h-9 rounded-full ember-gradient text-primary-foreground flex items-center justify-center glow-ember"
              aria-label={`Adicionar ${product.name}`}
            >
              <Plus className="w-5 h-5" strokeWidth={3} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  );
}