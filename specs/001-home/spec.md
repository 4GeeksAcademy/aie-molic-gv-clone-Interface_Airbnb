# Especificación funcional y visual de Home

- **Vista:** Home (`/`)
- **Estado:** especificación documental; no implementado.
- **Fuente de requisitos:** `context.md` y enunciado 4Geeks Academy.
- **Referencia visual:** análisis externo proporcionado por el usuario para `airbnb.png`; las observaciones visuales de este documento proceden de ese análisis. Copilot no inspeccionó directamente el contenido de la imagen.

## Prioridad de requisitos

- **P0 — obligatorio 4Geeks:** navegación con logo y menú de usuario, búsqueda y categorías con estado, carga simulada, estado de carga, grid responsive, tarjetas con contenido requerido, enlaces `Link`, TypeScript, Tailwind, componentes pequeños.
- **P1 — mejora visual compatible aprobada:** fotografías grandes con esquinas redondeadas, ubicación visible, iconos originales para categorías, corazón decorativo sin funcionalidad de favoritos y distintivo de recomendación opcional. No añadir interacciones nuevas.
- **P2 — extensión fuera del MVP:** carruseles horizontales, experiencias, barra inferior móvil, sección de inspiración y footer ampliado. No implementar sin aprobación expresa.

## 1. Objetivo y alcance

Ofrecer el punto de entrada para explorar alojamientos. En esta fase Home presenta cabecera, búsqueda en tiempo real por nombre o ubicación, filtros por categoría, estados de carga y vacío y una cuadrícula de tarjetas. La vista usa datos simulados compartibles posteriormente con Catálogo y Detalle. La cuadrícula es la base obligatoria aunque la referencia muestra carruseles en móvil.

Quedan fuera de alcance la implementación de esas vistas, backend, reserva transaccional y cualquier funcionalidad no requerida. La identidad será un componente `Logo` propio, inspirado visualmente en patrones generales de la referencia, con SVG original o recurso local; no copiará el logo oficial ni activos propietarios de Airbnb.

## 2. Requisitos funcionales obligatorios

1. Mostrar `Header`/`Navbar` con logo o identidad original, búsqueda e iconos o controles del menú de usuario. En móvil, distribuir o compactar estos elementos para que entren en el espacio disponible sin eliminar logo ni menú requeridos. La referencia no permite afirmar cómo resolverlos, dado que su descripción indica que el logotipo completo no es visible.
2. Mostrar `CategoryFilters` en una fila horizontal desplazable con Todo, Alojamientos y Hoteles como categorías iniciales. `Todo` representa `null` (sin filtro), es el estado inicial y permite retirar cualquier filtro. Alojamientos y Hoteles son filtros distintos; los datos simulados deben incluir registros que permitan comprobar resultados diferenciados de ambos. La categoría activa debe reflejarse visualmente.
3. Mostrar alojamientos mediante tarjetas con imagen placeholder, título, ubicación, precio por noche y valoración en estrellas. Como P1 aprobado, usar fotografías grandes redondeadas, corazón decorativo sin acción de favorito y distintivo de recomendación opcional. Los iconos de categorías serán originales/locales. No añadir interacciones nuevas.
4. Mostrar una columna de tarjetas en 375 px y varias columnas en escritorio a partir del breakpoint objetivo de 768 px.
5. Empezar con lista vacía (`[]`) y `loading=true`. Un `useEffect` inicia una simulación con `setTimeout` de aproximadamente 1 segundo; al resolver, carga los datos y pone `loading=false`. Limpiar el temporizador al desmontar.
6. Mostrar un indicador visible mientras carga.
7. Combinar búsqueda y categoría: filtrar por nombre o ubicación, sin distinguir mayúsculas/minúsculas y recortando espacios exteriores, y simultáneamente por categoría activa. `null` significa sin filtro de categoría. Los resultados se derivan sin mutar la colección original.
8. Actualizar resultados al escribir o cambiar categoría, sin requerir envío explícito.
9. Mostrar un mensaje explícito, por ejemplo “No se encontraron alojamientos”, cuando no haya coincidencias.
10. Cada tarjeta ofrece navegación interna al detalle con `Link` de Next.js, hacia `/rooms/${id}`, usando el identificador estable de datos compartidos.

