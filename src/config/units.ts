import type { UnitKey } from '@/data/types';

export interface UnitConfig {
  key: UnitKey;
  name: string;
  whatsapp: string;
  placeId: string;
  systemUser: string;
  address: string;
  hours: string;
}

export const UNITS: Record<UnitKey, UnitConfig> = {
  brazlandia: {
    key: 'brazlandia',
    name: 'Brazlândia',
    whatsapp: '5561993709608',
    placeId: 'ChIJPeK2VACxW5MRD_0bNk3GX8A',
    systemUser: 'SYSTEM_USER_BRAZLANDIA',
    address: 'Quadra 35 Conjunto i Lote 23 - Brazlândia-DF',
    hours: 'Qua-Dom: 19h às 23h',
  },
  vicentePires: {
    key: 'vicentePires',
    name: 'Vicente Pires',
    whatsapp: '5561998922711',
    placeId: 'GOOGLE_PLACE_ID_VP',
    systemUser: 'SYSTEM_USER_VP',
    address: 'Endereço Vicente Pires (a preencher)',
    hours: 'A definir',
  },
};

export const UNIT_LIST: UnitConfig[] = [UNITS.brazlandia, UNITS.vicentePires];

/** Slug enviado ao Burguer.IA (online-order-intake) */
export const ESTABELECIMENTO_SLUG: Record<UnitKey, string> = {
  brazlandia: 'brazlandia',
  vicentePires: 'vicente-pires',
};

export function getEstabelecimentoSlug(unit: UnitKey): string {
  return ESTABELECIMENTO_SLUG[unit];
}