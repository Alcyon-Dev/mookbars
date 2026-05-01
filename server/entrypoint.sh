#!/bin/sh
set -e

rm -f /app/public/index.html

caddy run --config /etc/caddy/Caddyfile &
/app/mookbars
wait
