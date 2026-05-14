import { BurgerSize, BurgerAddOn, Product } from './types';

// Memoização dos dados para evitar recálculos desnecessários
const memoizedProducts: Product[] = [
  {
    id: '1',
    name: 'Na Brasa Smash',
    description: 'Pao brioche selado na manteiga, Smash 80g com crostinha irresistivel, coberto por muito cheddar e o doce da cebola caramelizada.',
    price: 22.99,
    image: 'https://imgur.com/jWdX4Hv.jpg',
    type: 'burger' as const,
    burgerSizeGroup: 'group7',
    specialTags: ['🔥 NOVIDADE'],
  },
  {
    id: '2',
    name: 'Na Brasa Supremo',
    description: 'Blend artesanal 130g super suculento, cheddar derretido, bacon crocante em cubos, cebola roxa fresca e alface no pao brioche macio.',
    price: 22.99,
    image: 'https://i.imgur.com/L8H1DKU.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group2'
  },
  {
    id: '3',
    name: 'Na Brasa Especial',
    description: 'A combinacao perfeita: Blend 130g, cheddar cremoso, fartura de bacon e nossa cebola caramelizada especial para realcar o sabor.',
    price: 22.99,
    image: 'https://i.imgur.com/yCmVi65.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group2'
  },
  {
    id: '4',
    name: 'Na Brasa Frango Supremo',
    description: 'Crocancia extrema: File de frango empanado e douradinho, cheddar, salada fresca (alface, tomate e cebola roxa) no pao brioche.',
    price: 24.99,
    image: 'https://imgur.com/5EtACiS.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group5',
    specialTags: ['🔥 NOVIDADE'],
  },
  {
    id: '5',
    name: 'Na Brasa Eno',
    description: 'Para quem tem fome de verdade: Meio quilo de carne (4 blends), quadrupla camada de cheddar, farofa de bacon e Onion Rings crocantes. Voce aguenta?',
    price: 46.99,
    image: 'https://imgur.com/rWtnci3.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group9',
    specialTags: ['🔥 NOVIDADE', '🧌 MOOOONSTRO'],
  },
  {
    id: '6',
    name: 'Na Brasa Clássico',
    description: 'O simples perfeito: Pao brioche fofinho, blend artesanal 130g no ponto certo, cheddar e alface.',
    price: 15.00,
    image: 'https://imgur.com/KDqnnFM.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group1',
    specialTags: ['🏷️ EM PROMOÇÃO']
  },
  {
    id: '7',
    name: 'Na Brasa Salada',
    description: 'Leve e saboroso: Blend 130g, queijo cheddar derretido e o frescor da alface com tomate selecionado.',
    price: 16.00,
    image: 'https://imgur.com/FYR1uNM.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group1',
  },
  {
    id: '8',
    name: 'Na Brasa Frango',
    description: 'Frango 100% peito, empanamento crocante sequinho, queijo cheddar e alface no pao brioche.',
    price: 22.00,
    image: 'https://imgur.com/hN0qVs5.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group5'
  
  },
  {
    id: '9',
    name: 'Baguete na brasa',
    description: 'Baguete crocante por fora e macia por dentro, recheada com frango, carne ou coracao, queijo gratinado e MOLHO ESPECIAL.',
    price: 18.00,
    image: 'https://imgur.com/umBsINp.jpg',
    type: 'burger' as const,
    burgerSizeGroup: 'groupBaguete',
    specialTags: ['🔥 NOVIDADE'],
    isUnavailable: true,
  },
  {
    id: '10',
    name: 'Cebolas Empanadas',
    description: 'Cebolas empanadas crocantes + acompanha ketchup',
    price: 20.00,
    image: 'https://imgur.com/nVhfvNe.jpg',
    type: 'side' as const,
    potatoOptions: [
      {
        name: 'M',
        price: 20.00,
        description: '300g de cebolas empanadas + acompanha ketchup'
      },
      {
        name: 'G',
        price: 30.00,
        description: '500g de cebolas empanadas + acompanha ketchup'
      }
    ]
  },
  {
    id: '11',
    name: 'Batata Frita Pequena',
    description: 'Porção de batatas fritas crocantes (150g)',
    price: 8.00,
    image: 'https://imgur.com/i85TfIw.jpg',
    type: 'side' as const,
    isLoadable: true,
    loadedPrice: 12.00,
    potatoOptions: [
      {
        name: 'Normal',
        price: 8.00,
        description: 'Porção de batatas fritas crocantes (150g)'
      }
    ]
  },
  {
    id: '12',
    name: 'Batata Frita Média',
    description: 'Porção de batatas fritas, queijo cheddar e bacon crocante (300g)',
    price: 16.00,
    image: 'https://i.imgur.com/gofB12Nh.jpg',
    type: 'side' as const,
    isLoadable: true,
    loadedPrice: 16.00,
    potatoOptions: [
      {
        name: 'Normal',
        price: 16.00,
        description: 'Porção de batatas fritas crocantes (300g)'
      },
      {
        name: 'Recheada',
        price: 22.00,
        description: 'Porção de batatas fritas crocantes (300g) com queijo cheddar e bacon crocante'
      }
    ]
  },
  {
    id: '13',
    name: 'Batata Frita Grande',
    description: 'Porção de batatas fritas crocantes (400g)',
    price: 25.00,
    image: 'https://i.imgur.com/w74DsJdh.jpg',
    type: 'side' as const,
    isLoadable: true,
    loadedPrice: 25.00,
    potatoOptions: [
      {
        name: 'Normal',
        price: 25.00,
        description: 'Porção de batatas fritas crocantes (400g)'
      },
      {
        name: 'Recheada',
        price: 32.00,
        description: 'Porção de batatas fritas crocantes (400g) com queijo cheddar e bacon crocante'
      }
    ]
  },
  {
    id: '14',
    name: 'Fritas especiais da casa',
    description: 'Porção de Batata frita com frango frito, cheddar e bacon & com muito recheio',
    price: 25.00,
    image: 'https://imgur.com/AlEjCem.jpg',
    type: 'side' as const,
    specialTags: ['Super Especial', 'Muuuito Recheio'],
    potatoOptions: [
      {
        name: 'M',
        price: 30.00,
        description: 'Porção média de batata frita com frango, cheddar e bacon'
      },
      {
        name: 'G',
        price: 45.00,
        description: 'Porção grande de batata frita com frango, cheddar e bacon'
      }
    ]
  },
  {
    id: '15',
    name: 'Frango no Pote',
    description: 'Filé de peito de frango empanado na farinha Panko com temperos especiais + acompanha molhos barbecue e rosê',
    price: 20.00,
    image: 'https://imgur.com/QOI8aaw.jpg',
    type: 'side' as const,
    potatoOptions: [
      {
        name: 'P',
        price: 20.00,
        description: 'Porção pequena de frango empanado (200gramas em média) + acompanha molhos Barbecue e Rosê'
      },
      {
        name: 'M',
        price: 30.00,
        description: 'Porção média de frango empanado (500gramas em média) + acompanha molhos Barbecue e Rosê'
      },
      {
        name: 'G',
        price: 50.00,
        description: 'Porção grande de frango empanado (750gramas em média) + acompanha molhos Barbecue e Rosê'
      }
    ]
  },
  {
    id: '16',
    name: 'Refrigerante Lata',
    description: '350ml',
    price: 5.00,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500',
    type: 'drink' as const,
    drinkType: 'refri-lata',
    variants: [
      { name: 'Coca-Cola Zero lata', price: 5 },
      { name: 'Coca-Cola lata', price: 5 },
      { name: 'Guaraná lata', price: 5 }
    ]
  },
  {
    id: '17',
    name: 'Refrigerante 600ml',
    description: '600ml',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1605712916345-6ef6bcc2e29c?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500',
    type: 'drink' as const,
    drinkType: 'refri-600',
    variants: [
      { name: 'Coca-Cola 600ml', price: 8 },
      { name: 'Guaraná 600ml', price: 8 }
    ]
  },
  {
    id: '18',
    name: 'Sucos 1 litro',
    description: '1 litro',
    price: 8.00,
    image: 'https://i.imgur.com/pujtyWe.jpg',
    type: 'drink' as const,
    drinkType: 'refri-1litro',
    variants: [
      { name: 'Suco Dell Vale Uva 1lt', price: 8 },
      { name: 'Suco Dell Vale Maracujá1lt', price: 8 },
      { name: 'Suco Dell Vale Laranja 1lt', price: 8 },
      { name: 'Suco Dell Vale Pêssego 1lt', price: 8 }
    ]
  },
  {
    id: '19',
    name: 'Refrigerante 2 litros',
    description: '2 litros',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1733909295574-debb36b2fdb1?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500',
    type: 'drink' as const,
    drinkType: 'refri-2litros',
    variants: [
      { name: 'Coca-Cola 2l', price: 12 },
      { name: 'Coca-Cola Zero 2l', price: 12 },
      { name: 'Guaraná 2l', price: 12 }
    ]
  },
  {
    id: '20',
    name: 'Água',
    description: 'Água',
    price: 3.00,
    image: 'https://imgur.com/LPcCVPL.jpg',
    type: 'drink' as const,
    drinkType: 'agua',
    variants: [
      { name: 'Água com gás', price: 4 },
      { name: 'Água sem gás', price: 3 }
    ]
  }
 ,
  {
    id: '21',
    name: 'Sucos Na Brasa 500ml', 
    description: 'Sucos naturais',
    price: 12.00,
    image: 'https://imgur.com/kAfQiPT.jpg',
    type: 'drink' as const,
    drinkType: 'suco',
    variants: [
      { name: 'Suco de Morango 400ml', price: 12  },
      { name: 'Suco de Maracujá 400ml', price: 12 },
      { name: 'Suco de Acerola 400ml', price: 12 }
    ]
  },
  {
    id: '22',
    name: 'Cremes Na Brasa 500ml',
    description: 'Cremes naturais',
    price: 14.00,
    image: 'https://imgur.com/vzVBARw.jpg', 
    type: 'drink' as const,
    drinkType: 'creme',
    variants: [
      { name: 'Creme de Maracujá 400ml', price: 14 },
      { name: 'Creme de Morango 400ml', price: 14 },
    ]
  },
  {
    id: '23',
    name: 'Lemonades 500ml',
    description: 'lemonades gaseificadas',
    price: 15.00,
    image: 'https://imgur.com/jKPxAK6.jpg', 
    type: 'drink' as const,
    drinkType: 'drink',
    specialTags: ['🔥 NOVIDADE'],
    variants: [
      { name: 'Lemonade de Limão 400ml', price: 15 },
      { name: 'Pink Lemonade 400ml', price: 15 },
    ]
  }
];

