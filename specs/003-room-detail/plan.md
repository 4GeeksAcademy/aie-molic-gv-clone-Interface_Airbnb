# Plan técnico — Detalle de alojamiento

- **Fase:** 3 — `/rooms/[id]`.
- **Estado:** implementación de Detalle y galería integrada; ejecución final de TypeScript, ESLint, build y revisión manual queda registrada en `tasks.md`.
- **Alcance:** ruta y componentes de Detalle, fotos locales necesarias para la galería y documentación SDD asociada. No expandir a otras vistas.
- **Restricciones:** no alterar Home/Catálogo ni datos compartidos sin justificar y pedir aprobación; no instalar dependencias, modificar configuración, implementar pagos/reservas reales, ni crear commits/pushes.

## 1. Base inspeccionada

El proyecto usa Next.js 16 App Router, React, TypeScript y Tailwind. Home y Catálogo están implementados en `app/page.tsx` y `app/catalog/page.tsx`; Detalle vive en `app/rooms/[id]/page.tsx` y `components/room/`.

Decisiones aprobadas: reutilizar Navbar con `showSearch={false}` y enlace a Catálogo; conservar enlace explícito de regreso; CTA habilitado que revela un aviso informativo accesible, sin transacción; formato EUR; identidad blanca con acentos rosa/rojo. Preservar Home/Catálogo y los datos identificativos.

Componentes existentes potencialmente reutilizables:

- `components/shared/LoadingIndicator.tsx`: `label?: string`, `role="status"`, `aria-live="polite"`.
- `components/layout/Logo.tsx` y `Navbar.tsx`: Navbar exige `searchQuery` y `onSearchChange`, con `showSearch?: boolean`; decidir si la cabecera compartida encaja visualmente, sin crear duplicado.
- `components/listings/AccommodationCard.tsx`: presenta precio EUR, imagen, título, rating y `Link` a `/rooms/${id}`; no se necesita dentro del detalle.
- `components/listings/AccommodationGrid.tsx`: componente de listados, no es un layout de detalle.
- `MapPlaceholder`, `ResultsHeader`, `SortSelector`, `CategoryFilters`, `SearchBar`: no son necesarios en Detalle salvo necesidad demostrada.

Modelo compartido actual en `types/accommodation.ts`:

```ts
interface Host { id: string; name: string; avatarUrl: string; yearsHosting: number }
interface Amenity { id: string; label: string; icon: string }
interface Accommodation {
  id: string; title: string; location: string; pricePerNight: number;
  rating: number; reviewCount: number; categoryIds: string[]; images: string[];
  host: Host; amenities: Amenity[]; minGuests: number; maxGuests: number;
  badge?: string;
}
```

`data/accommodations.ts` exporta seis registros con IDs estables; cada uno conserva su JPEG de portada primero y añade tres fotos locales distintas (24 fotos totales por galería). Las fotos nuevas y sus atribuciones CC BY/CC BY-SA/CC0 están en `public/images/accommodations/` y `public/images/accommodations/ATTRIBUTION.md`. `Host.avatarUrl` usa `/accommodation-placeholder.svg`. Los registros incluyen servicios simulados; IDs y demás datos identificativos permanecen intactos. Todas las tarjetas existentes ya producen href `/rooms/${id}`. `LoadingIndicator` es reutilizable. Scripts observados: `npm run lint`, `npm run build` y `npx tsc --noEmit`.

Antes de implementación, volver a inspeccionar estado Git, versiones/declaraciones de params Next 16, rutas/hrefs, datos y assets para no sobrescribir cambios posteriores.

## 2. Arquitectura propuesta

```text
app/rooms/[id]/page.tsx (contenedor cliente: params + carga + lookup + estado huésped)
├── [Navbar/Logo compartidos: decidir tras revisar composición]
├── BackNavigation (Link → /catalog)
├── LoadingIndicator                  (durante timeout)
├── estado no encontrado + BackNavigation (si id inválido)
└── detalle resuelto
    ├── PhotoGallery (imágenes locales, índice y controles)
    ├── AccommodationHeader (título, ubicación, rating, reseñas)
    ├── HostInfo (Host)
    ├── AmenitiesGrid (Amenity[])
    └── BookingCard (precio/noche, límites y CTA sin side effect real)
        └── GuestCounter (controlado por BookingCard)
```

`RoomDetailPage` es responsable del segmento, carga/lookup y estados de ruta. Los subcomponentes reciben datos explícitos y no vuelven a consultar la fuente. `BookingCard` debe poseer `guestCount` y componer un `GuestCounter` controlado, salvo que la integración justifique que el estado viva en la página; no mantener estados duplicados. `PhotoGallery` posee `activeIndex` local, pues pertenece a la interacción de presentación de esa galería.

## 3. Organización de archivos propuesta

