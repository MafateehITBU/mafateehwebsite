#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/mafateehwebsite"
TOKEN_FILE="${APP_DIR}/deploy/config/github_token"
cd "$APP_DIR"

if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "Missing $TOKEN_FILE — run setup-git-deploy-https.sh"
  exit 1
fi

TOKEN="$(tr -d '\r\n' < "$TOKEN_FILE")"
git remote set-url origin "https://${TOKEN}@github.com/MafateehITBU/mafateehwebsite.git"

git fetch origin main
LOCAL="$(git rev-parse HEAD 2>/dev/null || echo none)"
REMOTE="$(git rev-parse origin/main)"
if [[ "$LOCAL" == "$REMOTE" ]]; then
  echo "Already up to date"
  exit 0
fi

git reset --hard origin/main
bash deploy/scripts/deploy.sh
