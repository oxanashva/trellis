# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

Trellis is a full-stack Trello-like board application. The repo is a monorepo with two Git submodules:

- `trellis-frontend/` — React 19 + Vite SPA
- `trellis-backend/` — Express 5 REST API + WebSocket server

After cloning, initialize submodules:
```bash
git submodule update --init --recursive
```

## Development Commands

### Frontend (`trellis-frontend/`)
```bash
npm run dev          # Vite dev server on port 5173
npm run dev:local    # Dev server with devlocal env overrides
npm run build        # Build to ../trellis-backend/public/
npm run lint         # ESLint
npm run preview      # Preview production build
```

### Backend (`trellis-backend/`)
```bash
npm run dev          # nodemon (auto-reload)
npm start            # node server.js
```

### Full stack via Docker
```bash
docker-compose up    # Starts app (port 3030), Elasticsearch (9200), Kibana (5601)
```

## Architecture

### Frontend

- **State**: Redux (`src/store/`). Actions in `store/actions/`, reducers in `store/reducers/`.
- **Routing**: React Router 7. Routes defined in `RootCmp.jsx`. Main routes: `/home`, `/workspace`, `/board/:boardId`, `/board/:boardId/task/:taskId`, `/auth/login`, `/auth/signup`.
- **Components**: `src/cmps/` (shared/reusable), `src/pages/` (route-level). Board UI is nested: `BoardDetails` → groups → tasks → `TaskEdit` (modal via nested route).
- **Drag & Drop**: `@dnd-kit/core` + `@dnd-kit/sortable` for reordering groups and tasks.
- **Real-time**: `socket.io-client` for live board updates.
- **Env vars**: Prefixed with `VITE_`. `VITE_API_URL` sets the backend URL; `VITE_CLOUD_NAME` for Cloudinary uploads. Three env files: `.env.development`, `.env.devlocal`, `.env.production`.
- **SVGs**: Imported as React components via `vite-plugin-svgr`.
- **HTTP service**: All API calls go through `services/http.service.js`. On error, it logs via `logger.error` (never `console`) and throws a clean `new Error(serverMsg)` — raw axios internals never propagate to UI components. Callers get either the backend's structured `error` field or a generic fallback string.

### Backend

- **Entry point**: `server.js` — sets up Express, CORS (dev only, allows localhost:3000 and :5173), static serving of `public/` (prod), and Socket.io.
- **Routes**: Mounted under `/api/auth`, `/api/user`, `/api/review`, `/api/board`.
- **Services**: `services/db.service.js` (MongoDB connection pool), `services/socket.service.js` (WebSocket events), `services/logger.service.js` (Winston — writes to console + Elasticsearch, also exposes `/api/log` for frontend log forwarding).
- **Middleware**: `setupAls.middleware.js` uses `AsyncLocalStorage` to propagate request context (logged-in user, `requestId`) without threading it through every function call. `logger.middleware.js` sanitizes the request body before logging and injects a `requestId` (UUID) into ALS so all log lines for a request can be correlated in Kibana. `requireAuth.middleware.js` protects routes.
- **Config**: `config/index.js` switches between `config/dev.js` (local MongoDB at `127.0.0.1:27017`, db: `trellis_db`) and `config/prod.js` (MongoDB Atlas via `MONGO_URL` and `DB_NAME` env vars) based on `NODE_ENV`.
- **Auth**: Session cookie-based. Passwords hashed with `bcrypt`. Sensitive data encrypted with `cryptr`. Requires `SECRET` env var — will throw at startup if missing (no fallback).
- **Error handling**: A centralized Express error handler (4-arg middleware, registered last in `server.js`) catches all `next(err)` calls. In production it returns `{ error: 'An unexpected error occurred' }`; in dev it returns the actual message. Route handlers should call `next(err)` rather than sending raw errors.
- **ES modules**: Backend uses `"type": "module"` — use `import`/`export` syntax, not `require`.

### Build & Deployment

- `npm run build` in `trellis-frontend/` outputs to `trellis-backend/public/`. The Express server serves this as static files in production, with a catch-all `/*` → `public/index.html` for SPA routing.
- Docker: multi-stage build (builder stage runs `vite build`, runtime stage runs `node server.js`). Build args `VITE_CLOUD_NAME` and `VITE_API_URL` must be set (from `.env` in project root or shell env).
- CI/CD: Jenkins pipeline in `Jenkinsfile.groovy` — builds Docker image, pushes to Docker Hub (tagged with git SHA), deploys to Render. Sends Slack and email notifications.
- Elasticsearch + Kibana are included in `docker-compose.yml` for log aggregation/visualization.
