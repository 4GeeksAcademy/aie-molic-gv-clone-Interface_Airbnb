# Tareas de planificación de Catálogo

> **Estado:** ejecución autorizada. Marcar cada casilla únicamente después de verificar sus criterios de aceptación.
>
> Archivos indicados como previstos. Inspeccionar el estado del repositorio y contratos antes de editar. No alterar funcionalidades Home/contexto, instalar dependencias, cambiar configuración ni crear commits/pushes. Se permiten la navegación mínima a Catálogo y la presentación en euros solicitada para ambas vistas; conservar las columnas y comportamiento de Home.

## Fase A — Preparación y contrato

### - [x] CAT-001 — Confirmar punto de partida y scripts
- **Trabajo:** volver a inspeccionar la ruta, componentes compartidos, datos/tipos, configuración relevante y estado Git antes de cualquier implementación.
- **Archivos previstos:** solo lectura: `app/page.tsx`, `components/layout/Navbar.tsx`, `components/listings/AccommodationCard.tsx`, `components/listings/AccommodationGrid.tsx`, `components/shared/LoadingIndicator.tsx`, `types/accommodation.ts`, `data/accommodations.ts`, `package.json`, `context.md`, documentos de `specs/001-home/` y esta fase.
- **Dependencias:** ninguna.
- **Aceptación:** contratos actuales de `Navbar`, `AccommodationCard`, `AccommodationGrid`, fuente de datos y scripts confirmados; no se sobrescribe trabajo ajeno; se mantienen las decisiones confirmadas: Navbar compartida, Link a Catálogo, ascendente por defecto, mapa visible durante carga, layout responsive y estilo Stayfinder. No inferir captura.
- **Validación:** inspección de archivos/status; sin cambios de código.

### - [x] CAT-002 — Definir o verificar tipo de orden
- **Trabajo:** comprobar si `SortOrder = "asc" | "desc"` existe; incorporarlo una sola vez en un tipo compartido apropiado únicamente si falta.
- **Archivos previstos:** `types/accommodation.ts` o módulo de tipos compartido ya existente.
- **Dependencias:** CAT-001.
- **Aceptación:** unión TypeScript explícita, sin duplicación, `any` ni modificación de contratos Home no relacionada.
- **Validación:** `npx tsc --noEmit` si compatible.

## Fase B — Controles y presentación de Catálogo

### - [x] CAT-002A — Habilitar acceso a Catálogo desde Navbar
- **Trabajo:** hacer disponible una navegación interna a `/catalog` desde la Navbar compartida con `Link` de Next.js, aplicando el cambio mínimo posible.
- **Archivos previstos:** `components/layout/Navbar.tsx` y, solo si es imprescindible, `app/page.tsx` para conservar props; no cambiar comportamiento de búsqueda Home.
- **Dependencias:** CAT-001.
- **Aceptación:** un enlace accesible lleva a `/catalog`; Home conserva su búsqueda y presentación; no se crea una segunda Navbar.
- **Validación:** verificar `href="/catalog"`, navegación y build. No marcar hasta verificar.

### - [x] CAT-003 — Crear encabezado de resultados
- **Trabajo:** crear `ResultsHeader` para mostrar el conteo recibido.
- **Archivos previstos:** `components/listings/ResultsHeader.tsx`.
- **Dependencias:** CAT-001.
- **Aceptación:** prop `count: number`; comunica el total con texto semántico claro, no calcula un total distinto ni conserva estado.
- **Validación:** comprobar valores 0 y positivos; lint/typecheck.

### - [x] CAT-004 — Crear selector controlado de precio
- **Trabajo:** crear selector ascendente/descendente controlado, preferiblemente con `<label>` y `<select>` nativo.
- **Archivos previstos:** `components/listings/SortSelector.tsx`, tipo de CAT-002.
- **Dependencias:** CAT-002.
- **Aceptación:** props `value` y `onChange`; opciones anuncian inequívocamente precio menor→mayor y mayor→menor; teclado, etiqueta y foco visible; sin estado local paralelo.
- **Validación:** probar ambas selecciones y foco/teclado; lint/typecheck.

### - [x] CAT-005 — Crear placeholder de mapa
- **Trabajo:** implementar superficie gris visual con etiqueta predeterminada exacta “Mapa”, sin funcionalidad interactiva.
- **Archivos previstos:** `components/listings/MapPlaceholder.tsx`.
- **Dependencias:** CAT-001.
- **Aceptación:** componente `const`; etiqueta exacta por defecto; rol/nombre semántico apropiado, no es botón ni mapa real; estilos Tailwind sin dependencias.
- **Validación:** comprobar render y accesibilidad; lint/typecheck.

