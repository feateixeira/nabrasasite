import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useUnit } from '@/hooks/useUnit';
import { UNITS } from '@/config/units';
import { formatBRL, maskPhone } from '@/utils/formatters';
import { formatComboSummary, formatSaucesSummary } from '@/utils/burger-rules';
import type { Order, OrderType, PaymentMethod } from '@/data/types';
import { sendToInternalSystem, sendToWhatsApp } from '@/utils/whatsapp';

const PAYMENT_OPTIONS: { key: PaymentMethod; label: string; emoji: string }[] = [
  { key: 'pix', label: 'PIX', emoji: '⚡' },
  { key: 'credit', label: 'Crédito', emoji: '💳' },
  { key: 'debit', label: 'Débito', emoji: '💳' },
  { key: 'cash', label: 'Dinheiro', emoji: '💵' },
];

export function Cart() {
  const { items, isOpen, close, setQty, remove, subtotal, clear } = useCart();
  const { unit } = useUnit();

  const [generalNotes, setGeneralNotes] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [complement, setComplement] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('pix');
  const [changeFor, setChangeFor] = useState('');
  const [showCoupon, setShowCoupon] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<Order | null>(null);
  const [errors, setErrors] = useState<string | null>(null);

  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);

  const validate = (): string | null => {
    if (!name.trim()) return 'Informe seu nome.';
    if (phone.replace(/\D/g, '').length < 10) return 'Telefone inválido.';
    if (orderType === 'delivery' && !address.trim()) return 'Informe o endereço.';
    return null;
  };

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    // mock validation
    if (code === 'NABRASA10') {
      setAppliedCoupon({ code, discount: Math.min(10, subtotal * 0.1) });
    } else {
      setAppliedCoupon({ code, discount: 5 }); // mock fallback
    }
  };

  const tryConfirm = () => {
    const err = validate();
    if (err) {
      setErrors(err);
      return;
    }
    setErrors(null);
    setConfirming(true);
  };

  const submit = async () => {
    if (!unit) return;
    setSubmitting(true);
    setErrors(null);
    const order: Order = {
      unit,
      items,
      generalNotes: generalNotes.trim() || undefined,
      orderType,
      customer: {
        name: name.trim(),
        phone,
        address: orderType === 'delivery' ? address.trim() : undefined,
        complement: orderType === 'delivery' ? complement.trim() || undefined : undefined,
      },
      payment,
      changeFor: payment === 'cash' && changeFor.trim() ? changeFor.trim() : undefined,
      coupon: appliedCoupon?.code,
      discount,
      subtotal,
      total,
    };
    const idempotencyKey = crypto.randomUUID();
    try {
      const result = await sendToInternalSystem(order, idempotencyKey);
      if (!result.ok) {
        setErrors(result.error);
        setSubmitting(false);
        return;
      }
    } catch (e) {
      console.error(e);
      setErrors('Não foi possível enviar seu pedido. Verifique sua conexão e tente novamente.');
      setSubmitting(false);
      return;
    }
    sendToWhatsApp(order);
    setSubmitting(false);
    setConfirming(false);
    setSuccess(order);
    clear();
  };

  const reset = () => {
    setSuccess(null);
    setName('');
    setPhone('');
    setAddress('');
    setComplement('');
    setGeneralNotes('');
    setChangeFor('');
    setCoupon('');
    setAppliedCoupon(null);
    setShowCoupon(false);
    close();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[58] bg-coal/80 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-background border-l border-border flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-coal">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-display text-2xl">SEU PEDIDO</h2>
              </div>
              <button onClick={close} className="p-2 rounded-lg hover:bg-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <SuccessView order={success} onClose={reset} />
            ) : items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <div className="text-6xl mb-3">🛒</div>
                <p className="font-display text-2xl">Carrinho vazio</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Adicione itens do cardápio para continuar.
                </p>
                <button
                  onClick={close}
                  className="mt-5 px-5 py-2 rounded-full ember-gradient text-primary-foreground font-bold"
                >
                  Ver cardápio
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-brasa px-4 py-3 space-y-4">
                  {/* Items */}
                  <div className="space-y-2">
                    {items.map((it) => (
                      <div key={it.uid} className="charcoal-card rounded-xl p-3 border border-border">
                        <div className="flex gap-3">
                          <img src={it.image} alt="" className="w-14 h-14 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h4 className="font-bold leading-tight">{it.name}</h4>
                                <div className="text-[11px] text-muted-foreground mt-0.5 space-y-0.5">
                                  {it.selectedSize && <div>Tamanho: {it.selectedSize}</div>}
                                  {(() => {
                                    const sauces = formatSaucesSummary(it);
                                    return sauces ? <div>{sauces}</div> : null;
                                  })()}
                                  {formatComboSummary(it) && (
                                    <div>{formatComboSummary(it)}</div>
                                  )}
                                  {it.selectedVariant && <div>{it.selectedVariant}</div>}
                                  {it.selectedOption && <div>Opção: {it.selectedOption}</div>}
                                  {it.addOns.length > 0 && (
                                    <div>+ {it.addOns.map((a) => a.name).join(', ')}</div>
                                  )}
                                  {it.notes && <div className="italic">"{it.notes}"</div>}
                                </div>
                              </div>
                              <button
                                onClick={() => remove(it.uid)}
                                className="text-muted-foreground hover:text-destructive p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1 bg-secondary rounded-full p-0.5">
                                <button
                                  onClick={() => setQty(it.uid, it.quantity - 1)}
                                  className="w-7 h-7 rounded-full bg-coal flex items-center justify-center"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-sm font-bold">
                                  {it.quantity}
                                </span>
                                <button
                                  onClick={() => setQty(it.uid, it.quantity + 1)}
                                  className="w-7 h-7 rounded-full bg-coal flex items-center justify-center"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="font-bold text-primary">
                                {formatBRL(it.unitPrice * it.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Field label="Observações para o pedido completo">
                    <textarea
                      value={generalNotes}
                      onChange={(e) => setGeneralNotes(e.target.value.slice(0, 300))}
                      rows={2}
                      placeholder="Ex: sem sal, alergia a amendoim..."
                      className="w-full px-3 py-2 rounded-lg bg-secondary/40 border border-border text-sm focus:outline-none focus:border-primary"
                    />
                  </Field>

                  <Field label="Tipo de pedido">
                    <div className="grid grid-cols-2 gap-2">
                      <Toggle
                        active={orderType === 'pickup'}
                        onClick={() => setOrderType('pickup')}
                        label="🏪 Retirar"
                      />
                      <Toggle
                        active={orderType === 'delivery'}
                        onClick={() => setOrderType('delivery')}
                        label="🚚 Entrega"
                      />
                    </div>
                  </Field>

                  <Field label="Nome completo *">
                    <Input value={name} onChange={(v) => setName(v)} placeholder="Seu nome" />
                  </Field>
                  <Field label="Telefone *">
                    <Input
                      value={phone}
                      onChange={(v) => setPhone(maskPhone(v))}
                      placeholder="(61) 9 9999-9999"
                      inputMode="tel"
                    />
                  </Field>

                  {orderType === 'delivery' && (
                    <>
                      <Field label="Endereço completo *">
                        <Input
                          value={address}
                          onChange={(v) => setAddress(v)}
                          placeholder="Rua, número, bairro"
                        />
                      </Field>
                      <Field label="Complemento / Referência">
                        <Input
                          value={complement}
                          onChange={(v) => setComplement(v)}
                          placeholder="Apto, casa amarela, próximo a..."
                        />
                      </Field>
                    </>
                  )}

                  <Field label="Forma de pagamento">
                    <div className="grid grid-cols-2 gap-2">
                      {PAYMENT_OPTIONS.map((p) => (
                        <button
                          key={p.key}
                          onClick={() => setPayment(p.key)}
                          className={`px-3 py-2.5 rounded-lg border text-sm font-bold transition-colors ${
                            payment === p.key
                              ? 'border-primary bg-primary/10 text-foreground'
                              : 'border-border bg-secondary/40 text-muted-foreground'
                          }`}
                        >
                          <span className="mr-1.5">{p.emoji}</span>
                          {p.label}
                        </button>
                      ))}
                    </div>
                    {payment === 'cash' && (
                      <div className="mt-2">
                        <Input
                          value={changeFor}
                          onChange={(v) => setChangeFor(v)}
                          placeholder="Troco para quanto? (opcional)"
                          inputMode="numeric"
                        />
                      </div>
                    )}
                  </Field>

                  <div>
                    {!showCoupon ? (
                      <button
                        onClick={() => setShowCoupon(true)}
                        className="text-sm text-primary font-bold"
                      >
                        🏷️ Tenho um cupom
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                          placeholder="Código do cupom"
                          className="flex-1 px-3 py-2 rounded-lg bg-secondary/40 border border-border text-sm focus:outline-none focus:border-primary uppercase"
                        />
                        <button
                          onClick={applyCoupon}
                          className="px-4 py-2 rounded-lg ember-gradient text-primary-foreground text-sm font-bold"
                        >
                          Aplicar
                        </button>
                      </div>
                    )}
                    {appliedCoupon && (
                      <div className="text-xs text-primary mt-1.5">
                        ✓ Cupom <b>{appliedCoupon.code}</b> aplicado · -{formatBRL(appliedCoupon.discount)}
                      </div>
                    )}
                  </div>

                  <div className="charcoal-card rounded-xl p-3 border border-border space-y-1.5">
                    <Row label="Subtotal" value={formatBRL(subtotal)} />
                    {orderType === 'delivery' && (
                      <Row label="Taxa de entrega" value="a combinar" muted />
                    )}
                    {discount > 0 && (
                      <Row label="Desconto" value={`- ${formatBRL(discount)}`} accent />
                    )}
                    <div className="border-t border-border my-1" />
                    <Row label="Total" value={formatBRL(total)} big />
                  </div>

                  {errors && (
                    <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                      {errors}
                    </div>
                  )}
                </div>

                <div className="border-t border-border p-3 bg-coal">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={tryConfirm}
                    className="w-full h-12 rounded-full ember-gradient text-primary-foreground font-bold flex items-center justify-center gap-2 glow-ember"
                  >
                    Enviar pedido · {formatBRL(total)}
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>

          {/* Confirm modal */}
          <AnimatePresence>
            {confirming && unit && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-coal/85 flex items-center justify-center p-4"
                onClick={() => !submitting && setConfirming(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 10 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-card border border-border rounded-2xl p-5 max-w-sm w-full"
                >
                  <h3 className="font-display text-2xl mb-2">CONFIRMAR PEDIDO</h3>
                  <p className="text-sm text-muted-foreground">
                    Seu pedido será enviado para a unidade{' '}
                    <b className="text-foreground">{UNITS[unit].name}</b>.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Ao confirmar, seu pedido chega automaticamente no nosso sistema antes mesmo
                    de aparecer no WhatsApp. Mesmo que você feche o WhatsApp depois, ele já estará
                    registrado conosco. 😊
                  </p>
                  {errors && (
                    <div className="mt-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                      {errors}
                    </div>
                  )}
                  <div className="flex gap-2 mt-5">
                    <button
                      disabled={submitting}
                      onClick={() => setConfirming(false)}
                      className="flex-1 h-11 rounded-full border border-border bg-secondary text-foreground font-bold disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      disabled={submitting}
                      onClick={submit}
                      className="flex-1 h-11 rounded-full ember-gradient text-primary-foreground font-bold flex items-center justify-center gap-2 glow-ember disabled:opacity-70"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
                        </>
                      ) : (
                        'Confirmar'
                      )}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SuccessView({ order, onClose }: { order: Order; onClose: () => void }) {
  const unit = UNITS[order.unit];
  return (
    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-brasa px-5 py-8">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 rounded-full ember-gradient mx-auto flex items-center justify-center glow-ember"
      >
        <Check className="w-10 h-10 text-primary-foreground" strokeWidth={3} />
      </motion.div>
      <h2 className="font-display text-3xl text-center mt-4">PEDIDO ENVIADO!</h2>
      <p className="text-sm text-muted-foreground text-center mt-1">
        Já registramos seu pedido para a unidade <b className="text-foreground">{unit.name}</b>.
      </p>

      <div className="charcoal-card rounded-xl p-4 mt-6 border border-border">
        <div className="text-xs text-muted-foreground mb-2">Resumo</div>
        {order.items.map((i) => (
          <div key={i.uid} className="flex justify-between text-sm py-0.5">
            <span>
              {i.quantity}x {i.name}
            </span>
            <span className="text-muted-foreground">{formatBRL(i.unitPrice * i.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-primary">{formatBRL(order.total)}</span>
        </div>
      </div>

      <a
        href={`https://wa.me/${unit.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        className="mt-6 w-full h-12 rounded-full ember-gradient text-primary-foreground font-bold flex items-center justify-center glow-ember"
      >
        Abrir WhatsApp da unidade
      </a>
      <button
        onClick={onClose}
        className="mt-2 w-full h-11 rounded-full border border-border bg-secondary font-bold"
      >
        Fechar
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  );
}
function Input({
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: 'tel' | 'numeric' | 'text';
}) {
  return (
    <input
      value={value}
      inputMode={inputMode}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-lg bg-secondary/40 border border-border text-sm focus:outline-none focus:border-primary"
    />
  );
}
function Toggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2.5 rounded-lg border text-sm font-bold transition-colors ${
        active
          ? 'border-primary bg-primary/10 text-foreground'
          : 'border-border bg-secondary/40 text-muted-foreground'
      }`}
    >
      {label}
    </button>
  );
}
function Row({
  label,
  value,
  big,
  muted,
  accent,
}: {
  label: string;
  value: string;
  big?: boolean;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div className={`flex justify-between ${big ? 'text-base font-bold' : 'text-sm'}`}>
      <span className={muted ? 'text-muted-foreground' : ''}>{label}</span>
      <span className={accent ? 'text-primary font-bold' : big ? 'text-primary' : 'text-foreground'}>
        {value}
      </span>
    </div>
  );
}