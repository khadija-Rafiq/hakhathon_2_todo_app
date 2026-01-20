# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Build argument for API URL
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files
COPY . .

# Build Next.js app (standalone)
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# --- FINAL IMAGE ---
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set env for production
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
USER appuser

EXPOSE 3000

# Start the standalone Next.js server
CMD ["node", "server.js"]
