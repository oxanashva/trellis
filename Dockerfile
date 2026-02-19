# --- STAGE 1: Build Stage (Frontend + Backend Structure) ---
FROM node:22-alpine AS builder
WORKDIR /app
# Define a "placeholder" environment variable
ARG VITE_CLOUD_NAME
ARG VITE_API_URL

# 1. Prepare Backend structure (so Vite has a place to output)
RUN mkdir -p trellis-backend/public

# 2. Copy Frontend files and install deps
COPY trellis-frontend/package*.json ./trellis-frontend/
RUN cd trellis-frontend && npm ci

# 3. Copy Frontend source and Build
# This will output to ../trellis-backend/public based on your vite.config.js
COPY trellis-frontend/ ./trellis-frontend/
RUN cd trellis-frontend && VITE_CLOUD_NAME=$VITE_CLOUD_NAME VITE_API_URL=$VITE_API_URL npm run build

# 4. Prepare Backend deps
COPY trellis-backend/package*.json ./trellis-backend/
RUN cd trellis-backend && npm ci --only=production

# 5. Copy Backend source
COPY trellis-backend/ ./trellis-backend/

# --- STAGE 2: Final Runtime Image ---
FROM node:22-alpine
WORKDIR /app/trellis-backend

# Copy only the prepared backend (which now contains the public folder)
COPY --from=builder /app/trellis-backend ./

# Set environment and user for security (Good for OpenShift/Jenkins)
ENV NODE_ENV=production
USER node

EXPOSE 3030
CMD ["node", "server.js"]