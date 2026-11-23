# Contexto del proyecto — clon de Airbnb

## 1. Descripción del proyecto

Aplicación educativa de 4Geeks Academy cuyo objetivo es recrear tres vistas representativas de Airbnb: inicio, catálogo de alojamientos y detalle de un alojamiento. El ejercicio se centra en traducir referencias visuales reales a especificaciones y después construir la interfaz con componentes funcionales reutilizables, tipos de TypeScript y estilos Tailwind CSS.

El alcance funcional conocido incluye búsqueda de alojamientos, exploración por categorías, presentación y ordenación de resultados, consulta de información de un alojamiento y una tarjeta de reserva. La captura móvil de Home y las decisiones de diseño documentadas aportan orientación visual, sin reemplazar los requisitos de 4Geeks. Los detalles técnicos por vista se mantienen en sus documentos SDD.

### Prioridad de requisitos

- **P0 — obligatorio 4Geeks:** funcionalidades y criterios de evaluación del ejercicio. Tienen siempre prioridad frente a una reproducción literal de la referencia.
- **P1 — mejoras visuales compatibles:** elementos visuales de la referencia que pueden añadirse sin debilitar P0 ni introducir complejidad funcional innecesaria.
- **P2 — extensiones no obligatorias:** elementos adicionales observados que quedan fuera del alcance inicial y requieren aprobación antes de planificarse o implementarse.

## 2. Usuario objetivo

Personas que buscan un alojamiento para un viaje y necesitan explorar opciones, comparar resultados y consultar información antes de decidir si desean reservar. Sus acciones principales son:

- Iniciar una búsqueda de alojamientos.
- Explorar categorías y resultados disponibles.
- Ordenar el catálogo por precio.
- Revisar fotografías, descripción y servicios de un alojamiento.
- Consultar la información del anfitrión y gestionar los huéspedes en el contexto de una reserva.

Los segmentos demográficos, destinos y demás perfiles de usuario quedan pendientes de evidencia o de futuras decisiones del ejercicio.

## 3. Descripción de las vistas

### Inicio — `/`

Punto de entrada a la experiencia. **P0:** cabecera con logo/identidad, búsqueda y menú de usuario; búsqueda en tiempo real por nombre o ubicación; filtros por categorías; cuadrícula responsive de alojamientos; tarjetas reutilizables y carga simulada visible. La búsqueda y selección de categoría se gestionan con estado de React. Los datos pueden simularse durante la carga.

**Resumen visual Vision-to-Spec (referencia móvil Home):** la captura descrita presenta una cabecera blanca compacta con búsqueda redondeada y filtros con iconos/etiquetas; las categorías observadas son Todo, Alojamientos y Hoteles. Se observan secciones de alojamientos agrupadas por destino, tarjetas con fotografías grandes y redondeadas, icono de favorito y, en algunos casos, distintivos, además de título y datos de estancia/precio/valoración. También aparecen una navegación inferior móvil, sección de experiencias, inspiración para futuras escapadas y footer informativo. Estos son rasgos observados, no requisitos automáticos: quedan sujetos a la prioridad siguiente y no se asumen interacciones a partir de una captura estática.

**Decisiones iniciales para Home:** usar Todo, Alojamientos y Hoteles como categorías, siempre que el conjunto de datos permita demostrar correctamente el filtrado controlado con `useState`; mantener categoría activa y resultados verificables. Crear un `Logo` propio sencillo, inspirado de forma general en el estilo de la referencia, sin copiar el logo oficial. Mantener la cabecera compacta en móvil e integrar logo, búsqueda y menú requeridos sin ocultarlos. Aplicar rasgos visuales observados a las tarjetas sin sustituir la cuadrícula responsive obligatoria: una columna a 375 px y varias en escritorio desde 768 px.

