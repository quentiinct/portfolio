<div align="center">

# Quentin Courtade

**Developer & Editor**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[quentincourtade.com](https://quentincourtade.com)

</div>

---

## Overview

Personal portfolio showcasing my work as a freelance developer and video editor. Built with a dark, immersive 8-bit pixel art aesthetic — animated space backgrounds, interactive pixel scenes, and a bento grid layout.

### Features

- **Bento grid layout** — Responsive card-based design with glassmorphism
- **8-bit pixel art scenes** — Hand-coded SVG scenes per card (space station, forest, city, stage)
- **Animated space background** — Canvas-rendered stars, planets with hover glow, shooting stars and a rocket with organic sine-wave movement
- **YouTube client showcase** — Growth metrics, sparkline charts, and featured videos for 3 channels (350K → 750K+)
- **GitHub integration** — Live repo carousel via GitHub API with caching
- **Easter egg** — Type `/kill` in the hero terminal
- **Framer Motion animations** — Staggered card reveals, hover flash borders, slide transitions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion 12 |
| Rendering | Canvas 2D + SVG |
| Fonts | Geist Sans & Geist Mono |

## Project Structure

```
src/app/
├── page.tsx              # Home — bento grid, hero, cards, pixel scenes
├── layout.tsx            # Root layout, metadata, fonts
├── globals.css           # Dark theme, glassmorphism, grain overlay
├── data.ts               # YouTube channel data
├── clients/
│   └── page.tsx          # YouTube clients detail page
└── components/
    ├── SpaceBackground.tsx  # Canvas — stars, planets, rocket
    └── StageScene.tsx       # SVG — stage/camera pixel scene
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [localhost:3000](http://localhost:3000) to view.

## Deployment

Deployed on [Vercel](https://vercel.com). Push to `main` triggers automatic builds.

## License

All rights reserved.
