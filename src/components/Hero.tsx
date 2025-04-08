import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero: FC = () => {
  return (
    <section className="text-foreground py-20 md:py-32 text-center">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          ¡Hola, soy Andrés 👋!
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Comparto contenido sobre tecnología, servidores VPS, homelabs,
          automatizaciones con IA y mucho más. Acompáñame en esta aventura para
          crear soluciones increíbles. 🚀
        </p>

        <div className="flex justify-center">
          <Button asChild size="lg">
            <a
              href="https://www.youtube.com/@andreslopezco/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Ver videos <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