## Fase C — Ruta, carga y resultados

### - [x] CAT-006 — Implementar carga simulada en `/catalog`
- **Trabajo:** crear la ruta cliente y simular carga cercana a un segundo desde `data/accommodations.ts`, con lista inicialmente vacía, loading inicial y cleanup del timeout.
- **Archivos previstos:** `app/catalog/page.tsx`.
- **Dependencias:** CAT-001.
- **Aceptación:** no usa red/backend; loading se muestra al inicio y termina; `useEffect` limpia el timeout al desmontar; usa `LoadingIndicator` compartido; no modifica Home.
- **Validación:** observar estado inicial/final y consola; lint/typecheck.

### - [x] CAT-007 — Ordenar inmutablemente por precio
- **Trabajo:** mantener `sortOrder` con `useState` y derivar resultados ordenados en copia de los datos, ascendente o descendente por `pricePerNight`.
- **Archivos previstos:** `app/catalog/page.tsx`, ajuste de props en `SortSelector` solo si es necesario.
- **Dependencias:** CAT-002, CAT-004, CAT-006.
- **Aceptación:** selector inicia en `"asc"`; cambiarlo actualiza orden; asc compara de menor a mayor y desc de mayor a menor; no se llama `sort` directamente al array importado; los precios iguales no causan error.
- **Validación:** probar ambas direcciones y verificar que el array fuente conserva su orden; lint/typecheck.

### - [x] CAT-008 — Mostrar conteo y grid reutilizable
- **Trabajo:** integrar `ResultsHeader` y `AccommodationGrid` con la misma colección ordenada que se presenta, conservando `AccommodationCard` compartida y estado vacío.
- **Archivos previstos:** `app/catalog/page.tsx`; reutilizar sin duplicar `components/listings/ResultsHeader.tsx`, `AccommodationGrid.tsx` y `AccommodationCard.tsx`.
- **Dependencias:** CAT-003, CAT-006, CAT-007.
- **Aceptación:** conteo es igual a tarjetas visibles; orden no altera total; vacío comunica cero resultados; cada tarjeta conserva `Link` a `/rooms/${id}`; no se crea una tarjeta paralela.
- **Validación:** casos con resultados y lista vacía; revisar hrefs y DOM; lint/typecheck.

### - [ ] CAT-009 — Componer mapa y layout responsive
- **Trabajo:** colocar placeholder después de resultados en móvil y a la derecha desde 768 px; desde 1024 px componer dos zonas 55/45 y mapa alto sticky.
- **Archivos previstos:** `app/catalog/page.tsx`, `components/listings/AccommodationGrid.tsx`, `components/listings/AccommodationCard.tsx`, `components/listings/MapPlaceholder.tsx`.
- **Dependencias:** CAT-005, CAT-008.
- **Aceptación:** orden vertical resultados→mapa a 375 px sin sticky; dos zonas desde 768 px; entre 768 y 1023 px tarjetas en una columna y mapa moderado no sticky; desde 1024 px zonas aproximadamente 55% resultados/45% mapa, hasta dos tarjetas por fila y mapa alineado arriba con altura `calc(100vh - 130px)` más sticky `top-24`. Etiqueta exacta “Mapa”, centrada sobre gris claro redondeado, sin interacción; visible durante carga. Sin overflow horizontal y sin `overflow` ancestro que impida sticky. Home conserva columnas y diseño. Precios en euros sin cambiar valores.
- **Validación:** navegador/devtools a 375, 768, 1023 y 1024+ px; inspección de overflow, cuadrícula, alineación, altura y sticky durante scroll con suficiente contenido. No declarar Vision-to-Spec completado sin captura.

## Fase D — Validación y cierre

### - [ ] CAT-010 — Validar accesibilidad y navegación
- **Trabajo:** revisar control por teclado, etiquetas, foco, semántica del placeholder y enlaces de tarjetas.
- **Archivos previstos:** componentes de Catálogo y ruta solo si se requieren correcciones.
- **Dependencias:** CAT-003 a CAT-009.
- **Aceptación:** selector operable con teclado y accesible; conteo/mapa identificables; tarjetas navegan mediante `Link` con IDs correctos; no hay controles falsos.
- **Validación:** recorrido manual con teclado y revisión de hrefs.

