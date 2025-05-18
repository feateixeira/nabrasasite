import { BurgerSize, SweetOption, Product, DrinkVariant, PotatoOption } from './types';

// Memoização dos dados para evitar recálculos desnecessários
const memoizedProducts: Product[] = [
  {
    id: '1',
    name: 'Na Brasa',
    description: 'Pão Brioche, Blend artesanal (130g), queijo cheddar, alface',
    price: 14.00,
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
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500',
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
    description: 'Porção de batatas fritas, mussarela e bacon crocante (300g)',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1630431341973-02e1b662ec35?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500',
    type: 'side' as const,
    isLoadable: true,
    loadedPrice: 20.00,
    potatoOptions: [
      {
        name: 'Normal',
        price: 15.00,
        description: 'Porção de batatas fritas crocantes (300g)'
      },
      {
        name: 'Recheada',
        price: 20.00,
        description: 'Porção de batatas fritas crocantes (300g) com mussarela e bacon crocante'
      }
    ]
  },
  {
    id: '7',
    name: 'Batata Frita Grande',
    description: 'Porção de batatas fritas crocantes (400g)',
    price: 20.00,
    image: 'https://imgur.com/HPxUanA.jpg',
    type: 'side' as const,
    isLoadable: true,
    loadedPrice: 26.00,
    potatoOptions: [
      {
        name: 'Normal',
        price: 20.00,
        description: 'Porção de batatas fritas crocantes (400g)'
      },
      {
        name: 'Recheada',
        price: 28.00,
        description: 'Porção de batatas fritas crocantes (400g) com mussarela e bacon crocante'
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
    price: 2.50,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500',
    type: 'drink' as const,
    drinkType: 'agua',
    variants: [
      { name: 'Água com gás', price: 4 },
      { name: 'Água sem gás', price: 2.5 }
    ]
  },
  {
    id: '14',
    name: 'Frango no Pote',
    description: 'Filé de frango empanado com molho especial',
    price: 20.00,
    image: 'https://imgur.com/53gxRQr.jpg',
    type: 'side' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    maxSauces: 2,
    potatoOptions: [
      {
        name: 'P',
        price: 20.00,
        description: 'Porção pequena de frango empanado'
      },
      {
        name: 'M',
        price: 37.00,
        description: 'Porção média de frango empanado'
      },
      {
        name: 'G',
        price: 50.00,
        description: 'Porção grande de frango empanado'
      }
    ]
  },
  {
    id: '15',
    name: 'Suco/Creme Na Brasa',
    description: 'Em breve estaremos servindo sucos e cremes naturais.',
    price: 8.00,
    image: 'https://imgur.com/kAfQiPT.jpg',
    type: 'drink' as const,
    drinkType: 'suco-creme',
    isUnavailable: true
  },
  {
    id: '16',
    name: 'Na Brasa Frango',
    description: 'Pão Brioche, Filé de frango empanado (130g), queijo cheddar, alface',
    price: 20.00,
    image: 'https://imgur.com/WGNi1gV.jpg',
    type: 'burger' as const,
    availableSauces: ['Bacon', 'Alho', 'Ervas', 'Mostarda & Mel'],
    burgerSizeGroup: 'group5'
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
    { name: 'Triplo', priceIncrease: 14 }
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
  ]
};

export const drinkOptions = [
  { name: 'Coca-Cola', price: 5 },
  { name: 'Coca-Cola Zero', price: 5 },
  { name: 'Guaraná', price: 5 }
];