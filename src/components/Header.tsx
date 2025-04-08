import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Header: FC = () => {
  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-xl font-bold tracking-tight">
          Andrés López
        </a>

        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <a href="/" className="hover:underline">
            Inicio
          </a>
          <a href="/proyectos" className="hover:underline">
            Proyectos
          </a>
          <a href="/contacto" className="hover:underline">
            Contacto
          </a>
        </nav>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px]">
            <nav className="flex flex-col gap-4 mt-6">
              <a href="/" className={cn("text-base font-medium")}>
                Inicio
              </a>
              <a href="/proyectos" className={cn("text-base font-medium")}>
                Proyectos
              </a>
              <a href="/contacto" className={cn("text-base font-medium")}>
                Contacto
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
