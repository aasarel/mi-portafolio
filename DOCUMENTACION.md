# Documentación Técnica — Portafolio Abraham Asarel

> Versión: 2.1 · Fecha: 2026-06-16 · Stack: Astro 6 + Tailwind CSS 4 + TypeScript

---

## Índice

1. [Visión general del proyecto](#1-visión-general-del-proyecto)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Estructura de archivos](#3-estructura-de-archivos)
4. [Sistema de diseño (Design Tokens)](#4-sistema-de-diseño-design-tokens)
5. [Relaciones entre archivos](#5-relaciones-entre-archivos)
6. [Detalle por archivo](#6-detalle-por-archivo)
   - [Configuración](#61-configuración)
   - [Estilos globales](#62-estilos-globales)
   - [Layouts](#63-layouts)
   - [Páginas](#64-páginas)
   - [Componentes](#65-componentes)
7. [Lógica interactiva (Scripts)](#7-lógica-interactiva-scripts)
8. [Dark Mode](#8-dark-mode)
9. [Optimización de imágenes](#9-optimización-de-imágenes)
10. [Decisiones técnicas clave](#10-decisiones-técnicas-clave)

---

## 1. Visión general del proyecto

Portafolio profesional de Abraham Asarel, UX & Product Designer. El sitio expone casos de estudio detallados con narrativa editorial profunda, enfocado en demostrar proceso de pensamiento y no sólo resultados visuales.

**Principios de diseño del código:**
- Tokens de diseño únicos como fuente de verdad (CSS custom properties en `global.css`)
- Componentes Astro reutilizables, cada uno con una responsabilidad clara
- Dark mode sin JavaScript adicional — el cambio de clase `.dark` en `<html>` activa el tema
- Imágenes optimizadas por Astro (`<Image />`) con generación automática de WebP y `srcset`
- Accesibilidad: roles ARIA, navegación por teclado, focus visible en todos los controles

---

## 2. Stack tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| Astro | 6.4.2 | Framework SSG/SSR, componentes, routing |
| Tailwind CSS | 4.3.0 | Sistema de utilidades CSS |
| @tailwindcss/vite | — | Plugin Vite para Tailwind CSS v4 |
| TypeScript | strict | Tipado estático en componentes y scripts |
| PhotoSwipe | 5.4.4 | Lightbox de galería de imágenes |
| Node.js | ≥ 22.12.0 | Entorno de desarrollo y build |

**Diferencia clave con Tailwind CSS v3:** En la v4, Tailwind no se configura en `tailwind.config.js` sino como plugin de Vite. Los tokens se definen directamente en CSS usando la directiva `@theme inline` dentro de `global.css`.

---

## 3. Estructura de archivos

```
mi-portafolio/
├── astro.config.mjs          # Configuración de Astro + Tailwind CSS v4
├── tsconfig.json             # TypeScript en modo strict
├── package.json              # Dependencias y scripts
│
├── public/
│   ├── fonts/
│   │   └── xanas-wedding.otf # Fuente caligráfica local (firma)
│   ├── favicon.svg
│   └── favicon.ico
│
└── src/
    ├── env.d.ts              # Tipos de entorno Astro
    ├── styles/
    │   └── global.css        # Design tokens + Tailwind + dark mode
    │
    ├── assets/
    │   ├── logos/
    │   │   ├── owl.svg       # Logo búho (SVG inline con currentColor)
    │   │   └── me.webp       # Foto de perfil (optimizada por Astro)
    │   └── projects/
    │       └── moses/
    │           ├── slider-antes.webp   # Vista original SCADA
    │           ├── slider-despues.webp # Vista rediseñada SCADA
    │           └── slider-detalle.webp # Detalle UI SCADA
    │
    ├── layouts/
    │   ├── Layout.astro          # Envoltorio HTML maestro (todas las páginas)
    │   ├── ProjectLayout.astro   # Layout para páginas de caso de estudio
    │   └── ConstruccionLayout.astro # Placeholder para secciones no completadas
    │
    ├── components/
    │   ├── Header.astro          # Barra de navegación global + tema toggle
    │   ├── ProjectRow.astro      # Tarjeta de proyecto con carrusel
    │   ├── ProjectSection.astro  # Envoltorio de sección del caso de estudio
    │   ├── ProjectFooter.astro   # Pie de página con CTA y nav entre proyectos
    │   ├── EditorialBody.astro   # Sistema tipográfico para el carril de lectura
    │   ├── ImageGrid.astro       # Grilla de imágenes con lightbox PhotoSwipe
    │   ├── ImageSlider.astro     # Comparador antes/después (clip-path)
    │   ├── ReadingProgress.astro # Navegación lateral de secciones (desktop + mobile)
    │   ├── MetricCard.astro      # Tarjeta métrica expandible con modal
    │   └── HighlightBlock.astro  # Bloque de alerta/insight con borde de acento
    │
    └── pages/
        ├── index.astro           # Página de inicio (hero + portafolio)
        ├── moses-scada.astro     # Caso de estudio: MOSES-SCADA
        ├── sobre-mi.astro        # Biografía + fotografía + CTAs (Currículum, LinkedIn)
        ├── cv.astro              # Currículum Vitae — experiencia, habilidades, certificaciones
        ├── arte-visual.astro     # Placeholder — Arte Visual
        ├── servicios.astro       # Placeholder — Servicios
        ├── contacto.astro        # Placeholder — Contacto
        └── payrol.astro          # Placeholder — Proyecto PAYROL
```

---

## 4. Sistema de diseño (Design Tokens)

**Archivo:** `src/styles/global.css`

El sistema de diseño se basa en tres capas:

### Capa 1: Variables CSS primitivas (`:root`)

Definen los valores reales para el tema claro (light mode por defecto):

```css
:root {
  --color-bg-primary:     #FFFFFF;  /* Fondo principal */
  --color-text-primary:   #121214;  /* Texto principal */
  --color-text-accent:    #B88A52;  /* Acento ámbar dorado */
  --color-accent-forest:  #5E6B5C;  /* Acento verde bosque (ícono búho) */
  ...
}
```

### Capa 2: Variables CSS para dark mode (`.dark`)

La clase `.dark` en `<html>` sobreescribe las variables de `:root`:

```css
.dark {
  --color-bg-primary:    #0B0B0C;
  --color-text-primary:  #F5F5F7;
  --color-text-accent:   #C89A61;  /* Ámbar más cálido en oscuro */
  --color-accent-forest: #6F8570;  /* Verde más brillante en oscuro */
  ...
}
```

### Capa 3: `@theme inline` de Tailwind v4

Mapea las CSS vars al sistema de utilidades de Tailwind. Con `inline`, Tailwind genera clases que leen en tiempo real el valor de la variable, por lo que el dark mode funciona sin regenerar CSS:

```css
@theme inline {
  --color-text-accent: var(--color-text-accent);
  /* → genera clase: text-text-accent que aplica color: var(--color-text-accent) */
}
```

### Tipografías registradas

| Token | Fuente | Uso |
|---|---|---|
| `--font-display` | Hanken Grotesk | Títulos, headings |
| `--font-sans` | Inter | Cuerpo de texto, copy |
| `--font-mono` | IBM Plex Mono | Labels, tags, código |
| `--font-signature` | Xanas Wedding | Firma caligráfica en hero |

### Fuente local

`Xanas Wedding` se carga desde `/public/fonts/xanas-wedding.otf` via `@font-face` en `global.css`. No proviene de Google Fonts porque es una fuente propietaria de la identidad del diseñador.

---

## 5. Relaciones entre archivos

### Árbol de dependencias

```
Layout.astro ← base de todo
├── Header.astro
│   └── (script): gestión de tema dark/light + menú móvil
│
├── ProjectLayout.astro ← extiende Layout
│   └── (usado por): moses-scada.astro
│
├── ConstruccionLayout.astro ← extiende Layout
│   └── (usado por): arte-visual, servicios, contacto, payrol
│
├── index.astro ← usa Layout directamente
│   └── ProjectRow.astro
│       └── (script): carrusel autoejecutable por instancia
│
├── sobre-mi.astro ← usa Layout directamente
│   └── owl.svg (?raw) como divisor central + marca de agua de fondo
│
└── cv.astro ← usa Layout directamente
    └── owl.svg (?raw) como marca de agua de fondo

moses-scada.astro ← usa ProjectLayout
├── ReadingProgress.astro
├── ImageSlider.astro
├── ProjectSection.astro
│   └── (slot recibe): EditorialBody.astro, HighlightBlock.astro, MetricCard.astro
├── ImageGrid.astro
│   └── (script): PhotoSwipe lightbox
└── ProjectFooter.astro
```

### Flujo de datos (props)

```
index.astro
  → array `projects` (title, description, link, platform, images[])
  → <ProjectRow title={} images={} .../>
      → imágenes como ImageMetadata → <Image src={} />
      → link → href del enlace al caso de estudio

moses-scada.astro
  → <ProjectLayout title subtitle role duration company>
      → renderiza header del caso con metadatos
  → <ReadingProgress steps={[{id, label}...]} />
      → script observa secciones por id para activar el ítem del nav
  → <ProjectSection id="inicio" title="...">
      → <EditorialBody> → slot con HTML editorial (p, ul, strong)
      → <HighlightBlock type="alert" tag="..." title="..."> → slot
      → <MetricCard label="..." description="..." tag="..." />
  → <ImageGrid images={[{src: ImageMetadata, alt: string}...]} />
  → <ProjectFooter heading ctaLabel nextProject prevProject />
```

### Flujo de assets de imagen

```
slider-antes.webp (src/assets/projects/moses/)
  ↓ import sliderAntes from '...' (ImageMetadata)
  ↓ pasado a ProjectRow images={[sliderAntes, sliderDetalle]}
  ↓ ProjectRow: <Image src={imgSrc} width={1060} height={632} />
  ↓ Astro genera: /assets/slider-antes-[hash]-1060w.webp (srcset)
  ↓ Navegador descarga la versión óptima para el viewport
```

---

## 6. Detalle por archivo

---

### 6.1 Configuración

---

#### `astro.config.mjs`

**Propósito:** Punto de entrada de la configuración de Astro.

```js
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]  // Tailwind CSS v4 requiere plugin Vite, no PostCSS
  }
});
```

**Por qué plugin Vite y no PostCSS:** Tailwind CSS v4 cambió su arquitectura interna. En v3 se usaba `postcss.config.js`. En v4, el procesado se integra como transformador Vite, lo que permite la directiva `@import "tailwindcss"` directamente en CSS sin pasos intermedios.

---

#### `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src"],
  "exclude": ["dist"]
}
```

Usa el preset `strict` de Astro que habilita: `strict`, `strictNullChecks`, `noImplicitAny`. El archivo `.astro/types.d.ts` lo genera Astro automáticamente con los tipos de `import.meta.env` y directivas especiales.

---

#### `src/env.d.ts`

```ts
/// <reference types="astro/client" />
```

Registra los tipos globales del cliente de Astro (import.meta.env, directivas Astro, etc.) para que TypeScript los reconozca en los archivos `.astro`.

---

### 6.2 Estilos globales

---

#### `src/styles/global.css`

**Secciones:**

| Líneas | Contenido |
|---|---|
| 1 | `@import "tailwindcss"` — activa el motor de Tailwind CSS v4 |
| 3–20 | `@font-face` — registra la fuente Xanas Wedding desde `/public/fonts/` |
| 27–53 | `:root` — variables CSS para light mode (fondos, textos, acentos, interacciones) |
| 59–85 | `.dark` — sobreescribe las variables para dark mode |
| 92–140 | `@theme inline` — mapea vars CSS → clases Tailwind (ej: `text-text-accent`) |
| 142–163 | `.carril-lectura` — clase utilitaria para el carril de lectura de 800px |

**Categorías de tokens:**

- `--color-bg-*` → fondos (primary, secondary, tertiary, inverse)
- `--color-text-*` → textos (primary, secondary, tertiary, inverse, accent, link)
- `--color-accent-*` → acentuaciones temáticas (forest, amber, aurora, burgundy)
- `--color-interaction-*` → estados de interacción (link, link-hover, focus-ring, selection)
- `--font-*` → tipografías del sistema
- `--spacing-*` → escala de espaciados (4px a 128px)

**`.carril-lectura`:** Clase CSS utilitaria (no Tailwind) que establece el ancho máximo de lectura a 800px. Se centra automáticamente en pantallas ≥ 768px. Usada por `ProjectSection.astro` y `EditorialBody.astro` para mantener columnas de texto legibles en pantallas anchas.

---

### 6.3 Layouts

---

#### `src/layouts/Layout.astro`

**Propósito:** HTML maestro. Todas las páginas pasan por este layout.

**Secciones:**

| Línea | Elemento | Descripción |
|---|---|---|
| 3 | `import global.css` | Inyecta todos los tokens y utilidades CSS |
| 4 | `import Header` | Incluye la barra de navegación en todas las rutas |
| 5 | `title` prop | Se usa en `<title>` de cada página |
| 9 | `<html lang="es">` | Idioma declarado; la clase `.dark` se añade aquí por Header.astro |
| 14–16 | Google Fonts | Hanken Grotesk + IBM Plex Mono + Inter con `display=swap` |
| 18 | `<body>` | `transition-colors duration-200` suaviza el cambio de tema |
| 20 | `<Header />` | Presente en absolutamente todas las páginas |
| 22–24 | `<main><slot /></main>` | Punto de inyección del contenido de cada página |

**Flujo de tema dark:**
1. `Header.astro` lee `localStorage.theme` al cargar
2. Si es `"dark"`, añade clase `.dark` a `<html>`
3. Tailwind detecta `.dark` y aplica las variables de ese bloque en `global.css`
4. Sin recarga, sin flash — la transición de `transition-colors` lo suaviza

---

#### `src/layouts/ProjectLayout.astro`

**Propósito:** Layout especializado para páginas de caso de estudio. Extiende `Layout.astro` añadiendo un header editorial con título, subtítulo y metadatos del proyecto.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `title` | string | Título de impacto del caso (ej: "MOSES - SCADA: Rediseño visual...") |
| `subtitle` | string | Subtítulo editorial de control de lectura |
| `role` | string | Rol del diseñador en el proyecto |
| `duration` | string | Duración del proyecto |
| `company` | string | Empresa o cliente |

**Anatomía del header (líneas 34–93):**

```
<header>
  ├── Título: relative container
  │   ├── Botón "Volver" → /#portafolio
  │   │     md:absolute — sale del flujo en desktop para no descentrar el título
  │   ├── <h1> título centrado
  │   └── <p> subtítulo con [text-wrap:balance]
  └── Fila de metadatos (Rol · Duración · Empresa)
        mobile: cada ítem en fila horizontal con border-b separador
        desktop: alineados en fila, gap fijo de 102px
```

**`scroll-mt-96` en `<main id="inicio">`:** El componente `ReadingProgress` usa el id `"inicio"` como ancora de vuelta al tope. El `scroll-mt-96` añade margen superior al scroll para que el header fijo no tape el contenido al anclar.

**`[text-wrap:balance]` en el subtítulo:** Propiedad CSS moderna que distribuye el texto en líneas visualmente equilibradas, evitando líneas solitarias muy cortas al final del párrafo.

---

#### `src/layouts/ConstruccionLayout.astro`

**Propósito:** Página placeholder para secciones no desarrolladas.

**Props:**

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `section` | string? | — | Nombre de la sección |
| `code` | string? | `"200 OK"` | Código HTTP mostrado como micro-label |

**Estructura visual:**
- Ícono búho 🦉 con opacidad `0.07` — decorativo, `aria-hidden="true"`
- Label con `code` en tipografía mono uppercase
- H1 "Página en construcción"
- Copy con nombre de `section`
- Dos enlaces: Inicio (`/`) y Ver proyectos (`/#portafolio`)

**Uso del código HTTP:** Convención interna del sitio. `200 OK` = página existe pero está vacía. `202 Accepted` = trabajo en progreso aceptado (ej: `payrol.astro`).

---

### 6.4 Páginas

---

#### `src/pages/index.astro`

**Propósito:** Página de inicio. Contiene el hero y la sección portafolio.

**Secciones del frontmatter:**

```
imports:
  - Layout, ProjectRow, Image (astro:assets)
  - owlLogoRaw ← owl.svg?raw (SVG como string para set:html)
  - me ← me.webp (ImageMetadata para <Image />)
  - sliderDespues, sliderDetalle ← ImageMetadata de assets MOSES

array `projects`:
  - Cada objeto: { title, platform, description, link, images[], activeIndex }
  - images[] acepta ImageMetadata (WebP optimizado) o string (URL externa placeholder)
```

**Secciones HTML:**

| Sección | Grid | Elementos |
|---|---|---|
| Hero | 12 cols md+ | H1 (col 2–12), copy+firma (col 2–7), búho divisor (col 8), foto (col 9–11), CTA (full) |
| Portafolio | full width | Encabezado h2 + párrafo + lista de ProjectRow |

**SVG inline (búho divisor):**
```astro
import owlLogoRaw from '../assets/logos/owl.svg?raw';
...
<div class="owl-divider text-accent-forest" set:html={owlLogoRaw} />
```

El `?raw` hace que Vite importe el SVG como string HTML. `set:html` lo inyecta en el DOM. Esto permite que `fill: currentColor` en el SVG herede `color: var(--color-accent-forest)` del wrapper. Con `<img src="owl.svg">` esto sería imposible porque los SVG externos no reciben la propiedad CSS `color` de la página.

**`:global(svg)` en el bloque `<style>`:**
El scope de Astro añade atributos `data-astro-cid` a los elementos del template. `set:html` inyecta HTML sin esos atributos, por lo que `.owl-divider svg {}` no matchearía. `:global(svg)` omite el scoping y aplica el selector directamente.

**Array de proyectos:** Los datos de todos los proyectos de la portada viven aquí como constante. Para añadir un nuevo proyecto, basta con agregar una entrada al array `projects`.

---

#### `src/pages/moses-scada.astro`

**Propósito:** Caso de estudio completo del rediseño de MOSES-SCADA (sistema SCADA ferroviario).

**Estructura narrativa (8 secciones):**

| ID | Sección | Contenido |
|---|---|---|
| `inicio` | Inicio | ImageSlider antes/después + contexto metodológico |
| `contexto` | Contexto y Diagnóstico | Descripción del sistema heredado y sus problemas |
| `restricciones` | Restricciones del Entorno | Limitaciones técnicas y normativas |
| `auditoria` | Auditoría Normativa | Análisis ISA-101 + identificación de brechas |
| `arquitectura` | Arquitectura Visual | Sistema modular de colores y jerarquías |
| `decisiones` | Decisiones de Diseño | Justificación de cada decisión con métricas |
| `impacto` | Impacto y Métricas | Resultados cuantificables en tarjetas MetricCard |
| `escalabilidad` | Escalabilidad | Plan de extensión del sistema |

**Componentes usados:**
- `ReadingProgress` — recibe el array de `steps` con los 8 IDs y labels
- `ImageSlider` — comparador antes/después con las webp reales
- `ProjectSection` — cada sección del caso (id + título + slot)
- `EditorialBody` — prosa editorial dentro de cada ProjectSection
- `HighlightBlock` — alertas y restricciones resaltadas
- `MetricCard` — métricas de impacto expandibles
- `ImageGrid` — galería fotográfica con PhotoSwipe

**Cómo funciona la navegación de lectura:**
El `id` de cada `<ProjectSection>` coincide exactamente con el `id` en el array de `steps` que se pasa a `<ReadingProgress>`. El script de ReadingProgress usa `IntersectionObserver` para detectar cuál sección está visible y activa el ítem correspondiente del nav.

---

#### `src/pages/arte-visual.astro`, `servicios.astro`, `contacto.astro`, `payrol.astro`

Páginas placeholder de una sola línea de markup. Usan `ConstruccionLayout` con su nombre de sección como prop. No contienen lógica ni componentes adicionales. Cuando se desarrollen, el archivo será reemplazado con contenido real.

---

#### `src/pages/sobre-mi.astro`

**Propósito:** Página biográfica. Grid de 12 columnas: texto editorial (8 párrafos) en col 2–7, divisor con búho en col 8, fotografía en col 9–11. Footer con dos CTAs: "Ver Currículum Vitae" (`/cv`) y "LinkedIn" (externo).

**Notas:**
- Usa `Layout.astro` directamente — ya tiene contenido real, no `ConstruccionLayout`.
- El búho de fondo (`.owl-watermark`) y el divisor central reutilizan el patrón `?raw` + `set:html` de `index.astro`.

---

#### `src/pages/cv.astro`

**Propósito:** Currículum Vitae completo. Encabezado con datos de contacto, resumen profesional, timeline de 5 puestos (Grupo Sener México + BSD Servicios ×4), habilidades, dominio de herramientas, certificaciones, cursos y CTA de descarga.

**Estructura:**

| Sección | Contenido |
|---|---|
| Encabezado | Nombre, rol, ubicación, email, LinkedIn, sitio (`aasarel.art`) |
| Resumen | 2 párrafos de posicionamiento profesional |
| Experiencia profesional | Timeline vertical (línea + punto `accent-amber`); cada puesto trae período, ubicación, intro opcional, grid `Logros` / `Responsabilidades` y tags de herramientas |
| Habilidades / Herramientas | Grid de 2 columnas |
| Certificaciones / Cursos | Grid de 2 columnas |
| CTA final | "Descargar CV" → `/cv.pdf` |

**Pendiente:** el botón "Descargar CV" enlaza a `/cv.pdf`, que todavía no existe en `/public`. Falta colocar ahí el PDF exportado con este mismo contenido para que la descarga funcione en producción.

**Timeline:** la línea vertical es un `<div>` absoluto (`left-[5px]`), no un pseudo-elemento — más simple de alinear con el punto de cada puesto. Cada punto usa `ring-4 ring-bg-primary` para "cortar" visualmente la línea donde pasa el marcador.

**`.cv-list` (estilo local en `<style>`):** viñeta de 4px en `--color-text-accent`, mismo tratamiento que las listas de `EditorialBody.astro`. Se declara localmente (no se reutiliza `EditorialBody`) porque esta página no vive dentro del carril `.prose-asarel`.

---

### 6.5 Componentes

---

#### `src/components/Header.astro`

**Propósito:** Barra de navegación global fija. Gestiona: logo, menú desktop, menú móvil, toggle de tema dark/light.

**Secciones del markup:**

| Elemento | Descripción |
|---|---|
| Logo | SVG búho + texto "Abraham Asarel" — enlaza a `/` |
| Nav desktop | Links: Arte Visual, MOSES-SCADA, Servicios, Sobre mí, Contacto |
| Toggle tema | Botón sol/luna con estados SVG condicionales |
| Hamburguesa | Botón de 3 líneas para menú móvil |
| Drawer móvil | `<nav>` con `role="dialog"` + backdrop + links + toggle tema |

**Script (≈130 líneas):**

```
initTheme():
  1. Lee localStorage.theme
  2. Si no existe, lee prefers-color-scheme del sistema
  3. Aplica clase .dark o .light a <html>
  4. Actualiza ícono del toggle

toggleTheme():
  1. Cambia la clase .dark en <html>
  2. Persiste en localStorage
  3. Actualiza íconos

openMenu() / closeMenu():
  1. Anima las 3 líneas del hamburger → X (CSS transform)
  2. Muestra/oculta el drawer con translate-x
  3. Gestiona overflow del body
  4. Maneja focus trap (Escape para cerrar)

IntersectionObserver en <div id="header-sentinel">:
  - Elemento de 1px al tope de la página
  - Cuando deja de ser visible → header gana sombra
  - Evita el scroll listener para mejor performance
```

**Active route:** El script compara `window.location.pathname` con el `href` de cada nav-link y añade clase `text-text-accent` al link activo.

---

#### `src/components/ProjectRow.astro`

**Propósito:** Tarjeta de proyecto para la portada. Contiene un carrusel de imágenes con autoplay y múltiples formas de navegación.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `id` | string | ID del contenedor (para identificar la instancia del carrusel) |
| `title` | string | Título del proyecto |
| `description` | string | Descripción corta |
| `link` | string | URL del caso de estudio |
| `platform` | string | Plataforma / herramienta (ej: "SIMATIC WinCC 8.1") |
| `images` | `Array<ImageMetadata \| string>` | Imágenes del carrusel |

**Anatomía del markup:**

```
.project-row-container
  ├── Carrusel (.carousel-viewport)
  │   ├── Texto fantasma decorativo (z-0, opacidad 0.03)
  │   ├── Imágenes apiladas (z-10, absolute, opacity transición)
  │   ├── Botones de flecha (z-20, visible on hover)
  │   └── Indicador "Pausado" (z-20, visible cuando isPaused)
  ├── Indicadores de barra (uno por imagen, flex-grow)
  └── Área de texto (grid 12 cols)
      ├── Título + plataforma (5 cols)
      └── Descripción + enlace (7 cols)
```

**Script del carrusel:**

Cada `.project-row-container` en el DOM genera una instancia independiente del carrusel con su propio estado (`currentIndex`, `isPaused`, `intervalId`).

| Interacción | Comportamiento |
|---|---|
| Autoplay | `setInterval(4000ms)` → `goToIndex(currentIndex + 1)` |
| Hover sobre viewport | `stopAutoplay()` / `startAutoplay()` |
| Clic en viewport | `togglePause()` — alterna autoplay y muestra badge "Pausado" |
| Botones ← → | `goToIndex(currentIndex ± 1)` |
| Indicadores de barra | `goToIndex(indexDelIndicador)` |
| Teclado ← → | Activo si el carrusel está enfocado O centrado en el viewport |
| Scroll horizontal (wheel) | `deltaX > 30` → navega; throttled 600ms para evitar saltos |
| Swipe táctil | `touchStartX` / `touchEndX`, umbral 50px |

**`goToIndex(n)`:** Aplica `opacity-100 scale-100` a la imagen activa y `opacity-0 scale-[0.98]` a las demás. El `scale-[0.98]` crea una micro-animación de entrada que da sensación de profundidad.

**Accesibilidad:** `role="region" aria-roledescription="carousel"`. Focus visible con `data-keyboard-focus=true` que activa un ring visible. `aria-current` en indicadores se actualiza dinámicamente.

---

#### `src/components/ImageSlider.astro`

**Propósito:** Comparador antes/después de imágenes usando `clip-path` y un `<input type="range">`.

**Props:**

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `beforeImage` | string | — | URL de la imagen "antes" |
| `afterImage` | string | — | URL de la imagen "después" |
| `beforeLabel` | string | `"Antes"` | Etiqueta superpuesta |
| `afterLabel` | string | `"Después"` | Etiqueta superpuesta |

**Técnica de clip-path:**

```
Capa 0 (z-0): imagen "antes" visible completa
Capa 10 (z-10): div con clip-path que revela la imagen "después"
  clip-path: inset(0 0 0 50%) → recorta desde la izquierda al 50%
  Cuando el slider se mueve al 30% → clip-path: inset(0 0 0 30%)
Capa 30 (z-30): <input type="range"> opacidad 0 — invisible pero captura interacción
```

El `<input>` invisible con `cursor: ew-resize` ocupa todo el contenedor y captura el arrastre del usuario. En cada evento `input`, el script actualiza `clip-path` y `left` del divisor.

**`contrast-110` en imagen "antes":** Las capturas originales del SCADA tendían a verse lavadas. El contraste aumentado en la imagen "antes" hace más evidente el deterioro visual del sistema heredado.

---

#### `src/components/ReadingProgress.astro`

**Propósito:** Navegación de secciones del caso de estudio. Versión desktop: sidebar derecho fijo con puntos y labels. Versión móvil: botón flotante que abre un drawer inferior.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `steps` | `Array<{id: string, label: string}>` | Secciones del caso |

**Desktop nav (`lg:flex`):**
- Inicialmente invisible (sin fondo, sin borde)
- Al hover sobre el grupo (`group-hover/nav`): aparece el fondo con `backdrop-blur`
- Cada ítem: número mono + dash + label
- Al hover sobre un ítem individual (`group-hover/item`): el dash se extiende y el número se colorea

**Mobile trigger (`lg:hidden`):**
- Botón circular flotante en `bottom-6 right-6`
- Ícono de lista con flecha (SVG inline)

**Mobile sheet:**
- `position: fixed inset-0` — cubre toda la pantalla
- Panel desliza desde abajo (`translate-y-full` → `translate-y-0`)
- Lista de secciones con `IntersectionObserver` para estado activo
- Se cierra: clic en backdrop, botón "Cerrar", o clic en un link

**`IntersectionObserver`:**
```js
{ root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 }
```
- `rootMargin: '-20% 0px -60%'`: La sección se considera "activa" cuando su parte superior entra en el 20% superior del viewport y su parte inferior no ha pasado el 40% inferior. Esto activa la sección que el usuario realmente está leyendo, no la siguiente.
- Fallback de scroll: si `scrollY < 80`, fuerza activo `"inicio"`.

---

#### `src/components/ProjectSection.astro`

**Propósito:** Envoltorio semántico para cada sección del caso de estudio.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `id` | string | ID de anclaje (debe coincidir con `steps[].id` en ReadingProgress) |
| `title` | string | Título visible de la sección |

**`scroll-mt-20`:** Margen superior al hacer scroll con enlace de ancla. Compensa el header fijo de `4rem` de alto.

**`carril-lectura`:** Clase de `global.css` que limita el contenido a 800px centrado. Mantiene la legibilidad en pantallas anchas.

---

#### `src/components/EditorialBody.astro`

**Propósito:** Sistema tipográfico para el carril de lectura. Aplica estilos a todas las etiquetas HTML semánticas dentro de `.prose-asarel` sin necesitar clases adicionales en cada elemento.

**Por qué `is:global` en el `<style>`:**
Los estilos de `EditorialBody` deben aplicarse al HTML que se escribe directamente dentro del slot (en `moses-scada.astro`). Los estilos scoped de Astro sólo aplican a elementos generados por el componente, no al contenido del slot. `is:global` hace que los selectores `.prose-asarel p`, `.prose-asarel ul`, etc., sean globales y afecten al contenido inyectado.

**Elementos estilizados:**

| Selector | Tipografía | Notas |
|---|---|---|
| `p` | Inter 16px/26px | `color-mix` para 75% de opacidad sin rgba |
| `h2` | Hanken Grotesk 24px bold | `margin-top: 48px` separa de la sección anterior |
| `h3` | Inter 18px semibold | Subtítulos de bloque |
| `h4` | Inter 15px uppercase | Micro-títulos indexadores |
| `strong` | — | Color primario full, weight 600 |
| `a` | — | Borde inferior semi-transparente |
| `ul` | — | Viñeta naranja (pseudo `::before` 4px) |
| `ol` | — | Números mono `01.` vía `counter-reset` CSS |
| `table` | — | Headers mono, filas cebra 1.5% de opacidad |
| `blockquote` | Hanken Grotesk italic 18px | Borde izquierdo semi-transparente |

**`.split-list`:** Clase opcional para listas largas (>8 ítems) que activa `column-count: 2` en pantallas ≥ 640px.

---

#### `src/components/ImageGrid.astro`

**Propósito:** Grilla responsive de imágenes para galerías de casos de estudio. Soporta 2, 4, 6 u 8 imágenes con layouts distintos. Integra PhotoSwipe para lightbox nativo.

**Props:**

```ts
interface ImageItem {
  src: ImageMetadata;
  alt: string;
}
interface Props {
  images: ImageItem[];
}
```

**Layouts por cantidad:**

| Total | Grid | Notas |
|---|---|---|
| 2 | `grid-cols-1 md:grid-cols-2` | Layout estándar side-by-side |
| 4 | `sm:grid-cols-2`, `max-w-[1200px]` | Cuadrícula 2×2 |
| 6 | Full-width, `md:grid-cols-3` | Modo cinemático — rompe el contenedor con `w-screen left-1/2 -ml-[50vw]` |
| 8 | Full-width, `lg:grid-cols-4` | Modo cinemático en 4 columnas |

**Break-out de contenedor (modo cinemático):**
La técnica `w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]` hace que el elemento ocupe el 100% del viewport aunque esté dentro de un contenedor con `max-width`. Es el equivalente CSS de "salir del grid".

**PhotoSwipe:**
- `getImage()` de `astro:assets` genera la URL full-res para el `href` del enlace
- Cada `<a>` tiene `data-pswp-width` y `data-pswp-height` que PhotoSwipe usa para calcular proporciones antes de cargar la imagen
- El script inicializa con `gallery: '#project-gallery'` y `children: 'a'`
- Se inicializa en `DOMContentLoaded` Y `astro:page-load` para soportar View Transitions de Astro

---

#### `src/components/MetricCard.astro`

**Propósito:** Tarjeta de métrica que al hacer clic abre un modal con el detalle expandido.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `label` | string | Métrica principal (ej: "−42% de alarmas") |
| `description` | string? | Explicación detallada que aparece en el modal |
| `tag` | string? | Micro-categoría en mono uppercase |

**Anatomía del modal:**

```
.metric-modal (fixed, inset-0, z-100)
  ├── .metric-backdrop (absolute, inset-0, bg-black/40 blur)
  └── .metric-panel (centrado, max-w-480px)
      ├── Botón cerrar (×)
      ├── Tag (opcional)
      ├── H3 con el label
      └── Párrafo con description
```

**Estado inicial:** `.metric-modal` tiene clase `pointer-events-none` → invisible y no interactivo. `open()` la remueve; `close()` la vuelve a añadir con un delay de 300ms (para que la animación de salida termine antes de ocultar).

**`body.overflow = 'hidden'` durante apertura:** Bloquea el scroll del documento de fondo mientras el modal está abierto. Se restaura al cerrar.

---

#### `src/components/ProjectFooter.astro`

**Propósito:** Pie de página del caso de estudio con CTA de contacto y navegación entre proyectos.

**Props:**

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `heading` | string | `"¿Tienes un proyecto similar?"` | Título del CTA |
| `ctaLabel` | string | `"Hablemos de tu Proyecto"` | Texto del botón |
| `ctaHref` | string | `"/#contacto"` | Destino del botón |
| `prevProject` | `{label, href}?` | — | Proyecto anterior (opcional) |
| `nextProject` | `{label, href}?` | — | Proyecto siguiente (opcional) |

**Lógica del layout de navegación:**
Si sólo existe `nextProject` (primer proyecto del portafolio), el lado izquierdo renderiza un `<div />` vacío para mantener el `justify-between` correcto sin un enlace flotando a la derecha.

---

#### `src/components/HighlightBlock.astro`

**Propósito:** Bloque de texto destacado con borde izquierdo de acento. Dos variantes: `alert` (ámbar para restricciones/dolores) y `neutral` (gris para insights).

**Props:**

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `type` | `'neutral' \| 'alert'` | `'neutral'` | Variante visual |
| `tag` | string? | — | Micro-indexador superior en mono |
| `title` | string | — | Título descriptivo |

**`is:global` en el `<style>`:**
El selector `.highlight-content-box p` necesita `is:global` porque el `<slot />` puede recibir párrafos renderizados desde el contexto del padre (`moses-scada.astro`), y el scope de Astro no los habría marcado con el `data-astro-cid` de este componente.

---

## 7. Lógica interactiva (Scripts)

### Patrón de inicialización en Astro

Todos los scripts de los componentes siguen este patrón:

```js
function initX() { /* lógica */ }
document.addEventListener('astro:page-load', initX);
initX(); // ejecución inmediata para primera carga sin View Transitions
```

**Por qué `astro:page-load`:** Si Astro activa View Transitions (navegación sin recarga completa), los scripts inline no se re-ejecutan. El evento `astro:page-load` se dispara tanto en la primera carga como después de cada transición, garantizando que los componentes interactivos se re-inicialicen.

### IntersectionObserver vs. scroll listener

`ReadingProgress` usa `IntersectionObserver` en lugar de `window.addEventListener('scroll', ...)`.

**Ventajas:**
- Ejecutado en un hilo separado (no bloquea el hilo principal)
- Activado sólo cuando los elementos cruzan el viewport (no en cada pixel de scroll)
- API declarativa: define qué observar y cuándo reaccionar

### Gestión de múltiples instancias (carrusel)

`ProjectRow.astro` puede tener múltiples instancias en la misma página (`index.astro` tiene 2 proyectos). El script usa:

```js
document.querySelectorAll('.project-row-container').forEach((row) => {
  // Cada row tiene su propio scope de variables (currentIndex, intervalId, etc.)
});
```

Cada instancia del carrusel opera de forma completamente independiente — pausa una no pausa la otra.

---

## 8. Dark Mode

### Implementación

El dark mode usa la estrategia "class" de Tailwind v4: la clase `.dark` en `<html>` activa las variables del bloque `.dark` en `global.css`.

### Persistencia

```js
// Orden de prioridad (Header.astro script):
1. localStorage.getItem('theme')  // preferencia guardada del usuario
2. window.matchMedia('(prefers-color-scheme: dark)').matches  // preferencia del sistema
3. Fallback: light mode
```

### Sin flash de contenido (FOUC)

El script de tema en `Header.astro` es un `<script>` regular (no diferido), lo que hace que se ejecute antes de que el navegador pinte la primera vez. Esto evita el flash blanco-a-negro en dark mode.

### Variables que cambian en dark mode

| Variable | Light | Dark |
|---|---|---|
| `--color-bg-primary` | `#FFFFFF` | `#0B0B0C` |
| `--color-text-primary` | `#121214` | `#F5F5F7` |
| `--color-text-accent` | `#B88A52` | `#C89A61` |
| `--color-accent-forest` | `#5E6B5C` | `#6F8570` |

---

## 9. Optimización de imágenes

### `<Image />` de `astro:assets`

Astro procesa las imágenes importadas como `ImageMetadata` en build time:
- Convierte a WebP si no lo son ya
- Genera múltiples tamaños para el atributo `srcset`
- Añade `loading="lazy"` y `decoding="async"` por defecto
- Incluye `width` y `height` para evitar Cumulative Layout Shift (CLS)

### Uso correcto

```astro
// CORRECTO: pasar ImageMetadata directamente
import sliderAntes from '../assets/projects/moses/slider-antes.webp';
images: [sliderAntes] // pasa el objeto ImageMetadata completo

// INCORRECTO: pasar .src (string ya procesado)
images: [sliderAntes.src] // ProjectRow no podría optimizar más
```

### `widths` y `sizes` en ImageGrid

```astro
<Image
  widths={[400, 800, 1200, 1920]}
  sizes="(max-width: 640px) calc(50vw - 32px), calc(33vw - 64px)"
/>
```

El navegador descarga sólo la variante que necesita según el viewport actual. En móvil descarga 400px; en desktop 1200px o 1920px.

### Fotos vs. Assets

| Asset | Técnica | Razón |
|---|---|---|
| `me.webp` (perfil) | `<Image />` con `widths=[280,560]` | Optimización responsiva |
| `slider-*.webp` (MOSES) | `<Image />` en ProjectRow | Carrusel con srcset |
| `owl.svg` (logo) | `?raw` + `set:html` | Necesita `currentColor` CSS |
| Fuente `xanas-wedding.otf` | `@font-face` en CSS | No es imagen — fuente local |

---

## 10. Decisiones técnicas clave

### ¿Por qué Astro y no Next.js o Remix?

Portafolio estático: no hay sesiones, no hay datos en tiempo real, no hay autenticación. Astro genera HTML en build time con cero JavaScript por defecto — sólo se incluye JS cuando un componente lo necesita explícitamente. Resultado: páginas que cargan en <100ms.

### ¿Por qué Tailwind CSS v4?

v4 elimina el archivo `tailwind.config.js` y los build steps de PostCSS. Los tokens se definen en CSS puro (`@theme inline`), lo que hace que el sistema de diseño viva en un sólo lugar (`global.css`) sin archivos de configuración extra. El dark mode con variables CSS es más limpio que con `darkMode: 'class'` de v3.

### ¿Por qué SVG inline para el búho?

`<img src="owl.svg">` carga el SVG como imagen externa — el navegador la renderiza en un contexto aislado donde las propiedades CSS del documento no aplican. Para que `fill: currentColor` funcione y el búho tome el color del token `--color-accent-forest` (que cambia en dark mode), el SVG debe estar en el DOM como nodos HTML. `import owl from './owl.svg?raw'` + `set:html={owl}` logra esto.

### ¿Por qué `object-contain` en el carrusel?

Las imágenes de MOSES-SCADA tienen proporciones variables. `object-cover` cortaría las interfaces lateralmente, ocultando elementos importantes de la UI documentada. `object-contain` muestra la imagen completa respetando su proporción, con posible letterbox (bandas) en los bordes — aceptable para capturas de pantalla de herramientas SCADA.

### ¿Por qué `color-mix` para opacidad en `EditorialBody`?

```css
color: color-mix(in srgb, var(--color-text-primary) 75%, transparent);
```

En Tailwind v4 con variables CSS hexadecimales, no se puede usar `rgba(var(--color-text-primary), 0.75)` porque la variable contiene un valor hex, no `r g b` separados. `color-mix` es la solución CSS nativa moderna que mezcla cualquier formato de color con `transparent`, produciendo efectivamente una opacidad del 75%.

---

*Documentación generada el 2026-06-09, actualizada el 2026-06-16 (página `cv.astro` + corrección de `sobre-mi.astro`). Actualizar cuando se añadan nuevas páginas, componentes o cambios en el sistema de diseño.*
