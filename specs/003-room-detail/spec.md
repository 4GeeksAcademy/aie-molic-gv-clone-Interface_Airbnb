# Especificación funcional — Detalle de alojamiento

- **Vista:** Detalle (`/rooms/[id]`)
- **Fase:** 3 — última vista de Stayfinder.
- **Estado:** implementación de Detalle y galería completada en código; las validaciones automatizadas y pendientes manuales se registran en `tasks.md`.
- **Fuente funcional:** `context.md` y requisitos 4Geeks descritos por el usuario.
- **Referencia visual:** no se proporcionó captura específica de Detalle. Vision-to-Spec queda pendiente; este documento no atribuye composiciones a una imagen.

## 1. Objetivo y alcance

Permitir consultar un alojamiento de los datos compartidos, recorrer sus fotografías, revisar sus datos, anfitrión y servicios, elegir una cantidad válida de huéspedes y encontrar un CTA de reserva de presentación. La ruta es dinámica y acepta el identificador estable empleado por las tarjetas de Home y Catálogo.

**Incluye:** `/rooms/[id]`, resolución del ID contra `data/accommodations.ts`, carga simulada con cleanup, estados de carga/no encontrado, galería local de cuatro fotos distintas por alojamiento con navegación circular, información de alojamiento/anfitrión/servicios, contador de huéspedes con límites, CTA sin transacción y enlace de regreso al Catálogo.

**No incluye:** pagos, creación o envío de reservas, backend, datos remotos, fechas obligatorias, cálculo de importe total, mapas, autenticación, dependencias de interfaz nuevas ni cambios de Home/Catálogo salvo que una inspección previa demuestre un defecto en el contrato de enlace. No implementar comportamiento adicional del menú o de los controles decorativos.

## 2. Requisitos funcionales obligatorios

1. Implementar la ruta dinámica `/rooms/[id]` mediante Next.js 16 App Router y obtener el `id` del segmento URL con la API vigente de Next.js 16. Next 16.4.6: `params` es Promise; el Server Component entrega la promesa a un cliente bajo Suspense, donde se consume con React `use` para los hooks de carga.
2. Resolver desde `data/accommodations.ts`; preservar IDs, títulos, ubicaciones, precios, valoraciones y categorías. Se autorizó enriquecer fotos/servicios sin alterar Home/Catálogo.
3. Simular la carga con `useEffect` y `setTimeout` cercano a un segundo. Mostrar `LoadingIndicator`, cancelar el timeout al desmontar o cambiar el ID y evitar que datos de un ID anterior contaminen la vista nueva.
4. Durante la carga no anunciar falsamente un resultado encontrado/no encontrado. Tras la carga, mostrar detalle si el ID existe o un estado claro de “Alojamiento no encontrado” y navegación de regreso si no existe.
5. Presentar una galería responsive de cuatro fotografías locales distintas por alojamiento. Mantener la portada existente como primera imagen; usar `useState<number>` para el índice activo, botones accesibles **Anterior** y **Siguiente** superpuestos a izquierda/derecha e indicador `1 / N` centrado en la parte inferior.
6. Cada acción de galería debe mantener el índice dentro de `[0, images.length - 1]`. El comportamiento previsto es circular: desde la última imagen, Siguiente vuelve a la primera y desde la primera, Anterior va a la última. Si solo hay cero/una imagen, los controles no deben producir índice inválido y se ocultarán o deshabilitarán conforme al contrato final del componente.
7. Mostrar título, ubicación, rating como valor legible acompañado por estrella, y número de reseñas. No convertir esos datos en acciones no solicitadas.
8. Mostrar anfitrión con avatar, nombre y años alojando. Usar el `Host` del alojamiento. El avatar remoto no está garantizado: los datos actuales tienen `avatarUrl` local placeholder; si se conserva fallback, debe ser local y con texto alternativo apropiado.
9. Mostrar los `amenities` como cuadrícula con iconos y etiquetas. El campo `Amenity.icon` es un identificador textual, no una ruta/paquete de iconos; resolverlo con recursos SVG locales o representación propia pequeña, sin biblioteca externa. Se autorizó agregar servicios simulados coherentes a todos los alojamientos.
10. Presentar `BookingCard` con precio por noche y contador de huéspedes. Inicializar huéspedes en `minGuests`; permitir incrementar/decrementar sin exceder `maxGuests` ni quedar por debajo de `minGuests`. Mantener el estado con `useState` en el dueño de la interacción (preferiblemente `BookingCard`) y pasar valores/callbacks controlados a `GuestCounter`.
11. Incluir CTA “Reservar” habilitado e interactivo. Al pulsarlo con ratón o teclado, muestra mediante estado React un mensaje accesible `role="status"`: “Esta es una aplicación de demostración. Las reservas reales no están disponibles”. No realiza pago, no guarda ni envía reserva, y no debe fingir éxito. No usar `alert()`.
12. Incluir enlace de regreso al Catálogo, con `Link` de Next.js a `/catalog`. Toda navegación interna de la vista usa exclusivamente `Link`; los botones de galería, contador y CTA son controles, no enlaces de navegación.
13. Las tarjetas existentes de Home y Catálogo ya enlazan a `/rooms/${accommodation.id}` con `Link`; conservar los IDs existentes. Verificar ambos caminos en la integración final, sin duplicar ni reconstruir tarjetas.
14. Formatear el precio por noche en euros (EUR) sin mutar datos. Reutilizar la misma lógica si puede compartirse sin duplicación ni cambio fuera de alcance; no exigir refactor previo sin necesidad.

