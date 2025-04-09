import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import FadeIn from "./FadeIn";

const skills = [
  "Cloud",
  "Proxmox",
  "n8n",
  "APIs",
  "Web Development",
  "AI",
  "WordPress",
  "Elementor",
];

const AboutMe = () => {
  return (
    <div className="py-16 space-y-8">
      {/* Header Section */}
      <FadeIn>
        <div className="space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Sobre mí</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            👋 ¡Hola! Soy Andrés López, un apasionado por la tecnología desde
            que tengo memoria. Además de lo técnico, me apasiona combinar ese
            conocimiento con lo que elegí como carrera profesional: los Negocios
            Internacionales y la Economía. Esta mezcla me permite crear
            soluciones no solo eficientes desde el lado tecnológico, sino
            también estratégicas y sostenibles desde la perspectiva empresarial.
          </p>
        </div>
      </FadeIn>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Image + Skills */}
        <div className="row-span-2">
          <FadeIn delay={0.2}>
            <div className="space-y-6">
              <div className="relative aspect-square">
                <div className="rounded-2xl overflow-hidden border-2 border-primary/20 bg-primary/5 h-full">
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
          </FadeIn>
        </div>

        {/* Right Side: Cards */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8 content-start">
          {/* Top Row: Technology and Automation */}
          <FadeIn delay={0.4}>
            <Card className="bg-card/50 backdrop-blur h-full">
              <CardContent className="pt-2">
                <h3 className="font-semibold text-lg mb-2">👨‍💻 Tecnología</h3>
                <p className="text-muted-foreground">
                  Me encanta experimentar con sistemas, virtualización y
                  herramientas de código abierto. Siempre estoy buscando nuevas
                  formas de construir entornos eficientes, estables y
                  escalables.
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.5}>
            <Card className="bg-card/50 backdrop-blur h-full">
              <CardContent className="pt-2">
                <h3 className="font-semibold text-lg mb-2">
                  🚀 Automatización
                </h3>
                <p className="text-muted-foreground">
                  Soy fan de la optimización. Uso n8n, IA y APIs para
                  automatizar procesos, ahorrar tiempo y mejorar flujos de
                  trabajo tanto personales como empresariales.
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Bottom Row: Mission */}
          <div className="sm:col-span-2">
            <FadeIn delay={0.6}>
              <Card className="bg-card/50 backdrop-blur h-full">
                <CardContent className="pt-2">
                  <h3 className="font-semibold text-lg mb-2">🎯 Misión</h3>
                  <p className="text-muted-foreground">
                    Mi misión es clara: hacer que la tecnología sea accesible y
                    comprensible para todos, especialmente en Latinoamérica,
                    donde el talento abunda pero muchas veces faltan
                    oportunidades.
                  </p>
                  <br />
                  <p className="text-muted-foreground">
                    Quiero que más emprendedores, creadores y profesionales
                    puedan usar la tecnología como aliada para hacer crecer sus
                    ideas y transformar su realidad.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
