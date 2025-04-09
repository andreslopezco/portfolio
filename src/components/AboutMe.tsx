import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "./ui/badge";

const skills = [
  "Linux",
  "Docker",
  "Proxmox",
  "Cloud",
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "n8n",
  "APIs",
];

const AboutMe = () => {
  return (
    <section id="about" className="relative overflow-hidden" aria-label="Información sobre mí">
      <div className="container max-w-6xl mx-auto px-4 pt-8 pb-16 space-y-12">
        {/* Header Section */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">
            Sobre mí
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            ¡Hola! Soy Andrés. Desde pequeño me ha encantado la tecnología,
            experimenté con radios virtuales, producción musical y diseño web.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Image + Skills */}
          <div className="space-y-8">
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 bg-primary/5">
                <img
                  src="/profile.webp"
                  alt="Andrés López"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </div>

            {/* Skills Grid */}
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right Column: Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-2xl mb-3">👨‍💻</div>
                <h3 className="font-semibold text-lg mb-2">Tecnología</h3>
                <p className="text-muted-foreground">
                  Me encanta experimentar con Linux, servidores, Proxmox y
                  herramientas de código abierto.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-2xl mb-3">🚀</div>
                <h3 className="font-semibold text-lg mb-2">Automatización</h3>
                <p className="text-muted-foreground">
                  Uso n8n, scripts y APIs para optimizar tareas y crear flujos
                  inteligentes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur sm:col-span-2">
              <CardContent className="pt-6">
                <div className="text-2xl mb-3">🎯</div>
                <h3 className="font-semibold text-lg mb-2">Misión</h3>
                <p className="text-muted-foreground">
                  Ayudar a emprendedores y pequeñas empresas a escalar con
                  soluciones simples, eficientes y automatizadas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
