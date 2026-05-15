import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';

export function CartItemFlyAnimation() {
  const { flyEvents, consumeFly } = useCart();
  return (
    <>
      {flyEvents.map((e) => (
        <Fly
          key={e.id}
          image={e.image}
          from={e.from}
          to={e.to}
          onDone={() => consumeFly(e.id)}
        />
      ))}
    </>
  );
}

function Fly({
  image,
  from,
  to,
  onDone,
}: {
  image: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  onDone: () => void;
}) {
  return (
    <motion.div
      initial={{ x: from.x - 28, y: from.y - 28, scale: 1, opacity: 1 }}
      animate={{ x: to.x - 14, y: to.y - 14, scale: 0.25, opacity: 0.6 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={onDone}
      style={{ pointerEvents: 'none' }}
      className="fixed top-0 left-0 z-[80] w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary glow-ember"
    >
      <img src={image} alt="" className="w-full h-full object-cover" />
    </motion.div>
  );
}