15. Reutilizar `Navbar` con `showSearch={false}`, conservando su enlace visible al Catálogo; añadir también el regreso explícito dentro del detalle.

## 3. Componentes y contratos propuestos

Los componentes son funcionales declarados como `const`, pequeños, tipados y con responsabilidades únicas. Props son contratos de planificación sujetos a inspección al iniciar implementación.

| Componente | Responsabilidad y props propuestas | Estado/eventos | Relaciones |
| --- | --- | --- | --- |
| `RoomDetailPage` y `RoomDetailClient` | Server Component desenvuelve params Promise bajo Suspense; el cliente simula carga, localiza alojamiento y coordina estados. | `isLoading`, `accommodation: Accommodation \| null`, huéspedes donde se decida; `useEffect` + `setTimeout` con cleanup. | Compone Navbar/Logo si se decide, BackNavigation y estado Loading/not-found/detalle. |
| `BackNavigation` | Enlace interno accesible de regreso. Props posibles: `href?: Route` (default `/catalog`), `label?: string`. | Sin estado. | Usa exclusivamente `Link` de Next. |
| `PhotoGallery` | Presentar imágenes grandes, alt derivado del título y controles prev/next. Props: `images: string[]`, `title: string`, opcional `fallbackImage: string`. | `activeIndex: number` con `useState`; cambios cíclicos y acotados. Definir reset de índice si cambian imágenes. | Recurso local `next/image` o elemento compatible con restricciones actuales del proyecto. |
| `AccommodationHeader` | Presentar título, ubicación, valoración/estrella y reseñas. Props: `title`, `location`, `rating`, `reviewCount`. | Sin estado. | Encabezado principal del detalle. |
| `HostInfo` | Avatar, nombre y años como anfitrión. Props: `host: Host`. | Sin estado. | Usa datos existentes de `Accommodation.host`. |
| `AmenitiesGrid` | Cuadrícula de servicios con etiqueta e icono. Props: `amenities: Amenity[]`. | Sin estado. | Dentro del contenido principal; iconos SVG/locales propios; estado vacío si lista vacía según definición. |
| `BookingCard` | Mostrar precio/noche, resumen del número de huéspedes y CTA no transaccional. Props: `pricePerNight`, `minGuests`, `maxGuests`. | `guestCount` inicia en mínimo; estado booleano controla el mensaje informativo tras pulsar CTA. | Compone `GuestCounter`; no suma importe de fechas ni inicia reserva. |
| `GuestCounter` | Cambiar cantidad de huéspedes. Props controladas: `value`, `min`, `max`, `onChange`. | Botones decrement/increment; bloquear en límites y anunciar valor. | Hijo de `BookingCard`; botones con nombres accesibles. |
| `LoadingIndicator` **(reutilizable existente)** | Comunicar carga. Prop actual `label?: string`. | Sin estado. | Se reutiliza mientras resuelve ID. |
| `Navbar` / `Logo` **(existentes, aprobados)** | Mantener identidad y enlaces comunes  | Sin estado adicional; props de Navbar requieren `searchQuery` y `onSearchChange`; búsqueda puede ocultarse con `showSearch={false}`. | No crear una Navbar paralela. Usar Navbar con búsqueda oculta; no crear una cabecera paralela. |

### Relaciones y layout lógico

`RoomDetailPage` resuelve carga y registro. Tras carga exitosa presenta `BackNavigation`, `PhotoGallery`, `AccommodationHeader`, `HostInfo`, `AmenitiesGrid` y `BookingCard`/`GuestCounter`. En móvil (375 px) la lectura es una columna con contenido en orden claro y reserva integrada después de los datos principales. Desde 768 px se adapta a composición de dos zonas: contenido/galería principal y reserva diferenciada, con orden visual y de DOM accesible. La disposición exacta queda abierta a la referencia futura y a la validación de ancho; no inventar una composición observada.

## 4. Modelo, fuentes y estados

