#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/mafateehwebsite"
EMAIL="${1:-}"
CERT_FILE="deploy/certbot/conf/live/mafateehgroup.com/fullchain.pem"

cd "$APP_DIR"

if [[ ! -f deploy/config/backend.env || ! -f deploy/config/postgres.env ]]; then
  echo "Missing deploy/config/backend.env or deploy/config/postgres.env"
  echo "Copy from *.example and fill production values first."
  exit 1
fi

nginx_apply() {
  local template="$1"
  mkdir -p deploy/nginx/conf.d
  rm -f deploy/nginx/conf.d/*.conf
  cp "deploy/nginx/templates/${template}" deploy/nginx/conf.d/default.conf
}

# Only default.conf is loaded — templates stay outside conf.d.
nginx_apply "acme-bootstrap.conf"
docker compose -f deploy/docker-compose.prod.yml up -d --build

# Apply DB migrations from backend container env.
docker compose -f deploy/docker-compose.prod.yml exec -T backend sh -lc '
  U="${POSTGRES_USER:-postgres}"
  H="${POSTGRES_HOST:-postgres}"
  P="${POSTGRES_PORT:-5432}"
  D="${POSTGRES_DATABASE:-mafateeh}"
  PW_ENC=$(node -e "console.log(encodeURIComponent(process.env.POSTGRES_PASSWORD || \"\"))")
  export DATABASE_URL="postgresql://${U}:${PW_ENC}@${H}:${P}/${D}?schema=public"
  npx prisma migrate deploy
'

if [[ -n "$EMAIL" ]]; then
  docker compose -f deploy/docker-compose.prod.yml run --rm certbot certonly \
    --webroot -w /var/www/certbot \
    -d mafateehgroup.com -d www.mafateehgroup.com \
    -d dashboard.mafateehgroup.com -d www.dashboard.mafateehgroup.com \
    -d api.mafateehgroup.com \
    --email "$EMAIL" --agree-tos --no-eff-email --non-interactive
fi

if [[ -f "$CERT_FILE" ]]; then
  nginx_apply "https.conf"
  docker compose -f deploy/docker-compose.prod.yml up -d
  docker compose -f deploy/docker-compose.prod.yml exec reverse-proxy nginx -s reload
  echo "HTTPS enabled."
else
  echo "SSL certificate not found yet; keeping HTTP-only nginx config."
  echo "Fix port 80 access, then rerun: bash deploy/scripts/deploy.sh $EMAIL"
fi

echo "Deployment complete."