Las mejoras P1 se limitan inicialmente a presentación compatible y de baja complejidad (p. ej., fotografías redondeadas grandes, ubicación adicional, icono de favorito meramente visual, distintivo opcional, iconos de filtros o secciones por destino si conservan el grid). Las extensiones P2 —carruseles de alojamientos/experiencias, barra inferior móvil, sección de inspiración y footer completo— quedan fuera del alcance inicial y requieren aprobación. Los detalles de estados, props, componentes, aceptación y tareas están en `specs/001-home/spec.md`, `plan.md` y `tasks.md`.

### Catálogo — `/catalog`

Vista de resultados de búsqueda. Debe mostrar el listado de alojamientos, un contador de resultados, una opción de ordenación por precio y una sección de mapa. La ordenación se gestiona con estado de React y la carga de datos puede simularse.

### Detalle — `/rooms/[id]`

Vista de un alojamiento identificado mediante un segmento dinámico de ruta. Debe presentar una galería de fotografías, información del alojamiento, datos del anfitrión, servicios y una tarjeta de reserva. El estado de la galería y la cantidad de huéspedes debe gestionarse con React; la carga de datos puede simularse.

## 4. Especificación funcional de las vistas y componentes

Los comportamientos enumerados aquí son requisitos del ejercicio. La orientación visual móvil de Home ya está documentada en Vision-to-Spec a partir de observaciones externas; los valores exactos no proporcionados y las composiciones visuales de Catálogo y Detalle siguen pendientes. Todos los componentes React serán funcionales y se declararán como `const`.

### 4.1 Inicio — `/`

**Flujo de datos y carga:** la vista comienza con la colección de alojamientos como array vacío (`[]`) y `loading = true`. Un `useEffect` simula la obtención de datos mediante `setTimeout` de aproximadamente un segundo; al completar, establece los datos simulados y pone `loading = false`. El efecto debe limpiar el temporizador si la vista se desmonta. Mientras `loading` sea verdadero, mostrar `LoadingIndicator`; al finalizar, presentar resultados o el estado vacío.

**Búsqueda y categoría:** `SearchBar` mantiene el texto controlado con `useState`. La lista visible se deriva de los datos ya cargados aplicando conjuntamente la búsqueda por nombre o ubicación y la categoría activa. La búsqueda debe ignorar diferencias entre mayúsculas y minúsculas y espacios iniciales/finales. Una categoría sin selección (estado inicial `null`) no restringe resultados. Al cambiar texto o categoría, el resultado se actualiza en tiempo real sin requerir envío de formulario. Los filtros se aplican al conjunto cargado, no modifican los datos originales. Si el conjunto resultante está vacío, mostrar un mensaje de “No se encontraron alojamientos” (o equivalente) y no dejar la cuadrícula en blanco.

| Componente | Responsabilidad y props previstas | Estado / eventos | Uso |
| --- | --- | --- | --- |
| `Navbar` | Navegación global; compone `Logo`, `SearchBar` y controles/iconos del menú de usuario. Props: `searchValue: string`, `onSearchChange: (value: string) => void` si integra búsqueda. | Sin estado requerido; delega cambios al padre. | Home; reutilizable en Catálogo y, si las capturas lo requieren, Detalle. |
| `Logo` **(reutilizable)** | Componente de identidad propio, inspirado visualmente en la referencia sin copiar el logo oficial; representación original mediante SVG o recurso local. Props: `href?: string`, `className?: string`, `showWordmark?: boolean`. | Sin estado; enlace opcional al inicio mediante `Link`. | `Navbar` de las vistas que la incluyan. |
| `SearchBar` **(reutilizable)** | Campo controlado para buscar por nombre o ubicación. Props: `value: string`, `onChange: (value: string) => void`, `placeholder?: string`. | El estado vive en la vista propietaria; propaga cambios con `onChange`. | Home y otras vistas si incorporan búsqueda. |
| `CategoryFilters` | Fila horizontal desplazable con las categorías iniciales Todo, Alojamientos y Hoteles. Props: `categories: Category[]`, `activeCategoryId: string \| null`, `onCategoryChange: (id: string \| null) => void`. | Todo representa `null` (sin filtro); seleccionar una categoría actualiza resultados y resaltado. | Home. |
| `AccommodationCard` **(reutilizable)** | Tarjeta con imagen placeholder, título, ubicación, precio por noche y valoración con estrellas. Props: `accommodation: Accommodation`. | Sin estado. Enlace a `/rooms/${accommodation.id}` mediante `Link`. | Home y Catálogo. |
| `AccommodationGrid` **(reutilizable)** | Presenta tarjetas; props: `accommodations: Accommodation[]`, `emptyMessage?: string`. | Sin estado; muestra el vacío explícitamente si procede. | Home y Catálogo. |
| `LoadingIndicator` **(reutilizable)** | Indica carga simulada, con semántica accesible. Props: `label?: string`. | Sin estado. | Home, Catálogo y Detalle. |

