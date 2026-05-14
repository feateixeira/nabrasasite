export interface BurgerSize {
  name: string;
  priceIncrease: number;
}

export interface BurgerAddOn {
  id: string;
  name: string;
  price: number;
}

export interface PotatoOption {
  name: string;
  price: number;
  description: string;
}

export interface DrinkVariant {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: 'burger' | 'side' | 'drink';
  burgerSizeGroup?: string;
  availableSauces?: string[];
  potatoOptions?: PotatoOption[];
  variants?: DrinkVariant[];
  drinkType?: string;
  specialTags?: string[];
  isUnavailable?: boolean;
  isLoadable?: boolean;
  loadedPrice?: number;
}

export type OrderType = 'pickup' | 'delivery';
export type PaymentMethod = 'cash' | 'credit' | 'debit' | 'pix';
export type UnitKey = 'brazlandia' | 'vicentePires';

export interface CartItem {
  uid: string;
  productId: string;
  name: string;
  image: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  selectedSize?: string;
  selectedSauce?: string;
  selectedVariant?: string;
  selectedOption?: string;
  addOns: BurgerAddOn[];
  notes?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address?: string;
  complement?: string;
}

export interface Order {
  unit: UnitKey;
  items: CartItem[];
  generalNotes?: string;
  orderType: OrderType;
  customer: CustomerInfo;
  payment: PaymentMethod;
  changeFor?: string;
  coupon?: string;
  discount: number;
  subtotal: number;
  total: number;
}