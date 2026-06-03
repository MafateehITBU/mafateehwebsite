#!/usr/bin/env bash
# One-time: git pull deploy from private GitHub (works when GitHub cannot SSH in).
set -euo pipefail

APP_DIR="/opt/mafateehwebsite"
KEY="/root/.ssh/github_deploy"
REPO="git@github.com:MafateehITBU/mafateehwebsite.git"

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y git

git config --global --add safe.directory "$APP_DIR"

if [[ ! -f "$KEY" ]]; then
  ssh-keygen -t ed25519 -C "mafateeh-vps-deploy" -f "$KEY" -N ""
  chmod 600 "$KEY"
fi

echo ""
echo "=== Add this Deploy Key to GitHub (read-only) ==="
echo "https://github.com/MafateehITBU/mafateehwebsite/settings/keys/new"
echo ""
cat "${KEY}.pub"
echo ""

export GIT_SSH_COMMAND="ssh -i $KEY -o StrictHostKeyChecking=no -o IdentitiesOnly=yes"

cd "$APP_DIR"
chmod +x deploy/scripts/*.sh

if [[ ! -d .git ]]; then
  git init
  git remote add origin "$REPO" 2>/dev/null || git remote set-url origin "$REPO"
fi

if git fetch origin main 2>/dev/null; then
  git checkout -B main origin/main 2>/dev/null || git reset --hard origin/main
  CRON_LINE="*/3 * * * * root ${APP_DIR}/deploy/scripts/pull-and-deploy.sh >> /var/log/mafateeh-pull-deploy.log 2>&1"
  echo "$CRON_LINE" > /etc/cron.d/mafateeh-pull-deploy
  chmod 644 /etc/cron.d/mafateeh-pull-deploy
  echo "Git auto-pull enabled (every 3 min). Test: bash deploy/scripts/pull-and-deploy.sh"
else
  echo "Git fetch failed — add the deploy key above to GitHub, then run:"
  echo "  bash deploy/scripts/setup-git-deploy.sh"
fi
