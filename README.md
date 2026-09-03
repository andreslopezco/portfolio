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

El servidor Node escucha en `PORT` (3000 por defecto), sirve los archivos estáticos de `dist`, expone MCP/A2A y ofrece el healthcheck `/healthz`. Producción usa el `Dockerfile`: en Dokploy se debe elegir **Dockerfile** como Build Type y configurar el puerto interno `3000`.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.
