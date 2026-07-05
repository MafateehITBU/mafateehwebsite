#!/usr/bin/env bash
# One-time: allow github-runner to rsync into /opt/mafateehwebsite and run deploy.sh
set -euo pipefail

APP_DIR="/opt/mafateehwebsite"
RUNNER_USER="github-runner"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: bash deploy/scripts/fix-runner-deploy-perms.sh"
  exit 1
fi

if ! id "$RUNNER_USER" &>/dev/null; then
  echo "Missing user $RUNNER_USER — run setup-github-runner.sh first."
  exit 1
fi

mkdir -p "$APP_DIR"
usermod -aG docker "$RUNNER_USER" 2>/dev/null || true
chown -R "${RUNNER_USER}:${RUNNER_USER}" "$APP_DIR"

echo "OK: $APP_DIR is owned by $RUNNER_USER (docker group enabled)."
echo "Re-run the failed GitHub Actions deploy workflow."
