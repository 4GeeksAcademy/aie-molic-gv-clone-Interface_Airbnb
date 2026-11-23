# Especificación funcional y visual de Catálogo

- **Vista:** Catálogo (`/catalog`)
- **Estado:** implementación en curso; revisar criterios contra el navegador antes de declarar cierre.
- **Fuente funcional:** `context.md` y requisitos conocidos del ejercicio 4Geeks.
- **Referencia visual:** no se proporcionó captura de Catálogo. Vision-to-Spec queda pendiente; no se infiere una composición visual a partir de Home.

## 1. Objetivo y alcance

Permitir revisar los alojamientos disponibles, conocer el total presentado, ordenarlos por precio y ver un espacio reservado para mapa. Se cargan datos simulados; no hay backend ni mapa interactivo. Se reutilizan `AccommodationCard`, `AccommodationGrid` y `LoadingIndicator` de Home siempre que el estado actual de sus contratos siga siendo compatible.

**Incluye:** ruta `/catalog`, carga simulada de la fuente compartida `data/accommodations.ts`, encabezado con conteo, selector controlado de orden ascendente/descendente por precio, resultados y placeholder de mapa responsive. Mantener la identidad Stayfinder y reutilizar la `Navbar` existente cuando sea compatible; garantizar acceso a Catálogo con un `Link` de Next.js mediante el cambio mínimo requerido.

**No incluye:** búsqueda/filtros no definidos para esta ruta, filtros geográficos, llamadas de red, geolocalización, mapas interactivos, marcadores, reservas, paginación ni dependencias nuevas.

## 2. Requisitos funcionales

1. La ruta `/catalog` presenta los alojamientos de la fuente compartida, con estado inicial de carga y una simulación temporal cercana a un segundo. El efecto limpia su temporizador al desmontar.
2. Mientras carga, mostrar `LoadingIndicator`; tras cargar, mostrar los resultados o un estado vacío explícito.
3. Presentar `ResultsHeader` con el número de alojamientos actualmente mostrados. El conteo y el grid deben basarse en la misma lista ordenada/presentada; ordenar no cambia el total.
4. `SortSelector` es un control accesible que permite precio ascendente y descendente. Estado propietario en la página mediante `useState`; el orden inicial confirmado es `"asc"` (precio de menor a mayor).
5. Derivar la lista ordenada desde una copia (p. ej. `[...accommodations].sort(...)`); no mutar el módulo compartido. Para precios iguales, no se exige desempate específico; el orden estable del motor debe conservarse cuando aplique.
6. Renderizar resultados usando `AccommodationGrid` y `AccommodationCard` compartidos. Cada tarjeta mantiene el enlace `Link` existente a `/rooms/${id}`.
7. `MapPlaceholder` es una superficie gris con el texto exacto **“Mapa”**. No aparenta ser interactivo.
8. El placeholder del mapa permanece visible también durante la carga. En móvil (375 px), resultados primero y mapa después, sin sticky; desde 768 px, resultados a la izquierda y mapa a la derecha. Sin overflow horizontal general.
9. Presentación propia consistente con Stayfinder/Home: fondo blanco, texto oscuro, acentos rosa/rojo, bordes redondeados y controles visualmente coherentes con Home. Son decisiones de diseño, no observaciones de una captura de Catálogo.
10. `AccommodationGrid` admite `layout?: "default" | "catalog"`. El valor por defecto conserva las columnas de Home; Catálogo usa una columna hasta 1023 px y dos desde 1024 px, nunca más de dos. A 768 px el mapa queda a la derecha en una columna más estrecha, con grid de tarjetas de una columna para preservar su ancho. Desde 1024 px las dos zonas son aproximadamente 55% resultados / 45% mapa.
11. Las tarjetas de Catálogo permiten títulos de hasta dos líneas mediante `titleLines={2}`; Home conserva una línea por defecto. Mantener fotografía, ubicación, valoración y precio. Mostrar euros en ambas vistas con `Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })`, sin convertir ni editar los valores simulados.
12. Mapa con fondo gris claro, bordes redondeados y texto exacto “Mapa” centrado, sin interacción. En móvil mide 18rem y no es sticky. Entre 768 y 1023 px conserva altura moderada de 20rem y no es sticky. Desde 1024 px se alinea al inicio de resultados, usa altura `calc(100vh - 130px)` y `position: sticky` con offset superior `top-24`; la altura de viewport ofrece una presencia sostenida al desplazarse, sin estirarse según las filas. Ningún ancestro del mapa debe aplicar `overflow` que bloquee sticky.

## 3. Componentes, contratos y responsabilidades

