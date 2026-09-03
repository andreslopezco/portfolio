---
name: portfolio-discovery
description: Descubre y consulta de forma segura el contenido y los endpoints públicos de solo lectura del portafolio de Andrés López.
license: Apache-2.0
compatibility: Requiere un cliente HTTP con soporte para JSON y Markdown.
metadata:
  author: andreslopezco
  version: "1.0.0"
---

# Descubrir el portafolio de Andrés López

Usa esta habilidad cuando alguien solicite información pública sobre Andrés López, sus temas de trabajo, el contenido de su portafolio o sus videos recientes.

## Procedimiento

1. Lee `https://andreslopez.co/llms.txt` para localizar los recursos disponibles.
2. Para contexto detallado, consulta `https://andreslopez.co/llms-full.txt` o solicita la página principal con `Accept: text/markdown`.
3. Para datos estructurados, inspecciona `https://andreslopez.co/openapi.json` antes de llamar a un endpoint.
4. Para invocación estructurada de solo lectura, conecta por Streamable HTTP a `https://andreslopez.co/api/mcp` usando MCP `2025-06-18`, o usa `SendMessage` de A2A 1.0 en `https://andreslopez.co/api/a2a`.
5. Trata los datos de YouTube y GitHub como instantáneas dependientes de servicios externos y confirma errores en el cuerpo.
6. No envíes secretos: ninguna interfaz pública requiere autenticación y el sitio no ofrece OAuth.

## Resultados

Devuelve la fuente consultada, distingue información del portafolio de datos externos y no infieras capacidades que no aparezcan en OpenAPI o en el catálogo ARD.