### - [x] CAT-011 — Ejecutar validaciones estáticas y build
- **Trabajo:** ejecutar scripts existentes y revisar cambios.
- **Archivos previstos:** ninguno, salvo correcciones necesarias aprobadas.
- **Dependencias:** CAT-002 a CAT-010.
- **Aceptación:** lint, typecheck y build pasan; diff no contiene cambios fuera de Catálogo/tipo justificado; `git diff --check` limpio.
- **Validación:** `npm run lint`, `npx tsc --noEmit`, `npm run build`, `git diff --check`, según disponibilidad vigente. No agregar scripts ni dependencias.

### - [ ] CAT-012 — Recorrer criterios y cerrar fase
- **Trabajo:** comprobar todos los criterios de `spec.md` y registrar pendientes visuales/manuales.
- **Archivos previstos:** ninguno (marcar tareas solo con autorización explícita y pruebas realizadas).
- **Dependencias:** CAT-001 a CAT-011.
- **Aceptación:** carga, total, ambos órdenes, inmutabilidad, vacío, reuso, hrefs y responsive verificados; limitación de no contar con captura de Catálogo documentada; ninguna funcionalidad fuera de alcance.
- **Validación:** recorrido funcional completo en navegador y resumen de evidencia.

## Decisiones no bloqueantes para documentación

Orden inicial confirmado: ascendente (menor a mayor); el mapa permanece visible durante carga. Las etiquetas accesibles y proporciones pueden ajustarse con pruebas, pero no alteran orden, conteo ni posiciones responsive. Vision-to-Spec permanece pendiente de captura; las decisiones de identidad Stayfinder son propias, no observaciones. Casillas solo se marcan tras implementación y verificación real.

## Registro de validación actual

- `npx tsc --noEmit`: correcto.
- `npm run lint`: correcto.
- `npm run build`: correcto; Next prerenderiza `/catalog`.
- `git diff --check`: correcto.
- Las seis imágenes de alojamientos y el SVG local de respaldo referidos por datos existen bajo `public/`.
- No hay navegador Chromium/Chrome/Firefox disponible en el entorno. Por tanto CAT-009 (responsive y sticky inspeccionados), CAT-010 (recorrido manual de teclado/navegación) y CAT-012 (recorrido final) permanecen sin marcar. El selector es un `<select>` nativo, pero eso no sustituye prueba interactiva manual.

### Ajuste visual de Catálogo y moneda

- Implementado `layout="catalog"` en el grid compartido: una columna móvil/tablet y máximo dos desde 1024 px. El valor por defecto mantiene las clases responsive originales de Home.
- Títulos de Catálogo con hasta dos líneas; se conserva una línea en Home. Fotografía, ubicación, valoración, precio y bordes se mantienen. El encabezado/selector permite salto de línea.
- Mapa gris claro, texto “Mapa” centrado y bordes redondeados: 18rem en móvil sin sticky; 20rem y no sticky entre 768–1023 px; desde 1024 px altura `calc(100vh - 130px)` y sticky `top-24`, alineado con el inicio de resultados. Revisar ancestros para que overflow no bloquee sticky.
- Precios EUR en Home y Catálogo mediante `Intl.NumberFormat`, sin tocar los datos.
- Comprobación puntual de render React con estados simulados, sin archivos de test ni dependencias nuevas: columnas/clases por variante, títulos, euros, ascendente/descendente, conteo, array original congelado sin mutación, carga con mapa y vacío correctos. `Link` e `Image` se sustituyeron por elementos HTML en esta comprobación: no valida el navegador ni el optimizador de imágenes.
- `npx tsc --noEmit`, lint de archivos afectados, `npm run lint`, `npm run build` y `git diff --check`: correctos para este ajuste.
- Pendientes en navegador: Home y Catálogo a 375/768/1023/1024/1440 px, legibilidad de títulos y fotografías, altura y sticky del mapa con scroll suficiente, ausencia de overflow, interacción del selector y teclado. CAT-009, CAT-010 y CAT-012 siguen sin marcar; no se ha inspeccionado ninguna captura.

### Auditoría final automatizada
- Reejecutados en esta auditoría: `npx tsc --noEmit`, `npm run lint`, `npm run build` y `git diff --check`; todos finalizaron correctamente.
- Se revisó el código y su composición responsive de forma estática. No se ejecutó prueba manual de navegador: no hay Chromium/Chrome/Firefox disponible.
- CAT-009, CAT-010 y CAT-012 permanecen pendientes para inspección real de viewports, interacción de teclado/navegación y recorrido funcional; no se han marcado por inferencia.
