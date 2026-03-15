# ============================
# STAGE 1 — Frontend + Backend Builder (frontend is built to trellis-backend/public/)
# ============================
FROM node:22-alpine AS builder
WORKDIR /app

ARG VITE_CLOUD_NAME
ARG VITE_API_URL

RUN mkdir -p trellis-backend/public

# Frontend deps
COPY trellis-frontend/package*.json ./trellis-frontend/
RUN cd trellis-frontend && npm ci

# Frontend build
COPY trellis-frontend/ ./trellis-frontend/
RUN cd trellis-frontend && \
    VITE_CLOUD_NAME=$VITE_CLOUD_NAME \
    VITE_API_URL=$VITE_API_URL \
    npm run build

# Backend deps
COPY trellis-backend/package*.json ./trellis-backend/
RUN cd trellis-backend && npm ci --only=production

# Backend source
COPY trellis-backend/ ./trellis-backend/


# ============================
# STAGE 2 — Runtime App Image
# ============================
FROM node:22-alpine AS app
WORKDIR /app/trellis-backend

COPY --from=builder /app/trellis-backend ./

ENV NODE_ENV=production
USER node

EXPOSE 3030
CMD ["node", "server.js"]


# ============================
# STAGE 3 — Playwright Test Runner
# ============================
FROM mcr.microsoft.com/playwright:v1.50.0-noble AS tests
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npx", "playwright", "test"]