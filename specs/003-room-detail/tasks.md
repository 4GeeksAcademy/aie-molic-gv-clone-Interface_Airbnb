# Tareas de implementación — Detalle de alojamiento

> **Estado:** implementación en código y assets integrada; validaciones automatizadas y revisión manual de navegador pendientes de esta ejecución.
>
> No se instalaron dependencias ni se modificó configuración, Home, Catálogo, `context.md` o los campos identificativos compartidos. No se hicieron commits ni push.

## Decisiones aprobadas y límites observados

- Navbar compartida se reutiliza con búsqueda oculta; el enlace Catálogo global permanece visible y Detalle incluye un regreso explícito.
- CTA habilitado: al activarlo muestra mensaje informativo accesible; no inicia una reserva.
- Precios en EUR; galería circular con varias fotos; servicios simulados poblados en todos los alojamientos.
- Cada alojamiento conserva su portada existente como primera foto y tiene tres imágenes locales adicionales distintas. Las fuentes Wikimedia Commons, licencias y autores están registrados en `public/images/accommodations/ATTRIBUTION.md`.
- No hay referencia/captura de Detalle; Vision-to-Spec permanece pendiente.

## Registro de tareas

### - [x] ROOM-001 — Confirmar estado, modelos y scripts
- Inspección inicial confirmó seis alojamientos, campos `Accommodation`/`Host`/`Amenity` y seis portadas locales distintas, Navbar con `showSearch`, LoadingIndicator accesible, Next 16.4.6 y scripts lint/build. Las imágenes adicionales se incorporaron en ROOM-004.
- Estado Git inicial solo mostraba los tres SDD nuevos de esta fase; se preservaron.
- Home/Catálogo enlazan mediante las tarjetas a `/rooms/${id}` y no se editaron.
- **Evidencia:** `git status` previo y lectura de código/modelos/assets.

### - [x] ROOM-002 — Definir contrato dinámico y estados
- Next 16: page recibe `params: Promise<{id:string}>`; cliente consume la promesa con `use(params)` dentro de Suspense, compatible con Cache Components y hooks.
- Resolución por igualdad exacta; estado previo no se presenta mientras `resolvedId !== id`; timer se limpia al cambiar/desmontar.
- **Evidencia:** `npm run build` completó prerender parcial de `/rooms/[id]`.

### - [x] ROOM-003 — Implementar carga y resolución local
- Retardo simulado de 950 ms, LoadingIndicator compartido y estado no encontrado con enlaces de regreso.
- Sin `fetch` ni dataset paralelo.
- **Evidencia:** inspección de flujo + build/typecheck. Verificación manual de navegación/cambio ID pendiente.

### - [x] ROOM-004 — Implementar galería local navegable
- Galería con estado `useState`, navegación modular circular cuando `images.length > 1`, contador, `next/image`, alt y guardas para colección vacía/una foto. Se reinicia al cambiar el alojamiento mediante `key`.
- Cuatro fotos locales distintas por alojamiento; botones Anterior/Siguiente superpuestos en los lados, indicador centrado abajo, encuadre 4:3 móvil/16:9 desde `sm` y reinicio por `key={accommodation.id}`.
- **Evidencia:** las seis colecciones tienen cuatro rutas locales existentes, cuatro hashes distintos por alojamiento y ninguna imagen repetida entre colecciones; portadas originales conservadas como índice 0. Las fuentes tienen licencias CC BY, CC BY-SA o CC0 con atribución registrada en `public/images/accommodations/ATTRIBUTION.md`.
- **Pendiente:** recorrido visual y de teclado en navegador; no se marca como completado.

### - [x] ROOM-005 — Presentar datos, anfitrión y servicios
- Header consume directamente título, ubicación, rating y reseñas; HostInfo consume Host; AmenitiesGrid usa iconos SVG propios por identificador.
- Agregados servicios simulados coherentes en los seis registros. Campos identificativos inalterados.
- **Evidencia:** script confirmó seis registros, seis colecciones pobladas y seis rutas de imagen locales válidas/distintas; typecheck/build.

