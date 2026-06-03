#!/usr/bin/env bash
# One-time: GitHub Actions self-hosted runner (pick up jobs on this VPS).
set -euo pipefail

TOKEN="${1:-}"
REPO="MafateehITBU/mafateehwebsite"
RUNNER_DIR="/opt/actions-runner"
RUNNER_USER="${SUDO_USER:-root}"

if [[ -z "$TOKEN" ]]; then
  echo "Usage: bash deploy/scripts/setup-github-runner.sh <RUNNER_REGISTRATION_TOKEN>"
  echo "Get token: https://github.com/${REPO}/settings/actions/runners/new"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y curl jq libicu-dev

mkdir -p "$RUNNER_DIR"
cd "$RUNNER_DIR"

if [[ ! -f ./config.sh ]]; then
  RUNNER_VERSION="2.334.0"
  curl -fsSL -o actions-runner-linux-x64.tar.gz \
    "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz"
  tar xzf actions-runner-linux-x64.tar.gz
  rm -f actions-runner-linux-x64.tar.gz
fi

./config.sh uninstall --unattended 2>/dev/null || true
./config.sh --url "https://github.com/${REPO}" \
  --token "$TOKEN" \
  --name "srv1719442" \
  --work _work \
  --unattended \
  --replace

./svc.sh install "$RUNNER_USER"
./svc.sh start
./svc.sh status

echo "Runner installed. Verify: https://github.com/${REPO}/settings/actions/runners"
