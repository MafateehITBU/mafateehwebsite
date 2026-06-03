#!/usr/bin/env bash
# Routine deploy: build containers, run migrations, keep HTTPS. No Certbot.
set -euo pipefail

APP_DIR="/opt/mafateehwebsite"
CERT_FILE="deploy/certbot/conf/live/mafateehgroup.com/fullchain.pem"

cd "$APP_DIR"

if [[ ! -f deploy/config/backend.env || ! -f deploy/config/postgres.env ]]; then
  echo "Missing deploy/config/backend.env or deploy/config/postgres.env"
  exit 1
fi

mkdir -p deploy/certbot/www deploy/nginx/conf.d

nginx_apply() {
  local template="$1"
  if [[ ! -f "deploy/nginx/templates/${template}" ]]; then
    echo "Missing nginx template: deploy/nginx/templates/${template}"
    exit 1
  fi
  rm -f deploy/nginx/conf.d/*.conf
  cp "deploy/nginx/templates/${template}" deploy/nginx/conf.d/default.conf
}

wait_for_backend() {
  local i
  for i in $(seq 1 30); do
    if docker compose -f deploy/docker-compose.prod.yml ps backend 2>/dev/null | grep -qE "Up|running"; then
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

if [[ -f "$CERT_FILE" ]]; then
  nginx_apply "https.conf"
else
  echo "SSL certificate missing. Site will use HTTP bootstrap until you run:"
  echo "  bash deploy/scripts/issue-ssl.sh your@email.com"
  nginx_apply "acme-bootstrap.conf"
fi

docker compose -f deploy/docker-compose.prod.yml up -d --build

run_migrations

if [[ -f "$CERT_FILE" ]]; then
  nginx_apply "https.conf"
  docker compose -f deploy/docker-compose.prod.yml up -d reverse-proxy
  docker compose -f deploy/docker-compose.prod.yml exec reverse-proxy nginx -s reload
fi

echo "Deployment complete."