### 4.2 Catálogo — `/catalog`

La vista carga alojamientos simulados y muestra el número de resultados disponibles. `SortSelector` ordena por precio ascendente o descendente usando estado, sin mutar el array original. Se reutilizan `AccommodationCard` y `AccommodationGrid`; cada tarjeta enlaza al detalle usando el mismo `id`. `MapPlaceholder` es un bloque gris rotulado exactamente “Mapa”: debajo del listado en móvil y a su derecha en escritorio. El mapa interactivo real es opcional y no se implementa en la primera fase.

| Componente | Responsabilidad y props previstas | Estado / eventos | Uso |
| --- | --- | --- | --- |
| `ResultsHeader` | Presenta el número de alojamientos. Props: `count: number`. | Sin estado; contar la colección de resultados que se presenta. | Catálogo. |
| `SortSelector` | Controla orden por precio. Props: `value: SortOrder`, `onChange: (value: SortOrder) => void`. | `SortOrder` con `useState` en Catálogo; el cambio vuelve a ordenar resultados. | Catálogo. |
| `AccommodationCard` **(reutilizable)** | Tarjeta común descrita para Home. | Navega al detalle con `Link`. | Home y Catálogo. |
| `AccommodationGrid` **(reutilizable)** | Presentación responsive compartida de tarjetas. | Sin estado propio. | Home y Catálogo. |
| `MapPlaceholder` | Bloque gris con texto “Mapa”. Props opcionales: `className?: string`, `label?: string` (por defecto “Mapa”). | Sin estado ni eventos. | Catálogo. |
| `LoadingIndicator` **(reutilizable)** | Indicador compartido durante carga. | Sin estado. | Todas las vistas que carguen datos. |

### 4.3 Detalle — `/rooms/[id]`

Obtener `id` del segmento dinámico de URL `/rooms/[id]` según las APIs vigentes del App Router. Inicializar sin alojamiento y con `loading = true`; un `useEffect` simula la obtención mediante `setTimeout` de aproximadamente un segundo, luego establece el registro correspondiente y desactiva la carga. Limpiar el temporizador al desmontar o si cambia el `id`. Mostrar `LoadingIndicator` mientras carga. Si el id no existe, presentar un estado de alojamiento no encontrado y un enlace de regreso al catálogo.

