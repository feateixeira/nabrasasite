import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { Product } from '@/data/types';
import { formatBRL } from '@/utils/formatters';

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

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="charcoal-card border border-border rounded-2xl overflow-hidden flex gap-3 p-3"
    >
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
        <h3 className="font-display text-lg leading-tight text-foreground">{product.name}</h3>
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