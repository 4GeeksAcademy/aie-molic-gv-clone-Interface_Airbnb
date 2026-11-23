# Stayfinder — Airbnb interface clone

Aplicación web de demostración para explorar alojamientos. Incluye una página principal, un catálogo y páginas de detalle con galería de fotos local, información del alojamiento y controles de reserva ilustrativos. No procesa reservas reales.

## Requisitos

- Node.js compatible con Next.js 16.
- npm.

## Ejecutar en desarrollo

Desde la raíz del repositorio, instala las dependencias (si aún no están instaladas) y arranca el servidor:

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Para exponer el servidor en todas las interfaces de red (por ejemplo, en un entorno remoto):

```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Detén el servidor con `Ctrl+C`.

## Otros comandos

```bash
npm run lint       # ESLint
npx tsc --noEmit   # Comprobación de tipos
npm run build      # Compilación de producción
npm run start      # Servir la compilación (después de npm run build)
```

## Rutas principales

- `/` — página principal.
- `/catalog` — catálogo de alojamientos.
- `/rooms/[id]` — detalle de un alojamiento; por ejemplo, `/rooms/1` (los IDs válidos están en `data/accommodations.ts`).

## Imágenes y atribuciones

Las imágenes de los alojamientos se sirven desde `public/images/accommodations/`. Cada alojamiento conserva su portada original y utiliza tres fotos adicionales. Las fuentes, autores y licencias de las fotos adicionales están documentados en [`public/images/accommodations/ATTRIBUTION.md`](public/images/accommodations/ATTRIBUTION.md).

## Tecnologías

Next.js 16 (App Router), React 19, TypeScript y Tailwind CSS 4.