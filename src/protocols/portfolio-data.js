export const portfolioInfo = {
  name: "Andrés López",
  description:
    "Desarrollador y creador de contenido en español sobre tecnología, servidores, homelabs, automatización con IA y soluciones digitales.",
  topics: [
    "tecnología",
    "servidores",
    "homelabs",
    "automatización",
    "inteligencia artificial",
    "APIs",
    "nube",
    "Proxmox",
    "n8n",
    "WordPress",
    "Elementor",
  ],
  website: "https://andreslopez.co",
  youtube: "https://www.youtube.com/@andreslopezco/videos",
};

export const publicResources = [
  { name: "portfolio", url: "https://andreslopez.co/index.md", mediaType: "text/markdown" },
  { name: "full-context", url: "https://andreslopez.co/llms-full.txt", mediaType: "text/plain" },
  { name: "openapi", url: "https://andreslopez.co/openapi.json", mediaType: "application/vnd.oai.openapi+json" },
  { name: "api-catalog", url: "https://andreslopez.co/.well-known/api-catalog", mediaType: "application/linkset+json" },
  { name: "ai-catalog", url: "https://andreslopez.co/.well-known/ai-catalog.json", mediaType: "application/json" },
];

export function portfolioAnswer(text) {
  const query = text.toLocaleLowerCase("es");
  if (query.includes("recurso") || query.includes("endpoint") || query.includes("api")) {
    return `Recursos públicos de solo lectura:\n${publicResources.map(({ name, url }) => `- ${name}: ${url}`).join("\n")}`;
  }
  if (query.includes("tema") || query.includes("tecnolog") || query.includes("contenido")) {
    return `${portfolioInfo.name} trabaja y crea contenido sobre ${portfolioInfo.topics.join(", ")}. Más información: ${portfolioInfo.website}`;
  }
  return `${portfolioInfo.description} Sitio: ${portfolioInfo.website}. Canal: ${portfolioInfo.youtube}. Puedes preguntar por sus temas o por los recursos públicos del portafolio.`;
}