| Componente | Responsabilidad y props previstas | Estado / eventos | Uso |
| --- | --- | --- | --- |
| `BackNavigation` | Enlace de retorno a `/catalog`. Props: `href?: string` (por defecto `/catalog`), `label?: string`. | Sin estado; navegación con `Link`. | Detalle. |
| `PhotoGallery` | Galería de imágenes placeholder. Props: `images: string[]`, `title: string`. | Índice con `useState<number>`; controles “Anterior” y “Siguiente” actualizan el índice y lo mantienen dentro del rango. Si el ciclo es circular o se limita en extremos, confirmarlo en decisiones de interacción antes de codificar. | Detalle. |
| `AccommodationHeader` | Título, ubicación, estrellas y número de reseñas. Props: `title: string`, `location: string`, `rating: number`, `reviewCount: number`. | Sin estado. | Detalle. |
| `HostInfo` | Avatar placeholder, nombre y años como anfitrión. Props: `host: Host`. | Sin estado. | Detalle. |
| `AmenitiesGrid` | Cuadrícula de servicios con iconos y etiquetas. Props: `amenities: Amenity[]`. Usar recursos SVG/locales o representación propia, sin biblioteca de componentes. | Sin estado. | Detalle. |
| `BookingCard` | Precio por noche, cantidad de huéspedes y botón de reserva. Props: `pricePerNight: number`, `guestCount: number`, `minGuests: number`, `maxGuests: number`, `onGuestCountChange: (count: number) => void`, `onReserve?: () => void`. | Coordina con `GuestCounter`; no requiere backend ni reserva transaccional. | Detalle. |
| `GuestCounter` | Controles para aumentar/disminuir huéspedes. Props: `value: number`, `min: number`, `max: number`, `onChange: (value: number) => void`. | Estado del valor en el padre/tarjeta con `useState`; nunca decrementa bajo mínimo ni incrementa sobre máximo. | Dentro de `BookingCard`. |
| `LoadingIndicator` **(reutilizable)** | Estado visible durante carga simulada. | Sin estado. | Detalle y demás vistas. |

**Opcional, no obligatorio en la primera fase:** campos de fechas y cálculo del precio total según noches. No sustituye los requisitos de precio por noche y contador de huéspedes.

### 4.4 Contratos y composición

Los contratos son propuestas funcionales para guiar implementación; pueden refinarse por evidencia visual sin alterar responsabilidades. El estado vive en la vista/contenedor que coordina componentes controlados. Relaciones principales: `Navbar` compone `Logo` y `SearchBar`; páginas de resultados presentan `AccommodationGrid`, que contiene `AccommodationCard`; Detalle compone galería e información, y `BookingCard` utiliza `GuestCounter`. Las composiciones visuales exactas se documentan en Vision-to-Spec.

## 5. Arquitectura inicial y tipos

Estructura prevista, a ajustar según evolucione la implementación:

```text
app/
  layout.tsx
  page.tsx                    # Home: /
  catalog/
    page.tsx                  # Catálogo: /catalog
  rooms/
    [id]/
      page.tsx                # Detalle: /rooms/[id]
components/
  layout/
    Navbar.tsx
    Logo.tsx
    BackNavigation.tsx
  search/
    SearchBar.tsx
  listings/
    AccommodationCard.tsx
    AccommodationGrid.tsx
    CategoryFilters.tsx
    ResultsHeader.tsx
    SortSelector.tsx
    LoadingIndicator.tsx
    MapPlaceholder.tsx
  room/
    PhotoGallery.tsx
    AccommodationHeader.tsx
    HostInfo.tsx
    AmenitiesGrid.tsx
    BookingCard.tsx
    GuestCounter.tsx
types/
  accommodation.ts
  host.ts
  category.ts
data/
  accommodations.ts
```

La estructura anterior es una propuesta, no un conjunto de archivos que deban crearse en esta fase. Los tipos serán estructuras explícitas en TypeScript para los datos compartidos entre rutas y componentes. Como punto de partida se prevén tipos para alojamientos/listados, detalle de habitación, búsqueda y, si hace falta, ordenación y huéspedes. Sus campos concretos quedan pendientes del modelo de datos y las referencias.

### 5.1 Modelo TypeScript propuesto

```ts
export interface Accommodation {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  categoryIds: string[];
  images: string[];
  host: Host;
  amenities: Amenity[];
  minGuests: number;
  maxGuests: number;
}

export interface Host {
  id: string;
  name: string;
  avatarUrl: string;
  yearsHosting: number;
}

export interface Amenity {
  id: string;
  label: string;
  icon: string; // identificador de recurso/icono local; no dependencia de UI
}

export interface Category {
  id: string;
  label: string;
}

export type SortOrder = "asc" | "desc";
```

