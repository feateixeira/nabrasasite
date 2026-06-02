import type { UnitCatalog } from '@/data/catalog';
import { getProductSauces } from '@/data/catalog';
import type { CartItem, Product } from '@/data/types';
import { formatBRL } from './formatters';

export const FREE_SAUCES_PER_BURGER = 2;
export const EXTRA_SAUCE_PRICE = 2;

export function isBaguette(product: Product): boolean {
  return product.burgerSizeGroup === 'groupBaguete';
}

export function isSmash(product: Product): boolean {
  return (
    product.burgerSizeGroup === 'group7' || product.name.toLowerCase().includes('smash')
  );
}

/** Smash e baguetes usam molho especial da casa — sem escolha. */
export function canSelectSauces(product: Product, catalog: UnitCatalog): boolean {
  return getProductSauces(product, catalog).length > 0;
}

export function canSelectCombo(product: Product): boolean {
  return product.type === 'burger' && !isBaguette(product) && !product.isPreMadeCombo;
}

export function calcExtraSauceCharge(sauceCount: number): number {
  return Math.max(0, sauceCount - FREE_SAUCES_PER_BURGER) * EXTRA_SAUCE_PRICE;
}

export function flattenSauceCounts(counts: Record<string, number>): string[] {
  const list: string[] = [];
  for (const [name, qty] of Object.entries(counts)) {
    for (let i = 0; i < qty; i++) list.push(name);
  }
  return list;
}

export function formatSaucesSummary(item: CartItem): string | null {
  const sauces = item.selectedSauces;
  if (!sauces?.length) return null;
  const counts = new Map<string, number>();
  for (const s of sauces) counts.set(s, (counts.get(s) ?? 0) + 1);
  const parts = [...counts.entries()].map(([name, qty]) =>
    qty > 1 ? `${name} x${qty}` : name,
  );
  const extra = calcExtraSauceCharge(sauces.length);
  if (extra > 0) return `Molhos: ${parts.join(', ')} (+${formatBRL(extra)} extras)`;
  return `Molhos: ${parts.join(', ')}`;
}

export function formatComboSummary(item: CartItem): string | null {
  if (!item.selectedCombo) return null;
  const base = item.selectedCombo.label;
  return item.selectedCombo.drink ? `${base} · ${item.selectedCombo.drink}` : base;
}
