# CLAUDE.md

## Project Overview

Full-stack reactive blog application with real-time updates via Server-Sent Events (SSE).

- **Frontend**: React 19 + TypeScript + Vite (`blog-frontend/`)
- **Backend**: Spring Boot 4.0.3 + Spring WebFlux + R2DBC (`src/`)
- **Database**: PostgreSQL with Liquibase migrations
- **Auth**: OAuth2 via a BFF (Backend for Frontend) proxy on port 9090

---

## Architecture

```
blog/
├── blog-frontend/          # React frontend (port: Vite default)
├── src/                    # Spring Boot backend (port: 8082)
├── compose.yaml            # PostgreSQL via Docker
└── build.gradle.kts        # Backend build
```

### Backend layout (`src/main/java/ai/almostworking/blog/`)

| Package | Purpose |
|---------|---------|
| `model/` | Entities: `Post`, `Comment`, `Chat`, `ErrorResponse` |
| `repository/` | R2DBC repositories |
| `service/` | Business logic + validation services |
| `handler/` | Reactive request handlers |
| `route/` | Functional router config (`BlogRoutes`) |
| `exception/` | Custom exceptions |
| `config/` | CORS and other config |
| `filter/` | `RequestLoggingFilter` |

### Frontend layout (`blog-frontend/src/`)

| Directory | Purpose |
|-----------|---------|
| `pages/` | Route-level components |
| `components/` | Reusable components (ui/, blog/, layout/, auth/) |
| `api/` | Axios clients and endpoint functions |
| `hooks/` | Custom SSE hooks (`usePostStream`, `useChatStream`, `useCommentStream`) |
| `types/` | TypeScript interfaces |

---

## Running the Project

### 1. Start the database
```bash
docker compose up -d
```

### 2. Start the backend
```bash
./gradlew bootRun
# Runs on http://localhost:8082
```

### 3. Start the frontend
```bash
cd blog-frontend
npm install
npm run dev
```

The Vite dev server proxies these routes (configured in `vite.config.ts`):
- `/oauth2`, `/api/bff` → `http://localhost:9090` (BFF/auth server)
- `/api/blog` → `http://localhost:9090`
- `/api/blog/sse` → SSE-specific proxy with keep-alive

---

## Key Commands

### Backend
```bash
./gradlew clean build        # Build
./gradlew bootRun            # Run
./gradlew bootBuildImage     # Build Docker image (tag: gluonstream/blog-be:latest)
```

### Frontend
```bash
npm run dev      # Dev server
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint
npm run preview  # Preview built app
```

---

## Backend Configuration

`src/main/resources/application.yaml`:
```yaml
server.port: 8082
spring.r2dbc.url: r2dbc:postgresql://localhost:5432/mydatabase
blog.api.prefix: /api/blog
```

Database credentials (local dev): `myuser` / `secret`

---

## Database Migrations

Liquibase changelogs in `src/main/resources/db/changelog/`.
Master file: `db.changelog-master.yaml`
Individual changes in `changes/` subdirectory.

Schema tables: `post` (slug-keyed), `comment` (with parent/reply support), `chat`.

---

## Tech Stack Details

| Layer | Technology |
|-------|-----------|
| Java | 25 |
| Spring Boot | 4.0.3 |
| Reactive | Spring WebFlux + Reactor |
| DB Access | Spring Data R2DBC |
| Migrations | Liquibase |
| Frontend | React 19, TypeScript 5.9 |
| Build | Vite 6, Gradle 9.3 |
| Styling | Tailwind CSS 4 + glass-morphism design system |
| HTTP Client | Axios |
| Server State | TanStack React Query 5 |
| Routing | React Router DOM 7 |
| Animations | Framer Motion 12 |
| Markdown | React Markdown + Rehype Highlight |

---

## Real-Time (SSE)

- Backend broadcasts events via `Sinks.Many` (Reactor)
- Event types: `post-added`, `comment-added`, `chat-added`, `keep-alive`
- Frontend hooks subscribe and update React Query cache directly
- Duplicate prevention is handled inside the hooks

---

## Code Conventions

- **Backend**: Functional routing, reactive `Mono`/`Flux` chains, validation decoupled into separate services
- **Frontend**: Functional components, React Query for server state, Tailwind utility classes
- **Formatting**: Prettier (2-space indent, single quotes, trailing commas, 100-char print width)
- **Linting**: ESLint with TypeScript ESLint + React Hooks rules
