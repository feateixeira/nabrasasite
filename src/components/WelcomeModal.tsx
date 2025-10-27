import { useState, useEffect } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já viu o modal antes
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      // Mostra o modal após 1 segundo para dar tempo da página carregar
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Marca que o usuário já viu o modal
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const handleGoToMenu = () => {
    handleClose();
    // Scroll suave para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-1 shadow-2xl transition-all duration-300 animate-in zoom-in-95">
        <div className="relative rounded-xl bg-white p-8 text-center">
          {/* Botão de fechar */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Ícone de estrelas */}
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-gradient-to-r from-orange-400 to-pink-400 p-3">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Título principal */}
          <h2 className="mb-3 text-2xl font-bold text-gray-900">
            🎉 Bem-vindo à Na Brasa!
          </h2>

          {/* Subtítulo */}
          <h3 className="mb-4 text-lg font-semibold text-orange-600">
            Temos vários itens NOVOS no cardápio!
          </h3>

          {/* Lista de novidades */}
          <div className="mb-6 space-y-2 text-left">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-orange-500">🔥</span>
              <span>Cubos de Frango com molhos especiais</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-orange-500">🔥</span>
              <span>Cebolas Empanadas crocantes</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-orange-500">🔥</span>
              <span>Novos hambúrgueres incríveis</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-orange-500">🔥</span>
              <span>Novo número para contato</span>
            </div>
          </div>

          {/* Botão principal */}
          <button
            onClick={handleGoToMenu}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-red-600 hover:shadow-xl hover:scale-105"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Vamos lá!
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>

          {/* Texto adicional */}
          <p className="mt-4 text-xs text-gray-500">
            Prepare-se para uma experiência gastronômica única!
          </p>
        </div>
      </div>
    </div>
  );
}
