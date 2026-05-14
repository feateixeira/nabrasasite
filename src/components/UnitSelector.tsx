import { motion } from 'framer-motion';
import { Flame, MapPin } from 'lucide-react';
import { useUnit } from '@/hooks/useUnit';
import { UNIT_LIST } from '@/config/units';

interface Props {
  onClose?: () => void;
  variant?: 'fullscreen' | 'modal';
}

export function UnitSelector({ onClose, variant = 'fullscreen' }: Props) {
  const { setUnit } = useUnit();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={
        variant === 'fullscreen'
          ? 'fixed inset-0 z-50 flex flex-col items-center justify-center px-6 bg-background'
          : 'fixed inset-0 z-[60] flex items-center justify-center px-4 bg-coal/80 backdrop-blur-sm'
      }
    >
      <motion.div
        initial={{ scale: 0.96, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Flame className="w-7 h-7 text-primary" />
            <span className="font-display text-4xl tracking-wide ember-text">NA BRASA</span>
          </div>
          <h1 className="font-display text-3xl text-foreground">ESCOLHA SUA UNIDADE</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Para começar seu pedido, selecione onde quer pedir.
          </p>
        </div>

        <div className="space-y-3">
          {UNIT_LIST.map((u) => (
            <motion.button
              key={u.key}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -2 }}
              onClick={() => {
                setUnit(u.key);
                onClose?.();
              }}
              className="w-full charcoal-card border border-border rounded-2xl p-5 text-left hover:border-primary transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl ember-gradient flex items-center justify-center shrink-0 glow-ember">
                  <MapPin className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="font-display text-2xl text-foreground group-hover:text-primary transition-colors">
                    {u.name.toUpperCase()}
                  </div>
                  <div className="text-xs text-muted-foreground">{u.hours}</div>
                </div>
                <div className="text-primary text-2xl">→</div>
              </div>
            </motion.button>
          ))}
        </div>

        {variant === 'modal' && onClose && (
          <button
            onClick={onClose}
            className="mt-6 w-full text-sm text-muted-foreground hover:text-foreground"
          >
            Cancelar
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}