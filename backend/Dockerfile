FROM node:20-alpine AS builder
WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci

# Build
COPY . .
# If you use TypeScript, ensure "build" outputs to /app/dist
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
# Your app should read process.env.PORT; we'll map host->container in deploy
ENV PORT=8000

# Copy only what's needed to run
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Remove dev deps just in case
RUN npm prune --omit=dev

EXPOSE 8000

# Optional healthcheck (expects GET /health to return 200)
HEALTHCHECK --interval=30s --timeout=3s --retries=5 CMD wget -qO- http://127.0.0.1:8000/health || exit 1

CMD ["node", "dist/index.js"]
