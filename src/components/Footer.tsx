import type { FC } from "react";
import {
  SiYoutube,
  SiInstagram,
  SiX,
  SiTiktok,
  SiGithub,
} from "react-icons/si";
import ThemeToggle from "@/components/ThemeToggle";
import { useVersion } from "@/hooks/useVersion";

const VersionInfo: FC = () => {
  const { versionInfo, loading, error } = useVersion();

  if (loading || error || !versionInfo) return null;

  return (
    <a
      href="https://github.com/andreslopezco/portfolio"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[10px] text-muted-foreground/60 hover:text-foreground transition-colors"
      aria-label="Ver código fuente en GitHub"
    >
      {versionInfo.version}
    </a>
  );
};

const Footer: FC = () => {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-sm text-muted-foreground">
      {/* Redes sociales */}
      <div className="container mx-auto px-4 py-6 flex justify-center gap-4">
        <a
          href="https://www.youtube.com/@andreslopezco"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visitar canal de YouTube"
        >
          <SiYoutube className="h-5 w-5 hover:text-foreground transition-colors" />
        </a>
        <a
          href="https://www.instagram.com/andreslopez.co"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Seguir en Instagram"
        >
          <SiInstagram className="h-5 w-5 hover:text-foreground transition-colors" />
        </a>
        <a
          href="https://x.com/andreslopez_co"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Seguir en X (Twitter)"
        >
          <SiX className="h-5 w-5 hover:text-foreground transition-colors" />
        </a>
        <a
          href="https://tiktok.com/@andreslopezco"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Seguir en TikTok"
        >
          <SiTiktok className="h-5 w-5 hover:text-foreground transition-colors" />
        </a>
        <a
          href="https://github.com/andreslopezco"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver perfil de GitHub"
        >
          <SiGithub className="h-5 w-5 hover:text-foreground transition-colors" />
        </a>
      </div>

      {/* Copyright + toggle */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="text-xs flex flex-col items-center md:items-start gap-1">
            <p>
              &copy; {new Date().getFullYear()} Andrés López. Todos los derechos
              reservados. <VersionInfo />
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
