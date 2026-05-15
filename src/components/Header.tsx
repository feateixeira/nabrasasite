import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Phone, ShoppingBag, RefreshCw } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useUnit } from '@/hooks/useUnit';
import { useCart } from '@/hooks/useCart';
import { UNITS } from '@/config/units';
import { UnitSelector } from './UnitSelector';

export function Header() {
  const { unit } = useUnit();
  const { count, open, setCartIconRef, bumpKey } = useCart();
  const [switching, setSwitching] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setCartIconRef(ref.current);
  }, [setCartIconRef]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-coal/90 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <Link to="/" className="flex items-center" aria-label="Na Brasa - Início">
            <img
              src="/logo.png"
              alt="Hamburgueria Na Brasa"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.style.display = 'none';
                const fb = img.nextElementSibling as HTMLElement | null;
                if (fb) fb.style.display = 'inline';
              }}
            />
            <span
              className="font-display text-2xl ember-text"
              style={{ display: 'none' }}
            >
              NA BRASA
            </span>
          </Link>

          {unit && (
            <button
              onClick={() => setSwitching(true)}
              className="ml-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary border border-border text-xs hover:border-primary transition-colors"
            >
              <MapPin className="w-3 h-3 text-primary" />
              <span className="font-medium">{UNITS[unit].name}</span>
              <RefreshCw className="w-3 h-3 text-muted-foreground" />
            </button>
          )}

          <div className="flex-1" />

          <Link
            to="/contato"
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Contato"
          >
            <Phone className="w-5 h-5" />
          </Link>

          <motion.button
            ref={ref}
            onClick={open}
            key={bumpKey}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 0.35 }}
            className="relative p-2 rounded-lg ember-gradient text-primary-foreground glow-ember"
            aria-label="Abrir carrinho"
          >
            <ShoppingBag className="w-5 h-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0, y: -4 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-coal text-foreground text-[11px] font-bold flex items-center justify-center border-2 border-primary"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      <AnimatePresence>
        {switching && <UnitSelector variant="modal" onClose={() => setSwitching(false)} />}
      </AnimatePresence>
    </>
  );
}