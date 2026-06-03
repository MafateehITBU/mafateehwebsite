#!/usr/bin/env bash
# Git pull deploy using HTTPS + Personal Access Token (if SSH deploy key is blocked).
set -euo pipefail

APP_DIR="/opt/mafateehwebsite"
TOKEN_FILE="${APP_DIR}/deploy/config/github_token"

if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "Create ${TOKEN_FILE} with a GitHub PAT (repo read access):"
  echo "  https://github.com/settings/tokens"
  echo '  echo "ghp_YOUR_TOKEN" > '"$TOKEN_FILE"
  echo "  chmod 600 $TOKEN_FILE"
  exit 1
fi

TOKEN="$(tr -d '\r\n' < "$TOKEN_FILE")"
REPO_URL="https://${TOKEN}@github.com/MafateehITBU/mafateehwebsite.git"

apt-get update -qq
apt-get install -y -qq git
git config --global --add safe.directory "$APP_DIR"

cd "$APP_DIR"
if [[ ! -d .git ]]; then
  git init
fi
git remote set-url origin "$REPO_URL" 2>/dev/null || git remote add origin "$REPO_URL"
git fetch origin main
git reset --hard origin/main

chmod +x deploy/scripts/*.sh
echo "*/3 * * * * root ${APP_DIR}/deploy/scripts/pull-and-deploy-https.sh >> /var/log/mafateeh-pull-deploy.log 2>&1" > /etc/cron.d/mafateeh-pull-deploy
chmod 644 /etc/cron.d/mafateeh-pull-deploy

echo "HTTPS git deploy enabled. Test: bash deploy/scripts/pull-and-deploy-https.sh"
