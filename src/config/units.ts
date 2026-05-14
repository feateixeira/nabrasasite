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
    placeId: 'GOOGLE_PLACE_ID_BRAZLANDIA',
    systemUser: 'SYSTEM_USER_BRAZLANDIA',
    address: 'Endereço Brazlândia (a preencher)',
    hours: 'Ter–Dom: 18h às 22h',
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