// Função para carregar os produtos de forma lazy
export const getProducts = () => {
  return new Promise<Product[]>((resolve) => {
    setTimeout(() => {
      resolve(memoizedProducts);
    }, 0);
  });
};

// Exportar os dados memoizados
export const products = memoizedProducts;

export const burgerSizes: Record<string, BurgerSize[]> = {
  group1: [
    { name: 'Simples', priceIncrease: 0 },
    { name: 'Duplo', priceIncrease: 8 },
    { name: 'Triplo', priceIncrease: 15 }
  ],
  group2: [
    { name: 'Simples', priceIncrease: 0 },
    { name: 'Duplo', priceIncrease: 8 },
    { name: 'Triplo', priceIncrease: 13 }
  ],
  group3: [
    { name: 'Nutella', priceIncrease: 0 },
    { name: 'Doce de Leite', priceIncrease: 0 }
  ],
  group4: [
    { name: 'P', priceIncrease: 0 },
    { name: 'M', priceIncrease: 17 },
    { name: 'G', priceIncrease: 30 }
  ],
  group5: [
    { name: 'Simples', priceIncrease: 0 },
    { name: 'Duplo', priceIncrease: 8 }
  ],
  group6: [
    { name: 'Simples', priceIncrease: 0 }
  ],
  group7: [
    { name: 'Duplo', priceIncrease: 0 },
    { name: 'Triplo', priceIncrease: 5 }
  ],
  group8: [
    { name: 'Simples', priceIncrease: 0 },
    { name: 'Duplo', priceIncrease: 11 },
    { name: 'Triplo', priceIncrease: 15 }
  ]
  ,
  group9: [
    { name: 'Monstro', priceIncrease: 0 }
  ],
  groupBaguete: [
    { name: 'Frango cremoso', priceIncrease: 0 },
    { name: 'Carne pedaços', priceIncrease: 2 },
    { name: 'Coraçãozinho', priceIncrease: 4 }
  ]
};

