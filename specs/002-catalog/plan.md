# Plan técnico de Catálogo

- **Fase:** Catálogo (`/catalog`) únicamente.
- **Estado:** en implementación según las decisiones confirmadas por el usuario.
- **Alcance:** ruta Catálogo, componentes específicos y el mínimo cambio requerido para que la navegación existente incluya `/catalog`.
- **Restricciones:** no alterar funcionalidades Home, no instalar dependencias, reconfigurar, implementar fuera de alcance, ni crear commits/pushes.

## 1. Base inspeccionada

El proyecto actual es Next.js App Router, React y TypeScript con Tailwind. Existen Home (`app/page.tsx`), `components/layout/Logo.tsx`, `Navbar.tsx`, `components/search/SearchBar.tsx`, `components/listings/AccommodationCard.tsx`, `AccommodationGrid.tsx`, `CategoryFilters.tsx`, `components/shared/LoadingIndicator.tsx`, `types/accommodation.ts`, `types/category.ts` y `data/accommodations.ts`, `data/categories.ts`. Home importa ya el array compartido de alojamientos. La tarjeta actual usa `Link` a `/rooms/${id}`; el grid recibe `accommodations` y opcionalmente `isLoading`, y presenta el estado vacío si corresponde. Confirmar archivos y props de nuevo antes de implementar, pues este inventario puede cambiar.

## 2. Arquitectura propuesta

```text
app/catalog/page.tsx (contenedor cliente: carga + sortOrder)
├── Navbar (compartida; búsqueda controlada sin función de filtrado nueva)
├── ResultsHeader(count)
├── SortSelector(value, onChange)
└── layout responsive de dos zonas
    ├── resultados
    │   └── AccommodationGrid(accommodations ordenados)
    │       └── AccommodationCard(accommodation, Link a detalle)
    └── MapPlaceholder(label="Mapa")
```

Una página contenedora coordina estado y deriva el array ordenado. El selector es controlado mediante `useState`, inicializado en `"asc"` (menor a mayor). Reutilizar `Navbar` y sus estilos Stayfinder cuando compatible; realizar el cambio mínimo necesario para ofrecer un `Link` a `/catalog` desde navegación existente, sin cambiar la búsqueda/funcionalidad Home. El grid/card existentes se reutilizan en lugar de crear equivalentes. `MapPlaceholder` es gris, muestra exactamente “Mapa”, no tiene interacción y permanece visible durante la carga. La composición es blanca y limpia, texto oscuro, rosa/rojo y bordes redondeados coherentes con Home. No se atribuyen estos lineamientos a una captura de Catálogo.

## 3. Archivos candidatos

```text
app/catalog/page.tsx
components/listings/ResultsHeader.tsx
components/listings/SortSelector.tsx
components/listings/MapPlaceholder.tsx
components/layout/Navbar.tsx  # solo si requiere enlace mínimo a /catalog
# Solo si falta el tipo:
types/accommodation.ts  # export SortOrder = "asc" | "desc"
```

Reutilizar sin modificar salvo incompatibilidad demostrada: `AccommodationGrid.tsx`, `AccommodationCard.tsx`, `LoadingIndicator.tsx`, `data/accommodations.ts`, `types/accommodation.ts`. No tocar `app/page.tsx`, `context.md`, `globals.css`, configuración o datos compartidos, excepto corrección estrictamente necesaria aprobada y sin cambiar contenido Home. No crear dataset paralelo. Revisar status/diff al inicio de implementación para evitar sobrescribir trabajo del usuario.

## 4. Datos, estado y ordenamiento

- Consumir el mismo `accommodations` tipado que usa Home. Mantener carga simulada local; no añadir `fetch` ni backend.
- Página cliente con `isLoading` inicial `true` y `sortOrder` inicial confirmado `"asc"`. Un `useEffect` inicia timeout cercano a un segundo, después retira carga, y retorna cleanup con `clearTimeout`.
- Tipo `SortOrder = "asc" | "desc"` en tipo compartido solo si aún no existe. No duplicar alias.
- Derivar los resultados con `useMemo` opcional o derivación directa: copiar antes de `sort`, comparar `pricePerNight` con orden basado en dirección; nunca ordenar el array importado in-place. `useMemo` solo si aporta claridad; con catálogo pequeño una derivación directa es suficiente.
- Presentar `ResultsHeader.count` como longitud de la misma lista ordenada. Ordenar no modifica cantidad. Grid recibe la lista derivada; mantiene su mensaje vacío.
- Durante la carga, mantener visible el `MapPlaceholder` junto al `LoadingIndicator`; tras la carga, conservar la misma zona de mapa.