| Componente | Responsabilidad y props previstas | Estado/eventos | Composición |
| --- | --- | --- | --- |
| `CatalogPage` (`app/catalog/page.tsx`) | Cargar/coordinar datos, estado de carga y ordenación; pasar resultados al layout. | `accommodations: Accommodation[]`, `isLoading: boolean`, `sortOrder: SortOrder` en `useState`; efecto de carga con cleanup. Selector actualiza orden. | Reutiliza `Navbar` con la mínima adaptación de props; contiene encabezado/selector, lista y mapa. |
| `ResultsHeader` | Comunicar el total presentado. Props: `count: number`. | Sin estado ni eventos. | Encima de resultados; puede compartir fila visual con controles de orden, sin imponer diseño exacto. |
| `SortSelector` | Selector de orden por precio. Props: `value: SortOrder`, `onChange: (value: SortOrder) => void`. Etiquetas claras para menor a mayor y mayor a menor. | Controlado; no conserva estado local. | En cabecera de resultados. |
| `AccommodationGrid` **(reutilizable)** | Mostrar array de alojamientos, tarjetas y estado vacío. Props actuales observadas: `accommodations: Accommodation[]`, opcional `isLoading`. | Sin estado requerido. | Columna de listado en Catálogo y grid compartido con Home; verificar el contrato real antes de implementación. |
| `AccommodationCard` **(reutilizable)** | Presentación compartida de cada alojamiento. Prop: `accommodation: Accommodation`; puede tener `priority` opcional según implementación actual. | Sin estado. | Dentro del grid; `Link` a `/rooms/{id}`. |
| `MapPlaceholder` | Superficie gris con etiqueta “Mapa”. Props previstas: `label?: string` (por defecto exacto “Mapa”), `className?: string` solo si se necesita composición. | Sin estado/interacción. | A la derecha del listado en desktop; debajo en móvil. |
| `LoadingIndicator` **(reutilizable)** | Estado visible y accesible de carga. | Sin estado. | Durante la carga de catálogo. |

### Relaciones de layout

La página dispone una zona de resultados y una zona de mapa. En móvil usa flujo vertical: navegación → encabezado/selector → lista y tarjetas → mapa. Desde 768 px usa dos columnas: resultados a la izquierda y mapa a la derecha; entre 768–1023 px se prioriza el ancho del listado y se mantiene el grid de tarjetas de una columna. Desde 1024 px las zonas se aproximan a 55/45, el grid admite dos tarjetas y el mapa sticky ocupa `calc(100vh - 130px)` con `top-24`, alineado arriba con resultados. El mapa permanece visible durante carga. Revisar ancestros para evitar overflow que interfiera con sticky.

## 4. Modelo y estados

- Usar el tipo `Accommodation` y la fuente `data/accommodations.ts` existentes; no crear un segundo dataset para catálogo.
- Usar `SortOrder = "asc" | "desc"`; agregarlo al módulo de tipos apropiado solo si no existe.
- `isLoading` inicia `true`; carga simulada desde datos locales, con duración aproximada de 1 s y `clearTimeout` de cleanup.
- `sortOrder` inicial confirmado: `"asc"`; selector refleja siempre el estado vigente.
- Lista mostrada: derivada con ordenación inmutable por `pricePerNight`; no duplicar/mutar datos de origen ni persistir el resultado ordenado como nueva fuente.
- En vacío, conteo `0` y mensaje explícito mediante el grid compartido. El placeholder permanece visible durante carga, resultados y estado vacío.

## 5. Criterios de aceptación verificables

- [ ] `/catalog` muestra carga inicial y termina mostrando la colección compartida; no hay solicitud de red.
- [ ] El conteo coincide con el número de tarjetas mostradas; para datos vacíos muestra 0 y mensaje claro.
- [ ] Seleccionar ascendente ordena `pricePerNight` de menor a mayor; seleccionar descendente, de mayor a menor.
- [ ] Cambiar el orden conserva el conteo, el mapa y los datos originales sin mutación.
- [ ] El selector tiene etiqueta/nombre accesible, opciones comprensibles, foco visible y opera con teclado.
- [ ] Se reutilizan `AccommodationGrid` y `AccommodationCard`, no se crean tarjetas paralelas; sus destinos son `/rooms/${id}` mediante `Link`.
- [ ] El mapa es un bloque visual no interactivo rotulado exactamente “Mapa”.
- [ ] A 375 px, el mapa sigue al listado en flujo vertical y no es sticky; entre 768–1023 px aparece a la derecha junto a una columna de tarjetas; desde 1024 px hay dos tarjetas por fila, zonas cercanas a 55/45 y mapa alto sticky alineado arriba; no hay overflow horizontal general.
- [ ] Navbar e identidad Stayfinder coherentes con Home; acceso a `/catalog` disponible mediante `Link` con el cambio mínimo necesario.
- [ ] Presentación blanca y limpia, texto oscuro, acentos rosa/rojo, bordes redondeados y controles coherentes con Home.
- [ ] `useEffect` de carga limpia el timeout cuando la vista se desmonta.
- [ ] Lint, `npx tsc --noEmit` y build pasan, si los comandos disponibles siguen siendo válidos.

## 6. Accesibilidad y restricciones

Usar componentes funcionales `const`, TypeScript estricto, Tailwind CSS y `Link` de Next. Selector nativo `<select>` es preferible si satisface presentación/accesibilidad; no añadir una biblioteca UI. Proporcionar etiquetas semánticas al control y al placeholder/mapa (p. ej. región no interactiva con nombre accesible), contraste y foco visibles. No usar estilos inline ni hojas CSS por componente. No instalar dependencias ni cambiar configuración/contexto. Home conserva su layout y comportamiento; se autoriza únicamente mostrar sus precios en euros mediante la tarjeta compartida.

## 7. Vision-to-Spec: Catálogo

**Pendiente:** no se proporcionó una captura de Catálogo para inspección. No hay observaciones verificadas sobre composición, proporciones o alturas. Las decisiones confirmadas de identidad visual, color, navegación y ubicación responsive son decisiones propias basadas en Stayfinder/Home, no observaciones atribuidas a una captura. Revisar esta sección si se entrega referencia; no inferir interacciones visuales.
