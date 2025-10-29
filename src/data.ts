import { BurgerSize, Product } from './types';

// Memoização dos dados para evitar recálculos desnecessários
const memoizedProducts: Product[] = [
  {
    id: '1',
    name: 'Na Brasa Clássico',
    description: 'Pão Brioche, Blend artesanal (130g), queijo cheddar, alface',
    price: 15.00,
    image: 'https://imgur.com/KDqnnFM.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group1'
  },
  {
    id: '2',
    name: 'Na Brasa Especial',
    description: 'Pão Brioche, Blend artesanal (130g), Queijo cheddar, Alface + Cebola caramelizada & Pedaços de Bacon',
    price: 22.00,
    image: 'https://imgur.com/5Bzmmhy.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group2'
  },
  {
    id: '3',
    name: 'Na Brasa Supremo',
    description: 'Pão Brioche, Blend Artesanal (130g), Queijo Cheddar, Alface + Cebola Roxa & Pedaços de Bacon',
    price: 22.00,
    image: 'https://imgur.com/TeQVxPI.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group2'
  },
  {
    id: '5',
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
    id: '6',
    name: 'Batata Frita Média',
    description: 'Porção de batatas fritas, queijo cheddar e bacon crocante (300g)',
    price: 16.00,
    image: 'https://imgur.com/AKh6NLI.jpg',
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
    id: '7',
    name: 'Batata Frita Grande',
    description: 'Porção de batatas fritas crocantes (400g)',
    price: 25.00,
    image: 'https://imgur.com/PTMmqda.jpg',
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
    id: '8',
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
    id: '9',
    name: 'Refrigerante 600ml',
    description: '600ml',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1605712916345-6ef6bcc2e29c?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500',
    type: 'drink' as const,
    drinkType: 'refri-600',
    variants: [
      { name: 'Coca-Cola 600ml', price: 8 },
      { name: 'Guaraná 600ml', price: 8 }
    ]
  },
  {
    id: '10',
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
    id: '11',
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
    id: '12',
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
    id: '20',
    name: 'Fritas Na Brasa',
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
    name: 'Sucos Na Brasa',
    description: 'Sucos naturais',
    price: 7.00,
    image: 'https://imgur.com/kAfQiPT.jpg',
    type: 'drink' as const,
    drinkType: 'suco',
    variants: [
      { name: 'Suco de Morango 330ml', price: 7 },
      { name: 'Suco de Maracujá 330ml', price: 7 },
      { name: 'Suco de Acerola 330ml', price: 7 },
      { name: 'Suco de Morango 500ml', price: 10 },
      { name: 'Suco de Maracujá 500ml', price: 10 },
      { name: 'Suco de Acerola 500ml', price: 10 }
    ]
  },
  {
    id: '17',
    name: 'Cremes Na Brasa',
    description: 'Cremes naturais',
    price: 8.00,
    image: 'https://imgur.com/vzVBARw.jpg',
    type: 'drink' as const,
    drinkType: 'creme',
    variants: [
      { name: 'Creme de Maracujá 330ml', price: 8 },
      { name: 'Creme de Morango 330ml', price: 8 },
      { name: 'Creme de Maracujá 500ml', price: 12 },
      { name: 'Creme de Morango 500ml', price: 12 }
    ]
  },
  {
    id: '16',
    name: 'Na Brasa Frango',
    description: 'Pão Brioche, Filé de frango empanado, queijo cheddar & alface',
    price: 22.00,
    image: 'https://imgur.com/hN0qVs5.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group5'
  
  },
  {
    id: '22',
    name: 'Na Brasa Frango Supremo',
    description: 'Pão Brioche, Filé de frango empanado, queijo cheddar, alface, tomate & cebola roxa.',
    price: 24.00,
    image: 'https://imgur.com/5EtACiS.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group5',
    specialTags: ['🔥 NOVIDADE'],
  },
  {
    id: '24',
    name: 'Na Brasa Salada',
    description: 'Pão Brioche, Blend (130g), Queijo cheddar, alface & tomate.',
    price: 16.00,
    image: 'https://imgur.com/FYR1uNM.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group1',
    specialTags: ['🔥 NOVIDADE'],
  },
  {
    id: '25',
    name: 'Cubos de Frango',
    description: 'Peito de frango em cubos empanados na farinha panko com tempero especial + acompanha molhos rose e barbecue',
    price: 25.00,
    image: 'https://imgur.com/KQcmsNh.jpg',
    type: 'side' as const,
    specialTags: ['EM BREVE NO CARDÁPIO'],
    isUnavailable: true,
    potatoOptions: [
      {
        name: 'M',
        price: 25.00,
        description: 'Porção média de cubos de frango empanados + acompanha molhos rose e barbecue'
      },
      {
        name: 'G',
        price: 40.00,
        description: 'Porção grande de cubos de frango empanados + acompanha molhos rose e barbecue'
      }
    ]
  },
  {
    id: '26',
    name: 'Cebolas Empanadas',
    description: 'Cebolas empanadas crocantes + acompanha ketchup',
    price: 20.00,
    image: 'https://imgur.com/nVhfvNe.jpg',
    type: 'side' as const,
    specialTags: ['🔥 NOVIDADE'],
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
    id: '27',
    name: 'Cebolas Empanadas + Fritas',
    description: 'Cebolas empanadas e batatas fritas + acompanha ketchup',
    price: 30.00,
    image: 'https://imgur.com/b43RRwa.jpg',
    type: 'side' as const,
    specialTags: ['🔥 NOVIDADE'],
    potatoOptions: [
      {
        name: 'M',
        price: 30.00,
        description: '400g de cebolas empanadas & batatas fritas + acompanha ketchup'
      },
      {
        name: 'G',
        price: 50.00,
        description: '700g de cebolas empanadas & batatas fritas + acompanha ketchup'
      }
    ]
  }
  ,
  {
    id: '28',
    name: 'Mini Chickens Na Brasa',
    description: 'MIni Chicken fritos e crôcantes',
    price: 30.00,
    image: 'https://imgur.com/5lLNwZy.jpg',
    type: 'side' as const,
    specialTags: ['🔥 NOVIDADE'],
    potatoOptions: [
      {
        name: 'M',
        price: 25.00,
        description: '400g de Mini Chickens Na Brasa, fritos e crôcantes'
      },
      {
        name: 'G',
        price: 40.00,
        description: '700g de Mini Chickens Na Brasa, fritos e crôcantes'
      }
    ]
  },
  {
    id: '29',
    name: 'Na Brasa Eno',
    description: 'Pão Brioche, 4 Blend (130g), 4 Queijo cheddar, farofa de bacon, aneis de cebolas fritos & alface.',
    price: 42.00,
    image: 'https://imgur.com/rWtnci3.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group9',
    specialTags: ['🔥 NOVIDADE', '🧌 MOOOONSTRO'],
  },
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
    { name: 'Simples', priceIncrease: 0 },
    { name: 'Duplo', priceIncrease: 4 },
    { name: 'Triplo', priceIncrease: 11 }
  ],
  group8: [
    { name: 'Simples', priceIncrease: 0 },
    { name: 'Duplo', priceIncrease: 11 },
    { name: 'Triplo', priceIncrease: 15 }
  ]
  ,
  group9: [
    { name: 'Monstro', priceIncrease: 0 }
  ]
};

export const drinkOptions = [
  { name: 'Coca-Cola', price: 5 },
  { name: 'Coca-Cola Zero', price: 5 },
  { name: 'Guaraná', price: 5 }
];