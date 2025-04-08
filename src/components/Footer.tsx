import type { FC } from "react";
import { Youtube, Github, Instagram, Twitter, Music } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Footer: FC = () => {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-sm text-muted-foreground">
      {/* Redes sociales */}
      <div className="container mx-auto px-4 pt-6 pb-4 flex justify-center gap-4">
        <a
          href="https://www.youtube.com/andreslopezco"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Youtube className="h-5 w-5 hover:text-foreground transition-colors" />
        </a>
        <a
          href="https://github.com/andreslopezco"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="h-5 w-5 hover:text-foreground transition-colors" />
        </a>
        <a
          href="https://www.instagram.com/andreslopez.co"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram className="h-5 w-5 hover:text-foreground transition-colors" />
        </a>
        <a
          href="https://x.com/andreslopez_co"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="h-5 w-5 hover:text-foreground transition-colors" />
        </a>
        <a
          href="https://tiktok.com/@andreslopezco"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Music className="h-5 w-5 hover:text-foreground transition-colors" />
        </a>
      </div>

      {/* Copyright + toggle */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Andrés López. Todos los derechos
            reservados.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