- Reutilizar `Accommodation`, `Host` y `Amenity` de `types/accommodation.ts`; no añadir tipos duplicados si el contrato existente basta.
- Fuente única: `data/accommodations.ts`. IDs actuales de ejemplo: `casa-luz-cadiz`, `hotel-patio-granada`, `loft-barrio-gotico`, `hotel-mar-malaga`, `refugio-sierra-nevada`, `hotel-casa-naranja`.
- `images` contiene cuatro rutas locales distintas bajo `/images/accommodations/` por registro: la portada original seguida de tres fotos adicionales descargadas de Wikimedia Commons. Las licencias CC BY, CC BY-SA y CC0, autores y páginas fuente se registran en `public/images/accommodations/ATTRIBUTION.md`. No se reutiliza ninguna foto adicional entre alojamientos. `Host.avatarUrl` usa actualmente `/accommodation-placeholder.svg` en los datos observados.
- `amenities` se amplía con servicios simulados coherentes para cada alojamiento, según autorización; preservar todos los demás campos.
- Estados de ruta: `loading` inicial, detalle resuelto, no encontrado. Si cambia el ID en la misma instancia, reiniciar carga/limpiar timeout y descartar valor previo hasta resolver el nuevo ID.
- `activeIndex` inicia en cero para un alojamiento con imágenes. Si cambian imágenes/ID, asegurar el índice válido, reiniciándolo o normalizándolo.
- `guestCount` inicia en `minGuests`; el setter se mantiene en el rango inclusivo `[minGuests, maxGuests]`. Confirmar cómo se trata un dato malformado donde min > max, sin ampliar el tipo normal.
- No almacenar datos resueltos fuera de estado React ni hacer solicitudes de red.

## 5. Criterios de aceptación verificables

- [x] La ruta de segmento dinámico lee el ID con params Promise de Next 16 bajo Suspense y resuelve el registro por igualdad exacta en la fuente compartida.
- [ ] Un ID válido muestra el detalle correspondiente; un ID inexistente muestra mensaje claro y Link a `/catalog`.
- [ ] Se muestra `LoadingIndicator` durante el retardo simulado; el timeout se limpia al desmontar o al cambiar ID; no hay estado obsoleto.
- [x] Cada galería incluye cuatro fotos locales; Anterior/Siguiente cambian circularmente, los botones se superponen a los lados, el contador queda abajo centrado y la instancia se reinicia al cambiar de ID mediante `key`.
- [ ] Título, ubicación, rating/estrella y cantidad de reseñas coinciden con el objeto seleccionado.
- [ ] Avatar, nombre y años de anfitrión coinciden con el `Host` del objeto; fallback de imagen funciona si se requiere.
- [x] Los servicios se renderizan del array `amenities` con iconos SVG propios; colecciones pobladas para todos los registros.
- [ ] Precio por noche coincide con el alojamiento y aparece en euros; huéspedes iniciales en mínimo; decremento/incremento respetan ambos límites.
- [x] CTA habilitado muestra mediante `useState` un mensaje `role="status"`; no efectúa transacciones.
- [x] Navbar compartida oculta búsqueda y mantiene enlace a Catálogo; regreso explícito usa `Link` a `/catalog`; tarjetas de Home y Catálogo mantienen `/rooms/{id}` para el ID correcto.
- [ ] Responsive: lectura sin overflow horizontal a 375 px; adaptación de contenido/reserva a 768 px y escritorio; foco y orden de teclado adecuados.
- [ ] `npx tsc --noEmit`, ESLint y `npm run build` pasan sin nuevas dependencias, cambios no autorizados de configuración ni estilos inline. Las pruebas manuales de navegador siguen pendientes hasta ejecutarse.

## 6. Accesibilidad y restricciones

Usar semántica HTML, encabezados jerárquicos, nombres accesibles para controles, alt de imágenes contextual (decorativas con alt vacío), foco visible y botones nativos. El valor de huéspedes debe anunciarse y los botones indicar aumentar/disminuir; en extremos usar `disabled` cuando corresponda. La galería no debe depender solo del cambio visual: controles identificables y operables por teclado. El indicador de carga reutilizado mantiene su semántica `role="status"`/`aria-live`.

Usar Next.js 16 App Router, React, TypeScript estricto, Tailwind y `Link` para navegación interna. No usar estilos inline, hojas CSS por componente, bibliotecas de componentes/iconos ni dependencias nuevas. Componentes funcionales `const`. No alterar Home/Catálogo ni los datos compartidos sin autorización concreta. No implementar APIs de pago/booking.

## 7. Opcionales fuera de tareas obligatorias

- Selector de fechas de entrada/salida.
- Cálculo del precio total por estancia/noches.
- Cualquier persistencia o acción real de reserva.

Los dos primeros pueden especificarse en una iteración futura, pero no se incluyen en las tareas iniciales obligatorias ni deben bloquear la entrega base.

## 8. Vision-to-Spec — Detalle (`/rooms/[id]`)

**Pendiente de referencia.** No se ha suministrado ni inspeccionado una captura específica de la vista Detalle de Airbnb. No hay observaciones verificadas sobre composición, orden visual, proporciones de galería, barra de reserva, jerarquía, colores exactos o estados. Las pautas responsive y de identidad en esta especificación son requisitos/decisiones Stayfinder, no observaciones de la captura.

Cuando se reciba una referencia visual, añadir fecha/fuente, viewport conocido, observaciones descriptivas separadas de decisiones y requisitos P0, y registrar incertidumbres sin inferir comportamiento dinámico a partir de una imagen estática.
