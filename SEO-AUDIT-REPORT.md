# Auditoría SEO Completa — andreslopez.co

Fecha: 2026-09-05  
Proyecto: Portfolio personal (Astro 5 + Tailwind v4 + React islands)  
URL: https://andreslopez.co  
Sitemaps: `sitemap-index.xml` (1 URL), `image-sitemap.xml` (8 imágenes)

---

## Resumen

| Área | Estado | Prioridad |
|------|--------|-----------|
| On-page (títulos, meta, headings) | Bueno con fallas específicas | Alta |
| Contenido | Blog sin publicar = contenido perdido | **Crítica** |
| Técnico (sitemap, robots.txt, velocidad) | Bueno, con oportunidades | Media |
| Estructura semántica / JSON-LD | Excelente | Baja |
| Imágenes | Alt texts mejorables, cover imágenes faltan | Media |
| Rendimiento servidor | Sin caché = oportunidad | Media |

---

## 1. PROBLEMAS CRÍTICOS

### 1.1 Blog existe en content/ pero no se publica

- **Archivos:** `src/content/blog/` — 3 artículos listos (`primer-homelab-en-casa.md`, `automatizacion-con-n8n.md`, `agentes-ia-openrouter.md`)
- **Problema:** No hay `src/pages/blog/[...slug].astro` ni página de listado. El contenido NUNCA se renderiza.
- **Impacto:** El sitemap generado por `@astrojs/sitemap` solo contiene 1 URL (`/`). Google no indexa ninguna página de blog. Se pierde todo el tráfico orgánico por artículos técnicos.
- **Acción requerida:** Crear `src/pages/blog/[...slug].astro` con `getStaticPaths()` sobre `getCollection('blog')` y una página de listado `src/pages/blog/index.astro`. Actualizar `sitemap.xml`, `robots.txt` si aplica.

### 1.2 Imágenes de portada del blog no existen

- **Referencias:** `/images/blog/homelab-starter.jpg`, `/images/blog/n8n-workflows.jpg`, `/images/blog/ai-agents.jpg`
- **Problema:** El directorio `public/images/blog/` no existe. Si se publica el blog, las imágenes darán 404.
- **Acción requerida:** Crear las imágenes o placeholder y subirlas a `public/images/blog/`.

### 1.3 Anchor link roto en navegación: #services vs #servicios

- **Archivo:** `src/components/react/MainNavigation.tsx:32` — `<a href="#services">`
- **Destino real:** `src/components/home/Services.astro:77` — `id="servicios"`
- **Impacto:** El menú de navegación lleva a `#services` que no existe en la página. El scroll no funciona. Afecta UX y puede contar como enlace roto para crawlers que siguen hash links.
- **Acción requerida:** Cambiar `href="#services"` → `href="#servicios"` en `MainNavigation.tsx`.

---

## 2. ON-PAGE SEO

### 2.1 Title tag

- **Actual:** "Andrés López | Tecnología, Servidores, Automatización y más."
- **Evaluación:** Bueno. 62 caracteres (< 60 ideal pero aceptable). Contiene keyword principal y variantes. ✅
- **Recomendación:** Mantener. Optimizar cuando haya subpáginas (blog: "keyword | Andrés López").

### 2.2 Meta description

- **Actual:** ~152 caracteres, describe bien al creador de contenido tech.
- **Evaluación:** Buena longitud (~150-160 chars), incluye keywords, llamada implícita a la acción. ✅

### 2.3 Keywords meta

- **Actual:** Lista completa de 14 keywords relevantes.
- **Evaluación:** Google no usa keywords meta desde 2009. No daña, no ayuda. ✅ (neutral)

### 2.4 Heading structure (jerarquía)

| Nivel | Texto | Evaluación |
|-------|-------|-----------|
| H1 | "¡Hola, soy Andrés 👋!" | Débil para SEO. Usa emoji y saludo coloquial en vez de describir contenido. |
| H2 | "Últimos videos" | OK |
| H2 | "Servicios & Consultoría" | OK, contiene keyword |
| H2 | "Proyectos reales" | OK |
| H2 | "Sobre mí" | OK |
| H2 | "Contacto" | OK |
| H3s | Tecnología, Automatización, Misión, títulos de servicios, nombres de proyectos | OK |

**Problema:** El H1 no contiene las keywords principales ("tecnología", "servidores", "automatización"). Sugerencia:  
`<h1>Andrés López — Tecnología, Servidores y Automatización con IA</h1>`

### 2.5 Canonical URL

- **Actual:** `https://andreslopez.co/` — correcto. ✅

### 2.6 Open Graph

- og:type, og:title, og:description, og:url, og:image — todo presente y correcto. ✅
- og:locale = `es_CO` — correcto. ✅
- **Observación:** La OG image es `profile.webp` (75KB, retrato). Recomendable usar una imagen 16:9 o 1.91:1 para mejor preview en redes sociales.

### 2.7 Twitter Cards

- card = `summary_large_image`, title, description, image, creator, site — completo. ✅

### 2.8 Alt texts en imágenes

| Imagen | Alt actual | Evaluación |
|--------|-----------|-----------|
| Logo (dark/light) | `"Logo"` | Genérico. Cambiar a `"Logo de Andrés López — Tecnología, Servidores y Automatización"` |
| Profile | `"Andrés López"` | OK |
| Proyectos | `"Captura de {title}"` | Bueno, descriptivo |

---

## 3. DATOS ESTRUCTURADOS (JSON-LD)

