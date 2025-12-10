# 🚀 Chat Online With Game — Monorepo

This project is a PNPM monorepo containing:

- apps/backend → NestJS 11 API using Hexagonal Architecture.

- apps/frontend → Next.js 16 web application.

- packages/shared → shared code between frontend and backend.

## 📦 1. Installation

Requirements:

- Node.js 20+
- PNPM 8+
- Docker (optional, for containerized development).
- Git

### Install all workspace dependencies

```bash
pnpm install
```

## 🔧 2. Monorepo Structure

```bash
.
├── apps/
│   ├── backend/  → NestJS API (Hexagonal Architecture)
│   └── frontend/ → Next.js application
└── packages/
    └── shared/   → shared DTOs, schemas, utilities
```

## ▶️ 3. Running the Project (Local Development)

Run backend + frontend simultaneously:

```bash
pnpm dev
```

## Run only the backend

```bash
pnpm dev:backend
```

## Run only the frontend

```bash
pnpm dev:frontend
```

## 🏗️ 4. Build Commands

Build everything:

```bash
pnpm build # builds backend + frontend
```

Build the backend only:

```bash
pnpm build:backend
```

Build the frontend only:

```bash
pnpm build:frontend
```

## 🚢 5. Production (Without Docker)

```bash
pnpm build
pnpm start
```

## 🌎 6. Environment Stages

The project uses a custom STAGE environment variable:

Possible values:

- local
- develop
- qa
- production

Examples:

```bash
STAGE=local pnpm dev
STAGE=develop pnpm dev
STAGE=qa pnpm dev
STAGE=production pnpm dev
```

## 🐳 7. Docker Development

Run development environment:

```bash
pnpm docker:dev:up
```

Stop containers:

```bash
pnpm docker:dev:down
```

Clean containers, volumes, and local images:

```bash
pnpm docker:down:clean
```

Manual docker-compose:

```bash
docker compose -f docker-compose.dev.yml up
```

Logs:

```bash
docker compose logs -f
```

## 🧪 8. Testing

### .spec.ts and .test.ts support

The backend supports:

- Unit tests
- Integration tests
- E2E tests

### Run all tests

```bash
pnpm test
```

Watch mode:

```bash
pnpm test:watch
```

Coverage:

```bash
pnpm test:cov
```

E2E tests:

```bash
pnpm test:e2e
```

## 🧭 9. SonarCloud Analysis

```bash
sonar-scanner \
  -Dsonar.login=SONAR_TOKEN \
  -Dsonar.projectKey=SONAR_PROJECT_KEY \
  -Dsonar.organization=SONAR_ORGANIZATION \
  -Dsonar.host.url=https://sonarcloud.io
```

## ✅ 10. Verify to merge

### The token must be exported beforehand

```bash
export SONAR_TOKEN=${SONAR_TOKEN}
```

```bash
pnpm ci:local
```

## Install new dependencies into proyect

```bash
Example for add  a library @jest/types into backend

pnpm add -D @jest/types --filter backend
```
