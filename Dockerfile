# ---------- build ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- runtime ----------
# Playwright's own image ships Chromium + every system dependency it needs —
# required here because the "run tests live" feature in the Tests section
# actually spawns `npx playwright test` against this running instance.
FROM mcr.microsoft.com/playwright:v1.62.1-jammy AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY package.json package-lock.json ./
RUN npm ci

COPY server ./server
COPY scripts ./scripts
COPY tests ./tests
COPY playwright.config.ts ./
COPY --from=build /app/dist ./dist
RUN mkdir -p test-results

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://localhost:'+(process.env.PORT||8080)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["npm", "start"]
