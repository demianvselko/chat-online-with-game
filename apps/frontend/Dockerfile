FROM node:20-alpine AS base
WORKDIR /usr/src/app

ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ---- Dependencies ----
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/frontend/package.json apps/frontend/package.json

RUN pnpm install --filter frontend... --frozen-lockfile

# ---- Build ----
FROM deps AS build
COPY . .
RUN pnpm --filter frontend build

# ---- Runtime ----
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/frontend/package.json apps/frontend/package.json

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/apps/frontend/node_modules ./apps/frontend/node_modules

COPY --from=build /usr/src/app/apps/frontend/.next ./apps/frontend/.next
COPY --from=build /usr/src/app/apps/frontend/public ./apps/frontend/public
COPY --from=build /usr/src/app/apps/frontend/next.config.* ./apps/frontend/
COPY --from=build /usr/src/app/apps/frontend/package.json ./apps/frontend/package.json

WORKDIR /usr/src/app/apps/frontend

EXPOSE 3000
ENV PORT=3000

CMD ["pnpm", "start"]