### - [x] ROOM-006 — Implementar reserva visual y contador
- BookingCard controla huéspedes desde mínimo; límites defensivos; botones disabled en extremos; precio EUR sin fechas ni total de estancia.
- CTA nativo habilitado; `useState` muestra tras activarlo «Esta es una aplicación de demostración. Las reservas reales no están disponibles» en un elemento `role="status"`/`aria-live="polite"`. Sin `alert()` ni efecto de reserva.
- **Evidencia:** revisión de código, TypeScript y lint. Prueba manual de ratón/teclado pendiente.

### - [x] ROOM-007 — Componer página y navegación interna
- Navbar con `showSearch={false}`, BackNavigation con Next Link `/catalog`; loading, not-found y detalle en una columna móvil y layout de contenido/reserva en escritorio.
- No se tocaron componentes o páginas Home/Catálogo.
- **Evidencia:** revisión del diff y build. Hrefs activados manualmente en navegador: pendiente.

### [ ] ROOM-008 — Validar accesibilidad e interacción
- Implementación incluye nombres de controles, foco visible, disabled, alt/contexto y status live.
- **Pendiente:** recorrido real de teclado y lector de pantalla en navegador; no marcar como verificado.

### [ ] ROOM-009 — Validar responsive e integración visual
- Tailwind mobile-first; estructura prevé una columna y reserva en flujo en móvil, contenido/reserva separado en escritorio.
- **Pendiente:** inspección real a 375 px, 768 px y escritorio, overflow y orden/foco; no se dispuso de navegador.

### [ ] ROOM-010 — Ejecutar TypeScript, ESLint y build
- **Pendiente en esta ejecución:** repetir `npx tsc --noEmit`, `npm run lint`, `npm run build` y `git diff --check` sobre el estado integrado actual.
- No se añadieron dependencias ni cambios de configuración.

### Auditoría final automatizada
- En esta continuación se comprobaron seis listas de cuatro imágenes, rutas presentes, JPEG válidos y hashes SHA-256 únicos; la portada permanece primera. La galería usa estado React, navegación modular circular, botones laterales y contador inferior; el `key` del ID reinicia su instancia al cambiar de alojamiento.
- Las validaciones de código (TypeScript, ESLint, build y `git diff --check`) se registrarán aquí tras ejecutarse.
- La validación manual de navegador/responsive/interacciones no se da por hecha; ROOM-008, ROOM-009 y ROOM-011 permanecen pendientes mientras no se ejecuten.

### [ ] ROOM-011 — Recorrer criterios y cerrar fase
- Recorrido automatizado estático parcial: consistencia de seis registros, amenities y existencia/unicidad de fotos; comportamiento exacto se implementa en código.
- **Pendiente:** navegador para ID válido/inexistente, cambios de ID/cleanup, interacciones galería y contador, enlaces Home/Catálogo/retorno, CTA, accesibilidad y viewports.
- **Vision-to-Spec:** sigue pendiente porque no se proporcionó captura específica.

## Revisión manual requerida al usuario

1. Abrir desde Home y Catálogo varios alojamientos; confirmar coincidencia de datos y que el ID desconocido muestra not-found tras la carga.
2. Probar cambio rápido de ID y vuelta a Catálogo; verificar el wrapping circular, el reinicio de la galería al cambiar alojamiento y el contador `n / 4`.
3. Probar huésped mínimo/máximo y activar «Reservar» con ratón y teclado; comprobar el mensaje de demostración y ausencia de cualquier reserva real.
4. Revisar teclado/foco/lector de pantalla y anchos 375, 768 y escritorio (incluido overflow).
5. Si se desea comparar fidelidad visual, proporcionar referencia de Detalle.
