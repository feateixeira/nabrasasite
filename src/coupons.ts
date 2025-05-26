export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  maxUses: number;
  validUntil: string; // Data de validade no formato ISO
  minOrderValue?: number; // Valor mínimo do pedido para usar o cupom
  description: string;
}

// Lista de cupons disponíveis
export const availableCoupons: Coupon[] = [
  {
    code: 'NABRASA10',
    discount: 10,
    type: 'percentage',
    maxUses: 200,
    validUntil: '2025-12-31T23:59:59',
    minOrderValue: 100,
    description: '10% de desconto em pedidos acima de R$ 100,00'
  },
  {
    code: 'PRIMEIROPEDIDO',
    discount: 5,
    type: 'fixed',
    maxUses: 1,
    validUntil: '2024-12-31T23:59:59',
    description: 'R$ 5,00 de desconto no seu primeiro pedido'
  }
];

// Interface para armazenar o uso dos cupons
interface CouponUsage {
  code: string;
  uses: number;
  lastUsed: string;
}

// Função para obter o uso dos cupons do localStorage
const getCouponUsage = (): Record<string, CouponUsage> => {
  const usage = localStorage.getItem('couponUsage');
  return usage ? JSON.parse(usage) : {};
};

// Função para salvar o uso dos cupons no localStorage
const saveCouponUsage = (usage: Record<string, CouponUsage>) => {
  localStorage.setItem('couponUsage', JSON.stringify(usage));
};

// Função para validar um cupom
export const validateCoupon = (code: string, orderValue: number): { valid: boolean; message: string; discount: number } => {
  const coupon = availableCoupons.find(c => c.code === code);
  
  if (!coupon) {
    return { valid: false, message: 'Cupom inválido', discount: 0 };
  }

  const now = new Date();
  const validUntil = new Date(coupon.validUntil);

  if (now > validUntil) {
    return { valid: false, message: 'Cupom expirado', discount: 0 };
  }

  if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
    return { 
      valid: false, 
      message: `Pedido mínimo de R$ ${coupon.minOrderValue.toFixed(2)} para usar este cupom`, 
      discount: 0 
    };
  }

  const usage = getCouponUsage();
  const couponUsage = usage[code] || { uses: 0, lastUsed: '' };

  if (couponUsage.uses >= coupon.maxUses) {
    return { valid: false, message: 'Cupom atingiu o limite máximo de uso', discount: 0 };
  }

  // Atualiza o uso do cupom
  usage[code] = {
    uses: couponUsage.uses + 1,
    lastUsed: now.toISOString()
  };
  saveCouponUsage(usage);

  const discount = coupon.type === 'percentage' 
    ? (orderValue * coupon.discount) / 100 
    : coupon.discount;

  return { 
    valid: true, 
    message: `Cupom aplicado com sucesso! Desconto de ${coupon.type === 'percentage' ? coupon.discount + '%' : 'R$ ' + coupon.discount.toFixed(2)}`, 
    discount 
  };
};

// Função para calcular o desconto
export const calculateDiscount = (code: string, orderValue: number): number => {
  const { valid, discount } = validateCoupon(code, orderValue);
  return valid ? discount : 0;
}; 