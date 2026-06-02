#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/mafateehwebsite"
EMAIL="${1:-}"

cd "$APP_DIR"

if [[ ! -f deploy/config/backend.env || ! -f deploy/config/postgres.env ]]; then
  echo "Missing deploy/config/backend.env or deploy/config/postgres.env"
  echo "Copy from *.example and fill production values first."
  exit 1
fi

# Start HTTP-only mode first to satisfy ACME challenge.
cp deploy/nginx/conf.d/http-only.conf deploy/nginx/conf.d/default.conf
docker compose -f deploy/docker-compose.prod.yml up -d --build reverse-proxy

if [[ -n "$EMAIL" ]]; then
  docker compose -f deploy/docker-compose.prod.yml run --rm certbot certonly \
    --webroot -w /var/www/certbot \
    -d mafateehgroup.com -d www.mafateehgroup.com \
    -d dashboard.mafateehgroup.com -d www.dashboard.mafateehgroup.com \
    -d api.mafateehgroup.com \
    --email "$EMAIL" --agree-tos --no-eff-email
fi

# Enable HTTPS config after certs are present.
cp deploy/nginx/conf.d/https.conf deploy/nginx/conf.d/default.conf
docker compose -f deploy/docker-compose.prod.yml up -d --build
docker compose -f deploy/docker-compose.prod.yml exec reverse-proxy nginx -s reload

echo "Deployment complete."
