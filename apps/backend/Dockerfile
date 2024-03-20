# BUILD
FROM registry.access.redhat.com/ubi9/nodejs-20:1-34 AS builder

WORKDIR /build

USER root

COPY nx.json package.json tsconfig.base.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY libs/nestjs-common/package.json libs/nestjs-common/project.json  libs/nestjs-common/tsconfig.json ./libs/nestjs-common/
COPY libs/nestjs-common/src ./libs/nestjs-common/src
COPY apps/backend/package.json apps/backend/project.json apps/backend/nest-cli.json apps/backend/tsconfig.json ./apps/backend/
COPY apps/backend/src ./apps/backend/src
RUN chown -R 1001:0 .

USER default

RUN npm install -g --ignore-scripts @nestjs/cli pnpm nx
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN nx build apps/backend
RUN pnpm install --prod --force --frozen-lockfile --ignore-scripts

# TARGET
FROM registry.access.redhat.com/ubi9/nodejs-20-minimal:1-37

WORKDIR /app

USER nobody

ENV NODE_ENV production

COPY --from=builder /build/node_modules/ ./node_modules/
COPY --from=builder /build/apps/backend/ ./apps/backend/

CMD ["node", "apps/backend/dist/apps/backend/src/main.js"]
