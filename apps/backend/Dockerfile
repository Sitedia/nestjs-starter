# BUILD

FROM node:20-alpine AS builder

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /build

RUN npm install -g --ignore-scripts @nestjs/cli pnpm

COPY nx.json package.json tsconfig.base.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY libs/health/package.json libs/health/project.json libs/health/tsconfig.json ./libs/health/
COPY libs/health/src ./libs/health/src
COPY libs/logger/package.json libs/logger/project.json libs/logger/tsconfig.json ./libs/logger/
COPY libs/logger/src ./libs/logger/src
COPY apps/backend/package.json apps/backend/nest-cli.json apps/backend/project.json apps/backend/tsconfig.json ./apps/backend/
COPY apps/backend/src ./apps/backend/src

RUN pnpm install --frozen-lockfile --ignore-scripts
RUN npx nx build apps/backend
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# TARGET

FROM node:20-alpine AS production

ARG APP_VERSION

ENV NODE_ENV production
ENV APP_VERSION=$APP_VERSION
ENV NEXT_TELEMETRY_DISABLED 1

USER node
WORKDIR /app

COPY --from=builder /build/node_modules/ ./node_modules/
COPY --from=builder /build/apps/backend/ ./apps/backend/

CMD ["node", "apps/backend/dist/apps/backend/src/main.js"]
