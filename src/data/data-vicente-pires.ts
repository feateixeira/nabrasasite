import { BurgerSize, BurgerAddOn, Product } from './types';

// Memoização dos dados para evitar recálculos desnecessários
const memoizedProducts: Product[] = [
  {
    id: '1',
    name: 'Na Brasa Supremo',
    description: 'Blend artesanal 130g super suculento, cheddar derretido, bacon crocante em cubos, cebola roxa fresca e alface no pao brioche macio.',
    price: 26.99,
    image: 'https://i.imgur.com/L8H1DKU.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group2'
  },
  {
    id: '2',
    name: 'Na Brasa Especial',
    description: 'A combinacao perfeita: Blend 130g, cheddar cremoso, fartura de bacon e nossa cebola caramelizada especial para realcar o sabor.',
    price: 26.99,
    image: 'https://i.imgur.com/yCmVi65.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group2'
  },
  {
    id: '3',
    name: 'Na Brasa Arretado',
    description: 'Blend bovino de 140g, mussarela derretida, bacon crocante, queijo coalho grelhado banhado no melado de cana e nossa maionese especial da casa & molho. Uma combinacao perfeita entre o salgado e o doce.',
    price: 32.99,
    image: 'https://imgur.com/qOeHSYi.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group5',
    specialTags: ['🔥 NOVIDADE'],
  },
  {
    id: '4',
    name: 'Na Brasa Eno',
    description: 'Para quem tem fome de verdade: Meio quilo de carne (4 blends), quadrupla camada de cheddar, farofa de bacon e Onion Rings crocantes. Voce aguenta?',
    price: 46.99,
    image: 'https://imgur.com/rWtnci3.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group9',
    specialTags: ['🧌 MOOOONSTRO'],
  },
  {
    id: '5',
    name: 'Na Brasa Clássico',
    description: 'O simples perfeito: Pao brioche fofinho, blend artesanal 130g no ponto certo, cheddar e alface.',
    price: 20.00,
    image: 'https://imgur.com/KDqnnFM.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group1',
    specialTags: ['🏷️ MAIS POPULAR ']
  },
  {
    id: '6',
    name: 'Na Brasa Frango',
    description: 'Blend(160g) de frango empanado crocante sequinho, queijo mussarela, tomate, alface no pao brioche & molho',
    price: 21.00,
    image: 'https://imgur.com/FYR1uNM.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group1',
  },
  {
    id: '7',
    name: 'Na Brasa Onion',
    description: 'Blend(160g) de frango empanado crocante sequinho, queijo mussarela, tomate, alface no pao brioche & molho',
    price: 23.00,
    image: 'https://imgur.com/hN0qVs5.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group10'
  
  },
  {
    id: '8',
    name: 'Baguete na brasa',
    description: 'Baguete crocante por fora e macia por dentro, recheada com frango, carne ou coracao, queijo gratinado e MOLHO ESPECIAL.',
    price: 22.00,
    image: 'https://imgur.com/umBsINp.jpg',
    type: 'burger' as const,
    burgerSizeGroup: 'groupBaguete',
    isUnavailable: false,
  },
  {
    id: '22',
    name: 'COMBO KIDS',
    description: 'Mini hamburguer(90g) + Porção de batata frita pequena(100g) + Suco de caixinha(verificar disponibilidade) + Doce surpresa',
    price: 35.00,
    image: 'https://imgur.com/YhffK7r.jpg',
    type: 'burger' as const,
    isPreMadeCombo: true,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group11',
  },
  {
    id: '9 ',
    name: 'Cebolas Empanadas',
    description: 'Cebolas empanadas crocantes + acompanha ketchup',
    price: 25.00,
    image: 'https://imgur.com/nVhfvNe.jpg',
    type: 'side' as const,
    potatoOptions: [
      {
        name: 'M',
        price: 25.00,
        description: '300g de cebolas empanadas + acompanha ketchup'
      },
      {
        name: 'G',
        price: 35.00,
        description: '500g de cebolas empanadas + acompanha ketchup'
      }
    ]
  },
  {
    id: '10',
    name: 'Batata Frita Pequena',
    description: 'Porção de batatas fritas crocantes (150g)',
    price: 10.00,
    image: 'https://imgur.com/i85TfIw.jpg',
    type: 'side' as const,
    isLoadable: true,
    loadedPrice: 10.00,
    potatoOptions: [
      {
        name: 'Normal',
        price: 10.00,
        description: 'Porção de batatas fritas crocantes (150g)'
      }
    ]
  },
  {
    id: '11',
    name: 'Batata Frita Média',
    description: 'Porção de batatas fritas, queijo cheddar e bacon crocante (300g)',
    price: 20.00,
    image: 'https://i.imgur.com/gofB12Nh.jpg',
    type: 'side' as const,
    isLoadable: true,
    loadedPrice: 20.00,
    potatoOptions: [
      {
        name: 'Normal',
        price: 20.00,
        description: 'Porção de batatas fritas crocantes (300g)'
      },
      {
        name: 'Recheada',
        price: 27.00,
        description: 'Porção de batatas fritas crocantes (300g) com queijo cheddar e bacon crocante'
      }
    ]
  },
  {
    id: '12',
    name: 'Batata Frita Grande',
    description: 'Porção de batatas fritas crocantes (400g)',
    price: 30.00,
    image: 'https://i.imgur.com/w74DsJdh.jpg',
    type: 'side' as const,
    isLoadable: true,
    loadedPrice: 30.00,
    potatoOptions: [
      {
        name: 'Normal',
        price: 30.00,
        description: 'Porção de batatas fritas crocantes (400g)'
      },
      {
        name: 'Recheada',
        price: 35.00,
        description: 'Porção de batatas fritas crocantes (400g) com queijo cheddar e bacon crocante'
      }
    ]
  },
  {
    id: '13',
    name: 'Fritas especiais da casa',
    description: 'Porção de Batata frita com frango frito, cheddar e bacon & com muito recheio',
    price: 40.00,
    image: 'https://imgur.com/AlEjCem.jpg',
    type: 'side' as const,
    specialTags: ['Super Especial', 'Muuuito Recheio'],
    potatoOptions: [
      {
        name: 'M',
        price: 40.00,
        description: 'Porção média de batata frita com frango, cheddar e bacon'
      },
      {
        name: 'G',
        price: 52.00,
        description: 'Porção grande de batata frita com frango, cheddar e bacon'
      }
    ]
  },
  {
    id: '14',
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
    id: '15',
    name: 'Refrigerante Lata',
    description: '350ml',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500',
    type: 'drink' as const,
    drinkType: 'refri-lata',
    variants: [
      { name: 'Coca-Cola Zero lata', price: 6 },
      { name: 'Coca-Cola lata', price: 6 },
      { name: 'Guaraná Zero lata', price: 6 },
      { name: 'Guaraná lata', price: 6 },
      { name: 'Fanta Laranja lata', price: 6 },
      { name: 'Fanta Uva lata', price: 6 },
      { name: 'Sprite lata', price: 6 },
    ]
  },
  {
    id: '16',
    name: 'Refrigerante 600ml',
    description: '600ml',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1605712916345-6ef6bcc2e29c?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500',
    type: 'drink' as const,
    drinkType: 'refri-600',
    variants: [
      { name: 'Coca-Cola 600ml', price: 9 },
      { name: 'Coca-Cola Zero 600ml', price: 9 },
      { name: 'Guaraná 600ml', price: 9 }
    ]
  },
  {
    id: '17',
    name: 'Refrigerante 2 litros',
    description: '2 litros',
    price: 14.00,
    image: 'https://images.unsplash.com/photo-1733909295574-debb36b2fdb1?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500',
    type: 'drink' as const,
    drinkType: 'refri-2litros',
    variants: [
      { name: 'Coca-Cola 2l', price: 14 },
      { name: 'Coca-Cola Zero 2l', price: 14 },
      { name: 'Guaraná 2l', price: 14 },
      { name: 'Guaraná Zero 2l', price: 14 }
    ]
  },
  {
    id: '18',
    name: 'Água',
    description: 'Água',
    price: 4.00,
    image: 'https://imgur.com/LPcCVPL.jpg',
    type: 'drink' as const,
    drinkType: 'agua',
    variants: [
      { name: 'Água sem gás', price: 4 },
      { name: 'Água com gás', price: 5 }
    ]
  }
 ,
  {
    id: '19',
    name: 'Sucos Na Brasa 500ml', 
    description: 'Sucos naturais',
    price: 15.00,
    image: 'https://imgur.com/kAfQiPT.jpg',
    type: 'drink' as const,
    drinkType: 'suco',
    variants: [
      { name: 'Suco de Morango 500ml', price: 15  },
      { name: 'Suco de Maracujá 500ml', price: 15 },
      { name: 'Suco de Acerola 500ml', price: 15 }
    ]
  },
  {
    id: '20',
    name: 'Cremes Na Brasa 500ml',
    description: 'Cremes naturais',
    price: 18.00,
    image: 'https://imgur.com/vzVBARw.jpg', 
    type: 'drink' as const,
    drinkType: 'creme',
    variants: [
      { name: 'Creme de Maracujá 500ml', price: 18 },
      { name: 'Creme de Morango 500ml', price: 18 },
    ]
  },
  {
    id: '21',
    name: 'Lemonades 500ml',
    description: 'lemonades gaseificadas',
    price: 20.00,
    image: 'https://imgur.com/jKPxAK6.jpg', 
    type: 'drink' as const,
    drinkType: 'drink',
    specialTags: ['🔥 NOVIDADE'],
    variants: [
      { name: 'Lemonade de Limão 500ml', price: 15 },
      { name: 'Pink Lemonade 500ml', price: 15 },
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
    { name: 'Triplo', priceIncrease: 14 }
  ],
  group2: [
    { name: 'Simples', priceIncrease: 0 },
    { name: 'Duplo', priceIncrease: 8 },
    { name: 'Triplo', priceIncrease: 14 }
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
    { name: 'Duplo', priceIncrease: 6 },
    { name: 'Triplo', priceIncrease: 12 }
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
  group10: [
    { name: 'Simples', priceIncrease: 0 },
    { name: 'Duplo', priceIncrease: 9 },
    { name: 'Triplo', priceIncrease: 15 }
  ],
  group11: [
    { name: 'Simples', priceIncrease: 0 }
  ],
  groupBaguete: [
    { name: 'Frango cremoso', priceIncrease: 0 },
    { name: 'Carne pedaços', priceIncrease: 2 },
    { name: 'Costela Desfiada', priceIncrease: 6 }
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