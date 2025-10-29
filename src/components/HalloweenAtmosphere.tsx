import React from 'react';

// Componente de Partículas Flutuantes - MAIORES E MAIS DINÂMICAS
export const FloatingParticles: React.FC<{ multiplier?: number }> = ({ multiplier = 1 }) => {
  const base = 25;
  const count = Math.max(0, Math.floor(base * multiplier));
  const particles = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className="absolute pointer-events-none z-5"
      style={{
        animation: `particleFloatAdvanced ${4 + Math.random() * 6}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 8}s`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        fontSize: `${12 + Math.random() * 8}px`,
        opacity: 0.4 + Math.random() * 0.5
      }}
    >
      <div className="particle text-gray-400 dark:text-gray-600">
        {Math.random() > 0.5 ? '•' : '◦'}
      </div>
    </div>
  ));

  return <>{particles}</>;
};

// Componente de Sombras Móveis - MAIS DINÂMICAS
export const MovingShadows: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      <div 
        className="absolute w-[500px] h-[500px] rounded-full opacity-8"
        style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, transparent 70%)',
          animation: `shadowMoveAdvanced 25s ease-in-out infinite`,
          top: '15%',
          left: '5%'
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full opacity-6"
        style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, transparent 70%)',
          animation: `shadowMoveAdvanced 20s ease-in-out infinite reverse`,
          top: '55%',
          right: '10%'
        }}
      />
      <div 
        className="absolute w-[300px] h-[300px] rounded-full opacity-5"
        style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0.2) 0%, transparent 70%)',
          animation: `shadowMoveAdvanced 30s ease-in-out infinite`,
          top: '70%',
          left: '60%'
        }}
      />
    </div>
  );
};

// Componente de Efeito de Neblina - MAIS INTENSO
export const FogEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          background: 'linear-gradient(45deg, rgba(128,128,128,0.15) 0%, transparent 50%, rgba(128,128,128,0.15) 100%)',
          animation: `fogDriftAdvanced 30s ease-in-out infinite`
        }}
      />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(-45deg, rgba(100,100,100,0.1) 0%, transparent 60%, rgba(100,100,100,0.1) 100%)',
          animation: `fogDriftAdvanced 35s ease-in-out infinite reverse`
        }}
      />
    </div>
  );
};

// Componente de Estrelas Piscantes - MAIS E MAIORES
export const TwinklingStars: React.FC<{ multiplier?: number }> = ({ multiplier = 1 }) => {
  const base = 35;
  const count = Math.max(0, Math.floor(base * multiplier));
  const stars = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className="absolute pointer-events-none z-5"
      style={{
        animation: `starTwinkleAdvanced ${3 + Math.random() * 4}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 8}s`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        fontSize: `${6 + Math.random() * 10}px`
      }}
    >
      <div className="star text-yellow-300 opacity-70">
        ✨
      </div>
    </div>
  ));

  return <>{stars}</>;
};

// Componente principal que agrupa todos os efeitos atmosféricos
export const HalloweenAtmosphere: React.FC = () => {
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

  const multiplier = isMobile ? 0.4 : 1;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <FloatingParticles multiplier={multiplier} />
      <MovingShadows />
      <FogEffect />
      <TwinklingStars multiplier={multiplier} />
    </div>
  );
};
