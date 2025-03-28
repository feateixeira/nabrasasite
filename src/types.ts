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
  extraSauces: string[];
  notes?: string;
  selectedVariant?: DrinkVariant;
  selectedSize?: BurgerSize;
  selectedSweetOptions?: SweetOption[];
  isLoaded?: boolean;
}

export type DeliveryType = 'pickup' | 'delivery';