#!/usr/bin/env bash
# One-time: GitHub Actions self-hosted runner (pick up jobs on this VPS).
set -euo pipefail

TOKEN="${1:-}"
REPO="MafateehITBU/mafateehwebsite"
RUNNER_DIR="/opt/actions-runner"
RUNNER_USER="github-runner"
RUNNER_VERSION="2.334.0"

if [[ -z "$TOKEN" ]]; then
  echo "Usage: bash deploy/scripts/setup-github-runner.sh <RUNNER_REGISTRATION_TOKEN>"
  echo "Get token: https://github.com/${REPO}/settings/actions/runners/new"
  exit 1
fi

if [[ -n "${SUDO_USER:-}" ]]; then
  echo "Run this script as root directly (ssh root@server), not with sudo."
  exit 1
fi

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: bash deploy/scripts/setup-github-runner.sh <TOKEN>"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y curl jq libicu-dev

if ! id "$RUNNER_USER" &>/dev/null; then
  useradd -m -s /bin/bash "$RUNNER_USER"
fi

# Deploy workflow runs docker compose — runner user needs access.
usermod -aG docker "$RUNNER_USER" 2>/dev/null || true

mkdir -p "$RUNNER_DIR"
cd "$RUNNER_DIR"

if [[ ! -f ./config.sh ]]; then
  curl -fsSL -o actions-runner-linux-x64.tar.gz \
    "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz"
  tar xzf actions-runner-linux-x64.tar.gz
  rm -f actions-runner-linux-x64.tar.gz
fi

chown -R "${RUNNER_USER}:${RUNNER_USER}" "$RUNNER_DIR"

runuser -u "$RUNNER_USER" -- bash -c "
  set -euo pipefail
  cd '$RUNNER_DIR'
  ./config.sh uninstall --unattended 2>/dev/null || true
  ./config.sh --url 'https://github.com/${REPO}' \
    --token '$TOKEN' \
    --name 'srv1719442' \
    --work _work \
    --unattended \
    --replace
"

./svc.sh install "$RUNNER_USER"
./svc.sh start
./svc.sh status

echo "Runner installed. Verify: https://github.com/${REPO}/settings/actions/runners"
