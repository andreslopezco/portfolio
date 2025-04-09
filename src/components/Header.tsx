import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Header: FC = () => {
  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + texto */}
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-14 w-auto" />
        </a>

        {/* Menú desktop */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-6 font-medium">
            <a href="/" className="hover:underline">
              Inicio
            </a>
            <a href="#videos" className="hover:underline">
              Videos
            </a>
            <a href="#about" className="hover:underline">
              Sobre mí
            </a>
          </nav>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px]">
              <nav className="flex flex-col gap-4 mt-6 px-4">
                <a href="/" className={cn("text-base font-medium")}>
                  Inicio
                </a>
                <a href="#videos" className={cn("text-base font-medium")}>
                  Videos
                </a>
                <a href="#about" className={cn("text-base font-medium")}>
                  Sobre mí
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