Este es un modelo inicial propuesto. `Accommodation` concentra los datos compartidos por Home, Catálogo y Detalle; las tarjetas generan `/rooms/${accommodation.id}` y Detalle localiza por el mismo identificador. Los datos de ejemplo deben proceder de una fuente compartida (por ejemplo, `data/accommodations.ts`) para mantener coherentes títulos, precios, anfitriones, categorías, imágenes y servicios. Las URLs placeholder y el contenido concreto se decidirán posteriormente. El tipo de icono puede refinarse a una unión de identificadores cuando se seleccionen recursos.

En el estado actual del repositorio se observan `app/`, `components/` y `public/`; dentro de `app/` existen `layout.tsx`, `page.tsx` y `globals.css`, y en `components/` existe `ProductCard.tsx`. La carpeta `types/` y las rutas de catálogo y detalle forman parte de la arquitectura prevista, no de la estructura existente confirmada.

## 6. Restricciones técnicas

### Requisitos conocidos

- Next.js 16 con App Router, React y TypeScript; el proyecto ya está inicializado.
- Tailwind CSS para los estilos; no reinstalar ni reconfigurar el proyecto como parte del ejercicio.
- Diseño mobile-first, tomando 375 px como referencia inicial y adaptando a escritorio desde 768 px.
- Componentes funcionales pequeños, reutilizables y con responsabilidades individuales.
- Navegación interna mediante `Link` de Next.js.
- `useState` para gestionar búsqueda, categorías, ordenación, galería y huéspedes según corresponda.
- `useEffect` para simular la carga de datos.
- Mantener separadas las rutas en `app/`, los componentes en `components/` y los tipos en `types/`.
- No usar bibliotecas de componentes preconstruidos como shadcn, MUI, Chakra o Ant Design.
- Tailwind CSS es la única solución de estilos: no usar estilos inline ni hojas CSS adicionales por componente. `globals.css` queda para reglas globales/configuración existente.
- Componentes funcionales declarados como `const`, pequeños y con responsabilidades individuales; objetivo ideal de menos de 80 líneas entre JSX y lógica por componente.
- Navegación interna con `Link` de Next.js, incluidos enlaces a `/catalog` y `/rooms/[id]`.
- Inspiración visual en la identidad gráfica de Airbnb, sin copiar código fuente original.
- Reutilizar componentes compartidos y no duplicar implementaciones equivalentes entre rutas.
- No reconfigurar el proyecto ni instalar dependencias para este ejercicio.

### Decisiones iniciales y límites visuales

El análisis externo describe una composición predominantemente blanca, texto oscuro, secundarios grises, acentos rosa/rojo, tipografía sans-serif, controles redondeados, fotografías grandes con bordes redondeados, espaciado compacto y separación clara entre secciones. No se fijan valores exactos de color, tipografía, dimensiones o espaciado que no estén medidos. La referencia disponible es móvil; la adaptación exacta de escritorio queda pendiente, excepto los requisitos responsive P0 establecidos.

Los requisitos P0 priman sobre diferencias de la captura: la búsqueda, logo y menú deben estar presentes aunque el logo completo no se muestre en la referencia; la cuadrícula móvil obligatoria prevalece sobre los carruseles observados.

### Decisiones pendientes

Quedan por validar los detalles visuales específicos (valores de color, medidas, tamaños, espaciados y tipografía), recursos locales/placeholder, iconografía propia, contenido de datos y acciones no requeridas. La búsqueda usa el comportamiento definido para Home en su documento SDD. El mapa de Catálogo se mantiene como placeholder en primera fase; el mapa interactivo es opcional.

## 7. Vision-to-Spec e inventario de capturas

Esta sección distingue los requisitos de 4Geeks, las observaciones de la captura suministradas externamente y las decisiones de diseño del proyecto. El análisis visual de Home que sigue procede de observaciones proporcionadas por el usuario; **Copilot no inspeccionó directamente el contenido visual de `airbnb.png`**. Por ello, se conserva como descripción atribuida y no como medición o verificación propia. El archivo fue identificado con dimensiones de 750 × 6942 px; estas dimensiones no determinan por sí solas el viewport exacto.

