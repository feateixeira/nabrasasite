import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { UnitConfig } from '@/config/units';

interface Review {
  author: string;
  photo?: string;
  rating: number;
  text: string;
  date: string;
}

const FALLBACK: Record<string, Review[]> = {
  brazlandia: [
    {
      author: 'Lucas M.',
      rating: 5,
      text: 'Melhor hambúrguer da região! O cheddar derrete na boca e o pão é maravilhoso.',
      date: 'há 2 semanas',
    },
    {
      author: 'Aline R.',
      rating: 5,
      text: 'Atendimento rápido, sabor excelente. O Na Brasa Especial é viciante!',
      date: 'há 1 mês',
    },
    {
      author: 'Pedro S.',
      rating: 4,
      text: 'Lugar aconchegante, comida muito boa. As batatas recheadas valem cada centavo.',
      date: 'há 1 mês',
    },
  ],
  vicentePires: [
    {
      author: 'Carolina T.',
      rating: 5,
      text: 'Carne suculenta, no ponto certo. Ambiente super agradável.',
      date: 'há 3 semanas',
    },
    {
      author: 'Marcos D.',
      rating: 5,
      text: 'O Eno é absurdo de bom, prato perfeito para dividir.',
      date: 'há 2 meses',
    },
  ],
};

export function GoogleReviewCard({ review }: { review: Review }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="charcoal-card border border-border rounded-2xl p-4 min-w-[260px] sm:min-w-0"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full ember-gradient flex items-center justify-center text-primary-foreground font-bold">
          {review.author.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm">{review.author}</div>
          <div className="text-[11px] text-muted-foreground">{review.date}</div>
        </div>
      </div>
      <div className="flex gap-0.5 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
    </motion.div>
  );
}

export function GoogleReviews({ unit }: { unit: UnitConfig }) {
  // TODO: wire up Google Places API using unit.placeId
  const reviews = FALLBACK[unit.key] ?? [];
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-xl">AVALIAÇÕES · {unit.name.toUpperCase()}</h3>
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 fill-primary text-primary" />
          <b>4.8</b>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {reviews.map((r, i) => (
          <GoogleReviewCard key={i} review={r} />
        ))}
      </div>
    </div>
  );
}