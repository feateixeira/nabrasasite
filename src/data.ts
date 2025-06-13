import { BurgerSize, SweetOption, Product, DrinkVariant, PotatoOption } from './types';

// Memoização dos dados para evitar recálculos desnecessários
const memoizedProducts: Product[] = [
  {
    id: '1',
    name: 'Na Brasa',
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
    price: 20.00,
    image: 'https://imgur.com/5Bzmmhy.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group2'
  },
  {
    id: '3',
    name: 'Na Brasa Supremo',
    description: 'Pão Brioche, Blend Artesanal (130g), Queijo Cheddar, Alface + Cebola Roxa & Pedaços de Bacon',
    price: 20.00,
    image: 'https://imgur.com/TeQVxPI.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group2'
  },
  {
    id: '13',
    name: 'Hambúrguer Nutella',
    description: 'Pão Brioche, Nutella e Morangos',
    price: 16.00,
    image: 'https://imgur.com/W7018Tj.jpg',
    type: 'burger' as const,
    burgerSizeGroup: 'group3',
    isSweetBurger: true,
    sweetOptions: [
      { 
        name: 'Nutella', 
        price: 16.00,
        image: 'https://imgur.com/W7018Tj.jpg'
      },
    ]
  },
  {
    id: '5',
    name: 'Batata Frita Pequena',
    description: 'Porção de batatas fritas crocantes (150g)',
    price: 8.00,
    image: 'https://imgur.com/Sergi99.jpg',
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
    loadedPrice: 20.00,
    potatoOptions: [
      {
        name: 'Normal',
        price: 16.00,
        description: 'Porção de batatas fritas crocantes (300g)'
      },
      {
        name: 'Recheada',
        price: 21.00,
        description: 'Porção de batatas fritas crocantes (300g) com queijo cheddar e bacon crocante'
      }
    ]
  },
  {
    id: '7',
    name: 'Batata Frita Grande',
    description: 'Porção de batatas fritas crocantes (400g)',
    price: 22.00,
    image: 'https://imgur.com/PTMmqda.jpg',
    type: 'side' as const,
    isLoadable: true,
    loadedPrice: 26.00,
    potatoOptions: [
      {
        name: 'Normal',
        price: 22.00,
        description: 'Porção de batatas fritas crocantes (400g)'
      },
      {
        name: 'Recheada',
        price: 30.00,
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
      { name: 'Coca-Cola 600ml', price: 7.5 },
      { name: 'Coca-Cola Zero 600ml', price: 7.5 },
      { name: 'Guaraná 600ml', price: 7.5 }
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
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500',
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
    description: 'Filé de frango empanado com molho especial',
    price: 20.00,
    image: 'https://imgur.com/PwYPcuJ.jpg',
    type: 'side' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    maxSauces: 2,
    potatoOptions: [
      {
        name: 'P',
        price: 20.00,
        description: 'Porção pequena de frango empanado (3 - 4 pedaços)'
      },
      {
        name: 'M',
        price: 37.00,
        description: 'Porção média de frango empanado (4 - 6 pedaços)'
      },
      {
        name: 'G',
        price: 50.00,
        description: 'Porção grande de frango empanado (6 - 8 pedaços)'
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
    specialTags: ['Super Especial', 'Muuuuuuuuuito Recheio'],
    potatoOptions: [
      {
        name: 'M',
        price: 25.00,
        description: 'Porção média de batata frita com frango, cheddar e bacon (300g)'
      },
      {
        name: 'G',
        price: 37.00,
        description: 'Porção grande de batata frita com frango, cheddar e bacon (400g)'
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
      { name: 'Morango 330ml', price: 7 },
      { name: 'Maracujá 330ml', price: 7 },
      { name: 'Acerola 330ml', price: 7 },
      { name: 'Abacaxi com Hortelã 330ml', price: 7 },
      { name: 'Morango 500ml', price: 10 },
      { name: 'Maracujá 500ml', price: 10 },
      { name: 'Acerola 500ml', price: 10 },
      { name: 'Abacaxi com Hortelã 500ml', price: 10 }
    ]
  },
  {
    id: '17',
    name: 'Cremes Na Brasa',
    description: 'Cremes naturais',
    price: 8.00,
    image: 'https://imgur.com/kAfQiPT.jpg',
    type: 'drink' as const,
    drinkType: 'creme',
    variants: [
      { name: 'Maracujá 330ml', price: 8 },
      { name: 'Morango 330ml', price: 8 },
      { name: 'Maracujá 500ml', price: 12 },
      { name: 'Morango 500ml', price: 12 }
    ]
  },
  {
    id: '16',
    name: 'Na Brasa Frango',
    description: 'Pão Brioche, Filé de frango empanado (130g), queijo cheddar, alface',
    price: 20.00,
    image: 'https://imgur.com/6zBVnyS.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group5'
  },
  {
    id: '18',
    name: 'Kids',
    description: 'Pão Brioche, Blend artesanal (90g), queijo cheddar, alface + Bala Finni',
    price: 13.00,
    image: 'https://imgur.com/fVIh7RO.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group6',
    comboOptions: [
      {
        name: 'Combo Kids',
        price: 17.00,
        description: 'Hambúrguer Kids + Suco de Caixinha 200ml (Uva ou Maracujá)'
      }
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
    { name: 'Duplo', priceIncrease: 7 },
    { name: 'Triplo', priceIncrease: 12 }
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
    { name: 'Duplo', priceIncrease: 7 },
    { name: 'Triplo', priceIncrease: 12 }
  ],
  group6: [
    { name: 'Simples', priceIncrease: 0 }
  ]
};

export const drinkOptions = [
  { name: 'Coca-Cola', price: 5 },
  { name: 'Coca-Cola Zero', price: 5 },
  { name: 'Guaraná', price: 5 }
];