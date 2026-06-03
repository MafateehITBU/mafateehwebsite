#!/usr/bin/env bash
# One-time (or renewal) SSL issuance — not run on every git push.
set -euo pipefail

APP_DIR="/opt/mafateehwebsite"
EMAIL="${1:-}"

if [[ -z "$EMAIL" ]]; then
  echo "Usage: bash deploy/scripts/issue-ssl.sh your@email.com"
  exit 1
fi

cd "$APP_DIR"
mkdir -p deploy/certbot/www deploy/nginx/conf.d

rm -f deploy/nginx/conf.d/*.conf
cp deploy/nginx/templates/acme-bootstrap.conf deploy/nginx/conf.d/default.conf

docker compose -f deploy/docker-compose.prod.yml up -d reverse-proxy

docker compose -f deploy/docker-compose.prod.yml --profile ssl run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d mafateehgroup.com -d www.mafateehgroup.com \
  -d dashboard.mafateehgroup.com -d www.dashboard.mafateehgroup.com \
  -d api.mafateehgroup.com \
  --email "$EMAIL" --agree-tos --no-eff-email --non-interactive

cp deploy/nginx/templates/https.conf deploy/nginx/conf.d/default.conf
docker compose -f deploy/docker-compose.prod.yml up -d
docker compose -f deploy/docker-compose.prod.yml exec reverse-proxy nginx -s reload

echo "SSL certificate issued and HTTPS enabled."
