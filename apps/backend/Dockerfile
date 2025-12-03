FROM node:20-alpine AS base
WORKDIR /usr/src/app

ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/backend/package.json apps/backend/package.json

RUN pnpm install --filter backend... --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm --filter backend build

FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/backend/package.json apps/backend/package.json

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/apps/backend/node_modules ./apps/backend/node_modules

COPY --from=build /usr/src/app/apps/backend/dist ./apps/backend/dist

EXPOSE 4000
ENV PORT=4000

CMD ["node", "apps/backend/dist/main.js"]