## 5. Responsive y presentación

- Mobile-first: en 375 px flujo vertical con resultados antes del mapa.
- Desde 768 px, layout de dos columnas con resultados a la izquierda y mapa a la derecha. Resolver proporciones con clases Tailwind disponibles; no presentarlas como observadas en captura.
- Placeholder gris con texto exacto “Mapa”; no interactivo.
- Fondo blanco, texto oscuro, acentos rosa/rojo, bordes redondeados y controles coherentes con Stayfinder/Home.
- Revisar si existe overflow horizontal en 375 px y 768+ px; garantizar que el grid mantenga comportamiento apropiado dentro de su columna.

## 6. Accesibilidad y navegación

Preferir `<label>` y `<select>` nativo para `SortSelector`, con opciones claramente anunciadas, nombre accesible y foco visible. Estructurar conteo como encabezado/texto comprensible. Nombrar la zona del placeholder con `aria-label`/semántica de región solo si mejora navegación; no marcarla como aplicación interactiva. El `MapPlaceholder` no es botón. Usar elementos semánticos y no crear botones falsos. Las tarjetas continúan usando `Link` de Next y sus IDs existentes.

## 7. Secuencia de implementación futura

1. Inspeccionar status, archivos fuente, contratos y scripts; incorporar las decisiones SDD confirmadas.
2. Incorporar o verificar `SortOrder` sin duplicarlo.
3. Implementar `ResultsHeader`, `SortSelector`, `MapPlaceholder` con interfaces simples, funcionales `const`, Tailwind y accesibilidad básica.
4. Crear ruta App Router `/catalog`, estado de carga/orden, cleanup y ordenamiento inmutable sobre la fuente común; componer componentes compartidos.
5. Reutilizar Navbar y facilitar acceso a Catálogo mediante Link con mínima modificación; ajustar layout: lista seguida de mapa en móvil, columnas lista-izquierda/mapa-derecha desde 768 px. Mantener placeholder también durante carga.
6. Probar carga, conteo, orden ambos sentidos, igualdad de precios, fuente inmutable, vacío, enlaces `Link`, controles por teclado y posiciones responsive.
7. Ejecutar `npm run lint`, `npx tsc --noEmit` y `npm run build` según scripts/disponibilidad vigentes. No añadir scripts/dependencias ni editar configuración como atajo.

## 8. Validación prevista

### Estática
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- `git diff --check`

Usar los scripts disponibles al iniciar; no editar `package.json` ni configuración por esta fase sin autorización.

### Funcional y datos
- Ver carga inicial y finalización; comprobar cleanup por desmontaje si entorno de prueba lo permite.
- Confirmar conteo 0 y conteo igual a número de tarjetas.
- Con precios de datos existentes o fixture de prueba, verificar ascendente/descendente y casos de precio igual.
- Congelar/guardar snapshot del array fuente en pruebas si se dispone de entorno; confirmar que sort no cambia orden original.
- Verificar que el selector opera por teclado, y que cada tarjeta conserva href `/rooms/{id}`.
- Probar estado vacío y permanencia del mapa según layout convenido.

### Responsive/manual
- A 375 px, confirmar listado encima del mapa.
- A 768 px o superior, confirmar listado a la izquierda, mapa a la derecha y ausencia de overflow general.
- Revisar nombres accesibles, foco visible y legibilidad. No declarar la estética como validada mediante captura: no se proporcionó referencia visual de Catálogo.

## 9. Decisiones pendientes

- Etiquetas exactas accesibles del selector y proporciones/alturas del mapa quedan a validación de implementación; no alteran el orden inicial ascendente ni el breakpoint de 768 px.
- Captura/insumos de Vision-to-Spec para Catálogo siguen pendientes. Las decisiones visuales aprobadas son propias y no autorizan añadir mapa real, filtros, búsqueda ni dependencias.
