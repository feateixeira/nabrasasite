import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';
import type { BurgerAddOn, CartItem, Product } from '@/data/types';
import { burgerAddOns, burgerSizes } from '@/data/data';
import { formatBRL, uid } from '@/utils/formatters';

interface Props {
  product: Product | null;
  origin: { x: number; y: number } | null;
  onClose: () => void;
  onConfirm: (item: CartItem, origin: { x: number; y: number }, image: string) => void;
}

export function ProductCustomizer({ product, origin, onClose, onConfirm }: Props) {
  const [size, setSize] = useState<string | null>(null);
  const [sauce, setSauce] = useState<string | null>(null);
  const [variant, setVariant] = useState<string | null>(null);
  const [option, setOption] = useState<string | null>(null);
  const [addOns, setAddOns] = useState<BurgerAddOn[]>([]);
  const [notes, setNotes] = useState('');
  const [qty, setQty] = useState(1);

  const sizeList = product?.burgerSizeGroup ? burgerSizes[product.burgerSizeGroup] ?? [] : [];

  // initialize defaults whenever product changes
  useMemo(() => {
    if (!product) return;
    setSize(sizeList[0]?.name ?? null);
    setSauce(null);
    setOption(product.potatoOptions?.[0]?.name ?? null);
    setVariant(product.variants?.[0]?.name ?? null);
    setAddOns([]);
    setNotes('');
    setQty(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    if (product.type === 'burger') {
      const inc = sizeList.find((s) => s.name === size)?.priceIncrease ?? 0;
      const addons = addOns.reduce((s, a) => s + a.price, 0);
      return product.price + inc + addons;
    }
    if (product.type === 'side') {
      return product.potatoOptions?.find((o) => o.name === option)?.price ?? product.price;
    }
    if (product.type === 'drink') {
      return product.variants?.find((v) => v.name === variant)?.price ?? product.price;
    }
    return product.price;
  }, [product, size, addOns, option, variant, sizeList]);

  const toggleAddOn = (a: BurgerAddOn) => {
    setAddOns((prev) =>
      prev.find((x) => x.id === a.id) ? prev.filter((x) => x.id !== a.id) : [...prev, a],
    );
  };

  const submit = () => {
    if (!product || !origin) return;
    const item: CartItem = {
      uid: uid(),
      productId: product.id,
      name: product.name,
      image: product.image,
      basePrice: product.price,
      unitPrice,
      quantity: qty,
      selectedSize: product.type === 'burger' ? size ?? undefined : undefined,
      selectedSauce: sauce ?? undefined,
      selectedVariant: variant ?? undefined,
      selectedOption: option ?? undefined,
      addOns,
      notes: notes.trim() || undefined,
    };
    onConfirm(item, origin, product.image);
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] bg-coal/80 backdrop-blur-sm flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md max-h-[92vh] flex flex-col bg-card rounded-t-3xl sm:rounded-3xl border border-border overflow-hidden"
          >
            <div className="relative h-44 shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-coal/80 text-foreground flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <h2 className="font-display text-3xl text-foreground leading-none">{product.name}</h2>
              </div>
            </div>

            <div className="overflow-y-auto px-4 py-4 space-y-5 flex-1">
              <p className="text-sm text-muted-foreground">{product.description}</p>

              {product.type === 'burger' && sizeList.length > 0 && (
                <Section title="Tamanho">
                  <div className="grid grid-cols-3 gap-2">
                    {sizeList.map((s) => (
                      <Chip
                        key={s.name}
                        active={size === s.name}
                        onClick={() => setSize(s.name)}
                        label={s.name}
                        sub={s.priceIncrease > 0 ? `+${formatBRL(s.priceIncrease)}` : 'incluso'}
                      />
                    ))}
                  </div>
                </Section>
              )}

              {product.type === 'burger' && product.availableSauces && (
                <Section title="Molho (opcional)">
                  <div className="flex flex-wrap gap-2">
                    {product.availableSauces.map((s) => (
                      <Chip
                        key={s}
                        active={sauce === s}
                        onClick={() => setSauce(sauce === s ? null : s)}
                        label={s}
                      />
                    ))}
                  </div>
                </Section>
              )}

              {product.type === 'burger' && (
                <Section title="Adicionais">
                  <div className="grid grid-cols-1 gap-1.5">
                    {burgerAddOns.map((a) => {
                      const on = !!addOns.find((x) => x.id === a.id);
                      return (
                        <button
                          key={a.id}
                          onClick={() => toggleAddOn(a)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors ${
                            on
                              ? 'border-primary bg-primary/10 text-foreground'
                              : 'border-border bg-secondary/40 text-muted-foreground'
                          }`}
                        >
                          <span>{a.name}</span>
                          <span className="font-medium text-primary">+{formatBRL(a.price)}</span>
                        </button>
                      );
                    })}
                  </div>
                </Section>
              )}

              {product.type === 'side' && product.potatoOptions && (
                <Section title="Opção">
                  <div className="space-y-1.5">
                    {product.potatoOptions.map((o) => (
                      <button
                        key={o.name}
                        onClick={() => setOption(o.name)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                          option === o.name
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-secondary/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground">{o.name}</span>
                          <span className="text-primary font-bold">{formatBRL(o.price)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{o.description}</div>
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              {product.type === 'drink' && product.variants && (
                <Section title="Sabor">
                  <div className="space-y-1.5">
                    {product.variants.map((v) => (
                      <button
                        key={v.name}
                        onClick={() => setVariant(v.name)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm flex items-center justify-between transition-colors ${
                          variant === v.name
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-secondary/40'
                        }`}
                      >
                        <span className="text-foreground">{v.name}</span>
                        <span className="text-primary font-bold">{formatBRL(v.price)}</span>
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              <Section title="Observações do item">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value.slice(0, 200))}
                  placeholder="Ex: ponto da carne bem passado, sem alface..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-secondary/40 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </Section>
            </div>

            <div className="border-t border-border p-3 flex items-center gap-3 bg-card">
              <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full bg-coal flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-7 text-center font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-8 h-8 rounded-full bg-coal flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={submit}
                className="flex-1 h-12 rounded-full ember-gradient text-primary-foreground font-bold flex items-center justify-between px-5 glow-ember"
              >
                <span>Adicionar</span>
                <span>{formatBRL(unitPrice * qty)}</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-display text-sm tracking-widest text-primary mb-2">{title.toUpperCase()}</h4>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  label,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sub?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
        active ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-secondary/40 text-muted-foreground'
      }`}
    >
      <div className="font-bold">{label}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
    </button>
  );
}