### Home (`/`) — referencia móvil incorporada

La referencia se describe como Home de Airbnb España en móvil, de aproximadamente 375 px:

1. **Cabecera y filtros:** fondo blanco; búsqueda horizontal tipo píldora con lupa, texto “Empieza a buscar” y borde/sombra sutiles. Debajo, filtros redondeados con iconos y etiquetas Todo, Alojamientos y Hoteles, con estado activo visualmente diferenciado. La descripción indica que no se ve un logotipo completo.
2. **Alojamientos:** secciones agrupadas por ubicación/disponibilidad, encabezados y flechas circulares; tarjetas en carrusel horizontal con fotografía grande redondeada, corazón, distintivo opcional, título, fechas, precio total y valoración numérica con estrella.
3. **Experiencias (P2):** sección “Descubre experiencias cerca de ti”, título, flecha circular y carrusel de tarjetas con imagen redondeada y texto; se describen Rutas culturales, Lugares emblemáticos y Rutas culinarias.
4. **Navegación inferior (P2):** barra blanca con Explorar, Favoritos e Iniciar sesión; Explorar resaltado. Esta observación no especifica rutas ni acciones requeridas.
5. **Zona inferior (P2):** inspiración para futuras escapadas, temas/destinos y footer informativo con enlaces y controles regionales/sociales.
6. **Estilo general:** predominio de blanco, texto oscuro, grises secundarios, acentos rosa/rojo, sans-serif, controles redondeados, imágenes grandes redondeadas, espaciado compacto y separación entre secciones. No se infieren valores exactos.

**Decisiones y prioridad:** P0 conserva todos los requisitos de 4Geeks: cabecera con logo/identidad propia, búsqueda y menú de usuario; categorías controladas; tarjeta con contenido obligatorio; cuadrícula de una columna en 375 px y varias desde 768 px. El grid prevalece sobre los carruseles observados. La identidad será un componente/logo propio, inspirado visualmente en patrones generales de la referencia, sin reproducir el logo oficial ni activos propietarios. Las categorías iniciales son exclusivamente Todo, Alojamientos y Hoteles; Todo representa `null` (sin filtro) y los datos deben demostrar los filtros de las otras dos. P1 se limita a mejoras visuales compatibles y de baja complejidad. Experiencias, carruseles, navegación inferior, inspiración y footer ampliado son P2, fuera del alcance inicial y requieren aprobación.

La captura aporta solo evidencia móvil. No se ha proporcionado una referencia de escritorio; se aplican los requisitos responsive P0, sin presentar un layout desktop como observado. El análisis detallado de componentes, estados y aceptación de Home está en `specs/001-home/spec.md`; el plan y tareas están en `plan.md` y `tasks.md`.

### Catálogo (`/catalog`) y Detalle (`/rooms/[id]`)

No se han incorporado capturas para estas vistas. Sus composiciones visuales específicas, jerarquías, relaciones de layout y diferencias responsive quedan pendientes de referencias. Se mantienen los requisitos funcionales documentados en las secciones 3 y 4.

### Inventario de capturas

| Vista | Captura / referencia | Tamaño o viewport | Estado del análisis |
| --- | --- | --- | --- |
| Inicio (`/`) | `airbnb.png`; observaciones visuales suministradas externamente | Archivo: 750 × 6942 px; descripción de referencia cercana a 375 px móvil, no verificada directamente por Copilot | Incorporada y documentada arriba; sin evidencia de escritorio |
| Catálogo (`/catalog`) | Pendiente de incorporar | Pendiente | Análisis visual pendiente |
| Detalle (`/rooms/[id]`) | Pendiente de incorporar | Pendiente | Análisis visual pendiente |

## 9. Checklist de aceptación

### Requisitos obligatorios — Home (`/`)

