# 🏡 Stayfinder

### Airbnb-Inspired Vacation Rental Platform

A responsive vacation rental web application built with **Next.js 16, React 19, TypeScript, and Tailwind CSS 4**.

Stayfinder recreates the core frontend experience of a vacation rental platform inspired by Airbnb. Users can explore properties, search and filter accommodations, compare prices, and view detailed listings with interactive photo galleries.

Developed as part of the **4Geeks Academy AI Engineering Bootcamp**, with a focus on component-based architecture, React Hooks, responsive design, and Spec-Driven Development (SDD).

> **Disclaimer:** This is an educational frontend project. Stayfinder is not affiliated with Airbnb. All accommodations and booking interactions are simulated; no real reservations or payments are processed.

---

## ✨ Features

### 🏠 Home Page

- Responsive accommodation grid.
- Real-time search by property name or location.
- Category filters: All, Accommodations, and Hotels.
- Interactive filtering using `useState`.
- Simulated asynchronous loading using `useEffect`.
- Loading indicators and empty states.
- Reusable accommodation cards displaying photos, ratings, locations, and nightly prices.

### 🔎 Accommodation Catalog

- Browse all available properties.
- Sort accommodations by price, ascending or descending.
- Dynamic results counter.
- Responsive listing and map layout.
- Map placeholder with a sticky desktop layout.
- Shared accommodation components and data.

### 🛏️ Property Details

- Dynamic routes using Next.js App Router (`/rooms/[id]`).
- Interactive photo gallery with previous/next navigation.
- Property descriptions, locations, ratings, and reviews.
- Host information and accommodation amenities.
- Guest counter with minimum and maximum limits.
- Interactive booking button with a demonstration notice.
- Loading and not-found states.

---

## 📸 Screenshots

Screenshots of the final application can be added here.

| Home | Catalog | Property Details |
|---|---|---|
| Screenshot pending | Screenshot pending | Screenshot pending |

The interface is designed with a **mobile-first approach**, starting at 375px and adapting to desktop layouts.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | App Router, dynamic routes, optimized images and application structure |
| **React 19** | Reusable functional components and Hooks |
| **TypeScript** | Static typing and shared data models |
| **Tailwind CSS 4** | Responsive, utility-first styling |
| **ESLint** | Code quality and consistency |
| **Git & GitHub** | Version control and development workflow |

No external UI component libraries were used.

---

## 📁 Project Structure

```text
stayfinder/
├── app/
│   ├── page.tsx                 # Home
│   ├── catalog/
│   │   └── page.tsx             # Catalog
│   └── rooms/
│       └── [id]/
│           └── page.tsx         # Property details
├── components/
│   ├── layout/                  # Navbar and logo
│   ├── listings/                # Accommodation cards and filters
│   ├── search/                  # Search components
│   ├── room/                    # Gallery, host, amenities, booking
│   └── shared/                  # Shared UI components
├── data/                        # Mock accommodation data
├── types/                       # TypeScript interfaces
├── public/
│   └── images/accommodations/   # Local property photos
├── specs/
│   ├── 001-home/
│   ├── 002-catalog/
│   └── 003-room-detail/
├── context.md                   # Project context and requirements
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js compatible with Next.js 16 (Node.js 20.9 or later)
- npm

### Installation

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_FOLDER>
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available Commands

```bash
npm run dev         # Start development server
npm run lint        # Run ESLint
npx tsc --noEmit    # Check TypeScript types
npm run build       # Build for production
npm run start       # Start production server
```

---

## 🧭 Application Routes

| Route | Description |
|---|---|
| `/` | Home page with accommodation search and category filters |
| `/catalog` | Property catalog with price sorting and map placeholder |
| `/rooms/[id]` | Dynamic accommodation details |

Example property route:

`/rooms/casa-luz-cadiz`

Property IDs are defined in `data/accommodations.ts`.

---

## 🧩 Development Approach: Spec-Driven Development

Stayfinder was built using a **Spec-Driven Development (SDD)** workflow supported by AI coding tools.

Each application view was developed through three documents:

- **`spec.md`** — Functional requirements, UI components, interactions, and acceptance criteria.
- **`plan.md`** — Technical architecture, implementation strategy, and testing approach.
- **`tasks.md`** — Small, verifiable implementation tasks.

The workflow followed:

**Requirements → Visual Analysis → Specification → Planning → Implementation → Validation**

Visual references were analyzed and translated into component specifications before implementation.

The three development phases are documented under `specs/`.

---

## ✅ Validation

The project includes TypeScript, ESLint, and production build checks.

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Responsive behavior, navigation, and interactive controls are also intended to be reviewed manually in the browser.

---

## 🖼️ Images & Credits

The application uses locally stored accommodation photographs for demonstration purposes.

Additional images were sourced from Wikimedia Commons under their respective licenses.

See [Image Attributions](public/images/accommodations/ATTRIBUTION.md) for source links, authors, and licensing information.

---

## 📌 Project Scope

Stayfinder is a frontend-only educational application.

It does not include user authentication, real property availability, payment processing, or a backend reservation system. The map is a visual placeholder rather than an interactive geographic service.

**Built as part of the 4Geeks Academy AI Engineering Bootcamp.**