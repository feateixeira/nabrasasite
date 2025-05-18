export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: 'burger' | 'side' | 'drink';
  availableSauces?: string[];
  variants?: DrinkVariant[];
  drinkType?: string;
  burgerSizeGroup?: string;
  isSweetBurger?: boolean;
  sweetOptions?: SweetOption[];
  isLoadable?: boolean;
  loadedPrice?: number;
  potatoOptions?: PotatoOption[];
  isUnavailable?: boolean;
}

export interface DrinkVariant {
  name: string;
  price: number;
}

export interface SweetOption {
  name: string;
  price: number;
  image: string;
}

export interface BurgerSize {
  name: string;
  priceIncrease: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSauce?: string;
  selectedSauces: string[];
  extraSauces: string[];
  notes?: string;
  selectedVariant?: DrinkVariant;
  selectedSize?: BurgerSize;
  selectedSweetOptions?: SweetOption[];
  isLoaded?: boolean;
  selectedPotatoOption?: PotatoOption;
  isTrio?: boolean;
  trioDetails?: {
    drinkName: string;
  };
}

export type DeliveryType = 'pickup' | 'delivery';

export interface PotatoOption {
  name: string;
  price: number;
  description: string;
}