import { createFileRoute } from "@tanstack/react-router";
import { useUnit } from "@/hooks/useUnit";
import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { unit } = useUnit();
  if (!unit) return null;

  return (
    <div className="min-h-screen">
      <Header />
      <Menu />
    </div>
  );
}
