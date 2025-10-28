import React from 'react';

// Componente de Morcego Voando - MAIOR E MAIS DINÂMICO
export const FlyingBat: React.FC<{ delay?: number; duration?: number; size?: 'small' | 'medium' | 'large' }> = ({ 
  delay = 0, 
  duration = 8,
  size = 'large'
}) => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };

  return (
    <div 
      className="absolute pointer-events-none z-10"
      style={{
        animation: `flyAcrossAdvanced ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        top: `${Math.random() * 30 + 10}%`,
        left: '-80px'
      }}
    >
      <div className={`bat-icon text-gray-800 dark:text-gray-200 opacity-70 ${sizeClasses[size]}`}>
        🦇
      </div>
    </div>
  );
};

// Componente de Teia de Aranha - MAIOR E MAIS BALANÇANDO
export const SpiderWeb: React.FC<{ position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }> = ({ 
  position 
}) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div 
      className={`absolute pointer-events-none z-10 ${positionClasses[position]}`}
      style={{
        animation: `webSwayAdvanced 6s ease-in-out infinite`,
        animationDelay: `${Math.random() * 3}s`
      }}
    >
      <div className="web-icon text-gray-600 dark:text-gray-400 opacity-60 text-5xl">
        🕸️
      </div>
    </div>
  );
};

// Componente de Fantasma Flutuante - MAIOR E MAIS EXPRESSIVO
export const FloatingGhost: React.FC<{ delay?: number; size?: 'small' | 'medium' | 'large' }> = ({ 
  delay = 0,
  size = 'large'
}) => {
  const sizeClasses = {
    small: 'text-3xl',
    medium: 'text-5xl',
    large: 'text-7xl'
  };

  return (
    <div 
      className="absolute pointer-events-none z-10"
      style={{
        animation: `ghostFloatAdvanced 8s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        top: `${Math.random() * 40 + 20}%`,
        left: `${Math.random() * 80 + 10}%`
      }}
    >
      <div className={`ghost-icon text-gray-300 dark:text-gray-500 opacity-70 ${sizeClasses[size]}`}>
        👻
      </div>
    </div>
  );
};

// Componente de Caveira Flutuante - MAIOR E MAIS SINISTRA
export const FloatingSkull: React.FC<{ delay?: number; size?: 'small' | 'medium' | 'large' }> = ({ 
  delay = 0,
  size = 'large'
}) => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };

  return (
    <div 
      className="absolute pointer-events-none z-10"
      style={{
        animation: `skullFloatAdvanced 7s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        top: `${Math.random() * 50 + 15}%`,
        right: `${Math.random() * 20 + 5}%`
      }}
    >
      <div className={`skull-icon text-gray-400 dark:text-gray-600 opacity-60 ${sizeClasses[size]}`}>
        💀
      </div>
    </div>
  );
};

// Componente de Zumbi Caminhando - MAIOR E MAIS REALISTA
export const WalkingZombie: React.FC<{ delay?: number; size?: 'small' | 'medium' | 'large' }> = ({ 
  delay = 0,
  size = 'large'
}) => {
  const sizeClasses = {
    small: 'text-3xl',
    medium: 'text-5xl',
    large: 'text-7xl'
  };

  return (
    <div 
      className="absolute pointer-events-none z-10"
      style={{
        animation: `zombieWalkAdvanced 15s linear infinite`,
        animationDelay: `${delay}s`,
        bottom: '30px',
        left: '-100px'
      }}
    >
      <div className={`zombie-icon text-green-600 dark:text-green-500 opacity-80 ${sizeClasses[size]}`}>
        🧟‍♂️
      </div>
    </div>
  );
};

// Componente de Abóbora Iluminada - MAIOR E MAIS BRILHANTE
export const GlowingPumpkin: React.FC<{ position: 'left' | 'right' }> = ({ position }) => {
  const positionClass = position === 'left' ? 'left-8' : 'right-8';
  
  return (
    <div 
      className={`absolute pointer-events-none z-10 ${positionClass} top-1/2 transform -translate-y-1/2`}
      style={{
        animation: `pumpkinGlowAdvanced 4s ease-in-out infinite`
      }}
    >
      <div className="pumpkin-icon text-orange-500 opacity-90 text-8xl">
        🎃
      </div>
    </div>
  );
};

// Componente de Vaga-lume Piscando - MAIOR E MAIS BRILHANTE
export const Firefly: React.FC<{ delay?: number; size?: 'small' | 'medium' | 'large' }> = ({ 
  delay = 0,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  return (
    <div 
      className="absolute pointer-events-none z-10"
      style={{
        animation: `fireflyBlinkAdvanced 3s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        top: `${Math.random() * 70 + 15}%`,
        left: `${Math.random() * 90 + 5}%`
      }}
    >
      <div className={`firefly-icon text-yellow-400 opacity-90 ${sizeClasses[size]}`}>
        ✨
      </div>
    </div>
  );
};

// Componente principal que agrupa todas as animações - MAIS ELEMENTOS
export const HalloweenAnimations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Morcegos voando - MAIS E MAIORES */}
      <FlyingBat delay={0} duration={10} size="large" />
      <FlyingBat delay={2} duration={12} size="medium" />
      <FlyingBat delay={4} duration={8} size="large" />
      <FlyingBat delay={6} duration={11} size="medium" />
      <FlyingBat delay={8} duration={9} size="large" />
      <FlyingBat delay={10} duration={13} size="small" />
      
      {/* Teias de aranha nos cantos - MAIORES */}
      <SpiderWeb position="top-left" />
      <SpiderWeb position="top-right" />
      <SpiderWeb position="bottom-left" />
      <SpiderWeb position="bottom-right" />
      
      {/* Fantasmas flutuantes - MAIS E MAIORES */}
      <FloatingGhost delay={0} size="large" />
      <FloatingGhost delay={3} size="medium" />
      <FloatingGhost delay={6} size="large" />
      <FloatingGhost delay={9} size="small" />
      
      {/* Caveiras flutuantes - MAIS E MAIORES */}
      <FloatingSkull delay={1} size="large" />
      <FloatingSkull delay={4} size="medium" />
      <FloatingSkull delay={7} size="large" />
      
      {/* Zumbis caminhando - MAIS E MAIORES */}
      <WalkingZombie delay={0} size="large" />
      <WalkingZombie delay={7} size="medium" />
      <WalkingZombie delay={14} size="large" />
      
      {/* Abóboras iluminadas - MAIORES */}
      <GlowingPumpkin position="left" />
      <GlowingPumpkin position="right" />
      
      {/* Vaga-lumes piscando - MAIS E MAIORES */}
      <Firefly delay={0} size="medium" />
      <Firefly delay={0.5} size="large" />
      <Firefly delay={1} size="medium" />
      <Firefly delay={1.5} size="small" />
      <Firefly delay={2} size="large" />
      <Firefly delay={2.5} size="medium" />
      <Firefly delay={3} size="large" />
      <Firefly delay={3.5} size="small" />
      <Firefly delay={4} size="medium" />
    </div>
  );
};
