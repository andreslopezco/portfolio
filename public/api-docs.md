# API pública del portafolio

La API es de solo lectura y no requiere autenticación.

- `GET /api/version`: instantánea de versión pública y fecha de actualización del repositorio, generada durante el build con datos de GitHub.
- `GET /api/youtube`: instantánea de videos recientes del canal, generada durante el build desde la caché o desde YouTube cuando existen las variables requeridas.
- `POST /api/mcp`: servidor MCP Streamable HTTP stateless y de solo lectura, compatible con MCP `2025-06-18`. Implementa `initialize`, `ping`, `tools/list`, `tools/call` y las herramientas `get_portfolio_info` y `list_public_resources`. Las notificaciones válidas responden `202`; `GET` y `DELETE` responden `405` porque no ofrece SSE ni sesiones.
- `POST /api/a2a`: agente A2A 1.0 de solo lectura con binding JSON-RPC. Implementa `SendMessage` para preguntas sobre Andrés, sus temas y recursos públicos; no anuncia streaming, tareas persistentes ni push notifications.

El contrato completo está en `/openapi.json`. Los datos se actualizan al volver a construir/desplegar el sitio; no se ofrecen operaciones de escritura.

Los dos endpoints GET son archivos JSON prerenderizados: si un proveedor externo falla durante el build, el cuerpo generado puede contener un campo `error`. MCP y A2A son funciones Node stateless de Vercel y se ejecutan por solicitud, sin escritura ni dependencia de servicios externos.
