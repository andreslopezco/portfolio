# Andrés López auth.md

## Estado de autenticación

Este portafolio y sus endpoints públicos de solo lectura no requieren autenticación. No existe registro o aprovisionamiento de agentes, no se emiten credenciales y este dominio no opera un authorization server OAuth u OpenID Connect.

Los agentes pueden leer el contenido público, `GET /api/version` y `GET /api/youtube` sin credenciales. No publique ni envíe tokens, claves API u otros secretos a este sitio.

## Contacto y capacidades

Consulte `/llms.txt`, `/.well-known/api-catalog` y `/.well-known/agent-skills/index.json` para descubrir los recursos públicos reales. No hay endpoints protegidos ni scopes disponibles.
