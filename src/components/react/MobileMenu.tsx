import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/utils/utils";

const MobileMenuComponent = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Abrir menú de navegación">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[250px]">
        <nav className="flex flex-col gap-4 mt-6 px-4">
          <a href="#home" className={cn("text-base font-medium")}>
            Inicio
          </a>
          <a href="#videos" className={cn("text-base font-medium")}>
            Videos
          </a>
          <a href="#servicios" className={cn("text-base font-medium")}>
            Servicios
          </a>
          <a href="#projects" className={cn("text-base font-medium")}>
            Proyectos
          </a>
          <a href="#about" className={cn("text-base font-medium")}>
            Sobre mí
          </a>
          <a href="#contacto" className={cn("text-base font-medium")}>
            Contacto
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenuComponent;