## 3. Componentes y contratos propuestos

Tipos completos en la sección 4. Los componentes son funciones declaradas como `const`, con responsabilidad individual. Las props son contratos previstos que podrán ajustarse sin cambiar requisitos.

| Componente | Responsabilidad | Props previstas | Estado/eventos | Reutilización |
| --- | --- | --- | --- | --- |
| `HomePage`/contenedor de `app/page.tsx` | Coordinar datos, carga, búsqueda, categoría y resultados. | Sin props de ruta. | `useState` para `Accommodation[]`, `loading`, `searchValue`, `activeCategoryId`; `useEffect` para carga simulada. | Propia de Home; establece patrón de datos para futuras rutas. |
| `Header` / `Navbar` | Cabecera global; compone logo, búsqueda y controles/iconos del menú de usuario. En móvil preservar espacio y legibilidad; composición final se valida visualmente. | `searchValue: string`; `onSearchChange: (value: string) => void`. | Delegar cambios al contenedor; sin estado requerido. | Reutilizable en Catálogo y posiblemente Detalle, sujeto a sus specs. |
| `Logo` | Mostrar componente/logo propio, inspirado visualmente en la referencia sin reproducir el logo oficial; usar SVG original o recurso local. | `href?: string`, `className?: string`, `showWordmark?: boolean`. | Sin estado; si enlaza al inicio, usar `Link`. | Reutilizable. |
| `SearchBar` | Campo de búsqueda controlado. | `value: string`, `onChange: (value: string) => void`, `placeholder?: string`. | `onChange` en cada entrada; estado controlado por padre. | Reutilizable si otras vistas requieren búsqueda. |
| `CategoryFilters` | Fila de filtros redondeados con iconos y etiquetas. Los elementos observados son Todo, Alojamientos y Hoteles. Distinguir el activo. | `categories: Category[]`, `activeCategoryId: string \| null`, `onCategoryChange: (id: string \| null) => void`. | Selección notificada al padre. | Home. |
| `CategoryFilter` | Elemento individual de filtro, con icono/etiqueta y apariencia activa/inactiva. | `category: Category`, `active: boolean`, `onSelect: (id: string \| null) => void`. | Click/teclado invoca selección; sin estado propio. | Dentro de `CategoryFilters`; reutilización opcional. |
| `AccommodationCard` | Tarjeta base con fotografía placeholder/recurso local grande y redondeada, título, ubicación, precio/noche, valoración con estrella y `Link`. Puede mostrar corazón decorativo y distintivo de recomendación opcional. | `accommodation: Accommodation`; distintivo opcional solo si el modelo lo contempla. | Sin estado; corazón no interactivo. Enlace a `/rooms/${accommodation.id}`. | Reutilizable en Home y Catálogo. |
| `AccommodationGrid` | Presentar tarjetas responsive y estado vacío. | `accommodations: Accommodation[]`, `emptyMessage?: string`. | Sin estado; renderiza tarjetas/estado vacío. | Reutilizable en Home y Catálogo. |
| `LoadingIndicator` | Mostrar estado de carga visible y semántico. | `label?: string`. | Sin estado. | Reutilizable en las tres vistas. |
| `ExperienceSection` (P2) | Sección propuesta de experiencias cercanas, con encabezado y tarjetas. | Contrato por definir si se aprueba. | No incluir en MVP/tareas P0. | Extensión visual. |
| `AccommodationSection` (opcional) | Encabezado de sección con título y agrupación de alojamientos; conserva `AccommodationGrid`, no convierte resultados en carrusel. | `title: string`, `accommodations: Accommodation[]`. | Sin estado requerido. | Fuera de las tareas Home aprobadas; considerar en otra fase si se solicita. |
| `MobileBottomNav` (P2) | Navegación inferior inspirada en la referencia, sin rutas ni acciones no aprobadas. | Props y acciones por definir. | No implementar en MVP. | Extensión visual móvil. |