- **Person** ✅ — Con sameAs, jobTitle, knowsAbout correctos.
- **WebSite** ✅ — Con inLanguage: "es-CO", author vinculado.
- **BreadcrumbList** ✅ — Para página de inicio: correcto.
- **Schema.org inline (Services)** ✅ — itemscope, itemprop en títulos/descripciones.

Todo excelente. Sin cambios necesarios.

---

## 4. ESTRUCTURA Y ARQUITECTURA

### 4.1 URLs

- Solo 1 URL pública: `/` (homepage).
- APIs en `/api/version` y `/api/youtube` — prerenderizadas, no indexables (bloqueadas en robots.txt). OK.

### 4.2 Arquitectura del sitio

- Single-page application con secciones por hash (home, videos, servicios, proyectos, about, contacto).
- **Problema:** Las secciones con hash NO son URLs independientes. Cada sección debería idealmente ser una página independiente para indexación individual, o al menos tener contenido suficientemente denso en la homepage.

---

## 5. TÉCNICO

### 5.1 Sitemap XML

- **Generado:** `dist/sitemap-index.xml` + `dist/sitemap-0.xml`
- **URLs incluidas:** Solo 1 (`/`)
- **image-sitemap.xml:** Existe en `public/`, lista 8 imágenes con title/caption. ✅
- **Problema:** `image-sitemap.xml` no está referenciado en `robots.txt` — Google puede no descubrirlo automáticamente.
- **Acción:** Agregar `Sitemap: https://andreslopez.co/image-sitemap.xml` al `robots.txt`.

### 5.2 robots.txt

- ✅ Reglas específicas para GPTBot, OAI-SearchBot, Claude-Web, Google-Extended, Amazonbot, anthropic-ai, Bytespider, CCBot, Applebot-Extended
- ✅ /api/ bloqueado para todos
- ✅ *.md$ bloqueado para AI crawlers
- ✅ Sitemap apunta a `sitemap.xml`
- ❌ Falta referencia a `image-sitemap.xml`

### 5.3 Velocidad y rendimiento

**Fortalezas:**
- ✅ `compressHTML: true` en Astro
- ✅ Code splitting manual (vendor, animations, particles chunks)
- ✅ Imágenes en WebP
- ✅ SVGs para proyectos (livianos)
- ✅ Lazy loading en imágenes (`loading="lazy"`)
- ✅ Dimensiones explícitas en imágenes (previene CLS)

**Oportunidades:**
- ❌ **Sin Cache-Control** en `server.mjs`. Assets inmutables en `_astro/` deberían tener `Cache-Control: public, max-age=31536000, immutable`
- ❌ Framer Motion (112 KB gzip: 37 KB) + tsparticles (148 KB gzip: 43 KB) son chunks grandes para una página de presentación. Considerar lazy loading diferido.
- ❌ Para producción Dokploy con Traefik, validar que Traefik aplique compresión Brotli/gzip y no sobreescriba headers.

### 5.4 Mobile

- ✅ Viewport meta configurado
- ✅ Menú mobile con sheet/dialog
- ✅ Tailwind responsive classes (md:, sm:)
- ✅ Full-width hero y containers responsivos

### 5.5 Semantic HTML

- ✅ `<main>` envuelve el contenido principal
- ✅ `<nav>` con `aria-label="Breadcrumb"` para breadcrumb y `aria-label="Main"` para navegación principal
- ✅ `<section>` con `aria-label` descriptivo en cada sección
- ✅ `<header>` y `<footer>` semánticos
- ✅ Uso de `aria-current="page"` en breadcrumb

---

## 6. LISTA PRIORIZADA DE ACCIONES

| # | Prioridad | Acción | Archivos | Esfuerzo |
|---|-----------|--------|----------|----------|
| 1 | **Crítica** | Publicar blog: crear `src/pages/blog/[...slug].astro` y `blog/index.astro` | `src/pages/blog/*.astro`, `src/content/config.ts` | 2-3h |
| 2 | **Crítica** | Crear imágenes de portada para blog en `public/images/blog/` | `public/images/blog/*.{jpg,webp}` | 30min |
| 3 | **Alta** | Arreglar anchor link `#services` → `#servicios` en navegación | `src/components/react/MainNavigation.tsx` | 5min |
| 4 | **Alta** | Referenciar `image-sitemap.xml` en robots.txt | `public/robots.txt` | 2min |
| 5 | **Alta** | Mejorar alt text de logos | `src/components/global/Header.astro` | 5min |
| 6 | **Media** | Mejorar H1 para incluir keywords principales | `src/components/home/Hero.astro` | 5min |
| 7 | **Media** | Agregar `Cache-Control` para assets inmutables en `server.mjs` | `server.mjs` | 15min |
| 8 | **Media** | Optimizar OG image (16:9 landscape en vez de portrait) | `src/layouts/Layout.astro` + imagen | 30min |
| 9 | **Baja** | Considerar lazy-load diferido de framer-motion y tsparticles en carga inicial | `astro.config.mjs`, componentes | 1h |

---

## 7. MÉTRICAS ESTIMADAS

- **Core Web Vitals:** Sin medición real, pero la base es sólida (lazy loading, dimensiones fijas, compressHTML). La ausencia de `Cache-Control` puede afectar LCP en visitas recurrentes.
- **Indexación actual:** 1 URL. Potencial con blog: +4 URLs (listado + 3 artículos).
- **Tráfico orgánico potencial:** Bajo actualmente. Con blog técnico en español sobre homelab/automatización/IA, el mercado hispanohablante tiene alta demanda no cubierta.