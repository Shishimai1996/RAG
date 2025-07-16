# Install pnpm globally in the base image
FROM public.ecr.aws/docker/library/node:20.9.0-slim AS base

FROM base AS dependencies
WORKDIR /app
COPY package-lock.json ./
COPY package.json ./
RUN npm install --ignore-scripts

FROM base AS builder
ARG DEBIAN_FRONTEND=noninteractive
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_KEYCLOAK_URL
ARG NEXT_PUBLIC_KEYCLOAK_REALM
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET

ENV NEXT_PUBLIC_KEYCLOAK_URL=${NEXT_PUBLIC_KEYCLOAK_URL}
ENV NEXT_PUBLIC_KEYCLOAK_REALM=${NEXT_PUBLIC_KEYCLOAK_REALM}
ENV NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=${NEXT_PUBLIC_KEYCLOAK_CLIENT_ID}
ENV NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET=${NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET}

RUN apt-get update && apt-get -qq install ca-certificates --no-install-recommends -y \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ARG APP_ENV=develop
ENV NODE_ENV=production

ENV APP_ENV=${APP_ENV}

RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
