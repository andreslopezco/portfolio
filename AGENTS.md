# AGENTS.md

## Responsabilidades y regla de entrega

Hermes Agent es el orquestador del trabajo y Codex CLI es el implementador: todo el código, configuración y verificaciones de este repositorio los ejecuta Codex CLI siguiendo el alcance que coordina Hermes.

No se abre ningún pull request sin ejecutar desde una instalación limpia `npm ci`, todos los checks disponibles (`npm run check`, lint cuando exista y cualquier otro script de validación), las pruebas pertinentes al cambio y un `npm run build` de producción exitoso. Un cambio de artefactos agent-ready exige además `npm run verify:agent-ready`. No se debe afirmar que un check remoto pasa hasta desplegar y confirmar el resultado contra el dominio público.

## Arquitectura real

- Astro 5 genera el sitio, con configuración central en `astro.config.mjs` y alias `@/*` definido en `tsconfig.json`.
- `src/pages/index.astro` compone la única página visual mediante `src/layouts/Layout.astro` y componentes Astro en `src/components/`.
- Las interacciones se implementan como islas React en `src/components/react/`; los componentes visuales reutilizables están en `src/components/ui/`.
- `src/pages/api/version.ts` y `src/pages/api/youtube.ts` prerenderizan durante el build archivos JSON de solo lectura. El primero consulta GitHub; el segundo usa YouTube y la caché `src/data/youtube-cache.json` mediante `src/utils/cache.ts`. En el hosting estático se sirven como `GET 200` cuando el archivo existe; un fallo externo durante el build puede quedar representado mediante un campo `error` en el cuerpo. Cambian al reconstruir/desplegar, no por ejecución server-side en cada request.
- `src/styles/global.css` y `tailwind.config.mjs` contienen el sistema visual. Los archivos estáticos se publican desde `public/`.
- Producción se despliega en Dokploy con `Dockerfile`. `server.mjs`, sin dependencias externas, sirve `dist/`, aplica headers/MIME y negociación `Accept: text/markdown`, y enruta MCP/A2A. El contenedor escucha en `PORT` (3000 por defecto) y expone `/healthz`.
- `vercel.json` conserva el comportamiento equivalente para despliegues alternativos en Vercel; no gobierna la producción de Dokploy.
- `api/mcp.js` y `api/a2a.js` son handlers Node compartidos por el servidor de producción y las funciones Vercel. La lógica testeable vive en `src/protocols/`: MCP es Streamable HTTP stateless `2025-06-18` y A2A usa el binding JSON-RPC 1.0; ambos son públicos y de solo lectura.

## Rutas clave agent-ready

- `/robots.txt`: política de rastreo, reglas explícitas para bots de IA, Content Signals, Sitemap y Agentmap.
- `/sitemap.xml`: URLs HTML canónicas públicas.
- `/index.md`: representación Markdown negociada de `/`; `/llms.txt` y `/llms-full.txt`: índices de contexto para modelos.
- `/.well-known/api-catalog`: catálogo RFC 9727; `/openapi.json` y `/api-docs.md`: descripción contractual y humana de APIs reales.
- `/auth.md`: declaración honesta de que el contenido y los endpoints son públicos y no existe OAuth ni registro de agentes.
- `/.well-known/agent-skills/index.json` y `/.well-known/agent-skills/<name>/SKILL.md`: índice y artefactos Agent Skills con digest SHA-256.
- `/.well-known/ai-catalog.json`: manifiesto ARD/ai-catalog de recursos existentes.
- `/.well-known/mcp.json` y `POST /api/mcp`: Server Card y servidor MCP funcional con `initialize`, `ping`, `tools/list` y `tools/call`.
- `/.well-known/agent-card.json` y `POST /api/a2a`: Agent Card A2A 1.0 e implementación funcional de `SendMessage`.
- `src/layouts/Layout.astro`: enlaces HTML de descubrimiento y herramienta WebMCP con feature detection.

No se publican metadatos OAuth porque el contenido, MCP y A2A son públicos y no existe issuer. No se deben anunciar operaciones MCP/A2A adicionales hasta implementarlas y probarlas. DNS-AID/DNSSEC y modificaciones de Cloudflare se administran fuera de este repositorio.

## Comandos

```bash
npm ci
npm run dev
npm run check
npm test
npm run verify:agent-ready
npm run build
npm run preview
```

No hay script de lint. `npm test` prueba directamente los handlers MCP/A2A y levanta `server.mjs` en un puerto efímero para verificar HTTP real, negociación, MIME, seguridad, descubrimiento y errores. `scripts/verify-agent-ready.mjs` usa solo módulos estándar de Node y valida JSON, XML/texto, digests, cards, Docker/server, configuración Vercel y la ausencia de anuncios engañosos.

## Mantenimiento de artefactos agent-ready

1. Al añadir o quitar páginas públicas, actualiza `sitemap.xml`, `index.md`, `llms.txt` y, si aporta contexto, `llms-full.txt`.
2. Al cambiar APIs, sincroniza `src/pages/api/` o `api/`, `openapi.json`, `api-docs.md`, API Catalog y las entradas ARD relacionadas. Cambios MCP/A2A también requieren actualizar su card y pruebas de handler.
3. Al editar un `SKILL.md`, recalcula exactamente sobre sus bytes publicados `sha256sum public/.well-known/agent-skills/<name>/SKILL.md` y reemplaza el digest `sha256:<hex>` en el índice.
4. Cada entrada ARD debe describir un recurso real, usar un MIME de IANA, tener exactamente uno de `url` o `data` y entre 2 y 5 consultas representativas.
5. Mantén `robots.txt` coherente con la política del propietario; no cambies permisos de entrenamiento o rastreo como optimización de puntuación.
6. Verifica localmente con `npm run verify:agent-ready`, construye y comprueba con `npm start` que los archivos estén en `dist/`. Si Docker está disponible, construye y prueba también la imagen. Tras desplegar, confirma headers, MIME, MCP/A2A y negociación con `curl`, y vuelve a ejecutar el escáner público.
7. En Dokploy selecciona el `Dockerfile` como Build Type y enruta el dominio al puerto interno 3000. Nginx/proxy debe preservar `Accept`, `Link`, `Vary` y `Content-Type`, y no debe sustituir los 404 del contenedor por un fallback HTML.
