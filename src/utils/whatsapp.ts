import type { Order } from '@/data/types';
import { UNITS } from '@/config/units';
import { formatBRL } from './formatters';

const PAYMENT_LABEL: Record<string, string> = {
  cash: 'Dinheiro',
  credit: 'Cartão de Crédito',
  debit: 'Cartão de Débito',
  pix: 'PIX',
};

export function buildWhatsAppMessage(order: Order): string {
  const unit = UNITS[order.unit];
  const lines: string[] = [];
  lines.push(`*NOVO PEDIDO — Na Brasa ${unit.name}* 🔥`);
  lines.push('');
  lines.push(`*Cliente:* ${order.customer.name}`);
  lines.push(`*Telefone:* ${order.customer.phone}`);
  lines.push(`*Tipo:* ${order.orderType === 'pickup' ? '🏪 Retirar no balcão' : '🚚 Entrega'}`);
  if (order.orderType === 'delivery') {
    lines.push(`*Endereço:* ${order.customer.address ?? ''}`);
    if (order.customer.complement) lines.push(`*Complemento:* ${order.customer.complement}`);
  }
  lines.push('');
  lines.push('*— ITENS —*');
  order.items.forEach((it, idx) => {
    lines.push(`${idx + 1}. ${it.quantity}x ${it.name}`);
    if (it.selectedSize) lines.push(`   • Tamanho: ${it.selectedSize}`);
    if (it.selectedSauce) lines.push(`   • Molho: ${it.selectedSauce}`);
    if (it.selectedVariant) lines.push(`   • Sabor: ${it.selectedVariant}`);
    if (it.selectedOption) lines.push(`   • Opção: ${it.selectedOption}`);
    if (it.addOns.length) {
      lines.push(`   • Adicionais: ${it.addOns.map((a) => a.name).join(', ')}`);
    }
    if (it.notes) lines.push(`   • Obs: ${it.notes}`);
    lines.push(`   • Subtotal: ${formatBRL(it.unitPrice * it.quantity)}`);
  });
  lines.push('');
  if (order.generalNotes) {
    lines.push(`*Observações gerais:* ${order.generalNotes}`);
    lines.push('');
  }
  lines.push(`*Pagamento:* ${PAYMENT_LABEL[order.payment]}`);
  if (order.payment === 'cash' && order.changeFor) {
    lines.push(`*Troco para:* ${order.changeFor}`);
  }
  if (order.coupon && order.discount > 0) {
    lines.push(`*Cupom:* ${order.coupon} (-${formatBRL(order.discount)})`);
  }
  lines.push('');
  lines.push(`*Subtotal:* ${formatBRL(order.subtotal)}`);
  if (order.orderType === 'delivery') lines.push(`*Taxa de entrega:* a combinar`);
  if (order.discount > 0) lines.push(`*Desconto:* -${formatBRL(order.discount)}`);
  lines.push(`*TOTAL:* ${formatBRL(order.total)}`);
  return lines.join('\n');
}

export function sendToWhatsApp(order: Order): void {
  const phone = UNITS[order.unit].whatsapp;
  const msg = buildWhatsAppMessage(order);
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

/**
 * STUB: integração com sistema interno por unidade.
 * TODO: configurar endpoint e credenciais reais.
 */
export async function sendToInternalSystem(order: Order): Promise<{ ok: boolean }> {
  const unit = UNITS[order.unit];
  // eslint-disable-next-line no-console
  console.info('[sendToInternalSystem] enviar pedido', { systemUser: unit.systemUser, order });
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true };
}