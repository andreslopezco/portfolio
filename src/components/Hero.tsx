import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ParticlesComponent from "./Particles";
import FadeIn from "./FadeIn";

const Hero: FC = () => {
  return (
    <section id="home" className="relative text-foreground w-full min-h-[90vh] flex items-center" aria-label="Presentación principal">
      <div className="absolute inset-0 w-full h-full">
        <ParticlesComponent />
      </div>
      <div className="container mx-auto px-4 relative z-10 h-full flex items-center justify-center">
        <div className="max-w-3xl text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              ¡Hola, soy Andrés 👋!
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Comparto contenido sobre tecnología, servidores, homelabs,
              automatizaciones con IA y mucho más. Acompáñame en esta aventura para
              crear soluciones increíbles. 🚀
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex justify-center">
          <Button 
            size="lg" 
            className="relative group/btn overflow-hidden" 
            asChild
          >
            <a
              href="https://www.youtube.com/@andreslopezco/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 relative"
              aria-label="Ver videos en YouTube"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out" />
              Ver videos <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 duration-300" />
            </a>
          </Button>
            </div>
          </FadeIn>
      </div>
    </div>
    </section>
  );
};

export default Hero;