### Componentes secundarios observados, no obligatorios

`ExperienceSection` se describe visualmente como título alineado a la izquierda, botón circular con flecha y carrusel horizontal de tarjetas de experiencias con imagen redondeada, texto breve y parte de la tarjeta siguiente visible. Ejemplos de rótulos: Rutas culturales, Lugares emblemáticos y Rutas culinarias. Esto es P2: no incluir en la primera implementación.

Las secciones de alojamientos observadas agrupan tarjetas bajo títulos como “Quédate en Tenerife”, “Quédate en Alicante”, “Alojamientos en Sevilla” y “Disponibles en Granada este fin de semana”; muestran encabezado y flecha circular. Esta agrupación no está incluida en las decisiones P1 aprobadas ni en las tareas de Home. No afirmar que las etiquetas/fechas/valores de la captura sean datos requeridos.

### Relaciones

`HomePage` coordina estado y datos. Renderiza `Navbar` (`Logo` + `SearchBar`), `CategoryFilters` y, dependiendo de `loading`, `LoadingIndicator` o `AccommodationGrid`. El grid compone `AccommodationCard`. Los filtros son controlados: hijos reciben valores/handlers y el contenedor conserva el estado.

## 4. Tipos TypeScript previstos

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
  icon: string;
}

export interface Category {
  id: string;
  label: string;
  icon?: string;
}
```

Home consume `Accommodation` y `Category`; el modelo común se conserva para que futuras vistas compartan los mismos IDs. No fijar ahora contenido de ejemplo ni recursos concretos. Las estructuras pueden ubicarse en módulos separados bajo `types/` según plan técnico.

## 5. Estados e interacciones

- `accommodations`: empieza como `Accommodation[] = []`.
- `loading`: empieza en `true`.
- `searchValue`: empieza en cadena vacía.
- `activeCategoryId`: empieza en `null`, que representa visualmente Todo y no restringe resultados; Alojamientos y Hoteles activan su filtro correspondiente. Debe poderse volver a Todo para retirar el filtro.
- `useEffect`: crea el timeout de aproximadamente 1000 ms; al finalizar establece datos simulados y `loading=false`; devuelve cleanup con `clearTimeout`.
- Resultados visibles: derivar desde `accommodations` filtrando (a) nombre o ubicación por `searchValue.trim().toLocaleLowerCase()` o normalización equivalente y (b) pertenencia de `activeCategoryId` a `categoryIds`. No alterar la fuente.
- El `LoadingIndicator` prevalece mientras `loading`; tras cargar, mostrar grid o mensaje vacío.
- `SearchBar` y `CategoryFilters` no navegan ni hacen solicitudes reales.
- `AccommodationCard` usa `Link` a la ruta dinámica prevista. Home no crea ni implementa esa página en esta fase.

## 6. Navegación

La navegación interna usa `Link` de Next.js. Cada tarjeta enlaza a `/rooms/{id}` con el `id` del registro común. Mientras Detalle no exista, ese enlace puede terminar en una página not-found; esto es temporal y no constituye navegación completa del ejercicio. Futuramente se integrarán enlaces entre Home (`/`), Catálogo (`/catalog`) y Detalle (`/rooms/[id]`) conforme a sus SDD; esta fase no crea esas rutas. `Logo` puede enlazar a `/`.

## 7. Diseño responsive y restricciones

- Mobile-first con 375 px como ancho de referencia; adaptar desde 768 px.
- `AccommodationGrid`: una columna en 375 px y varias en escritorio. Este requisito P0 tiene prioridad sobre los carruseles que aparecen en la captura. Cantidad exacta de columnas queda pendiente de pruebas y decisiones de layout.
- Categorías: fila horizontal de filtros redondeados, con iconos/etiquetas; puede desplazarse en móvil. La taxonomía inicial adoptada es Todo, Alojamientos y Hoteles.
- Cabecera móvil: la referencia descrita no muestra un logotipo completo, pero P0 exige logo y menú de usuario. Reservarles una composición compacta compatible con 375 px; no ocultarlos para imitar la captura. Ubicación y dimensiones exactas por validar.
- Fondo predominantemente blanco, textos oscuros, secundarios grises, acentos rosa/rojo, sans-serif, fotografías grandes redondeadas, espaciado compacto y separación clara entre secciones son observaciones generales del análisis externo. No asignar valores de color, fuente, radio, margen o tamaño exactos no proporcionados.
- A partir de 768 px adaptar navegación y presentación al escritorio; el comportamiento concreto queda pendiente de una captura de escritorio.
- Usar Tailwind CSS; sin estilos inline ni bibliotecas de componentes preconstruidos.
- Componentes funcionales `const`, pequeños y de responsabilidad única; ideal menor de 80 líneas entre JSX y lógica.
- No instalar dependencias, reconfigurar, copiar código o logo de Airbnb ni implementar rutas fuera de Home.

## 8. Vision-to-Spec: referencia `airbnb.png`

### Observaciones visuales suministradas por análisis externo

La referencia representa la Home de Airbnb España en móvil, de aproximadamente 375 px de ancho. Se registran estas observaciones como insumo descriptivo suministrado por el usuario, no como interacciones verificadas ni mediciones exactas:

1. **Cabecera y búsqueda:** fondo blanco; campo horizontal tipo píldora, lupa, texto “Empieza a buscar” y borde/sombra muy sutil. Debajo, fila de filtros redondeados con iconos y etiquetas Todo, Alojamientos y Hoteles; activa con fondo ligeramente distinto. La descripción indica que no se ve un logotipo completo.
2. **Experiencias (P2):** sección “Descubre experiencias cerca de ti”; título a izquierda, botón circular con flecha y tarjetas en carrusel horizontal, imagen redondeada, texto breve y siguiente tarjeta parcialmente visible. Ejemplos: Rutas culturales, Lugares emblemáticos, Rutas culinarias.
3. **Alojamientos:** secciones agrupadas por ubicación/disponibilidad, con títulos citados en la sección 3. Encabezado izquierdo, botón circular de flecha y tarjetas horizontales espaciadas con fotografía grande redondeada. Tarjetas descritas con corazón arriba a la derecha, distintivo “Recomendación del viajero” en algunas, título, fechas, precio total y valoración numérica con estrella.
4. **Conflicto de layout:** la referencia presenta carruseles horizontales de alojamientos en móvil, pero 4Geeks exige cuadrícula de una columna en móvil y varias en escritorio. Para P0 prevalece `AccommodationGrid`. Carruseles solo P2 y sujetos a aprobación.
5. **Navegación inferior móvil (P2):** barra fija blanca, iconos/etiquetas Explorar, Favoritos e Iniciar sesión; Explorar resaltado rosa/rojo. Observación visual, no requisito de rutas ni funcionalidad.
6. **Parte inferior (P2):** “Inspiración para futuras escapadas”, pestañas temáticas (Populares, Playa, Ciudades, Histórico), destinos, enlaces de asistencia, anfitriones, información corporativa, idioma, moneda, redes sociales y enlaces legales. No implementar en MVP.
7. **Identidad general:** fondo predominantemente blanco; texto oscuro, grises secundarios, acentos rosa/rojo, sans-serif, imágenes grandes con esquinas redondeadas, espaciado compacto, separación clara y controles/filtros redondeados. No se especifican valores exactos.

### Separación de fuente y requisitos

- Todo requisito de comportamiento (búsqueda, datos, carga, grid, contenido mínimo de tarjeta y `Link`) proviene de 4Geeks/contexto y es P0.
- Los rasgos visuales del listado anterior provienen del análisis externo de la captura y no prueban comportamiento dinámico.
- `AccommodationCard` debe cumplir siempre P0: placeholder/recurso local, título, precio por noche, valoración con estrella y navegación. Ubicación y rasgos visuales adicionales no sustituyen estos campos.
- Integrar logo y menú en cabecera móvil aunque no se vean completos en la captura; equilibrio exacto pendiente de decisión, no ocultarlos.
- No copiar marca/logo/recursos. La inspiración se limita a patrones generales.

## 9. Criterios de aceptación verificables

- **Carga:** antes de completar el timeout se ve indicador y no se muestran datos como ya cargados; tras aproximadamente 1 s aparecen datos simulados y el indicador desaparece. El timeout se cancela al desmontar.
- **Búsqueda:** texto parcial filtra por título o ubicación sin distinción de mayúsculas/minúsculas; borrar texto restaura los resultados compatibles con categoría.
- **Categoría:** Todo está activo al inicio y equivale internamente a `null`; seleccionar Alojamientos u Hoteles actualiza resultados y estado activo; volver a Todo quita el filtro. Los datos simulados deben permitir observar el filtrado de categorías.
- **Combinación:** con búsqueda y categoría activos, solo se muestran alojamientos que satisfacen ambos criterios.
- **Vacío:** una búsqueda/categoría sin coincidencias muestra mensaje claro y no una cuadrícula vacía sin explicación.
- **Tarjeta:** cada elemento muestra los cinco datos requeridos y conserva el id enlazado al detalle.
- **Responsive:** en viewport de 375 px el grid tiene una columna; en viewport de 768 px o más presenta varias columnas sin desbordamiento horizontal general.
- **Navegación:** cada tarjeta renderiza un `Link` interno con href `/rooms/{id}` coherente con el alojamiento.
- **Calidad:** TypeScript, ESLint y build de Next.js sin errores; no se añaden dependencias ni estilos inline.

### Criterios P1 visuales aprobados

- Las tarjetas presentan fotografía grande con esquinas redondeadas y ubicación visible; pueden mostrar un corazón decorativo no interactivo y un distintivo de recomendación opcional.
- Los filtros usan iconos originales/locales y forma redondeada; la categoría activa se distingue sin fijar valores exactos de color.
- Ningún elemento P1 añade interacciones: el corazón no gestiona favoritos ni el distintivo activa una recomendación funcional.

### Casos de prueba verificables

Ejecutar con el navegador/devtools y los scripts ya disponibles en el proyecto; no añadir dependencias ni herramientas. Registrar los resultados al cierre de HOME-016.

| Caso | Procedimiento | Resultado esperado |
| --- | --- | --- |
| Búsqueda por título | Tras carga, escribir un fragmento de un título de dato simulado. | Se muestran coincidencias por título; no se requiere submit. |
| Búsqueda por ubicación | Escribir un fragmento de ubicación que no aparezca en el título correspondiente. | El registro coincide por ubicación; mayúsculas y espacios exteriores no cambian el resultado. |
| Categorías | Seleccionar Alojamientos, Hoteles y luego Todo. | El estado activo cambia; resultados diferenciados según datos; Todo (`null`) restaura el conjunto sin filtro. |
| Combinación | Aplicar búsqueda y categoría compatibles simultáneamente. | Solo aparecen registros que satisfacen ambos criterios. |
| Sin resultados | Usar texto o combinación que no coincida. | Mensaje explícito de vacío visible; no queda un grid silenciosamente vacío. |
| Enlaces | Inspeccionar cada tarjeta y activar su enlace. | `href` es `/rooms/{id}` con id del registro; destino puede ser not-found temporal hasta implementar Detalle. |
| Responsive | Inspeccionar Home a 375 px y 768 px o más. | Una columna en móvil, varias desde 768 px, sin overflow horizontal general; cabecera retiene Logo, búsqueda y menú. |

### P2 fuera de la aceptación MVP

Experiencias/carrusel, carruseles de alojamientos, navegación inferior móvil, sección de inspiración y footer completo son extensiones no obligatorias. No forman parte de tareas de implementación obligatorias y requieren aprobación expresa.
