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
- `vercel.json` configura comportamiento del borde que un build estático no puede expresar por sí solo: headers de descubrimiento, tipos MIME/CORS específicos y negociación `Accept: text/markdown`.

## Rutas clave agent-ready

- `/robots.txt`: política de rastreo, reglas explícitas para bots de IA, Content Signals, Sitemap y Agentmap.
- `/sitemap.xml`: URLs HTML canónicas públicas.
- `/index.md`: representación Markdown negociada de `/`; `/llms.txt` y `/llms-full.txt`: índices de contexto para modelos.
- `/.well-known/api-catalog`: catálogo RFC 9727; `/openapi.json` y `/api-docs.md`: descripción contractual y humana de APIs reales.
- `/auth.md`: declaración honesta de que el contenido y los endpoints son públicos y no existe OAuth ni registro de agentes.
- `/.well-known/agent-skills/index.json` y `/.well-known/agent-skills/<name>/SKILL.md`: índice y artefactos Agent Skills con digest SHA-256.
- `/.well-known/ai-catalog.json`: manifiesto ARD/ai-catalog de recursos existentes.
- `src/layouts/Layout.astro`: enlaces HTML de descubrimiento y herramienta WebMCP con feature detection.

No se publican MCP Server Card, A2A Agent Card ni metadatos OAuth hasta que exista y se pruebe el servidor, transporte o issuer correspondiente. DNS-AID/DNSSEC y modificaciones de Cloudflare se administran fuera de este repositorio.

## Comandos

```bash
npm ci
npm run dev
npm run check
npm run verify:agent-ready
npm run build
npm run preview
```

No hay script de lint ni suite de tests unitarios actualmente. Si se agregan, pasan a ser obligatorios antes de PR. `scripts/verify-agent-ready.mjs` usa solo módulos estándar de Node y valida JSON, XML/texto, digests, configuración Vercel y la ausencia de anuncios engañosos.

## Mantenimiento de artefactos agent-ready

1. Al añadir o quitar páginas públicas, actualiza `sitemap.xml`, `index.md`, `llms.txt` y, si aporta contexto, `llms-full.txt`.
2. Al cambiar APIs, sincroniza el código de `src/pages/api/`, `openapi.json`, `api-docs.md`, API Catalog y las entradas ARD relacionadas.
3. Al editar un `SKILL.md`, recalcula exactamente sobre sus bytes publicados `sha256sum public/.well-known/agent-skills/<name>/SKILL.md` y reemplaza el digest `sha256:<hex>` en el índice.
4. Cada entrada ARD debe describir un recurso real, usar un MIME de IANA, tener exactamente uno de `url` o `data` y entre 2 y 5 consultas representativas.
5. Mantén `robots.txt` coherente con la política del propietario; no cambies permisos de entrenamiento o rastreo como optimización de puntuación.
6. Verifica localmente con `npm run verify:agent-ready`, construye y comprueba en preview que los archivos estén en `dist/`. Tras desplegar, confirma headers y tipos MIME con `curl` y vuelve a ejecutar el escáner público.
7. La negociación Markdown y los headers dependen de `vercel.json`; si cambia el proveedor de hosting, hay que reimplementar y probar esa lógica en el nuevo borde.
