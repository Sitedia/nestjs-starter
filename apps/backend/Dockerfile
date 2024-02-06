# BUILD

FROM node:20-alpine AS builder

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /build

RUN npm install -g --ignore-scripts @nestjs/cli

COPY nx.json package.json tsconfig.base.json yarn.lock ./
COPY libs/health/package.json libs/health/project.json libs/health/tsconfig.json ./libs/health/
COPY libs/health/src ./libs/health/src
COPY libs/logger/package.json libs/logger/project.json libs/logger/tsconfig.json ./libs/logger/
COPY libs/logger/src ./libs/logger/src
COPY apps/backend/package.json apps/backend/nest-cli.json apps/backend/project.json apps/backend/tsconfig.json ./apps/backend/
COPY apps/backend/src ./apps/backend/src

RUN yarn install --frozen-lockfile --ignore-scripts
RUN npx nx build apps/backend
RUN yarn --production --frozen-lockfile --ignore-scripts

# TARGET

FROM node:20-alpine AS production

ARG APP_VERSION

ENV NODE_ENV production
ENV APP_VERSION=$APP_VERSION
ENV NEXT_TELEMETRY_DISABLED 1

USER node
WORKDIR /app

COPY --from=builder /build/node_modules/ ./node_modules/
COPY --from=builder /build/apps/backend/dist/ ./

CMD ["node", "apps/backend/src/main.js"]
