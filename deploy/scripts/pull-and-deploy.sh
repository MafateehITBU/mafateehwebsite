#!/usr/bin/env bash
# Pull latest main from GitHub and deploy. Used by cron and manual runs.
set -euo pipefail

APP_DIR="/opt/mafateehwebsite"
GIT_SSH_COMMAND="ssh -i /root/.ssh/github_deploy -o StrictHostKeyChecking=no -o IdentitiesOnly=yes"

cd "$APP_DIR"

if [[ ! -d .git ]]; then
  echo "Git not initialized. Run: bash deploy/scripts/setup-git-deploy.sh"
  exit 1
fi

export GIT_SSH_COMMAND
git remote -v | grep -q origin || git remote add origin git@github.com:MafateehITBU/mafateehwebsite.git

git fetch origin main
LOCAL="$(git rev-parse HEAD 2>/dev/null || echo none)"
REMOTE="$(git rev-parse origin/main)"

if [[ "$LOCAL" == "$REMOTE" ]]; then
  echo "Already up to date ($REMOTE)"
  exit 0
fi

echo "Updating $LOCAL -> $REMOTE"
git reset --hard origin/main
bash deploy/scripts/deploy.sh
echo "Pull and deploy complete."
