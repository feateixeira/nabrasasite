import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { useUnit } from "@/hooks/useUnit";
import { UnitSelector } from "@/components/UnitSelector";
import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { unit } = useUnit();
  return (
    <div className="min-h-screen">
      {unit ? (
        <>
          <Header />
          <Menu />
        </>
      ) : null}
      <AnimatePresence>{!unit && <UnitSelector />}</AnimatePresence>
    </div>
  );
}
