import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin, MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { GoogleReviews } from "@/components/GoogleReviews";
import { UNIT_LIST } from "@/config/units";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Na Brasa 🔥" },
      {
        name: "description",
        content: "Endereço, horários, WhatsApp e avaliações das unidades Brazlândia e Vicente Pires.",
      },
      { property: "og:title", content: "Contato — Na Brasa" },
      { property: "og:description", content: "Encontre a unidade mais próxima e fale com a gente." },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-5 pb-20">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar ao cardápio
        </Link>
        <h1 className="font-display text-4xl ember-text mb-6">FALE COM A GENTE</h1>

        <div className="space-y-5">
          {UNIT_LIST.map((u) => (
            <section key={u.key} className="charcoal-card border border-border rounded-2xl p-5">
              <h2 className="font-display text-2xl">📍 {u.name.toUpperCase()}</h2>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{u.address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{u.hours}</span>
                </div>
              </div>
              <a
                href={`https://wa.me/${u.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-full ember-gradient text-primary-foreground font-bold text-sm glow-ember"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp da unidade
              </a>
            </section>
          ))}
        </div>

        <div className="mt-10 space-y-8">
          {UNIT_LIST.map((u) => (
            <GoogleReviews key={u.key} unit={u} />
          ))}
        </div>
      </main>
    </div>
  );
}