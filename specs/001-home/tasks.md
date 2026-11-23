# Tareas de implementación de Home

> **Estado:** planificación solamente. Las casillas permanecen sin marcar. No ejecutar hasta que el usuario indique iniciar la primera tarea.
>
> Archivos indicados como previstos; inspeccionar los existentes antes de editar y evitar sobrescrituras innecesarias. No modificar configuración, instalar dependencias ni implementar Catálogo/Detalle.

## Fase A — Inspección y preparación (P0)

### - [x] HOME-001 — Inspeccionar punto de partida
- **Trabajo:** revisar la implementación actual de Home, `ProductCard`, layout/estilos globales y scripts disponibles; proponer adaptación o reutilización sin tocar archivos todavía.
- **Archivos previstos:** solo lectura: `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `components/ProductCard.tsx` (no existe actualmente), `package.json`, `context.md`, esta spec y `plan.md`.
- **Dependencias:** ninguna.
- **Aceptación:** se conoce contenido y función actuales; se decide cómo evitar duplicar `ProductCard` y se identifican los comandos existentes.
- **Pruebas:** inspección de estructura; no requiere ejecutar build todavía.

## Fase B — Modelo y datos simulados (P0)

### - [x] HOME-002 — Definir tipos compartidos mínimos
- **Trabajo:** definir `Accommodation`, `Host`, `Amenity` y `Category` en TypeScript con campos alineados con `spec.md`.
- **Archivos previstos:** `types/accommodation.ts`, `types/category.ts` (Host/Amenity pueden estar en el módulo accommodation si se justifica).
- **Dependencias:** HOME-001.
- **Aceptación:** contratos compilan; campos de tarjeta, filtro, detalle y enlaces están tipados sin `any`.
- **Pruebas:** ejecutar typecheck existente o `tsc --noEmit` si es compatible.

### - [x] HOME-003 — Crear fuentes de datos Home
- **Trabajo:** preparar alojamientos y categorías simuladas tipadas, con ids únicos y categoryIds que correspondan a categorías existentes. Usar Todo, Alojamientos y Hoteles como categorías iniciales; Todo representa ausencia de filtro y las otras dos deben permitir demostrar filtrado. Usar contenido e imágenes placeholder propios y mantener campos compatibles con rutas futuras.
- **Archivos previstos:** `data/accommodations.ts`, `data/categories.ts`.
- **Dependencias:** HOME-002.
- **Aceptación:** arrays satisfacen los tipos, IDs no duplicados y relaciones válidas; Todo no se asigna a alojamientos. Hay registros de Alojamientos y Hoteles que permiten observar resultados diferenciados.
- **Pruebas:** typecheck si está disponible; verificar ids/relaciones y que cada filtro produce un conjunto visible identificable. Sin dependencias externas.

## Fase C — Presentación reutilizable (P0)

### - [x] HOME-004 — Crear indicador de carga
- **Trabajo:** implementar estado visible y semántico de carga como componente funcional `const` y con estilos Tailwind.
- **Archivos previstos:** `components/shared/LoadingIndicator.tsx` (o ubicación común acordada en HOME-001).
- **Dependencias:** HOME-001.
- **Aceptación:** renderiza etiqueta predeterminada u opcional, sin estilo inline ni estado innecesario.
- **Pruebas:** renderizado manual; lint y typecheck.

### - [x] HOME-005 — Crear identidad/logo propio
- **Trabajo:** crear componente/logo propio inspirado visualmente en patrones generales de la referencia, con SVG escrito para el proyecto o recurso local; no copiar el logo oficial, la marca ni activos Airbnb. Enlace opcional a Home con `Link`.
- **Archivos previstos:** `components/layout/Logo.tsx`, recurso bajo `public/` solo si se decide recurso local.
- **Dependencias:** HOME-001.
- **Aceptación:** recurso original/local con inspiración visual general, no reproducción del logo oficial; etiqueta accesible, enlace interno válido cuando aplique; sin biblioteca de iconos/UI.
- **Pruebas:** verificar render, href interno y lint.

### - [x] HOME-006 — Implementar tarjeta de alojamiento reutilizable
- **Trabajo:** adaptar o crear tarjeta con fotografía placeholder/local grande y redondeada, título, ubicación, precio/noche y valoración con estrella, con navegación al id. Incluir corazón decorativo no interactivo; distintivo de recomendación opcional. No añadir funcionalidades.
- **Archivos previstos:** `components/listings/AccommodationCard.tsx`; `components/ProductCard.tsx` únicamente si HOME-001 aprobó adaptación/migración.
- **Dependencias:** HOME-002, HOME-003, HOME-005 si se requiere identidad auxiliar.
- **Aceptación:** no duplica una tarjeta existente; datos tipados y `Link` a `/rooms/{id}`; alt útil; corazón sin acción ni estado y distintivo solo visual.
- **Pruebas:** comprobar en DOM los campos y href; lint/typecheck disponibles.

### - [x] HOME-007 — Implementar cuadrícula y estado vacío
- **Trabajo:** crear cuadrícula responsive que compone `AccommodationCard` y un mensaje explícito de resultados vacíos.
- **Archivos previstos:** `components/listings/AccommodationGrid.tsx`.
- **Dependencias:** HOME-006.
- **Aceptación:** array no vacío produce tarjeta por alojamiento; array vacío comunica claramente ausencia de resultados; una columna móvil y varias en escritorio.
- **Pruebas:** arrays con varios elementos y vacío; inspección a 375 y 768+ px; sin overflow.

## Fase D — Controles de búsqueda y navegación (P0)

### - [x] HOME-008 — Implementar búsqueda controlada
- **Trabajo:** implementar `SearchBar` como campo controlado que propaga cada cambio mediante callback, sin estado duplicado.
- **Archivos previstos:** `components/search/SearchBar.tsx`.
- **Dependencias:** HOME-001.
- **Aceptación:** valor refleja prop; entrada notifica el nuevo valor; etiqueta/nombre accesible y navegación teclado funcional.
- **Pruebas:** escribir, borrar, usar teclado; verificar callback; lint/typecheck.

### - [x] HOME-009 — Implementar filtros de categorías
- **Trabajo:** crear `CategoryFilters` como fila horizontal de filtros redondeados, potencialmente desplazable, con selección activa diferenciada y handler controlado; iconos propios/locales. Usar Todo, Alojamientos y Hoteles como taxonomía inicial; Todo corresponde a `null` (sin filtro), y las otras opciones aplican sus filtros. Categorías adicionales podrán considerarse después sin atribuirlas a la captura ni ampliar ahora el alcance.
- **Archivos previstos:** `components/listings/CategoryFilters.tsx`, `data/categories.ts` (si HOME-003 aún no lo creó, no duplicar).
- **Dependencias:** HOME-002, HOME-003.
- **Aceptación:** Todo aparece activo inicialmente y equivale a `null`; Alojamientos/Hoteles actualizan el filtro y click/teclado propaga selección; volver a Todo retira el filtro. Fila accesible y desplazable a 375 px. Los iconos no dependen de bibliotecas preconstruidas.
- **Pruebas:** probar selección, limpieza y desplazamiento horizontal en 375 px; lint/typecheck.

### - [x] HOME-010 — Implementar Navbar y composición
- **Trabajo:** componer Logo, SearchBar y controles/iconos del menú de usuario. Los controles sin funcionalidad especificada no aparentan una acción funcional no implementada.
- **Archivos previstos:** `components/layout/Navbar.tsx`; componente pequeño de controles solo si aprobado en plan.
- **Dependencias:** HOME-005, HOME-008.
- **Aceptación:** composición coherente, props de búsqueda controlada, controles accesibles; `Logo` original inspirado en términos generales, sin copiar logo oficial o activos; sin estilos inline.
- **Pruebas:** búsqueda se propaga desde Navbar; teclado, lint y typecheck.

## Fase E — Integración funcional Home (P0)

### - [x] HOME-011 — Conectar estado, carga simulada y efectos
- **Trabajo:** actualizar `app/page.tsx` para mantener lista inicialmente vacía, `loading=true`, crear `useEffect` con timeout ~1 s, cargar datos simulados, apagar loading y limpiar timeout al desmontar.
- **Archivos previstos:** `app/page.tsx`.
- **Dependencias:** HOME-003, HOME-004, HOME-007, HOME-010.
- **Aceptación:** indicador inicial visible; datos aparecen tras simulación; cleanup ejecutado; carga y estado de resultados no se confunden.
- **Pruebas:** observar temporalmente carga, completar efecto y desmontaje; revisar consola, lint y typecheck.

### - [x] HOME-012 — Conectar búsqueda y filtro combinados
- **Trabajo:** guardar `searchValue` y `activeCategoryId` con `useState`; derivar resultados por coincidencia en título o ubicación y categoría activa, ignorando mayúsculas/minúsculas y espacios exteriores; renderizar estado vacío.
- **Archivos previstos:** `app/page.tsx`; ajuste a props en `SearchBar`, `CategoryFilters`, `AccommodationGrid` solo si la integración lo requiere.
- **Dependencias:** HOME-008, HOME-009, HOME-011.
- **Aceptación:** búsqueda y categoría actúan simultáneamente sobre datos sin mutar fuente; se actualiza al instante; no coincidencias muestran texto; al limpiar se restaura lista filtrada apropiada.
- **Pruebas:** buscar por nombre/ubicación, variantes de mayúsculas/espacios, categoría, combinación AND, cero resultados y reset.

### - [x] HOME-013 — Verificar navegación con Link
- **Trabajo:** revisar que cada tarjeta usa `Link` y un id estable hacia `/rooms/{id}`.
- **Archivos previstos:** `components/listings/AccommodationCard.tsx`, potencialmente `app/page.tsx` únicamente para corregir integración.
- **Dependencias:** HOME-006, HOME-011.
- **Aceptación:** href coincide con cada alojamiento y usa `Link`; no crear página de detalle. Un not-found temporal es esperado mientras la ruta no exista y no significa que la navegación del ejercicio esté completa.
- **Pruebas:** verificar href en DOM y activarlo; registrar el not-found temporal como limitación esperada.

## Fase F — Diseño responsive y calidad (P0)

### - [ ] HOME-014 — Validar responsive 375px y escritorio
- **Trabajo:** revisar Tailwind de Home, navegación, categorías y tarjetas. Aplicar P1 aprobado: fotos grandes redondeadas, ubicación, iconos propios, corazón decorativo no interactivo y distintivo opcional. Mantener grid de una columna a 375 px y varias desde 768 px. Cabecera compacta con `Logo` propio, búsqueda y menú.
- **Archivos previstos:** componentes Home creados/adaptados; no tocar CSS global sin necesidad aprobada.
- **Dependencias:** HOME-007, HOME-010, HOME-011, HOME-012.
- **Aceptación:** 375 px muestra grid de una columna y controles utilizables; a 768 px o más grid de varias columnas; sin overflow horizontal general. La captura descrita es solo móvil: no se presenta un layout desktop como verificado por ella. Se conservan todos los elementos P0 de cabecera.
- **Pruebas:** navegador/devtools disponibles a 375 y 768+ px; confirmar columnas, ausencia de overflow horizontal general y foco/teclado. No instalar herramientas.

### - [x] HOME-015 — Ejecutar lint, TypeScript y compilación
- **Trabajo:** ejecutar validaciones definidas en el proyecto sin modificar configuración ni añadir scripts/dependencias.
- **Archivos previstos:** ninguno, salvo cambios de corrección aprobados y necesarios.
- **Dependencias:** HOME-002 a HOME-014.
- **Aceptación:** ESLint, typecheck disponible y build completan sin errores atribuibles a Home; cualquier limitación previa queda anotada.
- **Pruebas:** comandos existentes de `package.json`; `tsc --noEmit` solo si compatible; build Next.js.

### - [ ] HOME-016 — Revisión funcional final y cierre de fase
- **Trabajo:** recorrer criterios de aceptación de `spec.md`, registrar resultado y lista de pendientes visuales/no bloqueantes.
- **Archivos previstos:** ninguno (actualizar checklist solo con aprobación o instrucción de implementación).
- **Dependencias:** HOME-011 a HOME-015.
- **Aceptación:** todos los criterios obligatorios de Home comprobados; no se inició Catálogo/Detalle ni funcionalidades opcionales; evidencia de pruebas resumida.
- **Pruebas:** recorrido manual completo de carga, búsqueda, filtros, vacío, render de tarjetas, enlaces y responsive.

## Incidencias de ejecución — imágenes en `next/image`

- **Problema detectado:** al ejecutar Home en el navegador, `next/image` rechazaba `images.unsplash.com` porque el host no está autorizado en `next.config.ts`. Los datos simulados también usaban URLs remotas para el avatar del anfitrión.
- **Resolución inicial:** se sustituyeron las rutas de imágenes por `/accommodation-placeholder.svg`, un SVG original local; el componente `Image` se conservó y no fue necesario modificar `next.config.ts`.
- **Mejora posterior:** se guardaron seis fotografías JPEG diferentes en `public/images/accommodations/` y se asignó una a cada alojamiento en los datos. El placeholder local sigue disponible como fallback de `Image` cuando la ruta esté vacía. Solo la primera tarjeta recibe `priority`, para atender el LCP probable; las demás conservan la carga por defecto.
- **Verificación anterior:** se revisaron los usos de `next/image` en `app/` y `components/`; `AccommodationCard` es el único uso encontrado.

## Mejora visual adicional de Home (2026-11-23)

- `CategoryFilters` pasó a botones compactos tipo píldora, en fila desplazable, con icono y etiqueta en línea, fondos/bordes diferenciados y foco visible. Se conserva la selección controlada y `aria-pressed`.
- `AccommodationCard` conserva su estructura y Link; mantiene imagen grande `object-cover` con esquinas redondeadas, corazón y badge decorativos, título/valoración, ubicación y precio.
- **Validación de esta actualización:** las seis fotos locales son JPEG válidos; las siete referencias de imagen de los datos (seis alojamientos y avatar) existen y no hay URLs externas. `npx tsc --noEmit`, `npm run lint`, `npm run build` y `git diff --check` finalizaron correctamente. No se encontró navegador Chromium/Chrome disponible en el entorno, por lo que no se ejecutó validación visual/interactiva a 375, 768 px o escritorio. HOME-014 y HOME-016 siguen pendientes de esa comprobación manual y del recorrido funcional completo.

## Mejoras visuales y extensiones fuera de tareas obligatorias

Las mejoras P1 visuales ya están aprobadas y forman parte de HOME-006, HOME-009 y HOME-014, sin interacciones nuevas. No crear tareas separadas para ellas. Las extensiones P2 siguen fuera del MVP y requieren aprobación expresa y una tarea nueva con identificador:

- **P2 no obligatorio:** carrusel de experiencias (“Descubre experiencias cerca de ti”), carruseles de alojamientos (no sustituyen el grid obligatorio), `MobileBottomNav` (Explorar/Favoritos/Iniciar sesión sin crear rutas ni funcionalidad nueva), sección de inspiración/destinos y footer completo. No agregar tareas P2 hasta aprobación.

El análisis visual procede de observaciones externas de una captura estática; Copilot no inspeccionó directamente la imagen y esas observaciones no certifican comportamiento, breakpoint de escritorio, funcionalidad de favoritos/flechas ni disponibilidad real de alojamientos. Las casillas de todas las tareas permanecen sin completar.
