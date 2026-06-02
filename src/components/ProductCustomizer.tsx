import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, ChevronDown } from 'lucide-react';
import type { ComboKind, UnitCatalog } from '@/data/catalog';
import { getProductSauces } from '@/data/catalog';
import type { BurgerAddOn, CartItem, Product } from '@/data/types';
import {
  FREE_SAUCES_PER_BURGER,
  EXTRA_SAUCE_PRICE,
  calcExtraSauceCharge,
  canSelectCombo,
  flattenSauceCounts,
} from '@/utils/burger-rules';
import { formatBRL, uid } from '@/utils/formatters';

interface Props {
  catalog: UnitCatalog;
  product: Product | null;
  origin: { x: number; y: number } | null;
  onClose: () => void;
  onConfirm: (item: CartItem, origin: { x: number; y: number }, image: string) => void;
}

export function ProductCustomizer({ catalog, product, origin, onClose, onConfirm }: Props) {
  const { burgerSizes, burgerAddOns, comboOptions } = catalog;
  const [size, setSize] = useState<string | null>(null);
  const [sauceCounts, setSauceCounts] = useState<Record<string, number>>({});
  const [comboId, setComboId] = useState<ComboKind | null>(null);
  const [comboDrink, setComboDrink] = useState<string | null>(null);
  const [comboError, setComboError] = useState<string | null>(null);
  const [variant, setVariant] = useState<string | null>(null);
  const [option, setOption] = useState<string | null>(null);
  const [addOns, setAddOns] = useState<BurgerAddOn[]>([]);
  const [notes, setNotes] = useState('');
  const [qty, setQty] = useState(1);
  const [addOnsOpen, setAddOnsOpen] = useState(false);

  const sauceOptions = product ? getProductSauces(product, catalog) : [];
  const showSauces = sauceOptions.length > 0;
  const showCombo = product ? canSelectCombo(product) : false;
  const selectedSauces = flattenSauceCounts(sauceCounts);
  const sauceExtra = calcExtraSauceCharge(selectedSauces.length);
  const selectedCombo = comboId
    ? (comboOptions.find((c) => c.id === comboId) ?? null)
    : null;

  const pickCombo = (id: ComboKind | null) => {
    setComboError(null);
    if (!id) {
      setComboId(null);
      setComboDrink(null);
      return;
    }
    const opt = comboOptions.find((c) => c.id === id);
    setComboId(id);
    setComboDrink(opt?.drinkChoices[0] ?? null);
  };

  const sizeList = product?.burgerSizeGroup ? burgerSizes[product.burgerSizeGroup] ?? [] : [];

  useEffect(() => {
    if (!product) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [product]);

  // initialize defaults whenever product changes
  useMemo(() => {
    if (!product) return;
    setSize(sizeList[0]?.name ?? null);
    setSauceCounts({});
    setComboId(null);
    setComboDrink(null);
    setComboError(null);
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
      const combo = selectedCombo?.price ?? 0;
      return product.price + inc + addons + sauceExtra + combo;
    }
    if (product.type === 'side') {
      return product.potatoOptions?.find((o) => o.name === option)?.price ?? product.price;
    }
    if (product.type === 'drink') {
      return product.variants?.find((v) => v.name === variant)?.price ?? product.price;
    }
    return product.price;
  }, [product, size, addOns, option, variant, sizeList, sauceExtra, selectedCombo]);

  const adjustSauce = (name: string, delta: number) => {
    setSauceCounts((prev) => {
      const next = (prev[name] ?? 0) + delta;
      if (next <= 0) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: next };
    });
  };

  const toggleAddOn = (a: BurgerAddOn) => {
    setAddOns((prev) =>
      prev.find((x) => x.id === a.id) ? prev.filter((x) => x.id !== a.id) : [...prev, a],
    );
  };

  const submit = () => {
    if (!product || !origin) return;
    if (selectedCombo && !comboDrink) {
      setComboError('Escolha a bebida do combo.');
      return;
    }
    setComboError(null);
    const item: CartItem = {
      uid: uid(),
      productId: product.id,
      name: product.name,
      image: product.image,
      basePrice: product.price,
      unitPrice,
      quantity: qty,
      selectedSize: product.type === 'burger' ? size ?? undefined : undefined,
      selectedSauces: selectedSauces.length ? selectedSauces : undefined,
      selectedCombo: selectedCombo && comboDrink
        ? {
            id: selectedCombo.id,
            label: `Combo ${selectedCombo.shortLabel} + batata P`,
            price: selectedCombo.price,
            drink: comboDrink,
          }
        : undefined,
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
          className="fixed inset-0 z-[55] bg-coal/80 backdrop-blur-sm flex items-end sm:items-center justify-center overflow-hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md max-h-[90dvh] flex flex-col bg-card rounded-t-3xl sm:rounded-3xl border border-border overflow-hidden overscroll-contain"
          >
            <div className="relative h-28 sm:h-32 shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-coal/80 text-foreground flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-2 left-4 right-4">
                <h2 className="font-display text-2xl sm:text-3xl text-foreground leading-none">
                  {product.name}
                </h2>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain scrollbar-hide px-4 py-3 space-y-3">
              <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">
                {product.description}
              </p>

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

              {showSauces && (
                <Section title="Molhos" compact>
                  <p className="text-[10px] text-muted-foreground mb-1.5 leading-tight">
                    {FREE_SAUCES_PER_BURGER} grátis · +{formatBRL(EXTRA_SAUCE_PRICE)} cada extra
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 max-w-full">
                    {sauceOptions.map((s) => {
                      const count = sauceCounts[s] ?? 0;
                      return (
                        <div
                          key={s}
                          className={`flex items-center justify-between gap-0.5 px-1 py-0.5 rounded-md border min-h-[32px] min-w-0 ${
                            count > 0
                              ? 'border-primary/50 bg-primary/10'
                              : 'border-border bg-secondary/40'
                          }`}
                        >
                          <span className="text-[9px] font-medium text-foreground truncate leading-tight flex-1 min-w-0">
                            {s}
                          </span>
                          <div className="flex items-center shrink-0">
                            <button
                              type="button"
                              onClick={() => adjustSauce(s, -1)}
                              disabled={count === 0}
                              className="w-5 h-5 rounded-full bg-coal flex items-center justify-center disabled:opacity-40"
                              aria-label={`Menos ${s}`}
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="w-3 text-center text-[9px] font-bold tabular-nums">
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={() => adjustSauce(s, 1)}
                              className="w-5 h-5 rounded-full bg-coal flex items-center justify-center"
                              aria-label={`Mais ${s}`}
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}

              {showCombo && (
                <Section title="Combo">
                  <div className="grid grid-cols-4 gap-1.5">
                    <ComboMiniBtn
                      active={comboId === null}
                      onClick={() => pickCombo(null)}
                      label="Só"
                      price={null}
                    />
                    {comboOptions.map((c) => (
                      <ComboMiniBtn
                        key={c.id}
                        active={comboId === c.id}
                        onClick={() => pickCombo(c.id)}
                        label={c.shortLabel}
                        price={c.price}
                      />
                    ))}
                  </div>
                  {selectedCombo && selectedCombo.drinkChoices.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wide">
                        Bebida
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedCombo.drinkChoices.map((d) => (
                          <button
                            key={d}
                            type="button"
                            title={d}
                            onClick={() => {
                              setComboDrink(d);
                              setComboError(null);
                            }}
                            className={`max-w-full px-2 py-1 rounded-md border text-[10px] leading-tight font-medium transition-colors truncate ${
                              comboDrink === d
                                ? 'border-primary bg-primary/10 text-foreground'
                                : 'border-border bg-secondary/40 text-muted-foreground'
                            }`}
                          >
                            {d.replace(/ lata| \d+ml/gi, '').trim()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {comboError && (
                    <p className="text-[11px] text-destructive mt-1.5">{comboError}</p>
                  )}
                </Section>
              )}

              {product.type === 'burger' && (
                <div>
                  <button
                    onClick={() => setAddOnsOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-border bg-secondary/40"
                  >
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-sm tracking-widest text-primary">ADICIONAIS</h4>
                      {addOns.length > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md ember-gradient text-primary-foreground">
                          {addOns.length}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform ${addOnsOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {addOnsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 gap-1.5 pt-2">
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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

function Section({
  title,
  children,
  compact,
}: {
  title: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div>
      <h4
        className={`font-display tracking-widest text-primary ${
          compact ? 'text-[11px] mb-1.5' : 'text-sm mb-2'
        }`}
      >
        {title.toUpperCase()}
      </h4>
      {children}
    </div>
  );
}

function ComboMiniBtn({
  active,
  onClick,
  label,
  price,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  price: number | null;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center min-h-[52px] px-1 py-1.5 rounded-lg border text-center transition-colors ${
        active
          ? 'border-primary bg-primary/10 text-foreground'
          : 'border-border bg-secondary/40 text-muted-foreground'
      }`}
    >
      <span className="text-[11px] font-bold leading-tight">{label}</span>
      {price != null && (
        <span className="text-[9px] text-primary font-semibold mt-0.5">+{formatBRL(price)}</span>
      )}
    </button>
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