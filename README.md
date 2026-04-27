# Prompt Vault

**Personal AI Prompt Library — Save, search, and reuse your best AI prompts**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

---

> *Built because I kept losing the best prompts I found — buried in bookmarks, screenshots, and forgotten tabs.*

## The Problem

Every day I was coming across incredible AI prompts on Twitter/X — prompts that generated stunning images, wrote compelling copy, produced cinematic video clips. I'd bookmark the tweet, screenshot it, paste it into a notes app.

Two weeks later: gone. Buried. Lost.

**The pattern was always the same:**  
Find a great prompt → save it somewhere vague → never find it again when you actually need it.

So I built Prompt Vault. A private library where prompts don't disappear.

---

## Overview

Prompt Vault is a self-hosted web app that lets you collect AI prompts from Twitter/X with a single URL paste. It automatically pulls the tweet text, downloads the media (images, videos, GIFs), extracts author info, and suggests tags based on the content — sector, AI tool, visual style.

Everything is stored locally. No third-party cloud. Your prompts stay yours.

---

## Features

- **One-click tweet import** — Paste a Twitter/X URL; the app fetches text, media, and author info automatically via vxtwitter / fxtwitter APIs
- **Smart auto-tagging** — Analyzes prompt content and suggests tags by sector (Tech, Fashion, Food…), AI tool (Midjourney, DALL-E, Stable Diffusion…), and style (Cinematic, 3D, Anime…)
- **Media archiving** — Images, videos, and GIFs are downloaded and stored locally — no broken links when tweets get deleted
- **Manual prompt entry** — No tweet? Add prompts directly with custom tags
- **Real-time search** — Filter your entire library instantly as you type
- **Full CRUD** — View, edit, delete, and copy-to-clipboard for every prompt
- **Authentication** — JWT-based session system; your library is private by default

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Database | PostgreSQL 15 |
| ORM | Prisma |
| Auth | NextAuth v5 — JWT + Credentials |
| Styling | Tailwind CSS v4 |
| Infrastructure | Docker & Docker Compose |

---

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Node.js 18+

### 1. Clone the repo

```bash
git clone https://github.com/aikirbaclayan/prompt.git
cd prompt
```

### 2. Configure environment

```bash
cp env.example .env
```

Edit `.env`:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_strong_password
POSTGRES_DB=prompt_vault

DATABASE_URL=postgresql://postgres:your_strong_password@db:5432/prompt_vault

AUTH_SECRET=generate_with__openssl_rand_base64_32
AUTH_URL=http://localhost:3000
```

### 3. Start with Docker Compose

```bash
docker compose up -d
```

| Service | URL |
|---|---|
| App | http://localhost:3000 |
| Adminer (DB UI) | http://localhost:8080 |

### Alternative — Local Dev (DB in Docker, Next.js local)

```bash
# Start only the database
docker compose up -d db

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Apply migrations
npx prisma migrate deploy

# Start dev server
npm run dev
```

---

## First Run

1. Go to `http://localhost:3000/register` and create your account
2. Sign in
3. Click **"+ Add Prompt"** on the home page
4. Paste a Twitter/X URL — or type a prompt manually
5. Review the auto-suggested tags, save

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── prompts/          # CRUD endpoints
│   │   │   └── [id]/         # Update & delete by ID
│   │   ├── tweet/            # Tweet content fetcher
│   │   ├── upload/           # Media download & storage
│   │   ├── download-media/   # Media serve endpoint
│   │   └── auth/             # NextAuth handler & registration
│   ├── login/
│   ├── register/
│   └── page.tsx              # Main dashboard
├── components/               # UI components
├── hooks/                    # usePrompts custom hook
├── lib/                      # Prisma client, utilities
├── types/                    # TypeScript type definitions
└── middleware.ts             # Route protection
prisma/
├── schema.prisma             # Database schema
└── migrations/               # SQL migration files
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/prompts` | List all prompts |
| `POST` | `/api/prompts` | Create a prompt |
| `PUT` | `/api/prompts/[id]` | Update a prompt |
| `DELETE` | `/api/prompts/[id]` | Delete a prompt |
| `GET` | `/api/tweet?url=` | Fetch tweet content |
| `POST` | `/api/upload` | Download & store media |
| `POST` | `/api/auth/register` | Register a new user |

All endpoints except `/api/auth/*` require an active session.

---

## Database Schema

```
Prompt    — text, tweet metadata, tags, author info
Media     — images / videos / GIFs linked to a prompt
User      — accounts with bcrypt-hashed passwords
```

---

## License

[MIT](./LICENSE)
