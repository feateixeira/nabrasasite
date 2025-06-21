import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Send, Star } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';

const testimonials = [
  {
    name: 'Lucas Andrade',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    stars: 5,
    text: 'Melhor hambúrguer da cidade! Atendimento rápido e comida deliciosa. Recomendo demais.'
  },
  {
    name: 'Mariana Silva',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    stars: 5,
    text: 'Os lanches são incríveis e o preço é justo. Sempre peço para minha família!'
  },
  {
    name: 'João Pedro',
    photo: 'https://randomuser.me/api/portraits/men/85.jpg',
    stars: 4,
    text: 'Muito bom! Só faltou chegar um pouquinho mais quente, mas estava delicioso.'
  },
  {
    name: 'Ana Paula',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    stars: 5,
    text: 'Atendimento excelente e hambúrguer maravilhoso! Voltarei sempre.'
  },
  {
    name: 'Carlos Mendes',
    photo: 'https://randomuser.me/api/portraits/men/41.jpg',
    stars: 5,
    text: 'Entrega rápida e lanche muito saboroso. Recomendo!'
  },
  {
    name: 'Fernanda Costa',
    photo: 'https://randomuser.me/api/portraits/women/12.jpg',
    stars: 5,
    text: 'Simplesmente perfeito! O melhor hambúrguer artesanal que já comi.'
  },
];

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        'service_zddqdfn',
        'template_j1ssry1',
        {
          from_name: name,
          from_email: email,
          message: `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`,
          to_name: 'Na Brasa Hamburgueria',
        },
        'wXzye2zjY9xAKTZ01'
      );

      toast.success('Mensagem enviada com sucesso!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors duration-200 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Entre em Contato</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2 scrollbar-custom">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Informações</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Telefone</p>
                    <p className="text-gray-600 dark:text-gray-400">(61) 9913-3181</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">E-mail</p>
                    <p className="text-gray-600 dark:text-gray-400">nabrasa.1602@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Endereço</p>
                    <p className="text-gray-600 dark:text-gray-400">Quadra 35 conjunto i lote 23<br />Brazlândia - DF</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto max-h-[600px] pr-2 scrollbar-custom">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none dark:bg-gray-700 dark:text-white"
                  placeholder="Sua mensagem..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 mr-2" />
                {loading ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">O que nossos clientes dizem</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center text-center">
              <img src={testimonial.photo} alt={testimonial.name} className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-red-200 dark:border-red-900" />
              <div className="flex items-center mb-2">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
                {[...Array(5 - testimonial.stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-2 italic">"{testimonial.text}"</p>
              <p className="font-semibold text-gray-800 dark:text-white">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}