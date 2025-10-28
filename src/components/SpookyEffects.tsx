import React from 'react';

// Componente de Efeito de Brilho nos Cards
export const CardGlowEffect: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Efeito de brilho sutil */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, rgba(255, 165, 0, 0.1) 0%, rgba(255, 69, 0, 0.1) 50%, rgba(255, 165, 0, 0.1) 100%)',
          animation: 'pumpkinGlow 3s ease-in-out infinite'
        }}
      />
      {children}
    </div>
  );
};

// Componente de Efeito de Suspensão nos Botões
export const SpookyButtonEffect: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Efeito de sombra animada */}
      <div 
        className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300 pointer-events-none"
        style={{
          background: 'rgba(255, 0, 0, 0.1)',
          transform: 'translateY(2px)',
          animation: 'fireflyBlink 2s ease-in-out infinite'
        }}
      />
      {children}
    </div>
  );
};

// Componente de Efeito de Partículas nos Títulos
export const SpookyTitleEffect: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Efeito de partículas ao redor do título */}
      <div className="absolute -top-2 -left-2 w-2 h-2 bg-orange-400 rounded-full opacity-60 animate-pulse" />
      <div className="absolute -top-1 -right-3 w-1 h-1 bg-red-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />
      {children}
    </div>
  );
};

// Componente de Efeito de Suspensão no Carrinho
export const SpookyCartEffect: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Efeito de brilho sutil no carrinho */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 165, 0, 0.05) 0%, transparent 70%)',
          animation: 'shadowMove 8s ease-in-out infinite'
        }}
      />
      {children}
    </div>
  );
};
