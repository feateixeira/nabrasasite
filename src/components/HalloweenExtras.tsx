import React from 'react';

// Componente de Aranha Descendo - NOVO ELEMENTO
export const DescendingSpider: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  return (
    <div 
      className="absolute pointer-events-none z-10"
      style={{
        animation: `spiderDescend 8s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        top: '-100px',
        left: `${Math.random() * 80 + 10}%`
      }}
    >
      <div className="spider-icon text-gray-700 dark:text-gray-300 opacity-80 text-4xl">
        🕷️
      </div>
    </div>
  );
};

// Componente de Vampiro Voando - NOVO ELEMENTO
export const FlyingVampire: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  return (
    <div 
      className="absolute pointer-events-none z-10"
      style={{
        animation: `vampireFly 12s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        top: `${Math.random() * 40 + 20}%`,
        left: '-120px'
      }}
    >
      <div className="vampire-icon text-red-600 dark:text-red-500 opacity-75 text-5xl">
        🧛‍♂️
      </div>
    </div>
  );
};

// Componente de Bruxa Voando - NOVO ELEMENTO
export const FlyingWitch: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  return (
    <div 
      className="absolute pointer-events-none z-10"
      style={{
        animation: `witchFly 10s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        top: `${Math.random() * 50 + 15}%`,
        right: '-100px'
      }}
    >
      <div className="witch-icon text-purple-600 dark:text-purple-500 opacity-80 text-6xl">
        🧙‍♀️
      </div>
    </div>
  );
};

// Componente de Gato Preto - NOVO ELEMENTO
export const BlackCat: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  return (
    <div 
      className="absolute pointer-events-none z-10"
      style={{
        animation: `catWalk 6s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        bottom: '40px',
        left: '-80px'
      }}
    >
      <div className="cat-icon text-gray-800 dark:text-gray-200 opacity-85 text-4xl">
        🐈‍⬛
      </div>
    </div>
  );
};

// Componente de Olhos Brilhantes - NOVO ELEMENTO
export const GlowingEyes: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  return (
    <div 
      className="absolute pointer-events-none z-10"
      style={{
        animation: `eyesGlow 4s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        top: `${Math.random() * 60 + 20}%`,
        left: `${Math.random() * 80 + 10}%`
      }}
    >
      <div className="eyes-icon text-red-500 opacity-90 text-3xl">
        👁️‍🗨️
      </div>
    </div>
  );
};

// Componente de Cristal Mágico - NOVO ELEMENTO
export const MagicCrystal: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  return (
    <div 
      className="absolute pointer-events-none z-10"
      style={{
        animation: `crystalFloat 5s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        top: `${Math.random() * 70 + 15}%`,
        right: `${Math.random() * 30 + 5}%`
      }}
    >
      <div className="crystal-icon text-purple-400 opacity-80 text-4xl">
        🔮
      </div>
    </div>
  );
};

// Componente principal que agrupa todos os elementos extras
export const HalloweenExtras: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener ? mq.addEventListener('change', apply) : mq.addListener(apply);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', apply) : mq.removeListener(apply);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Aranhas descendo */}
      {isMobile ? (
        <DescendingSpider delay={0} />
      ) : (
        <>
          <DescendingSpider delay={0} />
          <DescendingSpider delay={4} />
          <DescendingSpider delay={8} />
        </>
      )}
      
      {/* Vampiros voando */}
      {isMobile ? (
        <FlyingVampire delay={1} />
      ) : (
        <>
          <FlyingVampire delay={1} />
          <FlyingVampire delay={7} />
        </>
      )}
      
      {/* Bruxas voando */}
      {isMobile ? (
        <FlyingWitch delay={2} />
      ) : (
        <>
          <FlyingWitch delay={2} />
          <FlyingWitch delay={9} />
        </>
      )}
      
      {/* Gatos pretos */}
      {isMobile ? (
        <BlackCat delay={6} />
      ) : (
        <>
          <BlackCat delay={3} />
          <BlackCat delay={6} />
          <BlackCat delay={11} />
        </>
      )}
      
      {/* Olhos brilhantes */}
      {isMobile ? (
        <>
          <GlowingEyes delay={0.5} />
          <GlowingEyes delay={5} />
        </>
      ) : (
        <>
          <GlowingEyes delay={0.5} />
          <GlowingEyes delay={2.5} />
          <GlowingEyes delay={5} />
          <GlowingEyes delay={7.5} />
        </>
      )}
      
      {/* Cristais mágicos */}
      {isMobile ? (
        <MagicCrystal delay={4.5} />
      ) : (
        <>
          <MagicCrystal delay={1.5} />
          <MagicCrystal delay={4.5} />
          <MagicCrystal delay={8.5} />
        </>
      )}
    </div>
  );
};
