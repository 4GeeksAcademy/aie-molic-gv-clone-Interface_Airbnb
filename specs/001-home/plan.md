# HOME-001 — Plan técnico de implementación

- **Fase:** Home (`/`) únicamente.
- **Estado:** plan; no ejecutar hasta aprobación/instrucción.
- **Restricción:** este documento no autoriza cambios fuera de la fase Home ni modificaciones de configuración.

## 1. Estado del repositorio y alcance

El repositorio contiene `app/page.tsx`, `app/layout.tsx`, `app/globals.css` y `components/ProductCard.tsx`; `components/` no tiene subcarpetas actualmente. No existen aún `types/`, `data/` ni rutas `catalog/` y `rooms/`. README solo contiene el nombre del proyecto. Conservar y revisar `ProductCard.tsx` y `page.tsx` antes de decidir si adaptar o reemplazar su uso: no sobrescribir trabajo sin inspección. Tailwind/Next ya están configurados; no reconfigurar ni instalar paquetes.

Home debe usar datos locales simulados y contratos que permitan reutilizar alojamiento, tarjeta, grid y carga en las fases futuras de Catálogo y Detalle. No crear esas rutas ahora.

## 2. Arquitectura de componentes

```text
app/page.tsx (contenedor Home y estado de coordinación)
└── Header / Navbar
    ├── Logo
    ├── SearchBar (controlado)
    └── controles/iconos de usuario
└── CategoryFilters (controlado)
└── LoadingIndicator (durante carga)
    o
    AccommodationGrid (después de carga)
    └── AccommodationCard (Link a /rooms/{id})
```

Componentes pequeños, funcionales declarados como `const`. El contenedor coordina estado y datos; controles reciben valor/handlers; tarjeta y grid presentan datos. La tarjeta/grid/indicador/Logo/SearchBar/NavBar tienen potencial de reutilización futura, sin crear aún código de otras vistas.

**P0:** `AccommodationGrid` es el layout base en móvil y escritorio. **No sustituir por carruseles** aunque sean visibles en la referencia. La cabecera debe incluir los elementos obligatorios (componente/logo propio, búsqueda y menú de usuario) en una composición compacta para móvil; el análisis describe que el logo completo no se ve en la captura, pero el requisito P0 prevalece. La identidad propia se inspira visualmente en patrones generales de la referencia, sin copiar el logo oficial.

**P1, solo tras validar alcance visual:** `AccommodationSection` puede agrupar grids bajo encabezados por ubicación/disponibilidad. `AccommodationCard` puede admitir ubicación adicional, favorito meramente visual o distintivo opcional. Iconos propios/locales para filtros. Estos extras no deben añadir estado/funciones innecesarias ni reemplazar campos P0.

**P2, no implementar como parte del MVP ni incluir en tareas obligatorias:** carrusel de experiencias, carruseles de alojamientos, `MobileBottomNav`, sección de inspiración y footer completo. Requieren aprobación expresa posterior.

## 3. Archivos previstos

Archivos a inspeccionar antes de editar: `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `components/ProductCard.tsx`, y `package.json` para conocer scripts disponibles (sin alterar configuración).

Archivos candidatos para crear/adaptar en la fase Home:

```text
app/page.tsx
components/layout/Navbar.tsx
components/layout/Logo.tsx
components/search/SearchBar.tsx
components/listings/CategoryFilters.tsx
components/listings/AccommodationCard.tsx
components/listings/AccommodationGrid.tsx
components/shared/LoadingIndicator.tsx
components/listings/AccommodationSection.tsx # P1 opcional, solo con aprobación
components/ProductCard.tsx            # solo si inspección concluye que conviene mantener/ adaptar
components/ui/UserMenuControls.tsx     # opcional únicamente si separar controles reduce complejidad
 types/accommodation.ts
 types/category.ts
 data/accommodations.ts
 data/categories.ts
