import { Card, CardContent } from "@/components/ui/card";

const AboutMe = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-start" aria-label="Información sobre mí">
      {/* Sección izquierda: Texto */}
      <div>
        <h2 className="text-3xl font-bold mb-4 text-primary">Sobre mí</h2>
        <p className="text-muted-foreground text-base leading-relaxed mb-6">
          ¡Hola! Soy Andrés. Desde pequeño me ha encantado la tecnología,
          experimenté con radios virtuales, producción musical y diseño web. Hoy
          combino mis pasiones ayudando a emprendedores a aprovechar el poder de
          la automatización, la nube y la inteligencia artificial para crecer.
        </p>
      </div>

      {/* Sección derecha: Tarjetas */}
      <div className="grid gap-4">
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
    </section>
  );
};

export default AboutMe;
