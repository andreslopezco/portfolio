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
4. Usa únicamente métodos GET. Trata los datos de YouTube y GitHub como dependientes de servicios externos y confirma errores HTTP.
5. No envíes secretos: el sitio no requiere autenticación y no ofrece OAuth, MCP ni A2A.

## Resultados

Devuelve la fuente consultada, distingue información del portafolio de datos externos y no infieras capacidades que no aparezcan en OpenAPI o en el catálogo ARD.