```text
app/
  rooms/
    [id]/
      page.tsx                        # nuevo: ruta dinámica y orquestación
components/
  room/
    BackNavigation.tsx               # nuevo
    PhotoGallery.tsx                 # nuevo
    AccommodationHeader.tsx          # nuevo
    HostInfo.tsx                     # nuevo
    AmenitiesGrid.tsx                # nuevo
    BookingCard.tsx                  # nuevo
    GuestCounter.tsx                 # nuevo
# reutilizar sin duplicar
components/shared/LoadingIndicator.tsx
components/layout/Navbar.tsx         # opcional, tras validar composición
components/layout/Logo.tsx
components/listings/AccommodationCard.tsx
components/listings/AccommodationGrid.tsx
types/accommodation.ts               # solo lectura salvo incompatibilidad probada
 data/accommodations.ts              # solo lectura inicialmente; servicio vacío actual requiere decisión
public/images/accommodations/*      # recursos existentes
public/accommodation-placeholder.svg
```

Minimizar archivos y tipos; props simples pueden declararse localmente a cada componente. No crear `types/room-detail.ts` si el modelo común ya resuelve los contratos.

## 4. Ruta, params y resolución del registro

- En Next.js 16.4.6, `params` es Promise. Server page pasa la promesa a `RoomDetailClient` dentro de Suspense; el cliente la consume con React `use(params)` para evitar acceso a params fuera de Suspense y permitir hooks.
- La ruta server permanece pequeña; la frontera `RoomDetailClient` maneja hooks, carga y lookup. Evitar pasar funciones por una frontera Server→Client.
- Resolver con búsqueda por igualdad estricta: `accommodations.find((item) => item.id === id)`. No derivar títulos/IDs desde slug ni hacer fetch.
- Reaccionar a cambios de ID: reiniciar `isLoading`, limpiar cualquier timeout anterior, descartar dato mostrado del ID previo durante el estado nuevo y resolver el registro nuevo al completar. El cleanup impide setState tras desmontaje.
- Mantener explícitos loading, encontrado y no encontrado. No mostrar not-found antes de terminar el timeout.

## 5. Estados e interacciones

### Carga y resolución
- `isLoading` inicia `true`; `accommodation` puede ser `null` hasta que termine la simulación.
- `useEffect` programa timeout cercano a 900–1000 ms, localiza el alojamiento y guarda encontrado/no encontrado, apaga carga y devuelve cleanup con `clearTimeout`.
- Al cambiar `id`, reinicializar carga y hacer una nueva resolución; asegurar que no se exponga transitoriamente detalle antiguo.
- Reusar `LoadingIndicator` con etiqueta específica (p. ej. “Cargando alojamiento…”).

### Galería
- Recibir `images` y `title`; portada existente permanece como `images[0]` y las imágenes adicionales son archivos locales atribuidos.
- Estado `activeIndex=0`; handler prev/next modular sobre longitud para navegación circular. Guardas para longitud cero/uno. `key={accommodation.id}` en el call site reinicia el índice al cambiar de alojamiento.
- Incluir botones nativos Anterior/Siguiente superpuestos en los laterales, indicador `n / N` inferior centrado, foco visible y encuadre 4:3 móvil/16:9 desde `sm` con Next Image `fill`/`sizes`.
- Hay cuatro fotos locales distintas por registro; la portada preexistente permanece primera y los créditos/licencias de las 18 descargas se documentan en `ATTRIBUTION.md`.

### Huéspedes y reserva
- `BookingCard` inicializa count en `minGuests`; `GuestCounter` recibe value/min/max/onChange y no permite valores fuera del rango.
- Deshabilitar decremento en mínimo e incremento en máximo; validación defensiva en el setter aun si callback se invoca directamente.
- CTA habilitado como `<button type="button">`; su click actualiza estado local y revela el mensaje exacto “Esta es una aplicación de demostración. Las reservas reales no están disponibles” con `role="status"`/`aria-live="polite"`. No `alert()`, red, guardado, pago ni confirmación de reserva.
- No calcular total por estancia porque no hay fechas obligatorias.

### Información
- Renderizar cada campo directamente del alojamiento seleccionado. Rating legible más estrella decorativa (`aria-hidden` si número tiene contexto accesible); reseñas expresadas con pluralización legible.
- `HostInfo` representa `host.avatarUrl`, `name`, `yearsHosting`; fallback local si avatar falta.
- `AmenitiesGrid` mapea `amenities` a rótulos e iconos originales mediante un mapa local de variantes SVG/clases. `icon` string no debe convertirse a URL arbitraria ni requerir paquete.
- Los servicios y fotos adicionales son datos de demostración autorizados; las fuentes/licencias de las 18 imágenes se conservan en el manifiesto de atribución.

