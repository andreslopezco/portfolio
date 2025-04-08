import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaDownload } from "react-icons/fa";

const AboutMe = () => {
  return (
    <section className="w-full mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-6">Sobre mí</h2>

      <Card className="mb-6">
        <CardContent className="p-6 text-base leading-relaxed text-muted-foreground">
          <p>
            ¡Hola! Soy Andrés López, apasionado por la tecnología, la
            automatización y el aprendizaje constante. Desde joven me interesó
            la locución, la producción musical y el desarrollo web. Hoy en día
            experimento con homelabs, servidores VPS, Proxmox y soluciones con
            inteligencia artificial para automatizar procesos y mejorar la
            eficiencia de los negocios.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-1">👨‍💻 Tecnología</h3>
            <p className="text-sm text-muted-foreground">
              Me encanta experimentar con Linux, servidores, Proxmox y
              herramientas de código abierto.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-1">🚀 Automatización</h3>
            <p className="text-sm text-muted-foreground">
              Uso n8n, scripts y APIs para optimizar tareas y crear flujos
              inteligentes para proyectos personales y comerciales.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-1">🎯 Misión</h3>
            <p className="text-sm text-muted-foreground">
              Ayudar a emprendedores y pequeñas empresas a escalar con
              soluciones simples, eficientes y automatizadas.
            </p>
          </CardContent>
        </Card>
      </div>

      <Button variant="outline" size="lg" className="gap-2">
        <FaDownload className="w-4 h-4" />
        Descargar CV
      </Button>
    </section>
  );
};

export default AboutMe;
