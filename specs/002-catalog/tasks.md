# Tareas de planificación de Catálogo

> **Estado:** ejecución autorizada. Marcar cada casilla únicamente después de verificar sus criterios de aceptación.
>
> Archivos indicados como previstos. Inspeccionar el estado del repositorio y contratos antes de editar. No alterar funcionalidades Home/contexto, instalar dependencias, cambiar configuración ni crear commits/pushes. Solo se permite el cambio mínimo a la navegación existente para enlazar Catálogo.

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
- **Trabajo:** colocar placeholder después de resultados en móvil y a la derecha del listado desde 768 px, con tamaños fluidos sin overflow general.
- **Archivos previstos:** `app/catalog/page.tsx`, ajustes de `MapPlaceholder.tsx` si son necesarios.
- **Dependencias:** CAT-005, CAT-008.
- **Aceptación:** orden vertical resultados→mapa a 375 px; columnas resultados-izquierda/mapa-derecha a 768 px o más; etiqueta exacta “Mapa”; el placeholder permanece visible durante carga y no intercepta interacción ni simula datos; estilo coherente con decisiones Stayfinder.
- **Validación:** navegador/devtools a 375 y 768+ px; inspección de overflow y legibilidad. No declarar Vision-to-Spec completado sin captura.

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
- No hay navegador Chromium/Chrome/Firefox disponible en el entorno. Por tanto CAT-009 (responsive inspeccionado), CAT-010 (recorrido manual de teclado/navegación) y CAT-012 (recorrido final) permanecen sin marcar. El selector es un `<select>` nativo, pero eso no sustituye prueba interactiva manual.
