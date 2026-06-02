import type { BurgerAddOn, BurgerSize, Product, UnitKey } from './types';
import {
  products as productsBrazlandia,
  burgerSizes as burgerSizesBrazlandia,
  burgerAddOns as burgerAddOnsBrazlandia,
} from './data';
import {
  products as productsVicentePires,
  burgerSizes as burgerSizesVicentePires,
  burgerAddOns as burgerAddOnsVicentePires,
} from './data-vicente-pires';

export type ComboKind = 'refri' | 'suco' | 'creme';

export interface ComboOption {
  id: ComboKind;
  shortLabel: string;
  price: number;
  /** drinkType do cardápio de bebidas da unidade */
  drinkType: string;
  drinkChoices: string[];
}

export interface UnitCatalog {
  products: Product[];
  burgerSizes: Record<string, BurgerSize[]>;
  burgerAddOns: BurgerAddOn[];
  /** Molhos disponíveis para hambúrgueres (exceto smash e baguete). */
  burgerSauces: string[];
  comboOptions: ComboOption[];
}

/** Lista padrão — edite aqui ou por produto com `availableSauces` no cardápio da unidade. */
const BURGER_SAUCES_BRAZLANDIA = ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'];
const BURGER_SAUCES_VICENTE_PIRES = ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'];

/** Acréscimo do combo (batata P + bebida) — por unidade */
const COMBO_UPCHARGE: Record<UnitKey, Record<ComboKind, number>> = {
  brazlandia: { refri: 10, suco: 16, creme: 18 },
  vicentePires: { refri: 14, suco: 20, creme: 24 },
};

const COMBO_DRINK_TYPES: Record<ComboKind, string> = {
  refri: 'refri-lata',
  suco: 'suco',
  creme: 'creme',
};

const COMBO_LABELS: Record<ComboKind, string> = {
  refri: 'Refri',
  suco: 'Suco',
  creme: 'Creme',
};

function drinkChoicesForType(products: Product[], drinkType: string): string[] {
  const drink = products.find((p) => p.type === 'drink' && p.drinkType === drinkType);
  return drink?.variants?.map((v) => v.name) ?? [];
}

function buildComboOptions(products: Product[], unit: UnitKey): ComboOption[] {
  const prices = COMBO_UPCHARGE[unit];
  return (['refri', 'suco', 'creme'] as ComboKind[]).map((id) => ({
    id,
    shortLabel: COMBO_LABELS[id],
    price: prices[id],
    drinkType: COMBO_DRINK_TYPES[id],
    drinkChoices: drinkChoicesForType(products, COMBO_DRINK_TYPES[id]),
  }));
}

/** Cardápio completo por unidade — edite `data.ts` ou `data-vicente-pires.ts` separadamente. */
export const CATALOGS: Record<UnitKey, UnitCatalog> = {
  brazlandia: {
    products: productsBrazlandia,
    burgerSizes: burgerSizesBrazlandia,
    burgerAddOns: burgerAddOnsBrazlandia,
    burgerSauces: BURGER_SAUCES_BRAZLANDIA,
    comboOptions: buildComboOptions(productsBrazlandia, 'brazlandia'),
  },
  vicentePires: {
    products: productsVicentePires,
    burgerSizes: burgerSizesVicentePires,
    burgerAddOns: burgerAddOnsVicentePires,
    burgerSauces: BURGER_SAUCES_VICENTE_PIRES,
    comboOptions: buildComboOptions(productsVicentePires, 'vicentePires'),
  },
};

export function getProductSauces(product: Product, catalog: UnitCatalog): string[] {
  if (product.type !== 'burger') return [];
  if (product.burgerSizeGroup === 'groupBaguete') return [];
  if (product.burgerSizeGroup === 'group7' || product.name.toLowerCase().includes('smash')) {
    return [];
  }
  if (product.availableSauces?.length) return product.availableSauces;
  return catalog.burgerSauces;
}

export function getCatalog(unit: UnitKey): UnitCatalog {
  return CATALOGS[unit];
}

export function getComboOption(catalog: UnitCatalog, id: ComboKind): ComboOption | undefined {
  return catalog.comboOptions.find((c) => c.id === id);
}
