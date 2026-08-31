# murec

Frontend for the MUREC homepage. Content is pulled from murec.com, the visual
language is a redesign inspired by timeless.club.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- GSAP + ScrollTrigger for pinned/scrubbed sections
- Lenis for smooth scroll (synced with GSAP)
- React Three Fiber + drei for scene work
- Framer Motion for small reveals

## Run

```bash
cd murec
npm install
npm run dev
```

Open http://localhost:3000.

Other scripts:

```bash
npm run build
npm run start
npm run lint
npm run typecheck
```

## Folder layout

Feature folders so each section is self-contained.

```
src/
├── app/                  Next.js routes, root layout, globals.css
├── features/
│   ├── navigation/       Navbar, Footer
│   ├── preloader/        loading overlay + R3F scene
│   ├── hero/             hero + R3F scene
│   ├── legacy/           legacy section
│   ├── principles/       principles section
│   ├── collection/       collection section
│   ├── philosophy/       IGBC philosophy section
│   ├── associations/     associations section
│   ├── partners/         partners section
│   ├── section-effects/  reusable per-section R3F scene wrapper
│   └── contact/          contact section + form
├── shared/
│   ├── components/       UI primitives
│   ├── hooks/            useSmoothScroll etc.
│   └── lib/              cn(), motion presets
└── data/                 site + partner data

public/
├── associations/         organisation logos
├── brand/                MUREC + Madhusudan brand assets
└── partners/             partner portraits
```

Path aliases (`@features/*`, `@shared/*`, `@data/*`, `@/*`) live in `tsconfig.json`.

## Design

- Palette: ink `#0F0E0C`, cream `#E8E1D3`, brass `#C9A961`.
- Type: Cormorant Garamond for display, Manrope for body.
- Motion: shared ease `[0.22, 1, 0.36, 1]`, 800 to 1100ms reveals. `prefers-reduced-motion` is respected.
- 3D: hero uses a particle field + orbital system. Section backgrounds load on demand via IntersectionObserver so only 1 or 2 WebGL contexts are alive at a time.

## Responsive

Tested at 375, 768 and 1440. Fluid spacing via `clamp()` in the section wrapper.

## Deploy

Point Vercel at `murec/` as the project root. No env vars needed.
