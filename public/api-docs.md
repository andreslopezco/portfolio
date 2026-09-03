# API pública del portafolio

La API es de solo lectura y no requiere autenticación.

- `GET /api/version`: instantánea de versión pública y fecha de actualización del repositorio, generada durante el build con datos de GitHub.
- `GET /api/youtube`: instantánea de videos recientes del canal, generada durante el build desde la caché o desde YouTube cuando existen las variables requeridas.

El contrato completo está en `/openapi.json`. Los datos se actualizan al volver a construir/desplegar el sitio; no se ofrecen operaciones de escritura.

Al ser archivos JSON prerenderizados, el hosting estático responde `200` cuando el artefacto existe. Si un proveedor externo falla durante el build, el cuerpo generado puede contener un campo `error`; no hay ejecución server-side ni estados dinámicos por solicitud.
