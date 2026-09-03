# Portafolio de Andrés López

Este es el portafolio personal de Andrés López, donde se presentan proyectos y contenido relacionado con tecnología, servidores, automatización y más. El portafolio está construido utilizando Astro y React, y está diseñado para ser rápido y responsivo.

## Instalación

Para instalar las dependencias del proyecto, asegúrate de tener [Node.js](https://nodejs.org/) instalado en tu máquina. Luego, ejecuta los siguientes comandos en la terminal:

```bash
# Clona el repositorio
git clone https://github.com/andreslopezco/portfolio.git

# Navega al directorio del proyecto
cd portfolio

# Instala las dependencias
npm install
```

## Uso

Para ejecutar el proyecto en un entorno local, utiliza el siguiente comando:

```bash
npm run dev
```

Esto iniciará un servidor de desarrollo y podrás acceder al portafolio en `http://localhost:4321`.

Para servir el build como en producción:

```bash
npm run build
npm start
```

El servidor Node escucha en `PORT` (3000 por defecto), sirve los archivos estáticos de `dist`, expone MCP/A2A y ofrece el healthcheck `/healthz`.

Producción usa **Nixpacks** en Dokploy. `nixpacks.toml` fija una instalación reproducible con `npm ci`, ejecuta `npm run build` y arranca con `npm start`. En la configuración de Dokploy:

- Mantén **Build Type = Nixpacks**.
- Borra el valor de **Publish Directory** y déjalo vacío; `./dist` hace que Dokploy cree la capa de servicio estático que su UI describe como **NGINX**, omitiendo `server.mjs`, MCP/A2A y la negociación Markdown. Esa capa no es el proxy principal de Dokploy.
- Define `PORT=3000` y configura el dominio en Traefik, el proxy/ingress de Dokploy, para enrutar al puerto interno `3000`.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.
