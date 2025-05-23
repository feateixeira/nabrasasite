import { useState, lazy, Suspense, useEffect } from 'react';
import { Plus, Minus, X, Send, Store, MapPin } from 'lucide-react';
import { getProducts, burgerSizes, drinkOptions } from '../data';
import { CartItem, Product, DrinkVariant, BurgerSize, PotatoOption } from '../types';
import { toast } from 'sonner';
import { validateCoupon } from '../coupons';

// Componente de loading para imagens
const ImageWithLoading = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      loading="lazy"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = 'https://via.placeholder.com/500x500?text=Imagem+Indisponível';
      }}
    />
  );
};

export function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [productNote, setProductNote] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<DrinkVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<BurgerSize | null>(null);
  const [selectedPotatoOption, setSelectedPotatoOption] = useState<PotatoOption | null>(null);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState('');
  const [isTrio, setIsTrio] = useState(false);
  const [showDrinkSelector, setShowDrinkSelector] = useState(false);
  const [selectedTrioDrink, setSelectedTrioDrink] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountMessage, setDiscountMessage] = useState('');

  const DELIVERY_FEE = 4.00;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const loadedProducts = await getProducts();
        setProducts(loadedProducts);
      } catch (error) {
        toast.error('Erro ao carregar produtos');
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const burgers = products.filter(product => product.type === 'burger' && !product.isSweetBurger);
  const sides = products.filter(product => product.type === 'side');
  const drinks = products.filter(product => product.type === 'drink');
  const sweets = products.filter(product => product.type === 'burger' && product.isSweetBurger);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSauces([]);
    setProductNote('');
    setSelectedVariant(product.variants ? product.variants[0] : null);
    setSelectedSize(product.burgerSizeGroup ? burgerSizes[product.burgerSizeGroup][0] : null);
    setSelectedPotatoOption(product.potatoOptions ? product.potatoOptions[0] : null);
    setIsTrio(false);
    setShowDrinkSelector(false);
    setSelectedTrioDrink('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const toggleSauce = (sauce: string) => {
    if (selectedSauces.includes(sauce)) {
      setSelectedSauces(selectedSauces.filter(s => s !== sauce));
    } else {
      const maxTotalSauces = selectedProduct?.maxSauces || 4;
      
      if (selectedSauces.length < maxTotalSauces) {
        setSelectedSauces([...selectedSauces, sauce]);
      } else {
        toast.error(`Máximo de ${maxTotalSauces} molhos`, {
          duration: 3000,
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            background: '#ef4444',
            color: 'white',
            border: '2px solid #b91c1c',
          }
        });
      }
    }
  };

  const toggleTrio = () => {
    setIsTrio(!isTrio);
    if (!isTrio) {
      setShowDrinkSelector(true);
    } else {
      setShowDrinkSelector(false);
      setSelectedTrioDrink('');
    }
  };

  const selectTrioDrink = (drinkName: string) => {
    setSelectedTrioDrink(drinkName);
    setShowDrinkSelector(false);
  };

  const handleDeliveryTypeChange = (type: 'pickup' | 'delivery') => {
    setDeliveryType(type);
    if (type === 'delivery') {
      toast.info(`Taxa de entrega: R$ ${DELIVERY_FEE.toFixed(2)}`);
    }
  };

  const addToCart = () => {
    if (!selectedProduct) return;

    if (selectedProduct.isSweetBurger && selectedSize) {
      const newCartItem: CartItem = {
        ...selectedProduct,
        name: `${selectedProduct.name} - ${selectedSize.name}`,
        quantity: 1,
        selectedSauces: [],
        extraSauces: [],
        notes: productNote,
        selectedSize: selectedSize
      };
      setCart([...cart, newCartItem]);
      toast.success('Item adicionado ao carrinho');
      closeModal();
      return;
    }

    if (selectedProduct.type === 'drink' && selectedVariant) {
      const newCartItem: CartItem = {
        ...selectedProduct,
        name: selectedVariant.name,
        quantity: 1,
        selectedSauces: [],
        extraSauces: [],
        notes: productNote,
        selectedVariant: selectedVariant
      };
      setCart([...cart, newCartItem]);
      toast.success('Item adicionado ao carrinho');
      closeModal();
      return;
    }

    if (selectedProduct.type === 'side' && !selectedPotatoOption) {
      toast.error('⚠️ SELECIONE UMA OPÇÃO DE BATATA', {
        duration: 3000,
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          background: '#ef4444',
          color: 'white',
          border: '2px solid #b91c1c',
        }
      });
      return;
    }

    if (isTrio && !selectedTrioDrink) {
      toast.error('⚠️ SELECIONE UM REFRIGERANTE PARA O TRIO', {
        duration: 3000,
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          background: '#ef4444',
          color: 'white',
          border: '2px solid #b91c1c',
        }
      });
      return;
    }

    const newCartItem: CartItem = {
      ...selectedProduct,
      name: selectedPotatoOption ? `${selectedProduct.name} - ${selectedPotatoOption.name}` : selectedProduct.name,
      quantity: 1,
      selectedSauces: selectedSauces,
      extraSauces: [],
      notes: productNote,
      selectedVariant: selectedVariant || undefined,
      selectedSize: selectedSize || undefined,
      selectedPotatoOption: selectedPotatoOption || undefined,
      isTrio: isTrio,
      trioDetails: isTrio ? {
        drinkName: selectedTrioDrink
      } : undefined
    };

    setCart([...cart, newCartItem]);
    toast.success('Item adicionado ao carrinho');
    closeModal();
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    toast.success('Item removido do carrinho');
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    setCart(newCart);
  };

  const calculateItemPrice = (item: CartItem): number => {
    let price = item.price;
    
    if (item.selectedSize) {
      price += item.selectedSize.priceIncrease;
    }
    
    if (item.selectedVariant && item.selectedVariant.price !== item.price) {
      price = item.selectedVariant.price;
    }

    if (item.selectedPotatoOption) {
      price = item.selectedPotatoOption.price;
    }
    
    if (item.isTrio) {
      price += 10;
    }
    
    if (item.selectedSauces && item.type === 'burger') {
      const isTriplo = item.selectedSize?.name === 'Triplo';
      const freeSauces = isTriplo ? 2 : 1;
      const extraSauces = Math.max(0, item.selectedSauces.length - freeSauces);
      price += extraSauces * 2;
    }
    
    return price * item.quantity;
  };

  const subtotal = cart.reduce((acc, item) => {
    return acc + calculateItemPrice(item);
  }, 0);

  const handleCouponApply = () => {
    if (!couponCode.trim()) {
      toast.error('Digite um código de cupom');
      return;
    }

    const { valid, message, discount } = validateCoupon(couponCode, subtotal);
    
    if (valid) {
      setAppliedDiscount(discount);
      setDiscountMessage(message);
      toast.success(message);
    } else {
      setAppliedDiscount(0);
      setDiscountMessage('');
      toast.error(message);
    }
  };

  const total = subtotal + (deliveryType === 'delivery' ? DELIVERY_FEE : 0) - appliedDiscount;

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) {
      toast.error('Adicione itens ao carrinho', {
        duration: 5000,
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          background: '#ef4444',
          color: 'white',
          border: '2px solid #b91c1c',
        }
      });
      return;
    }

    if (deliveryType === 'delivery' && !address.trim()) {
      toast.error('⚠️ INFORME O ENDEREÇO DE ENTREGA', {
        duration: 5000,
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          background: '#ef4444',
          color: 'white',
          border: '2px solid #b91c1c',
        }
      });
      return;
    }

    if (!paymentMethod || paymentMethod.trim() === '') {
      toast.error('⚠️ SELECIONE UMA FORMA DE PAGAMENTO', {
        duration: 5000,
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          background: '#ef4444',
          color: 'white',
          border: '2px solid #b91c1c',
        }
      });
      return;
    }

    let message = `*Pedido Na Brasa*\n\n`;

    cart.forEach((item) => {
      const itemTotal = calculateItemPrice(item);
      const isTriplo = item.selectedSize?.name === 'Triplo';
      const freeSauces = isTriplo ? 2 : 1;
      const extraSauces = Math.max(0, item.selectedSauces.length - freeSauces);

      message += `*${item.quantity}x ${item.name}*`;
      
      if (item.selectedSize) {
        message += ` - ${item.selectedSize.name}`;
      }
      
      if (item.selectedVariant) {
        message += ` - ${item.selectedVariant.name}`;
      }
      
      if (item.isTrio) {
        message += ` + TRIO (Batata pequena + ${item.trioDetails?.drinkName} lata)`;
      }
      
      message += ` - R$ ${itemTotal.toFixed(2)}\n`;
      
      if (item.type === 'burger' && !item.isSweetBurger) {
        if (item.selectedSauces && item.selectedSauces.length > 0) {
          message += `   Molhos: ${item.selectedSauces.join(', ')}`;
          if (extraSauces > 0) {
            message += ` (${extraSauces} extra - R$ ${(extraSauces * 2).toFixed(2)})`;
          }
          message += `\n`;
        } else {
          message += `   Sem molho\n`;
        }
      }
      
      if (item.notes) {
        message += `   Obs: ${item.notes}\n`;
      }
      
      message += `\n`;
    });

    message += `\n*Subtotal: R$ ${subtotal.toFixed(2)}*\n`;
    
    if (deliveryType === 'delivery') {
      message += `*Taxa de entrega: R$ ${DELIVERY_FEE.toFixed(2)}*\n`;
    }
    
    message += `*Total: R$ ${total.toFixed(2)}*\n\n`;
    
    if (note) {
      message += `*Observações:* ${note}\n\n`;
    }
    
    message += `*Forma de entrega:* ${deliveryType === 'pickup' ? 'Retirar no local' : 'Entrega'}\n`;
    
    if (deliveryType === 'delivery') {
      message += `*Endereço:* ${address}\n`;
    }

    message += `*Forma de pagamento:* ${paymentMethod}\n`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/556199133181?text=${encodedMessage}`, '_blank');
  };

  const allBurgers = [...burgers, ...sweets];

  return (
    <main className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Hambúrgueres</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allBurgers.map((product, index) => (
                  <div
                    key={product.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                      index === allBurgers.length - 1 && allBurgers.length % 2 !== 0 ? 'md:col-span-2' : ''
                    }`}
                    onClick={() => openModal(product)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="h-48 w-full">
                        <ImageWithLoading
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col justify-between flex-grow">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                            {product.isSweetBurger && (
                              <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 text-xs font-medium rounded-full">
                                Doce
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            R$ {product.price.toFixed(2)}
                          </span>
                          <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition-colors">
                            Adicionar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Acompanhamentos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sides.map((product, index) => (
                  <div
                    key={product.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                      index === sides.length - 1 && sides.length % 2 !== 0 ? 'md:col-span-2' : ''
                    }`}
                    onClick={() => openModal(product)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="h-48 w-full">
                        <ImageWithLoading
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col justify-between flex-grow">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                          <p className="mt-1 text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            A partir de R$ {product.price.toFixed(2)}
                          </span>
                          <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition-colors">
                            Adicionar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Bebidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drinks.map((product, index) => (
                  <div
                    key={product.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                      index === drinks.length - 1 && drinks.length % 2 !== 0 ? 'md:col-span-2' : ''
                    }`}
                    onClick={() => openModal(product)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="h-48 w-full">
                        <ImageWithLoading
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col justify-between flex-grow">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                          <p className="mt-1 text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            R$ {product.price.toFixed(2)}
                          </span>
                          <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition-colors">
                            Adicionar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1 lg:pt-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Seu Pedido</h2>
              
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Seu carrinho está vazio</p>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Adicione itens do cardápio</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto pr-2 scrollbar-custom">
                    {cart.map((item, index) => {
                      const itemTotal = calculateItemPrice(item);
                      const isTriplo = item.selectedSize?.name === 'Triplo';
                      const freeSauces = isTriplo ? 2 : 1;
                      const extraSauces = Math.max(0, item.selectedSauces.length - freeSauces);

                      return (
                        <div key={index} className="border-b dark:border-gray-700 pb-4 last:border-0">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <ImageWithLoading src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-sm dark:text-white truncate">
                                  {item.name}
                                  {item.selectedVariant && (
                                    <span className="text-gray-600 dark:text-gray-400"> - {item.selectedVariant.name}</span>
                                  )}
                                  {item.selectedSize && (
                                    <span className="text-gray-600 dark:text-gray-400"> - {item.selectedSize.name}</span>
                                  )}
                                  {item.isTrio && (
                                    <span className="text-green-600 dark:text-green-400 ml-1"> + Trio</span>
                                  )}
                                </span>
                                <button
                                  onClick={() => removeFromCart(index)}
                                  className="text-red-500 ml-1 flex-shrink-0"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              {item.isTrio && (
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  Trio: Batata pequena + {item.trioDetails?.drinkName} lata
                                </p>
                              )}
                              {item.selectedSauces && item.selectedSauces.length > 0 && (
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  Molhos: {item.selectedSauces.join(', ')}
                                  {extraSauces > 0 && (
                                    <span className="text-green-600 dark:text-green-400 ml-1">
                                      (+R$ {(extraSauces * 2).toFixed(2)})
                                    </span>
                                  )}
                                </p>
                              )}
                              {item.notes && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                  Obs: {item.notes}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center">
                                  <button
                                    onClick={() => updateQuantity(index, item.quantity - 1)}
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-1 rounded-full"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="mx-2 text-sm font-medium dark:text-white">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(index, item.quantity + 1)}
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-1 rounded-full"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                                <span className="text-sm font-medium dark:text-white">R$ {itemTotal.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t dark:border-gray-700 pt-4 mb-4">
                    <textarea
                      placeholder="Observações gerais do pedido..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full p-2 border dark:border-gray-600 rounded-lg resize-none h-20 mb-4 text-sm dark:bg-gray-700 dark:text-white"
                    />

                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeliveryTypeChange('pickup')}
                          className={`flex-1 py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1 text-sm ${
                            deliveryType === 'pickup'
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <Store className="w-4 h-4" />
                          Retirar
                        </button>
                        <button
                          onClick={() => handleDeliveryTypeChange('delivery')}
                          className={`flex-1 py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1 text-sm ${
                            deliveryType === 'delivery'
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <MapPin className="w-4 h-4" />
                          Entregar
                        </button>
                      </div>

                      {deliveryType === 'delivery' && (
                        <div className="space-y-2">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Endereço de entrega
                          </label>
                          <textarea
                            id="address"
                            placeholder="Digite seu endereço completo..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-2 border dark:border-gray-600 rounded-lg resize-none h-20 text-sm dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Forma de pagamento
                        </label>
                        <select
                          id="paymentMethod"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full p-2 border dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Selecione uma forma de pagamento</option>
                          <option value="dinheiro">Dinheiro</option>
                          <option value="pix">PIX</option>
                          <option value="cartao">Cartão de crédito/débito</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t dark:border-gray-700 pt-4 mb-4">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Código do cupom"
                          className="flex-1 p-2 border dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                        />
                        <button
                          onClick={handleCouponApply}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                        >
                          Aplicar
                        </button>
                      </div>
                      {discountMessage && (
                        <p className="text-sm text-green-600 dark:text-green-400">{discountMessage}</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t dark:border-gray-700 pt-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-base">
                        <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                        <span className="font-medium dark:text-white">R$ {subtotal.toFixed(2)}</span>
                      </div>
                      {deliveryType === 'delivery' && (
                        <div className="flex justify-between items-center text-base">
                          <span className="text-gray-700 dark:text-gray-300">Taxa de entrega</span>
                          <span className="font-medium dark:text-white">R$ {DELIVERY_FEE.toFixed(2)}</span>
                        </div>
                      )}
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between items-center text-base">
                          <span className="text-green-600 dark:text-green-400">Desconto</span>
                          <span className="font-medium text-green-600 dark:text-green-400">-R$ {appliedDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-xl font-semibold pt-2">
                        <span className="dark:text-white">Total</span>
                        <span className="dark:text-white">R$ {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleWhatsAppCheckout}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Enviar pedido no WhatsApp
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-custom">
            <div className="relative">
              <ImageWithLoading
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md"
              >
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedProduct.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedProduct.description}</p>

              {selectedProduct.type === 'burger' && selectedProduct.burgerSizeGroup && !selectedProduct.isSweetBurger && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tamanho</h4>
                  <div className="flex flex-wrap gap-2">
                    {burgerSizes[selectedProduct.burgerSizeGroup].map((size) => (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg ${
                          selectedSize?.name === size.name
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {size.name} {size.priceIncrease > 0 && `(+R$ ${size.priceIncrease.toFixed(2)})`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.isSweetBurger && selectedProduct.sweetOptions && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Opções</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sweetOptions.map((option) => (
                      <button
                        key={option.name}
                        onClick={() => setSelectedSize({ name: option.name, priceIncrease: 0 })}
                        className={`px-4 py-2 rounded-lg ${
                          selectedSize?.name === option.name
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.type === 'burger' && !selectedProduct.isSweetBurger && (
                <div className="mb-6">
                  
                  <button
                    onClick={toggleTrio}
                    className={`w-full px-4 py-2 rounded-lg font-medium ${
                      isTrio
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {isTrio ? 'Trio Selecionado (+R$ 10,00)' : 'Transformar em Trio (+R$ 10,00)'}
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Inclui batata pequena + refrigerante lata
                  </p>
                </div>
              )}

              {showDrinkSelector && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Escolha o refrigerante</h4>
                  <div className="space-y-2">
                    {drinkOptions.map((drink) => (
                      <button
                        key={drink.name}
                        onClick={() => selectTrioDrink(drink.name)}
                        className={`w-full px-4 py-2 rounded-lg text-left ${
                          selectedTrioDrink === drink.name
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {drink.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.type === 'burger' && selectedProduct.availableSauces && !selectedProduct.isSweetBurger && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Escolha os molhos</h4>
                    {selectedSize?.name === 'Triplo' ? (
                      <span className="text-sm text-green-600 dark:text-green-400">2 grátis, depois +R$ 2,00 cada</span>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">1 grátis, depois +R$ 2,00 cada</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProduct.availableSauces.map((sauce) => (
                      <button
                        key={sauce}
                        onClick={() => toggleSauce(sauce)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          selectedSauces.includes(sauce)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {sauce}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Caso não queira molho, basta não selecionar nenhuma opção
                  </p>
                </div>
              )}

              {(selectedProduct.type === 'side' || selectedProduct.type === 'drink') && selectedProduct.variants && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Opções</h4>
                  <div className="space-y-2">
                    {selectedProduct.variants.map((variant) => (
                      <button
                        key={variant.name}
                        onClick={() => setSelectedVariant(variant)}
                        className={`w-full px-4 py-2 rounded-lg text-left ${
                          selectedVariant?.name === variant.name
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {variant.name} - R$ {variant.price.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.type === 'side' && selectedProduct.potatoOptions && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Escolha a opção</h4>
                  <div className="space-y-2">
                    {selectedProduct.potatoOptions.map((option) => (
                      <button
                        key={option.name}
                        onClick={() => setSelectedPotatoOption(option)}
                        className={`w-full px-4 py-2 rounded-lg text-left ${
                          selectedPotatoOption?.name === option.name
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{option.name}</div>
                            <div className="text-sm opacity-75">{option.description}</div>
                          </div>
                          <div className="font-medium">R$ {option.price.toFixed(2)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.availableSauces && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Escolha os molhos</h4>
                    {selectedProduct.maxSauces && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Escolha {selectedProduct.maxSauces} molho(s)
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProduct.availableSauces.map((sauce) => (
                      <button
                        key={sauce}
                        onClick={() => toggleSauce(sauce)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          selectedSauces.includes(sauce)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {sauce}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Observações
                </label>
                <textarea
                  id="notes"
                  value={productNote}
                  onChange={(e) => setProductNote(e.target.value)}
                  placeholder="Ex: Sem cebola, sem picles..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none h-20 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    R$ {(() => {
                      let price = selectedProduct.price;
                      
                      if (selectedSize) {
                        price += selectedSize.priceIncrease;
                      }
                      
                      if (selectedVariant && selectedVariant.price !== selectedProduct.price) {
                        price = selectedVariant.price;
                      }

                      if (selectedPotatoOption) {
                        price = selectedPotatoOption.price;
                      }
                      
                      if (isTrio) {
                        price += 10;
                      }
                      
                      if (selectedSauces.length > 0 && selectedProduct.type === 'burger' && !selectedProduct.isSweetBurger) {
                        const isTriplo = selectedSize?.name === 'Triplo';
                        const freeSauces = isTriplo ? 2 : 1;
                        const extraSauces = Math.max(0, selectedSauces.length - freeSauces);
                        price += extraSauces * 2;
                      }
                      
                      return price.toFixed(2);
                    })()}
                  </span>
                  {selectedSauces.length > 0 && selectedProduct.type === 'burger' && !selectedProduct.isSweetBurger && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 block">
                      {(() => {
                        const isTriplo = selectedSize?.name === 'Triplo';
                        const freeSauces = isTriplo ? 2 : 1;
                        const extraSauces = Math.max(0, selectedSauces.length - freeSauces);
                        
                        if (extraSauces > 0) {
                          return `Inclui ${extraSauces} molho(s) extra(s) (+R$ ${(extraSauces * 2).toFixed(2)})`;
                        } else if (selectedSauces.length > 0) {
                          return `${selectedSauces.length} molho(s) incluído(s)`;
                        }
                        return '';
                      })()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (selectedProduct.isUnavailable) {
                      toast.error('Este item ainda não está disponível', {
                        duration: 3000,
                        style: {
                          fontSize: '16px',
                          fontWeight: 'bold',
                          background: '#ef4444',
                          color: 'white',
                          border: '2px solid #b91c1c',
                        }
                      });
                      return;
                    }
                    addToCart();
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedProduct.isUnavailable
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {selectedProduct.isUnavailable ? 'Indisponível' : 'Adicionar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}