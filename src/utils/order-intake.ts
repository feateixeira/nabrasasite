import type { CartItem, Order, UnitKey } from '@/data/types';
import { getCatalog } from '@/data/catalog';
import { getEstabelecimentoSlug } from '@/config/units';
import { formatComboSummary, formatSaucesSummary } from './burger-rules';

const ENDPOINT_PATH = '/functions/v1/online-order-intake';

export type SendOrderResult =
  | { ok: true; orderId: string; printQueued: boolean; establishmentId: string; siteUnitSlug: string | null }
  | { ok: false; error: string };

interface IntakePayload {
  estabelecimento_slug: string;
  source_domain: string;
  order: {
    customer: { name: string; phone: string };
    items: Array<{
      name: string;
      qty: number;
      unit_price: number;
      sku?: string;
      obs?: string;
      complements: Array<{ name: string; price: number }>;
    }>;
    totals: { subtotal: number; delivery_fee: number; discount: number };
    payment: { method: string };
    meta: Record<string, unknown>;
  };
}

function getEnv(name: string): string | undefined {
  const v = import.meta.env[name];
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

function buildItemObs(item: CartItem): string | undefined {
  const parts: string[] = [];
  if (item.selectedSize) parts.push(`Tamanho: ${item.selectedSize}`);
  const sauces = formatSaucesSummary(item);
  if (sauces) parts.push(sauces);
  const combo = formatComboSummary(item);
  if (combo) parts.push(combo);
  if (item.selectedVariant) parts.push(`Sabor: ${item.selectedVariant}`);
  if (item.selectedOption) parts.push(`Opção: ${item.selectedOption}`);
  if (item.notes) parts.push(item.notes);
  return parts.length ? parts.join(' · ') : undefined;
}

function buildCategorySummary(items: CartItem[], unit: UnitKey) {
  const byId = new Map(getCatalog(unit).products.map((p) => [p.id, p.type]));
  const summary = { burger: 0, side: 0, drink: 0 };
  for (const it of items) {
    const type = byId.get(it.productId);
    if (type) summary[type] += it.quantity;
  }
  return summary;
}

export function buildOrderIntakePayload(order: Order): IntakePayload {
  const estabelecimento_slug = getEstabelecimentoSlug(order.unit);
  const source_domain =
    getEnv('VITE_SOURCE_DOMAIN') ??
    (typeof window !== 'undefined' ? window.location.hostname : 'hamburguerianabrasa.com.br');

  return {
    estabelecimento_slug,
    source_domain,
    order: {
      customer: {
        name: order.customer.name,
        phone: order.customer.phone.replace(/\D/g, ''),
      },
      items: order.items.map((it) => ({
        name: it.name,
        qty: it.quantity,
        unit_price: it.unitPrice,
        sku: it.productId,
        obs: buildItemObs(it),
        complements: [
          ...it.addOns.map((a) => ({ name: a.name, price: a.price })),
          ...(it.selectedCombo
            ? [
                {
                  name: `${it.selectedCombo.label} — ${it.selectedCombo.drink}`,
                  price: it.selectedCombo.price,
                },
              ]
            : []),
        ],
      })),
      totals: {
        subtotal: order.subtotal,
        delivery_fee: 0,
        discount: order.discount,
      },
      payment: { method: order.payment },
      meta: {
        estabelecimento_slug,
        orderType: order.orderType,
        categorySummary: buildCategorySummary(order.items, order.unit),
        generalNotes: order.generalNotes,
        address: order.customer.address,
        complement: order.customer.complement,
        changeFor: order.changeFor,
        coupon: order.coupon,
      },
    },
  };
}

function friendlyError(status: number, body: { error?: string; ok?: boolean }): string {
  const msg = typeof body.error === 'string' ? body.error : '';
  if (status === 401) return 'Falha na autenticação do sistema. Tente novamente em instantes.';
  if (status === 400 && /unidade não encontrada/i.test(msg)) {
    return 'Não encontramos a unidade selecionada. Volte ao início, escolha Brazlândia ou Vicente Pires e tente de novo.';
  }
  if (status === 400 && /idempotency/i.test(msg)) {
    return 'Erro ao registrar o pedido. Tente confirmar novamente.';
  }
  if (msg) return msg;
  return 'Não foi possível enviar seu pedido. Verifique sua conexão e tente novamente.';
}

/**
 * POST Burguer.IA — online-order-intake (multi-unidade via estabelecimento_slug).
 */
export async function submitOnlineOrder(
  order: Order,
  idempotencyKey: string,
): Promise<SendOrderResult> {
  const supabaseUrl = getEnv('VITE_SUPABASE_URL');
  const apiKey = getEnv('VITE_ESTAB_API_KEY');

  if (!supabaseUrl || !apiKey) {
    console.error('[order-intake] VITE_SUPABASE_URL ou VITE_ESTAB_API_KEY não configurados');
    return { ok: false, error: 'Sistema de pedidos temporariamente indisponível. Fale conosco pelo WhatsApp.' };
  }

  const payload = buildOrderIntakePayload(order);
  const url = `${supabaseUrl.replace(/\/$/, '')}${ENDPOINT_PATH}`;

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('[order-intake] enviando', {
      estabelecimento_slug: payload.estabelecimento_slug,
      idempotencyKey,
    });
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Estab-Key': apiKey,
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });

  let body: { ok?: boolean; error?: string; order_id?: string; print_queued?: boolean; establishment_id?: string; site_unit_slug?: string | null } = {};
  try {
    body = await res.json();
  } catch {
    /* resposta não-JSON */
  }

  if (!res.ok) {
    return { ok: false, error: friendlyError(res.status, body) };
  }

  if (!body.ok || !body.order_id) {
    return {
      ok: false,
      error: friendlyError(400, body),
    };
  }

  return {
    ok: true,
    orderId: body.order_id,
    printQueued: Boolean(body.print_queued),
    establishmentId: body.establishment_id ?? '',
    siteUnitSlug: body.site_unit_slug ?? null,
  };
}
