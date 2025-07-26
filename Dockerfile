# Multi-stage Dockerfile for Next.js application

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Copy workspace configuration
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY .npmrc* ./

# Copy frontend package files
COPY apps/frontend/package.json ./apps/frontend/

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile --filter "./apps/frontend"

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Copy workspace configuration
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY .npmrc* ./

# Copy package files
COPY apps/frontend/package.json ./apps/frontend/

# Install ALL dependencies (for build)
RUN pnpm install --frozen-lockfile --filter "./apps/frontend"

# Copy source code
COPY apps/frontend ./apps/frontend

# Build the application
WORKDIR /app/apps/frontend
RUN pnpm run build

# Stage 3: Production Dependencies
FROM node:20-alpine AS production-deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Copy workspace configuration
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY .npmrc* ./

# Copy package files
COPY apps/frontend/package.json ./apps/frontend/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --filter "./apps/frontend" --prod

# Stage 4: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy Next.js standalone build (which includes server.js and node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./

# Copy static files and public folder
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static  
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/public ./apps/frontend/public

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set hostname and port
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Start the application
CMD ["node", "server.js"]