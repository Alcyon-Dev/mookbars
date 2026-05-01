FROM node:22-alpine AS assets-build

WORKDIR /app/assets/scripts

COPY ./assets/scripts/package.json .
RUN npm install

COPY ./assets/ /app/assets/
RUN node build.js



FROM denoland/deno:alpine-2.7.14 AS deno-build

WORKDIR /app/src

ARG MB_VERSION=dev

COPY ./src/ /app/src/
RUN deno install
RUN echo "export const version = \"${MB_VERSION}\";" > /app/src/version.ts

COPY ./template/ /app/template/
COPY --from=assets-build /app/template/assets/ /app/template/assets/
RUN mkdir -p /app/public && mkdir -p /app/dist

RUN deno task run
RUN deno task build



FROM debian:bookworm-slim

COPY --from=caddy:2-alpine /usr/bin/caddy /usr/bin/caddy

WORKDIR /app/src

COPY ./server/Caddyfile /etc/caddy/Caddyfile
COPY ./server/entrypoint.sh /entrypoint.sh
COPY ./template/ /app/template/
COPY --from=assets-build /app/template/assets/ /app/template/assets/
COPY --from=deno-build /app/dist/mookbars /app/mookbars
COPY --from=deno-build /app/public/ /app/public/

RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
