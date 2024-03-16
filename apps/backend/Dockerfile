# BUILD
FROM registry.access.redhat.com/ubi9/nodejs-20:1-34 AS builder

WORKDIR /build

COPY --chown=1001:0 --chmod=755 nx.json package.json tsconfig.base.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=1001:0 --chmod=755 libs/health/package.json libs/health/project.json libs/health/tsconfig.json ./libs/health/
COPY --chown=1001:0 --chmod=755 libs/health/src ./libs/health/src
COPY --chown=1001:0 --chmod=755 libs/logger/package.json libs/logger/project.json libs/logger/tsconfig.json ./libs/logger/
COPY --chown=1001:0 --chmod=755 libs/logger/src ./libs/logger/src
COPY --chown=1001:0 --chmod=755 apps/backend/package.json apps/backend/nest-cli.json apps/backend/project.json apps/backend/tsconfig.json ./apps/backend/
COPY --chown=1001:0 --chmod=755 apps/backend/src ./apps/backend/src

RUN mkdir /build/apps/backend/node_modules
RUN chmod 755 /build/apps/backend/node_modules
RUN npm install -g --ignore-scripts @nestjs/cli pnpm
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN npx nx build apps/backend
RUN pnpm install --prod --force --frozen-lockfile --ignore-scripts

# TARGET

FROM registry.access.redhat.com/ubi9/nodejs-20-minimal:1-37 AS production

ARG APP_VERSION

ENV NODE_ENV production
ENV APP_VERSION=$APP_VERSION

WORKDIR /app

COPY --chown=1001:0 --from=builder /build/node_modules/ ./node_modules/
COPY --chown=1001:0 --from=builder /build/apps/backend/ ./apps/backend/

CMD ["node", "apps/backend/dist/apps/backend/src/main.js"]
