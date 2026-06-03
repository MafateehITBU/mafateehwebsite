#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/mafateehwebsite"
EMAIL="${1:-${PROD_CERTBOT_EMAIL:-}}"
CERT_FILE="deploy/certbot/conf/live/mafateehgroup.com/fullchain.pem"

cd "$APP_DIR"

if [[ ! -f deploy/config/backend.env || ! -f deploy/config/postgres.env ]]; then
  echo "Missing deploy/config/backend.env or deploy/config/postgres.env"
  echo "Copy from *.example and fill production values first."
  exit 1
fi

nginx_apply() {
  local template="$1"
  if [[ ! -f "deploy/nginx/templates/${template}" ]]; then
    echo "Missing nginx template: deploy/nginx/templates/${template}"
    exit 1
  fi
  mkdir -p deploy/nginx/conf.d
  rm -f deploy/nginx/conf.d/*.conf
  cp "deploy/nginx/templates/${template}" deploy/nginx/conf.d/default.conf
}

wait_for_backend() {
  local i
  for i in $(seq 1 30); do
    if docker compose -f deploy/docker-compose.prod.yml ps backend 2>/dev/null | grep -q "Up"; then
      return 0
    fi
    sleep 2
  done
  echo "Backend container did not become ready in time."
  return 1
}

run_migrations() {
  wait_for_backend
  docker compose -f deploy/docker-compose.prod.yml exec -T backend sh -lc '
    U="${POSTGRES_USER:-postgres}"
    H="${POSTGRES_HOST:-postgres}"
    P="${POSTGRES_PORT:-5432}"
    D="${POSTGRES_DATABASE:-mafateeh}"
    PW_ENC=$(node -e "console.log(encodeURIComponent(process.env.POSTGRES_PASSWORD || \"\"))")
    export DATABASE_URL="postgresql://${U}:${PW_ENC}@${H}:${P}/${D}?schema=public"
    npx prisma migrate deploy
  '
}

# Keep HTTPS config when cert already exists (do not downgrade to HTTP-only on routine deploys).
if [[ -f "$CERT_FILE" ]]; then
  nginx_apply "https.conf"
else
  nginx_apply "acme-bootstrap.conf"
fi

docker compose -f deploy/docker-compose.prod.yml up -d --build

run_migrations

if [[ -n "$EMAIL" && ! -f "$CERT_FILE" ]]; then
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
  echo "SSL certificate not found yet; site is on HTTP bootstrap config."
  echo "Run once with email: bash deploy/scripts/deploy.sh your@email.com"
fi

echo "Deployment complete."
