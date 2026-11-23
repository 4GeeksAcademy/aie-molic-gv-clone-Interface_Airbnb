# 🏡 Stayfinder

### Plataforma de alquiler vacacional inspirada en Airbnb

Aplicación web adaptable para explorar alquileres vacacionales, creada con **Next.js 16, React 19, TypeScript y Tailwind CSS 4**.

Stayfinder recrea la experiencia frontend principal de una plataforma de alquiler vacacional inspirada en Airbnb. Los usuarios pueden explorar propiedades, buscar y filtrar alojamientos, comparar precios y consultar anuncios detallados con galerías de fotos interactivas.

Desarrollado como parte del **AI Engineering Bootcamp de 4Geeks Academy**, con especial atención a la arquitectura basada en componentes, React Hooks, diseño adaptable y Spec-Driven Development (SDD).

> **Aviso:** Este es un proyecto educativo de frontend. Stayfinder no está afiliado a Airbnb. Los alojamientos y las interacciones de reserva son simulados; no se procesan reservas ni pagos reales.

---

## ✨ Funcionalidades

### 🏠 Página de inicio

- Cuadrícula adaptable de alojamientos.
- Búsqueda en tiempo real por nombre de propiedad o ubicación.
- Filtros por categoría: Todo, Alojamientos y Hoteles.
- Filtrado interactivo con `useState`.
- Carga asíncrona simulada mediante `useEffect`.
- Indicadores de carga y estados sin resultados.
- Tarjetas reutilizables de alojamiento con fotos, valoraciones, ubicaciones y precios por noche.

### 🔎 Catálogo de alojamientos

- Explorar todas las propiedades disponibles.
- Ordenar los alojamientos por precio, ascendente o descendente.
- Contador dinámico de resultados.
- Diseño adaptable con listados y mapa.
- Espacio reservado para el mapa, con diseño fijo (sticky) en escritorio.
- Componentes y datos compartidos para alojamientos.

### 🛏️ Detalle de la propiedad

- Rutas dinámicas con Next.js App Router (`/rooms/[id]`).
- Galería interactiva de fotos con navegación anterior/siguiente.
- Descripciones, ubicaciones, valoraciones y reseñas de propiedades.
- Información del anfitrión y servicios del alojamiento.
- Contador de huéspedes con límites mínimo y máximo.
- Botón de reserva interactivo que muestra un aviso de demostración.
- Estados de carga y de alojamiento no encontrado.

---

## 📸 Capturas de pantalla

Aquí se pueden añadir capturas de la aplicación final.

| Inicio | Catálogo | Detalle de la propiedad |
|---|---|---|
| Captura pendiente | Captura pendiente | Captura pendiente |

La interfaz sigue un enfoque **mobile-first**: comienza en 375 px y se adapta a pantallas de escritorio.

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| **Next.js 16** | App Router, rutas dinámicas, imágenes optimizadas y estructura de la aplicación |
| **React 19** | Componentes funcionales reutilizables y Hooks |
| **TypeScript** | Tipado estático y modelos de datos compartidos |
| **Tailwind CSS 4** | Estilos adaptables basados en utilidades |
| **ESLint** | Calidad y consistencia del código |
| **Git y GitHub** | Control de versiones y flujo de desarrollo |

No se utilizaron bibliotecas externas de componentes de interfaz.

---

## 📁 Estructura del proyecto

```text
stayfinder/
├── app/
│   ├── page.tsx                 # Inicio
│   ├── catalog/
│   │   └── page.tsx             # Catálogo
│   └── rooms/
│       └── [id]/
│           └── page.tsx         # Detalle de la propiedad
├── components/
│   ├── layout/                  # Barra de navegación y logotipo
│   ├── listings/                # Tarjetas y filtros de alojamientos
│   ├── search/                  # Componentes de búsqueda
│   ├── room/                    # Galería, anfitrión, servicios y reserva
│   └── shared/                  # Componentes de interfaz compartidos
├── data/                        # Datos simulados de alojamientos
├── types/                       # Interfaces de TypeScript
├── public/
│   └── images/accommodations/   # Fotos locales de las propiedades
├── specs/
│   ├── 001-home/
│   ├── 002-catalog/
│   └── 003-room-detail/
├── context.md                   # Contexto y requisitos del proyecto
└── README.md
```

---

## 🚀 Primeros pasos

### Requisitos previos

- Node.js compatible con Next.js 16 (Node.js 20.9 o posterior)
- npm

### Instalación

Clona el repositorio:

```bash
git clone <URL_DE_TU_REPOSITORIO>
cd <CARPETA_DE_TU_REPOSITORIO>
```

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Comandos disponibles

```bash
npm run dev         # Iniciar el servidor de desarrollo
npm run lint        # Ejecutar ESLint
npx tsc --noEmit    # Comprobar los tipos de TypeScript
npm run build       # Compilar para producción
npm run start       # Iniciar el servidor de producción
```

---

## 🧭 Rutas de la aplicación

| Ruta | Descripción |
|---|---|
| `/` | Página de inicio con búsqueda de alojamientos y filtros por categoría |
| `/catalog` | Catálogo de propiedades con ordenación por precio y espacio reservado para el mapa |
| `/rooms/[id]` | Detalle dinámico del alojamiento |

Ejemplo de ruta de una propiedad:

`/rooms/casa-luz-cadiz`

Los IDs de las propiedades están definidos en `data/accommodations.ts`.

---

## 🧩 Enfoque de desarrollo: Spec-Driven Development

Stayfinder se desarrolló mediante un flujo de trabajo de **Spec-Driven Development (SDD)** con apoyo de herramientas de programación basadas en IA.

Cada vista de la aplicación se desarrolló a partir de tres documentos:

- **`spec.md`** — Requisitos funcionales, componentes de interfaz, interacciones y criterios de aceptación.
- **`plan.md`** — Arquitectura técnica, estrategia de implementación y enfoque de pruebas.
- **`tasks.md`** — Tareas de implementación pequeñas y verificables.

El flujo de trabajo fue:

**Requisitos → Análisis visual → Especificación → Planificación → Implementación → Validación**

Las referencias visuales se analizaron y se tradujeron en especificaciones de componentes antes de la implementación.

Las tres fases de desarrollo están documentadas en `specs/`.

---

## ✅ Validación

El proyecto incluye comprobaciones de TypeScript, ESLint y compilación de producción.

```bash
npx tsc --noEmit
npm run lint
npm run build
```

También se prevé revisar manualmente en el navegador el diseño adaptable, la navegación y los controles interactivos.

---

## 🖼️ Imágenes y créditos

La aplicación utiliza fotografías de alojamientos almacenadas localmente con fines demostrativos.

Las imágenes adicionales proceden de Wikimedia Commons y se utilizan bajo sus respectivas licencias.

Consulta [Atribuciones de imágenes](public/images/accommodations/ATTRIBUTION.md) para ver los enlaces a las fuentes, los autores y la información sobre licencias.

---

## 📌 Alcance del proyecto

Stayfinder es una aplicación educativa que solo incluye frontend.

No incluye autenticación de usuarios, disponibilidad real de propiedades, procesamiento de pagos ni un sistema backend de reservas. El mapa es un elemento visual de muestra, no un servicio geográfico interactivo.

**Desarrollado como parte del AI Engineering Bootcamp de 4Geeks Academy.**
