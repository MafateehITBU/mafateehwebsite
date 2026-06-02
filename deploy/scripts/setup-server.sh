#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/mafateehwebsite"
EMAIL="${1:-}"

if [[ -z "$EMAIL" ]]; then
  echo "Usage: bash deploy/scripts/setup-server.sh <certbot-email>"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl git rsync openssh-server

if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi

mkdir -p "$APP_DIR"
mkdir -p "$APP_DIR/deploy/config" "$APP_DIR/deploy/certbot/www" "$APP_DIR/deploy/certbot/conf"

if [[ ! -f "$APP_DIR/deploy/config/backend.env" ]]; then
  cp "$APP_DIR/deploy/config/backend.env.example" "$APP_DIR/deploy/config/backend.env"
fi
if [[ ! -f "$APP_DIR/deploy/config/postgres.env" ]]; then
  cp "$APP_DIR/deploy/config/postgres.env.example" "$APP_DIR/deploy/config/postgres.env"
fi

if [[ ! -f /etc/cron.d/mafateeh-certbot-renew ]]; then
  cat >/etc/cron.d/mafateeh-certbot-renew <<'CRON'
0 3 * * * root cd /opt/mafateehwebsite && docker compose -f deploy/docker-compose.prod.yml run --rm certbot renew --webroot -w /var/www/certbot && docker compose -f deploy/docker-compose.prod.yml exec reverse-proxy nginx -s reload
CRON
fi

echo "Server bootstrap complete."
echo "Next:"
echo "1) Upload project to $APP_DIR (GitHub Actions workflow does this)."
echo "2) Edit $APP_DIR/deploy/config/backend.env and postgres.env."
echo "3) Run bash deploy/scripts/deploy.sh $EMAIL"