```

La estructura concreta se debe minimizar; no crear `UserMenuControls` si el elemento puede mantenerse conciso dentro de `Navbar`. El componente actual `ProductCard.tsx` puede servir de base o migrarse únicamente tras inspección. Evitar dos tarjetas equivalentes. `layout.tsx` y `globals.css` no se modificarán salvo necesidad demostrada y aprobada; la página usa clases Tailwind.

## 4. Tipos e interfaces

Definir los tipos compartidos propuestos por `spec.md` en módulos pequeños:

- `Accommodation`: `id`, `title`, `location`, `pricePerNight`, `rating`, `reviewCount`, `categoryIds`, `images`, `host`, `amenities`, límites de huéspedes.
- `Host`: `id`, `name`, `avatarUrl`, `yearsHosting`.
- `Amenity`: `id`, `label`, `icon` como identificador de recurso local.
- `Category`: `id`, `label`.
- Opcionalmente tipos de props junto a cada componente; no definir tipos prematuramente si bastan interfaces inline exportadas desde módulo de componente.

Los datos usados por Home deben satisfacer el tipo compartido. Mantener IDs estables para que las fases de Catálogo y Detalle puedan consumir la misma fuente y resolver `/rooms/{id}`. No inventar ni copiar contenido de la captura; placeholders propios para datos e imágenes.

## 5. Datos simulados y carga

- `data/accommodations.ts` exporta array tipado de alojamientos de ejemplo; `data/categories.ts` exporta categorías con IDs que coincidan con `categoryIds`.
- El estado del contenedor comienza como `Accommodation[] = []` y `loading = true`.
- Un `useEffect` programa `setTimeout` cercano a 1000 ms; al vencer, asigna el array local y cambia loading a false. Devuelve limpieza mediante `clearTimeout`.
- El efecto debe evitar estado obsoleto y no mutar datos. No usar `fetch`, backend, ni dependencia adicional.
- Mientras carga renderizar `LoadingIndicator`; luego renderizar resultados o estado vacío.

## 6. Búsqueda y categorías

- Controlar `searchValue` (`string`) y `activeCategoryId` (`string | null`) con `useState`. Las categorías iniciales son Todo, Alojamientos y Hoteles; Todo se representa como `null` (sin filtro) y es el estado activo inicial.
- `SearchBar` recibe `value` y `onChange`; no mantiene estado duplicado.
- `CategoryFilters` recibe categorías, ID activo y handler; usar inicialmente Todo, Alojamientos y Hoteles, conforme a la decisión adoptada desde el análisis visual suministrado. Todo corresponde a `null` (sin filtro) y debe ser la selección inicial; Alojamientos y Hoteles filtran registros de forma demostrable. No atribuir categorías adicionales a la captura. Debe existir un medio accesible de volver a Todo.
- Derivar la colección visible aplicando simultáneamente `searchValue.trim()` normalizado y pertenencia a la categoría activa. El texto coincide si aparece en `title` **o** `location`. `null` omite filtro de categoría.
- Comparación textual insensible a mayúsculas/minúsculas; no mutar array de origen. Al aplicar categorías se respetan los datos tipados.
- Asegurar estado vacío para cero coincidencias; distinguirlo de la carga.

## 7. Estrategia responsive y visual

- Mobile-first: construir primero para ancho 375 px; clases base móviles y variantes desde 768 px. Confirmar configuración de breakpoint existente sin alterarla.
- Grid P0: una columna en 375 px y varias en escritorio. El análisis de la captura reporta carruseles en móvil, pero se conserva el grid por precedencia de requisito; carruseles solo P2 con autorización.
- Categorías: fila de filtros redondeados con iconos/etiquetas; desplazamiento horizontal permitido en móvil. Estado activo claramente distinto. Usar iconografía propia/local.
- Header móvil: contener logo/identidad propia, search pill con lupa y texto/placeholder funcional “Empieza a buscar” y controles de usuario. El logo debe ser propio e inspirado visualmente en la referencia, no una copia oficial. El análisis dice que no aparece logo completo; determinar composición compacta en la implementación sin ocultar requisitos. No asumir que el texto de la captura es interactivo o placeholder definitivo sin aprobación.
- Rasgos observados para orientar estilos: blanco predominante, texto oscuro, grises secundarios, acentos rosa/rojo, sans-serif, imágenes grandes redondeadas, espaciado compacto y secciones claramente separadas. No extrapolar valores exactos ni medidas.
- A 768 px o más ajustar cabecera/grilla a escritorio; solo hay evidencia visual móvil y el comportamiento exacto de escritorio queda pendiente de captura.
- Tailwind exclusivamente para estilos de componentes; sin estilos inline, paquetes UI ni logo/recursos oficiales copiados. Elementos visuales originales/locales.
- Experiencias, bottom nav y footer extendido son P2 y no son parte de esta estrategia MVP.

## 8. Orden de implementación por fases independientes

1. **Inspección y decisiones de base:** leer archivos existentes y scripts; acordar qué hacer con `ProductCard`, cómo representar valoración/estrellas e iconos con recursos propios y nivel de datos placeholder. La taxonomía inicial queda fijada en Todo/Alojamientos/Hoteles. Separar lo descrito por análisis visual externo de lo requerido P0. No tocar configuración.
2. **Modelo y datos:** definir tipos Accommodation/Category y datos coherentes con IDs/categorías válidos. Validación de tipos.
3. **Presentación reutilizable:** implementar Logo propio, LoadingIndicator, AccommodationCard (mínimos P0, extras P1 solo si aprobados) y AccommodationGrid; verificar rendering estático, grid y navegación `Link`.
4. **Controles de Home:** implementar SearchBar y CategoryFilters como componentes controlados; validar categoría activa, iconos si se aprueban y eventos con teclado.
5. **Orquestación Home:** incorporar Header/Navbar y conectar filtros, datos, estados, carga simulada, resultados, estado vacío; mantener cabecera compacta sin omitir logo/menú en `/`.
6. **Responsive y accesibilidad:** ajustar Tailwind con validación 375/768+ px; priorizar grid de una columna móvil; foco/teclado, etiquetas y textos alternativos. Mantener desktop exacto pendiente de captura.
7. **Validación final:** lint, typecheck (si existe script) y build; pruebas manuales de interacción, rutas/hrefs y viewport. Resolver errores sin ampliar alcance.

Cada fase se revisa antes de comenzar la siguiente; no iniciar ejecución hasta indicación del usuario. Las fases 2–4 crean bases que futuras vistas podrán reutilizar, pero Catálogo/Detalle no se desarrollan aquí.

## 9. Dependencias y vistas futuras

- `Accommodation`, `Category` y los datos locales deben mantener contratos estables para Catálogo y `/rooms/[id]`.
- `AccommodationCard` debe enlazar a un id estable; el destino aún no está creado y no debe añadirse en fase Home.
- `Navbar`, `Logo`, `LoadingIndicator`, `AccommodationCard` y `AccommodationGrid` son candidatos a reutilizar. Confirmar en specs de futuras vistas si composición/props satisfacen sus necesidades.
- Catálogo, sorting, mapa, detalle, galería y reserva quedan fuera de esta fase.

## 10. Estrategia de pruebas y validación

### Automatizada / estática

- Ejecutar los scripts existentes documentados en `package.json`; no inventar ni modificar scripts sin aprobación.
- ESLint con el comando ya configurado.
- TypeScript (`tsc --noEmit`) si el proyecto dispone de esa validación compatible.
- `next build` o script build existente para comprobar compilación App Router.
- Corregir advertencias/errores causados por los cambios; anotar cualquier limitación previa.

### Funcional manual

- Observar estado inicial de carga, aproximadamente 1 s, datos y cleanup/unmount.
- Buscar por fragmento de título y ubicación; probar mayúsculas, espacios y búsqueda vacía.
- Activar categoría, confirmar resaltado y combinación AND entre categoría y búsqueda; probar cero resultados y restauración.
- Verificar tarjetas y contenido requerido, e href correcto a `/rooms/{id}` con `Link`.
- Confirmar que datos originales no se mutan.

### Responsive y accesibilidad manual

- Probar anchuras 375 px y 768 px o superior en navegador; verificar una columna móvil, múltiples columnas escritorio y ausencia de overflow horizontal involuntario.
- Probar navegación por teclado, foco visible, nombres accesibles en controles, alt apropiado para placeholders y estado de carga detectable por tecnologías asistivas.
- Usar como orientación visual de Home las observaciones externas ya documentadas en `context.md` y `spec.md`; no presentarlas como inspección directa ni como mediciones verificadas. No bloquear la implementación funcional por falta de referencia de escritorio.

## 11. Decisiones que requieren confirmación

Antes o durante implementación confirmar, sin alterar alcance: (1) si `ProductCard.tsx` se adapta o se sustituye/reubica; (2) número y contenido de datos simulados; (3) mecanismo propio/local para estrellas, lupa, iconos de categoría y menú usuario; (4) texto/forma final del campo de búsqueda y disposición compacta de cabecera; (5) si se autorizan mejoras P1 como favorito visual, distintivos o agrupaciones; (6) P2 requiere aprobación expresa y está fuera del MVP; (7) comandos de lint/build/typecheck. La taxonomía inicial se decide como Todo/Alojamientos/Hoteles; cualquier extensión posterior se valida aparte. Los colores son solo familias observadas, no valores; el análisis visual es externo y no valida interacciones. El responsive de escritorio necesita referencia adicional. Mantener sin definir cualquier dimensión/estilo exacto no suministrado.