## 6. Diseño responsive, identidad y accesibilidad

- Mobile-first a 375 px; una columna, galería e información legibles, reserva dentro del flujo y sin overflow horizontal.
- A partir de 768 px adaptar la composición a contenido principal y tarjeta de reserva diferenciados; mantener orden de lectura accesible, no inferir proporciones de una captura inexistente.
- Identidad Stayfinder: fondo blanco/limpio, texto oscuro, acentos rosa/rojo; fotos grandes con esquinas redondeadas. Estos son criterios de diseño declarados, no observaciones de Airbnb Detalle.
- Tailwind CSS únicamente; no estilos inline, hojas de estilo por componente, bibliotecas UI/iconos ni dependencias nuevas.
- Usar `Link` para retorno al Catálogo y para cualquier otra navegación interna. Los botones de galería, huéspedes y CTA no deben usar anchors para acciones.
- Semántica: un `h1` para alojamiento, secciones con heading, labels/botones accesibles, estados `role=status`, alt útil, foco visible, orden de tab lógico y controles disabled en límites.

## 7. Dependencias entre tareas

```text
ROOM-001 inspección/contratos/scripts
    └── ROOM-002 contrato de ruta dinámica y estados ID/params
         ├── ROOM-003 carga simulada, lookup y estados loading/not-found
         ├── ROOM-004 galería + resolución de imágenes/datos multi-imagen
         ├── ROOM-005 componentes de información (header/host/amenities)
         └── ROOM-006 BookingCard + GuestCounter + decisión CTA
              └── ROOM-007 composición responsive y navegación
                   ├── ROOM-008 pruebas funcionales y accesibilidad
                   └── ROOM-009 pruebas responsive/integración enlaces
                        └── ROOM-010 lint/typecheck/build y revisión final
```

Las tareas concretas y criterios aparecen en `tasks.md`; no se incluye aquí implementación de código.

## 8. Estrategia de pruebas y validación

### Casos funcionales
- ID válido para cada registro representativo; comprobar coincidencia exacta de campos, imagen, host, precio, límites y amenities.
- ID inexistente: indicador durante retardo y luego estado no encontrado con Link a `/catalog`; probar ID vacío/mal formado solo si routing lo permite.
- Carga alrededor de 1 s y cleanup al navegar/desmontar; cambio entre dos IDs no deja dato viejo ni timer activo.
- Galería con dos o más imágenes: Anterior/Siguiente y wrap circular en ambos extremos; longitud 1 y 0 nunca produce índice inválido.
- Huéspedes: valor inicial mínimo, varios incrementos hasta máximo y decrementos hasta mínimo; botones disabled en límites y setter nunca rebasa.
- Información y servicios: valores coinciden exactamente con objeto; colección vacía muestra manejo explícito; imágenes/avatar usan recursos locales/fallback.
- Navegación: desde tarjetas Home y Catálogo el href apunta al ID correcto; regreso de Detalle a `/catalog` mediante Link.
- CTA activable con ratón/teclado muestra el estado informativo accesible y no desencadena red, pago, persistencia ni confirmación falsa.

### Responsive, accesibilidad y calidad
- Navegador/devtools a 375 px, 768 px y ancho escritorio (p. ej. 1280/1440); verificar orden, fotos, lectura, tarjeta reserva, overflow y reflow.
- Recorrido teclado completo: enlaces, botones Anterior/Siguiente, huéspedes, regreso; orden/foco visible, nombres accesibles, estados disabled y lector semántico básico.
- `npx tsc --noEmit`, `npm run lint`, `npm run build`, comprobación de existencia/formatos/hashes de imágenes y `git diff --check`.
- No instalar herramientas o navegadores. Registrar si faltan capacidades manuales; no marcar criterios visuales como comprobados sin pruebas.

## 9. Decisiones a cerrar antes de implementación

1. Contrato exacto de `params` conforme a Next 16 instalado y ubicación de la frontera cliente para hooks.
2. Cabecera: si Detalle usa Navbar existente con búsqueda escondida, Logo/elemento mínimo o solo BackNavigation; evitar duplicación y respetar layout existente.
3. Datos: autorización aplicada: amenities simulados y tres imágenes locales licenciadas adicionales por registro, sin reutilizar fotos adicionales.
4. Comportamiento de galería vacía/una imagen: fallback sin controles; navegación circular cuando hay más de una foto.
5. CTA aprobado habilitado; muestra explicación accesible vía estado React, sin backend ni acción falsa.
6. Formato/rounding monetario: alinear con EUR y `Intl.NumberFormat` actual sin cambiar valores.
7. Proporciones exactas, posición de la reserva y presentación visual: pendientes de Vision-to-Spec/captura y prueba responsive.
8. Verificación visual/teclado del navegador sigue pendiente hasta completar el recorrido manual.
