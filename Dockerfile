FROM node:20-slim AS base

RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
COPY packages/i18n/package.json packages/i18n/

RUN pnpm install --frozen-lockfile

COPY packages/ packages/
COPY apps/api/src/ apps/api/src/
COPY apps/api/tsconfig.json apps/api/
COPY apps/api/drizzle/ apps/api/drizzle/
COPY apps/api/drizzle.config.ts apps/api/

ENV NODE_ENV=production
ENV PORT=2222

EXPOSE 2222

CMD ["pnpm", "--filter", "api", "exec", "tsx", "src/index.ts"]