- [ ] `Navbar` incluye logo/identidad propia, búsqueda e iconos/controles del menú de usuario.
- [ ] `Logo` es un componente propio inspirado visualmente en la referencia, implementado con SVG propio o recurso local y sin copiar el logo oficial ni usar biblioteca de componentes.
- [ ] `SearchBar` controlado con `useState`, filtra en tiempo real por nombre o ubicación.
- [ ] `CategoryFilters` ofrece Todo, Alojamientos y Hoteles; Todo es el valor inicial sin filtro y la selección/resaltado funcionan.
- [ ] Búsqueda y categoría se combinan para obtener los resultados visibles.
- [ ] Se muestra un estado vacío explícito sin coincidencias.
- [ ] Tarjeta con imagen placeholder, título, ubicación, precio por noche y estrellas.
- [ ] Cuadrícula de una columna a 375 px y varias columnas en escritorio.
- [ ] Carga inicial con array vacío y `loading=true`; `useEffect`/`setTimeout` de ~1 s, carga y limpieza del temporizador.

### Requisitos obligatorios — Catálogo (`/catalog`)

- [ ] `ResultsHeader` presenta contador de resultados.
- [ ] `SortSelector` ordena precio ascendente/descendente mediante estado.
- [ ] Se reutilizan `AccommodationCard` y `AccommodationGrid` (o lista equivalente).
- [ ] `MapPlaceholder` es gris y contiene el texto “Mapa”.
- [ ] Mapa debajo del listado en móvil y a la derecha en escritorio.
- [ ] Tarjetas navegan al detalle con `Link` e id coherente.
- [ ] Indicador visible durante la carga simulada.
- [ ] No implementar mapa interactivo en primera fase (opcional).

### Requisitos obligatorios — Detalle (`/rooms/[id]`)

- [ ] `BackNavigation` enlaza a `/catalog`.
- [ ] `PhotoGallery` usa imágenes placeholder y controles Anterior/Siguiente con índice en `useState`.
- [ ] `AccommodationHeader` muestra título, ubicación, estrellas y número de reseñas.
- [ ] `HostInfo` muestra avatar placeholder, nombre y años como anfitrión.
- [ ] `AmenitiesGrid` muestra servicios con iconos y etiquetas.
- [ ] `BookingCard` muestra precio/noche, huéspedes y botón de reserva.
- [ ] `GuestCounter` respeta límites mínimo y máximo.
- [ ] Obtención del id de ruta y carga simulada con `useEffect`/`setTimeout` e indicador visible.
- [ ] Id inexistente produce estado no encontrado manejable.

### Requisitos obligatorios — Globales

- [ ] Rutas App Router: `/`, `/catalog` y `/rooms/[id]`.
- [ ] Componentes funcionales `const`, pequeños y de responsabilidad única; idealmente menos de 80 líneas de JSX y lógica por componente.
- [ ] Tipos TypeScript para alojamiento, anfitrión, servicios y categorías.
- [ ] Datos coherentes compartidos entre vistas e identificadores coincidentes.
- [ ] Mobile-first desde 375 px y adaptación a escritorio desde 768 px.
- [ ] Tailwind CSS como única solución de estilos; sin estilos inline.
- [ ] Navegación interna mediante `Link` de Next.js.
- [ ] `useState` y `useEffect` según estados e interacciones especificados.
- [ ] Sin bibliotecas de componentes preconstruidos; inspiración Airbnb sin copiar código fuente.
- [ ] Rutas en `app/`, componentes en `components/`, tipos en `types/`; datos compartidos opcionalmente en `data/`.
- [ ] Sin instalación de dependencias ni reconfiguración innecesaria.

### Opcional / fuera de la primera fase

- [ ] Mapa interactivo real.
- [ ] Campos de fechas y cálculo del precio total por estancia.
- [ ] Backend, disponibilidad real o reserva transaccional.

Los elementos opcionales no bloquean la aceptación de las vistas. Las decisiones visuales documentadas para Home proceden de observaciones externas; los detalles exactos no suministrados y las referencias visuales de Catálogo y Detalle se incorporarán a Vision-to-Spec cuando estén disponibles.