export const drinkOptions = [
  { name: 'Coca-Cola', price: 5 },
  { name: 'Coca-Cola Zero', price: 5 },
  { name: 'Guaraná', price: 5 }
];

export const burgerAddOns: BurgerAddOn[] = [
  { id: 'addon-blend-130', name: 'Blend carne 130g', price: 8 },
  { id: 'addon-blend-frango', name: 'Blend de frango frito', price: 8 },
  { id: 'addon-farofa', name: 'Farofa de bacon', price: 4 },
  { id: 'addon-mussarela', name: 'Mussarela em fatia', price: 2 },
  { id: 'addon-alface', name: 'Alface', price: 2 },
  { id: 'addon-tomate', name: 'Tomate', price: 2 },
  { id: 'addon-cebola-roxa', name: 'Cebola roxa', price: 4 },
  { id: 'addon-cebola-caramel', name: 'Cebola caramelizada', price: 4 },
  { id: 'addon-molho', name: 'Molho', price: 3 },
  { id: 'addon-anel-cebola', name: 'Anel de cebola(3 un)', price: 4 },
  { id: 'addon-smash-80', name: 'Blend smash 80g', price: 6 },
  { id: 'addon-ovo', name: 'Ovo frito (1 un)', price: 4 },
  { id: 'addon-picles', name: 'Picles', price: 3 }
];